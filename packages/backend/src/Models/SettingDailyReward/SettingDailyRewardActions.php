<?php

namespace Kennofizet\RewardPlay\Models\SettingDailyReward;

use Carbon\Carbon;
use Kennofizet\RewardPlay\Models\SettingDailyReward;
use Kennofizet\RewardPlay\Models\UserEventTransaction;

trait SettingDailyRewardActions
{
    public static function findByDate($date): ?SettingDailyReward
    {
        return self::byDate($date)->first();
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

    /**
     * Check if a specific day (SettingDailyReward) has been claimed by a user
     * 
     * @param int $userId
     * @param SettingDailyReward|int $dailyReward DailyReward model instance or ID
     * @return bool
     */
    public function hasClaimed($userId): bool
    {
        $modelId = $this->id;
        $modelType = self::class;
        
        return UserEventTransaction::hasClaimed($userId, $modelType, $modelId);
    }
}
