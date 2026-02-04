<?php

namespace Kennofizet\RewardPlay\Services\Player;

use Kennofizet\RewardPlay\Helpers\CacheHelper;
use Kennofizet\RewardPlay\Core\Model\BaseModelResponse;
use Kennofizet\RewardPlay\Models\SettingItem;

class PlayerService
{
    public const CACHE_KEY_CUSTOM_IMAGES = 'rewardplay_custom_images';
    public const CACHE_TTL_SECONDS = 86400; // 1 day
    public const CHUNK_SIZE = 100;

    /**
     * Return list of custom images (cached 1 day). Uses Laravel cache when configured; falls back to file cache otherwise.
     *
     * @return array [ ['url' => string, 'type' => string], ... ]
     */
    public function getCustomImages(): array
    {
        $result = CacheHelper::rememberWithFileFallback(
            self::CACHE_KEY_CUSTOM_IMAGES,
            self::CACHE_TTL_SECONDS,
            fn () => $this->getCustomImagesUncached()
        );
        return is_array($result) ? $result : [];
    }

    /**
     * Build custom images list in chunks of 100 for better memory when data is large.
     *
     * @return array [ ['url' => string, 'type' => string], ... ]
     */
    protected function getCustomImagesUncached(): array
    {
        $images = [];
        $seenUrls = [];

        SettingItem::whereNotNull('image')
            ->where('image', '!=', '')
            ->withTrashed()
            ->select(['image', 'type'])
            ->chunk(self::CHUNK_SIZE, function ($settingItems) use (&$images, &$seenUrls) {
                foreach ($settingItems as $item) {
                    if (empty($item->image)) {
                        continue;
                    }
                    $url = BaseModelResponse::getImageFullUrl($item->image);
                    if (isset($seenUrls[$url])) {
                        continue;
                    }
                    $seenUrls[$url] = true;
                    $images[] = [
                        'url' => $url,
                        'type' => $item->type,
                    ];
                }
            });

        return $images;
    }
}
