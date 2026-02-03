<?php

namespace Kennofizet\RewardPlay\Models\SettingEvent;

use Illuminate\Database\Eloquent\Builder;

trait SettingEventScopes
{
    public function scopeByActive(Builder $query, bool $isActive = true): Builder
    {
        return $query->where('is_active', $isActive);
    }

    public function scopeSearch(Builder $query, string $search): Builder
    {
        return $query->where(function (Builder $q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        });
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
