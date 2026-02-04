<?php

namespace Kennofizet\RewardPlay\Models;

use Kennofizet\RewardPlay\Models\SettingLevelExp\SettingLevelExpActions;
use Kennofizet\RewardPlay\Models\SettingLevelExp\SettingLevelExpRelations;
use Kennofizet\RewardPlay\Models\SettingLevelExp\SettingLevelExpScopes;
use Kennofizet\RewardPlay\Core\Model\BaseModel;

class SettingLevelExp extends BaseModel
{
    use SettingLevelExpActions, SettingLevelExpRelations, SettingLevelExpScopes;

    protected $fillable = [
        'lv',
        'exp_needed',
        'zone_id',
    ];

    protected $casts = [
        'lv' => 'integer',
        'exp_needed' => 'integer',
    ];

    public function getTable()
    {
        return self::getPivotTableName('rewardplay_' . \Kennofizet\RewardPlay\Models\SettingLevelExp\SettingLevelExpConstant::TABLE_NAME);
    }
}
