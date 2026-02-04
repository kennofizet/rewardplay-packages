<?php

namespace Kennofizet\RewardPlay\Controllers\Settings;

use Kennofizet\RewardPlay\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Kennofizet\RewardPlay\Services\SettingRewardPlay\ZoneService;

class ZoneController extends Controller
{
    protected ZoneService $zoneService;

    public function __construct(ZoneService $zoneService)
    {
        $this->zoneService = $zoneService;
    }

    /**
     * List zones (with optional filters)
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['name', 'perPage', 'currentPage']);

        $zones = $this->zoneService->getZones($filters);

        if ($request->expectsJson()) {
            return $this->apiResponseWithContext([
                'zones' => $zones,
            ]);
        }

        return $this->apiErrorResponse();
    }

    /**
     * Create zone
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->only(['name', 'server_id']);

        try {
            $zone = $this->zoneService->createZone($data);

            return $this->apiResponseWithContext([
                'zone' => $zone,
            ], 201);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Update zone
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $data = $request->only(['name', 'server_id']);

        try {
            $zone = $this->zoneService->editZone($id, $data);

            if (!$zone) {
                return $this->apiErrorResponse('Zone not found', 404);
            }

            return $this->apiResponseWithContext([
                'zone' => $zone,
            ]);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Delete zone
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        try {
            $deleted = $this->zoneService->deleteZone($id);

            if (!$deleted) {
                return $this->apiErrorResponse('Zone not found', 404);
            }

            return $this->apiResponseWithContext(['message' => 'Zone deleted']);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * List users in the same server and the users assigned to a zone
     */
    public function users(Request $request, int $id): JsonResponse
    {
        try {
            $filters = $request->only(['search']);

            $serverUsers = $this->zoneService->getServerUsers($filters);
            $zoneUsers = $this->zoneService->getZoneUsers($id);

            $assignedIds = array_map(function ($u) { return $u['id'] ?? ($u->id ?? null); }, $zoneUsers);

            return $this->apiResponseWithContext([
                'users' => $serverUsers,
                'assigned_user_ids' => $assignedIds,
            ]);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Assign a user to a zone
     */
    public function assignUser(Request $request, int $id): JsonResponse
    {
        $userId = $request->input('user_id');

        try {
            $this->zoneService->assignUserToZone($id, (int)$userId);

            return $this->apiResponseWithContext(['message' => 'User assigned']);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Remove a user from a zone
     */
    public function removeUser(Request $request, int $id, int $userId): JsonResponse
    {
        try {
            $this->zoneService->removeUserFromZone($id, $userId);

            return $this->apiResponseWithContext(['message' => 'User removed']);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }
}
