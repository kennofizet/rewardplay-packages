<?php

namespace Kennofizet\RewardPlay\Controllers;

use Kennofizet\RewardPlay\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Kennofizet\RewardPlay\ModelSubs\Emulator\Stats;

class StatsController extends Controller
{
    /**
     * Get conversion keys list
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function getConversionKeys(Request $request): JsonResponse
    {
        if ($request->expectsJson()) {
            return $this->apiResponseWithContext([
                'conversion_keys' => Stats::getConversionKeys(),
            ]);
        }

        return $this->apiErrorResponse();
    }

    /**
     * Get all stats (merged conversion keys + custom group stats from setting_options)
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function getAllStats(Request $request): JsonResponse
    {
        if ($request->expectsJson()) {
            return $this->apiResponseWithContext([
                'stats' => Stats::getAllStats(),
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
