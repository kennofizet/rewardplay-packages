<?php

namespace Kennofizet\RewardPlay\Models\SettingLevelExp;

use Kennofizet\RewardPlay\Models\SettingLevelExp;

trait SettingLevelExpActions
{
    public static function getByLevel(int $lv): ?SettingLevelExp
    {
        return self::where('lv', $lv)->first();
    }

    public static function getExpForLevel(int $lv): int
    {
        $levelExp = self::getByLevel($lv);
        return $levelExp ? $levelExp->exp_needed : 0;
    }
}
