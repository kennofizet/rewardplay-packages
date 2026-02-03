<?php

namespace Kennofizet\RewardPlay\Models\SettingShopItem;

class SettingShopItemConstant
{
    const TABLE_NAME = 'setting_shop_items';

    const API_LIST_PAGE = 'api_rewardplay_setting_shop_item_list';

    const CATEGORY_GEAR = 'gear';
    const CATEGORY_TICKET = 'ticket';
    const CATEGORY_BOX_RANDOM = 'box_random';
    const CATEGORY_EVENT = 'event';

    const PRICE_TYPE_COIN = 'coin';
    const PRICE_TYPE_GEM = 'gem';
    const PRICE_TYPE_RUBY = 'ruby';
    const PRICE_TYPE_GEAR = 'gear';
    const PRICE_TYPE_ITEM = 'item';

    /** Check if price type is coin (use for logic checks). */
    public static function isPriceCoin(?string $type): bool
    {
        return $type === self::PRICE_TYPE_COIN;
    }

    /** Check if price type is ruby or gem (use for logic checks). */
    public static function isPriceRuby(?string $type): bool
    {
        return $type === self::PRICE_TYPE_RUBY || $type === self::PRICE_TYPE_GEM;
    }

    /** Check if price type is gear (use for logic checks). */
    public static function isPriceGear(?string $type): bool
    {
        return $type === self::PRICE_TYPE_GEAR;
    }

    /** Check if price type is item (use for logic checks). */
    public static function isPriceItem(?string $type): bool
    {
        return $type === self::PRICE_TYPE_ITEM;
    }

    /** Check if category is gear (use for logic checks). */
    public static function isCategoryGear(?string $category): bool
    {
        return $category === self::CATEGORY_GEAR;
    }

    /** Check if category is event (use for logic checks). */
    public static function isCategoryEvent(?string $category): bool
    {
        return $category === self::CATEGORY_EVENT;
    }

    /** Check if category is ticket (use for logic checks). */
    public static function isCategoryTicket(?string $category): bool
    {
        return $category === self::CATEGORY_TICKET;
    }

    /** Check if category is box_random (use for logic checks). */
    public static function isCategoryBoxRandom(?string $category): bool
    {
        return $category === self::CATEGORY_BOX_RANDOM;
    }
}
