<?php

namespace Kennofizet\RewardPlay\Models;

use Kennofizet\RewardPlay\Models\ZoneManager\ZoneManagerRelations;
use Kennofizet\RewardPlay\Models\ZoneManager\ZoneManagerScopes;
use Kennofizet\RewardPlay\Models\ZoneManager\ZoneManagerActions;
use Kennofizet\RewardPlay\Core\Model\BaseModel;

/**
 * ZoneManager Model
 */
class ZoneManager extends BaseModel
{
    use ZoneManagerRelations, ZoneManagerActions, ZoneManagerScopes;

    /**
     * Get the table name with prefix
     * 
     * @return string
     */
    public function getTable()
    {
        $tablePrefix = config('rewardplay.table_prefix', '');
        return $tablePrefix . 'rewardplay_zone_manager';
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'zone_id',
    ];
}

