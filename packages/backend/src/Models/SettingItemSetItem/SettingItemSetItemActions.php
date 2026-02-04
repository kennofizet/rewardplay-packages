<?php

namespace Kennofizet\RewardPlay\Models\SettingItemSetItem;

use Kennofizet\RewardPlay\Models\SettingItemSetItem;

trait SettingItemSetItemActions
{
    /**
     * Find setting item set item by ID
     * 
     * @param int $id
     * @return SettingItemSetItem|null
     */
    public static function findById(int $id): ?SettingItemSetItem
    {
        return SettingItemSetItem::find($id);
    }
}
