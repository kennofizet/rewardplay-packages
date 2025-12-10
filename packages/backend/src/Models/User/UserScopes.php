<?php

namespace Kennofizet\RewardPlay\Models\User;

use Illuminate\Database\Eloquent\Builder;
use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;
use Kennofizet\RewardPlay\Core\Model\BaseModelActions;

/**
 * User Model Scopes
 */
trait UserScopes
{
   public function scopeSearch(Builder $query, $search)
   {
    return $query->where('id', $search);
   }

   public function scopeIsInZone(Builder $query)
   {
      if(empty(config('rewardplay.user_zone_id_column'))) {
         return $query;
      }
      return $query->where(function($q) {
         $q->where(config('rewardplay.user_zone_id_column'), BaseModelActions::currentZoneId());
      });
   }
}

