<?php

namespace Company\RewardPlay;

use Illuminate\Support\ServiceProvider;

class RewardPlayServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->mergeConfigFrom(
            __DIR__.'/Config/rewardplay.php',
            'rewardplay'
        );
    }

    public function boot()
    {
        $this->publishes([
            __DIR__.'/Migrations' => database_path('migrations'),
        ], 'rewardplay-migrations');

        $this->publishes([
            __DIR__.'/Config/rewardplay.php' => config_path('rewardplay.php'),
        ], 'rewardplay-config');

        // Publish default images folder
        $imagesFolder = config('rewardplay.images_folder', 'rewardplay-images');
        $this->publishes([
            __DIR__.'/Assets/images' => public_path($imagesFolder),
        ], 'rewardplay-images');

        // Register custom command
        if ($this->app->runningInConsole()) {
            $this->commands([
                \Company\RewardPlay\Commands\PublishImagesCommand::class,
            ]);
        }

        $this->loadRoutesFrom(__DIR__.'/Routes/api.php');
    }
}

