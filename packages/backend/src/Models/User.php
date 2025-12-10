<?php

namespace Kennofizet\RewardPlay\Models;

use Kennofizet\RewardPlay\Models\User\UserRelations;
use Kennofizet\RewardPlay\Models\User\UserScopes;
use Kennofizet\RewardPlay\Models\User\UserActions;
use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Kennofizet\RewardPlay\Core\Model\BaseModelManage;
/**
 * User Model
 */
class User extends Model
{
    use UserRelations, UserActions, UserScopes;

    protected $hidden = [
        HelperConstant::IS_DELETED_STATUS_COLUMN, 
        HelperConstant::ZONE_ID_COLUMN
    ];

    protected static function boot()
    {
        parent::boot();

        // Apply global scope for company user and delete status
        static::addGlobalScope('is_in_zone', function (Builder $builder) {
            
            if (empty(config('rewardplay.user_zone_id_column'))) {
                return;
            }

            $builder->isInZone();
        });
    }
}

