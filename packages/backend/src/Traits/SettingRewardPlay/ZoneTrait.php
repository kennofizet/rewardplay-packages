<?php

namespace Kennofizet\RewardPlay\Traits\SettingRewardPlay;

use Kennofizet\RewardPlay\Services\SettingRewardPlay\ZoneService;

trait ZoneTrait
{
    /**
     * Get zones list.
     */
    public function getZones($filters = [])
    {
        return app(ZoneService::class)->getZones($filters);
    }

    /**
     * Create new zone.
     */
    public function createZone(array $data)
    {
        return app(ZoneService::class)->createZone($data);
    }

    /**
     * Edit zone.
     */
    public function editZone(int $zoneId, array $data)
    {
        return app(ZoneService::class)->editZone($zoneId, $data);
    }

    /**
     * Delete zone.
     */
    public function deleteZone(int $zoneId)
    {
        return app(ZoneService::class)->deleteZone($zoneId);
    }
}

