<?php

namespace Kennofizet\RewardPlay\Models\Token;

use Kennofizet\RewardPlay\Models\User;

trait TokenActions
{
    /**
     * Get the user from user model
     * 
     * @return User|null
     */
    public function getUser()
    {
        return User::findById($this->user_id);
    }
}

