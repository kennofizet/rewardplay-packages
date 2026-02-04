<?php

namespace Kennofizet\RewardPlay\Models\SettingStatsTransform;

use Illuminate\Database\Eloquent\Builder;

/**
 * SettingStatsTransform Model Scopes
 */
trait SettingStatsTransformScopes
{
    /**
     * Scope to filter by target_key
     * 
     * @param Builder $query
     * @param string|null $targetKey
     * @return Builder
     */
    public function scopeByTargetKey(Builder $query, $targetKey)
    {
        return $query->where('target_key', $targetKey);
    }
}
