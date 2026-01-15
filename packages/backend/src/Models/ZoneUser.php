<?php

namespace Kennofizet\RewardPlay\Models;

use Illuminate\Database\Eloquent\Model;
use Kennofizet\RewardPlay\Models\User;
use Kennofizet\RewardPlay\Models\Zone;
use Kennofizet\RewardPlay\Models\ZoneUser\ZoneUserScopes;

/**
 * ZoneUser Model (Pivot table for zone-user many-to-many relationship)
 */
class ZoneUser extends Model
{
    use ZoneUserScopes;
    /**
     * Get the table name with prefix
     * 
     * @return string
     */
    public function getTable()
    {
        $tablePrefix = config('rewardplay.table_prefix', '');
        return $tablePrefix . 'rewardplay_zone_users';
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

    /**
     * Get the user that belongs to the zone.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the zone that the user belongs to.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function zone()
    {
        return $this->belongsTo(Zone::class, 'zone_id');
    }
}
