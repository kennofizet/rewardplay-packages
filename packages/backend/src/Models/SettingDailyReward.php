<?php

namespace Kennofizet\RewardPlay\Models;

use Kennofizet\RewardPlay\Models\SettingDailyReward\SettingDailyRewardActions;
use Kennofizet\RewardPlay\Models\SettingDailyReward\SettingDailyRewardRelations;
use Kennofizet\RewardPlay\Models\SettingDailyReward\SettingDailyRewardScopes;
use Kennofizet\RewardPlay\Core\Model\BaseModel;

class SettingDailyReward extends BaseModel
{
    use SettingDailyRewardActions, SettingDailyRewardRelations, SettingDailyRewardScopes;

    protected $fillable = [
        'date',
        'items',
        'stack_bonuses',
        'is_active',
        'is_epic',
        'zone_id',
    ];

    protected $casts = [
        'date' => 'date',
        'items' => 'array',
        'stack_bonuses' => 'array',
        'is_active' => 'boolean',
        'is_epic' => 'boolean',
    ];

    public function getTable()
    {
        return self::getPivotTableName('rewardplay_' . \Kennofizet\RewardPlay\Models\SettingDailyReward\SettingDailyRewardConstant::TABLE_NAME);
    }
}
