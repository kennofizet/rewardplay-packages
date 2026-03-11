<?php

namespace Kennofizet\RewardPlay\Core\Model;

use Kennofizet\PackagesCore\Core\Model\BaseModelResponse as CoreBaseModelResponse;
use Illuminate\Support\Facades\Config;

/**
 * RewardPlay BaseModelResponse
 *
 * Extends packages-core BaseModelResponse (which provides success() / error()).
 * Adds rewardplay-specific getImageFullUrl() that uses rewardplay config keys
 * (images_folder, allow_cors_for_files stay in rewardplay config).
 */
class BaseModelResponse extends CoreBaseModelResponse
{
    /**
     * Get full URL for an image path.
     * Uses rewardplay config for images_folder / allow_cors_for_files.
     * The api_prefix is read from packages-core config.
     */
    public static function getImageFullUrl(?string $imagePath): string
    {
        if (empty($imagePath)) {
            return '';
        }

        // Already a full URL
        if (preg_match('/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//', $imagePath)) {
            return $imagePath;
        }

        $imagesFolder = Config::get('rewardplay.images_folder', 'rewardplay-images');

        if (
            Config::get('rewardplay.allow_cors_for_files', false)
            && (str_starts_with($imagePath, $imagesFolder . '/') || $imagePath === $imagesFolder)
        ) {
            // api_prefix moved to packages-core
            $apiPrefix = Config::get('packages-core.api_prefix', 'api/knf') . '/' . Config::get('rewardplay.api_prefix', 'rewardplay');
            return url($apiPrefix . '/files/' . ltrim($imagePath, '/'));
        }

        return url($imagePath);
    }
}
