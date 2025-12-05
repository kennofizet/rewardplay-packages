<?php

namespace Kennofizet\RewardPlay\Traits;

use Kennofizet\RewardPlay\Services\TokenService;

trait HasRewardPlayToken
{
    /**
     * Get RewardPlay token for this user
     * 
     * @return string|null
     */
    public function getRewardplayToken()
    {
        $tokenService = app(TokenService::class);
        $token = $tokenService->getToken($this->id);
        
        // If token doesn't exist, create one
        if (!$token) {
            $token = $tokenService->createOrRefreshToken($this->id);
        }
        
        return $token;
    }

    /**
     * Refresh RewardPlay token for this user
     * 
     * @return string
     */
    public function refreshRewardplayToken()
    {
        $tokenService = app(TokenService::class);
        return $tokenService->createOrRefreshToken($this->id);
    }
}
