<?php

namespace Kennofizet\RewardPlay\Services;

use Illuminate\Support\Facades\DB;

class TokenService
{
    /**
     * Get token column name from config
     */
    protected function getTokenColumnName()
    {
        return config('rewardplay.token_name', 'rewardpay_token');
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
        $tokenColumn = $this->getTokenColumnName();
        $tableName = $this->getUserTableName();

        DB::table($tableName)
            ->where('id', $userId)
            ->update([$tokenColumn => $token]);

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
        $tokenColumn = $this->getTokenColumnName();
        $tableName = $this->getUserTableName();

        return DB::table($tableName)
            ->where('id', $userId)
            ->value($tokenColumn);
    }

    /**
     * Generate a unique token
     * 
     * @return string
     */
    protected function generateUniqueToken()
    {
        $tokenColumn = $this->getTokenColumnName();
        $tableName = $this->getUserTableName();

        do {
            $token = bin2hex(random_bytes(32)); // 64 character hex string
            $exists = DB::table($tableName)
                ->where($tokenColumn, $token)
                ->exists();
        } while ($exists);

        return $token;
    }

    /**
     * Get token active column name from config
     */
    protected function getTokenActiveColumnName()
    {
        return config('rewardplay.token_active_name', 'token_active');
    }

    /**
     * Validate token
     * 
     * @param string $token
     * @return int|null User ID if valid and active, null otherwise
     */
    public function validateToken($token)
    {
        $tokenColumn = $this->getTokenColumnName();
        $tokenActiveColumn = $this->getTokenActiveColumnName();
        $tableName = $this->getUserTableName();

        $userId = DB::table($tableName)
            ->where($tokenColumn, $token)
            ->where($tokenActiveColumn, 1)
            ->value('id');

        return $userId;
    }

    /**
     * Check if user token is valid and active
     * 
     * @param string $token
     * @return array|null User data if valid, null otherwise
     */
    public function checkUser($token)
    {
        $tokenColumn = $this->getTokenColumnName();
        $tokenActiveColumn = $this->getTokenActiveColumnName();
        $tableName = $this->getUserTableName();

        $user = DB::table($tableName)
            ->where($tokenColumn, $token)
            ->where($tokenActiveColumn, 1)
            ->first();

        if (!$user) {
            return null;
        }

        return [
            'id' => $user->id,
            'token_active' => $user->{$tokenActiveColumn} ?? 1,
        ];
    }
}

