<?php

namespace Kennofizet\RewardPlay\Models\SettingOption;

use Illuminate\Database\Eloquent\Builder;

/**
 * SettingOption Model Scopes
 */
trait SettingOptionScopes
{
    /**
     * Scope to search setting options by name
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
     * @param int|null $zoneId
     * @return Builder
     */
    public function scopeByZone(Builder $query, $zoneId)
    {
        if ($zoneId !== null && $zoneId !== '') {
            return $query->where('zone_id', $zoneId);
        }
        return $query;
    }
}
