<?php

namespace Kennofizet\RewardPlay\Services;

use Kennofizet\RewardPlay\Models\Token;
use Kennofizet\RewardPlay\Models\User;

class TokenService
{
    /**
     * Create or refresh token for a user
     * 
     * @param int $userId
     * @return string The generated token
     */
    public function createOrRefreshToken($userId)
    {
        $token = $this->generateUniqueToken();

        // Check if user already has a token
        $existingToken = Token::byUser($userId)
            ->active()
            ->first();

        if ($existingToken) {
            // Update existing token
            $existingToken->update([
                'token' => $token,
            ]);
        } else {
            // Create new token
            Token::create([
                'user_id' => $userId,
                'token' => $token,
                'is_active' => true,
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
        $token = Token::byUser($userId)
            ->active()
            ->first();

        return $token ? $token->token : null;
    }

    /**
     * Generate a unique token
     * 
     * @return string
     */
    protected function generateUniqueToken()
    {
        do {
            $token = bin2hex(random_bytes(32)); // 64 character hex string
            $exists = Token::byToken($token)->exists();
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
        $tokenRecord = Token::byToken($token)
            ->active()
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
        $tokenRecord = Token::byToken($token)
            ->active()
            ->first();

        if (!$tokenRecord) {
            return null;
        }

        $user = User::byId($tokenRecord->user_id)->first();

        if (!$user) {
            return null;
        }

        return [
            'token_active' => $tokenRecord->is_active ? 1 : 0,
        ];
    }
}
