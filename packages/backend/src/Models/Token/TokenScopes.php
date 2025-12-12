<?php

namespace Kennofizet\RewardPlay\Models\Token;

use Illuminate\Database\Eloquent\Builder;

/**
 * Token Model Scopes
 */
trait TokenScopes
{
    /**
     * Scope to filter by user_id
     * 
     * @param Builder $query
     * @param int $userId
     * @return Builder
     */
    public function scopeByUser(Builder $query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope to filter active tokens
     * 
     * @param Builder $query
     * @return Builder
     */
    public function scopeActive(Builder $query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to filter by token string
     * 
     * @param Builder $query
     * @param string $token
     * @return Builder
     */
    public function scopeByToken(Builder $query, $token)
    {
        return $query->where('token', $token);
    }
}

