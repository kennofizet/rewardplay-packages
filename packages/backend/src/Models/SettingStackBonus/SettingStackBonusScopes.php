<?php

namespace Kennofizet\RewardPlay\Models\SettingStackBonus;

use Illuminate\Database\Eloquent\Builder;

/**
 * SettingStackBonus Model Scopes
 */
trait SettingStackBonusScopes
{
    /**
     * Scope to filter by day
     * 
     * @param Builder $query
     * @param int $day
     * @return Builder
     */
    public function scopeByDay(Builder $query, int $day)
    {
        return $query->where('day', $day);
    }

    /**
     * Scope to filter by day range
     * 
     * @param Builder $query
     * @param int $from
     * @param int $to
     * @return Builder
     */
    public function scopeByDayRange(Builder $query, int $from, int $to)
    {
        return $query->whereBetween('day', [$from, $to]);
    }

    /**
     * Scope to filter by is_active
     * 
     * @param Builder $query
     * @param bool $isActive
     * @return Builder
     */
    public function scopeByActive(Builder $query, bool $isActive = true)
    {
        return $query->where('is_active', $isActive);
    }

    /**
     * Scope to search by name
     * 
     * @param Builder $query
     * @param string $search
     * @return Builder
     */
    public function scopeSearch(Builder $query, string $search)
    {
        return $query->where('name', 'like', "%{$search}%");
    }
}
