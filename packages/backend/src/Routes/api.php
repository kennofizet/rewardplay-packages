<?php

use Illuminate\Support\Facades\Route;
use Kennofizet\RewardPlay\Controllers\DemoController;
use Kennofizet\RewardPlay\Controllers\AuthController;
use Kennofizet\RewardPlay\Controllers\RankingController;
use Kennofizet\RewardPlay\Controllers\UserController;
use Kennofizet\RewardPlay\Controllers\Player\PlayerController;
use Kennofizet\RewardPlay\Controllers\Player\ZoneController;
use Kennofizet\RewardPlay\Middleware\ValidateRewardPlayToken;
use Kennofizet\RewardPlay\Middleware\ValidatorRequestMiddleware;
use Kennofizet\RewardPlay\Middleware\EnsureUserIsManager;

$prefix = config('rewardplay.api_prefix', 'api/rewardplay');
$rateLimit = config('rewardplay.rate_limit', 60);

// Protected routes and manage only
Route::prefix($prefix)
    ->middleware([
        "throttle:{$rateLimit},1",
        'api', 
        ValidateRewardPlayToken::class, 
        ValidatorRequestMiddleware::class,
        EnsureUserIsManager::class,
    ])
    ->group(function () {
        require_once __DIR__ . '/setting/setting-items.php';
        require_once __DIR__ . '/setting/setting-options.php';
        require_once __DIR__ . '/setting/setting-item-sets.php';
        require_once __DIR__ . '/setting/zones.php';
        require_once __DIR__ . '/setting/stats.php';
    });

// Protected routes (require token validation)
Route::prefix($prefix)
    ->middleware([
        "throttle:{$rateLimit},1",
        'api', 
        ValidateRewardPlayToken::class, 
        ValidatorRequestMiddleware::class
    ])
    ->group(function () {
        Route::get('/auth/check', [AuthController::class, 'checkUser']);
        
        Route::get('/demo', [DemoController::class, 'index']);
        Route::get('/users', [UserController::class, 'index']);

        Route::get('/auth/user-data', [AuthController::class, 'getUserData']);
        Route::get('/ranking', [RankingController::class, 'getRanking']);
            
        // Player endpoints (example) - player requests MUST send zone_id param
        Route::post('/player/action', [PlayerController::class, 'doAction']);
        // Get zones the current user belongs to
        Route::get('/player/zones', [ZoneController::class, 'index']);
        // Get custom images accessible to the current player
        Route::get('/player/custom-images', [PlayerController::class, 'getCustomImages']);
        // Get zones the current user can manage (for settings)
        Route::get('/player/managed-zones', [ZoneController::class, 'managed']);
        Route::options('/manifest', function () {
            return response('', 200)
                ->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Methods', 'GET, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type');
        });
        Route::get('/manifest', [AuthController::class, 'getImageManifest']);
    });

