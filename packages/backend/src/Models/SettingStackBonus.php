<?php

namespace Kennofizet\RewardPlay\Models;

use Kennofizet\RewardPlay\Models\SettingStackBonus\SettingStackBonusActions;
use Kennofizet\RewardPlay\Models\SettingStackBonus\SettingStackBonusRelations;
use Kennofizet\RewardPlay\Models\SettingStackBonus\SettingStackBonusScopes;
use Kennofizet\RewardPlay\Core\Model\BaseModel;

class SettingStackBonus extends BaseModel
{
    use SettingStackBonusActions, SettingStackBonusRelations, SettingStackBonusScopes;

    protected $fillable = [
        'name',
        'day',
        'rewards',
        'is_active',
        'zone_id',
    ];

    protected $casts = [
        'day' => 'integer',
        'rewards' => 'array',
        'is_active' => 'boolean',
    ];

    public function getTable()
    {
        return self::getPivotTableName('rewardplay_' . \Kennofizet\RewardPlay\Models\SettingStackBonus\SettingStackBonusConstant::TABLE_NAME);
    }
}
