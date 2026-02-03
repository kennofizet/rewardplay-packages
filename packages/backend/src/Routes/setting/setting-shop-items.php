<?php

use Illuminate\Support\Facades\Route;
use Kennofizet\RewardPlay\Controllers\Settings\SettingShopItemController;

Route::post('/setting-shop-items/suggest', [SettingShopItemController::class, 'suggest']);
Route::get('/setting-shop-items', [SettingShopItemController::class, 'index']);
Route::get('/setting-shop-items/{id}', [SettingShopItemController::class, 'show']);
Route::post('/setting-shop-items', [SettingShopItemController::class, 'store']);
Route::put('/setting-shop-items/{id}', [SettingShopItemController::class, 'update']);
Route::delete('/setting-shop-items/{id}', [SettingShopItemController::class, 'destroy']);
