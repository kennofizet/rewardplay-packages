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
            ->get();

        $images = [];
        foreach ($settingItems as $item) {
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
