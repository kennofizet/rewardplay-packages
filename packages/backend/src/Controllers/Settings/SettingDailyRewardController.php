<?php

namespace Kennofizet\RewardPlay\Controllers\Settings;

use Kennofizet\RewardPlay\Controllers\Controller;
use Kennofizet\RewardPlay\Services\Model\SettingDailyRewardService;
use Kennofizet\RewardPlay\Models\SettingDailyReward\SettingDailyRewardModelResponse;
use Kennofizet\RewardPlay\Requests\StoreSettingDailyRewardRequest;
use Kennofizet\RewardPlay\Requests\UpdateSettingDailyRewardRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class SettingDailyRewardController extends Controller
{
    protected SettingDailyRewardService $settingDailyRewardService;

    public function __construct(SettingDailyRewardService $settingDailyRewardService)
    {
        $this->settingDailyRewardService = $settingDailyRewardService;
    }

    /**
     * Get all setting daily rewards
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only([
            'perPage', 
            'currentPage', 
            'year',
            'month',
            'start_date',
            'end_date',
            'is_active',
            'is_epic',
        ]);
        $reponseMode = $request->reponseMode;

        $settingDailyRewards = $this->settingDailyRewardService->getSettingDailyRewards($filters, $reponseMode);

        if ($request->expectsJson()) {
            $formattedSettingDailyRewards = SettingDailyRewardModelResponse::formatSettingDailyRewards($settingDailyRewards, $reponseMode);
            
            return $this->apiResponseWithContext([
                'rewards' => $formattedSettingDailyRewards,
            ]);
        }

        return $this->apiErrorResponse();
    }

    /**
     * Get setting daily rewards by month
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function getByMonth(Request $request): JsonResponse
    {
        $filters = $request->only(['year', 'month']);
        $year = $filters['year'] ?? Carbon::now()->year;
        $month = $filters['month'] ?? Carbon::now()->month;

        $rewards = $this->settingDailyRewardService->getSettingDailyRewardsByMonth($year, $month);
        $reponseMode = $request->reponseMode;

        if ($request->expectsJson()) {
            $formattedRewards = SettingDailyRewardModelResponse::formatSettingDailyRewards($rewards, $reponseMode);
            
            return $this->apiResponseWithContext([
                'rewards' => $formattedRewards,
            ]);
        }

        return $this->apiErrorResponse();
    }

    /**
     * Get a single setting daily reward
     * 
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $reponseMode = $request->reponseMode;
        $reward = $this->settingDailyRewardService->getSettingDailyReward($id, $reponseMode);

        if (!$reward) {
            return $this->apiErrorResponse('Setting daily reward not found', 404);
        }

        if ($request->expectsJson()) {
            $formattedReward = SettingDailyRewardModelResponse::formatSettingDailyReward($reward, $reponseMode);
            
            return $this->apiResponseWithContext([
                'reward' => $formattedReward,
            ]);
        }

        return $this->apiErrorResponse();
    }

    /**
     * Create or update a setting daily reward
     * 
     * @param StoreSettingDailyRewardRequest $request
     * @return JsonResponse
     */
    public function store(StoreSettingDailyRewardRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();

            $reward = $this->settingDailyRewardService->createOrUpdateSettingDailyReward($data);
            $reponseMode = $request->reponseMode;

            if ($request->expectsJson()) {
                $formattedReward = SettingDailyRewardModelResponse::formatSettingDailyReward($reward, $reponseMode);
                
                return $this->apiResponseWithContext([
                    'reward' => $formattedReward,
                ], 201);
            }

            return $this->apiErrorResponse();
        } catch (\Exception $e) {
            return $this->handleException($e, 400);
        }
    }

    /**
     * Update a setting daily reward
     * 
     * @param UpdateSettingDailyRewardRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(UpdateSettingDailyRewardRequest $request, int $id): JsonResponse
    {
        try {
            $data = $request->validated();

            $reward = $this->settingDailyRewardService->updateSettingDailyReward($id, $data);
            $reponseMode = $request->reponseMode;

            if ($request->expectsJson()) {
                $formattedReward = SettingDailyRewardModelResponse::formatSettingDailyReward($reward, $reponseMode);
                
                return $this->apiResponseWithContext([
                    'reward' => $formattedReward,
                ]);
            }

            return $this->apiErrorResponse();
        } catch (\Exception $e) {
            return $this->handleException($e, 400);
        }
    }

    /**
     * Delete a setting daily reward
     * 
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $deleted = $this->settingDailyRewardService->deleteSettingDailyReward($id);
            
            if (!$deleted) {
                return $this->apiErrorResponse('Setting daily reward not found', 404);
            }

            return $this->apiResponseWithContext(['message' => 'Deleted']);
        } catch (\Exception $e) {
            return $this->handleException($e, 400);
        }
    }

    /**
     * Generate suggested daily rewards for a month
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function suggest(Request $request): JsonResponse
    {
        try {
            $filters = $request->only(['year', 'month']);
            $year = $filters['year'] ?? Carbon::now()->year;
            $month = $filters['month'] ?? Carbon::now()->month;

            $created = $this->settingDailyRewardService->generateSuggestedRewards($year, $month);
            $startDate = Carbon::createFromDate($year, $month, 1);

            return $this->apiResponseWithContext([
                'message' => 'Suggested data generated for ' . $startDate->format('F Y'),
                'count' => count($created)
            ]);
        } catch (\Exception $e) {
            return $this->handleException($e, 400);
        }
    }
}
