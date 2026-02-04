<?php

namespace Kennofizet\RewardPlay\Helpers;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;

/**
 * Cache with file fallback when the app has no cache driver configured.
 * Tries Laravel Cache first; on failure uses JSON files under storage/framework/cache/rewardplay/.
 */
class CacheHelper
{
    /** @var string */
    protected static $fileCacheDir;

    /**
     * Remember value for TTL: try Laravel cache, fallback to file cache.
     *
     * @param string $key Cache key (e.g. rewardplay_manifest)
     * @param int $ttlSeconds TTL in seconds (e.g. 86400 = 1 day)
     * @param callable $callback Callback that returns the value to cache
     * @return mixed Cached or freshly computed value (must be JSON-serializable for file fallback)
     */
    public static function rememberWithFileFallback(string $key, int $ttlSeconds, callable $callback)
    {
        try {
            return Cache::remember($key, $ttlSeconds, $callback);
        } catch (\Throwable $e) {
            // No cache driver or cache failed; use file-based fallback
            return self::rememberFile($key, $ttlSeconds, $callback);
        }
    }

    /**
     * File-based cache: store under storage/framework/cache/rewardplay/{key}.json
     */
    protected static function rememberFile(string $key, int $ttlSeconds, callable $callback)
    {
        $dir = self::getFileCacheDir();
        $safeKey = preg_replace('/[^a-zA-Z0-9_-]/', '_', $key);
        $path = $dir . '/' . $safeKey . '.json';

        if (file_exists($path)) {
            $raw = @file_get_contents($path);
            if ($raw !== false) {
                $data = json_decode($raw, true);
                if (is_array($data) && isset($data['expires_at']) && $data['expires_at'] > time()) {
                    return $data['payload'] ?? null;
                }
            }
        }

        $payload = $callback();
        File::ensureDirectoryExists($dir);
        $content = json_encode([
            'expires_at' => time() + $ttlSeconds,
            'payload' => $payload,
        ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        if ($content !== false) {
            @file_put_contents($path, $content);
        }
        return $payload;
    }

    protected static function getFileCacheDir(): string
    {
        if (self::$fileCacheDir === null) {
            self::$fileCacheDir = storage_path('framework/cache/rewardplay');
        }
        return self::$fileCacheDir;
    }
}
