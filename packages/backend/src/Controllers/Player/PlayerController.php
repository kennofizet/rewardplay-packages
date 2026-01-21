<?php

namespace Kennofizet\RewardPlay\Controllers\Player;

use Kennofizet\RewardPlay\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Kennofizet\RewardPlay\Core\Model\BaseModelActions;
use Kennofizet\RewardPlay\Services\Player\PlayerService;

/**
 * PlayerController
 *
 * This controller holds player-facing endpoints that must be validated against the player's current zone.
 * For normal players: every request that affects gameplay should include `zone_id` in params.
 */
class PlayerController extends Controller
{
    protected PlayerService $playerService;

    public function __construct(PlayerService $playerService)
    {
        $this->playerService = $playerService;
    }

    /**
     * Validate zone_id exists and the current user is part of that zone.
     * Returns true if valid, otherwise throws a JSON response.
     */
    protected function validateZoneOrFail(?int $zoneId)
    {
        if (!$zoneId) {
            abort(response()->json(['message' => 'zone_id is required'], 400));
        }

        $userZoneIds = BaseModelActions::currentUserZoneIds();

        if (!in_array($zoneId, $userZoneIds)) {
            abort(response()->json(['message' => 'Forbidden for this zone'], 403));
        }

        return true;
    }

    /**
     * Example action endpoint that requires zone validation.
     * Frontend must pass `zone_id` in the request body or query.
     */
    public function doAction(Request $request): JsonResponse
    {
        $zoneId = $request->input('zone_id');
        $this->validateZoneOrFail($zoneId);

        // Example: perform some player action scoped to the $zoneId
        // (Implementation should be replaced with real logic.)

        return response()->json([
            'success' => true,
            'zone_id' => $zoneId,
            'message' => 'Action executed for zone',
        ]);
    }

    /**
     * Get custom images list for loading by player endpoints
     * This was previously on SettingItemController and moved to player scope.
     */
    public function getCustomImages(Request $request): JsonResponse
    {
        try {
            $images = $this->playerService->getCustomImages();

            if ($request->expectsJson()) {
                return $this->apiResponseWithContext([
                    'images' => $images,
                    'total' => count($images),
                ]);
            }

            return $this->apiErrorResponse();
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }
}
