<?php

namespace Kennofizet\RewardPlay\Controllers;

use Kennofizet\RewardPlay\Traits\GlobalDataTrait;
use Kennofizet\RewardPlay\Core\Model\BaseModelActions;

abstract class Controller
{
    use GlobalDataTrait, BaseModelActions;

    /**
     * Centralized exception handler for controller actions.
     * Returns a standardized API error response and can be extended later
     * to add logging or error normalization.
     *
     * @param \Exception $e
     * @param int $status
     * @return \Illuminate\Http\JsonResponse
     */
    protected function handleException(\Exception $e, int $status = 500)
    {
        // TODO: Add logging here if needed: \Log::error($e->getMessage(), ['exception' => $e]);
        return $this->apiErrorResponse($e->getMessage(), $status);
    }
}
