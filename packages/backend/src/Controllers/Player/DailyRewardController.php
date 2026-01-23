<?php

namespace Kennofizet\RewardPlay\Controllers\Player;

use Kennofizet\RewardPlay\Controllers\Controller;
use Kennofizet\RewardPlay\Services\Player\DailyRewardService;
use Kennofizet\RewardPlay\Models\SettingDailyReward\SettingDailyRewardModelResponse;
use Kennofizet\RewardPlay\Models\SettingStackBonus\SettingStackBonusModelResponse;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DailyRewardController extends Controller
{
    protected DailyRewardService $service;

    public function __construct(DailyRewardService $service)
    {
        $this->service = $service;
    }

    /**
     * Get daily reward state
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $userId = $request->attributes->get('rewardplay_user_id');
        $reponseMode = $request->reponseMode;
        
        $state = $this->service->getDailyRewardState($userId);

        if ($request->expectsJson()) {
            // Format the rewards and bonuses using ModelResponse
            if (isset($state['seven_days_rewards'])) {
                $state['seven_days_rewards'] = SettingDailyRewardModelResponse::formatSettingDailyRewards(
                    $state['seven_days_rewards'],
                    $reponseMode
                );
            }

            if (isset($state['next_reward_epic']) && $state['next_reward_epic']) {
                $state['next_reward_epic'] = SettingDailyRewardModelResponse::formatSettingDailyReward(
                    $state['next_reward_epic'],
                    $reponseMode
                );
            }

            if (isset($state['stack_bonuses']) && $state['stack_bonuses']) {
                $formattedStackBonuses = [];
                foreach ($state['stack_bonuses'] as $day => $bonus) {
                    $formattedStackBonuses[$day] = SettingStackBonusModelResponse::formatSettingStackBonus(
                        $bonus,
                        $reponseMode
                    );
                }
                $state['stack_bonuses'] = $formattedStackBonuses;
            }

            return $this->apiResponseWithContext($state);
        }

        return $this->apiErrorResponse();
    }

    /**
     * Collect daily reward
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function collect(Request $request): JsonResponse
    {
        $userId = $request->attributes->get('rewardplay_user_id');

        try {
            $this->service->collectReward($userId);
            return $this->apiResponseWithContext(['success' => true]);
        } catch (\Exception $e) {
            return $this->handleException($e, 400);
        }
    }
}
