<?php

namespace Kennofizet\RewardPlay\Models\UserEventTransaction;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Kennofizet\RewardPlay\Models\User;
use Kennofizet\RewardPlay\Models\Zone;

trait UserEventTransactionRelations
{
    /**
     * Get the user that owns this transaction
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the zone for this transaction
     */
    public function zone(): BelongsTo
    {
        return $this->belongsTo(Zone::class, 'zone_id');
    }

    /**
     * Get the polymorphic model (e.g., SettingDailyReward)
     */
    public function model(): MorphTo
    {
        return $this->morphTo('model', 'model_type', 'model_id');
    }
}
