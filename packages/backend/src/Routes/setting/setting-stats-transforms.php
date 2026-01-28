<?php

use Illuminate\Support\Facades\Route;
use Kennofizet\RewardPlay\Controllers\Settings\SettingStatsTransformController;

// Setting Stats Transforms CRUD
Route::get('/setting-stats-transforms', [SettingStatsTransformController::class, 'index']);
Route::post('/setting-stats-transforms', [SettingStatsTransformController::class, 'store']);
Route::patch('/setting-stats-transforms/{id}', [SettingStatsTransformController::class, 'update']);
Route::put('/setting-stats-transforms/{id}', [SettingStatsTransformController::class, 'update']);
Route::delete('/setting-stats-transforms/{id}', [SettingStatsTransformController::class, 'destroy']);
Route::post('/setting-stats-transforms/suggest', [SettingStatsTransformController::class, 'suggest']);
Route::get('/setting-stats-transforms/allowed-keys', [SettingStatsTransformController::class, 'getAllowedKeys']);
