<?php

namespace Kennofizet\RewardPlay\Models\ZoneUser;

use Illuminate\Database\Eloquent\Builder;

/**
 * ZoneUser Model Scopes
 */
trait ZoneUserScopes
{
    /**
     * Scope to filter by user_id
     * 
     * @param Builder $query
     * @param int $userId
     * @return Builder
     */
    public function scopeByUserId(Builder $query, $userId)
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
    public function scopeByZoneId(Builder $query, $zoneId)
    {
        return $query->where('zone_id', $zoneId);
    }
}
