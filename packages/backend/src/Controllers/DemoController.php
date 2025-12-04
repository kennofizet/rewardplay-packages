<?php

namespace Kennofizet\RewardPlay\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DemoController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->attributes->get('rewardplay_user_id');

        return response()->json([
            'message' => 'Demo API endpoint',
            'user_id' => $userId,
            'status' => 'success',
        ]);
    }
}

