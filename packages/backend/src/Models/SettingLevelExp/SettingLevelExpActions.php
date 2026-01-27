<?php

namespace Kennofizet\RewardPlay\Models\SettingLevelExp;

use Kennofizet\RewardPlay\Models\SettingLevelExp;
use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;

trait SettingLevelExpActions
{
    public static function getByLevel(int $lv): ?SettingLevelExp
    {
        return self::where('lv', $lv)->first();
    }

    public static function getExpForLevel(int $lv): int
    {
        // First try to get exact level
        $levelExp = self::getByLevel($lv);
        if ($levelExp) {
            return $levelExp->exp_needed;
        }

        // Check if any level settings exist
        $hasAnySettings = self::exists();
        
        if (!$hasAnySettings) {
            // No settings at all, use default from constant
            return HelperConstant::DEFAULT_EXP_NEEDED;
        }

        // Settings exist but not for this level, find nearest level less than current
        $nearestLevel = self::where('lv', '<', $lv)
            ->orderBy('lv', 'desc')
            ->first();

        if ($nearestLevel) {
            return $nearestLevel->exp_needed;
        }

        // No level less than current found, use default from constant
        return HelperConstant::DEFAULT_EXP_NEEDED;
    }
}
