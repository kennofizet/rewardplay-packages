<?php

namespace Kennofizet\RewardPlay\Traits\SettingRewardPlay;

use Kennofizet\RewardPlay\Services\SettingRewardPlay\ZoneManagerService;

trait ZoneManagerTrait
{
    /**
     * Get zone managers list.
     */
    public function getZoneManagers($filters = [])
    {
        return app(ZoneManagerService::class)->getZoneManagers($filters);
    }

    /**
     * Get manager for a zone.
     */
    public function getZoneManager(int $zoneId)
    {
        return app(ZoneManagerService::class)->getByZone($zoneId);
    }

    /**
     * Assign manager to zone.
     */
    public function createZoneManager(array $data)
    {
        return app(ZoneManagerService::class)->assignManager($data);
    }

    /**
     * Edit manager assignment (re-assign).
     */
    public function editZoneManager(array $data)
    {
        return app(ZoneManagerService::class)->assignManager($data);
    }

    /**
     * Delete manager assignment.
     */
    public function deleteZoneManager(array $data)
    {
        return app(ZoneManagerService::class)->removeManager($data);
    }
}

