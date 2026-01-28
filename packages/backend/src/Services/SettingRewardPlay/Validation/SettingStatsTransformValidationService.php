<?php

namespace Kennofizet\RewardPlay\Services\SettingRewardPlay\Validation;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;

class SettingStatsTransformValidationService
{
    /**
     * Validate create / update setting stats transform data.
     * Permission checks are handled by middleware.
     *
     * @param array $data
     * @param int|null $id
     * @throws ValidationException
     */
    public function validateSettingStatsTransform(array $data, ?int $id = null)
    {
        $allowedTargetKeys = array_keys(HelperConstant::CONVERSION_KEYS_ACCEPT_CONVERT);
        $allowedSourceKeys = array_keys(HelperConstant::CONVERSION_KEYS);
        $allowedSourceKeys = array_diff($allowedSourceKeys, $allowedTargetKeys);
        
        $rules = [
            'target_key' => 'required|string|in:' . implode(',', $allowedTargetKeys),
            'conversions' => 'required|array|min:1',
            'conversions.*.source_key' => 'required|string|in:' . implode(',', $allowedSourceKeys),
            'conversions.*.conversion_value' => 'required|numeric|min:0',
            'zone_id' => 'nullable|integer|exists:' . (new \Kennofizet\RewardPlay\Models\Zone())->getTable() . ',id',
        ];

        $validator = Validator::make($data, $rules);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        // Additional validation: source_keys should not contain target_key
        if (isset($data['target_key']) && isset($data['conversions']) && is_array($data['conversions'])) {
            foreach ($data['conversions'] as $index => $conversion) {
                if (isset($conversion['source_key']) && $conversion['source_key'] === $data['target_key']) {
                    $validator = Validator::make([], []);
                    $validator->errors()->add("conversions.{$index}.source_key", 'Source key cannot be the same as target key');
                    throw new ValidationException($validator);
                }
            }
        }
    }
}
