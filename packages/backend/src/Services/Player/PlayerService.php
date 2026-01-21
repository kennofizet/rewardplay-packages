<?php

namespace Kennofizet\RewardPlay\Services\Player;

use Kennofizet\RewardPlay\Core\Model\BaseModelResponse;
use Kennofizet\RewardPlay\Core\Model\BaseModelActions;
use Kennofizet\RewardPlay\Models\SettingItem;

class PlayerService
{
    /**
     * Return list of custom images accessible to current user (zones user is in or manages)
     *
     * @return array [ ['url' => string, 'type' => string], ... ]
     */
    public function getCustomImages(): array
    {
        // Get all zone IDs user is in OR manages
        $userZoneIds = BaseModelActions::currentUserZoneIds();
        $allZoneIds = array_values(array_unique($userZoneIds));

        if (empty($allZoneIds)) {
            return [];
        }

        $settingItems = SettingItem::whereIn('zone_id', $allZoneIds)
            ->whereNotNull('image')
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
