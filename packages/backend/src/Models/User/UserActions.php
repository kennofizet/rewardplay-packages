<?php

namespace Kennofizet\RewardPlay\Models\User;

use Kennofizet\RewardPlay\Models\User;
use Kennofizet\RewardPlay\Models\UserBagItem;
use Kennofizet\RewardPlay\Models\UserEventTransaction;
use Kennofizet\RewardPlay\Models\UserProfile;
use Carbon\Carbon;

trait UserActions
{
    /**
     * Find user by ID
     * 
     * @param int $id
     * @return User|null
     */
    public static function findById(int $id): ?User
    {
        return User::byId($id)->first();
    }

    /**
     * Give an item to the user (create bag item or increment quantity if duplicate exists)
     * Checks for existing item with same user_id, item_id, item_type, and properties
     * If found, increments quantity instead of creating new record
     * 
     * @param array $data - Bag item data (item_id, item_type, quantity, properties, acquired_at)
     * @return UserBagItem
     */
    public function giveItem(array $data): UserBagItem
    {
        $itemId = $data['item_id'] ?? null;
        $itemType = $data['item_type'] ?? null;
        $properties = $data['properties'] ?? null;
        $quantity = $data['quantity'] ?? 1;

        // Create new item
        return UserBagItem::createBagItem([
            'user_id' => $this->id,
            'item_id' => $itemId,
            'item_type' => $itemType,
            'quantity' => $quantity,
            'properties' => $properties,
            'acquired_at' => $data['acquired_at'] ?? Carbon::now(),
        ]);
    }

    /**
     * Create a new user event transaction
     * 
     * @param array $data - Transaction data (zone_id, model_type, model_id, items)
     * @return UserEventTransaction
     */
    public function hasTransaction(array $data): UserEventTransaction
    {
        return UserEventTransaction::createTransaction([
            'user_id' => $this->id,
            'model_type' => $data['model_type'] ?? null,
            'model_id' => $data['model_id'] ?? null,
            'items' => $data['items'] ?? null,
        ]);
    }

    /**
     * Get user's coin amount from profile
     * 
     * @return int
     */
    public function getCoin(): int
    {
        $profile = UserProfile::getOrCreateProfile($this->id);
        return $profile->coin ?? 0;
    }

    /**
     * Get user's ruby amount from profile
     * 
     * @return int
     */
    public function getRuby(): int
    {
        $profile = UserProfile::getOrCreateProfile($this->id);
        return $profile->ruby ?? 0;
    }

    /**
     * Get user's box_coin amount
     * Currently returns 0, to be implemented later
     * 
     * @return int
     */
    public function getBoxCoin(): int
    {
        return 0;
    }

    /**
     * Get user's power
     * Currently returns 0, to be implemented later
     * 
     * @return int
     */
    public function getPower(): int
    {
        return 0;
    }
}