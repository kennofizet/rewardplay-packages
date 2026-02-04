<?php

namespace Kennofizet\RewardPlay\Services;

use Illuminate\Support\Facades\File;
use Carbon\Carbon;

class ImageManifestService
{
    /**
     * Build image manifest merged with any custom global images and return full URLs.
     *
     * @return array
     */
    public function buildManifest(): array
    {
        $imagesFolder = config('rewardplay.images_folder', 'rewardplay-images');
        $manifestPath = public_path($imagesFolder . '/image-manifest.json');
        $customFolder = public_path($imagesFolder . '/' . config('rewardplay.custom_global_images_folder', 'custom/global'));
        $cachePath = $customFolder . '/.cache.json';
        $now = Carbon::now();

        if (!File::exists($manifestPath)) {
            return [];
        }

        $manifest = json_decode(File::get($manifestPath), true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            return [];
        }

        // Get custom global images with 5-minute cache
        $customManifest = [];
        $shouldRefresh = true;

        if (File::exists($cachePath)) {
            $cached = json_decode(File::get($cachePath), true);
            if (is_array($cached) && isset($cached['timestamp'])) {
                $last = Carbon::createFromTimestamp((int)$cached['timestamp']);
                if ($last && $last->diffInMinutes($now) < 5) {
                    unset($cached['timestamp']);
                    $customManifest = $cached;
                    $shouldRefresh = false;
                }
            }
        }

        if ($shouldRefresh) {
            $customManifest = [];

            if (File::isDirectory($customFolder)) {
                $customFiles = collect(File::files($customFolder))
                    ->map(fn($file) => $file->getFilename())
                    ->values()
                    ->toArray();

                foreach ($customFiles as $filename) {
                    $customBase = strtolower(pathinfo($filename, PATHINFO_FILENAME));
                    $found = false;

                    foreach ($manifest as $key => $value) {
                        $manifestFilename = basename($value);
                        $manifestBase = strtolower(pathinfo($manifestFilename, PATHINFO_FILENAME));

                        $manifestBaseClean = preg_replace('/[-_](df|default|def)$/i', '', $manifestBase);
                        $customBaseClean = preg_replace('/[-_](df|default|def)$/i', '', $customBase);

                        if ($customBase === $manifestBase ||
                            $customBaseClean === $manifestBaseClean ||
                            strpos($manifestBase, $customBase) === 0 ||
                            strpos($customBase, $manifestBase) === 0 ||
                            strpos($manifestBaseClean, $customBaseClean) === 0 ||
                            strpos($customBaseClean, $manifestBaseClean) === 0) {
                            $customFolderRelative = config('rewardplay.custom_global_images_folder', 'custom/global');
                            $customManifest[$key] = $customFolderRelative . '/' . $filename;
                            $found = true;
                            break;
                        }
                    }

                    if (!$found && preg_match('/^(coin|ticket|box[-_]?coin|epic[-_]?chest|reward)/i', $customBase)) {
                        $normalized = str_replace(['-', '_'], '', $customBase);
                        $potentialKey = 'global.' . $normalized;
                        if (!isset($customManifest[$potentialKey])) {
                            $customFolderRelative = config('rewardplay.custom_global_images_folder', 'custom/global');
                            $customManifest[$potentialKey] = $customFolderRelative . '/' . $filename;
                        }
                    }
                }
            }

            File::ensureDirectoryExists($customFolder);

            $cacheData = $customManifest;
            $cacheData['timestamp'] = $now->timestamp;
            File::put($cachePath, json_encode($cacheData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
        }

        // Merge custom manifest into main manifest
        $manifest = array_merge($manifest, $customManifest);

        // Convert to full URLs. When allow_cors_for_files is true, use API file route so Laravel serves files and adds CORS.
        $imagesFolder = config('rewardplay.images_folder', 'rewardplay-images');
        $apiPrefix = config('rewardplay.api_prefix', 'api/rewardplay');
        $useFileRoute = config('rewardplay.allow_cors_for_files', false);
        $manifestWithFullUrls = [];
        foreach ($manifest as $key => $value) {
            $relativePath = ltrim($value, '/');
            if ($useFileRoute) {
                $manifestWithFullUrls[$key] = url($apiPrefix . '/files/' . $imagesFolder . '/' . $relativePath);
            } else {
                $manifestWithFullUrls[$key] = url($imagesFolder . '/' . $relativePath);
            }
        }

        // Frontend uses this to decide: fetch+blob (in-memory cache) when true, else Image only (no CORS).
        $manifestWithFullUrls['_cors_for_files'] = $useFileRoute;

        return $manifestWithFullUrls;
    }
}
