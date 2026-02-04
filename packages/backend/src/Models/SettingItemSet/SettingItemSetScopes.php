<?php

namespace Kennofizet\RewardPlay\Models\SettingItemSet;

use Illuminate\Database\Eloquent\Builder;

/**
 * SettingItemSet Model Scopes
 */
trait SettingItemSetScopes
{
    /**
     * Scope to search setting item sets by name
     * 
     * @param Builder $query
     * @param string $search
     * @return Builder
     */
    public function scopeSearch(Builder $query, $search)
    {
        return $query->where('name', 'like', '%' . $search . '%');
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
