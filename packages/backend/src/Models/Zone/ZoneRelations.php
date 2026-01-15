<?php

namespace Kennofizet\RewardPlay\Models\Zone;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;

trait ZoneRelations
{
    /**
     * Zone belongs to many users (many-to-many through zone_users pivot)
     * 
     * @return BelongsToMany
     */
    public function users()
    {
        $zoneUsersTableName = \Kennofizet\RewardPlay\Models\ZoneUser::getTable();
        
        return $this->belongsToMany(
            \Kennofizet\RewardPlay\Models\User::class,
            $zoneUsersTableName,
            'zone_id',
            'user_id'
        )->using(\Kennofizet\RewardPlay\Models\ZoneUser::class)->withTimestamps();
    }
}
