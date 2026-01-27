<?php

namespace Kennofizet\RewardPlay\Models;

use Kennofizet\RewardPlay\Models\UserProfile\UserProfileActions;
use Kennofizet\RewardPlay\Models\UserProfile\UserProfileRelations;
use Kennofizet\RewardPlay\Models\UserProfile\UserProfileScopes;
use Kennofizet\RewardPlay\Core\Model\BaseModel;
use Kennofizet\RewardPlay\Models\SettingLevelExp;

class UserProfile extends BaseModel
{
    use UserProfileActions, UserProfileRelations, UserProfileScopes;

    protected $fillable = [
        'user_id',
        'zone_id',
        'total_exp',
        'current_exp',
        'lv',
        'coin',
        'ruby',
    ];

    protected $casts = [
        'total_exp' => 'integer',
        'current_exp' => 'integer',
        'lv' => 'integer',
        'coin' => 'integer',
        'ruby' => 'integer',
    ];

    public function getTable()
    {
        return self::getPivotTableName('rewardplay_user_profiles');
    }

    /**
     * Boot the model
     */
    protected static function boot()
    {
        parent::boot();

        // Handle level up when current_exp or total_exp changes
        static::updating(function ($profile) {
            $originalCurrentExp = $profile->getOriginal('current_exp') ?? 0;
            $originalTotalExp = $profile->getOriginal('total_exp') ?? 0;
            $newCurrentExp = $profile->current_exp ?? 0;
            $newTotalExp = $profile->total_exp ?? 0;

            // Check if current_exp or total_exp has changed
            if ($newCurrentExp !== $originalCurrentExp || $newTotalExp !== $originalTotalExp) {
                $currentLv = $profile->lv ?? 1;
                $expNeeded = SettingLevelExp::getExpForLevel($currentLv);

                // If current_exp >= exp_needed, level up
                while ($newCurrentExp >= $expNeeded && $expNeeded > 0) {
                    $newCurrentExp -= $expNeeded;
                    $currentLv++;
                    $expNeeded = SettingLevelExp::getExpForLevel($currentLv);
                }

                // Update the model attributes
                $profile->current_exp = $newCurrentExp;
                $profile->lv = $currentLv;
            }
        });
    }
}
