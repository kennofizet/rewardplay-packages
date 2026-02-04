<?php

namespace Kennofizet\RewardPlay\Models\SettingDailyReward;

use Kennofizet\RewardPlay\Core\Model\BaseModelResponse;
use Kennofizet\RewardPlay\Models\SettingDailyReward\SettingDailyRewardConstant;
use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;
use Kennofizet\RewardPlay\Helpers\RewardItemActionsHelper;
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
            $items = $settingDailyReward->items ?? [];
            $itemsWithActions = RewardItemActionsHelper::enrichWithActions(is_array($items) ? $items : []);
            $default_reponse = [
                'id' => $settingDailyReward->id,
                'date' => $settingDailyReward->date,
                'items' => $itemsWithActions,
                'stack_bonuses' => $settingDailyReward->stack_bonuses ?? [],
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
        }elseif(in_array($mode, [
            SettingDailyRewardConstant::PLAYER_API_RESPONSE_REWARD_PAGE,
        ])){
            $items = $settingDailyReward->items ?? [];
            $itemsWithActions = RewardItemActionsHelper::enrichWithActions(is_array($items) ? $items : []);
            // Read 'claimed' from attributes array to avoid Laravel MissingAttributeException (set at runtime by DailyRewardService, not a DB column)
            $attrs = $settingDailyReward->getAttributes();
            $claimed = array_key_exists('claimed', $attrs) ? (bool) $attrs['claimed'] : false;
            return [
                'is_epic' => $settingDailyReward->is_epic,
                'items' => $itemsWithActions,
                'stack_bonuses' => $settingDailyReward->stack_bonuses,
                'date' => $settingDailyReward->date,
                'claimed' => $claimed,
            ];
        }

        $items = $settingDailyReward->items ?? [];
        $itemsWithActions = RewardItemActionsHelper::enrichWithActions(is_array($items) ? $items : []);
        return [
            'id' => $settingDailyReward->id,
            'date' => $settingDailyReward->date,
            'items' => $itemsWithActions,
            'stack_bonuses' => $settingDailyReward->stack_bonuses ?? [],
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
