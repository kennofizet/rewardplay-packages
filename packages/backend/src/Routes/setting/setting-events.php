<?php

use Illuminate\Support\Facades\Route;
use Kennofizet\RewardPlay\Controllers\Settings\SettingEventController;

Route::get('/setting-events', [SettingEventController::class, 'index']);
Route::get('/setting-events/{id}', [SettingEventController::class, 'show']);
Route::post('/setting-events', [SettingEventController::class, 'store']);
Route::put('/setting-events/{id}', [SettingEventController::class, 'update']);
Route::post('/setting-events/{id}', [SettingEventController::class, 'update']); // POST for update with file upload (PHP only populates $_FILES for POST)
Route::delete('/setting-events/{id}', [SettingEventController::class, 'destroy']);
