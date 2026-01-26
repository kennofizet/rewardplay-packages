<?php

namespace Kennofizet\RewardPlay\Models\UserEventTransaction;

use Kennofizet\RewardPlay\Models\UserEventTransaction;

trait UserEventTransactionActions
{
    /**
     * Check if a user has claimed a specific model instance
     * 
     * @param int $userId
     * @param string $modelType
     * @param int $modelId
     * @return bool
     */
    public static function hasClaimed($userId, $modelType, $modelId): bool
    {
        $query = self::where('user_id', $userId)
            ->where('model_type', $modelType)
            ->where('model_id', $modelId);
        
        return $query->exists();
    }

    /**
     * Get all transactions for a user
     * 
     * @param int $userId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getByUser($userId)
    {
        $query = self::where('user_id', $userId);
        
        return $query->get();
    }
}
