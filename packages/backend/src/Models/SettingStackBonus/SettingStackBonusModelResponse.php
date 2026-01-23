<?php

namespace Kennofizet\RewardPlay\Models\SettingStackBonus;

use Kennofizet\RewardPlay\Core\Model\BaseModelResponse;
use Kennofizet\RewardPlay\Models\SettingStackBonus\SettingStackBonusConstant;
use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class SettingStackBonusModelResponse extends BaseModelResponse
{
    /**
     * Get the default mode
     */
    public static function getAvailableModeDefault(): string
    {
        return SettingStackBonusConstant::API_SETTING_STACK_BONUS_LIST_PAGE;
    }

    /**
     * Format setting stack bonus data for API response
     */
    public static function formatSettingStackBonus($settingStackBonus, $mode = ''): array
    {
        if (!$settingStackBonus) {
            return [];
        }

        if(in_array($mode, [
            self::getAvailableModeDefault()
        ])){
            $default_reponse = [
                'id' => $settingStackBonus->id,
                'name' => $settingStackBonus->name,
                'day' => $settingStackBonus->day,
                'rewards' => $settingStackBonus->rewards ?? [],
                'is_active' => $settingStackBonus->is_active ?? false
            ];

            return $default_reponse;
        }elseif(in_array($mode, [
            HelperConstant::REPONSE_MODE_SELECTER_API,
        ])){
            return [
                'id' => $settingStackBonus->id,
                'name' => $settingStackBonus->name,
                'day' => $settingStackBonus->day,
            ];
        }

        return [
            'id' => $settingStackBonus->id,
            'name' => $settingStackBonus->name,
            'day' => $settingStackBonus->day,
            'rewards' => $settingStackBonus->rewards ?? [],
            'is_active' => $settingStackBonus->is_active ?? false,
        ];
    }

    /**
     * Format setting stack bonuses collection for API response with pagination
     */
    public static function formatSettingStackBonuses($settingStackBonuses, ?string $mode = null): array
    {
        $mode = $mode ?? self::getAvailableModeDefault();

        if ($settingStackBonuses instanceof LengthAwarePaginator) {
            return [
                'data' => $settingStackBonuses->map(function ($settingStackBonus) use ($mode) {
                    return self::formatSettingStackBonus($settingStackBonus, $mode);
                }),
                'current_page' => $settingStackBonuses->currentPage(),
                'total' => $settingStackBonuses->total(),
                'last_page' => $settingStackBonuses->lastPage()
            ];
        }

        if ($settingStackBonuses instanceof Collection) {
            return $settingStackBonuses->map(function ($settingStackBonus) use ($mode) {
                return self::formatSettingStackBonus($settingStackBonus, $mode);
            })->toArray();
        }

        return [];
    }
}
