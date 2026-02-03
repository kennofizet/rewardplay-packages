<?php

namespace Kennofizet\RewardPlay\Controllers\Settings;

use Kennofizet\RewardPlay\Controllers\Controller;
use Kennofizet\RewardPlay\Services\Model\SettingShopItemService;
use Kennofizet\RewardPlay\Models\SettingShopItem\SettingShopItemConstant;
use Kennofizet\RewardPlay\Models\SettingShopItem\SettingShopItemModelResponse;
use Kennofizet\RewardPlay\Requests\StoreSettingShopItemRequest;
use Kennofizet\RewardPlay\Requests\UpdateSettingShopItemRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SettingShopItemController extends Controller
{
    public function __construct(
        protected SettingShopItemService $settingShopItemService
    ) {
    }

    /**
     * Get all setting shop items (paginated).
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['perPage', 'currentPage', 'category', 'is_active', 'event_id']);
        $mode = SettingShopItemConstant::API_LIST_PAGE;
        $items = $this->settingShopItemService->getSettingShopItems($filters, $mode);
        $formatted = SettingShopItemModelResponse::formatSettingShopItems($items, $mode);

        return $this->apiResponseWithContext([
            'shop_items' => $formatted,
        ]);
    }

    /**
     * Get a single setting shop item.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $mode = SettingShopItemConstant::API_LIST_PAGE;
        $shopItem = $this->settingShopItemService->getSettingShopItem($id, $mode);
        if (!$shopItem) {
            return $this->apiErrorResponse('Setting shop item not found', 404);
        }

        return $this->apiResponseWithContext([
            'shop_item' => SettingShopItemModelResponse::formatSettingShopItem($shopItem, $mode),
        ]);
    }

    /**
     * Create a new setting shop item.
     *
     * @param StoreSettingShopItemRequest $request
     * @return JsonResponse
     */
    public function store(StoreSettingShopItemRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $shopItem = $this->settingShopItemService->createSettingShopItem($data);
            return $this->apiResponseWithContext([
                'shop_item' => SettingShopItemModelResponse::formatSettingShopItem($shopItem),
            ], 201);
        } catch (\Exception $e) {
            return $this->handleException($e, 400);
        }
    }

    /**
     * Update a setting shop item.
     *
     * @param UpdateSettingShopItemRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(UpdateSettingShopItemRequest $request, int $id): JsonResponse
    {
        try {
            $data = $request->validated();
            $shopItem = $this->settingShopItemService->updateSettingShopItem($id, $data);
            return $this->apiResponseWithContext([
                'shop_item' => SettingShopItemModelResponse::formatSettingShopItem($shopItem),
            ]);
        } catch (\Exception $e) {
            return $this->handleException($e, 400);
        }
    }

    /**
     * Delete a setting shop item.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $deleted = $this->settingShopItemService->deleteSettingShopItem($id);
            if (!$deleted) {
                return $this->apiErrorResponse('Setting shop item not found', 404);
            }
            return $this->apiResponseWithContext(['message' => 'Deleted']);
        } catch (\Exception $e) {
            return $this->handleException($e, 400);
        }
    }
}
