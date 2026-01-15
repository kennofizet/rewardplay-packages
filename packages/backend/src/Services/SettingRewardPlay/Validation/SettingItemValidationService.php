<?php

namespace Kennofizet\RewardPlay\Services\SettingRewardPlay\Validation;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Kennofizet\RewardPlay\Models\SettingItem\SettingItemConstant;

class SettingItemValidationService
{
    /**
     * Validate create / update setting item data.
     *
     * @throws ValidationException
     */
    /**
     * Validate create / update setting item data.
     *
     * @param array $data
     * @param \Illuminate\Http\UploadedFile|null $imageFile
     * @param int|null $id
     * @throws ValidationException
     */
    public function validateSettingItem(array $data, ?\Illuminate\Http\UploadedFile $imageFile = null, ?int $id = null)
    {
        $tablePrefix = config('rewardplay.table_prefix', '');
        $tableName = $tablePrefix . 'rewardplay_settings_items';

        // Get allowed types (item types)
        $itemTypes = array_keys(SettingItemConstant::ITEM_TYPE_NAMES);
        $allowedTypesString = implode(',', $itemTypes);

        $zonesTableName = $tablePrefix . 'rewardplay_zones';

        $rules = [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|string|in:' . $allowedTypesString,
            'default_property' => 'nullable|json',
            'zone_id' => 'nullable|integer|exists:' . $zonesTableName . ',id',
        ];

        // Add image validation if file is provided
        if ($imageFile) {
            $rules['image'] = 'file|image|max:2048'; // Max 2MB
            $data['image'] = $imageFile;
        }

        $validator = Validator::make($data, $rules);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
    }
}

