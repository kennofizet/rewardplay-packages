<?php

namespace Kennofizet\RewardPlay\Commands;

use Illuminate\Console\Command;
use Kennofizet\RewardPlay\Traits\GlobalDataTrait;
use Kennofizet\RewardPlay\Traits\SettingRewardPlay;
use Kennofizet\RewardPlay\Traits\ManagesZonesRewardPlay;
use Kennofizet\RewardPlay\Models\Zone;
use Kennofizet\RewardPlay\Models\SettingItem;
use Kennofizet\RewardPlay\Models\SettingItem\SettingItemConstant;
use Kennofizet\RewardPlay\Models\SettingOption;
use Kennofizet\RewardPlay\Models\SettingItemSet;
use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;
use Illuminate\Support\Facades\File;
use Illuminate\Http\Request;

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

        // When server_id column is not configured, queries use server_id = null (no server required)
        if (!$this->hasServerIdConfig()) {
            $this->line('Server ID column is not configured. Zones with server_id = null will be used.');
            $this->newLine();
        }

        // Main menu loop
        while (true) {
            $this->displayMainMenu();
            $menuOptions = [
                'Select Server',
                'Manage Zones',
                'Manage Server Managers',
                'Show Current Selection',
            ];
            
            // Add fake data option when zone is selected (and server too if config requires it)
            if ($this->currentZoneId && ($this->currentServerId !== null || !$this->hasServerIdConfig())) {
                $menuOptions[] = 'Generate Fake Data';
            }
            
            $menuOptions[] = 'Exit';
            
            $choice = $this->choice('Select an option', $menuOptions, count($menuOptions) - 1);

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
                case 'Generate Fake Data':
                    $this->generateFakeData();
                    break;
                case 'Exit':
                    $this->info('Goodbye!');
                    return Command::SUCCESS;
            }

            $this->newLine();
        }
    }

    /**
     * Whether the app has server_id column configured (user_server_id_column).
     * When true, user must select a server before Manage Zones / Manage Server Managers.
     * When false, queries use server_id = null (zones where server_id IS NULL).
     */
    protected function hasServerIdConfig(): bool
    {
        return !empty(config('rewardplay.user_server_id_column'));
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
     * Command is for root admin only - no permission checks
     */
    protected function selectServer()
    {
        $this->info('--- Select Server ---');

        if (!$this->hasServerIdConfig()) {
            $this->currentServerId = null;
            $this->line('Server ID column is not configured. Queries will use server_id = null.');
            $this->line('Use "Manage Zones" to work with zones that have no server.');
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
     * Command is for root admin only - no permission checks
     */
    protected function manageZones()
    {
        if ($this->hasServerIdConfig() && !$this->currentServerId) {
            $this->error('Please select a server first!');
            return;
        }

        while (true) {
            $this->info('--- Zone Management (Server: ' . ($this->currentServerId ?? 'null') . ') ---');
            
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
                $this->warn('No zones found for server ' . ($this->currentServerId !== null ? 'ID: ' . $this->currentServerId : 'null') . '.');
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
                'server_id' => $this->currentServerId, // null when no server config or not selected
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
                $this->warn('No zones found for server ' . ($this->currentServerId !== null ? 'ID: ' . $this->currentServerId : 'null') . '.');
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
     * Command is for root admin only - no permission checks
     */
    protected function manageServerManagers()
    {
        if ($this->hasServerIdConfig() && !$this->currentServerId) {
            $this->error('Please select a server first!');
            return;
        }

        while (true) {
            $this->info('--- Server Manager Management (Server: ' . ($this->currentServerId ?? 'null') . ') ---');
            
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
                $this->warn('No managers found for server ' . ($this->currentServerId !== null ? 'ID: ' . $this->currentServerId : 'null') . '.');
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

        $this->line('Server ID: ' . ($this->currentServerId !== null ? $this->currentServerId : 'null (not selected)'));
        $zones = $this->zonesQueryForCurrentServer()->get();
        $this->line('Zones in this server: ' . $zones->count());
        $managers = $this->getServerManagersByServer($this->currentServerId);
        $this->line('Managers for this server: ' . $managers->count());
        
        if ($this->currentZoneId) {
            $zone = Zone::findById($this->currentZoneId);
            $this->line('Zone: ' . ($zone ? $zone->name : 'ID ' . $this->currentZoneId));
        } else {
            $this->line('Zone: Not selected');
        }
    }

    /**
     * Generate fake data for the selected zone
     */
    protected function generateFakeData()
    {
        if ($this->hasServerIdConfig() && !$this->currentServerId) {
            $this->error('Please select a server first!');
            return;
        }
        if (!$this->currentZoneId) {
            $this->error('Please select a zone first!');
            return;
        }

        $this->info('--- Generate Fake Data ---');
        $this->warn('This will create demo data for the selected zone.');
        
        if (!$this->confirm('Are you sure you want to generate fake data?', false)) {
            $this->info('Cancelled.');
            return;
        }

        // Set zone_id in request attributes so BaseModel can auto-populate
        $request = Request::create('/', 'GET');
        $request->attributes->set('rewardplay_user_zone_id_current', $this->currentZoneId);
        app()->instance('request', $request);

        try {
            $this->info('Generating fake data...');
            $this->newLine();

            // Load image manifest
            $imageManifest = $this->loadImageManifest();
            
            // Generate setting options (needed before items for custom options)
            $this->info('Creating setting options...');
            $customOptions = $this->generateSettingOptions();
            $this->info('✓ Created ' . count($customOptions) . ' setting options');
            $this->newLine();

            // Generate items
            $this->info('Creating items...');
            $itemsByType = $this->generateItems($imageManifest, $customOptions);
            $this->info('✓ Created ' . array_sum(array_map('count', $itemsByType)) . ' items');
            $this->newLine();

            // Generate item sets
            $this->info('Creating item sets...');
            $setsCount = $this->generateItemSets($itemsByType, $customOptions);
            $this->info('✓ Created ' . $setsCount . ' item sets');
            $this->newLine();

            $this->info('✓ Fake data generation completed successfully!');
        } catch (\Exception $e) {
            $this->error('✗ Error generating fake data: ' . $e->getMessage());
            $this->error($e->getTraceAsString());
        }
    }

    /**
     * Load image manifest
     */
    protected function loadImageManifest(): array
    {
        $imagesFolder = config('rewardplay.images_folder', 'rewardplay-images');
        $manifestPath = public_path($imagesFolder . '/image-manifest.json');
        
        if (!File::exists($manifestPath)) {
            $this->warn('Image manifest not found, using default images');
            return [];
        }

        $manifest = json_decode(File::get($manifestPath), true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->warn('Failed to parse image manifest, using default images');
            return [];
        }

        // Convert to full URLs
        $manifestWithUrls = [];
        foreach ($manifest as $key => $value) {
            $fullPath = $imagesFolder . '/' . ltrim($value, '/');
            $manifestWithUrls[$key] = $fullPath;
        }

        return $manifestWithUrls;
    }

    /**
     * Generate items for each type
     */
    protected function generateItems(array $imageManifest, array $customOptions = []): array
    {
        $itemsByType = [];
        $itemTiers = ['newbie', 'beginner', 'intermediate', 'advanced', 'expert', 'master', 'elite', 'legendary', 'mythic', 'challenged'];
        
        // Map item types to image keys from manifest
        $typeImageMap = [
            SettingItemConstant::ITEM_TYPE_SWORD => 'bag.sword',
            SettingItemConstant::ITEM_TYPE_HAT => 'bag.hat',
            SettingItemConstant::ITEM_TYPE_SHIRT => 'bag.shirt',
            SettingItemConstant::ITEM_TYPE_TROUSER => 'bag.trouser',
            SettingItemConstant::ITEM_TYPE_SHOE => 'bag.shoe',
            SettingItemConstant::ITEM_TYPE_NECKLACE => 'bag.necklace',
            SettingItemConstant::ITEM_TYPE_BRACELET => 'bag.bracelet',
            SettingItemConstant::ITEM_TYPE_RING => 'bag.ring',
            SettingItemConstant::ITEM_TYPE_CLOTHES => 'bag.clothes',
            SettingItemConstant::ITEM_TYPE_WING => 'bag.wing',
        ];

        $conversionKeys = array_keys(HelperConstant::CONVERSION_KEYS);

        foreach (SettingItemConstant::ITEM_TYPE_NAMES as $type => $typeName) {
            $itemsByType[$type] = [];
            $imageKey = $typeImageMap[$type] ?? 'bag.sword';
            $imageUrl = $imageManifest[$imageKey] ?? null;
            
            // Fallback: try to find any bag image if specific one not found
            if (!$imageUrl && !empty($imageManifest)) {
                foreach ($imageManifest as $key => $url) {
                    if (strpos($key, 'bag.') === 0) {
                        $imageUrl = $url;
                        break;
                    }
                }
            }

            for ($i = 0; $i < 10; $i++) {
                $tier = $itemTiers[$i];
                $itemName = ucfirst($tier) . ' ' . $typeName;
                
                // Generate default_property with random stats
                $defaultProperty = [];
                $numStats = rand(3, 6); // 3-6 random stats per item
                $numStats = min($numStats, count($conversionKeys));
                
                // Get random keys from conversion keys
                if ($numStats == 1) {
                    $selectedKeys = [array_rand($conversionKeys, 1)];
                } else {
                    $selectedKeys = (array)array_rand($conversionKeys, $numStats);
                }
                
                foreach ($selectedKeys as $keyIndex) {
                    $statKey = $conversionKeys[$keyIndex];
                    // Higher tier = higher values
                    $baseValue = ($i + 1) * 100;
                    $randomFactor = rand(80, 120) / 100; // ±20% variation
                    $defaultProperty[$statKey] = (int)($baseValue * $randomFactor);
                }

                // Add custom options to wing and clothes items (using custom_stats format)
                $customStats = [];
                if ((SettingItemConstant::isWing($type) || SettingItemConstant::isClothes($type)) && !empty($customOptions)) {
                    // Add 1-2 custom options to these item types
                    $numCustom = min(rand(1, 2), count($customOptions));
                    if ($numCustom == 1) {
                        $selectedCustomIndices = [array_rand($customOptions, 1)];
                    } else {
                        $selectedCustomIndices = (array)array_rand($customOptions, $numCustom);
                    }
                    
                    foreach ($selectedCustomIndices as $idx) {
                        $customOption = $customOptions[$idx];
                        // Add to custom_stats array with name and properties
                        $customStats[] = [
                            'name' => $customOption->name,
                            'properties' => $customOption->rates,
                        ];
                    }
                }

                // Create item
                $item = SettingItem::create([
                    'name' => $itemName,
                    'description' => "A {$tier} tier {$typeName} item",
                    'type' => $type,
                    'default_property' => $defaultProperty,
                    'custom_stats' => !empty($customStats) ? $customStats : null,
                    'image' => $imageUrl,
                    'zone_id' => $this->currentZoneId,
                ]);

                $itemsByType[$type][] = $item;
            }
        }

        return $itemsByType;
    }

    /**
     * Generate setting options with custom names
     */
    protected function generateSettingOptions(): array
    {
        $customOptionNames = ['beautiful', 'student', 'director', 'cool', 'awesome', 'epic', 'legendary', 'mystic'];
        $conversionKeys = array_keys(HelperConstant::CONVERSION_KEYS);
        $options = [];

        foreach ($customOptionNames as $optionName) {
            // Generate rates with 2-4 random conversion keys
            $rates = [];
            $numRates = rand(2, 4);
            $numRates = min($numRates, count($conversionKeys));
            
            // Get random keys from conversion keys
            if ($numRates == 1) {
                $selectedKeyIndices = [array_rand($conversionKeys, 1)];
            } else {
                $selectedKeyIndices = (array)array_rand($conversionKeys, $numRates);
            }

            foreach ($selectedKeyIndices as $keyIndex) {
                $key = $conversionKeys[$keyIndex];
                $rates[$key] = rand(10, 100); // Random value between 10-100
            }

            $option = SettingOption::create([
                'name' => $optionName,
                'rates' => $rates,
                'zone_id' => $this->currentZoneId,
            ]);

            $options[] = $option;
        }

        return $options;
    }

    /**
     * Generate item sets with bonuses
     */
    protected function generateItemSets(array $itemsByType, array $customOptions): int
    {
        $setsCount = 0;
        $conversionKeys = array_keys(HelperConstant::CONVERSION_KEYS);

        foreach ($itemsByType as $type => $items) {
            if (count($items) < 10) {
                continue; // Skip if not enough items
            }

            $itemIds = array_map(fn($item) => $item->id, $items);
            $setName = ucfirst($type) . ' Set';
            
            // Generate set bonuses for 2, 5, 8, and full
            $setBonuses = [];
            
            // Bonus at 2 items
            $bonus2 = [];
            $numStats2 = min(rand(2, 3), count($conversionKeys));
            if ($numStats2 == 1) {
                $selectedIndices2 = [array_rand($conversionKeys, 1)];
            } else {
                $selectedIndices2 = (array)array_rand($conversionKeys, $numStats2);
            }
            foreach ($selectedIndices2 as $idx) {
                $stat = $conversionKeys[$idx];
                $bonus2[$stat] = rand(50, 150);
            }
            $setBonuses['2'] = $bonus2;

            // Bonus at 5 items
            $bonus5 = [];
            $numStats5 = min(rand(3, 4), count($conversionKeys));
            if ($numStats5 == 1) {
                $selectedIndices5 = [array_rand($conversionKeys, 1)];
            } else {
                $selectedIndices5 = (array)array_rand($conversionKeys, $numStats5);
            }
            foreach ($selectedIndices5 as $idx) {
                $stat = $conversionKeys[$idx];
                $bonus5[$stat] = rand(150, 300);
            }
            $setBonuses['5'] = $bonus5;

            // Bonus at 8 items
            $bonus8 = [];
            $numStats8 = min(rand(4, 5), count($conversionKeys));
            if ($numStats8 == 1) {
                $selectedIndices8 = [array_rand($conversionKeys, 1)];
            } else {
                $selectedIndices8 = (array)array_rand($conversionKeys, $numStats8);
            }
            foreach ($selectedIndices8 as $idx) {
                $stat = $conversionKeys[$idx];
                $bonus8[$stat] = rand(300, 500);
            }
            $setBonuses['8'] = $bonus8;

            // Full set bonus (only regular CONVERSION_KEYS)
            $bonusFull = [];
            $numStatsFull = min(rand(5, 7), count($conversionKeys));
            if ($numStatsFull == 1) {
                $selectedIndicesFull = [array_rand($conversionKeys, 1)];
            } else {
                $selectedIndicesFull = (array)array_rand($conversionKeys, $numStatsFull);
            }
            foreach ($selectedIndicesFull as $idx) {
                $stat = $conversionKeys[$idx];
                $bonusFull[$stat] = rand(500, 1000);
            }
            
            $setBonuses['full'] = $bonusFull;

            // Add custom_stats for item set (structured by level, same as set_bonuses)
            $customStats = [];
            if (!empty($customOptions)) {
                // Add custom stats to some levels (2, 5, 8, full)
                $levelsToAddCustom = ['2', '5', '8', 'full'];
                
                foreach ($levelsToAddCustom as $level) {
                    // Randomly decide if this level should have custom stats (50% chance)
                    if (rand(0, 1) === 1) {
                        $numCustom = min(rand(1, 2), count($customOptions));
                        if ($numCustom == 1) {
                            $selectedCustomIndices = [array_rand($customOptions, 1)];
                        } else {
                            $selectedCustomIndices = (array)array_rand($customOptions, $numCustom);
                        }
                        
                        $levelCustomStats = [];
                        foreach ($selectedCustomIndices as $idx) {
                            $customOption = $customOptions[$idx];
                            // Add to custom_stats array with name and properties
                            $levelCustomStats[] = [
                                'name' => $customOption->name,
                                'properties' => $customOption->rates,
                            ];
                        }
                        
                        if (!empty($levelCustomStats)) {
                            $customStats[$level] = $levelCustomStats;
                        }
                    }
                }
            }

            // Create item set
            $set = SettingItemSet::create([
                'name' => $setName,
                'description' => "Complete set of {$type} items with progressive bonuses",
                'set_bonuses' => $setBonuses,
                'custom_stats' => !empty($customStats) ? $customStats : null,
                'zone_id' => $this->currentZoneId,
            ]);

            // Attach all items to the set
            $set->items()->sync($itemIds);
            
            $setsCount++;
        }

        return $setsCount;
    }
}
