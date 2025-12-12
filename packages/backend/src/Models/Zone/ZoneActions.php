<?php

namespace Kennofizet\RewardPlay\Models\Zone;

use Illuminate\Support\Facades\DB;

trait ZoneActions
{
    /**
     * Get the manager of this zone from user table using DB::
     * 
     * @return object|null
     */
    public function getManager()
    {
        $zoneManager = $this->zoneManager;
        
        if (!$zoneManager) {
            return null;
        }

        $userTable = config('rewardplay.table_user', 'users');
        
        return DB::table($userTable)
            ->where('id', $zoneManager->user_id)
            ->first();
    }

    /**
     * Check if zone has a manager
     * 
     * @return bool
     */
    public function hasManager()
    {
        return $this->zoneManager()->exists();
    }
}

