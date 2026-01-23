<?php

namespace Kennofizet\RewardPlay\Models\SettingItem;

use Kennofizet\RewardPlay\Models\SettingItem;
use Kennofizet\RewardPlay\Models\SettingItem\SettingItemConstant;
use Kennofizet\RewardPlay\Core\Model\BaseModelActions;

trait SettingItemActions
{
    /**
     * Find setting item by ID
     * 
     * @param int $id
     * @return SettingItem|null
     */
    public static function findById(int $id): ?SettingItem
    {
        return SettingItem::find($id);
    }

    /**
     * Find setting item by key (slug)
     * 
     * @param string $key
     * @return SettingItem|null
     */
    public static function findByKey(string $key): ?SettingItem
    {
        return SettingItem::byKey($key)->first();
    }

    /**
     * Get all item types with their names
     * 
     * @return array
     */
    public static function getItemTypes(): array
    {
        $itemTypes = [];

        foreach (SettingItemConstant::ITEM_TYPE_NAMES as $type => $name) {
            $itemTypes[] = [
                'type' => $type,
                'name' => $name
            ];
        }

        return $itemTypes;
    }

    /**
     * Get all active items
     * 
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getActiveItems()
    {
        return self::all();
    }
}

