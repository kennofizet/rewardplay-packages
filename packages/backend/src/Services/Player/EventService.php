<?php

namespace Kennofizet\RewardPlay\Services\Player;

use Kennofizet\RewardPlay\Models\SettingEvent;
use Kennofizet\RewardPlay\Core\Model\BaseModelResponse;

class EventService
{
    /**
     * Get active events for the current zone (for events popup).
     * Returns only events that are active now (is_active + time_start/time_end).
     *
     * @return array{events: array}
     */
    public function getActiveEvents(): array
    {
        $events = SettingEvent::query()
            ->activeNow()
            ->with('items')
            ->orderBy('id')
            ->get();

        $list = $events->map(function ($event) {
            $items = $event->items->map(fn ($item) => [
                'name' => $item->name,
                'image' => BaseModelResponse::getImageFullUrl($item->image),
            ])->values()->all();

            return [
                'name' => $event->name,
                'description' => $event->description,
                'image' => BaseModelResponse::getImageFullUrl($event->image),
                'bonus' => $event->bonus ?? [],
                'itemsInEvent' => $items,
                'newItems' => $items,
            ];
        })->values()->all();

        return ['events' => $list];
    }
}
