<?php

namespace Kennofizet\RewardPlay\Services;

use Illuminate\Support\Facades\DB;

class TokenService
{
    /**
     * Get tokens table name
     */
    protected function getTokensTableName()
    {
        $tablePrefix = config('rewardplay.table_prefix', '');
        return $tablePrefix . 'rewardplay_tokens';
    }

    /**
     * Get user table name from config
     */
    protected function getUserTableName()
    {
        return config('rewardplay.table_user', 'users');
    }

    /**
     * Create or refresh token for a user
     * 
     * @param int $userId
     * @return string The generated token
     */
    public function createOrRefreshToken($userId)
    {
        $token = $this->generateUniqueToken();
        $tokensTableName = $this->getTokensTableName();

        // Check if user already has a token
        $existingToken = DB::table($tokensTableName)
            ->where('user_id', $userId)
            ->where('is_active', true)
            ->first();

        if ($existingToken) {
            // Update existing token
            DB::table($tokensTableName)
                ->where('id', $existingToken->id)
                ->update([
                    'token' => $token,
                    'updated_at' => now(),
                ]);
        } else {
            // Create new token
            DB::table($tokensTableName)->insert([
                'user_id' => $userId,
                'token' => $token,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        return $token;
    }

    /**
     * Get token for a user
     * 
     * @param int $userId
     * @return string|null
     */
    public function getToken($userId)
    {
        $tokensTableName = $this->getTokensTableName();

        return DB::table($tokensTableName)
            ->where('user_id', $userId)
            ->where('is_active', true)
            ->value('token');
    }

    /**
     * Generate a unique token
     * 
     * @return string
     */
    protected function generateUniqueToken()
    {
        $tokensTableName = $this->getTokensTableName();

        do {
            $token = bin2hex(random_bytes(32)); // 64 character hex string
            $exists = DB::table($tokensTableName)
                ->where('token', $token)
                ->exists();
        } while ($exists);

        return $token;
    }

    /**
     * Validate token
     * 
     * @param string $token
     * @return int|null User ID if valid and active, null otherwise
     */
    public function validateToken($token)
    {
        $tokensTableName = $this->getTokensTableName();

        $tokenRecord = DB::table($tokensTableName)
            ->where('token', $token)
            ->where('is_active', true)
            ->first();

        return $tokenRecord ? $tokenRecord->user_id : null;
    }

    /**
     * Check if user token is valid and active
     * 
     * @param string $token
     * @return array|null User data if valid, null otherwise
     */
    public function checkUser($token)
    {
        $tokensTableName = $this->getTokensTableName();
        $userTableName = $this->getUserTableName();

        $tokenRecord = DB::table($tokensTableName)
            ->where('token', $token)
            ->where('is_active', true)
            ->first();

        if (!$tokenRecord) {
            return null;
        }

        $user = DB::table($userTableName)
            ->where('id', $tokenRecord->user_id)
            ->first();

        if (!$user) {
            return null;
        }

        return [
            'id' => $user->id,
            'token_active' => $tokenRecord->is_active ? 1 : 0,
        ];
    }
}
