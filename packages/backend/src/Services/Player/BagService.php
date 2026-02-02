<?php

namespace Kennofizet\RewardPlay\Services\Player;

use Kennofizet\RewardPlay\Models\UserBagItem;
use Kennofizet\RewardPlay\Models\User;
use Kennofizet\RewardPlay\Models\UserProfile\UserProfileConstant;
use Kennofizet\RewardPlay\Models\UserBagItem\UserBagItemModelResponse;
use Kennofizet\RewardPlay\Models\UserBagItem\UserBagItemConstant;
use Illuminate\Validation\ValidationException;

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

    /**
     * Save/update user's worn gears
     * 
     * @param int $userId
     * @param array $gearMapping - Array mapping slotKey to userBagItemId: {slotKey: userBagItemId}
     * @return array - Returns updated gears, power, and stats
     * @throws ValidationException
     */
    public function saveGears(int $userId, array $gearMapping): array
    {
        $user = User::findById($userId);
        if (!$user) {
            throw ValidationException::withMessages([
                'user' => ['User not found']
            ]);
        }

        $allSlots = UserProfileConstant::getAllGearSlots();
        $validSlotKeys = array_column($allSlots, 'key');
        
        // Get existing gears and merge with new ones
        $existingGears = $user->getGears();
        $gears = $existingGears; // Start with existing gears
        
        foreach ($gearMapping as $slotKey => $userBagItemId) {
            // Check if slot key is valid
            if (!in_array($slotKey, $validSlotKeys)) {
                throw ValidationException::withMessages([
                    "gears.{$slotKey}" => ["Invalid slot key: {$slotKey}"]
                ]);
            }
            
            // If userBagItemId is null or 0, unwear: remove gear from slot and add 1 item back to bag
            if (empty($userBagItemId)) {
                $currentGear = $gears[$slotKey] ?? null;
                if ($currentGear && !empty($currentGear['item_id'])) {
                    // Add 1 item back to bag (giveItem: if found same item+properties will +=, else create new)
                    $user->giveItem([
                        'item_id' => $currentGear['item_id'],
                        'item_type' => $currentGear['item_type'] ?? 'gear',
                        'properties' => $currentGear['properties'] ?? [],
                        'quantity' => 1,
                    ]);
                }
                unset($gears[$slotKey]);
                continue;
            }
            
            // Wear: if slot already has an item, return it to bag first, then wear the new item
            $currentGear = $gears[$slotKey] ?? null;
            if ($currentGear && !empty($currentGear['item_id'])) {
                $user->giveItem([
                    'item_id' => $currentGear['item_id'],
                    'item_type' => $currentGear['item_type'] ?? 'gear',
                    'properties' => $currentGear['properties'] ?? [],
                    'quantity' => 1,
                ]);
            }
            
            // Fetch UserBagItem and verify it belongs to the user
            $userBagItem = UserBagItem::with('item')
                ->byId($userBagItemId)
                ->byUser($userId)
                ->first();
            
            if (!$userBagItem) {
                throw ValidationException::withMessages([
                    "gears.{$slotKey}" => ["UserBagItem not found or doesn't belong to user: {$userBagItemId}"]
                ]);
            }
            
            // Check item found and quantity >= 1 (can sub to 0)
            if ($userBagItem->quantity < 1) {
                throw ValidationException::withMessages([
                    "gears.{$slotKey}" => ["Item quantity must be at least 1 to wear"]
                ]);
            }
            
            // Verify item_type is 'gear'
            if ($userBagItem->item_type !== 'gear') {
                throw ValidationException::withMessages([
                    "gears.{$slotKey}" => ["Item type must be 'gear' for slot: {$slotKey}"]
                ]);
            }
            
            // Get slot config to check item type match
            $slotConfig = UserProfileConstant::getSlotByKey($slotKey);
            if (!$slotConfig) {
                throw ValidationException::withMessages([
                    "gears.{$slotKey}" => ["Invalid slot key: {$slotKey}"]
                ]);
            }
            
            // Verify item's actual type matches slot's required type
            if (!$userBagItem->item) {
                throw ValidationException::withMessages([
                    "gears.{$slotKey}" => ["Item not found for UserBagItem: {$userBagItemId}"]
                ]);
            }
            
            $itemActualType = $userBagItem->item->type ?? null;
            $slotRequiredType = $slotConfig['item_type'] ?? null;
            
            if ($itemActualType !== $slotRequiredType) {
                throw ValidationException::withMessages([
                    "gears.{$slotKey}" => [
                        "Item type '{$itemActualType}' does not match slot requirement '{$slotRequiredType}' for slot: {$slotKey}"
                    ]
                ]);
            }
            
            // Decrement bag: subtract 1 from this UserBagItem; if quantity becomes 0, remove from bag
            $userBagItem->decrement('quantity', 1);
            $userBagItem = $userBagItem->fresh();
            if ($userBagItem && $userBagItem->quantity <= 0) {
                $userBagItem->delete();
            }
            
            // Build gear data from database (protect against tampering)
            $gears[$slotKey] = [
                'item_id' => $userBagItem->item_id,
                'item_type' => $userBagItem->item_type,
                'properties' => $userBagItem->properties ?? [],
                'item' => $userBagItem->item ? [
                    'type' => $userBagItem->item->type,
                    'name' => $userBagItem->item->name,
                    'image' => UserBagItemModelResponse::getImageFullUrl($userBagItem->item->image),
                ] : null
            ];
        }

        $user->saveGears($gears);

        // Return updated user_bag so frontend can sync (wear: sub 1 / remove; unwear: += or add new)
        $categorized = $this->getUserBagCategorized($userId);
        $responseMode = UserBagItemConstant::PLAYER_API_RESPONSE_BAG_PAGE;
        $formattedCategorized = [];
        foreach ($categorized as $category => $items) {
            $formattedCategorized[$category] = UserBagItemModelResponse::formatUserBagItems($items, $responseMode);
        }

        return [
            'gears' => $user->getGears(),
            'power' => $user->getPower(),
            'stats' => $user->getStats(),
            'user_bag' => $formattedCategorized,
        ];
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
