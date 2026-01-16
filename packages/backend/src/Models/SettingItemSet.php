<?php

namespace Kennofizet\RewardPlay\Models;

use Kennofizet\RewardPlay\Models\SettingItemSet\SettingItemSetRelations;
use Kennofizet\RewardPlay\Models\SettingItemSet\SettingItemSetScopes;
use Kennofizet\RewardPlay\Models\SettingItemSet\SettingItemSetActions;
use Kennofizet\RewardPlay\Core\Model\BaseModel;

/**
 * SettingItemSet Model
 */
class SettingItemSet extends BaseModel
{
    use SettingItemSetRelations, SettingItemSetActions, SettingItemSetScopes;

    /**
     * Get the table name with prefix
     * 
     * @return string
     */
    public function getTable()
    {
        return self::getPivotTableName('rewardplay_setting_item_sets');
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'set_bonuses',
        'zone_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'set_bonuses' => 'array',
    ];
}
