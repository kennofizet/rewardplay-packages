<?php

namespace Kennofizet\RewardPlay\Models;

use Kennofizet\RewardPlay\Core\Model\BaseModel;

/**
 * ZoneManager Model
 * Note: This table is deprecated and will be dropped, but we keep this model
 * for migration purposes to use Model::getTable()
 */
class ZoneManager extends BaseModel
{
    /**
     * Get the table name with prefix
     * 
     * @return string
     */
    public function getTable()
    {
        return self::getPivotTableName('rewardplay_zone_manager');
    }
}
