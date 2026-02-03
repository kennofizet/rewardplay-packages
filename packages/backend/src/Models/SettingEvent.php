<?php

namespace Kennofizet\RewardPlay\Models;

use Kennofizet\RewardPlay\Core\Model\BaseModel;
use Kennofizet\RewardPlay\Models\SettingEvent\SettingEventRelations;
use Kennofizet\RewardPlay\Models\SettingEvent\SettingEventScopes;
use Kennofizet\RewardPlay\Models\SettingEvent\SettingEventActions;
use Illuminate\Support\Str;

class SettingEvent extends BaseModel
{
    use SettingEventRelations, SettingEventScopes, SettingEventActions;

    protected $fillable = [
        'zone_id',
        'name',
        'slug',
        'description',
        'image',
        'time_start',
        'time_end',
        'bonus',
        'daily_reward_bonus',
        'is_active',
    ];

    protected $casts = [
        'time_start' => 'datetime',
        'time_end' => 'datetime',
        'bonus' => 'array',
        'daily_reward_bonus' => 'array',
        'is_active' => 'boolean',
    ];

    public function getTable(): string
    {
        return self::getPivotTableName('rewardplay_' . \Kennofizet\RewardPlay\Models\SettingEvent\SettingEventConstant::TABLE_NAME);
    }

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (SettingEvent $event) {
            if (empty($event->slug) && !empty($event->name)) {
                $event->slug = static::ensureUniqueSlugForZone(Str::slug($event->name), $event->zone_id);
            }
        });

        static::updating(function (SettingEvent $event) {
            if ($event->isDirty('name') && !empty($event->name)) {
                $event->slug = static::ensureUniqueSlugForZone(Str::slug($event->name), $event->zone_id, $event->id);
            }
        });
    }

    /**
     * Ensure slug is unique per zone. Appends -2, -3, ... if the slug already exists.
     *
     * @param string $slug Base slug (e.g. from name)
     * @param int|null $zoneId Zone ID
     * @param int|null $excludeId Event ID to exclude (for updates)
     * @return string
     */
    protected static function ensureUniqueSlugForZone(string $slug, $zoneId, ?int $excludeId = null): string
    {
        $base = $slug;
        $n = 1;
        do {
            $query = static::query()->where('slug', $slug);
            if ($zoneId === null) {
                $query->whereNull('zone_id');
            } else {
                $query->where('zone_id', $zoneId);
            }
            if ($excludeId !== null) {
                $query->where('id', '!=', $excludeId);
            }
            if (!$query->exists()) {
                return $slug;
            }
            $n++;
            $slug = $base . '-' . $n;
        } while (true);
    }
}
