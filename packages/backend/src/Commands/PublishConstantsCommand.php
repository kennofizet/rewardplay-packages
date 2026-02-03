<?php

namespace Kennofizet\RewardPlay\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

/**
 * Publish RewardPlay constants JS file to public directory (same pattern as publish-images).
 */
class PublishConstantsCommand extends Command
{
    protected $signature = 'rewardplay:publish-constants
                            {--force : Overwrite existing files}';

    protected $description = 'Publish RewardPlay constants JS file to public directory';

    public function handle(): int
    {
        $sourcePath = __DIR__ . '/../Assets/constant';
        $constantsFolder = config('rewardplay.constants_folder', 'rewardplay-constants');
        $destinationPath = public_path($constantsFolder);

        if (!File::exists($sourcePath)) {
            $this->warn("Source constants directory not found: {$sourcePath}");
            $this->info('Run php artisan rewardplay:export-constants first to generate the JS file.');
            return self::FAILURE;
        }

        if (File::exists($destinationPath) && !$this->option('force')) {
            if (!$this->confirm("Directory '{$constantsFolder}' already exists. Overwrite?")) {
                $this->info('Publishing cancelled.');
                return self::SUCCESS;
            }
        }

        if (!File::exists($destinationPath)) {
            File::makeDirectory($destinationPath, 0755, true);
        }

        $files = File::allFiles($sourcePath);
        $copied = 0;
        foreach ($files as $file) {
            if (strpos($file->getFilename(), '.') === 0 && $file->getFilename() !== '.gitkeep') {
                continue;
            }
            $relativePath = $file->getRelativePath();
            $destFile = $destinationPath . '/' . ($relativePath ? $relativePath . '/' : '') . $file->getFilename();
            if ($relativePath && !File::exists(dirname($destFile))) {
                File::makeDirectory(dirname($destFile), 0755, true);
            }
            File::copy($file->getPathname(), $destFile);
            $copied++;
        }

        if ($copied > 0) {
            $this->info("Successfully published {$copied} file(s) to 'public/{$constantsFolder}'");
        } else {
            $this->warn("No files found in {$sourcePath}. Run rewardplay:export-constants first.");
        }

        $this->info("Constants are available at: /{$constantsFolder}/rewardplay-constants.js");

        return self::SUCCESS;
    }
}
