<?php

namespace Kennofizet\RewardPlay\ModelSubs\Emulator;

use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;
use Kennofizet\RewardPlay\Models\SettingOption;

/**
 * Stats Model (Fake model for game stats/conversion keys)
 * This is not a real Eloquent model, just a utility class for stats-related operations
 */
class Stats
{
    /**
     * Get all conversion keys with their names
     * 
     * @return array
     */
    public static function getConversionKeys(): array
    {
        $conversionKeys = [];
        
        foreach (HelperConstant::CONVERSION_KEYS as $key => $name) {
            $conversionKeys[] = [
                'key' => $key,
                'name' => $name
            ];
        }
        
        return $conversionKeys;
    }

    /**
     * Get all stats (merged conversion keys + custom group stats from setting_options)
     * 
     * @return array
     */
    public static function getAllStats(): array
    {
        // Start with base conversion keys
        $allStats = self::getConversionKeys();
        $statsMap = [];
        
        // Build map of existing keys for quick lookup
        foreach ($allStats as $stat) {
            $statsMap[$stat['key']] = $stat['name'];
        }
        
        // Get all custom keys from setting_options rates
        // Use select to only get id, name, and rates columns to optimize query
        $settingOptions = SettingOption::select('id', 'name', 'rates')
            ->get();
        
        // Process each setting_option to extract custom keys
        foreach ($settingOptions as $settingOption) {
            // Decode rates if it's still a JSON string (cast might not apply with select())
            $rates = $settingOption->rates;
            if (is_string($rates)) {
                $rates = json_decode($rates, true);
            }
            
            if (!$rates || !is_array($rates)) {
                continue;
            }
            
             // Create custom key with format: custom_key_{id}_{original_key}
             $customKey = "custom_key_{$settingOption->id}";
                
             // Skip if this custom key already exists
             if (isset($statsMap[$customKey])) {
                 continue;
             }
             
             // Add custom stat entry
             $allStats[] = [
                 'key' => $customKey,
                 'name' => $settingOption->name,
                 'value' => $rates
             ];
             
             $statsMap[$customKey] = $settingOption->name;
        }
        
        return $allStats;
    }
}
