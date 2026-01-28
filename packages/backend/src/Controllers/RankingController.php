<?php

namespace Kennofizet\RewardPlay\Controllers;

use Kennofizet\RewardPlay\Controllers\Controller;
use Illuminate\Http\Request;
use Kennofizet\RewardPlay\Models\User;
use Kennofizet\RewardPlay\Models\UserProfile;

class RankingController extends Controller
{

    /**
     * Get ranking data
     */
    public function getRanking(Request $request)
    {
        // Middleware ValidateRewardPlayToken already validated token and attached user id
        $userId = $request->attributes->get('rewardplay_user_id');

        if (empty($userId)) {
            return $this->apiErrorResponse('User not authenticated', 401);
        }

        // Get current user's coin
        $currentUser = User::findById($userId);
        $myCoin = $currentUser ? $currentUser->getCoin() : 0;

        // Get top users by coin (all time)
        $topUsers = UserProfile::orderBy('coin', 'desc')
            ->limit(10)
            ->with('user')
            ->get()
            ->map(function ($profile) {
                return [
                    'id' => $profile->user_id,
                    'name' => $profile->user->name ?? 'Player ' . $profile->user_id,
                    'avatar' => $profile->user->avatar ?? null,
                    'coin' => $profile->coin ?? 0,
                    'type' => 'USER'
                ];
            })
            ->toArray();

        // Calculate user's rank
        $myRank = UserProfile::where('coin', '>', $myCoin)->count() + 1;

        // Get top week users (last 7 days - simplified, using all time for now)
        // TODO: Implement proper weekly ranking based on coin gained in last 7 days
        $topWeek = UserProfile::orderBy('coin', 'desc')
            ->limit(8)
            ->with('user')
            ->get()
            ->map(function ($profile) {
                return [
                    'id' => $profile->user_id,
                    'name' => $profile->user->name ?? 'Player ' . $profile->user_id,
                    'avatar' => $profile->user->avatar ?? null,
                    'coin' => $profile->coin ?? 0,
                    'type' => 'USER'
                ];
            })
            ->toArray();

        $ranking_data = [
            'my_rank' => $myRank,
            'my_coin' => $myCoin,
            'top_users' => $topUsers,
            'top_week' => $topWeek,
        ];

        return $this->apiResponseWithContext($ranking_data);
    }
}
