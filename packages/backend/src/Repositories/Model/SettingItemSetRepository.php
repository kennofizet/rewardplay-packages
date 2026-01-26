<?php

namespace Kennofizet\RewardPlay\Repositories\Model;

use Kennofizet\RewardPlay\Models\SettingItemSet;
use Kennofizet\RewardPlay\Models\SettingItem;

class SettingItemSetRepository
{
    /**
     * Create a new setting item set
     * 
     * @param array $data
     * @param array|null $itemIds
     * @return SettingItemSet
     */
    public function create(array $data, ?array $itemIds = null): SettingItemSet
    {
        $set = SettingItemSet::create([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'set_bonuses' => $data['set_bonuses'] ?? null
        ]);

        // Attach items if provided
        if ($itemIds && is_array($itemIds)) {
            $set->items()->sync($itemIds);
        }

        return $set;
    }

    /**
     * Update a setting item set
     * 
     * @param SettingItemSet $settingItemSet
     * @param array $data
     * @param array|null $itemIds
     * @return SettingItemSet
     */
    public function update(SettingItemSet $settingItemSet, array $data, ?array $itemIds = null): SettingItemSet
    {
        $updateData = [];
        
        if (isset($data['name'])) {
            $updateData['name'] = $data['name'];
        }
        if (isset($data['description'])) {
            $updateData['description'] = $data['description'];
        }
        if (isset($data['set_bonuses'])) {
            $updateData['set_bonuses'] = $data['set_bonuses'];
        }

        if (!empty($updateData)) {
            $settingItemSet->update($updateData);
        }

        // Sync items if provided
        if ($itemIds !== null && is_array($itemIds)) {
            $settingItemSet->items()->sync($itemIds);
        }

        return $settingItemSet;
    }

    /**
     * Delete a setting item set
     * 
     * @param SettingItemSet $settingItemSet
     * @return bool
     */
    public function delete(SettingItemSet $settingItemSet): bool
    {
        // Detach all items first (cascade will handle it, but explicit is better)
        $settingItemSet->items()->detach();
        
        return (bool) $settingItemSet->delete();
    }
}
