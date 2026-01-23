<?php

namespace Kennofizet\RewardPlay\Controllers\Settings;

use Kennofizet\RewardPlay\Controllers\Controller;
use Kennofizet\RewardPlay\Services\Model\SettingStackBonusService;
use Kennofizet\RewardPlay\Models\SettingStackBonus\SettingStackBonusModelResponse;
use Kennofizet\RewardPlay\Requests\StoreSettingStackBonusRequest;
use Kennofizet\RewardPlay\Requests\UpdateSettingStackBonusRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SettingStackBonusController extends Controller
{
    protected SettingStackBonusService $settingStackBonusService;

    public function __construct(SettingStackBonusService $settingStackBonusService)
    {
        $this->settingStackBonusService = $settingStackBonusService;
    }

    /**
     * Get all setting stack bonuses
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
            'day',
            'day_from',
            'day_to',
            'is_active',
        ]);
        $reponseMode = "";

        $settingStackBonuses = $this->settingStackBonusService->getSettingStackBonuses($filters, $reponseMode);

        if ($request->expectsJson()) {
            $formattedSettingStackBonuses = SettingStackBonusModelResponse::formatSettingStackBonuses($settingStackBonuses, $reponseMode);
            
            return $this->apiResponseWithContext([
                'bonuses' => $formattedSettingStackBonuses,
            ]);
        }

        return $this->apiErrorResponse();
    }

    /**
     * Get a single setting stack bonus
     * 
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $reponseMode = "";
        $bonus = $this->settingStackBonusService->getSettingStackBonus($id, $reponseMode);

        if (!$bonus) {
            return $this->apiErrorResponse('Setting stack bonus not found', 404);
        }

        if ($request->expectsJson()) {
            $formattedBonus = SettingStackBonusModelResponse::formatSettingStackBonus($bonus, $reponseMode);
            
            return $this->apiResponseWithContext([
                'bonus' => $formattedBonus,
            ]);
        }

        return $this->apiErrorResponse();
    }

    /**
     * Create a new setting stack bonus
     * 
     * @param StoreSettingStackBonusRequest $request
     * @return JsonResponse
     */
    public function store(StoreSettingStackBonusRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();

            $bonus = $this->settingStackBonusService->createSettingStackBonus($data);
            $reponseMode = "";

            if ($request->expectsJson()) {
                $formattedBonus = SettingStackBonusModelResponse::formatSettingStackBonus($bonus, $reponseMode);
                
                return $this->apiResponseWithContext([
                    'bonus' => $formattedBonus,
                ], 201);
            }

            return $this->apiErrorResponse();
        } catch (\Exception $e) {
            return $this->handleException($e, 400);
        }
    }

    /**
     * Update a setting stack bonus
     * 
     * @param UpdateSettingStackBonusRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(UpdateSettingStackBonusRequest $request, int $id): JsonResponse
    {
        try {
            $data = $request->validated();

            $bonus = $this->settingStackBonusService->updateSettingStackBonus($id, $data);
            $reponseMode = "";

            if ($request->expectsJson()) {
                $formattedBonus = SettingStackBonusModelResponse::formatSettingStackBonus($bonus, $reponseMode);
                
                return $this->apiResponseWithContext([
                    'bonus' => $formattedBonus,
                ]);
            }

            return $this->apiErrorResponse();
        } catch (\Exception $e) {
            return $this->handleException($e, 400);
        }
    }

    /**
     * Delete a setting stack bonus
     * 
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $deleted = $this->settingStackBonusService->deleteSettingStackBonus($id);
            
            if (!$deleted) {
                return $this->apiErrorResponse('Setting stack bonus not found', 404);
            }

            return $this->apiResponseWithContext(['message' => 'Deleted']);
        } catch (\Exception $e) {
            return $this->handleException($e, 400);
        }
    }

    /**
     * Generate suggested weekly stack bonuses
     * 
     * @return JsonResponse
     */
    public function suggest(): JsonResponse
    {
        try {
            $created = $this->settingStackBonusService->generateSuggestedBonuses();

            return $this->apiResponseWithContext([
                'message' => 'Weekly stack bonuses suggested and created',
                'count' => count($created)
            ]);
        } catch (\Exception $e) {
            return $this->handleException($e, 400);
        }
    }
}
