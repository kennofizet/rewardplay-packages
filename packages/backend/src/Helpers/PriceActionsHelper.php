<?php

namespace Kennofizet\RewardPlay\Helpers;

use Kennofizet\RewardPlay\Models\SettingShopItem\SettingShopItemConstant;

/**
 * Enrich price rows with actions booleans for frontend (no string checks in UI).
 */
class PriceActionsHelper
{
    /**
     * Add actions (is_coin, is_ruby, is_gear, is_item) to each price row.
     *
     * @param array<int, array> $prices Price rows (each may have 'type' key).
     * @return array<int, array> Prices with 'actions' key added.
     */
    public static function enrichWithActions(array $prices): array
    {
        if (empty($prices)) {
            return [];
        }

        return array_map(function ($p) {
            $t = $p['type'] ?? '';
            $p['actions'] = [
                'is_coin' => SettingShopItemConstant::isPriceCoin($t),
                'is_ruby' => SettingShopItemConstant::isPriceRuby($t),
                'is_gear' => SettingShopItemConstant::isPriceGear($t),
                'is_item' => SettingShopItemConstant::isPriceItem($t),
            ];
            return $p;
        }, $prices);
    }
}
