<?php

namespace Kennofizet\RewardPlay\Models\User;

use Kennofizet\RewardPlay\Models\User;
use Kennofizet\RewardPlay\Models\UserBagItem;
use Kennofizet\RewardPlay\Models\UserEventTransaction;
use Kennofizet\RewardPlay\Models\UserProfile;
use Kennofizet\RewardPlay\Models\SettingLevelExp;
use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;
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
     * Get exp needed for user's current level
     * 
     * @return int
     */
    public function getExpNeed(): int
    {
        $profile = UserProfile::getOrCreateProfile($this->id);
        $currentLv = $profile->lv ?? 1;
        return SettingLevelExp::getExpForLevel($currentLv);
    }

    /**
     * Give exp to the user
     * 
     * @param int $expAmount - Amount of exp to give
     * @return UserProfile
     */
    public function giveExp(int $expAmount): UserProfile
    {
        $profile = UserProfile::getOrCreateProfile($this->id);
        return $profile->giveExp($expAmount);
    }

    /**
     * Give coin to the user
     * 
     * @param int $coinAmount - Amount of coin to give
     * @return UserProfile
     */
    public function giveCoin(int $coinAmount): UserProfile
    {
        $profile = UserProfile::getOrCreateProfile($this->id);
        return $profile->giveCoin($coinAmount);
    }

    /**
     * Get user's level from profile
     * 
     * @return int
     */
    public function getLevel(): int
    {
        $profile = UserProfile::getOrCreateProfile($this->id);
        return $profile->lv ?? 1;
    }

    /**
     * Get user's current exp from profile
     * 
     * @return int
     */
    public function getExp(): int
    {
        $profile = UserProfile::getOrCreateProfile($this->id);
        return $profile->current_exp ?? 0;
    }

    /**
     * Get user's worn gears
     * 
     * @return array
     */
    public function getGears(): array
    {
        $profile = UserProfile::getOrCreateProfile($this->id);
        return $profile->gears ?? [];
    }

    /**
     * Save/update user's worn gears
     * 
     * @param array $gears - Array of gear items with slot keys
     * @return UserProfile
     */
    public function saveGears(array $gears): UserProfile
    {
        $profile = UserProfile::getOrCreateProfile($this->id);
        $profile->gears = $gears;
        $profile->save();
        
        return $profile->fresh();
    }

    /**
     * Calculate total power from all worn gears
     * Power is calculated from properties.stats.power of all gears
     * 
     * @return int
     */
    public function getPower(): int
    {
        $gears = $this->getGears();
        $totalPower = 0;

        foreach ($gears as $slot => $gear) {
            if (!is_array($gear) || !isset($gear['properties'])) {
                continue;
            }

            $properties = $gear['properties'];
            if (isset($properties['stats']) && is_array($properties['stats'])) {
                $stats = $properties['stats'];
                if (isset($stats[HelperConstant::POWER_KEY])) {
                    $totalPower += (int)$stats[HelperConstant::POWER_KEY];
                }
            }
        }

        return $totalPower;
    }

    /**
     * Calculate total stats from all worn gears
     * Aggregates all stats from properties.stats and properties.custom_options[].properties of all gears
     * 
     * @return array
     */
    public function getStats(): array
    {
        $gears = $this->getGears();
        $totalStats = [];

        foreach ($gears as $slot => $gear) {
            if (!is_array($gear) || !isset($gear['properties'])) {
                continue;
            }

            $properties = $gear['properties'];
            
            // Add stats from properties.stats
            if (isset($properties['stats']) && is_array($properties['stats'])) {
                foreach ($properties['stats'] as $statKey => $statValue) {
                    if (!isset($totalStats[$statKey])) {
                        $totalStats[$statKey] = 0;
                    }
                    $totalStats[$statKey] += (int)$statValue;
                }
            }

            // Add stats from properties.custom_options[].properties
            if (isset($properties['custom_options'])) {
                $customOptions = $properties['custom_options'];
                // Handle both array and single object
                $customOptionsArray = is_array($customOptions) && isset($customOptions[0]) 
                    ? $customOptions 
                    : [$customOptions];
                
                foreach ($customOptionsArray as $customOption) {
                    if (is_array($customOption) && isset($customOption['properties']) && is_array($customOption['properties'])) {
                        foreach ($customOption['properties'] as $statKey => $statValue) {
                            if (!isset($totalStats[$statKey])) {
                                $totalStats[$statKey] = 0;
                            }
                            $totalStats[$statKey] += (int)$statValue;
                        }
                    }
                }
            }
        }

        return $totalStats;
    }
}