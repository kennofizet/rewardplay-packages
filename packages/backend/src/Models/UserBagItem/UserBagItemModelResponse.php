<?php

namespace Kennofizet\RewardPlay\Models\UserBagItem;

use Kennofizet\RewardPlay\Core\Model\BaseModelResponse;
use Kennofizet\RewardPlay\Models\UserBagItem\UserBagItemConstant;
use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;
use Kennofizet\RewardPlay\Helpers\RateListHelper;
use Kennofizet\RewardPlay\Models\SettingItem;
use Kennofizet\RewardPlay\Models\SettingItem\SettingItemConstant;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class UserBagItemModelResponse extends BaseModelResponse
{
    /**
     * Get the default mode
     */
    public static function getAvailableModeDefault(): string
    {
        return UserBagItemConstant::PLAYER_API_RESPONSE_BAG_PAGE;
    }

    /**
     * Format user bag item data for API response.
     *
     * @param array<int, string>|null $rateListNamesMap optional id => name for enriching properties.rate_list
     */
    public static function formatUserBagItem($userBagItem, $mode = '', ?array $rateListNamesMap = null): array
    {
        if (!$userBagItem) {
            return [];
        }

        if(in_array($mode, [
            self::getAvailableModeDefault()
        ])){
            $properties = $userBagItem->properties ?? [];
            $rateList = $properties['rate_list'] ?? null;
            if (is_array($rateList) && !empty($rateList)) {
                $properties = array_merge([], $properties);
                $properties['rate_list'] = RateListHelper::enrichWithItemNames($rateList, $rateListNamesMap);
            }
            $itemType = $userBagItem->item_type ?? '';
            $default_reponse = [
                'id' => $userBagItem->id,
                'quantity' => $userBagItem->quantity,
                'properties' => $properties,
                'item_type' => $userBagItem->item_type,
                'actions' => [
                    'is_box_random' => SettingItemConstant::isBoxRandom($itemType),
                    'is_gear' => SettingItemConstant::isGear($itemType),
                ],
                'item' => $userBagItem->item ? [
                    'type' => $userBagItem->item->type,
                    'name' => $userBagItem->item->name,
                    'image' => self::getImageFullUrl($userBagItem->item->image),
                ] : null
            ];

            return $default_reponse;
        }elseif(in_array($mode, [
            HelperConstant::REPONSE_MODE_SELECTER_API,
        ])){
            $t = $userBagItem->item_type ?? '';
            return [
                'id' => $userBagItem->id,
                'item_type' => $userBagItem->item_type,
                'quantity' => $userBagItem->quantity,
                'properties' => $userBagItem->properties ?? [],
                'actions' => [
                    'is_box_random' => SettingItemConstant::isBoxRandom($t),
                    'is_gear' => SettingItemConstant::isGear($t),
                ],
            ];
        }

        $t = $userBagItem->item_type ?? '';
        return [
            'id' => $userBagItem->id,
            'item_type' => $userBagItem->item_type,
            'quantity' => $userBagItem->quantity,
            'properties' => $userBagItem->properties ?? [],
            'actions' => [
                'is_box_random' => SettingItemConstant::isBoxRandom($t),
                'is_gear' => SettingItemConstant::isGear($t),
            ],
        ];
    }

    /**
     * Format user bag items collection for API response with pagination
     */
    public static function formatUserBagItems($userBagItems, ?string $mode = null): array
    {
        $mode = $mode ?? self::getAvailableModeDefault();
        $rateListNamesMap = [];
        $itemsForMap = $userBagItems instanceof LengthAwarePaginator
            ? $userBagItems->items()
            : ($userBagItems instanceof Collection ? $userBagItems->all() : $userBagItems);
        if (is_array($itemsForMap)) {
            $ids = RateListHelper::collectRateListItemIds($itemsForMap, 'properties');
            if (!empty($ids)) {
                $names = SettingItem::whereIn('id', $ids)->get(['id', 'name']);
                foreach ($names as $n) {
                    $rateListNamesMap[(int) $n->id] = $n->name ?? '';
                }
            }
        }

        $formatOne = function ($userBagItem) use ($mode, $rateListNamesMap) {
            return self::formatUserBagItem($userBagItem, $mode, $rateListNamesMap);
        };

        if ($userBagItems instanceof LengthAwarePaginator) {
            return [
                'data' => $userBagItems->map($formatOne)->values()->all(),
                'current_page' => $userBagItems->currentPage(),
                'total' => $userBagItems->total(),
                'last_page' => $userBagItems->lastPage()
            ];
        }

        if ($userBagItems instanceof Collection) {
            return $userBagItems->map($formatOne)->values()->all();
        }

        if (is_array($userBagItems)) {
            return array_map($formatOne, $userBagItems);
        }

        return [];
    }

    /**
     * Add actions to a gears array (slot => row) for API response.
     * Each row must have item_type (or item.type); adds actions.is_box_random, actions.is_gear.
     *
     * @param array<string, array> $gears - Gears keyed by slot (e.g. sword => [ item_id, item_type, item, ... ])
     * @return array<string, array> - Same structure with actions added to each row
     */
    public static function formatGearWearWithActions(array $gears): array
    {
        $out = [];
        foreach ($gears as $slot => $row) {
            if (!is_array($row)) {
                $out[$slot] = $row;
                continue;
            }
            $itemType = $row['item_type'] ?? ($row['item']['type'] ?? null);
            $out[$slot] = $row + [
                'actions' => [
                    'is_gear' => SettingItemConstant::isGear($itemType) || SettingItemConstant::isGearSlotType($itemType),
                ],
            ];

            $attr_keep = ['actions', 'item', 'properties'];
            $out[$slot] = array_intersect_key($out[$slot], array_flip($attr_keep));
        }
        return $out;
    }

    public static function formatCurrentSets(array $currentSets): array
    {
        $out = [];
        foreach ($currentSets as $set) {
            $out[] = [
                'current_bonus' => $set['current_bonus'] ?? [],
                'item_count' => $set['item_count'],
                'set_name' => $set['set_name'],
                'total_items' => $set['total_items']
            ];
        }
        return $out;
    }
}
