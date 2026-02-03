<?php

namespace Kennofizet\RewardPlay\Helpers;

/**
 * Enrich reward items (daily reward, stack bonus) with actions booleans for frontend.
 * Use this instead of duplicating the array_map logic in model responses.
 */
class RewardItemActionsHelper
{
    /**
     * Add actions (is_gear, is_coin, is_exp) to each reward item.
     *
     * @param array<int, array> $items Reward items (each may have 'type' key).
     * @return array<int, array> Items with 'actions' key added.
     */
    public static function enrichWithActions(array $items): array
    {
        if (empty($items)) {
            return [];
        }

        return array_map(function ($item) {
            $t = is_array($item) ? ($item['type'] ?? '') : '';
            $arr = is_array($item) ? $item : [];
            $arr['actions'] = [
                'is_gear' => Constant::isRewardGear($t),
                'is_coin' => Constant::isRewardCoin($t),
                'is_exp' => Constant::isRewardExp($t),
            ];
            return $arr;
        }, $items);
    }
}
