<?php

namespace Company\RewardPlay\Middleware;

use Closure;
use Illuminate\Http\Request;
use Company\RewardPlay\Services\TokenService;
use Illuminate\Support\Facades\DB;

class ValidateRewardPlayToken
{
    protected $tokenService;

    public function __construct(TokenService $tokenService)
    {
        $this->tokenService = $tokenService;
    }

    public function handle(Request $request, Closure $next)
    {
        $token = $request->header('X-RewardPlay-Token');

        if (!$token) {
            return response()->json([
                'error' => 'RewardPlay token is required',
            ], 401);
        }

        $userId = $this->tokenService->validateToken($token);

        if (!$userId) {
            return response()->json([
                'error' => 'Invalid token',
            ], 401);
        }

        // Check if user exists and token is active
        $tableName = config('rewardplay.table_user', 'users');
        $tokenActiveColumnName = config('rewardplay.token_active_name', 'token_active');
        
        $user = DB::table($tableName)
            ->where('id', $userId)
            ->first();

        if (!$user) {
            return response()->json([
                'error' => 'User not found',
            ], 404);
        }

        // Check if token is active
        $tokenActive = $user->{$tokenActiveColumnName} ?? 1;
        if ($tokenActive != 1) {
            return response()->json([
                'error' => 'Token is inactive',
            ], 403);
        }

        // Attach user ID to request attributes (cannot be overridden by user input)
        $request->attributes->set('rewardplay_user_id', $userId);

        return $next($request);
    }
}

