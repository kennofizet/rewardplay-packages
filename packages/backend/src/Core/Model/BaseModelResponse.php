<?php

namespace Kennofizet\RewardPlay\Core\Model;

class BaseModelResponse
{
    /**
     * Return a successful array response
     */
    public static function success(string $message = 'Success', $data = null): array
    {
        if(empty($data)){
            $data = [
                'message' => "Success"
            ];
        }
        return [
            'success' => true,
            'message' => $message,
            'data' => $data
        ];
    }

    /**
     * Return an error array response
     */
    public static function error(string $message = 'Error', $data = null): array
    {
        if(empty($data)){
            $data = [
                'message' => "Permission Denied"
            ];
        }
        return [
            'success' => false,
            'message' => $message,
            'data' => $data
        ];
    }

    /**
     * Get full URL for an image path
     * Converts relative path (e.g., rewardplay-images/items/1/filename.jpg) to full URL
     * If path is already a full URL (http, https, etc.), returns it as-is
     * 
     * @param string|null $imagePath - Relative image path from public folder or full URL
     * @return string - Full URL or empty string if path is empty
     */
    public static function getImageFullUrl(?string $imagePath): string
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
