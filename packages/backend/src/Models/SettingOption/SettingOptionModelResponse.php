<?php

namespace Kennofizet\RewardPlay\Models\SettingOption;

use Kennofizet\RewardPlay\Core\Model\BaseModelResponse;
use Kennofizet\RewardPlay\Models\SettingOption\SettingOptionConstant;
use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class SettingOptionModelResponse extends BaseModelResponse
{
    /**
     * Get the default mode
     */
    public static function getAvailableModeDefault(): string
    {
        return SettingOptionConstant::API_SETTING_OPTION_LIST_PAGE;
    }

    /**
     * Format setting option data for API response
     */
    public static function formatSettingOption($settingOption, $mode = ''): array
    {
        if (!$settingOption) {
            return [];
        }

        if(in_array($mode, [
            self::getAvailableModeDefault()
        ])){
            $default_reponse = [
                'id' => $settingOption->id,
                'name' => $settingOption->name,
                'rates' => $settingOption->rates
            ];

            return $default_reponse;
        }elseif(in_array($mode, [
            HelperConstant::REPONSE_MODE_SELECTER_API,
        ])){
            return [
                'id' => $settingOption->id,
                'name' => $settingOption->name,
            ];
        }

        return [
            'id' => $settingOption->id,
            'name' => $settingOption->name,
            'rates' => $settingOption->rates
        ];
    }

    /**
     * Format setting options collection for API response with pagination
     */
    public static function formatSettingOptions($settingOptions, ?string $mode = null): array
    {
        $mode = $mode ?? self::getAvailableModeDefault();

        if ($settingOptions instanceof LengthAwarePaginator) {
            return [
                'data' => $settingOptions->map(function ($settingOption) use ($mode) {
                    return self::formatSettingOption($settingOption, $mode);
                }),
                'current_page' => $settingOptions->currentPage(),
                'total' => $settingOptions->total(),
                'last_page' => $settingOptions->lastPage()
            ];
        }

        if ($settingOptions instanceof Collection) {
            return $settingOptions->map(function ($settingOption) use ($mode) {
                return self::formatSettingOption($settingOption, $mode);
            })->toArray();
        }

        return [];
    }
}
