<?php

namespace Kennofizet\RewardPlay\Models\UserRankingSnapshot;

use Kennofizet\PackagesCore\Models\User;

trait UserRankingSnapshotRelations
{
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
