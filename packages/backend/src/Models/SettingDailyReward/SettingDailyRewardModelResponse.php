<?php

namespace Kennofizet\RewardPlay\Models\SettingDailyReward;

use Kennofizet\RewardPlay\Core\Model\BaseModelResponse;
use Kennofizet\RewardPlay\Models\SettingDailyReward\SettingDailyRewardConstant;
use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class SettingDailyRewardModelResponse extends BaseModelResponse
{
    /**
     * Get the default mode
     */
    public static function getAvailableModeDefault(): string
    {
        return SettingDailyRewardConstant::API_SETTING_DAILY_REWARD_LIST_PAGE;
    }

    /**
     * Format setting daily reward data for API response
     */
    public static function formatSettingDailyReward($settingDailyReward, $mode = ''): array
    {
        if (!$settingDailyReward) {
            return [];
        }

        if(in_array($mode, [
            self::getAvailableModeDefault()
        ])){
            $default_reponse = [
                'id' => $settingDailyReward->id,
                'date' => $settingDailyReward->date,
                'items' => $settingDailyReward->items ?? [],
                'stack_bonuses' => $settingDailyReward->stack_bonuses ?? [],
                'is_active' => $settingDailyReward->is_active ?? false,
                'is_epic' => $settingDailyReward->is_epic ?? false
            ];

            return $default_reponse;
        }elseif(in_array($mode, [
            HelperConstant::REPONSE_MODE_SELECTER_API,
        ])){
            return [
                'id' => $settingDailyReward->id,
                'date' => $settingDailyReward->date,
                'is_epic' => $settingDailyReward->is_epic ?? false,
            ];
        }

        return [
            'id' => $settingDailyReward->id,
            'date' => $settingDailyReward->date,
            'items' => $settingDailyReward->items ?? [],
            'stack_bonuses' => $settingDailyReward->stack_bonuses ?? [],
            'is_active' => $settingDailyReward->is_active ?? false,
            'is_epic' => $settingDailyReward->is_epic ?? false,
        ];
    }

    /**
     * Format setting daily rewards collection for API response with pagination
     */
    public static function formatSettingDailyRewards($settingDailyRewards, ?string $mode = null): array
    {
        $mode = $mode ?? self::getAvailableModeDefault();

        if ($settingDailyRewards instanceof LengthAwarePaginator) {
            return [
                'data' => $settingDailyRewards->map(function ($settingDailyReward) use ($mode) {
                    return self::formatSettingDailyReward($settingDailyReward, $mode);
                }),
                'current_page' => $settingDailyRewards->currentPage(),
                'total' => $settingDailyRewards->total(),
                'last_page' => $settingDailyRewards->lastPage()
            ];
        }

        if ($settingDailyRewards instanceof Collection) {
            return $settingDailyRewards->map(function ($settingDailyReward) use ($mode) {
                return self::formatSettingDailyReward($settingDailyReward, $mode);
            })->toArray();
        }

        return [];
    }
}
