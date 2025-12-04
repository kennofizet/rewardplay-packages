<?php

namespace Company\RewardPlay\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Company\RewardPlay\Services\TokenService;

class AuthController extends Controller
{
    protected $tokenService;

    public function __construct(TokenService $tokenService)
    {
        $this->tokenService = $tokenService;
    }

    /**
     * Check user authentication
     */
    public function checkUser(Request $request)
    {
        $token = $request->header('X-RewardPlay-Token');

        if (!$token) {
            return response()->json([
                'success' => false,
                'error' => 'Token is required',
            ], 401);
        }

        $user = $this->tokenService->checkUser($token);

        if (!$user) {
            return response()->json([
                'success' => false,
                'error' => 'Invalid or inactive token',
            ], 401);
        }

        // Get images folder URL from config
        $imagesFolder = config('rewardplay.images_folder');
        $imagesUrl = url($imagesFolder);

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user['id'],
            ],
            'images_url' => $imagesUrl,
        ]);
    }
}

