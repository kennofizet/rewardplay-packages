<?php

namespace Kennofizet\RewardPlay\Models\SettingStackBonus;

use Kennofizet\RewardPlay\Models\SettingStackBonus;

trait SettingStackBonusActions
{
    public static function getAll()
    {
        return self::all();
    }

    public static function getActiveBonuses()
    {
        return self::byActive(true)->get();
    }
}
