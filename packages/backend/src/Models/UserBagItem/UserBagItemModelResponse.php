<?php

namespace Kennofizet\RewardPlay\Models\UserBagItem;

use Kennofizet\RewardPlay\Core\Model\BaseModelResponse;
use Kennofizet\RewardPlay\Models\UserBagItem\UserBagItemConstant;
use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;
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
     * Format user bag item data for API response
     */
    public static function formatUserBagItem($userBagItem, $mode = ''): array
    {
        if (!$userBagItem) {
            return [];
        }

        if(in_array($mode, [
            self::getAvailableModeDefault()
        ])){
            $default_reponse = [
                'id' => $userBagItem->id,
                'user_id' => $userBagItem->user_id,
                'item_id' => $userBagItem->item_id,
                'quantity' => $userBagItem->quantity,
                'properties' => $userBagItem->properties ?? [],
                'acquired_at' => $userBagItem->acquired_at,
                'item' => $userBagItem->item ? [
                    'id' => $userBagItem->item->id,
                    'name' => $userBagItem->item->name,
                    'slug' => $userBagItem->item->slug,
                    'type' => $userBagItem->item->type,
                    'image' => self::getImageFullUrl($userBagItem->item->image),
                ] : null
            ];

            return $default_reponse;
        }elseif(in_array($mode, [
            HelperConstant::REPONSE_MODE_SELECTER_API,
        ])){
            return [
                'id' => $userBagItem->id,
                'item_id' => $userBagItem->item_id,
                'quantity' => $userBagItem->quantity,
            ];
        }

        return [
            'id' => $userBagItem->id,
            'user_id' => $userBagItem->user_id,
            'item_id' => $userBagItem->item_id,
            'quantity' => $userBagItem->quantity,
            'properties' => $userBagItem->properties ?? []
        ];
    }

    /**
     * Format user bag items collection for API response with pagination
     */
    public static function formatUserBagItems($userBagItems, ?string $mode = null): array
    {
        $mode = $mode ?? self::getAvailableModeDefault();

        if ($userBagItems instanceof LengthAwarePaginator) {
            return [
                'data' => $userBagItems->map(function ($userBagItem) use ($mode) {
                    return self::formatUserBagItem($userBagItem, $mode);
                }),
                'current_page' => $userBagItems->currentPage(),
                'total' => $userBagItems->total(),
                'last_page' => $userBagItems->lastPage()
            ];
        }

        if ($userBagItems instanceof Collection) {
            return $userBagItems->map(function ($userBagItem) use ($mode) {
                return self::formatUserBagItem($userBagItem, $mode);
            })->toArray();
        }

        if(is_array($userBagItems)){
            return array_map(function ($userBagItem) use ($mode) {
                return self::formatUserBagItem($userBagItem, $mode);
            }, $userBagItems);
        }

        return [];
    }
}
