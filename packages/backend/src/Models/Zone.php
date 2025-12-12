<?php

namespace Kennofizet\RewardPlay\Models;

use Kennofizet\RewardPlay\Models\Zone\ZoneRelations;
use Kennofizet\RewardPlay\Models\Zone\ZoneScopes;
use Kennofizet\RewardPlay\Models\Zone\ZoneActions;
use Kennofizet\RewardPlay\Core\Model\BaseModel;

/**
 * Zone Model
 */
class Zone extends BaseModel
{
    use ZoneRelations, ZoneActions, ZoneScopes;

    /**
     * Get the table name with prefix
     * 
     * @return string
     */
    public function getTable()
    {
        $tablePrefix = config('rewardplay.table_prefix', '');
        return $tablePrefix . 'rewardplay_zones';
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
    ];
}

