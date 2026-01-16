<?php

namespace Kennofizet\RewardPlay\Models\SettingOption;

use Kennofizet\RewardPlay\Models\Zone;

trait SettingOptionRelations
{
    /**
     * Get the zone that this setting option belongs to.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function zone()
    {
        return $this->belongsTo(Zone::class, 'zone_id');
    }
}
