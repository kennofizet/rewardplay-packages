<?php

namespace Kennofizet\RewardPlay\Controllers\Player;

use Kennofizet\RewardPlay\Controllers\Controller;
use Kennofizet\RewardPlay\Services\Player\BagService;
use Kennofizet\RewardPlay\Models\UserBagItem\UserBagItemModelResponse;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Kennofizet\RewardPlay\Models\UserBagItem\UserBagItemConstant;

class BagController extends Controller
{
    protected BagService $service;

    public function __construct(BagService $service)
    {
        $this->service = $service;
    }

    /**
     * Get user bag items
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $userId = $request->attributes->get('rewardplay_user_id');
        $reponseMode = UserBagItemConstant::PLAYER_API_RESPONSE_BAG_PAGE;

        $categorized = $this->service->getUserBagCategorized($userId);

        if ($request->expectsJson()) {            
            // Format categorized items
            $formattedCategorized = [];
            foreach ($categorized as $category => $items) {
                $formattedCategorized[$category] = UserBagItemModelResponse::formatUserBagItems($items, $reponseMode);
            }

            return $this->apiResponseWithContext([
                'user_bag' => $formattedCategorized,
            ]);
        }

        return $this->apiErrorResponse();
    }
}
