<?php

namespace Kennofizet\RewardPlay\Models\SettingItemSet;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Kennofizet\RewardPlay\Models\Zone;
use Kennofizet\RewardPlay\Models\SettingItem;
use Kennofizet\RewardPlay\Models\SettingItemSetItem;

trait SettingItemSetRelations
{
    /**
     * SettingItemSet belongs to Zone
     * 
     * @return BelongsTo
     */
    public function zone()
    {
        return $this->belongsTo(Zone::class, 'zone_id');
    }

    /**
     * SettingItemSet belongs to many SettingItems
     * 
     * @return BelongsToMany
     */
    public function items()
    {
        return $this->belongsToMany(
            SettingItem::class,
            (new SettingItemSetItem())->getTable(),
            'set_id',
            'item_id'
        )->withTimestamps()->withTrashed();
    }
}
