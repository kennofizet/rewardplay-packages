<?php

namespace Kennofizet\RewardPlay\Models\SettingStackBonus;

use Kennofizet\RewardPlay\Core\Model\BaseModelResponse;
use Kennofizet\RewardPlay\Models\SettingStackBonus\SettingStackBonusConstant;
use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;
use Kennofizet\RewardPlay\Helpers\RewardItemActionsHelper;
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

        $rewardsRaw = $settingStackBonus->rewards ?? [];
        $rewardsWithActions = RewardItemActionsHelper::enrichWithActions(is_array($rewardsRaw) ? $rewardsRaw : []);

        if(in_array($mode, [
            self::getAvailableModeDefault()
        ])){
            $default_reponse = [
                'id' => $settingStackBonus->id,
                'name' => $settingStackBonus->name,
                'day' => $settingStackBonus->day,
                'rewards' => $rewardsWithActions
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
        }elseif(in_array($mode, [
            SettingStackBonusConstant::PLAYER_API_RESPONSE_REWARD_PAGE,
        ])){
            return [
                'rewards' => $rewardsWithActions,
                'day' => $settingStackBonus->day,
                'name' => $settingStackBonus->name,
            ];
        }

        return [
            'id' => $settingStackBonus->id,
            'name' => $settingStackBonus->name,
            'day' => $settingStackBonus->day,
            'rewards' => $rewardsWithActions
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
