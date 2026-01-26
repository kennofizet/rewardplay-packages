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

        $validatorStats = $this->statsCustomCheck($data['default_property']);

        if(!$validatorStats['success']){
            $validator->errors()->add('default_property', $validatorStats['message']);
        }
    }
}

