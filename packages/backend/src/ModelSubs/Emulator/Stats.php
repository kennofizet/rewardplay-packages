<?php

namespace Kennofizet\RewardPlay\ModelSubs\Emulator;

use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;

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
}
