<?php

namespace Kennofizet\RewardPlay\Core\Model;

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

    /**
     * Get array of zone IDs that the current user is in
     * 
     * @return array
     */
    public static function currentUserZoneIds()
    {
        $zoneIds = request()->attributes->get('rewardplay_user_zone_ids', []);
        if (!is_array($zoneIds)) {
            return [];
        }
        return array_filter($zoneIds, function($id) {
            return !empty($id);
        });
    }

    /**
     * Get array of zone IDs that the current user manages
     * 
     * @return array
     */
    public static function currentUserManagedZoneIds()
    {
        $zoneIds = request()->attributes->get('rewardplay_user_managed_zone_ids', []);
        if (!is_array($zoneIds)) {
            return [];
        }
        return array_filter($zoneIds, function($id) {
            return !empty($id);
        });
    }

    /**
     * Get current server ID from request attributes
     * 
     * @return int|null
     */
    public static function currentServerId()
    {
        $serverIdColumn = config('rewardplay.user_server_id_column');
        if (empty($serverIdColumn)) {
            return null;
        }
        
        $serverId = request()->attributes->get('rewardplay_user_server_id');
        if (empty($serverId)) {
            return null;
        }
        return $serverId;
    }
}
