<?php

namespace Kennofizet\RewardPlay\Models;

use Kennofizet\RewardPlay\Models\UserBagItem\UserBagItemActions;
use Kennofizet\RewardPlay\Models\UserBagItem\UserBagItemRelations;
use Kennofizet\RewardPlay\Models\UserBagItem\UserBagItemScopes;
use Kennofizet\RewardPlay\Core\Model\BaseModel;

class UserBagItem extends BaseModel
{
    use UserBagItemActions, UserBagItemRelations, UserBagItemScopes;

    protected $fillable = [
        'user_id',
        'item_id',
        'item_type',
        'quantity',
        'properties',
        'acquired_at',
        'zone_id',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'properties' => 'json',
        'acquired_at' => 'datetime',
    ];

    public function getTable()
    {
        return self::getPivotTableName('rewardplay_user_bag_items');
    }
}
