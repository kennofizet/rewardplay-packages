<?php

namespace Kennofizet\RewardPlay\Models\ZoneManager;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Kennofizet\RewardPlay\Models\Zone;

trait ZoneManagerRelations
{
    /**
     * ZoneManager belongs to Zone
     * 
     * @return BelongsTo
     */
    public function zone()
    {
        return $this->belongsTo(Zone::class, 'zone_id');
    }
}

