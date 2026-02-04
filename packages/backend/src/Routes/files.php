<?php

use Illuminate\Support\Facades\Route;
use Kennofizet\RewardPlay\Controllers\FileController;

/*
|--------------------------------------------------------------------------
| RewardPlay file serving (images_folder, constants_folder)
|--------------------------------------------------------------------------
|
| Serves files from public/{images_folder} and public/{constants_folder}
| so CORS headers can be added when config rewardplay.allow_cors_for_files
| is true. custom_global_images_folder is under images_folder, so it is
| covered by the images route.
|
*/

$imagesFolder = config('rewardplay.images_folder', 'rewardplay-images');
$constantsFolder = config('rewardplay.constants_folder', 'rewardplay-constants');

$corsHeaders = function () {
    if (!config('rewardplay.allow_cors_for_files', false)) {
        return response('', 404);
    }
    return response('', 200)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type');
};

Route::options($imagesFolder . '/{path}', $corsHeaders)->where('path', '.*');
Route::get($imagesFolder . '/{path}', [FileController::class, 'serve'])
    ->where('path', '.*')
    ->defaults('folder', $imagesFolder)
    ->name('rewardplay.serve.images');

Route::options($constantsFolder . '/{path}', $corsHeaders)->where('path', '.*');
Route::get($constantsFolder . '/{path}', [FileController::class, 'serve'])
    ->where('path', '.*')
    ->defaults('folder', $constantsFolder)
    ->name('rewardplay.serve.constants');
