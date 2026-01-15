<?php

namespace Kennofizet\RewardPlay\Models\User;

use Kennofizet\RewardPlay\Models\User;

trait UserActions
{
    /**
     * Find user by ID
     * 
     * @param int $id
     * @return User|null
     */
    public static function findById(int $id): ?User
    {
        return User::byId($id)->first();
    }
}