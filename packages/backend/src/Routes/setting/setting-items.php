<?php

use Illuminate\Support\Facades\Route;
use Kennofizet\RewardPlay\Controllers\Settings\SettingItemController;

// Setting Items CRUD
Route::get('/setting-items', [SettingItemController::class, 'index']);
Route::get('/setting-items/types', [SettingItemController::class, 'getItemTypes']);
Route::get('/setting-items/items-for-zone', [SettingItemController::class, 'getItemsForZone']);
Route::post('/setting-items', [SettingItemController::class, 'store']);
Route::patch('/setting-items/{id}', [SettingItemController::class, 'update']); // Support FormData
Route::put('/setting-items/{id}', [SettingItemController::class, 'update']);
Route::delete('/setting-items/{id}', [SettingItemController::class, 'destroy']);
