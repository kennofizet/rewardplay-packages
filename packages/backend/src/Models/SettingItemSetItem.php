<?php

namespace Kennofizet\RewardPlay\Models;

use Kennofizet\RewardPlay\Core\Model\BaseModel;
use Kennofizet\RewardPlay\Models\SettingItemSetItem\SettingItemSetItemRelations;
use Kennofizet\RewardPlay\Models\SettingItemSetItem\SettingItemSetItemActions;
use Kennofizet\RewardPlay\Models\SettingItemSetItem\SettingItemSetItemScopes;

/**
 * SettingItemSetItem Model (Pivot table for setting-item-set-item many-to-many relationship)
 */
class SettingItemSetItem extends BaseModel
{
    use SettingItemSetItemRelations, SettingItemSetItemActions, SettingItemSetItemScopes;

    /**
     * Get the table name with prefix
     * 
     * @return string
     */
    public function getTable()
    {
        return self::getPivotTableName('rewardplay_setting_item_set_items');
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'set_id',
        'item_id',
    ];
}
