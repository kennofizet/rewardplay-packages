<?php

namespace Kennofizet\RewardPlay\Models\UserBagItem;

use Kennofizet\RewardPlay\Models\UserBagItem;

trait UserBagItemActions
{
    public static function getByUser($userId)
    {
        return self::with('item')
            ->where('user_id', $userId)
            ->get();
    }
}
