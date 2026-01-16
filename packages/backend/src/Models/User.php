<?php

namespace Kennofizet\RewardPlay\Models;

use Kennofizet\RewardPlay\Models\User\UserRelations;
use Kennofizet\RewardPlay\Models\User\UserScopes;
use Kennofizet\RewardPlay\Models\User\UserActions;
use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
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

    /**
     * Get the table name with prefix
     * 
     * @return string
     */
    public function getTable()
    {
        return config('rewardplay.table_user', 'users');
    }

    protected static function boot()
    {
        parent::boot();

        // Apply global scope for server user filtering
        static::addGlobalScope('by_server_user', function (Builder $builder) {
            
            if (empty(config('rewardplay.user_server_id_column'))) {
                return;
            }

            $builder->byServer();
        });
    }
}

