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
     * Scope to filter by server_id (null = rows where server_id IS NULL)
     *
     * @param Builder $query
     * @param int|null $serverId
     * @return Builder
     */
    public function scopeByServer(Builder $query, $serverId)
    {
        if ($serverId === null) {
            return $query->whereNull('server_id');
        }
        return $query->where('server_id', $serverId);
    }
}
