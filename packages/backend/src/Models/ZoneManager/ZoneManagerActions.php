<?php

namespace Kennofizet\RewardPlay\Models\ZoneManager;

use Illuminate\Support\Facades\DB;

trait ZoneManagerActions
{
    /**
     * Get the user (manager) from user table using DB::
     * 
     * @return object|null
     */
    public function getUser()
    {
        $userTable = config('rewardplay.table_user', 'users');
        
        return DB::table($userTable)
            ->where('id', $this->user_id)
            ->first();
    }

    /**
     * Get the zone
     * 
     * @return \Kennofizet\RewardPlay\Models\Zone|null
     */
    public function getZone()
    {
        return $this->zone;
    }
}

