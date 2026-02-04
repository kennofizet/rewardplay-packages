<?php

namespace Kennofizet\RewardPlay\Models;

use Kennofizet\RewardPlay\Models\UserRankingSnapshot\UserRankingSnapshotActions;
use Kennofizet\RewardPlay\Models\UserRankingSnapshot\UserRankingSnapshotRelations;
use Kennofizet\RewardPlay\Models\UserRankingSnapshot\UserRankingSnapshotScopes;
use Kennofizet\RewardPlay\Core\Model\BaseModel;

class UserRankingSnapshot extends BaseModel
{
    use UserRankingSnapshotActions, UserRankingSnapshotRelations, UserRankingSnapshotScopes;

    protected $fillable = [
        'user_id',
        'zone_id',
        'period_type',
        'period_key',
        'coin',
        'level',
        'power',
    ];

    protected $casts = [
        'coin' => 'integer',
        'level' => 'integer',
        'power' => 'integer',
    ];

    public function getTable()
    {
        return self::getPivotTableName('rewardplay_' . \Kennofizet\RewardPlay\Models\UserRankingSnapshot\UserRankingSnapshotConstant::TABLE_NAME);
    }
}
