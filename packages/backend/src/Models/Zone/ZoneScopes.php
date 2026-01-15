<?php

namespace Kennofizet\RewardPlay\Models\Zone;

use Illuminate\Database\Eloquent\Builder;
use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;
use Kennofizet\RewardPlay\Core\Model\BaseModelActions;
/**
 * Zone Model Scopes
 */
trait ZoneScopes
{
    /**
     * Scope to search zones by name
     * 
     * @param Builder $query
     * @param string $search
     * @return Builder
     */
    public function scopeSearch(Builder $query, $search)
    {
        return $query->where('name', 'like', '%' . $search . '%');
    }

    public function scopeByServer(Builder $query)
    {
        $serverId = BaseModelActions::currentServerId();
        if (empty($serverId)) {
            return $query;
        }
        
        $table = $query->getModel()->getTable();
        return $query->where($table . '.' . HelperConstant::SERVER_ID_COLUMN, $serverId);
    }

    /**
     * Scope to filter by server_id
     * 
     * @param Builder $query
     * @param int $serverId
     * @return Builder
     */
    public function scopeByServerId(Builder $query, $serverId)
    {
        $table = $query->getModel()->getTable();
        return $query->where($table . '.' . HelperConstant::SERVER_ID_COLUMN, $serverId);
    }

    /**
     * Scope to filter by multiple server IDs
     * 
     * @param Builder $query
     * @param array $serverIds
     * @return Builder
     */
    public function scopeByServerIds(Builder $query, array $serverIds)
    {
        if (empty($serverIds)) {
            return $query->returnNull();
        }
        
        $table = $query->getModel()->getTable();
        return $query->whereIn($table . '.' . HelperConstant::SERVER_ID_COLUMN, $serverIds);
    }

    /**
     * Scope to filter by multiple zone IDs
     * 
     * @param Builder $query
     * @param array $zoneIds
     * @return Builder
     */
    public function scopeByZoneIds(Builder $query, array $zoneIds)
    {
        if (empty($zoneIds)) {
            return $query->returnNull();
        }
        
        return $query->whereIn('id', $zoneIds);
    }
}

