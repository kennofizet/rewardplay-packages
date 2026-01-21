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

    /**
     * Safe way to get zones the current user can manage.
     * Many controllers used ZoneService directly; this helper allows controllers
     * that have a $zoneService property to reuse it without duplicating checks.
     *
     * @return array
     */
    protected function getZonesUserCanManage(): array
    {
        if (property_exists($this, 'zoneService') && $this->zoneService) {
            return $this->zoneService->getZonesUserCanManage();
        }

        return [];
    }
}
