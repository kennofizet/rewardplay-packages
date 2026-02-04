<?php

namespace Kennofizet\RewardPlay\Controllers\Player;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Kennofizet\RewardPlay\Controllers\Controller;
use Kennofizet\RewardPlay\Services\Player\ShopService;
use Kennofizet\RewardPlay\Requests\PurchaseShopItemRequest;

class ShopController extends Controller
{
    public function __construct(
        protected ShopService $service
    ) {
    }

    /**
     * Get active shop items for the current zone (for shop page).
     * Includes spendable_items when user is authenticated (for item-type price checks).
     *
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $userId = $request->attributes->get('rewardplay_user_id');
        $result = $this->service->getActiveShopItems($userId ? (int) $userId : null);
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
            'spendable_items' => $result['spendable_items'] ?? [],
        ]);
    }
}
