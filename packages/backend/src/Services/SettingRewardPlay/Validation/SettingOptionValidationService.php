<?php

namespace Kennofizet\RewardPlay\Services\SettingRewardPlay\Validation;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;

class SettingOptionValidationService
{
    /**
     * Validate create / update setting option data.
     * Permission checks are handled by middleware.
     *
     * @param array $data
     * @param int|null $id
     * @throws ValidationException
     */
    public function validateSettingOption(array $data, ?int $id = null)
    {
        $allowedKeys = array_keys(HelperConstant::CONVERSION_KEYS);

        $rules = [
            'name' => 'required|string|max:255',
            'rates' => 'nullable|array',
        ];

        // Validate rates structure if provided
        if (isset($data['rates']) && is_array($data['rates']) && !empty($data['rates'])) {
            foreach ($data['rates'] as $key => $value) {
                if (!in_array($key, $allowedKeys)) {
                    $validator = Validator::make([], []);
                    $validator->errors()->add('rates', "Invalid conversion key: {$key}");
                    throw new ValidationException($validator);
                }
                if (!is_numeric($value)) {
                    $validator = Validator::make([], []);
                    $validator->errors()->add('rates', "Rate value for {$key} must be numeric");
                    throw new ValidationException($validator);
                }
            }
        }

        $validator = Validator::make($data, $rules);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
    }
}
