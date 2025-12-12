<?php

namespace Kennofizet\RewardPlay\Models\Zone;

use Illuminate\Database\Eloquent\Builder;

/**
 * Zone Model Scopes
 */
trait ZoneScopes
{
    /**
     * Scope to search zones by name
     * 
     * @param Builder $query
     * @param string $search
     * @return Builder
     */
    public function scopeSearch(Builder $query, $search)
    {
        return $query->where('name', 'like', '%' . $search . '%');
    }
}

