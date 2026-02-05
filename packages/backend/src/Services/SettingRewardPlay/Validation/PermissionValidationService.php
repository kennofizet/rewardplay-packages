<?php

namespace Kennofizet\RewardPlay\Services\SettingRewardPlay\Validation;

use Kennofizet\RewardPlay\Core\Model\BaseModelActions;

/**
 * Permission Validation Service
 * Centralized validation for zone_id and server_id permissions
 * Uses request attributes (no database queries)
 */
class PermissionValidationService
{
    /**
     * Validate that current user can manage a specific server
     * Uses request attributes (no database query needed).
     * When config has no server column, server_id can be null (global manager).
     *
     * @param int|null $serverId
     * @throws \Exception
     */
    public function validateServerPermission(?int $serverId): void
    {
        if (!BaseModelActions::canManageServer($serverId)) {
            throw new \Exception('You do not have permission to manage this server');
        }
    }

    /**
     * Validate that current user can manage a specific zone
     * Uses request attributes (no database query needed)
     *
     * @param int $zoneId
     * @throws \Exception
     */
    public function validateZonePermission(int $zoneId): void
    {
        if (!BaseModelActions::canManageZone($zoneId)) {
            throw new \Exception('You do not have permission to manage this zone');
        }
    }

    /**
     * Validate server permission if server_id is provided
     *
     * @param int|null $serverId
     * @throws \Exception
     */
    public function validateServerPermissionIfProvided(?int $serverId): void
    {
        if (!empty($serverId)) {
            $this->validateServerPermission($serverId);
        }
    }

    /**
     * Validate zone permission if zone_id is provided
     *
     * @param int|null $zoneId
     * @throws \Exception
     */
    public function validateZonePermissionIfProvided(?int $zoneId): void
    {
        if (!empty($zoneId)) {
            $this->validateZonePermission($zoneId);
        }
    }
}
