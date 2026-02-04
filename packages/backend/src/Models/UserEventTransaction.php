<?php

namespace Kennofizet\RewardPlay\Models;

use Kennofizet\RewardPlay\Models\UserEventTransaction\UserEventTransactionActions;
use Kennofizet\RewardPlay\Models\UserEventTransaction\UserEventTransactionRelations;
use Kennofizet\RewardPlay\Models\UserEventTransaction\UserEventTransactionScopes;
use Kennofizet\RewardPlay\Core\Model\BaseModel;

class UserEventTransaction extends BaseModel
{
    use UserEventTransactionActions, UserEventTransactionRelations, UserEventTransactionScopes;

    protected $fillable = [
        'user_id',
        'zone_id',
        'model_type',
        'model_id',
        'claim_date',
        'items',
    ];

    protected $casts = [
        'items' => 'array',
    ];

    public function getTable()
    {
        return self::getPivotTableName('rewardplay_' . \Kennofizet\RewardPlay\Models\UserEventTransaction\UserEventTransactionConstant::TABLE_NAME);
    }
}
