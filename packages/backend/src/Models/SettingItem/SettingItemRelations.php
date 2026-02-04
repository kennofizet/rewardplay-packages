<?php

namespace Kennofizet\RewardPlay\Models\SettingItem;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Kennofizet\RewardPlay\Models\Zone;
use Kennofizet\RewardPlay\Models\SettingItemSet;
use Kennofizet\RewardPlay\Models\SettingItemSetItem;

trait SettingItemRelations
{
    /**
     * SettingItem belongs to Zone
     * 
     * @return BelongsTo
     */
    public function zone()
    {
        return $this->belongsTo(Zone::class, 'zone_id');
    }

    /**
     * SettingItem belongs to many SettingItemSets
     * 
     * @return BelongsToMany
     */
    public function sets()
    {
        return $this->belongsToMany(
            SettingItemSet::class,
            (new SettingItemSetItem())->getTable(),
            'item_id',
            'set_id'
        )->withTimestamps();
    }
}

