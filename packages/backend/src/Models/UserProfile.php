<?php

namespace Kennofizet\RewardPlay\Models;

use Kennofizet\RewardPlay\Models\UserProfile\UserProfileActions;
use Kennofizet\RewardPlay\Models\UserProfile\UserProfileRelations;
use Kennofizet\RewardPlay\Models\UserProfile\UserProfileScopes;
use Kennofizet\RewardPlay\Core\Model\BaseModel;

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
}
