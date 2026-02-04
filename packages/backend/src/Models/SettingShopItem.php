<?php

namespace Kennofizet\RewardPlay\Models;

use Kennofizet\RewardPlay\Core\Model\BaseModel;
use Kennofizet\RewardPlay\Models\SettingShopItem\SettingShopItemRelations;
use Kennofizet\RewardPlay\Models\SettingShopItem\SettingShopItemScopes;
use Kennofizet\RewardPlay\Models\SettingShopItem\SettingShopItemActions;

class SettingShopItem extends BaseModel
{
    use SettingShopItemRelations, SettingShopItemScopes, SettingShopItemActions;

    protected $fillable = [
        'zone_id',
        'setting_item_id',
        'event_id',
        'category',
        'prices',
        'sort_order',
        'time_start',
        'time_end',
        'options',
        'is_active',
    ];

    protected $casts = [
        'prices' => 'array',
        'options' => 'array',
        'time_start' => 'datetime',
        'time_end' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function getTable(): string
    {
        return self::getPivotTableName('rewardplay_' . \Kennofizet\RewardPlay\Models\SettingShopItem\SettingShopItemConstant::TABLE_NAME);
    }
}
