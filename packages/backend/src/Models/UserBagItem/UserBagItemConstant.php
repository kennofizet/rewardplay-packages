<?php

namespace Kennofizet\RewardPlay\Models\UserBagItem;

use Kennofizet\RewardPlay\Models\SettingItem\SettingItemConstant;

class UserBagItemConstant
{
    const TABLE_NAME = 'user_bag_items';
    const PLAYER_API_RESPONSE_BAG_PAGE = 'api_rewardplay_user_bag_item_list_page';

    /**
     * Bag menu config: list of menu keys and their settings.
     * - key: menu key (e.g. 'bag', 'sword', 'other', 'shop')
     * - item_types: null = "all" tab (show items where properties is null or all keys empty); else array of item_type
     * - show_when_properties_empty: when true and item_types is null, item belongs here if properties is null/empty
     * - image_key: frontend image manifest key (e.g. 'bag.bag')
     * - label_key: optional i18n key for tab label
     */
    public static function getBagMenuList(): array
    {
        return [
            [
                'key' => 'gear',
                'item_types' => [
                    SettingItemConstant::ITEM_TYPE_GEAR,
                ],
                'show_when_properties_empty' => false,
                'image_key' => 'bag.menu.gear',
                'label_key' => 'component.bag.menu.gear',
            ],
            [
                'key' => 'can_use_items',
                'item_types' => [
                    SettingItemConstant::ITEM_TYPE_TICKET,
                    SettingItemConstant::ITEM_TYPE_BUFF,
                    SettingItemConstant::ITEM_TYPE_BOX_RANDOM,
                ],
                'show_when_properties_empty' => false,
                'image_key' => 'bag.menu.can_use_items',
                'label_key' => 'component.bag.menu.can_use_items',
            ],
            [
                'key' => 'other_items',
                'item_types' => null,
                'show_when_properties_empty' => false,
                'image_key' => 'bag.menu.other_items',
                'label_key' => 'component.bag.menu.other_items',
            ],
            [
                'key' => 'wait_appraisal',
                'item_types' => null,
                'show_when_properties_empty' => true,
                'image_key' => 'bag.menu.wait_appraisal',
                'label_key' => 'component.bag.menu.wait_appraisal',
            ],
        ];
    }

    /**
     * Check if item properties is considered empty: null or array with all values null/empty.
     */
    public static function isPropertiesEmpty($properties): bool
    {
        if ($properties === null || $properties === []) {
            return true;
        }
        if (!is_array($properties)) {
            return true;
        }
        foreach ($properties as $v) {
            if ($v !== null && $v !== '' && $v !== [] && $v !== false) {
                if (is_array($v)) {
                    if (!self::isPropertiesEmpty($v)) {
                        return false;
                    }
                } else {
                    return false;
                }
            }
        }
        return true;
    }
}
