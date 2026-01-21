<?php

namespace Kennofizet\RewardPlay\Controllers;

use Kennofizet\RewardPlay\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Kennofizet\RewardPlay\Services\Model\SettingItemService;
use Kennofizet\RewardPlay\Services\SettingRewardPlay\ZoneService;
use Kennofizet\RewardPlay\Models\SettingItem\SettingItemModelResponse;
use Kennofizet\RewardPlay\Models\SettingItem;
use Kennofizet\RewardPlay\Requests\StoreSettingItemRequest;
use Kennofizet\RewardPlay\Requests\UpdateSettingItemRequest;
use Kennofizet\RewardPlay\Core\Model\BaseModelActions;

class SettingItemController extends Controller
{
    protected SettingItemService $settingItemService;
    protected ZoneService $zoneService;

    public function __construct(
        SettingItemService $settingItemService,
        ZoneService $zoneService
    ) {
        $this->settingItemService = $settingItemService;
        $this->zoneService = $zoneService;
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
            'type',
            'zone_id'
        ]);
        $reponseMode = $request->reponseMode;

        $settingItems = $this->settingItemService->getSettingItems($filters, $reponseMode);

        // Get zones user can manage
        $zones = $this->getZonesUserCanManage();

        if ($request->expectsJson()) {
            $formattedSettingItems = SettingItemModelResponse::formatSettingItems($settingItems, $reponseMode);
            
            return $this->apiResponseWithContext([
                'setting_items' => $formattedSettingItems,
                'zones' => $zones,
            ]);
        }

        return $this->apiErrorResponse();
    }

    /**
     * Get a single setting item
     * 
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $settingItem = $this->settingItemService->getSettingItem($id);

        if (!$settingItem) {
            return $this->apiErrorResponse('Setting item not found', 404);
        }

        if ($request->expectsJson()) {
            $reponseMode = $request->reponseMode;
            $formattedSettingItem = SettingItemModelResponse::formatSettingItem($settingItem, $reponseMode);
            
            return $this->apiResponseWithContext([
                'setting_item' => $formattedSettingItem,
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
            $reponseMode = $request->reponseMode;
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

            $reponseMode = $request->reponseMode;
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
     * Get item types list
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function getItemTypes(Request $request): JsonResponse
    {
        if ($request->expectsJson()) {
            return $this->apiResponseWithContext([
                'item_types' => SettingItem::getItemTypes(),
            ]);
        }

        return $this->apiErrorResponse();
    }

    /**
     * Get items for a zone (for selecting items in set)
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function getItemsForZone(Request $request): JsonResponse
    {
        $zoneId = $request->input('zone_id');
        
        if (!$zoneId) {
            return $this->apiErrorResponse('Zone ID is required', 400);
        }

        try {
            $items = $this->settingItemService->getItemsForZone($zoneId);

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

    /**
     * Get custom images list for loading
     * Returns images from setting items that have images from all zones user is in or manages
     * Used for caching images on frontend - no zone_id parameter needed
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function getCustomImages(Request $request): JsonResponse
    {
        // Get all zone IDs user is in OR manages
        // currentUserZoneIds also includes managed zones
        $userZoneIds = BaseModelActions::currentUserZoneIds();
        
        // Merge and get unique zone IDs
        $allZoneIds = array_unique($userZoneIds);
        
        if (empty($allZoneIds)) {
            return $this->apiResponseWithContext([
                'images' => [],
                'total' => 0,
            ]);
        }
        
        // Get setting items with images from all accessible zones
        $settingItems = SettingItem::whereIn('zone_id', $allZoneIds)
            ->whereNotNull('image')
            ->where('image', '!=', '')
            ->get();
        
        $images = [];
        
        foreach ($settingItems as $item) {
            if (!empty($item->image)) {
                // Get full URL using GlobalDataTrait method
                $fullUrl = $this->getImageFullUrl($item->image);
                
                $images[] = [
                    'url' => $fullUrl,
                    'type' => $item->type,
                ];
            }
        }
        
        if ($request->expectsJson()) {
            return $this->apiResponseWithContext([
                'images' => $images,
                'total' => count($images),
            ]);
        }

        return $this->apiErrorResponse();
    }
}

