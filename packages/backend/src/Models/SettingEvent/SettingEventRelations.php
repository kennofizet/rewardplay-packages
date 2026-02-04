<?php

namespace Kennofizet\RewardPlay\Models\SettingEvent;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Kennofizet\RewardPlay\Models\Zone;
use Kennofizet\RewardPlay\Models\SettingItem;

trait SettingEventRelations
{
    public function zone(): BelongsTo
    {
        return $this->belongsTo(Zone::class, 'zone_id');
    }

    public function items(): BelongsToMany
    {
        return $this->belongsToMany(
            SettingItem::class,
            $this->getPivotTableName('rewardplay_setting_event_items'),
            'event_id',
            'setting_item_id'
        )->withPivot('sort_order')->orderBy('sort_order');
    }
}
