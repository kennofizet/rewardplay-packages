<?php

namespace Kennofizet\RewardPlay\Controllers;

use Kennofizet\RewardPlay\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Kennofizet\RewardPlay\ModelSubs\Emulator\Stats;

class StatsController extends Controller
{
    /**
     * Get all stats separated into stats and custom_options
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function getAllStats(Request $request): JsonResponse
    {
        if ($request->expectsJson()) {
            $allStats = Stats::getAllStats();
            return $this->apiResponseWithContext([
                'stats' => $allStats['stats'] ?? [],
                'custom_options' => $allStats['custom_options'] ?? [],
            ]);
        }

        return $this->apiErrorResponse();
    }

    /**
     * Get reward types based on mode
     * Mode: 'daily_reward' (all types) or 'stack_bonus' (coin and exp only)
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function getRewardTypes(Request $request): JsonResponse
    {
        if ($request->expectsJson()) {
            $mode = $request->query('mode', 'daily_reward');
            $rewardTypes = \Kennofizet\RewardPlay\Helpers\Constant::REWARD_TYPES;
            
            // Filter based on mode
            if ($mode === 'stack_bonus') {
                // Only coin and exp for stack bonus
                $allowedTypes = [
                    \Kennofizet\RewardPlay\Helpers\Constant::TYPE_COIN,
                    \Kennofizet\RewardPlay\Helpers\Constant::TYPE_EXP,
                ];
                $filteredTypes = [];
                foreach ($allowedTypes as $type) {
                    if (isset($rewardTypes[$type])) {
                        $filteredTypes[$type] = $rewardTypes[$type];
                    }
                }
                $rewardTypes = $filteredTypes;
            }
            // For 'daily_reward' mode, return all types (no filtering needed)
            
            return $this->apiResponseWithContext([
                'reward_types' => $rewardTypes,
                'mode' => $mode,
            ]);
        }

        return $this->apiErrorResponse();
    }
}
