<?php

namespace Kennofizet\RewardPlay\Models\User;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;

trait UserRelations
{
    /**
     * User belongs to many zones (many-to-many through zone_users pivot)
     * 
     * @return BelongsToMany
     */
    public function zones()
    {
        $zoneUsersTableName = \Kennofizet\RewardPlay\Models\ZoneUser::getTable();
        return $this->belongsToMany(
            \Kennofizet\RewardPlay\Models\Zone::class,
            $zoneUsersTableName,
            'user_id',
            'zone_id'
        )->using(\Kennofizet\RewardPlay\Models\ZoneUser::class)->withTimestamps();
    }
}

