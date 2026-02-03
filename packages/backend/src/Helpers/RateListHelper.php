<?php

namespace Kennofizet\RewardPlay\Helpers;

use Kennofizet\RewardPlay\Models\SettingItem;

/**
 * Enrich rate_list entries with item names for display (bag, shop, setting shop).
 */
class RateListHelper
{
    /**
     * Enrich a single rate_list array with item_name for each entry.
     * Optionally pass a pre-fetched map [ setting_item_id => name ] to avoid N+1.
     *
     * @param array<int, array{setting_item_id?: int|null, rate?: mixed, count?: mixed}> $rateList
     * @param array<int, string>|null $namesMap id => name (if null, will query)
     * @return array<int, array{setting_item_id?: int|null, rate?: mixed, count?: mixed, item_name?: string|null}>
     */
    public static function enrichWithItemNames(array $rateList, ?array $namesMap = null): array
    {
        if (empty($rateList)) {
            return $rateList;
        }

        if ($namesMap === null) {
            $ids = array_unique(array_filter(array_column($rateList, 'setting_item_id')));
            $namesMap = [];
            if (!empty($ids)) {
                $items = SettingItem::whereIn('id', $ids)->get(['id', 'name']);
                foreach ($items as $item) {
                    $namesMap[(int) $item->id] = $item->name ?? '';
                }
            }
        }

        return array_map(function ($e) use ($namesMap) {
            $entry = is_array($e) ? $e : (array) $e;
            $id = isset($entry['setting_item_id']) ? (int) $entry['setting_item_id'] : null;
            $entry['item_name'] = $id !== null && isset($namesMap[$id]) ? $namesMap[$id] : null;
            return $entry;
        }, $rateList);
    }

    /**
     * Collect all setting_item_ids from rate_lists in an array of items.
     * Each item may have 'options' => [ 'rate_list' => [...] ] or 'properties' => [ 'rate_list' => [...] ].
     *
     * @param iterable $items
     * @param string $key 'options' or 'properties'
     * @return array<int>
     */
    public static function collectRateListItemIds(iterable $items, string $key = 'options'): array
    {
        $ids = [];
        foreach ($items as $item) {
            $container = is_array($item) ? ($item[$key] ?? []) : ($item->$key ?? []);
            if (!is_array($container)) {
                continue;
            }
            $list = $container['rate_list'] ?? null;
            if (!is_array($list)) {
                continue;
            }
            foreach ($list as $e) {
                $id = isset($e['setting_item_id']) ? (int) $e['setting_item_id'] : null;
                if ($id !== null) {
                    $ids[$id] = true;
                }
            }
        }
        return array_keys($ids);
    }
}
