<?php

namespace Kennofizet\RewardPlay\Traits;

trait GlobalDataTrait
{
    /**
     * Get API response with user context
     */
    protected function apiResponseWithContext($data, $message = 'Success', $status = 200)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'datas' => $data,
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
