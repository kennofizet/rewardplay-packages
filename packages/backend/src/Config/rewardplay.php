<?php

return [
    /*
    |--------------------------------------------------------------------------
    | User Table Name
    |--------------------------------------------------------------------------
    |
    | The name of the users table in your database.
    | Default: 'users'
    |
    */
    'table_user' => env('REWARDPLAY_TABLE_USER', 'users'),

    /*
    |--------------------------------------------------------------------------
    | Token Column Name
    |--------------------------------------------------------------------------
    |
    | The name of the token column in the users table.
    | Default: 'rewardpay_token'
    |
    | IMPORTANT: After changing this config, run:
    | php artisan config:clear
    |
    */
    'token_name' => env('REWARDPLAY_TOKEN_NAME', 'rewardpay_token'),

    /*
    |--------------------------------------------------------------------------
    | Token Active Column Name
    |--------------------------------------------------------------------------
    |
    | The name of the token active status column in the users table.
    | Default: 'token_active'
    |
    | IMPORTANT: After changing this config, run:
    | php artisan config:clear
    |
    */
    'token_active_name' => env('REWARDPLAY_TOKEN_ACTIVE_NAME', 'token_active'),

    /*
    |--------------------------------------------------------------------------
    | API Route Prefix
    |--------------------------------------------------------------------------
    |
    | Prefix for all RewardPlay API routes.
    | Default: 'api/rewardplay'
    |
    */
    'api_prefix' => env('REWARDPLAY_API_PREFIX', 'api/rewardplay'),

    /*
    |--------------------------------------------------------------------------
    | Rate Limiting
    |--------------------------------------------------------------------------
    |
    | Maximum number of requests per minute per token.
    | Default: 60 requests per minute
    |
    */
    'rate_limit' => env('REWARDPLAY_RATE_LIMIT', 60),

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
];

