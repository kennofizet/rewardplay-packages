<?php

namespace Kennofizet\RewardPlay\Models\ServerManager;

use Illuminate\Database\Eloquent\Builder;

/**
 * ServerManager Model Scopes
 */
trait ServerManagerScopes
{
    /**
     * Scope to filter by user_id
     * 
     * @param Builder $query
     * @param int $userId
     * @return Builder
     */
    public function scopeByUser(Builder $query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope to filter by server_id
     * 
     * @param Builder $query
     * @param int $serverId
     * @return Builder
     */
    public function scopeByServer(Builder $query, $serverId)
    {
        return $query->where('server_id', $serverId);
    }
}
