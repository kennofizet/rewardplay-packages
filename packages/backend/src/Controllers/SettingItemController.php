<?php

namespace Kennofizet\RewardPlay\Controllers;

use Kennofizet\RewardPlay\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Kennofizet\RewardPlay\Services\Model\SettingItemService;
use Kennofizet\RewardPlay\Models\SettingItem\SettingItemModelResponse;
use Kennofizet\RewardPlay\Models\SettingItem;

class SettingItemController extends Controller
{
    protected SettingItemService $settingItemService;

    public function __construct(SettingItemService $settingItemService)
    {
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
            'type',
            'zone_id'
        ]);
        $reponseMode = $request->reponseMode;

        $settingItems = $this->settingItemService->getSettingItems($filters, $reponseMode);

        // Get zones user can manage
        $zones = SettingItem::getZonesUserCanManage();

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
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->only([
            'name',
            'description',
            'type',
            'default_property',
            'zone_id'
        ]);

        // Get image file if uploaded
        $imageFile = $request->hasFile('image') ? $request->file('image') : null;

        try {
            $settingItem = $this->settingItemService->createSettingItem($data, $imageFile);
            $reponseMode = $request->reponseMode;
            $formattedSettingItem = SettingItemModelResponse::formatSettingItem($settingItem, $reponseMode);

            return $this->apiResponseWithContext([
                'setting_item' => $formattedSettingItem,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->apiErrorResponse($e->getMessage(), 422);
        } catch (\Exception $e) {
            return $this->apiErrorResponse($e->getMessage(), 500);
        }
    }

    /**
     * Update a setting item
     * 
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $data = $request->only([
            'name',
            'description',
            'type',
            'default_property',
            'zone_id'
        ]);

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
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->apiErrorResponse($e->getMessage(), 422);
        } catch (\Exception $e) {
            return $this->apiErrorResponse($e->getMessage(), 500);
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
}

