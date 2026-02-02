<?php

namespace Kennofizet\RewardPlay\Controllers;

use Kennofizet\RewardPlay\Controllers\Controller;
use Kennofizet\RewardPlay\Services\Player\RankingService;
use Kennofizet\RewardPlay\Core\Model\BaseModelActions;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RankingController extends Controller
{
    public function __construct(
        protected RankingService $rankingService
    ) {
    }

    /**
     * Get ranking data for a period (day, week, month, year).
     * Returns top coin, top level, top power and current user's ranks/values.
     */
    public function getRanking(Request $request): JsonResponse
    {
        $userId = $request->attributes->get('rewardplay_user_id');
        if (empty($userId)) {
            return $this->apiErrorResponse('User not authenticated', 401);
        }

        $period = $request->query('period', 'day');
        $zoneId = BaseModelActions::currentUserZoneId();

        $data = $this->rankingService->getRankingData((int) $userId, $zoneId, $period);

        return $this->apiResponseWithContext($data);
    }
}
