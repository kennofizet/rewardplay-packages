<?php

namespace Kennofizet\RewardPlay\Models\SettingItemSetItem;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Kennofizet\RewardPlay\Models\SettingItemSet;
use Kennofizet\RewardPlay\Models\SettingItem;

trait SettingItemSetItemRelations
{
    /**
     * Get the setting item set that belongs to this pivot.
     *
     * @return BelongsTo
     */
    public function set()
    {
        return $this->belongsTo(SettingItemSet::class, 'set_id');
    }

    /**
     * Get the setting item that belongs to this pivot.
     *
     * @return BelongsTo
     */
    public function item()
    {
        return $this->belongsTo(SettingItem::class, 'item_id');
    }
}
