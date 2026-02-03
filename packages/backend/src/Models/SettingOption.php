<?php

namespace Kennofizet\RewardPlay\Models;

use Kennofizet\RewardPlay\Models\SettingOption\SettingOptionRelations;
use Kennofizet\RewardPlay\Models\SettingOption\SettingOptionScopes;
use Kennofizet\RewardPlay\Models\SettingOption\SettingOptionActions;
use Kennofizet\RewardPlay\Core\Model\BaseModel;

/**
 * SettingOption Model
 */
class SettingOption extends BaseModel
{
    use SettingOptionRelations, SettingOptionActions, SettingOptionScopes;

    /**
     * Get the table name with prefix
     * 
     * @return string
     */
    public function getTable()
    {
        return self::getPivotTableName('rewardplay_setting_options');
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'rates',
        'zone_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'rates' => 'array',
    ];
}
