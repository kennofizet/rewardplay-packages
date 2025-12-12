<?php

namespace Kennofizet\RewardPlay\Models\Token;

use Illuminate\Support\Facades\DB;

trait TokenActions
{
    /**
     * Get the user from user table using DB::
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
}

