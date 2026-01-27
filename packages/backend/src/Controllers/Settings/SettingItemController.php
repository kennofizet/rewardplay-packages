<?php

namespace Kennofizet\RewardPlay\Controllers\Settings;

use Kennofizet\RewardPlay\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Kennofizet\RewardPlay\Services\Model\SettingItemService;
use Kennofizet\RewardPlay\Models\SettingItem\SettingItemModelResponse;
use Kennofizet\RewardPlay\Models\SettingItem;
use Kennofizet\RewardPlay\Requests\StoreSettingItemRequest;
use Kennofizet\RewardPlay\Requests\UpdateSettingItemRequest;
use Kennofizet\RewardPlay\Models\SettingItem\SettingItemConstant;

class SettingItemController extends Controller
{
    protected SettingItemService $settingItemService;   

    public function __construct(SettingItemService $settingItemService) {
        $this->settingItemService = $settingItemService;
    }

    /**
     * Get all setting items
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only([
            'perPage', 
            'currentPage', 
            'keySearch', 
            'q',
            'type'
        ]);
        
        $reponseMode = SettingItemConstant::API_SETTING_ITEM_LIST_PAGE;

        $settingItems = $this->settingItemService->getSettingItems($filters, $reponseMode);

        if ($request->expectsJson()) {
            $formattedSettingItems = SettingItemModelResponse::formatSettingItems($settingItems, $reponseMode);
            
            return $this->apiResponseWithContext([
                'setting_items' => $formattedSettingItems
            ]);
        }

        return $this->apiErrorResponse();
    }

    /**
     * Create a new setting item
     * 
     * @param StoreSettingItemRequest $request
     * @return JsonResponse
     */
    public function store(StoreSettingItemRequest $request): JsonResponse
    {
        $data = $request->validated();
        
        // Get image file if uploaded
        $imageFile = $request->hasFile('image') ? $request->file('image') : null;

        try {
            $settingItem = $this->settingItemService->createSettingItem($data, $imageFile);
            $reponseMode = "";
            $formattedSettingItem = SettingItemModelResponse::formatSettingItem($settingItem, $reponseMode);

            return $this->apiResponseWithContext([
                'setting_item' => $formattedSettingItem,
            ], 201);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Update a setting item
     * 
     * @param UpdateSettingItemRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(UpdateSettingItemRequest $request, int $id): JsonResponse
    {
        $data = $request->validated();

        // Get image file if uploaded
        $imageFile = $request->hasFile('image') ? $request->file('image') : null;

        try {
            $settingItem = $this->settingItemService->updateSettingItem($id, $data, $imageFile);

            if (!$settingItem) {
                return $this->apiErrorResponse('Setting item not found', 404);
            }

            $reponseMode = "";
            $formattedSettingItem = SettingItemModelResponse::formatSettingItem($settingItem, $reponseMode);

            return $this->apiResponseWithContext([
                'setting_item' => $formattedSettingItem,
            ]);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Delete a setting item
     * 
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $deleted = $this->settingItemService->deleteSettingItem($id);

        if (!$deleted) {
            return $this->apiErrorResponse('Setting item not found', 404);
        }

        return $this->apiResponseWithContext([
            'message' => 'Setting item deleted successfully',
        ]);
    }

    /**
     * Get items for a current user zone (for selecting items in set)
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function getItemsForZone(Request $request): JsonResponse
    {
        try {
            $items = $this->settingItemService->getItemsForZone();

            if ($request->expectsJson()) {
                return $this->apiResponseWithContext([
                    'items' => $items,
                ]);
            }

            return $this->apiErrorResponse();
        } catch (\Exception $e) {
            return $this->apiErrorResponse($e->getMessage(), 400);
        }
    }
}
