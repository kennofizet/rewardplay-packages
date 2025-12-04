<?php

use Illuminate\Support\Facades\Route;
use Kennofizet\RewardPlay\Controllers\DemoController;
use Kennofizet\RewardPlay\Controllers\AuthController;
use Kennofizet\RewardPlay\Middleware\ValidateRewardPlayToken;

$prefix = config('rewardplay.api_prefix', 'api/rewardplay');
$rateLimit = config('rewardplay.rate_limit', 60);

// Public routes (no token validation required)
Route::prefix($prefix)
    ->middleware(['api'])
    ->group(function () {
        Route::post('/auth/check', [AuthController::class, 'checkUser']);
    });

// Protected routes (require token validation)
Route::prefix($prefix)
    ->middleware(['api', ValidateRewardPlayToken::class])
    ->middleware("throttle:{$rateLimit},1")
    ->group(function () {
        Route::get('/demo', [DemoController::class, 'index']);
    });

