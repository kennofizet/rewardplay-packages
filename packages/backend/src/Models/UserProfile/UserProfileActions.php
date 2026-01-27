<?php

namespace Kennofizet\RewardPlay\Models\UserProfile;

use Kennofizet\RewardPlay\Models\UserProfile;

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
}
