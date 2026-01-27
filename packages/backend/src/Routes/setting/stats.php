<?php

use Illuminate\Support\Facades\Route;
use Kennofizet\RewardPlay\Controllers\StatsController;

// Stats (accessible to both player and manage)
Route::get('/stats/all', [StatsController::class, 'getAllStats']);
Route::get('/stats/reward-types', [StatsController::class, 'getRewardTypes']);
Route::get('/types', [StatsController::class, 'getTypes']);
