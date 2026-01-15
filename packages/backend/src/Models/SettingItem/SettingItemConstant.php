<?php

namespace Kennofizet\RewardPlay\Models\SettingItem;

class SettingItemConstant
{
    const API_SETTING_ITEM_LIST_PAGE = 'api_rewardplay_setting_item_list_page';

    // Item Types
    const ITEM_TYPE_SWORD = 'sword';
    const ITEM_TYPE_HAT = 'hat';
    const ITEM_TYPE_SHIRT = 'shirt';
    const ITEM_TYPE_TROUSER = 'trouser';
    const ITEM_TYPE_SHOE = 'shoe';
    const ITEM_TYPE_NECKLACE = 'necklace';
    const ITEM_TYPE_BRACELET = 'bracelet';
    const ITEM_TYPE_RING = 'ring';
    const ITEM_TYPE_CLOTHES = 'clothes';
    const ITEM_TYPE_WING = 'wing';

    /**
     * Item type names mapping
     * Key: item type, Value: item name
     */
    const ITEM_TYPE_NAMES = [
        self::ITEM_TYPE_SWORD => 'Sword',
        self::ITEM_TYPE_HAT => 'Hat',
        self::ITEM_TYPE_SHIRT => 'Shirt',
        self::ITEM_TYPE_TROUSER => 'Trouser',
        self::ITEM_TYPE_SHOE => 'Shoe',
        self::ITEM_TYPE_NECKLACE => 'Necklace',
        self::ITEM_TYPE_BRACELET => 'Bracelet',
        self::ITEM_TYPE_RING => 'Ring',
        self::ITEM_TYPE_CLOTHES => 'Clothes',
        self::ITEM_TYPE_WING => 'Wing',
    ];
}

