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
}
