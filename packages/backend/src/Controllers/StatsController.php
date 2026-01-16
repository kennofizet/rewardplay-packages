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
}
