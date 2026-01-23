<?php

namespace Kennofizet\RewardPlay\Models\SettingDailyReward;

use Carbon\Carbon;
use Kennofizet\RewardPlay\Models\SettingDailyReward;

trait SettingDailyRewardActions
{
    public static function findByDate($date): ?SettingDailyReward
    {
        return self::byDate($date)->first();
    }

    public static function getByMonth($year, $month)
    {
        return self::byYearAndMonth($year, $month)
            ->orderBy('date')
            ->get();
    }

    public static function getByDateRange($startDate, $endDate)
    {
        return self::byDateRange($startDate, $endDate)
            ->orderBy('date')
            ->get();
    }

    public static function firstNextRewardEpic($startDate): ?SettingDailyReward
    {
        return self::afterDate($startDate)
            ->byEpic(true)
            ->first();
    }
}
