<?php

namespace Kennofizet\RewardPlay\Controllers;

use Kennofizet\RewardPlay\Controllers\Controller;
use Illuminate\Http\Request;
use Kennofizet\RewardPlay\Services\ImageManifestService;

class AuthController extends Controller
{
    protected ImageManifestService $imageManifestService;

    public function __construct(ImageManifestService $imageManifestService)
    {
        $this->imageManifestService = $imageManifestService;
    }

    /**
     * Get image manifest file with CORS headers
     * Includes custom global images in the 'custom' key
     */
    public function getImageManifest()
    {
        $manifest = $this->imageManifestService->buildManifest();

        if (empty($manifest)) {
            return $this->apiErrorResponse('Manifest file not found or invalid', 404);
        }

        return response()->json($manifest)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type');
    }

    /**
     * Check user authentication
     */
    public function checkUser(Request $request)
    {
        // Middleware ValidateRewardPlayToken already validates token and attaches user id
        $userId = $request->attributes->get('rewardplay_user_id');

        if (empty($userId)) {
            return $this->apiErrorResponse('User not authenticated', 401);
        }

        return $this->apiResponseWithContext([
            'user' => [
                'id' => $userId,
            ]
        ]);
    }

    /**
     * Get user data
     */
    public function getUserData(Request $request)
    {
        // Middleware ValidateRewardPlayToken attaches user id and permissions to request
        $userId = $request->attributes->get('rewardplay_user_id');

        if (empty($userId)) {
            return $this->apiErrorResponse('User not authenticated', 401);
        }

        // Demo user data - load from config so it's easier to replace or override
        $itemDetails = config('rewardplay-demo.item_details', []);
        $bagItems = config('rewardplay-demo.bag_items', []);
        $swordItems = config('rewardplay-demo.sword_items', []);
        $otherItems = config('rewardplay-demo.other_items', []);
        $shopItems = config('rewardplay-demo.shop_items', []);

        return $this->apiResponseWithContext([
            'coin' => 1000000,
            'box_coin' => 100,
            'ruby' => 1000,
            'power' => 125000,
            'user_bag' => [
                'bag' => $bagItems,
                'sword' => $swordItems,
                'other' => $otherItems,
                'shop' => $shopItems,
            ],
            'item_detail' => $itemDetails,
        ]);
    }
}

