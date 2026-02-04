<?php

namespace Kennofizet\RewardPlay\Models\UserBagItem;

use Illuminate\Database\Eloquent\Builder;

trait UserBagItemScopes
{
    /**
     * Scope to filter by ID
     * 
     * @param Builder $query
     * @param int $id
     * @return Builder
     */
    public function scopeById(Builder $query, int $id): Builder
    {
        return $query->where('id', $id);
    }

    /**
     * Scope to filter by user
     * 
     * @param Builder $query
     * @param int $userId
     * @return Builder
     */
    public function scopeByUser(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope to filter by item type
     * 
     * @param Builder $query
     * @param string $itemType
     * @return Builder
     */
    public function scopeByItemType(Builder $query, string $itemType): Builder
    {
        return $query->where('item_type', $itemType);
    }

    /**
     * Scope to filter by item ID
     * 
     * @param Builder $query
     * @param int $itemId
     * @return Builder
     */
    public function scopeByItemId(Builder $query, int $itemId): Builder
    {
        return $query->where('item_id', $itemId);
    }
}
