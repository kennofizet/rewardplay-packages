<?php

namespace Kennofizet\RewardPlay\Models\ZoneManager;

use Kennofizet\RewardPlay\Core\Model\BaseModelResponse;
use Kennofizet\RewardPlay\Models\ZoneManager\ZoneManagerConstant;
use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class ZoneManagerModelResponse extends BaseModelResponse
{
    /**
     * Get the default mode
     */
    public static function getAvailableModeDefault(): string
    {
        return ZoneManagerConstant::API_ZONE_MANAGER_LIST_PAGE;
    }

    /**
     * Format zone manager data for API response
     */
    public static function formatZoneManager($zoneManager, $mode = ''): array
    {
        if (!$zoneManager) {
            return [];
        }

        if(in_array($mode, [
            self::getAvailableModeDefault()
        ])){
            $default_reponse = [
                'id' => $zoneManager->id,
                'user_id' => $zoneManager->user_id,
                'zone_id' => $zoneManager->zone_id
            ];

            return $default_reponse;
        }elseif(in_array($mode, [
            HelperConstant::REPONSE_MODE_SELECTER_API,
        ])){
            return [
                'id' => $zoneManager->id,
                'user_id' => $zoneManager->user_id,
                'zone_id' => $zoneManager->zone_id
            ];
        }

        return [
            'id' => $zoneManager->id,
            'user_id' => $zoneManager->user_id,
            'zone_id' => $zoneManager->zone_id
        ];
    }

    /**
     * Format zone managers collection for API response with pagination
     */
    public static function formatZoneManagers($zoneManagers, ?string $mode = null): array
    {
        $mode = $mode ?? self::getAvailableModeDefault();

        if ($zoneManagers instanceof LengthAwarePaginator) {
            return [
                'data' => $zoneManagers->map(function ($zoneManager) use ($mode) {
                    return self::formatZoneManager($zoneManager, $mode);
                }),
                'current_page' => $zoneManagers->currentPage(),
                'total' => $zoneManagers->total(),
                'last_page' => $zoneManagers->lastPage()
            ];
        }

        if ($zoneManagers instanceof Collection) {
            return $zoneManagers->map(function ($zoneManager) use ($mode) {
                return self::formatZoneManager($zoneManager, $mode);
            })->toArray();
        }

        return [];
    }
}

