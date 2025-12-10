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

        $zoneColumn = config('rewardplay.user_zone_id_column');
        $user = $this->resolveUserWithZone($userId, $zoneColumn);

        if (empty($user)) {
            return response()->json([
                'error' => 'User not found'
            ], 404);
        }

        if (!empty($zoneColumn)) {
            $zoneId = $user->{$zoneColumn} ?? null;
            $request->attributes->set('rewardplay_user_zone_id', $zoneId);
        }

        // Attach user info to request attributes (cannot be overridden by user input)
        $request->attributes->set('rewardplay_user_id', $userId);

        return $next($request);
    }

    /**
     * Resolve user and ensure zone column exists and is not null.
     *
     * @param int $userId
     * @param string $tableName
     * @param string $zoneColumn
     * @return object|false|null  user object, false if zone missing, null if user missing
     */
    protected function resolveUserWithZone(int $userId, string $zoneColumn)
    {
        $table_user = config('rewardplay.table_user', 'users');
        $user = DB::table($table_user)->where('id', $userId)
            ->first();

        if (empty($user)) {
            return null;
        }

        if (empty($zoneColumn)) {
            return $user;
        }

        if (empty($user->{$zoneColumn}) || $user->{$zoneColumn} === null) {
            return false;
        }

        return $user;
    }
}
