<?php

namespace Kennofizet\RewardPlay\Controllers\Player;

use Kennofizet\RewardPlay\Controllers\Controller;
use Kennofizet\RewardPlay\Services\Player\EventService;
use Illuminate\Http\JsonResponse;

class EventController extends Controller
{
    public function __construct(
        protected EventService $service
    ) {
    }

    /**
     * Get active events for the current zone (for events popup).
     * Returns only events that are active now (is_active + time_start/time_end).
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $result = $this->service->getActiveEvents();
        return $this->apiResponseWithContext($result);
    }
}
