<?php

namespace Kennofizet\RewardPlay\Controllers;

use Kennofizet\RewardPlay\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Kennofizet\RewardPlay\Services\Model\UserService;
use Kennofizet\RewardPlay\Models\User\UserModelResponse;

class UserController extends Controller
{
    protected UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Get all users
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only([
            'perPage', 
            'currentPage', 
            'keySearch', 
            'q'
        ]);
        $reponseMode = $request->reponseMode;

        $users = $this->userService->getUsers($filters, $reponseMode);

        if ($request->expectsJson()) {
            $formattedUsers = UserModelResponse::formatUsers($users, $reponseMode);
            
            // Return with user context
            return $this->apiResponseWithContext([
                'users' => $formattedUsers,
            ]);
        }

        return $this->apiErrorResponse();
    }
}

