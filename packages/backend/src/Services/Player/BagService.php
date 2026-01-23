<?php

namespace Kennofizet\RewardPlay\Services\Player;

use Kennofizet\RewardPlay\Models\UserBagItem;
use Kennofizet\RewardPlay\Models\SettingItem;

class BagService
{
    public function getUserBag(?int $userId = null)
    {
        $userBagItems = UserBagItem::getByUser($userId);

        if ($userBagItems->isEmpty()) {
            $this->syncDemoData($userId);
            $userBagItems = UserBagItem::getByUser($userId);
        }

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
            $itemType = $bagItem->item->type ?? 'bag';
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
        if (in_array($type, ['sword', 'weapon']))
            return 'sword';
        if (in_array($type, ['shop', 'premium']))
            return 'shop';
        if (in_array($type, ['other', 'material']))
            return 'other';
        return 'bag';
    }

    public function syncDemoData(?int $userId = null)
    {
        $activeSettingItems = SettingItem::getActiveItems();

        if ($activeSettingItems->isEmpty()) {
            return;
        }

        foreach ($activeSettingItems->take(5) as $settingItem) {
            UserBagItem::create([
                'user_id' => $userId,
                'item_id' => $settingItem->id,
                'quantity' => rand(1, 5),
                'properties' => ['durability' => 100],
                'acquired_at' => now(),
            ]);
        }
    }
}
