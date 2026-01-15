<?php

namespace Kennofizet\RewardPlay\Models\SettingItem;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Kennofizet\RewardPlay\Models\Zone;

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
}

