<?php

namespace Kennofizet\RewardPlay\Models\SettingItem;

use Illuminate\Database\Eloquent\Builder;

/**
 * SettingItem Model Scopes
 */
trait SettingItemScopes
{
    /**
     * Scope to search settings items by name, slug or description
     * 
     * @param Builder $query
     * @param string $search
     * @return Builder
     */
    public function scopeSearch(Builder $query, $search)
    {
        return $query->where(function($q) use ($search) {
            $q->where('name', 'like', '%' . $search . '%')
              ->orWhere('slug', 'like', '%' . $search . '%')
              ->orWhere('description', 'like', '%' . $search . '%');
        });
    }

    /**
     * Scope to filter by type
     * 
     * @param Builder $query
     * @param string $type
     * @return Builder
     */
    public function scopeByType(Builder $query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope to filter by key (slug)
     * 
     * @param Builder $query
     * @param string $key
     * @return Builder
     */
    public function scopeByKey(Builder $query, $key)
    {
        return $query->where('slug', $key);
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

    /**
     * Scope to filter by slug (for uniqueness checks)
     * 
     * @param Builder $query
     * @param string $slug
     * @return Builder
     */
    public function scopeBySlug(Builder $query, $slug)
    {
        return $query->where('slug', $slug);
    }
}

