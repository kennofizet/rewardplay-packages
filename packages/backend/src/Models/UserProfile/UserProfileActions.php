<?php

namespace Kennofizet\RewardPlay\Models\UserProfile;

use Kennofizet\RewardPlay\Models\UserProfile;
use Kennofizet\RewardPlay\Models\User;
use Kennofizet\RewardPlay\Models\UserRankingSnapshot;
use Kennofizet\RewardPlay\Models\UserRankingSnapshot\UserRankingSnapshotConstant;
use Kennofizet\RewardPlay\Models\SettingLevelExp;

trait UserProfileActions
{
    /**
     * Get profile by user ID
     * 
     * @param int $userId
     * @return UserProfile|null
     */
    public static function getByUser($userId): ?UserProfile
    {
        $query = self::where('user_id', $userId);
        
        return $query->first();
    }

    /**
     * Get or create profile for user
     * 
     * @param int $userId
     * @param int|null $zoneId
     * @return UserProfile
     */
    public static function getOrCreateProfile($userId): UserProfile
    {
        return self::firstOrCreate(
            [
                'user_id' => $userId,
            ],
            [
                'total_exp' => 0,
                'current_exp' => 0,
                'lv' => 1,
                'coin' => 0,
                'ruby' => 0,
            ]
        );
    }

    /**
     * Give exp to the profile
     * Adds to total_exp and current_exp
     * 
     * @param int $expAmount - Amount of exp to give
     * @return UserProfile
     */
    public function giveExp(int $expAmount): UserProfile
    {
        $this->total_exp = ($this->total_exp ?? 0) + $expAmount;
        $this->current_exp = ($this->current_exp ?? 0) + $expAmount;
        $this->save();
        
        return $this->fresh();
    }

    /**
     * Get exp needed for current level
     * 
     * @return int
     */
    public function getExpNeed(): int
    {
        $currentLv = $this->lv ?? 1;
        return SettingLevelExp::getExpForLevel($currentLv);
    }

    /**
     * Give coin to the profile
     * Adds to coin amount
     * 
     * @param int $coinAmount - Amount of coin to give
     * @return UserProfile
     */
    public function giveCoin(int $coinAmount): UserProfile
    {
        $this->coin = ($this->coin ?? 0) + $coinAmount;
        $this->save();
        
        return $this->fresh();
    }

    /**
     * Refresh ranking snapshot for this profile (day/week/month/year) when coin, level, exp, ruby or gears change.
     * Called from UserProfile::boot() saved event so leaderboards stay up to date.
     */
    public function refreshRankingSnapshot(): void
    {
        $userId = (int) $this->user_id;
        $zoneId = $this->zone_id ? (int) $this->zone_id : null;
        $coin = (int) ($this->coin ?? 0);
        $level = (int) ($this->lv ?? 1);

        $user = User::findById($userId);
        $power = $user ? $user->getPower() : 0;

        $periodTypes = [
            UserRankingSnapshotConstant::PERIOD_DAY,
            UserRankingSnapshotConstant::PERIOD_WEEK,
            UserRankingSnapshotConstant::PERIOD_MONTH,
            UserRankingSnapshotConstant::PERIOD_YEAR,
        ];

        foreach ($periodTypes as $periodType) {
            $periodKey = UserRankingSnapshot::getCurrentPeriodKey($periodType);
            UserRankingSnapshot::upsertForUser($userId, $zoneId, $periodType, $periodKey, $coin, $level, $power, true);
        }
    }
}
