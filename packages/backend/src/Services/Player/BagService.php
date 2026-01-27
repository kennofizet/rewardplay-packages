<?php

namespace Kennofizet\RewardPlay\Services\Player;

use Kennofizet\RewardPlay\Models\UserBagItem;

class BagService
{
    public function getUserBag(?int $userId = null)
    {
        $userBagItems = UserBagItem::getByUser($userId);

        return $userBagItems;
    }

    public function getUserBagCategorized(?int $userId = null): array
    {
        $userBagItems = $this->getUserBag($userId);

        $categorizedBagItems = [
            'bag' => [],
            'sword' => [],
            'other' => [],
            'shop' => [],
        ];

        foreach ($userBagItems as $bagItem) {
            $itemType = $bagItem->item_type;
            $itemCategory = $this->mapTypeToCategory($itemType);

            if (isset($categorizedBagItems[$itemCategory])) {
                $categorizedBagItems[$itemCategory][] = $bagItem;
            } else {
                $categorizedBagItems['bag'][] = $bagItem;
            }
        }

        return $categorizedBagItems;
    }

    protected function mapTypeToCategory($type)
    {
        if (in_array($type, []))
            return 'sword';
        if (in_array($type, ['shop']))
            return 'shop';
        if (in_array($type, ['other', 'material']))
            return 'other';
        return 'bag';
    }
}
