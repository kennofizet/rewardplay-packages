<?php

namespace Kennofizet\RewardPlay\Controllers;

use Kennofizet\PackagesCore\Traits\GlobalDataTrait;
use Kennofizet\PackagesCore\Core\Model\BaseModelActions;
use Kennofizet\PackagesCore\Core\Model\BaseModelResponse;
use Illuminate\Http\JsonResponse;

abstract class Controller
{
    use GlobalDataTrait, BaseModelActions;

    /**
     * Override GlobalDataTrait::apiResponseWithContext with data-first signature.
     *
     * All rewardplay controllers call: $this->apiResponseWithContext(['key' => $value], $status)
     * instead of the trait's message-first signature.
     *
     * @param array $data
     * @param int   $status
     */
    public function apiResponseWithContext($data = [], int $status = 200): JsonResponse
    {
        return response()->json(BaseModelResponse::success('Success', $data), $status);
    }

    /**
     * Centralized exception handler for controller actions.
     */
    protected function handleException(\Exception $e, int $status = 500): JsonResponse
    {
        return $this->apiErrorResponse($e->getMessage(), $status);
    }
}
