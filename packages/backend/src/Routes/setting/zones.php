<?php

use Illuminate\Support\Facades\Route;
use Kennofizet\RewardPlay\Controllers\Settings\ZoneController as SettingsZoneController;

// Zones (manage)
Route::get('/zones', [SettingsZoneController::class, 'index']);
Route::get('/zones/{id}', [SettingsZoneController::class, 'show']);
// List users for a zone (server members + assigned ids)
Route::get('/zones/{id}/users', [SettingsZoneController::class, 'users']);
// Assign/Remove user to/from zone
Route::post('/zones/{id}/users', [SettingsZoneController::class, 'assignUser']);
Route::delete('/zones/{id}/users/{userId}', [SettingsZoneController::class, 'removeUser']);
Route::post('/zones', [SettingsZoneController::class, 'store']);
Route::patch('/zones/{id}', [SettingsZoneController::class, 'update']);
Route::put('/zones/{id}', [SettingsZoneController::class, 'update']);
Route::delete('/zones/{id}', [SettingsZoneController::class, 'destroy']);
