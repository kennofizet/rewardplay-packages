<?php

namespace Kennofizet\RewardPlay\Models\SettingShopItem;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Kennofizet\RewardPlay\Models\Zone;
use Kennofizet\RewardPlay\Models\SettingItem;
use Kennofizet\RewardPlay\Models\SettingEvent;

trait SettingShopItemRelations
{
    public function zone(): BelongsTo
    {
        return $this->belongsTo(Zone::class, 'zone_id');
    }

    public function settingItem(): BelongsTo
    {
        return $this->belongsTo(SettingItem::class, 'setting_item_id')->withTrashed();
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(SettingEvent::class, 'event_id');
    }
}
