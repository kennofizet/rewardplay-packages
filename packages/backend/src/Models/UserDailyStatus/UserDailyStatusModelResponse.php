<?php

namespace Kennofizet\RewardPlay\Models\UserDailyStatus;

use Kennofizet\RewardPlay\Core\Model\BaseModelResponse;
use Kennofizet\RewardPlay\Models\UserDailyStatus\UserDailyStatusConstant;
use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class UserDailyStatusModelResponse extends BaseModelResponse
{
    public static function getAvailableModeDefault(): string
    {
        return UserDailyStatusConstant::API_USER_DAILY_STATUS_LIST_PAGE;
    }

    public static function formatUserDailyStatus($userDailyStatus, $mode = ''): array
    {
        if (!$userDailyStatus) {
            return [];
        }

        if(in_array($mode, [
            self::getAvailableModeDefault()
        ])){
            return [
                'id' => $userDailyStatus->id,
                'user_id' => $userDailyStatus->user_id,
                'last_login_date' => $userDailyStatus->last_login_date,
                'consecutive_login_days' => $userDailyStatus->consecutive_login_days,
                'last_claim_date' => $userDailyStatus->last_claim_date,
                'created_at' => $userDailyStatus->created_at,
                'updated_at' => $userDailyStatus->updated_at,
            ];
        }elseif(in_array($mode, [
            HelperConstant::REPONSE_MODE_SELECTER_API,
        ])){
            return [
                'id' => $userDailyStatus->id,
                'user_id' => $userDailyStatus->user_id,
                'consecutive_login_days' => $userDailyStatus->consecutive_login_days,
            ];
        }

        return [
            'id' => $userDailyStatus->id,
            'user_id' => $userDailyStatus->user_id,
            'last_login_date' => $userDailyStatus->last_login_date,
            'consecutive_login_days' => $userDailyStatus->consecutive_login_days,
            'last_claim_date' => $userDailyStatus->last_claim_date,
        ];
    }

    public static function formatUserDailyStatuses($userDailyStatuses, ?string $mode = null): array
    {
        $mode = $mode ?? self::getAvailableModeDefault();

        if ($userDailyStatuses instanceof LengthAwarePaginator) {
            return [
                'data' => $userDailyStatuses->map(function ($userDailyStatus) use ($mode) {
                    return self::formatUserDailyStatus($userDailyStatus, $mode);
                }),
                'current_page' => $userDailyStatuses->currentPage(),
                'total' => $userDailyStatuses->total(),
                'last_page' => $userDailyStatuses->lastPage()
            ];
        }

        if ($userDailyStatuses instanceof Collection) {
            return $userDailyStatuses->map(function ($userDailyStatus) use ($mode) {
                return self::formatUserDailyStatus($userDailyStatus, $mode);
            })->toArray();
        }

        return [];
    }
}
