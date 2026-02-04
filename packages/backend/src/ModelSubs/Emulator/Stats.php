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
     * Get all stats separated into stats and custom_options
     * 
     * @return array ['stats' => [...], 'custom_options' => [...]]
     */
    public static function getAllStats(): array
    {
        // Get base conversion keys as stats
        $stats = self::getConversionKeys();
        
        // Get all custom options from setting_options
        $customOptions = [];
        $settingOptions = SettingOption::select('id', 'name', 'rates')
            ->get();
        
        foreach ($settingOptions as $settingOption) {
            // Decode rates if it's still a JSON string
            $rates = $settingOption->rates;
            if (is_string($rates)) {
                $rates = json_decode($rates, true);
            }
            
            if (!$rates || !is_array($rates)) {
                continue;
            }
            
            // Add custom option entry
            $customOptions[] = [
                'id' => $settingOption->id,
                'name' => $settingOption->name,
                'properties' => $rates
            ];
        }
        
        return [
            'stats' => $stats,
            'custom_options' => $customOptions
        ];
    }
}
