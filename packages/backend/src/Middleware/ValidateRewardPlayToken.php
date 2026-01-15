<?php

namespace Kennofizet\RewardPlay\Middleware;

use Closure;
use Illuminate\Http\Request;
use Kennofizet\RewardPlay\Services\TokenService;
use Kennofizet\RewardPlay\Models\ZoneUser;
use Kennofizet\RewardPlay\Models\ServerManager;
use Kennofizet\RewardPlay\Models\Zone;
use Kennofizet\RewardPlay\Traits\GlobalDataTrait;
use Illuminate\Support\Facades\DB;

class ValidateRewardPlayToken
{
    use GlobalDataTrait;
    protected $tokenService;

    public function __construct(TokenService $tokenService)
    {
        $this->tokenService = $tokenService;
    }

    public function handle(Request $request, Closure $next)
    {
        $token = $request->header('X-RewardPlay-Token');

        if (!$token) {
            return $this->apiErrorResponse('RewardPlay token is required', 401);
        }

        $userId = $this->tokenService->validateToken($token);

        if (!$userId) {
            return $this->apiErrorResponse('Invalid or inactive token', 401);
        }

        $serverColumn = config('rewardplay.user_server_id_column');
        $user = $this->resolveUserWithServer($userId, $serverColumn);

        if (empty($user)) {
            return $this->apiErrorResponse('User not found', 404);
        }

        // Get server_id if configured
        $serverId = null;
        if (!empty($serverColumn) && !empty($user->{$serverColumn})) {
            $serverId = $user->{$serverColumn};
            $request->attributes->set('rewardplay_user_server_id', $serverId);
        }

        // Get array of zone IDs that the user manages
        $managedZoneIds = $this->getUserManagedZoneIds($userId);
        $request->attributes->set('rewardplay_user_managed_zone_ids', $managedZoneIds);

        // Get zones array from zone_users pivot table
        $zoneIds = $this->getUserZoneIds($userId);
        $request->attributes->set('rewardplay_user_zone_ids', $zoneIds);

        // Attach user info to request attributes (cannot be overridden by user input)
        $request->attributes->set('rewardplay_user_id', $userId);

        if(empty($managedZoneIds) && empty($zoneIds)){
            return $this->apiErrorResponse('User not in any zone or not managing any server', 403);
        }

        return $next($request);
    }

    /**
     * Resolve user and ensure server column exists and is not null.
     *
     * @param int $userId
     * @param string $serverColumn
     * @return object|false|null  user object, false if server missing, null if user missing
     */
    protected function resolveUserWithServer(int $userId, ?string $serverColumn = null)
    {
        // Dont use User model because it runing before set server id to request attributes
        $table_user = config('rewardplay.table_user', 'users');
        $user = DB::table($table_user)->where('id', $userId)
            ->first();

        if (empty($user)) {
            return null;
        }

        if (empty($serverColumn)) {
            return $user;
        }

        if (empty($user->{$serverColumn}) || $user->{$serverColumn} === null) {
            return false;
        }

        return $user;
    }

    /**
     * Get array of zone IDs that the user manages (via server managers)
     *
     * @param int $userId
     * @return array
     */
    protected function getUserManagedZoneIds(int $userId): array
    {
        // Get server IDs that the user manages
        $serverIds = ServerManager::byUser($userId)->pluck('server_id')->toArray();
        
        if (empty($serverIds)) {
            return [];
        }

        // Get all zones that belong to these servers
        $zoneIds = Zone::byServerIds($serverIds)->pluck('id')->toArray();

        return array_values(array_filter($zoneIds, function($id) {
            return !empty($id);
        }));
    }

    /**
     * Get array of zone IDs that the user is in (from zone_users pivot table) 
     * merged with zones the user manages (via server managers)
     *
     * @param int $userId
     * @return array
     */
    protected function getUserZoneIds(int $userId): array
    {
        // Get zones from zone_users pivot table
        $zoneIdsFromPivot = ZoneUser::byUserId($userId)
            ->pluck('zone_id')
            ->toArray();

        // Get zones from server managers (zones in servers user manages)
        $zoneIdsFromManager = $this->getUserManagedZoneIds($userId);

        // Merge both arrays and get unique zone IDs
        $zoneIds = array_unique(array_merge($zoneIdsFromPivot, $zoneIdsFromManager));

        // when user leave the server, that user also leave the zones of that server
        $zoneIds = Zone::byZoneIds($zoneIds)->pluck('id')->toArray();

        return array_values(array_filter($zoneIds, function($id) {
            return !empty($id);
        }));
    }

}
