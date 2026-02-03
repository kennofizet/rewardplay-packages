<?php

namespace Kennofizet\RewardPlay\Models\SettingLevelExp;

use Kennofizet\RewardPlay\Core\Model\BaseModelResponse;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class SettingLevelExpModelResponse extends BaseModelResponse
{
    /**
     * Get the default mode
     */
    public static function getAvailableModeDefault(): string
    {
        return SettingLevelExpConstant::API_SETTING_LEVEL_EXP_LIST_PAGE;
    }

    /**
     * Format setting level exp data for API response
     */
    public static function formatSettingLevelExp($levelExp, string $mode = ''): array
    {
        if (!$levelExp) {
            return [];
        }

        return [
            'id' => $levelExp->id,
            'lv' => $levelExp->lv,
            'exp_needed' => $levelExp->exp_needed
        ];
    }

    /**
     * Format setting level exps collection for API response with pagination
     */
    public static function formatSettingLevelExps($settingLevelExps, ?string $mode = null): array
    {
        $mode = $mode ?? self::getAvailableModeDefault();

        if ($settingLevelExps instanceof LengthAwarePaginator) {
            return [
                'data' => $settingLevelExps->map(function ($levelExp) use ($mode) {
                    return self::formatSettingLevelExp($levelExp, $mode);
                })->values()->all(),
                'current_page' => $settingLevelExps->currentPage(),
                'total' => $settingLevelExps->total(),
                'last_page' => $settingLevelExps->lastPage(),
            ];
        }

        if ($settingLevelExps instanceof Collection) {
            return $settingLevelExps->map(function ($levelExp) use ($mode) {
                return self::formatSettingLevelExp($levelExp, $mode);
            })->values()->all();
        }

        return [];
    }
}
