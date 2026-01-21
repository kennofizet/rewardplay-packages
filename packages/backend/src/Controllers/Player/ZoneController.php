<?php

namespace Kennofizet\RewardPlay\Controllers\Player;

use Kennofizet\RewardPlay\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Kennofizet\RewardPlay\Core\Model\BaseModelActions;
use Kennofizet\RewardPlay\Models\Zone;
use Kennofizet\RewardPlay\Services\SettingRewardPlay\ZoneService;

class ZoneController extends Controller
{
    protected ZoneService $zoneService;

    public function __construct(ZoneService $zoneService)
    {
        $this->zoneService = $zoneService;
    }
    /**
     * Return zones the current user belongs to (or is in).
     */
    public function index(Request $request): JsonResponse
    {
        // Get zone IDs user belongs to
        $zoneIds = BaseModelActions::currentUserZoneIds();

        if (empty($zoneIds)) {
            return $this->apiResponseWithContext([
                'zones' => [],
            ]);
        }

        $zones = Zone::byZoneIds($zoneIds)->get();

        $result = $zones->map(function ($z) {
            return [
                'id' => $z->id,
                'name' => $z->name,
            ];
        })->toArray();

        return $this->apiResponseWithContext([
            'zones' => $result,
        ]);
    }

    /**
     * Return zones the current user can manage (for settings management).
     */
    public function managed(Request $request): JsonResponse
    {
        try {
            $zones = $this->zoneService->getZonesUserCanManage();

            return $this->apiResponseWithContext([
                'zones' => $zones,
            ]);
        } catch (\Exception $e) {
            return $this->apiErrorResponse($e->getMessage(), 400);
        }
    }
}
