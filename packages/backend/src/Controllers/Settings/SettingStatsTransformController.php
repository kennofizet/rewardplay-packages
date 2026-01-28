<?php

namespace Kennofizet\RewardPlay\Controllers\Settings;

use Kennofizet\RewardPlay\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Kennofizet\RewardPlay\Services\Model\SettingStatsTransformService;
use Kennofizet\RewardPlay\Models\SettingStatsTransform\SettingStatsTransformModelResponse;
use Kennofizet\RewardPlay\Requests\StoreSettingStatsTransformRequest;
use Kennofizet\RewardPlay\Requests\UpdateSettingStatsTransformRequest;

class SettingStatsTransformController extends Controller
{
    protected SettingStatsTransformService $settingStatsTransformService;

    public function __construct(
        SettingStatsTransformService $settingStatsTransformService
    ) {
        $this->settingStatsTransformService = $settingStatsTransformService;
    }

    /**
     * Get all setting stats transforms
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only([
            'perPage', 
            'currentPage', 
            'target_key'
            // zone_id is automatically filtered by BaseModel global scope
        ]);
        
        $reponseMode = "";

        $settingStatsTransforms = $this->settingStatsTransformService->getSettingStatsTransforms($filters, $reponseMode);

        if ($request->expectsJson()) {
            $formattedSettingStatsTransforms = SettingStatsTransformModelResponse::formatSettingStatsTransforms($settingStatsTransforms, $reponseMode);
            
            return $this->apiResponseWithContext([
                'setting_stats_transforms' => $formattedSettingStatsTransforms
            ]);
        }

        return $this->apiErrorResponse();
    }

    /**
     * Create a new setting stats transform
     * 
     * @param StoreSettingStatsTransformRequest $request
     * @return JsonResponse
     */
    public function store(StoreSettingStatsTransformRequest $request): JsonResponse
    {
        $data = $request->validated();

        try {
            $settingStatsTransform = $this->settingStatsTransformService->createSettingStatsTransform($data);
            $reponseMode = "";
            $formattedSettingStatsTransform = SettingStatsTransformModelResponse::formatSettingStatsTransform($settingStatsTransform, $reponseMode);

            return $this->apiResponseWithContext([
                'setting_stats_transform' => $formattedSettingStatsTransform,
            ], 201);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Update a setting stats transform
     * 
     * @param UpdateSettingStatsTransformRequest $request
     * @param int|string $id
     * @return JsonResponse
     */
    public function update(UpdateSettingStatsTransformRequest $request, int|string $id): JsonResponse
    {
        $id = (int) $id;
        $data = $request->validated();

        try {
            $settingStatsTransform = $this->settingStatsTransformService->updateSettingStatsTransform($id, $data);

            if (!$settingStatsTransform) {
                return $this->apiErrorResponse('Setting stats transform not found', 404);
            }

            $reponseMode = "";
            $formattedSettingStatsTransform = SettingStatsTransformModelResponse::formatSettingStatsTransform($settingStatsTransform, $reponseMode);

            return $this->apiResponseWithContext([
                'setting_stats_transform' => $formattedSettingStatsTransform,
            ]);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Delete a setting stats transform
     * 
     * @param Request $request
     * @param int|string $id
     * @return JsonResponse
     */
    public function destroy(Request $request, int|string $id): JsonResponse
    {
        $id = (int) $id;
        $deleted = $this->settingStatsTransformService->deleteSettingStatsTransform($id);

        if (!$deleted) {
            return $this->apiErrorResponse('Setting stats transform not found', 404);
        }

        return $this->apiResponseWithContext([
            'message' => 'Setting stats transform deleted successfully',
        ]);
    }

    /**
     * Generate suggested stats transform data
     * 
     * @return JsonResponse
     */
    public function suggest(): JsonResponse
    {
        try {
            $created = $this->settingStatsTransformService->generateSuggestedData();

            return $this->apiResponseWithContext([
                'message' => 'Stats transform data suggested and created',
                'count' => count($created)
            ]);
        } catch (\Exception $e) {
            return $this->handleException($e, 400);
        }
    }

    /**
     * Get allowed source keys and target keys for stats transforms
     * 
     * @return JsonResponse
     */
    public function getAllowedKeys(): JsonResponse
    {
        $allowedTargetKeys = array_keys(\Kennofizet\RewardPlay\Helpers\Constant::CONVERSION_KEYS_ACCEPT_CONVERT);
        $allConversionKeys = array_keys(\Kennofizet\RewardPlay\Helpers\Constant::CONVERSION_KEYS);
        
        // Source keys are all conversion keys except target keys
        $allowedSourceKeys = array_diff($allConversionKeys, $allowedTargetKeys);
        
        // Format as array of {key, name} objects
        $targetKeys = [];
        foreach (\Kennofizet\RewardPlay\Helpers\Constant::CONVERSION_KEYS_ACCEPT_CONVERT as $key => $name) {
            $targetKeys[] = ['key' => $key, 'name' => $name];
        }
        
        $sourceKeys = [];
        foreach (\Kennofizet\RewardPlay\Helpers\Constant::CONVERSION_KEYS as $key => $name) {
            if (in_array($key, $allowedSourceKeys)) {
                $sourceKeys[] = ['key' => $key, 'name' => $name];
            }
        }

        return $this->apiResponseWithContext([
            'allowed_target_keys' => $targetKeys,
            'allowed_source_keys' => $sourceKeys,
        ]);
    }
}
