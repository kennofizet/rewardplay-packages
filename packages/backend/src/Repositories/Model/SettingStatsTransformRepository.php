<?php

namespace Kennofizet\RewardPlay\Repositories\Model;

use Kennofizet\RewardPlay\Models\SettingStatsTransform;

class SettingStatsTransformRepository
{
    /**
     * Create a new setting stats transform
     * 
     * @param array $data
     * @return SettingStatsTransform
     */
    public function create(array $data): SettingStatsTransform
    {
        return SettingStatsTransform::create([
            'target_key' => $data['target_key'],
            'conversions' => $data['conversions'] ?? [],
        ]);
    }

    /**
     * Update a setting stats transform
     * 
     * @param SettingStatsTransform $settingStatsTransform
     * @param array $data
     * @return SettingStatsTransform
     */
    public function update(SettingStatsTransform $settingStatsTransform, array $data): SettingStatsTransform
    {
        $updateData = [];
        
        if (isset($data['target_key'])) {
            $updateData['target_key'] = $data['target_key'];
        }
        if (isset($data['conversions'])) {
            $updateData['conversions'] = $data['conversions'];
        }

        $settingStatsTransform->update($updateData);

        return $settingStatsTransform;
    }

    /**
     * Delete a setting stats transform
     * 
     * @param SettingStatsTransform $settingStatsTransform
     * @return bool
     */
    public function delete(SettingStatsTransform $settingStatsTransform): bool
    {
        return (bool) $settingStatsTransform->delete();
    }
}
