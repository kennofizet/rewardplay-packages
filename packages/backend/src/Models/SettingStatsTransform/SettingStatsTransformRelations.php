<?php

namespace Kennofizet\RewardPlay\Models\SettingStatsTransform;

use Kennofizet\PackagesCore\Models\Zone;

trait SettingStatsTransformRelations
{
    /**
     * Get the zone that this setting stats transform belongs to.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function zone()
    {
        return $this->belongsTo(Zone::class, 'zone_id');
    }
}
