<?php

use Illuminate\Support\Facades\Route;
use Kennofizet\RewardPlay\Controllers\AuthController;
use Kennofizet\RewardPlay\Controllers\RankingController;
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

        // New Settings Routes - IMPORTANT: Specific routes MUST come before apiResource
        Route::post('setting-stack-bonuses/suggest', [\Kennofizet\RewardPlay\Controllers\Settings\SettingStackBonusController::class, 'suggest']);
        Route::apiResource('setting-stack-bonuses', \Kennofizet\RewardPlay\Controllers\Settings\SettingStackBonusController::class);

        Route::post('setting-daily-rewards/suggest', [\Kennofizet\RewardPlay\Controllers\Settings\SettingDailyRewardController::class, 'suggest']);
        Route::get('setting-daily-rewards', [\Kennofizet\RewardPlay\Controllers\Settings\SettingDailyRewardController::class, 'index']);
        Route::post('setting-daily-rewards', [\Kennofizet\RewardPlay\Controllers\Settings\SettingDailyRewardController::class, 'store']);

        Route::post('setting-level-exps/suggest', [\Kennofizet\RewardPlay\Controllers\Settings\SettingLevelExpController::class, 'suggest']);
        Route::apiResource('setting-level-exps', \Kennofizet\RewardPlay\Controllers\Settings\SettingLevelExpController::class);
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
        Route::get('/auth/user-data', [AuthController::class, 'getUserData']);
        Route::get('/ranking', [RankingController::class, 'getRanking']);

        // Get zones the current user belongs to
        Route::get('/player/zones', [ZoneController::class, 'index']);
        // Get custom images accessible to the current player
        Route::get('/player/custom-images', [PlayerController::class, 'getCustomImages']);
        // Get zones the current user can manage (for settings)
        Route::get('/player/managed-zones', [ZoneController::class, 'managed']);

        // Global data endpoints (accessible to both player and manage)
        require_once __DIR__ . '/setting/stats.php';

        // New Player Routes
        Route::get('/player/daily-rewards', [\Kennofizet\RewardPlay\Controllers\Player\DailyRewardController::class, 'index']);
        Route::post('/player/daily-rewards/collect', [\Kennofizet\RewardPlay\Controllers\Player\DailyRewardController::class, 'collect']);
        Route::get('/player/bag', [\Kennofizet\RewardPlay\Controllers\Player\BagController::class, 'index']);

        Route::options('/manifest', function () {
            return response('', 200)
                ->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Methods', 'GET, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type');
        });
        Route::get('/manifest', [AuthController::class, 'getImageManifest']);
    });

