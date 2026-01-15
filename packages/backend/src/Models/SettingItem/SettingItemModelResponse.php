<?php

namespace Kennofizet\RewardPlay\Models\SettingItem;

use Kennofizet\RewardPlay\Core\Model\BaseModelResponse;
use Kennofizet\RewardPlay\Models\SettingItem\SettingItemConstant;
use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class SettingItemModelResponse extends BaseModelResponse
{
    /**
     * Get the default mode
     */
    public static function getAvailableModeDefault(): string
    {
        return SettingItemConstant::API_SETTING_ITEM_LIST_PAGE;
    }

    /**
     * Format setting item data for API response
     */
    public static function formatSettingItem($settingItem, $mode = ''): array
    {
        if (!$settingItem) {
            return [];
        }

        if(in_array($mode, [
            self::getAvailableModeDefault()
        ])){
            $default_reponse = [
                'id' => $settingItem->id,
                'name' => $settingItem->name,
                'slug' => $settingItem->slug,
                'description' => $settingItem->description,
                'type' => $settingItem->type,
                'default_property' => $settingItem->default_property,
                'image' => $settingItem->image,
                'zone_id' => $settingItem->zone_id,
                'zone' => $settingItem->zone ? [
                    'id' => $settingItem->zone->id,
                    'name' => $settingItem->zone->name,
                ] : null,
                'created_at' => $settingItem->created_at,
                'updated_at' => $settingItem->updated_at,
            ];

            return $default_reponse;
        }elseif(in_array($mode, [
            HelperConstant::REPONSE_MODE_SELECTER_API,
        ])){
            return [
                'id' => $settingItem->id,
                'name' => $settingItem->name,
                'slug' => $settingItem->slug,
            ];
        }

        return [
            'id' => $settingItem->id,
            'name' => $settingItem->name,
            'slug' => $settingItem->slug,
            'description' => $settingItem->description,
            'type' => $settingItem->type,
            'default_property' => $settingItem->default_property,
            'image' => $settingItem->image,
            'zone_id' => $settingItem->zone_id,
        ];
    }

    /**
     * Format setting items collection for API response with pagination
     */
    public static function formatSettingItems($settingItems, ?string $mode = null): array
    {
        $mode = $mode ?? self::getAvailableModeDefault();

        if ($settingItems instanceof LengthAwarePaginator) {
            return [
                'data' => $settingItems->map(function ($settingItem) use ($mode) {
                    return self::formatSettingItem($settingItem, $mode);
                }),
                'current_page' => $settingItems->currentPage(),
                'total' => $settingItems->total(),
                'last_page' => $settingItems->lastPage()
            ];
        }

        if ($settingItems instanceof Collection) {
            return $settingItems->map(function ($settingItem) use ($mode) {
                return self::formatSettingItem($settingItem, $mode);
            })->toArray();
        }

        return [];
    }
}

