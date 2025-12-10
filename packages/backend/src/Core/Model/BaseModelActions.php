<?php

namespace Kennofizet\RewardPlay\Core\Model;

use Kennofizet\RewardPlay\Models\User;

trait BaseModelActions
{
    public static function arrayRemoveEmpty($data)
    {
        if ($data) {
            return array_values(array_filter($data, function ($value) {
                return ($value !== "" and $value !== NULL);
            }));
        }
        return [];
    }

    public static function currentUserId()
    {
        return request()->attributes->get('rewardplay_user_id');
    }

    public static function currentZoneId()
    {
        $zoneIdColumn = config('rewardplay.user_zone_id_column');
        if (empty($zoneIdColumn)) {
            return null;
        }
        
        $zoneId = request()->attributes->get('rewardplay_user_zone_id');
        if (empty($zoneId)) {
            return null;
        }
        return $zoneId;
    }
}
