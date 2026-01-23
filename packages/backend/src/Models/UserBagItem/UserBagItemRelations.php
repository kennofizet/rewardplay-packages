<?php

namespace Kennofizet\RewardPlay\Models\UserBagItem;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Kennofizet\RewardPlay\Models\SettingItem;

trait UserBagItemRelations
{
    public function item(): BelongsTo
    {
        return $this->belongsTo(SettingItem::class, 'item_id');
    }
}
