<?php

namespace Kennofizet\RewardPlay\Controllers\Settings;

use Kennofizet\RewardPlay\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Kennofizet\RewardPlay\Services\Model\SettingOptionService;
use Kennofizet\RewardPlay\Services\SettingRewardPlay\ZoneService;
use Kennofizet\RewardPlay\Models\SettingOption\SettingOptionModelResponse;
use Kennofizet\RewardPlay\Models\SettingOption;
use Kennofizet\RewardPlay\Requests\StoreSettingOptionRequest;
use Kennofizet\RewardPlay\Requests\UpdateSettingOptionRequest;

class SettingOptionController extends Controller
{
    protected SettingOptionService $settingOptionService;
    protected ZoneService $zoneService;

    public function __construct(
        SettingOptionService $settingOptionService,
        ZoneService $zoneService
    ) {
        $this->settingOptionService = $settingOptionService;
        $this->zoneService = $zoneService;
    }

    /**
     * Get all setting options
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
            'zone_id',
        ]);
        $reponseMode = "";

        $settingOptions = $this->settingOptionService->getSettingOptions($filters, $reponseMode);

        // Get zones user can manage
        $zones = $this->getZonesUserCanManage();

        if ($request->expectsJson()) {
            $formattedSettingOptions = SettingOptionModelResponse::formatSettingOptions($settingOptions, $reponseMode);
            
            return $this->apiResponseWithContext([
                'setting_options' => $formattedSettingOptions,
                'zones' => $zones,
            ]);
        }

        return $this->apiErrorResponse();
    }

    /**
     * Get a single setting option
     * 
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $settingOption = $this->settingOptionService->getSettingOption($id);

        if (!$settingOption) {
            return $this->apiErrorResponse('Setting option not found', 404);
        }

        if ($request->expectsJson()) {
            $reponseMode = "";
            $formattedSettingOption = SettingOptionModelResponse::formatSettingOption($settingOption, $reponseMode);
            
            return $this->apiResponseWithContext([
                'setting_option' => $formattedSettingOption,
            ]);
        }

        return $this->apiErrorResponse();
    }

    /**
     * Create a new setting option
     * 
     * @param StoreSettingOptionRequest $request
     * @return JsonResponse
     */
    public function store(StoreSettingOptionRequest $request): JsonResponse
    {
        $data = $request->validated();

        try {
            $settingOption = $this->settingOptionService->createSettingOption($data);
            $reponseMode = "";
            $formattedSettingOption = SettingOptionModelResponse::formatSettingOption($settingOption, $reponseMode);

            return $this->apiResponseWithContext([
                'setting_option' => $formattedSettingOption,
            ], 201);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Update a setting option
     * 
     * @param UpdateSettingOptionRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(UpdateSettingOptionRequest $request, int $id): JsonResponse
    {
        $data = $request->validated();

        try {
            $settingOption = $this->settingOptionService->updateSettingOption($id, $data);

            if (!$settingOption) {
                return $this->apiErrorResponse('Setting option not found', 404);
            }

            $reponseMode = "";
            $formattedSettingOption = SettingOptionModelResponse::formatSettingOption($settingOption, $reponseMode);

            return $this->apiResponseWithContext([
                'setting_option' => $formattedSettingOption,
            ]);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Delete a setting option
     * 
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $deleted = $this->settingOptionService->deleteSettingOption($id);

        if (!$deleted) {
            return $this->apiErrorResponse('Setting option not found', 404);
        }

        return $this->apiResponseWithContext([
            'message' => 'Setting option deleted successfully',
        ]);
    }

}
