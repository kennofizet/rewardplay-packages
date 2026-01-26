<?php

namespace Kennofizet\RewardPlay\Models\SettingItemSet;

use Kennofizet\RewardPlay\Core\Model\BaseModelResponse;
use Kennofizet\RewardPlay\Models\SettingItemSet\SettingItemSetConstant;
use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class SettingItemSetModelResponse extends BaseModelResponse
{
    /**
     * Get the default mode
     */
    public static function getAvailableModeDefault(): string
    {
        return SettingItemSetConstant::API_SETTING_ITEM_SET_LIST_PAGE;
    }

    /**
     * Format setting item set data for API response
     */
    public static function formatSettingItemSet($settingItemSet, $mode = ''): array
    {
        if (!$settingItemSet) {
            return [];
        }

        if(in_array($mode, [
            self::getAvailableModeDefault()
        ])){
            $default_reponse = [
                'id' => $settingItemSet->id,
                'name' => $settingItemSet->name,
                'description' => $settingItemSet->description,
                'set_bonuses' => $settingItemSet->set_bonuses,
                'items' => $settingItemSet->items ? $settingItemSet->items->map(function($item) {
                    return [
                        'id' => $item->id,
                        'name' => $item->name,
                        'type' => $item->type,
                        'image' => self::getImageFullUrl($item->image),
                    ];
                })->toArray() : [],
                'items_count' => $settingItemSet->items ? $settingItemSet->items->count() : 0
            ];

            return $default_reponse;
        }elseif(in_array($mode, [
            HelperConstant::REPONSE_MODE_SELECTER_API,
        ])){
            return [
                'id' => $settingItemSet->id,
                'name' => $settingItemSet->name,
            ];
        }

        return [
            'id' => $settingItemSet->id,
            'name' => $settingItemSet->name,
            'description' => $settingItemSet->description,
            'set_bonuses' => $settingItemSet->set_bonuses
        ];
    }

    /**
     * Format setting item sets collection for API response with pagination
     */
    public static function formatSettingItemSets($settingItemSets, ?string $mode = null): array
    {
        $mode = $mode ?? self::getAvailableModeDefault();

        if ($settingItemSets instanceof LengthAwarePaginator) {
            return [
                'data' => $settingItemSets->map(function ($settingItemSet) use ($mode) {
                    return self::formatSettingItemSet($settingItemSet, $mode);
                }),
                'current_page' => $settingItemSets->currentPage(),
                'total' => $settingItemSets->total(),
                'last_page' => $settingItemSets->lastPage()
            ];
        }

        if ($settingItemSets instanceof Collection) {
            return $settingItemSets->map(function ($settingItemSet) use ($mode) {
                return self::formatSettingItemSet($settingItemSet, $mode);
            })->toArray();
        }

        return [];
    }
}
