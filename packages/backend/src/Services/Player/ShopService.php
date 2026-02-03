<?php

namespace Kennofizet\RewardPlay\Services\Player;

use Kennofizet\RewardPlay\Models\SettingShopItem;
use Kennofizet\RewardPlay\Models\SettingShopItem\SettingShopItemConstant;
use Kennofizet\RewardPlay\Models\User;
use Kennofizet\RewardPlay\Models\SettingItem\SettingItemConstant;
use Kennofizet\RewardPlay\Core\Model\BaseModelResponse;
use Kennofizet\RewardPlay\Models\UserBagItem\UserBagItemModelResponse;
use Kennofizet\RewardPlay\Models\UserBagItem\UserBagItemConstant;
use Kennofizet\RewardPlay\Helpers\RateListHelper;
use Kennofizet\RewardPlay\Helpers\PriceActionsHelper;

class ShopService
{
    public function __construct(
        protected BagService $bagService
    ) {
    }

    /**
     * Get active shop items for the current zone (for shop page).
     *
     * @return array{shop_items: array}
     */
    public function getActiveShopItems(): array
    {
        $items = SettingShopItem::query()
            ->activeNow()
            ->with('settingItem')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        $list = $items->map(function ($row) {
            $item = $row->settingItem;
            $settingItemType = $item->type ?? '';
            return [
                'id' => $row->id,
                'name' => $item->name ?? '',
                'description' => $item->description ?? '',
                'image' => BaseModelResponse::getImageFullUrl($item->image ?? null),
                'type' => $settingItemType ?: SettingItemConstant::ITEM_TYPE_GEAR,
                'category' => $row->category ?? SettingShopItemConstant::CATEGORY_GEAR,
                'prices' => self::formatPrices($row->prices),
                'options' => self::formatOptions($row->options),
                'isEvent' => !empty($row->event_id),
                'actions' => [
                    'is_box_random' => SettingItemConstant::isBoxRandom($settingItemType),
                    'is_gear' => SettingItemConstant::isGearSlotType($settingItemType),
                ],
            ];
        })->values()->all();

        return ['shop_items' => $list];
    }

    /**
     * Purchase a shop item (deduct price, add item to bag).
     * Returns array with success true and data, or success false with message and status code.
     *
     * @param int $userId
     * @param int $shopItemId
     * @param int $quantity
     * @return array{success: bool, user_bag?: array, coin?: int, ruby?: int, message?: string, status?: int}
     */
    public function purchase(int $userId, int $shopItemId, int $quantity): array
    {
        $quantity = max(1, min(999, $quantity));

        $shopItem = SettingShopItem::query()
            ->activeNow()
            ->with('settingItem')
            ->find($shopItemId);

        if (!$shopItem || !$shopItem->settingItem) {
            return ['success' => false, 'message' => 'Shop item not found or not available', 'status' => 404];
        }

        $prices = $shopItem->prices ?? [];
        if (empty($prices)) {
            return ['success' => false, 'message' => 'Item has no price', 'status' => 400];
        }

        $user = User::findById($userId);
        if (!$user) {
            return ['success' => false, 'message' => 'User not found', 'status' => 401];
        }

        $totalCoin = 0;
        $totalRuby = 0;
        foreach ($prices as $p) {
            $type = $p['type'] ?? '';
            $val = (int) ($p['value'] ?? 0);
            if (SettingShopItemConstant::isPriceCoin($type)) {
                $totalCoin += $val;
            } elseif (SettingShopItemConstant::isPriceRuby($type)) {
                $totalRuby += $val;
            }
        }
        $totalCoin *= $quantity;
        $totalRuby *= $quantity;

        if ($totalCoin > 0 && $user->getCoin() < $totalCoin) {
            return ['success' => false, 'message' => 'Insufficient coin', 'status' => 400];
        }
        if ($totalRuby > 0 && $user->getRuby() < $totalRuby) {
            return ['success' => false, 'message' => 'Insufficient ruby', 'status' => 400];
        }

        $user->deductCoin($totalCoin);
        $user->deductRuby($totalRuby);

        $item = $shopItem->settingItem;
        $itemType = SettingItemConstant::isGearSlotType($item->type ?? null)
            ? SettingItemConstant::ITEM_TYPE_GEAR
            : ($item->type ?? 'other');
        $properties = $shopItem->options ?? [];
        if (SettingItemConstant::isBoxRandom($item->type ?? null)) {
            $rateList = $properties[SettingItemConstant::BOX_RANDOM_RATE_LIST] ?? null;
            if (empty($rateList) && is_array($item->default_property ?? null)) {
                $properties = $item->default_property;
            }
        }

        for ($i = 0; $i < $quantity; $i++) {
            $user->giveItem([
                'item_id' => $item->id,
                'item_type' => $itemType,
                'quantity' => 1,
                'properties' => $properties,
            ]);
        }

        $categorized = $this->bagService->getUserBagCategorized($userId);
        $formattedBag = [];
        foreach ($categorized as $cat => $items) {
            $formattedBag[$cat] = UserBagItemModelResponse::formatUserBagItems(
                $items,
                UserBagItemConstant::PLAYER_API_RESPONSE_BAG_PAGE
            );
        }

        return [
            'success' => true,
            'user_bag' => $formattedBag,
            'coin' => $user->getCoin(),
            'ruby' => $user->getRuby(),
        ];
    }

    private static function formatOptions(array $options): array
    {
        $rateList = $options['rate_list'] ?? null;
        if (is_array($rateList) && !empty($rateList)) {
            $dataEnrich = RateListHelper::enrichWithItemNames($rateList);
            $options['rate_list'] = array_map(function (array $item): array {
                return [
                    'count' => $item['count'] ?? 0,
                    'item_name' => $item['item_name'] ?? '',
                    'rate' => $item['rate'] ?? 0,
                ];
            }, $dataEnrich);
        }

        return $options;
    }

    private static function formatPrices(array $prices): array
    {
        // need pass check count current can buy for case buy with item
        return $prices;
    }
}
