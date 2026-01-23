<?php

namespace Kennofizet\RewardPlay\Models\UserDailyStatus;

use Kennofizet\RewardPlay\Models\UserDailyStatus;

trait UserDailyStatusActions
{
    public static function findById(int $id): ?UserDailyStatus
    {
        return UserDailyStatus::find($id);
    }
}
