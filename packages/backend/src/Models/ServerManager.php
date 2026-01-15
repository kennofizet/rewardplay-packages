<?php

namespace Kennofizet\RewardPlay\Models;

use Kennofizet\RewardPlay\Models\ServerManager\ServerManagerRelations;
use Kennofizet\RewardPlay\Models\ServerManager\ServerManagerScopes;
use Kennofizet\RewardPlay\Models\ServerManager\ServerManagerActions;
use Kennofizet\RewardPlay\Core\Model\BaseModel;

/**
 * ServerManager Model
 */
class ServerManager extends BaseModel
{
    use ServerManagerRelations, ServerManagerActions, ServerManagerScopes;

    /**
     * Get the table name with prefix
     * 
     * @return string
     */
    public function getTable()
    {
        $tablePrefix = config('rewardplay.table_prefix', '');
        return $tablePrefix . 'rewardplay_server_managers';
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'server_id',
    ];
}
