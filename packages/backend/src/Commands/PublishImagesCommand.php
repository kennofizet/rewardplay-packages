<?php

namespace Kennofizet\RewardPlay\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class PublishImagesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'rewardplay:publish-images 
                            {--force : Overwrite existing files}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Publish default images from RewardPlay package to public directory';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $sourcePath = __DIR__ . '/../Assets/images';
        $imagesFolder = config('rewardplay.images_folder', 'rewardplay-images');
        $destinationPath = public_path($imagesFolder);

        // Check if source directory exists
        if (!File::exists($sourcePath)) {
            $this->error("Source images directory not found: {$sourcePath}");
            return Command::FAILURE;
        }

        // Check if destination already exists
        if (File::exists($destinationPath) && !$this->option('force')) {
            if (!$this->confirm("Directory '{$imagesFolder}' already exists. Overwrite?")) {
                $this->info('Publishing cancelled.');
                return Command::SUCCESS;
            }
        }

        // Create destination directory if it doesn't exist
        if (!File::exists($destinationPath)) {
            File::makeDirectory($destinationPath, 0755, true);
        }

        // Copy files
        $files = File::allFiles($sourcePath);
        $copied = 0;

        foreach ($files as $file) {
            // Skip .gitkeep and other hidden files
            if (strpos($file->getFilename(), '.') === 0 && $file->getFilename() !== '.gitkeep') {
                continue;
            }

            $relativePath = $file->getRelativePath();
            $destinationFile = $destinationPath . '/' . ($relativePath ? $relativePath . '/' : '') . $file->getFilename();

            // Create subdirectory if needed
            if ($relativePath && !File::exists(dirname($destinationFile))) {
                File::makeDirectory(dirname($destinationFile), 0755, true);
            }

            File::copy($file->getPathname(), $destinationFile);
            $copied++;
        }

        if ($copied > 0) {
            $this->info("Successfully published {$copied} image(s) to 'public/{$imagesFolder}'");
        } else {
            $this->warn("No images found in source directory. Add images to: {$sourcePath}");
        }

        $this->info("Images are now available at: /{$imagesFolder}/");

        return Command::SUCCESS;
    }
}
