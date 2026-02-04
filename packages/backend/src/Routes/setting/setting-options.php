<?php

use Illuminate\Support\Facades\Route;
use Kennofizet\RewardPlay\Controllers\Settings\SettingOptionController;

// Setting Options CRUD
Route::get('/setting-options', [SettingOptionController::class, 'index']);
Route::get('/setting-options/{id}', [SettingOptionController::class, 'show']);
Route::post('/setting-options', [SettingOptionController::class, 'store']);
Route::patch('/setting-options/{id}', [SettingOptionController::class, 'update']);
Route::put('/setting-options/{id}', [SettingOptionController::class, 'update']);
Route::delete('/setting-options/{id}', [SettingOptionController::class, 'destroy']);
