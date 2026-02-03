<?php

namespace Kennofizet\RewardPlay\Core\Model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Kennofizet\RewardPlay\Core\Model\BaseModelActions;
use Kennofizet\RewardPlay\Core\Model\BaseModelManage;
use Kennofizet\RewardPlay\Core\Model\BaseModelRelations;
use Kennofizet\RewardPlay\Core\Model\BaseModelScopes;
use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;
use Illuminate\Database\Eloquent\Builder;

class BaseModel extends Model
{
    use BaseModelActions;
    use BaseModelManage;
    use BaseModelRelations;
    use BaseModelScopes;
    use SoftDeletes;
    /**
     * Boot the model and apply global scopes
     */
    // Hidden attributes for all models
    protected $hidden = [
        HelperConstant::IS_DELETED_STATUS_COLUMN,
        HelperConstant::ZONE_ID_COLUMN
    ];
    
    protected static function boot()
    {
        parent::boot();

        // Apply global scope for zone filtering
        static::addGlobalScope('is_in_zone', function (Builder $builder) {
            $table = $builder->getModel()->getTable();
            $array_skips = [];
            
            if (self::tableHasColumn($table, HelperConstant::ZONE_ID_COLUMN) && !in_array($table, $array_skips)) {
                $builder->isInZone();
            }
        });

        // Global delete_status scope - use is_deleted_status column
        static::addGlobalScope('without_delete_status', function (Builder $builder) {
            try {
                $table = $builder->getModel()->getTable();

                $array_skips = [
                    (new \Kennofizet\RewardPlay\Models\User())->getTable()
                ];
                
                if (self::tableHasColumn($table, HelperConstant::IS_DELETED_STATUS_COLUMN) && !in_array($table, $array_skips)) {
                    $builder->withoutDeleteStatus();
                }
            } catch (\Exception $e) {
            }
        });

        // Auto-add zone_id when creating models (if table has zone_id column and it's not already set)
        static::creating(function ($model) {
            $table = $model->getTable();
            
            // Check if table has zone_id column
            if (self::tableHasColumn($table, HelperConstant::ZONE_ID_COLUMN)) {
                // Only set zone_id if it's not already set and we have a current zone_id from request
                if (empty($model->zone_id) && request()) {
                    $currentZoneId = request()->attributes->get('rewardplay_user_zone_id_current');
                    if (!empty($currentZoneId)) {
                        $model->zone_id = $currentZoneId;
                    }
                }
            }
        });
    }

    /**
     * Get table name with prefix
     * Use this in all model's getTable() method
     * 
     * @param string $tableName - Table name without prefix (e.g., 'rewardplay_tokens', 'rewardplay_setting_item_set_items')
     * @return string
     */


}