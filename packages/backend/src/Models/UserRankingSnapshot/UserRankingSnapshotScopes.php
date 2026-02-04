<?php

namespace Kennofizet\RewardPlay\Models\UserRankingSnapshot;

use Illuminate\Database\Eloquent\Builder;

trait UserRankingSnapshotScopes
{
    public function scopeByUser(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByZone(Builder $query, ?int $zoneId): Builder
    {
        if ($zoneId === null) {
            return $query->whereNull('zone_id');
        }
        return $query->where('zone_id', $zoneId);
    }

    public function scopeByPeriod(Builder $query, string $periodType, string $periodKey): Builder
    {
        return $query->where('period_type', $periodType)->where('period_key', $periodKey);
    }
}
