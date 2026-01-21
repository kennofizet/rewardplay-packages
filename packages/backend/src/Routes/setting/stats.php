<?php

use Illuminate\Support\Facades\Route;
use Kennofizet\RewardPlay\Controllers\StatsController;

// Stats
Route::get('/stats/conversion-keys', [StatsController::class, 'getConversionKeys']);
Route::get('/stats/all', [StatsController::class, 'getAllStats']);
