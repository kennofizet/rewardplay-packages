<?php

namespace Kennofizet\RewardPlay\Models\SettingEvent;

use Kennofizet\RewardPlay\Core\Model\BaseModelResponse;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class SettingEventModelResponse extends BaseModelResponse
{
    /**
     * Get the default mode for list/API response.
     */
    public static function getAvailableModeDefault(): string
    {
        return SettingEventConstant::API_SETTING_EVENT_LIST_PAGE;
    }

    /**
     * Format a single setting event for API response.
     */
    public static function formatSettingEvent($event, string $mode = ''): array
    {
        if (!$event) {
            return [];
        }

        $base = [
            'id' => $event->id,
            'zone_id' => $event->zone_id,
            'name' => $event->name,
            'slug' => $event->slug,
            'description' => $event->description,
            'image' => self::getImageFullUrl($event->image),
            'time_start' => $event->time_start?->toIso8601String(),
            'time_end' => $event->time_end?->toIso8601String(),
            'bonus' => $event->bonus ?? [],
            'daily_reward_bonus' => $event->daily_reward_bonus ?? [],
            'is_active' => (bool) ($event->is_active ?? true),
        ];

        $base['items'] = $event->relationLoaded('items')
            ? $event->items->map(fn ($item) => [
                'id' => $item->id,
                'name' => $item->name,
                'slug' => $item->slug,
                'type' => $item->type,
                'image' => self::getImageFullUrl($item->image),
            ])->values()->all()
            : [];

        return $base;
    }

    /**
     * Format setting events collection for API response (paginated or collection).
     */
    public static function formatSettingEvents($events, ?string $mode = null): array
    {
        $mode = $mode ?? self::getAvailableModeDefault();

        if ($events instanceof LengthAwarePaginator) {
            return [
                'data' => $events->map(fn ($e) => self::formatSettingEvent($e, $mode))->values()->all(),
                'current_page' => $events->currentPage(),
                'total' => $events->total(),
                'last_page' => $events->lastPage(),
            ];
        }

        if ($events instanceof Collection) {
            return $events->map(fn ($e) => self::formatSettingEvent($e, $mode))->values()->all();
        }

        return [];
    }
}
