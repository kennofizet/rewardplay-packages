<?php

namespace Kennofizet\RewardPlay\Traits\SettingRewardPlay;

use Kennofizet\RewardPlay\Services\SettingRewardPlay\ServerManagerService;

trait ServerManagerTrait
{
    /**
     * Get server managers list.
     */
    public function getServerManagers($filters = [])
    {
        return app(ServerManagerService::class)->getServerManagers($filters);
    }

    /**
     * Get managers for a server.
     */
    public function getServerManagersByServer(int $serverId)
    {
        return app(ServerManagerService::class)->getByServer($serverId);
    }

    /**
     * Assign manager to server.
     */
    public function createServerManager(array $data)
    {
        return app(ServerManagerService::class)->assignManager($data);
    }

    /**
     * Remove manager from server.
     */
    public function deleteServerManager(array $data)
    {
        return app(ServerManagerService::class)->removeManager($data);
    }
}
