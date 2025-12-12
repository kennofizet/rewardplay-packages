<?php

namespace Kennofizet\RewardPlay\Models\Zone;

use Kennofizet\RewardPlay\Core\Model\BaseModelResponse;
use Kennofizet\RewardPlay\Models\Zone\ZoneConstant;
use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class ZoneModelResponse extends BaseModelResponse
{
    /**
     * Get the default mode
     */
    public static function getAvailableModeDefault(): string
    {
        return ZoneConstant::API_ZONE_LIST_PAGE;
    }

    /**
     * Format zone data for API response
     */
    public static function formatZone($zone, $mode = ''): array
    {
        if (!$zone) {
            return [];
        }

        if(in_array($mode, [
            self::getAvailableModeDefault()
        ])){
            $default_reponse = [
                'id' => $zone->id,
                'name' => $zone->name
            ];

            return $default_reponse;
        }elseif(in_array($mode, [
            HelperConstant::REPONSE_MODE_SELECTER_API,
        ])){
            return [
                'id' => $zone->id,
                'name' => $zone->name
            ];
        }

        return [
            'id' => $zone->id,
            'name' => $zone->name
        ];
    }

    /**
     * Format zones collection for API response with pagination
     */
    public static function formatZones($zones, ?string $mode = null): array
    {
        $mode = $mode ?? self::getAvailableModeDefault();

        if ($zones instanceof LengthAwarePaginator) {
            return [
                'data' => $zones->map(function ($zone) use ($mode) {
                    return self::formatZone($zone, $mode);
                }),
                'current_page' => $zones->currentPage(),
                'total' => $zones->total(),
                'last_page' => $zones->lastPage()
            ];
        }

        if ($zones instanceof Collection) {
            return $zones->map(function ($zone) use ($mode) {
                return self::formatZone($zone, $mode);
            })->toArray();
        }

        return [];
    }
}

