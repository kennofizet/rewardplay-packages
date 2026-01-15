<?php

namespace Kennofizet\RewardPlay\Models\ServerManager;

use Kennofizet\RewardPlay\Models\ServerManager;
use Kennofizet\RewardPlay\Models\User;

trait ServerManagerActions
{
    /**
     * Find server managers by server ID
     * 
     * @param int $serverId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function findByServerId(int $serverId)
    {
        return ServerManager::byServer($serverId)->get();
    }

    /**
     * Get the user (manager) from user model
     * 
     * @return User|null
     */
    public function getUser()
    {
        return User::findById($this->user_id);
    }
}
