<?php

namespace Kennofizet\RewardPlay\Core\Model;

use Illuminate\Database\Eloquent\Builder;
use Kennofizet\RewardPlay\Core\Model\BaseModelActions;
use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;

trait BaseModelScopes
{
    public function scopeReturnNull(Builder $query)
    {
        return $query->whereRaw('1 != 1');
    }

    public function scopeIsInZone(Builder $query)
    {
        $zoneIds = BaseModelActions::currentUserZoneIds();
        if (empty($zoneIds)) {
            return $query->returnNull();
        }
        
        $table = $query->getModel()->getTable();
        return $query->where(function($q) use ($table, $zoneIds) {
            $q->whereIn($table . '.' . HelperConstant::ZONE_ID_COLUMN, $zoneIds);
        });
    }

    public function scopeWithoutDeleteStatus(Builder $query)
    {
        $table = $query->getModel()->getTable();
        return $query->where($table . '.' . HelperConstant::IS_DELETED_STATUS_COLUMN, 0);
    }

    public function scopeIsActive(Builder $query, $column = HelperConstant::STATUS_COLUMN)
    {
        $table = $query->getModel()->getTable();
        if (strpos($column, '.') === false) {
            $column = $table . '.' . $column;
        }
        return $query->where($column, HelperConstant::STATUS_ON);
    }
}