<?php

namespace Kennofizet\RewardPlay\Models\SettingShopItem;

use Kennofizet\RewardPlay\Core\Model\BaseModelResponse;
use Kennofizet\RewardPlay\Helpers\RateListHelper;
use Kennofizet\RewardPlay\Helpers\PriceActionsHelper;
use Kennofizet\RewardPlay\Models\SettingItem;
use Kennofizet\RewardPlay\Models\SettingItem\SettingItemConstant;
use Kennofizet\RewardPlay\Models\SettingShopItem\SettingShopItemConstant;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class SettingShopItemModelResponse
{
    /**
     * Format a single setting shop item for API response.
     *
     * @param array<int, string>|null $rateListNamesMap optional id => name for enriching options.rate_list
     */
    public static function formatSettingShopItem($shopItem, string $mode = '', ?array $rateListNamesMap = null): array
    {
        if (!$shopItem) {
            return [];
        }

        $options = $shopItem->options ?? [];
        $rateList = $options['rate_list'] ?? null;
        if (is_array($rateList) && !empty($rateList)) {
            $options = array_merge([], $options);
            $options['rate_list'] = RateListHelper::enrichWithItemNames($rateList, $rateListNamesMap);
        }

        $category = $shopItem->category ?? SettingShopItemConstant::CATEGORY_GEAR;
        $item = $shopItem->relationLoaded('settingItem') ? $shopItem->settingItem : null;
        $settingItemType = $item ? ($item->type ?? '') : '';
        $pricesRaw = $shopItem->prices ?? [];
        $pricesWithActions = PriceActionsHelper::enrichWithActions(is_array($pricesRaw) ? $pricesRaw : []);

        $base = [
            'id' => $shopItem->id,
            'zone_id' => $shopItem->zone_id,
            'setting_item_id' => $shopItem->setting_item_id,
            'event_id' => $shopItem->event_id,
            'category' => $category,
            'prices' => $pricesWithActions,
            'sort_order' => (int) ($shopItem->sort_order ?? 0),
            'time_start' => $shopItem->time_start?->toIso8601String(),
            'time_end' => $shopItem->time_end?->toIso8601String(),
            'options' => $options,
            'is_active' => (bool) ($shopItem->is_active ?? true),
            'actions' => [
                'is_category_gear' => SettingShopItemConstant::isCategoryGear($category),
                'is_category_event' => SettingShopItemConstant::isCategoryEvent($category),
                'is_category_ticket' => SettingShopItemConstant::isCategoryTicket($category),
                'is_category_box_random' => SettingShopItemConstant::isCategoryBoxRandom($category),
                'is_gear' => SettingItemConstant::isGearSlotType($settingItemType),
            ],
        ];
        $base['setting_item'] = $item
            ? [
                'id' => $item->id,
                'name' => $item->name,
                'slug' => $item->slug,
                'type' => $item->type,
                'image' => BaseModelResponse::getImageFullUrl($item->image),
                'description' => $item->description,
                'default_property' => $item->default_property ?? null,
            ]
            : [];

        return $base;
    }

    /**
     * Format setting shop items collection for API response (paginated or collection).
     */
    public static function formatSettingShopItems($items, ?string $mode = null): array
    {
        $m = $mode ?? '';
        $rateListNamesMap = [];
        $itemsForMap = $items instanceof LengthAwarePaginator ? $items->items() : ($items instanceof Collection ? $items->all() : []);
        if (!empty($itemsForMap)) {
            $ids = RateListHelper::collectRateListItemIds($itemsForMap, 'options');
            if (!empty($ids)) {
                $names = SettingItem::whereIn('id', $ids)->get(['id', 'name']);
                foreach ($names as $n) {
                    $rateListNamesMap[(int) $n->id] = $n->name ?? '';
                }
            }
        }
        $formatOne = fn ($e) => self::formatSettingShopItem($e, $m, $rateListNamesMap);

        if ($items instanceof LengthAwarePaginator) {
            return [
                'data' => $items->map($formatOne)->values()->all(),
                'current_page' => $items->currentPage(),
                'total' => $items->total(),
                'last_page' => $items->lastPage(),
            ];
        }
        if ($items instanceof Collection) {
            return $items->map($formatOne)->values()->all();
        }

        return [];
    }
}
