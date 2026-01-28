<?php

namespace Kennofizet\RewardPlay\Models\UserBagItem;

use Kennofizet\RewardPlay\Models\UserBagItem;

trait UserBagItemActions
{
    public static function getByUser($userId)
    {
        return self::with('item')
            ->byUser($userId)
            ->get();
    }

    /**
     * Create a new user bag item or increment quantity if duplicate exists
     * Checks for existing item with same user_id, item_id, item_type, and properties
     * If found, increments quantity instead of creating new record
     * 
     * @param array $data - Bag item data (user_id, item_id, item_type, quantity, properties, acquired_at)
     * @return UserBagItem
     */
    public static function createBagItem(array $data): UserBagItem
    {
        $userId = $data['user_id'] ?? null;
        $itemId = $data['item_id'] ?? null;
        $itemType = $data['item_type'] ?? null;
        $properties = $data['properties'] ?? null;
        $quantity = $data['quantity'] ?? 1;

        if (!$userId || !$itemId) {
            throw new \InvalidArgumentException('user_id and item_id are required');
        }

        // Normalize properties for comparison (convert to JSON string for comparison)
        // Use JSON_SORT_KEYS (64) to ensure consistent ordering for comparison
        $jsonFlags = \JSON_UNESCAPED_UNICODE | \JSON_UNESCAPED_SLASHES | 64; // JSON_SORT_KEYS = 64
        $propertiesJson = $properties ? json_encode($properties, $jsonFlags) : null;

        // Check for existing item with same user_id, item_id, item_type, and properties
        // We need to compare JSON properties, so we'll fetch all matching items and compare in PHP
        $query = self::byUser($userId)
            ->byItemId($itemId)
            ->byItemType($itemType);

        // Get all candidates and compare properties in PHP (more reliable for JSON comparison)
        $candidates = $query->get();
        $existingItem = null;
        
        foreach ($candidates as $candidate) {
            $candidatePropertiesJson = $candidate->properties 
                ? json_encode($candidate->properties, $jsonFlags) 
                : null;
            
            if ($propertiesJson === $candidatePropertiesJson) {
                $existingItem = $candidate;
                break;
            }
        }

        if ($existingItem) {
            // Increment quantity instead of creating new record
            $existingItem->increment('quantity', $quantity);
            return $existingItem->fresh();
        }

        // Create new item using parent model's create method
        return UserBagItem::create([
            'user_id' => $userId,
            'item_id' => $itemId,
            'item_type' => $itemType,
            'quantity' => $quantity,
            'properties' => $properties,
            'acquired_at' => $data['acquired_at'] ?? now(),
        ]);
    }
}
