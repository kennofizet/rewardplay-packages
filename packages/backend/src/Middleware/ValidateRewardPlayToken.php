<?php

namespace Kennofizet\RewardPlay\Middleware;

use Closure;
use Illuminate\Http\Request;
use Kennofizet\RewardPlay\Services\TokenService;
use Kennofizet\RewardPlay\Models\ZoneUser;
use Kennofizet\RewardPlay\Models\ServerManager;
use Kennofizet\RewardPlay\Models\Zone;
use Kennofizet\RewardPlay\Core\Model\BaseModelActions;
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

        // Get the server ID that the user manages (single server per user)
        $managedServerId = $this->getUserManagedServerId($userId);
        $request->attributes->set('rewardplay_user_managed_server_id', $managedServerId);

        if(empty($managedZoneIds) && empty($zoneIds) && empty($managedServerId)){
            return $this->apiErrorResponse('User not in any zone or not managing any server', 403);
        }

        // Validate zone_id and server_id from request (if provided)
        // User can only use their own server/zone
        $validationError = $this->validateRequestPermissions($request, $managedServerId, $managedZoneIds);
        if ($validationError) {
            return $validationError;
        }

        return $next($request);
    }

    /**
     * Validate zone_id and server_id from request
     * User can only use their managed server/zone
     * Validates both request input and route parameters
     *
     * @param Request $request
     * @param int|null $managedServerId
     * @param array $managedZoneIds
     * @return \Illuminate\Http\JsonResponse|null
     */
    protected function validateRequestPermissions(Request $request, ?int $managedServerId, array $managedZoneIds)
    {
        // Validate server_id if provided in request
        if ($request->has('server_id')) {
            $requestServerId = $request->input('server_id');
            if (!empty($requestServerId) && $requestServerId != $managedServerId) {
                return $this->apiErrorResponse('You do not have permission to manage this server', 403);
            }
        }

        // Validate zone_id if provided in request
        if ($request->has('zone_id')) {
            $requestZoneId = $request->input('zone_id');
            if (!empty($requestZoneId) && !in_array($requestZoneId, $managedZoneIds)) {
                return $this->apiErrorResponse('You do not have permission to manage this zone', 403);
            }
        }

        // Validate zone_id from route parameters (for update/delete operations)
        // Check if route has 'zone' or 'zoneId' parameter
        $routeZoneId = $request->route('zone') ?? $request->route('zoneId');
        if (!empty($routeZoneId) && !in_array($routeZoneId, $managedZoneIds)) {
            return $this->apiErrorResponse('You do not have permission to manage this zone', 403);
        }

        // Validate server_id from route parameters
        $routeServerId = $request->route('server') ?? $request->route('serverId');
        if (!empty($routeServerId) && $routeServerId != $managedServerId) {
            return $this->apiErrorResponse('You do not have permission to manage this server', 403);
        }

        return null;
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
        // But we can use getTable() method which just returns the table name from config
        $table_user = (new \Kennofizet\RewardPlay\Models\User())->getTable();
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

    /**
     * Get the server ID that the user manages (single server per user)
     * User can only manage one server - the server they are assigned to
     *
     * @param int $userId
     * @return int|null
     */
    protected function getUserManagedServerId(int $userId): ?int
    {
        $serverColumn = config('rewardplay.user_server_id_column');
        if (empty($serverColumn)) {
            return null;
        }
        
        $user = $this->resolveUserWithServer($userId, $serverColumn);
        if (empty($user)) {
            return null;
        }
        
        $serverId = $user->{$serverColumn};
        if (empty($serverId)) {
            return null;
        }
        
        // Check if user is a manager for this server
        $checkManagedServer = ServerManager::byUser($userId)->byServer($serverId)->first();
        if (empty($checkManagedServer)) {
            return null;
        }
        
        return $serverId;
    }
}
