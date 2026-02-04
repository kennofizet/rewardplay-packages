<?php

namespace Kennofizet\RewardPlay\Models\UserProfile;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Kennofizet\RewardPlay\Models\User;

trait UserProfileRelations
{
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
