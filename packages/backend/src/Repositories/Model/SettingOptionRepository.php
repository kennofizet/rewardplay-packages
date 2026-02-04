<?php

namespace Kennofizet\RewardPlay\Repositories\Model;

use Kennofizet\RewardPlay\Models\SettingOption;

class SettingOptionRepository
{
    /**
     * Create a new setting option
     * 
     * @param array $data
     * @return SettingOption
     */
    public function create(array $data): SettingOption
    {
        return SettingOption::create([
            'name' => $data['name'],
            'rates' => $data['rates'] ?? null
        ]);
    }

    /**
     * Update a setting option
     * 
     * @param SettingOption $settingOption
     * @param array $data
     * @return SettingOption
     */
    public function update(SettingOption $settingOption, array $data): SettingOption
    {
        $updateData = [];
        
        if (isset($data['name'])) {
            $updateData['name'] = $data['name'];
        }
        if (isset($data['rates'])) {
            $updateData['rates'] = $data['rates'];
        }

        $settingOption->update($updateData);

        return $settingOption;
    }

    /**
     * Delete a setting option
     * 
     * @param SettingOption $settingOption
     * @return bool
     */
    public function delete(SettingOption $settingOption): bool
    {
        return (bool) $settingOption->delete();
    }
}
