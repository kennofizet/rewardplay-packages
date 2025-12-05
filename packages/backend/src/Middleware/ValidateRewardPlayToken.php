<?php

namespace Kennofizet\RewardPlay\Middleware;

use Closure;
use Illuminate\Http\Request;
use Kennofizet\RewardPlay\Services\TokenService;
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
                'error' => 'Invalid or inactive token',
            ], 401);
        }

        // Check if user exists
        $tableName = config('rewardplay.table_user', 'users');
        
        $user = DB::table($tableName)
            ->where('id', $userId)
            ->first();

        if (!$user) {
            return response()->json([
                'error' => 'User not found',
            ], 404);
        }

        // Attach user ID to request attributes (cannot be overridden by user input)
        $request->attributes->set('rewardplay_user_id', $userId);

        return $next($request);
    }
}
