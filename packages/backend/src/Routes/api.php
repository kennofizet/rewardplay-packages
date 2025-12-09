<?php

use Illuminate\Support\Facades\Route;
use Kennofizet\RewardPlay\Controllers\DemoController;
use Kennofizet\RewardPlay\Controllers\AuthController;
use Kennofizet\RewardPlay\Controllers\RankingController;
use Kennofizet\RewardPlay\Middleware\ValidateRewardPlayToken;

$prefix = config('rewardplay.api_prefix', 'api/rewardplay');
$rateLimit = config('rewardplay.rate_limit', 60);

// Public routes (no token validation required)
Route::prefix($prefix)
    ->middleware(['api'])
    ->group(function () {
        Route::get('/auth/check', [AuthController::class, 'checkUser']);
        Route::get('/auth/user-data', [AuthController::class, 'getUserData']);
        Route::get('/ranking', [RankingController::class, 'getRanking']);
        Route::options('/manifest', function () {
            return response('', 200)
                ->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Methods', 'GET, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type');
        });
        Route::get('/manifest', [AuthController::class, 'getImageManifest']);
    });

// Protected routes (require token validation)
Route::prefix($prefix)
    ->middleware(['api', ValidateRewardPlayToken::class])
    ->middleware("throttle:{$rateLimit},1")
    ->group(function () {
        Route::get('/demo', [DemoController::class, 'index']);
    });

