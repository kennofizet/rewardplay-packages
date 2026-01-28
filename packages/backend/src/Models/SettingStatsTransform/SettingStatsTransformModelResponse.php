<?php

namespace Kennofizet\RewardPlay\Models\SettingStatsTransform;

use Kennofizet\RewardPlay\Core\Model\BaseModelResponse;
use Kennofizet\RewardPlay\Models\SettingStatsTransform\SettingStatsTransformConstant;
use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class SettingStatsTransformModelResponse extends BaseModelResponse
{
    /**
     * Get the default mode
     */
    public static function getAvailableModeDefault(): string
    {
        return SettingStatsTransformConstant::API_SETTING_STATS_TRANSFORM_LIST_PAGE;
    }

    /**
     * Format setting stats transform data for API response
     */
    public static function formatSettingStatsTransform($settingStatsTransform, $mode = ''): array
    {
        if (!$settingStatsTransform) {
            return [];
        }

        if(in_array($mode, [
            self::getAvailableModeDefault()
        ])){
            $default_reponse = [
                'id' => $settingStatsTransform->id,
                'target_key' => $settingStatsTransform->target_key,
                'conversions' => $settingStatsTransform->conversions ?? []
            ];

            return $default_reponse;
        }elseif(in_array($mode, [
            HelperConstant::REPONSE_MODE_SELECTER_API,
        ])){
            return [
                'id' => $settingStatsTransform->id,
                'target_key' => $settingStatsTransform->target_key,
            ];
        }

        return [
            'id' => $settingStatsTransform->id,
            'target_key' => $settingStatsTransform->target_key,
            'conversions' => $settingStatsTransform->conversions ?? []
        ];
    }

    /**
     * Format setting stats transforms collection for API response with pagination
     */
    public static function formatSettingStatsTransforms($settingStatsTransforms, ?string $mode = null): array
    {
        $mode = $mode ?? self::getAvailableModeDefault();

        if ($settingStatsTransforms instanceof LengthAwarePaginator) {
            return [
                'data' => $settingStatsTransforms->map(function ($settingStatsTransform) use ($mode) {
                    return self::formatSettingStatsTransform($settingStatsTransform, $mode);
                }),
                'current_page' => $settingStatsTransforms->currentPage(),
                'total' => $settingStatsTransforms->total(),
                'last_page' => $settingStatsTransforms->lastPage()
            ];
        }

        if ($settingStatsTransforms instanceof Collection) {
            return $settingStatsTransforms->map(function ($settingStatsTransform) use ($mode) {
                return self::formatSettingStatsTransform($settingStatsTransform, $mode);
            })->toArray();
        }

        return [];
    }
}
