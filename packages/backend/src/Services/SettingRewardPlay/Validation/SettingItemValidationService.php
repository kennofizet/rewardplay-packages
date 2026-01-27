<?php

namespace Kennofizet\RewardPlay\Services\SettingRewardPlay\Validation;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Kennofizet\RewardPlay\Models\SettingItem\SettingItemConstant;
use Kennofizet\RewardPlay\Services\SettingRewardPlay\Validation\Traits\StatsCustomCheckTrait;

class SettingItemValidationService
{
    use StatsCustomCheckTrait;
    /**
     * Validate create / update setting item data.
     * Permission checks are handled by middleware.
     *
     * @param array $data
     * @param \Illuminate\Http\UploadedFile|null $imageFile
     * @param int|null $id
     * @throws ValidationException
     */
    public function validateSettingItem(array $data, ?\Illuminate\Http\UploadedFile $imageFile = null, ?int $id = null)
    {
        // Get allowed types (item types)
        $itemTypes = array_keys(SettingItemConstant::ITEM_TYPE_NAMES);
        $allowedTypesString = implode(',', $itemTypes);

        $rules = [
            'name' => $id ? 'sometimes|required|string|max:255' : 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => $id ? 'sometimes|required|string|in:' . $allowedTypesString : 'required|string|in:' . $allowedTypesString,
        ];

        // Add image validation if file is provided
        if ($imageFile) {
            $rules['image'] = 'file|image|max:2048'; // Max 2MB
            $data['image'] = $imageFile;
        }

        // \Log::info('data: ' . json_encode($data));

        $validator = Validator::make($data, $rules);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        // Validate default_property
        $defaultProperty = $data['default_property'] ?? [];
        $validatorStats = $this->statsCustomCheck($defaultProperty, false); // false = don't allow custom_key_*

        if(!$validatorStats['success']){
            $validator->errors()->add('default_property', $validatorStats['message']);
        }

        // Validate custom_stats format: array of {name: string, properties: object}
        if (isset($data['custom_stats'])) {
            $customStats = $data['custom_stats'];
            if (!is_array($customStats)) {
                $validator->errors()->add('custom_stats', 'Custom stats must be an array');
            } else {
                foreach ($customStats as $index => $customStat) {
                    if (!is_array($customStat)) {
                        $validator->errors()->add("custom_stats.{$index}", "Custom stat at index {$index} must be an object");
                        continue;
                    }
                    if (empty($customStat['name']) || !is_string($customStat['name'])) {
                        $validator->errors()->add("custom_stats.{$index}.name", "Custom stat at index {$index} must have a name");
                    }
                    if (empty($customStat['properties']) || !is_array($customStat['properties'])) {
                        $validator->errors()->add("custom_stats.{$index}.properties", "Custom stat at index {$index} must have properties object");
                    } else {
                        // Validate properties (rates) - should only contain CONVERSION_KEYS
                        $propertiesValidator = $this->statsCustomCheck($customStat['properties'], false);
                        if (!$propertiesValidator['success']) {
                            $validator->errors()->add("custom_stats.{$index}.properties", $propertiesValidator['message']);
                        }
                    }
                }
            }
        }
    }
}

