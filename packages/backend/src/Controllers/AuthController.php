<?php

namespace Kennofizet\RewardPlay\Controllers;

use Kennofizet\RewardPlay\Controllers\Controller;
use Illuminate\Http\Request;
use Kennofizet\RewardPlay\Services\ImageManifestService;
use Kennofizet\RewardPlay\Models\User;
use Kennofizet\RewardPlay\Models\UserProfile\UserProfileConstant;
use Kennofizet\RewardPlay\Models\UserBagItem\UserBagItemModelResponse;

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

        // Determine manager status from attributes set by ValidateRewardPlayToken
        $managedServerId = $request->attributes->get('rewardplay_user_managed_server_id');
        $managedZoneIds = $request->attributes->get('rewardplay_user_managed_zone_ids', []);

        $isManager = false;
        if (!empty($managedServerId)) {
            $isManager = true;
        } elseif (!empty($managedZoneIds) && is_array($managedZoneIds) && count($managedZoneIds) > 0) {
            $isManager = true;
        }

        return $this->apiResponseWithContext([
            'is_manager' => $isManager,
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

        $user = User::findById($userId);
        if (!$user) {
            return $this->apiErrorResponse('User not found', 404);
        }

        return $this->apiResponseWithContext([
            'coin' => $user->getCoin(),
            'box_coin' => $user->getBoxCoin(),
            'ruby' => $user->getRuby(),
            'power' => $user->getPower(),
            'lv' => $user->getLevel(),
            'exp' => $user->getExp(),
            'exp_needed' => $user->getExpNeed(),
            'stats' => $user->getStats(),
            'gears' => UserBagItemModelResponse::formatGearWearWithActions($user->getGears()),
            'current_sets' => UserBagItemModelResponse::formatCurrentSets($user->getCurrentSets()),
            'gears_sets' => $user->getGearsSets(),
            'gear_wear_config' => UserProfileConstant::GEAR_WEAR_CONFIG
        ]);
    }
}

