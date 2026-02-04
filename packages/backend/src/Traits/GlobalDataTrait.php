<?php

namespace Kennofizet\RewardPlay\Traits;

trait GlobalDataTrait
{
    /**
     * Get API response with user context
     */
    protected function apiResponseWithContext($data=[], $message = 'Success', $status = 200)
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

    /**
     * Get full URL for an image path
     * Converts relative path (e.g., rewardplay-images/items/1/filename.jpg) to full URL
     * If path is already a full URL (http, https, etc.), returns it as-is
     * 
     * @param string|null $imagePath - Relative image path from public folder or full URL
     * @return string - Full URL or empty string if path is empty
     */
    protected function getImageFullUrl(?string $imagePath): string
    {
        if (empty($imagePath)) {
            return '';
        }

        // If already a full URL (http, https, or other protocol), return as-is
        if (preg_match('/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//', $imagePath)) {
            return $imagePath;
        }

        // Convert relative path to full URL
        return url($imagePath);
    }
}
