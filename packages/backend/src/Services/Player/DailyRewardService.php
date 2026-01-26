<?php

namespace Kennofizet\RewardPlay\Services\Player;

use Kennofizet\RewardPlay\Services\Model\SettingDailyRewardService;
use Kennofizet\RewardPlay\Services\Model\SettingStackBonusService;
use Kennofizet\RewardPlay\Models\UserDailyStatus;
use Kennofizet\RewardPlay\Models\UserBagItem;
use Kennofizet\RewardPlay\Models\UserEventTransaction;
use Carbon\Carbon;
use Exception;

class DailyRewardService
{
    protected SettingDailyRewardService $settingDailyRewardService;
    protected SettingStackBonusService $settingStackBonusService;

    public function __construct(
        SettingDailyRewardService $settingDailyRewardService,
        SettingStackBonusService $settingStackBonusService
    ) {
        $this->settingDailyRewardService = $settingDailyRewardService;
        $this->settingStackBonusService = $settingStackBonusService;
    }

    public function getDailyRewardState(?int $userId = null): array
    {
        $userDailyStatus = $this->getUserDailyStatus($userId);
        $this->checkAndResetLoginStreak($userDailyStatus);

        $weekStartDate = Carbon::now()->startOfWeek();
        $weekEndDate = Carbon::now()->endOfWeek();
        $weeklyRewards = $this->settingDailyRewardService->getSettingDailyRewardsByDateRange(
            $weekStartDate,
            $weekEndDate
        );

        $nextEpicReward = $this->settingDailyRewardService->getFirstNextEpicReward($weekEndDate);

        $isClaimedToday = $userDailyStatus->last_claim_date 
            && Carbon::parse($userDailyStatus->last_claim_date)->isToday();

        $weeklyRewardsWithClaimStatus = $weeklyRewards->map(function ($dailyReward) use ($userId) {
            $dailyReward->original_date = $dailyReward->date;
            $dailyReward->claimed = $dailyReward->hasClaimed($userId);
            return $dailyReward;
        });

        $weekDates = $weeklyRewards->map(function ($dailyReward) {
            return Carbon::parse($dailyReward->date)->format('Y-m-d');
        })->toArray();

        $stackBonuses = $this->settingStackBonusService->getSettingStackBonusesByDayRange(1, 7);
        $stackBonusesByDay = $stackBonuses->keyBy('day');

        $todayDateString = Carbon::today()->format('Y-m-d');
        $currentWeekDayIndex = array_search($todayDateString, $weekDates);
        $weeklyStreakDay = $currentWeekDayIndex !== false ? $currentWeekDayIndex + 1 : 0;

        return [
            'current_streak' => $userDailyStatus->consecutive_login_days,
            'weekly_streak' => $weeklyStreakDay,
            'is_claimed_today' => $isClaimedToday,
            'stack_bonuses' => $stackBonusesByDay,
            'seven_days_rewards' => $weeklyRewardsWithClaimStatus,
            'next_reward_epic' => $nextEpicReward,
        ];
    }

    protected function getUserDailyStatus($userId)
    {
        return UserDailyStatus::firstOrCreate(
            ['user_id' => $userId],
            ['consecutive_login_days' => 1, 'last_login_date' => Carbon::now()]
        );
    }

    protected function checkAndResetLoginStreak(UserDailyStatus $userDailyStatus)
    {
        $lastLoginDate = $userDailyStatus->last_login_date 
            ? Carbon::parse($userDailyStatus->last_login_date) 
            : null;
        $currentDate = Carbon::now();

        if (!$lastLoginDate) {
            $userDailyStatus->update([
                'last_login_date' => $currentDate, 
                'consecutive_login_days' => 1
            ]);
            return;
        }

        if ($lastLoginDate->isToday()) {
            return;
        }

        if ($lastLoginDate->isYesterday()) {
            $userDailyStatus->last_login_date = $currentDate;
            $userDailyStatus->consecutive_login_days += 1;
            $userDailyStatus->save();
        } else {
            $userDailyStatus->last_login_date = $currentDate;
            $userDailyStatus->consecutive_login_days = 1;
            $userDailyStatus->save();
        }
    }

    public function collectReward($userId)
    {
        $userDailyStatus = $this->getUserDailyStatus($userId);

        if ($userDailyStatus->last_claim_date 
            && Carbon::parse($userDailyStatus->last_claim_date)->isToday()) {
            throw new Exception("Already collected today");
        }

        $todayDailyReward = $this->settingDailyRewardService->getSettingDailyRewardByDate(Carbon::today());
        $allCollectedItems = [];

        if ($todayDailyReward && !empty($todayDailyReward->items)) {
            $this->grantRewards($userId, $todayDailyReward->items);
            $allCollectedItems = array_merge($allCollectedItems, $todayDailyReward->items);
            
            // Save transaction for daily reward
            UserEventTransaction::create([
                'user_id' => $userId,
                'model_type' => \Kennofizet\RewardPlay\Models\SettingDailyReward::class,
                'model_id' => $todayDailyReward->id,
                'items' => $todayDailyReward->items,
            ]);
        }

        $currentWeeklyStreakDay = $userDailyStatus->consecutive_login_days;
        $stackBonusForStreakDay = $this->settingStackBonusService->getSettingStackBonusByDay($currentWeeklyStreakDay);
        if ($stackBonusForStreakDay && !empty($stackBonusForStreakDay->rewards)) {
            $this->grantRewards($userId, $stackBonusForStreakDay->rewards);
            $allCollectedItems = array_merge($allCollectedItems, $stackBonusForStreakDay->rewards);
            
            // Save transaction for stack bonus
            UserEventTransaction::create([
                'user_id' => $userId,
                'model_type' => \Kennofizet\RewardPlay\Models\SettingStackBonus::class,
                'model_id' => $stackBonusForStreakDay->id,
                'items' => $stackBonusForStreakDay->rewards,
            ]);
        }

        $userDailyStatus->last_claim_date = Carbon::now();
        $userDailyStatus->save();
    }

    protected function grantRewards($userId, array $rewards)
    {
        foreach ($rewards as $rewardItem) {
            $rewardType = $rewardItem['type'] ?? 'item';

            if ($rewardType == 'coin') {
                // TODO: Integration with wallet/coins table
            } elseif ($rewardType == 'item' || isset($rewardItem['item_id'])) {
                UserBagItem::create([
                    'user_id' => $userId,
                    'item_id' => $rewardItem['item_id'],
                    'quantity' => $rewardItem['quantity'] ?? 1,
                    'acquired_at' => Carbon::now()
                ]);
            }
        }
    }
}
