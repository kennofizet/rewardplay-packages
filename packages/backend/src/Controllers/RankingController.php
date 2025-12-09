<?php

namespace Kennofizet\RewardPlay\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Kennofizet\RewardPlay\Services\TokenService;

class RankingController extends Controller
{
    protected $tokenService;

    public function __construct(TokenService $tokenService)
    {
        $this->tokenService = $tokenService;
    }

    /**
     * Get ranking data
     */
    public function getRanking(Request $request)
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

        // Fake ranking data
        $ranking_data = [
            'my_rank' => 15,
            'my_coin' => 2850,
            'top_users' => [
                [
                    'id' => 1,
                    'name' => 'Player 1',
                    'avatar' => null,
                    'coin' => 5700,
                    'type' => 'USER'
                ],
                [
                    'id' => 2,
                    'name' => 'Player 2',
                    'avatar' => null,
                    'coin' => 4500,
                    'type' => 'USER'
                ],
                [
                    'id' => 3,
                    'name' => 'Player 3',
                    'avatar' => null,
                    'coin' => 3200,
                    'type' => 'USER'
                ],
                [
                    'id' => 4,
                    'name' => 'Player 4',
                    'avatar' => null,
                    'coin' => 2900,
                    'type' => 'USER'
                ],
                [
                    'id' => 5,
                    'name' => 'Player 5',
                    'avatar' => null,
                    'coin' => 2750,
                    'type' => 'USER'
                ],
                [
                    'id' => 6,
                    'name' => 'Player 6',
                    'avatar' => null,
                    'coin' => 2600,
                    'type' => 'USER'
                ],
                [
                    'id' => 7,
                    'name' => 'Player 7',
                    'avatar' => null,
                    'coin' => 2450,
                    'type' => 'USER'
                ],
                [
                    'id' => 8,
                    'name' => 'Player 8',
                    'avatar' => null,
                    'coin' => 2300,
                    'type' => 'USER'
                ],
                [
                    'id' => 9,
                    'name' => 'Player 9',
                    'avatar' => null,
                    'coin' => 2150,
                    'type' => 'USER'
                ],
                [
                    'id' => 10,
                    'name' => 'Player 10',
                    'avatar' => null,
                    'coin' => 2000,
                    'type' => 'USER'
                ],
            ],
            'top_week' => [
                [
                    'id' => 1,
                    'name' => 'Player 1',
                    'avatar' => null,
                    'coin' => 200,
                    'type' => 'USER'
                ],
                [
                    'id' => 2,
                    'name' => 'Player 2',
                    'avatar' => null,
                    'coin' => 190,
                    'type' => 'USER'
                ],
                [
                    'id' => 3,
                    'name' => 'Player 3',
                    'avatar' => null,
                    'coin' => 180,
                    'type' => 'USER'
                ],
                [
                    'id' => 4,
                    'name' => 'Player 4',
                    'avatar' => null,
                    'coin' => 170,
                    'type' => 'USER'
                ],
                [
                    'id' => 5,
                    'name' => 'Player 5',
                    'avatar' => null,
                    'coin' => 160,
                    'type' => 'USER'
                ],
                [
                    'id' => 6,
                    'name' => 'Player 6',
                    'avatar' => null,
                    'coin' => 150,
                    'type' => 'USER'
                ],
                [
                    'id' => 7,
                    'name' => 'Player 7',
                    'avatar' => null,
                    'coin' => 140,
                    'type' => 'USER'
                ],
                [
                    'id' => 8,
                    'name' => 'Player 8',
                    'avatar' => null,
                    'coin' => 130,
                    'type' => 'USER'
                ]
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => $ranking_data,
        ]);
    }
}
