<?php

namespace Kennofizet\RewardPlay\Controllers\Settings;

use Kennofizet\RewardPlay\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Kennofizet\RewardPlay\Services\Model\SettingItemSetService;
use Kennofizet\RewardPlay\Models\SettingItemSet\SettingItemSetModelResponse;
use Kennofizet\RewardPlay\Requests\StoreSettingItemSetRequest;
use Kennofizet\RewardPlay\Requests\UpdateSettingItemSetRequest;
use Kennofizet\RewardPlay\Models\SettingItemSet\SettingItemSetConstant;

class SettingItemSetController extends Controller
{
    protected SettingItemSetService $settingItemSetService;

    public function __construct(
        SettingItemSetService $settingItemSetService,
    ) {
        $this->settingItemSetService = $settingItemSetService;
    }

    /**
     * Get all setting item sets
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
            'q'
        ]);
        
        $reponseMode = SettingItemSetConstant::API_SETTING_ITEM_SET_LIST_PAGE;

        $settingItemSets = $this->settingItemSetService->getSettingItemSets($filters, $reponseMode);

        if ($request->expectsJson()) {
            $formattedSettingItemSets = SettingItemSetModelResponse::formatSettingItemSets($settingItemSets, $reponseMode);
            
            // Also include stats mapping for frontend translations (stat_key => display_name)
            $statsMap = $this->settingItemSetService->buildStatsMapping($settingItemSets);

            return $this->apiResponseWithContext([
                'setting_item_sets' => $formattedSettingItemSets,
                'stats' => $statsMap,
            ]);
        }

        return $this->apiErrorResponse();
    }

    /**
     * Create a new setting item set
     * 
     * @param StoreSettingItemSetRequest $request
     * @return JsonResponse
     */
    public function store(StoreSettingItemSetRequest $request): JsonResponse
    {
        $data = $request->validated();
        $itemIds = $request->input('item_ids', []);

        try {
            $settingItemSet = $this->settingItemSetService->createSettingItemSet($data, $itemIds);
            $reponseMode = "";
            $formattedSettingItemSet = SettingItemSetModelResponse::formatSettingItemSet($settingItemSet, $reponseMode);

            return $this->apiResponseWithContext([
                'setting_item_set' => $formattedSettingItemSet,
            ], 201);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Update a setting item set
     * 
     * @param UpdateSettingItemSetRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(UpdateSettingItemSetRequest $request, int $id): JsonResponse
    {
        $data = $request->validated();
        $itemIds = $request->input('item_ids', null); // null means don't update, [] means remove all

        try {
            $settingItemSet = $this->settingItemSetService->updateSettingItemSet($id, $data, $itemIds);

            if (!$settingItemSet) {
                return $this->apiErrorResponse('Setting item set not found', 404);
            }

            $reponseMode = "";
            $formattedSettingItemSet = SettingItemSetModelResponse::formatSettingItemSet($settingItemSet, $reponseMode);

            return $this->apiResponseWithContext([
                'setting_item_set' => $formattedSettingItemSet,
            ]);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Delete a setting item set
     * 
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $deleted = $this->settingItemSetService->deleteSettingItemSet($id);

        if (!$deleted) {
            return $this->apiErrorResponse('Setting item set not found', 404);
        }

        return $this->apiResponseWithContext([
            'message' => 'Setting item set deleted successfully',
        ]);
    }

}
