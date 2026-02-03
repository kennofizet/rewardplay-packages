<?php

namespace Kennofizet\RewardPlay\Models\UserProfile;

use Kennofizet\RewardPlay\Models\SettingItem\SettingItemConstant;

class UserProfileConstant
{
    const TABLE_NAME = 'user_profiles';
    
    /**
     * Gear wear slot configuration
     * Defines which item types can be worn in which slots
     */
    const GEAR_WEAR_CONFIG = [
        'main_weapons' => [
            ['key' => 'main-weapon-1', 'item_type' => 'sword', 'item_image_manifest' => 'sword'],
            ['key' => 'main-weapon-2', 'item_type' => 'sword', 'item_image_manifest' => 'sword'],
            ['key' => 'main-weapon-3', 'item_type' => 'hat', 'item_image_manifest' => 'hat'],
            ['key' => 'main-weapon-4', 'item_type' => 'shirt', 'item_image_manifest' => 'shirt'],
            ['key' => 'main-weapon-5', 'item_type' => 'trouser', 'item_image_manifest' => 'trouser'],
            ['key' => 'main-weapon-6', 'item_type' => 'shoe', 'item_image_manifest' => 'shoe'],
        ],
        'special_weapons' => [
            ['key' => 'special-weapon-1', 'item_type' => 'necklace', 'item_image_manifest' => 'necklace'],
            ['key' => 'special-weapon-2', 'item_type' => 'bracelet', 'item_image_manifest' => 'bracelet'],
            ['key' => 'special-weapon-3', 'item_type' => 'ring', 'item_image_manifest' => 'ring'],
            ['key' => 'special-weapon-4', 'item_type' => 'ring', 'item_image_manifest' => 'ring'],
        ],
        'special_items' => [
            ['key' => 'special-item-1', 'item_type' => 'clothes', 'item_image_manifest' => 'clothes'],
            ['key' => 'special-item-2', 'item_type' => 'wing', 'item_image_manifest' => 'wing'],
        ],
    ];
    
    /**
     * Get all gear wear slots as flat array
     * 
     * @return array
     */
    public static function getAllGearSlots(): array
    {
        $allSlots = [];
        foreach (self::GEAR_WEAR_CONFIG as $category => $slots) {
            $allSlots = array_merge($allSlots, $slots);
        }
        return $allSlots;
    }
    
    /**
     * Get slot config by key
     * 
     * @param string $slotKey
     * @return array|null
     */
    public static function getSlotByKey(string $slotKey): ?array
    {
        foreach (self::GEAR_WEAR_CONFIG as $category => $slots) {
            foreach ($slots as $slot) {
                if ($slot['key'] === $slotKey) {
                    return $slot;
                }
            }
        }
        return null;
    }
    
    /**
     * Check if item type can be worn in slot
     * 
     * @param string $slotKey
     * @param string $itemType - The item's item_type (should be 'gear')
     * @return bool
     */
    public static function canWearItemType(string $slotKey, string $itemType): bool
    {
        $slot = self::getSlotByKey($slotKey);
        if (!$slot) {
            return false;
        }
        
        // Item must be gear type to be worn
        return SettingItemConstant::isGear($itemType);
    }
}
