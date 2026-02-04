<?php

namespace Kennofizet\RewardPlay\Models\User;

use Kennofizet\RewardPlay\Models\User;
use Kennofizet\RewardPlay\Models\UserBagItem;
use Kennofizet\RewardPlay\Models\UserEventTransaction;
use Kennofizet\RewardPlay\Models\UserProfile;
use Kennofizet\RewardPlay\Models\SettingLevelExp;
use Kennofizet\RewardPlay\Models\SettingItemSet;
use Kennofizet\RewardPlay\Models\SettingItemSetItem;
use Kennofizet\RewardPlay\Models\UserProfile\UserProfileConstant;
use Kennofizet\RewardPlay\Services\Model\SettingStatsTransformService;
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
     * Give ruby to the user
     *
     * @param int $rubyAmount - Amount of ruby to give
     * @return UserProfile
     */
    public function giveRuby(int $rubyAmount): UserProfile
    {
        $profile = UserProfile::getOrCreateProfile($this->id);
        return $profile->giveRuby($rubyAmount);
    }

    /**
     * Deduct coin from the user. Throws if insufficient.
     *
     * @param int $coinAmount
     * @return UserProfile
     */
    public function deductCoin(int $coinAmount): UserProfile
    {
        $profile = UserProfile::getOrCreateProfile($this->id);
        return $profile->deductCoin($coinAmount);
    }

    /**
     * Deduct ruby from the user. Throws if insufficient.
     *
     * @param int $rubyAmount
     * @return UserProfile
     */
    public function deductRuby(int $rubyAmount): UserProfile
    {
        $profile = UserProfile::getOrCreateProfile($this->id);
        return $profile->deductRuby($rubyAmount);
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
     * Power is calculated from converted stats (using getStats which applies transforms)
     * 
     * @return int
     */
    public function getPower(): int
    {
        $stats = $this->getStats();
        
        // Get power from converted stats
        $totalPower = isset($stats[HelperConstant::POWER_KEY]) ? (int)$stats[HelperConstant::POWER_KEY] : 0;

        return $totalPower;
    }

    /**
     * Calculate total stats from all worn gears
     * Aggregates all stats from properties.stats and properties.custom_options[].properties of all gears
     * Applies stats transforms to convert source stats to target stats
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

        // Apply stats transforms        
        $transforms = app(SettingStatsTransformService::class)->getActiveTransforms();
        
        // Apply each transform
        foreach ($transforms as $transform) {
            $targetKey = $transform['target_key'];
            $conversions = $transform['conversions'] ?? [];
            
            if (empty($conversions) || !is_array($conversions)) {
                continue;
            }
            
            // Apply each conversion (each source_key has its own conversion_value)
            foreach ($conversions as $conversion) {
                $sourceKey = $conversion['source_key'] ?? null;
                $conversionValue = (float)($conversion['conversion_value'] ?? 0);
                
                if (!$sourceKey || !isset($totalStats[$sourceKey])) {
                    continue;
                }
                
                // Convert source stat to target stat
                $sourceValue = (float)$totalStats[$sourceKey];
                $convertedValue = $sourceValue * $conversionValue;
                
                if (!isset($totalStats[$targetKey])) {
                    $totalStats[$targetKey] = 0;
                }
                $totalStats[$targetKey] += $convertedValue;
            }
        }

        return $totalStats;
    }

    /**
     * Get current sets from worn gears
     * Returns array of sets with: set_id, item_count, current_bonus
     * 
     * @return array
     */
    public function getCurrentSets(): array
    {
        $gears = $this->getGears();
        $currentSets = [];

        // Extract all item_ids from gears
        $wornItemIds = [];
        foreach ($gears as $slot => $gear) {
            if (is_array($gear) && isset($gear['item_id'])) {
                $wornItemIds[] = (int)$gear['item_id'];
            }
        }

        if (empty($wornItemIds)) {
            return [];
        }

        // Get all sets that contain any of the worn items
        // Get unique set IDs first
        $setIds = SettingItemSetItem::whereIn('item_id', $wornItemIds)
            ->distinct()
            ->pluck('set_id')
            ->toArray();

        if (empty($setIds)) {
            return [];
        }

        // Get all sets with items relationship loaded
        $sets = SettingItemSet::whereIn('id', $setIds)
            ->with('items')
            ->get();

        // For each set, count how many items the user is wearing
        foreach ($sets as $set) {
            // Get item IDs in this set
            $setItemIds = $set->items->pluck('id')->toArray();
            
            // Count how many items from this set the user is wearing
            $itemCount = count(array_intersect($wornItemIds, $setItemIds));

            if ($itemCount === 0) {
                continue;
            }

            // Get total items in the set
            $totalItemsInSet = $set->items->count();

            // Collect all bonuses that are less than or equal to current item count
            $currentBonuses = [];
            $setBonuses = $set->set_bonuses ?? [];

            // Add bonuses for levels <= item_count
            foreach ($setBonuses as $level => $bonus) {
                if ($level === 'full') {
                    // Only include full bonus if user has all items
                    if ($itemCount >= $totalItemsInSet) {
                        $currentBonuses['full'] = $bonus;
                    }
                } else {
                    $levelInt = (int)$level;
                    if ($levelInt <= $itemCount) {
                        $currentBonuses[$level] = $bonus;
                    }
                }
            }

            $currentSets[] = [
                'set_id' => $set->id,
                'set_name' => $set->name ?? null,
                'item_count' => $itemCount,
                'total_items' => $totalItemsInSet,
                'current_bonus' => $currentBonuses,
            ];
        }

        return $currentSets;
    }

    /**
     * Get gears_sets mapping - which sets are active per individual slot
     * Returns array like: ['main-weapon-1' => [0, 1], 'special-item-1' => [1]]
     * where values are indices in current_sets array
     * 
     * @return array
     */
    public function getGearsSets(): array
    {
        $gears = $this->getGears();
        $currentSets = $this->getCurrentSets();
        $gearsSets = [];

        // Create a map of set_id to index in current_sets
        $setIdToIndex = [];
        foreach ($currentSets as $index => $set) {
            $setIdToIndex[$set['set_id']] = $index;
        }

        // Get all slot keys from gear config
        $allSlots = UserProfileConstant::getAllGearSlots();
        
        // For each individual slot, find which sets have items in that slot
        foreach ($allSlots as $slot) {
            $slotKey = $slot['key'];
            $slotSetIndices = [];
            
            // Get item_id from this specific slot
            if (isset($gears[$slotKey]) && is_array($gears[$slotKey]) && isset($gears[$slotKey]['item_id'])) {
                $itemId = (int)$gears[$slotKey]['item_id'];
                
                // Find which sets contain this item
                $setIds = SettingItemSetItem::where('item_id', $itemId)
                    ->distinct()
                    ->pluck('set_id')
                    ->toArray();
                
                // Map set IDs to indices in current_sets
                foreach ($setIds as $setId) {
                    if (isset($setIdToIndex[$setId])) {
                        $slotSetIndices[] = $setIdToIndex[$setId];
                    }
                }
            }
            
            // Remove duplicates and sort
            $slotSetIndices = array_unique($slotSetIndices);
            sort($slotSetIndices);
            
            $gearsSets[$slotKey] = array_values($slotSetIndices);
        }

        return $gearsSets;
    }
}