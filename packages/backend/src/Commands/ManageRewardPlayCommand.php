<?php

namespace Kennofizet\RewardPlay\Commands;

use Illuminate\Console\Command;
use Kennofizet\RewardPlay\Traits\GlobalDataTrait;
use Kennofizet\RewardPlay\Traits\SettingRewardPlay;
use Kennofizet\RewardPlay\Traits\ManagesZonesRewardPlay;
use Kennofizet\RewardPlay\Models\Zone;

class ManageRewardPlayCommand extends Command
{
    use GlobalDataTrait, SettingRewardPlay, ManagesZonesRewardPlay;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'rewardplay:manage';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Interactive command to manage RewardPlay zones and server managers using all traits';

    /**
     * Current selected server ID
     */
    protected $currentServerId = null;

    /**
     * Current selected zone ID
     */
    protected $currentZoneId = null;

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('=== RewardPlay Management Console ===');
        $this->newLine();

        // Check if server_id column is configured
        $serverColumn = config('rewardplay.user_server_id_column');
        if (empty($serverColumn)) {
            $this->warn('Server ID column is not configured. Some features may be limited.');
            $this->newLine();
        }

        // Main menu loop
        while (true) {
            $this->displayMainMenu();
            $choice = $this->choice('Select an option', [
                'Select Server',
                'Manage Zones',
                'Manage Server Managers',
                'Show Current Selection',
                'Exit'
            ], 4);

            switch ($choice) {
                case 'Select Server':
                    $this->selectServer();
                    break;
                case 'Manage Zones':
                    $this->manageZones();
                    break;
                case 'Manage Server Managers':
                    $this->manageServerManagers();
                    break;
                case 'Show Current Selection':
                    $this->showCurrentSelection();
                    break;
                case 'Exit':
                    $this->info('Goodbye!');
                    return Command::SUCCESS;
            }

            $this->newLine();
        }
    }

    /**
     * Display main menu
     */
    protected function displayMainMenu()
    {
        $this->info('--- Main Menu ---');
        if ($this->currentServerId) {
            $this->line('Current Server ID: ' . $this->currentServerId);
        } else {
            $this->line('Current Server ID: Not selected');
        }
        if ($this->currentZoneId) {
            $zone = Zone::findById($this->currentZoneId);
            $this->line('Current Zone: ' . ($zone ? $zone->name : 'ID ' . $this->currentZoneId));
        } else {
            $this->line('Current Zone: Not selected');
        }
        $this->newLine();
    }

    /**
     * Select server
     */
    protected function selectServer()
    {
        $this->info('--- Select Server ---');
        
        $serverColumn = config('rewardplay.user_server_id_column');
        if (empty($serverColumn)) {
            $this->error('Server ID column is not configured in config/rewardplay.php');
            $this->line('Please set REWARDPLAY_USER_SERVER_ID_COLUMN in your .env file');
            return;
        }

        // Get unique server IDs from zones (without global scopes to see all servers)
        $serverIds = Zone::withoutGlobalScopes()
            ->distinct()
            ->whereNotNull('server_id')
            ->pluck('server_id')
            ->toArray();

        if (empty($serverIds)) {
            $this->warn('No servers found in zones table.');
            $this->line('You can manually enter a server ID or create zones first.');
            
            $manualServerId = $this->ask('Enter server ID manually (or press Enter to skip)', null);
            if ($manualServerId) {
                $this->currentServerId = (int)$manualServerId;
                $this->info('Server ID set to: ' . $this->currentServerId);
            }
            return;
        }

        $this->line('Available Servers:');
        $options = [];
        foreach ($serverIds as $index => $serverId) {
            $zoneCount = Zone::withoutGlobalScopes()->byServerId($serverId)->count();
            $options[] = "Server ID: {$serverId} ({$zoneCount} zone(s))";
        }
        $options[] = 'Cancel';

        $selected = $this->choice('Select a server', $options, count($options) - 1);
        
        if ($selected === 'Cancel') {
            return;
        }

        $selectedIndex = array_search($selected, $options);
        $this->currentServerId = $serverIds[$selectedIndex];
        $this->info('Selected Server ID: ' . $this->currentServerId);
        $this->currentZoneId = null; // Reset zone selection when server changes
    }

    /**
     * Manage zones menu
     */
    protected function manageZones()
    {
        if (!$this->currentServerId) {
            $this->error('Please select a server first!');
            return;
        }

        while (true) {
            $this->info('--- Zone Management (Server: ' . $this->currentServerId . ') ---');
            
            $choice = $this->choice('Select an option', [
                'List Zones',
                'Create Zone',
                'Select Zone',
                'Edit Zone',
                'Delete Zone',
                'Back to Main Menu'
            ], 5);

            switch ($choice) {
                case 'List Zones':
                    $this->listZones();
                    break;
                case 'Create Zone':
                    $this->createZoneAction();
                    break;
                case 'Select Zone':
                    $this->selectZone();
                    break;
                case 'Edit Zone':
                    $this->editZoneAction();
                    break;
                case 'Delete Zone':
                    $this->deleteZoneAction();
                    break;
                case 'Back to Main Menu':
                    return;
            }

            $this->newLine();
        }
    }

    /**
     * List zones for current server
     */
    protected function listZones()
    {
        $this->info('--- Zones List ---');
        
        try {
            $zones = Zone::byServerId($this->currentServerId)->get();
            
            if ($zones->isEmpty()) {
                $this->warn('No zones found for server ID: ' . $this->currentServerId);
                return;
            }

            $this->table(
                ['ID', 'Name', 'Server ID', 'Created At'],
                $zones->map(function($zone) {
                    return [
                        $zone->id,
                        $zone->name,
                        $zone->server_id ?? 'N/A',
                        $zone->created_at ? $zone->created_at->format('Y-m-d H:i:s') : 'N/A'
                    ];
                })->toArray()
            );
        } catch (\Exception $e) {
            $this->error('Error listing zones: ' . $e->getMessage());
        }
    }

    /**
     * Create a new zone
     */
    protected function createZoneAction()
    {
        $this->info('--- Create Zone ---');
        
        $name = $this->ask('Zone name');
        if (empty($name)) {
            $this->error('Zone name is required!');
            return;
        }

        try {
            $zoneData = [
                'name' => $name,
                'server_id' => $this->currentServerId,
            ];

            $zone = $this->createZone($zoneData);
            $this->info('✓ Zone created successfully!');
            $this->line('  ID: ' . $zone->id);
            $this->line('  Name: ' . $zone->name);
            $this->line('  Server ID: ' . $zone->server_id);
        } catch (\Exception $e) {
            $this->error('✗ Failed to create zone: ' . $e->getMessage());
        }
    }

    /**
     * Select a zone
     */
    protected function selectZone()
    {
        $this->info('--- Select Zone ---');
        
        try {
            $zones = Zone::byServerId($this->currentServerId)->get();
            
            if ($zones->isEmpty()) {
                $this->warn('No zones found for server ID: ' . $this->currentServerId);
                return;
            }

            $options = [];
            $zoneMap = [];
            foreach ($zones as $zone) {
                $optionText = $zone->name . ' (ID: ' . $zone->id . ')';
                $options[] = $optionText;
                $zoneMap[$optionText] = $zone->id;
            }
            $options[] = 'Cancel';

            $selected = $this->choice('Select a zone', $options, count($options) - 1);
            
            if ($selected === 'Cancel') {
                return;
            }

            $this->currentZoneId = $zoneMap[$selected];
            $zone = Zone::findById($this->currentZoneId);
            $this->info('Selected Zone: ' . ($zone ? $zone->name : 'ID ' . $this->currentZoneId));
        } catch (\Exception $e) {
            $this->error('Error selecting zone: ' . $e->getMessage());
        }
    }

    /**
     * Edit a zone
     */
    protected function editZoneAction()
    {
        if (!$this->currentZoneId) {
            $this->error('Please select a zone first!');
            return;
        }

        $this->info('--- Edit Zone ---');
        
        $zone = Zone::findById($this->currentZoneId);
        if (!$zone) {
            $this->error('Zone not found!');
            return;
        }

        $this->line('Current zone: ' . $zone->name);
        $newName = $this->ask('New zone name (or press Enter to keep current)', $zone->name);

        try {
            $zoneData = [
                'name' => $newName ?: $zone->name,
            ];

            $updatedZone = $this->editZone($this->currentZoneId, $zoneData);
            $this->info('✓ Zone updated successfully!');
            $this->line('  Name: ' . $updatedZone->name);
        } catch (\Exception $e) {
            $this->error('✗ Failed to update zone: ' . $e->getMessage());
        }
    }

    /**
     * Delete a zone
     */
    protected function deleteZoneAction()
    {
        if (!$this->currentZoneId) {
            $this->error('Please select a zone first!');
            return;
        }

        $zone = Zone::findById($this->currentZoneId);
        if (!$zone) {
            $this->error('Zone not found!');
            return;
        }

        $this->info('--- Delete Zone ---');
        $this->line('Zone: ' . $zone->name . ' (ID: ' . $zone->id . ')');
        
        if (!$this->confirm('Are you sure you want to delete this zone?', false)) {
            $this->info('Deletion cancelled.');
            return;
        }

        try {
            $this->deleteZone($this->currentZoneId);
            $this->info('✓ Zone deleted successfully!');
            $this->currentZoneId = null; // Reset selection
        } catch (\Exception $e) {
            $this->error('✗ Failed to delete zone: ' . $e->getMessage());
        }
    }

    /**
     * Manage server managers menu
     */
    protected function manageServerManagers()
    {
        if (!$this->currentServerId) {
            $this->error('Please select a server first!');
            return;
        }

        while (true) {
            $this->info('--- Server Manager Management (Server: ' . $this->currentServerId . ') ---');
            
            $choice = $this->choice('Select an option', [
                'List Managers',
                'Add Manager',
                'Remove Manager',
                'Back to Main Menu'
            ], 3);

            switch ($choice) {
                case 'List Managers':
                    $this->listServerManagers();
                    break;
                case 'Add Manager':
                    $this->addServerManager();
                    break;
                case 'Remove Manager':
                    $this->removeServerManager();
                    break;
                case 'Back to Main Menu':
                    return;
            }

            $this->newLine();
        }
    }

    /**
     * List server managers
     */
    protected function listServerManagers()
    {
        $this->info('--- Server Managers List ---');
        
        try {
            $managers = $this->getServerManagersByServer($this->currentServerId);
            
            if ($managers->isEmpty()) {
                $this->warn('No managers found for server ID: ' . $this->currentServerId);
                return;
            }

            $this->table(
                ['ID', 'User ID', 'Server ID', 'Created At'],
                $managers->map(function($manager) {
                    return [
                        $manager->id,
                        $manager->user_id,
                        $manager->server_id,
                        $manager->created_at ? $manager->created_at->format('Y-m-d H:i:s') : 'N/A'
                    ];
                })->toArray()
            );
        } catch (\Exception $e) {
            $this->error('Error listing server managers: ' . $e->getMessage());
        }
    }

    /**
     * Add a server manager
     */
    protected function addServerManager()
    {
        $this->info('--- Add Server Manager ---');
        
        $userId = $this->ask('User ID');
        if (empty($userId) || !is_numeric($userId)) {
            $this->error('Valid user ID is required!');
            return;
        }

        try {
            $data = [
                'user_id' => (int)$userId,
                'server_id' => $this->currentServerId,
            ];

            $manager = $this->createServerManager($data);
            $this->info('✓ Manager added successfully!');
            $this->line('  Manager ID: ' . $manager->id);
            $this->line('  User ID: ' . $manager->user_id);
            $this->line('  Server ID: ' . $manager->server_id);
        } catch (\Exception $e) {
            $this->error('✗ Failed to add manager: ' . $e->getMessage());
        }
    }

    /**
     * Remove a server manager
     */
    protected function removeServerManager()
    {
        $this->info('--- Remove Server Manager ---');
        
        try {
            $managers = $this->getServerManagersByServer($this->currentServerId);
            
            if ($managers->isEmpty()) {
                $this->warn('No managers found for server ID: ' . $this->currentServerId);
                return;
            }

            $options = [];
            $managerMap = [];
            foreach ($managers as $manager) {
                $optionText = 'User ID: ' . $manager->user_id . ' (Manager ID: ' . $manager->id . ')';
                $options[] = $optionText;
                $managerMap[$optionText] = $manager->user_id;
            }
            $options[] = 'Cancel';

            $selected = $this->choice('Select manager to remove', $options, count($options) - 1);
            
            if ($selected === 'Cancel') {
                return;
            }

            $userId = (int)$managerMap[$selected];
            
            if (!$this->confirm('Are you sure you want to remove this manager?', false)) {
                $this->info('Removal cancelled.');
                return;
            }

            $data = [
                'user_id' => $userId,
                'server_id' => $this->currentServerId,
            ];

            $this->deleteServerManager($data);
            $this->info('✓ Manager removed successfully!');
        } catch (\Exception $e) {
            $this->error('✗ Failed to remove manager: ' . $e->getMessage());
        }
    }

    /**
     * Show current selection
     */
    protected function showCurrentSelection()
    {
        $this->info('--- Current Selection ---');
        
        if ($this->currentServerId) {
            $this->line('Server ID: ' . $this->currentServerId);
            
            // Show zones for this server
            $zones = Zone::byServerId($this->currentServerId)->get();
            $this->line('Zones in this server: ' . $zones->count());
            
            // Show managers for this server
            $managers = $this->getServerManagersByServer($this->currentServerId);
            $this->line('Managers for this server: ' . $managers->count());
        } else {
            $this->line('Server ID: Not selected');
        }
        
        if ($this->currentZoneId) {
            $zone = Zone::findById($this->currentZoneId);
            $this->line('Zone: ' . ($zone ? $zone->name : 'ID ' . $this->currentZoneId));
        } else {
            $this->line('Zone: Not selected');
        }
    }
}
