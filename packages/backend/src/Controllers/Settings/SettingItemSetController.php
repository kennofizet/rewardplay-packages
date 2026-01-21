<?php

namespace Kennofizet\RewardPlay\Controllers\Settings;

use Kennofizet\RewardPlay\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Kennofizet\RewardPlay\Services\Model\SettingItemSetService;
use Kennofizet\RewardPlay\Services\SettingRewardPlay\ZoneService;
use Kennofizet\RewardPlay\Models\SettingItemSet\SettingItemSetModelResponse;
use Kennofizet\RewardPlay\Models\SettingItemSet;
use Kennofizet\RewardPlay\Requests\StoreSettingItemSetRequest;
use Kennofizet\RewardPlay\Requests\UpdateSettingItemSetRequest;

class SettingItemSetController extends Controller
{
    protected SettingItemSetService $settingItemSetService;
    protected ZoneService $zoneService;

    public function __construct(
        SettingItemSetService $settingItemSetService,
        ZoneService $zoneService
    ) {
        $this->settingItemSetService = $settingItemSetService;
        $this->zoneService = $zoneService;
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
            'q',
            'zone_id'
        ]);
        $reponseMode = $request->reponseMode;

        $settingItemSets = $this->settingItemSetService->getSettingItemSets($filters, $reponseMode);

        // Get zones user can manage
        $zones = $this->getZonesUserCanManage();

        if ($request->expectsJson()) {
            $formattedSettingItemSets = SettingItemSetModelResponse::formatSettingItemSets($settingItemSets, $reponseMode);
            
            // Also include stats mapping for frontend translations (stat_key => display_name)
            $statsMap = $this->settingItemSetService->buildStatsMapping($settingItemSets);

            return $this->apiResponseWithContext([
                'setting_item_sets' => $formattedSettingItemSets,
                'zones' => $zones,
                'stats' => $statsMap,
            ]);
        }

        return $this->apiErrorResponse();
    }

    /**
     * Get a single setting item set
     * 
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $settingItemSet = $this->settingItemSetService->getSettingItemSet($id);

        if (!$settingItemSet) {
            return $this->apiErrorResponse('Setting item set not found', 404);
        }

        if ($request->expectsJson()) {
            $reponseMode = $request->reponseMode;
            $formattedSettingItemSet = SettingItemSetModelResponse::formatSettingItemSet($settingItemSet, $reponseMode);
            
            return $this->apiResponseWithContext([
                'setting_item_set' => $formattedSettingItemSet,
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
            $reponseMode = $request->reponseMode;
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

            $reponseMode = $request->reponseMode;
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
