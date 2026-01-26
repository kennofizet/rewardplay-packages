<?php

namespace Kennofizet\RewardPlay\Models\UserEventTransaction;

use Illuminate\Database\Eloquent\Builder;

trait UserEventTransactionScopes
{
    /**
     * Scope to filter by user
     */
    public function scopeByUser(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope to filter by zone
     */
    public function scopeByZone(Builder $query, int $zoneId): Builder
    {
        return $query->where('zone_id', $zoneId);
    }

    /**
     * Scope to filter by model type
     */
    public function scopeByModelType(Builder $query, string $modelType): Builder
    {
        return $query->where('model_type', $modelType);
    }

    /**
     * Scope to filter by model
     */
    public function scopeByModel(Builder $query, string $modelType, int $modelId): Builder
    {
        return $query->where('model_type', $modelType)
            ->where('model_id', $modelId);
    }
}
