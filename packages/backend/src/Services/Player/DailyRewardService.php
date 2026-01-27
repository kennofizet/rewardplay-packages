<?php

namespace Kennofizet\RewardPlay\Services\Player;

use Kennofizet\RewardPlay\Services\Model\SettingDailyRewardService;
use Kennofizet\RewardPlay\Services\Model\SettingStackBonusService;
use Kennofizet\RewardPlay\Models\UserDailyStatus;
use Kennofizet\RewardPlay\Models\User;
use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;
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

        $stackBonuses = $this->settingStackBonusService->getSettingStackBonusesByDayRange(1, 7);
        $stackBonusesByDay = $stackBonuses->keyBy('day');

        return [
            'weekly_streak' => $userDailyStatus->consecutive_login_days > sizeof($stackBonusesByDay) ? sizeof($stackBonusesByDay) : $userDailyStatus->consecutive_login_days,
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
        $user = User::findById($userId);
        if (!$user) {
            throw new Exception("User not found");
        }

        $userDailyStatus = $this->getUserDailyStatus($userId);

        if ($userDailyStatus->last_claim_date 
            && Carbon::parse($userDailyStatus->last_claim_date)->isToday()) {
            throw new Exception("Already collected today");
        }

        $todayDailyReward = $this->settingDailyRewardService->getSettingDailyRewardByDate(Carbon::today());

        if ($todayDailyReward && !empty($todayDailyReward->items)) {
            $this->grantRewards($user, $todayDailyReward->items, 'daily_reward');
            
            // Save transaction for daily reward using User model method
            $user->hasTransaction([
                'model_type' => \Kennofizet\RewardPlay\Models\SettingDailyReward::class,
                'model_id' => $todayDailyReward->id,
                'items' => $todayDailyReward->items,
            ]);
        }

        $currentWeeklyStreakDay = $userDailyStatus->consecutive_login_days;
        $stackBonusForStreakDay = $this->settingStackBonusService->getSettingStackBonusByDay($currentWeeklyStreakDay);
        if ($stackBonusForStreakDay && !empty($stackBonusForStreakDay->rewards)) {
            $this->grantRewards($user, $stackBonusForStreakDay->rewards, 'stack_bonus');
            
            // Save transaction for stack bonus using User model method
            $user->hasTransaction([
                'model_type' => \Kennofizet\RewardPlay\Models\SettingStackBonus::class,
                'model_id' => $stackBonusForStreakDay->id,
                'items' => $stackBonusForStreakDay->rewards,
            ]);
        }

        $userDailyStatus->last_claim_date = Carbon::now();
        $userDailyStatus->save();
    }

    protected function grantRewards(User $user, array $rewards, string $rewardSource = 'daily_reward')
    {
        foreach ($rewards as $rewardItem) {
            $rewardType = $rewardItem['type'] ?? HelperConstant::TYPE_GEAR;

            if ($rewardType == HelperConstant::TYPE_COIN) {
                // TODO: Integration with wallet/coins table
            } elseif ($rewardType == HelperConstant::TYPE_GEAR || isset($rewardItem['item_id'])) {
                // Use new structure: properties.stats and custom_options
                $bagProperties = [];
                
                // Get stats from properties.stats
                if (isset($rewardItem['properties']['stats']) && is_array($rewardItem['properties']['stats'])) {
                    $bagProperties['stats'] = $rewardItem['properties']['stats'];
                }
                
                // Get custom_options (can be object or array)
                if (isset($rewardItem['custom_options'])) {
                    if (isset($rewardItem['custom_options']['name'])) {
                        // Single object format - convert to array
                        $bagProperties['custom_options'] = [$rewardItem['custom_options']];
                    } elseif (is_array($rewardItem['custom_options'])) {
                        // Array format
                        $bagProperties['custom_options'] = $rewardItem['custom_options'];
                    }
                }
                
                // Fallback to old format for backward compatibility
                if (empty($bagProperties['stats']) && isset($rewardItem['default_property']) && is_array($rewardItem['default_property'])) {
                    $bagProperties['stats'] = $rewardItem['default_property'];
                }
                if (empty($bagProperties['custom_options']) && isset($rewardItem['custom_stats']) && is_array($rewardItem['custom_stats'])) {
                    $bagProperties['custom_options'] = $rewardItem['custom_stats'];
                }
                
                // Use User model method to give item
                $user->giveItem([
                    'item_id' => $rewardItem['item_id'],
                    'item_type' => $rewardType, // Set item_type from rewardType
                    'properties' => !empty($bagProperties) ? $bagProperties : null,
                    'quantity' => $rewardItem['quantity'] ?? 1,
                    'acquired_at' => Carbon::now()
                ]);
            }
        }
    }
}
