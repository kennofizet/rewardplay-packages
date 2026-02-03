<?php

namespace Kennofizet\RewardPlay\Models\SettingShopItem;

use Illuminate\Database\Eloquent\Builder;

trait SettingShopItemScopes
{
    public function scopeByActive(Builder $query, bool $isActive = true): Builder
    {
        return $query->where('is_active', $isActive);
    }

    public function scopeByCategory(Builder $query, string $category): Builder
    {
        return $query->where('category', $category);
    }

    public function scopeByEvent(Builder $query, ?int $eventId): Builder
    {
        if ($eventId === null) {
            return $query->whereNull('event_id');
        }
        return $query->where('event_id', $eventId);
    }

    public function scopeActiveNow(Builder $query): Builder
    {
        $now = now();
        return $query->where('is_active', true)
            ->where(function (Builder $q) use ($now) {
                $q->whereNull('time_start')->orWhere('time_start', '<=', $now);
            })
            ->where(function (Builder $q) use ($now) {
                $q->whereNull('time_end')->orWhere('time_end', '>=', $now);
            });
    }
}
