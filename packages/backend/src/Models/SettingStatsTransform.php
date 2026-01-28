<?php

namespace Kennofizet\RewardPlay\Models;

use Kennofizet\RewardPlay\Models\SettingStatsTransform\SettingStatsTransformRelations;
use Kennofizet\RewardPlay\Models\SettingStatsTransform\SettingStatsTransformScopes;
use Kennofizet\RewardPlay\Models\SettingStatsTransform\SettingStatsTransformActions;
use Kennofizet\RewardPlay\Core\Model\BaseModel;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * SettingStatsTransform Model
 */
class SettingStatsTransform extends BaseModel
{
    use SettingStatsTransformRelations, SettingStatsTransformActions, SettingStatsTransformScopes, SoftDeletes;

    /**
     * Get the table name with prefix
     * 
     * @return string
     */
    public function getTable()
    {
        return self::getPivotTableName('rewardplay_setting_stats_transforms');
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'target_key',
        'conversions',
        'zone_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'conversions' => 'array', // Array of {source_key, conversion_value}
    ];
}
