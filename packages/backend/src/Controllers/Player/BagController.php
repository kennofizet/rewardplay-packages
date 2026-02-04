<?php

namespace Kennofizet\RewardPlay\Controllers\Player;

use Kennofizet\RewardPlay\Controllers\Controller;
use Kennofizet\RewardPlay\Services\Player\BagService;
use Kennofizet\RewardPlay\Models\UserBagItem\UserBagItemModelResponse;
use Kennofizet\RewardPlay\Requests\SaveGearsRequest;
use Kennofizet\RewardPlay\Requests\OpenBoxRequest;
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

            $bagMenu = $this->service->getBagMenuConfig();

            return $this->apiResponseWithContext([
                'user_bag' => $formattedCategorized,
                'bag_menu' => $bagMenu,
            ]);
        }

        return $this->apiErrorResponse();
    }

    /**
     * Save/update user's worn gears
     * 
     * @param SaveGearsRequest $request
     * @return JsonResponse
     */
    public function saveGears(SaveGearsRequest $request): JsonResponse
    {
        $userId = $request->attributes->get('rewardplay_user_id');
        
        $validated = $request->validated();
        $gearMapping = $validated['gears'];

        try {
            $result = $this->service->saveGears($userId, $gearMapping);

            return $this->apiResponseWithContext($result);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->apiErrorResponse($e->getMessage(), 400, $e->errors());
        } catch (\Exception $e) {
            return $this->apiErrorResponse($e->getMessage(), 500);
        }
    }

    /**
     * Open box_random item(s) from bag (consume quantity, grant random rewards by rate_list).
     *
     * @param OpenBoxRequest $request - body: user_bag_item_id (int), quantity (int, optional, default 1)
     * @return JsonResponse - user_bag, rewards
     */
    public function openBox(OpenBoxRequest $request): JsonResponse
    {
        $userId = $request->attributes->get('rewardplay_user_id');

        $validated = $request->validated();
        $userBagItemId = (int) $validated['user_bag_item_id'];
        $quantity = max(1, min(99, (int) ($validated['quantity'] ?? 1)));

        try {
            $result = $this->service->openBox((int) $userId, $userBagItemId, $quantity);
            return $this->apiResponseWithContext($result);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->apiErrorResponse($e->getMessage(), 400, $e->errors());
        } catch (\Exception $e) {
            return $this->apiErrorResponse($e->getMessage(), 400);
        }
    }
}
