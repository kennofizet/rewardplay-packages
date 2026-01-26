<?php

namespace Kennofizet\RewardPlay\Controllers\Player;

use Kennofizet\RewardPlay\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Kennofizet\RewardPlay\Services\Player\PlayerService;

/**
 * PlayerController
 *
 * This controller holds player-facing endpoints that must be validated against the player's current zone.
 */
class PlayerController extends Controller
{
    protected PlayerService $playerService;

    public function __construct(PlayerService $playerService)
    {
        $this->playerService = $playerService;
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
