<?php

namespace Kennofizet\RewardPlay\Traits;

use Kennofizet\RewardPlay\Core\Model\BaseModelActions;

trait GlobalDataTrait
{
    /**
     * Get current zone id
     */
    protected function getCurrentZoneId()
    {
        return BaseModelActions::currentZoneId();
    }

    /**
     * Get current user id
     */
    protected function getCurrentUserId()
    {
        return BaseModelActions::currentUserId();
    }
    /**
     * Get API response with user context
     */
    protected function apiResponseWithContext($data, $message = 'Success', $status = 200)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
            'timestamp' => now()->toISOString()
        ], $status);
    }

    /**
     * Get error response with user context
     */
    protected function apiErrorResponse($message = 'Error', $status = 400, $errors = [])
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
            'timestamp' => now()->toISOString()
        ], $status);
    }
}
