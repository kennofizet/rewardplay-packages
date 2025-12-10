<?php

namespace Kennofizet\RewardPlay\Models\User;

use Kennofizet\RewardPlay\Core\Model\BaseModelResponse;
use Kennofizet\RewardPlay\Models\User\UserConstant;
use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class UserModelResponse extends BaseModelResponse
{
    /**
     * Get the default mode
     */
    public static function getAvailableModeDefault(): string
    {
        return UserConstant::API_USER_LIST_PAGE;
    }

    /**
     * Format product service data for API response
     */
    public static function formatUser($user, $mode = ''): array
    {
        if (!$user) {
            return [];
        }

        if(in_array($mode, [
            self::getAvailableModeDefault()
        ])){
            $default_reponse = [
                'id' => $user->id
            ];

            return $default_reponse;
        }elseif(in_array($mode, [
            HelperConstant::REPONSE_MODE_SELECTER_API,
        ])){
            return [
                'id' => $user->id,
                'name' => self::formatNameUser($user)
            ];
        }

        return [
            'id' => $user->id
        ];
    }

    /**
     * Format product services collection for API response with pagination
     */
    public static function formatUsers($users, ?string $mode = null): array
    {
        $mode = $mode ?? self::getAvailableModeDefault();

        if ($users instanceof LengthAwarePaginator) {
            return [
                'data' => $users->map(function ($user) use ($mode) {
                    return self::formatUser($user, $mode);
                }),
                'current_page' => $users->currentPage(),
                'total' => $users->total(),
                'last_page' => $users->lastPage()
            ];
        }

        if ($users instanceof Collection) {
            return $users->map(function ($user) use ($mode) {
                return self::formatUser($user, $mode);
            })->toArray();
        }

        return [];
    }

    /**
     * Format name user for API response
     */
    public static function formatNameUser($user): array
    {
        return $user->name;
    }
}

