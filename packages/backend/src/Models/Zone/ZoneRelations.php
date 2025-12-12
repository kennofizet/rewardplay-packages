<?php

namespace Kennofizet\RewardPlay\Models\Zone;

use Illuminate\Database\Eloquent\Relations\HasOne;
use Kennofizet\RewardPlay\Models\ZoneManager;

trait ZoneRelations
{
    /**
     * Zone has one manager (ZoneManager)
     * 
     * @return HasOne
     */
    public function zoneManager()
    {
        return $this->hasOne(ZoneManager::class, 'zone_id');
    }
}

