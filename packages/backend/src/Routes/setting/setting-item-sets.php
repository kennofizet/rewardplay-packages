<?php

use Illuminate\Support\Facades\Route;
use Kennofizet\RewardPlay\Controllers\Settings\SettingItemSetController;

// Setting Item Sets CRUD
Route::get('/setting-item-sets', [SettingItemSetController::class, 'index']);
Route::get('/setting-item-sets/{id}', [SettingItemSetController::class, 'show']);
Route::post('/setting-item-sets', [SettingItemSetController::class, 'store']);
Route::patch('/setting-item-sets/{id}', [SettingItemSetController::class, 'update']);
Route::put('/setting-item-sets/{id}', [SettingItemSetController::class, 'update']);
Route::delete('/setting-item-sets/{id}', [SettingItemSetController::class, 'destroy']);
