<?php

namespace Kennofizet\RewardPlay\Controllers\Settings;

use Kennofizet\RewardPlay\Controllers\Controller;
use Kennofizet\RewardPlay\Services\Model\SettingLevelExpService;
use Kennofizet\RewardPlay\Models\SettingLevelExp\SettingLevelExpModelResponse;
use Kennofizet\RewardPlay\Models\SettingLevelExp\SettingLevelExpConstant;
use Kennofizet\RewardPlay\Requests\StoreSettingLevelExpRequest;
use Kennofizet\RewardPlay\Requests\UpdateSettingLevelExpRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SettingLevelExpController extends Controller
{
    protected SettingLevelExpService $settingLevelExpService;

    public function __construct(SettingLevelExpService $settingLevelExpService)
    {
        $this->settingLevelExpService = $settingLevelExpService;
    }

    /**
     * Get all setting level exps
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
        ]);

        $responseMode = SettingLevelExpConstant::API_SETTING_LEVEL_EXP_LIST_PAGE;
        $settingLevelExps = $this->settingLevelExpService->getSettingLevelExps($filters, $responseMode);

        if ($request->expectsJson()) {
            $formattedLevelExps = SettingLevelExpModelResponse::formatSettingLevelExps($settingLevelExps, $responseMode);
            return $this->apiResponseWithContext([
                'level_exps' => $formattedLevelExps,
            ]);
        }

        return $this->apiErrorResponse();
    }

    /**
     * Get a single setting level exp
     * 
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $levelExp = $this->settingLevelExpService->getSettingLevelExp($id);

        if (!$levelExp) {
            return $this->apiErrorResponse('Setting level exp not found', 404);
        }

        if ($request->expectsJson()) {
            $responseMode = SettingLevelExpConstant::API_SETTING_LEVEL_EXP_LIST_PAGE;
            $formattedLevelExp = SettingLevelExpModelResponse::formatSettingLevelExp($levelExp, $responseMode);
            return $this->apiResponseWithContext([
                'level_exp' => $formattedLevelExp,
            ]);
        }

        return $this->apiErrorResponse();
    }

    /**
     * Create a new setting level exp
     * 
     * @param StoreSettingLevelExpRequest $request
     * @return JsonResponse
     */
    public function store(StoreSettingLevelExpRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();

            $levelExp = $this->settingLevelExpService->createSettingLevelExp($data);

            if ($request->expectsJson()) {
                $responseMode = SettingLevelExpConstant::API_SETTING_LEVEL_EXP_LIST_PAGE;
                $formattedLevelExp = SettingLevelExpModelResponse::formatSettingLevelExp($levelExp, $responseMode);
                return $this->apiResponseWithContext([
                    'level_exp' => $formattedLevelExp,
                ], 201);
            }

            return $this->apiErrorResponse();
        } catch (\Exception $e) {
            return $this->handleException($e, 400);
        }
    }

    /**
     * Update a setting level exp
     * 
     * @param UpdateSettingLevelExpRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(UpdateSettingLevelExpRequest $request, int $id): JsonResponse
    {
        try {
            $data = $request->validated();

            $levelExp = $this->settingLevelExpService->updateSettingLevelExp($id, $data);

            if ($request->expectsJson()) {
                $responseMode = SettingLevelExpConstant::API_SETTING_LEVEL_EXP_LIST_PAGE;
                $formattedLevelExp = SettingLevelExpModelResponse::formatSettingLevelExp($levelExp, $responseMode);
                return $this->apiResponseWithContext([
                    'level_exp' => $formattedLevelExp,
                ]);
            }

            return $this->apiErrorResponse();
        } catch (\Exception $e) {
            return $this->handleException($e, 400);
        }
    }

    /**
     * Delete a setting level exp
     * 
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $deleted = $this->settingLevelExpService->deleteSettingLevelExp($id);
            
            if (!$deleted) {
                return $this->apiErrorResponse('Setting level exp not found', 404);
            }

            return $this->apiResponseWithContext(['message' => 'Deleted']);
        } catch (\Exception $e) {
            return $this->handleException($e, 400);
        }
    }

    /**
     * Generate suggested level exp data
     * 
     * @return JsonResponse
     */
    public function suggest(): JsonResponse
    {
        try {
            $created = $this->settingLevelExpService->generateSuggestedData();

            return $this->apiResponseWithContext([
                'message' => 'Level exp data suggested and created',
                'count' => count($created)
            ]);
        } catch (\Exception $e) {
            return $this->handleException($e, 400);
        }
    }
}
