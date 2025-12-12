<?php

namespace Kennofizet\RewardPlay\Models\ZoneManager;

use Illuminate\Database\Eloquent\Builder;

/**
 * ZoneManager Model Scopes
 */
trait ZoneManagerScopes
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
     * Scope to filter by zone_id
     * 
     * @param Builder $query
     * @param int $zoneId
     * @return Builder
     */
    public function scopeByZone(Builder $query, $zoneId)
    {
        return $query->where('zone_id', $zoneId);
    }
}

