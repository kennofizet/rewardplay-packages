<?php

namespace Kennofizet\RewardPlay\Repositories\Model;

use Kennofizet\RewardPlay\Models\User;

class UserRepository
{
    protected $model;

    public function __construct(User $model)
    {
        $this->model = $model;
    }
}

