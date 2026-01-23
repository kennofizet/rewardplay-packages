<?php

namespace Kennofizet\RewardPlay\Models;

use Kennofizet\RewardPlay\Models\UserDailyStatus\UserDailyStatusActions;
use Kennofizet\RewardPlay\Models\UserDailyStatus\UserDailyStatusRelations;
use Kennofizet\RewardPlay\Models\UserDailyStatus\UserDailyStatusScopes;
use Kennofizet\RewardPlay\Core\Model\BaseModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserDailyStatus extends BaseModel
{
    use HasFactory, UserDailyStatusActions, UserDailyStatusRelations, UserDailyStatusScopes;

    protected $fillable = [
        'user_id',
        'last_login_date',
        'consecutive_login_days',
        'last_claim_date',
    ];

    public function getTable()
    {
        return self::getPivotTableName('rewardplay_user_daily_statuses');
    }
}
