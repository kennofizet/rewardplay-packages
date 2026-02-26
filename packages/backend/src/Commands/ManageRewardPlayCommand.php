<?php

namespace Kennofizet\RewardPlay\Commands;

use Illuminate\Console\Command;
use Kennofizet\PackagesCore\Traits\GlobalDataTrait;
use Kennofizet\PackagesCore\Traits\SettingRewardPlay;
use Kennofizet\PackagesCore\Traits\ManagesZonesRewardPlay;
use Kennofizet\PackagesCore\Models\Zone;
use Kennofizet\RewardPlay\Models\SettingItem;
use Kennofizet\RewardPlay\Models\SettingItem\SettingItemConstant;
use Kennofizet\RewardPlay\Models\SettingOption;
use Kennofizet\RewardPlay\Models\SettingItemSet;
use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;
use Illuminate\Support\Facades\File;
use Illuminate\Http\Request;

/**
 * ManageRewardPlayCommand (view-only)
 *
 * Provides read-only views of zones/managers and generates fake data.
 * For full CRUD (create/edit/delete zones & managers), use:
 *   php artisan packages-core:manage
 */
class ManageRewardPlayCommand extends Command
{
    use GlobalDataTrait, SettingRewardPlay, ManagesZonesRewardPlay;

    protected $signature = 'rewardplay:manage';
    protected $description = 'View RewardPlay zones, server managers, and generate fake data (read-only). Use packages-core:manage for CRUD';

    protected $currentServerId = null;
    protected $currentZoneId = null;

    public function handle()
    {
        $this->info('=== RewardPlay Management Console (View Mode) ===');
        $this->comment('For Create/Edit/Delete of zones & managers, use: php artisan packages-core:manage');
        $this->newLine();

        if (!$this->hasServerIdConfig()) {
            $this->line('Server ID column not configured. Zones with server_id = null will be used.');
            $this->newLine();
        }

        while (true) {
            $this->displayMainMenu();

            $menuOptions = [
                'Select Server',
                'View Zones',
                'View Server Managers',
                'Show Current Selection',
            ];

            if ($this->currentZoneId && ($this->currentServerId !== null || !$this->hasServerIdConfig())) {
                $menuOptions[] = 'Generate Fake Data';
            }
            $menuOptions[] = 'Exit';

            $choice = $this->choice('Select an option', $menuOptions, count($menuOptions) - 1);

            switch ($choice) {
                case 'Select Server':
                    $this->selectServer();
                    break;
                case 'View Zones':
                    $this->viewZones();
                    break;
                case 'View Server Managers':
                    $this->viewServerManagers();
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

    protected function hasServerIdConfig(): bool
    {
        return !empty(config('packages-core.user_server_id_column'));
    }

    protected function displayMainMenu()
    {
        $this->info('--- Main Menu ---');
        $this->line('Current Server ID: ' . ($this->currentServerId ?? 'Not selected'));
        if ($this->currentZoneId) {
            $zone = Zone::withoutGlobalScopes()->find($this->currentZoneId);
            $this->line('Current Zone: ' . ($zone ? $zone->name : 'ID ' . $this->currentZoneId));
        } else {
            $this->line('Current Zone: Not selected');
        }
        $this->newLine();
    }

    // ── Server Selection ──────────────────────────────────────────────────────

    protected function selectServer()
    {
        $this->info('--- Select Server ---');

        if (!$this->hasServerIdConfig()) {
            $this->currentServerId = null;
            $this->line('No server column configured. Using server_id = null.');
            return;
        }

        $serverIds = Zone::withoutGlobalScopes()
            ->distinct()->whereNotNull('server_id')->pluck('server_id')->toArray();

        if (empty($serverIds)) {
            $this->warn('No servers found in zones table.');
            $manual = $this->ask('Enter server ID manually (or press Enter to skip)', null);
            if ($manual) {
                $this->currentServerId = (int) $manual;
                $this->info('Server ID set to: ' . $this->currentServerId);
            }
            return;
        }

        $options = [];
        foreach ($serverIds as $id) {
            $count = Zone::withoutGlobalScopes()->byServerId($id)->count();
            $options[] = "Server ID: {$id} ({$count} zone(s))";
        }
        $options[] = 'Cancel';

        $selected = $this->choice('Select a server', $options, count($options) - 1);
        if ($selected === 'Cancel')
            return;

        $idx = array_search($selected, $options);
        $this->currentServerId = $serverIds[$idx];
        $this->currentZoneId = null;
        $this->info('Selected Server ID: ' . $this->currentServerId);
    }

    // ── View Zones ────────────────────────────────────────────────────────────

    protected function viewZones()
    {
        if ($this->hasServerIdConfig() && !$this->currentServerId) {
            $this->error('Please select a server first!');
            return;
        }

        while (true) {
            $this->info('--- Zone Viewer (Server: ' . ($this->currentServerId ?? 'null') . ') ---');
            $choice = $this->choice('Select an option', ['List Zones', 'Select Zone', 'Back'], 2);

            switch ($choice) {
                case 'List Zones':
                    $this->listZones();
                    break;
                case 'Select Zone':
                    $this->selectZone();
                    break;
                case 'Back':
                    return;
            }
            $this->newLine();
        }
    }

    protected function listZones()
    {
        try {
            $zones = Zone::withoutGlobalScopes()->byServerId($this->currentServerId)->get();
            if ($zones->isEmpty()) {
                $this->warn('No zones found. Use [packages-core:manage] to create zones.');
                return;
            }
            $this->table(
                ['ID', 'Name', 'Server ID', 'Created At'],
                $zones->map(fn($z) => [
                    $z->id,
                    $z->name,
                    $z->server_id ?? 'N/A',
                    optional($z->created_at)->format('Y-m-d H:i:s') ?? 'N/A',
                ])->toArray()
            );
        } catch (\Exception $e) {
            $this->error('Error: ' . $e->getMessage());
        }
    }

    protected function selectZone()
    {
        try {
            $zones = Zone::withoutGlobalScopes()->byServerId($this->currentServerId)->get();
            if ($zones->isEmpty()) {
                $this->warn('No zones found. Use [packages-core:manage] to create zones.');
                return;
            }

            $options = $zones->map(fn($z) => $z->name . ' (ID: ' . $z->id . ')')->toArray();
            $options[] = 'Cancel';
            $selected = $this->choice('Select a zone', $options, count($options) - 1);
            if ($selected === 'Cancel')
                return;

            $idx = array_search($selected, $options);
            $this->currentZoneId = $zones[$idx]->id;
            $this->info('Selected Zone: ' . $zones[$idx]->name);
        } catch (\Exception $e) {
            $this->error('Error: ' . $e->getMessage());
        }
    }

    // ── View Server Managers ──────────────────────────────────────────────────

    protected function viewServerManagers()
    {
        if ($this->hasServerIdConfig() && !$this->currentServerId) {
            $this->error('Please select a server first!');
            return;
        }

        $this->info('--- Server Manager Viewer (Server: ' . ($this->currentServerId ?? 'null') . ') ---');
        $this->listServerManagers();
    }

    protected function listServerManagers()
    {
        try {
            $managers = $this->getServerManagersByServer($this->currentServerId);
            if ($managers->isEmpty()) {
                $this->warn('No managers found. Use [packages-core:manage] to add managers.');
                return;
            }
            $this->table(
                ['ID', 'User ID', 'Server ID', 'Created At'],
                $managers->map(fn($m) => [
                    $m->id,
                    $m->user_id,
                    $m->server_id ?? 'null',
                    optional($m->created_at)->format('Y-m-d H:i:s') ?? 'N/A',
                ])->toArray()
            );
        } catch (\Exception $e) {
            $this->error('Error: ' . $e->getMessage());
        }
    }

    // ── Show Current Selection ────────────────────────────────────────────────

    protected function showCurrentSelection()
    {
        $this->info('--- Current Selection ---');
        $this->line('Server ID: ' . ($this->currentServerId ?? 'null'));

        $zones = Zone::withoutGlobalScopes()->byServerId($this->currentServerId)->get();
        $managers = $this->getServerManagersByServer($this->currentServerId);
        $this->line('Zones in server: ' . $zones->count());
        $this->line('Managers for server: ' . $managers->count());

        if ($this->currentZoneId) {
            $zone = Zone::withoutGlobalScopes()->find($this->currentZoneId);
            $this->line('Selected Zone: ' . ($zone ? $zone->name : 'ID ' . $this->currentZoneId));
        } else {
            $this->line('Zone: Not selected');
        }
    }

    // ── Generate Fake Data ────────────────────────────────────────────────────

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

        if (!$this->confirm('Are you sure?', false)) {
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

            $imageManifest = $this->loadImageManifest();

            $this->info('Creating setting options...');
            $customOptions = $this->generateSettingOptions();
            $this->info('✓ Created ' . count($customOptions) . ' setting options');
            $this->newLine();

            $this->info('Creating items...');
            $itemsByType = $this->generateItems($imageManifest, $customOptions);
            $this->info('✓ Created ' . array_sum(array_map('count', $itemsByType)) . ' items');
            $this->newLine();

            $this->info('Creating item sets...');
            $setsCount = $this->generateItemSets($itemsByType, $customOptions);
            $this->info('✓ Created ' . $setsCount . ' item sets');
            $this->newLine();

            $this->info('✓ Fake data generation completed!');
        } catch (\Exception $e) {
            $this->error('✗ Error: ' . $e->getMessage());
            $this->error($e->getTraceAsString());
        }
    }

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

        $manifestWithUrls = [];
        foreach ($manifest as $key => $value) {
            $fullPath = $imagesFolder . '/' . ltrim($value, '/');
            $manifestWithUrls[$key] = $fullPath;
        }

        return $manifestWithUrls;
    }

    protected function generateItems(array $imageManifest, array $customOptions = []): array
    {
        $itemsByType = [];
        $itemTiers = ['newbie', 'beginner', 'intermediate', 'advanced', 'expert', 'master', 'elite', 'legendary', 'mythic', 'challenged'];

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

            if (!$imageUrl && !empty($imageManifest)) {
                foreach ($imageManifest as $key => $url) {
                    if (str_starts_with($key, 'bag.')) {
                        $imageUrl = $url;
                        break;
                    }
                }
            }

            for ($i = 0; $i < 10; $i++) {
                $tier = $itemTiers[$i];
                $itemName = ucfirst($tier) . ' ' . $typeName;

                $defaultProperty = [];
                $numStats = min(rand(3, 6), count($conversionKeys));
                $selectedKeys = $numStats === 1 ? [array_rand($conversionKeys, 1)] : (array) array_rand($conversionKeys, $numStats);
                foreach ($selectedKeys as $ki) {
                    $defaultProperty[$conversionKeys[$ki]] = (int) (($i + 1) * 100 * (rand(80, 120) / 100));
                }

                $customStats = [];
                if ((SettingItemConstant::isWing($type) || SettingItemConstant::isClothes($type)) && !empty($customOptions)) {
                    $numCustom = min(rand(1, 2), count($customOptions));
                    $selCustom = $numCustom === 1 ? [array_rand($customOptions, 1)] : (array) array_rand($customOptions, $numCustom);
                    foreach ($selCustom as $ci) {
                        $customStats[] = ['name' => $customOptions[$ci]->name, 'properties' => $customOptions[$ci]->rates];
                    }
                }

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

    protected function generateSettingOptions(): array
    {
        $names = ['beautiful', 'student', 'director', 'cool', 'awesome', 'epic', 'legendary', 'mystic'];
        $conversionKeys = array_keys(HelperConstant::CONVERSION_KEYS);
        $options = [];

        foreach ($names as $name) {
            $numRates = min(rand(2, 4), count($conversionKeys));
            $selKeys = $numRates === 1 ? [array_rand($conversionKeys, 1)] : (array) array_rand($conversionKeys, $numRates);
            $rates = [];
            foreach ($selKeys as $ki) {
                $rates[$conversionKeys[$ki]] = rand(10, 100);
            }

            $options[] = SettingOption::create(['name' => $name, 'rates' => $rates, 'zone_id' => $this->currentZoneId]);
        }

        return $options;
    }

    protected function generateItemSets(array $itemsByType, array $customOptions): int
    {
        $setsCount = 0;
        $conversionKeys = array_keys(HelperConstant::CONVERSION_KEYS);

        foreach ($itemsByType as $type => $items) {
            if (count($items) < 10)
                continue;

            $itemIds = array_map(fn($i) => $i->id, $items);
            $setBonuses = [];

            foreach (['2' => [2, 3, 50, 150], '5' => [3, 4, 150, 300], '8' => [4, 5, 300, 500], 'full' => [5, 7, 500, 1000]] as $level => $cfg) {
                [$minS, $maxS, $minV, $maxV] = $cfg;
                $numStats = min(rand($minS, $maxS), count($conversionKeys));
                $selKeys = $numStats === 1 ? [array_rand($conversionKeys, 1)] : (array) array_rand($conversionKeys, $numStats);
                $bonus = [];
                foreach ($selKeys as $ki) {
                    $bonus[$conversionKeys[$ki]] = rand($minV, $maxV);
                }
                $setBonuses[$level] = $bonus;
            }

            $customStats = [];
            if (!empty($customOptions)) {
                foreach (['2', '5', '8', 'full'] as $level) {
                    if (rand(0, 1)) {
                        $numCustom = min(rand(1, 2), count($customOptions));
                        $selCustom = $numCustom === 1 ? [array_rand($customOptions, 1)] : (array) array_rand($customOptions, $numCustom);
                        $lvlStats = [];
                        foreach ($selCustom as $ci) {
                            $lvlStats[] = ['name' => $customOptions[$ci]->name, 'properties' => $customOptions[$ci]->rates];
                        }
                        if ($lvlStats)
                            $customStats[$level] = $lvlStats;
                    }
                }
            }

            $set = SettingItemSet::create([
                'name' => ucfirst($type) . ' Set',
                'description' => "Complete set of {$type} items",
                'set_bonuses' => $setBonuses,
                'custom_stats' => !empty($customStats) ? $customStats : null,
                'zone_id' => $this->currentZoneId,
            ]);
            $set->items()->sync($itemIds);
            $setsCount++;
        }

        return $setsCount;
    }
}
