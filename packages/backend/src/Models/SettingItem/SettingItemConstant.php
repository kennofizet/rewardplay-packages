<?php

namespace Kennofizet\RewardPlay\Models\SettingItem;

class SettingItemConstant
{
    const API_SETTING_ITEM_LIST_PAGE = 'api_rewardplay_setting_item_list_page';

    /** Item type for bag/API when item is wearable (any gear slot). */
    const ITEM_TYPE_GEAR = 'gear';

    // Gear item types (wearable)
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

    // Non-gear / consumable item types (box_random, ticket, etc.)
    const ITEM_TYPE_BOX_RANDOM = 'box_random';
    const ITEM_TYPE_TICKET = 'ticket';
    const ITEM_TYPE_BUFF = 'buff';

    /**
     * Gear item type names (wearable slots).
     * Key: item type, Value: display name
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

    /**
     * Non-gear item type names (box random, ticket, wheel roll, custom).
     * Box random: default_property may contain rate_list (array of rates) and item_count.
     */
    const OTHER_ITEM_TYPE_NAMES = [
        self::ITEM_TYPE_BOX_RANDOM => 'Box Random',
        self::ITEM_TYPE_TICKET => 'Ticket',
        self::ITEM_TYPE_BUFF => 'Buff Card'
    ];

    /** Box random default_property keys: rate_list (array of {setting_item_id, rate}), item_count (int) */
    const BOX_RANDOM_RATE_LIST = 'rate_list';
    const BOX_RANDOM_ITEM_COUNT = 'item_count';

    /**
     * Check if type is box_random (use for logic checks; do not compare with constant in business code).
     */
    public static function isBoxRandom(?string $type): bool
    {
        return $type === self::ITEM_TYPE_BOX_RANDOM;
    }

    /**
     * Check if type is gear (bag item_type; use for logic checks).
     */
    public static function isGear(?string $type): bool
    {
        return $type === self::ITEM_TYPE_GEAR;
    }

    /**
     * Check if type is a gear slot type (sword, hat, etc.) for setting items.
     */
    public static function isGearSlotType(?string $type): bool
    {
        return $type !== null && array_key_exists($type, self::ITEM_TYPE_NAMES);
    }

    /**
     * Check if type is ticket (use for logic checks).
     */
    public static function isTicket(?string $type): bool
    {
        return $type === self::ITEM_TYPE_TICKET;
    }

    /**
     * Check if type is buff (use for logic checks).
     */
    public static function isBuff(?string $type): bool
    {
        return $type === self::ITEM_TYPE_BUFF;
    }

    /**
     * Check if type is wing (use for logic checks).
     */
    public static function isWing(?string $type): bool
    {
        return $type === self::ITEM_TYPE_WING;
    }

    /**
     * Check if type is clothes (use for logic checks).
     */
    public static function isClothes(?string $type): bool
    {
        return $type === self::ITEM_TYPE_CLOTHES;
    }
}

