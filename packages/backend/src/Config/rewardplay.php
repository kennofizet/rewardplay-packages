<?php

// NOTE: table_user, user_server_id_column, table_prefix, rate_limit
// have been moved to the packages-core config (packages-core.php).
// Use config('packages-core.table_user') etc. going forward.

return [
    'api_prefix' => env('REWARDPLAY_API_PREFIX', 'rewardplay'),
    /*
    |--------------------------------------------------------------------------
    | Default Images Folder Name
    |--------------------------------------------------------------------------
    |
    | The name of the folder in the public directory where default images
    | from the package will be published.
    | Default: 'rewardplay-images'
    |
    | After changing this config, run:
    | php artisan rewardplay:publish-images
    |
    */
    'images_folder' => env('REWARDPLAY_IMAGES_FOLDER', 'rewardplay-images'),

    /*
    |--------------------------------------------------------------------------
    | Constants Folder (Frontend)
    |--------------------------------------------------------------------------
    |
    | The folder in the public directory where the constants JS file is published.
    | Run: php artisan rewardplay:export-constants && php artisan rewardplay:publish-constants
    |
    */
    'constants_folder' => env('REWARDPLAY_CONSTANTS_FOLDER', 'rewardplay-constants'),

    /*
    |--------------------------------------------------------------------------
    | Custom Global Images Folder
    |--------------------------------------------------------------------------
    |
    | The path to the folder in the public directory where custom global images
    | are stored. These images will override default global images when present.
    | Default: 'custom/global'
    |
    */
    'custom_global_images_folder' => env('REWARDPLAY_CUSTOM_GLOBAL_IMAGES_FOLDER', 'custom/global'),

    /*
    |--------------------------------------------------------------------------
    | Allow CORS for file folders
    |--------------------------------------------------------------------------
    |
    | When true, responses for files under images_folder, constants_folder,
    | and custom_global_images_folder will include Access-Control-Allow-Origin.
    | Default: false
    |
    */
    'allow_cors_for_files' => env('REWARDPLAY_ALLOW_CORS_FOR_FILES', false),
];

