<?php

namespace Kennofizet\RewardPlay\Controllers\Player;

use Kennofizet\RewardPlay\Controllers\Controller;
use Kennofizet\RewardPlay\Services\Player\ShopService;
use Kennofizet\RewardPlay\Requests\PurchaseShopItemRequest;
use Illuminate\Http\JsonResponse;

class ShopController extends Controller
{
    public function __construct(
        protected ShopService $service
    ) {
    }

    /**
     * Get active shop items for the current zone (for shop page).
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $result = $this->service->getActiveShopItems();
        return $this->apiResponseWithContext($result);
    }

    /**
     * Purchase a shop item (deduct price, add item to bag).
     *
     * @param PurchaseShopItemRequest $request
     * @return JsonResponse
     */
    public function purchase(PurchaseShopItemRequest $request): JsonResponse
    {
        $userId = $request->attributes->get('rewardplay_user_id');

        $validated = $request->validated();
        $shopItemId = (int) $validated['shop_item_id'];
        $quantity = max(1, min(999, (int) ($validated['quantity'] ?? 1)));

        $result = $this->service->purchase((int) $userId, $shopItemId, $quantity);

        if (!$result['success']) {
            return $this->apiErrorResponse(
                $result['message'],
                $result['status'] ?? 400
            );
        }

        return $this->apiResponseWithContext([
            'success' => true,
            'user_bag' => $result['user_bag'],
            'coin' => $result['coin'],
            'ruby' => $result['ruby'],
        ]);
    }
}
