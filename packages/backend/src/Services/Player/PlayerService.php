<?php

namespace Kennofizet\RewardPlay\Services\Player;

use Kennofizet\RewardPlay\Core\Model\BaseModelResponse;
use Kennofizet\RewardPlay\Core\Model\BaseModelActions;
use Kennofizet\RewardPlay\Models\SettingItem;

class PlayerService
{
    /**
     * Return list of custom images accessible to current user (zones user is in current)
     *
     * @return array [ ['url' => string, 'type' => string], ... ]
     */
    public function getCustomImages(): array
    {
        $settingItems = SettingItem::whereNotNull('image')
            ->where('image', '!=', '')
            ->withTrashed()
            ->get();

        $images = [];
        foreach ($settingItems as $item) {
            $check_for_duplicate = false;
            foreach ($images as $image) {
                if ($image['url'] === BaseModelResponse::getImageFullUrl($item->image)) {
                    $check_for_duplicate = true;
                    break;
                }
            }
            if ($check_for_duplicate) {
                continue;
            }
            if (!empty($item->image)) {
                $images[] = [
                    'url' => BaseModelResponse::getImageFullUrl($item->image),
                    'type' => $item->type,
                ];
            }
        }

        return $images;
    }
}
