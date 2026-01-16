<?php

namespace Kennofizet\RewardPlay\Services\SettingRewardPlay\Validation;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;
use Kennofizet\RewardPlay\Models\Zone;
use Kennofizet\RewardPlay\Models\SettingItem;

class SettingItemSetValidationService
{
    /**
     * Validate create / update setting item set data.
     * Permission checks are handled by middleware.
     *
     * @param array $data
     * @param array|null $itemIds
     * @param int|null $id
     * @throws ValidationException
     */
    public function validateSettingItemSet(array $data, ?array $itemIds = null, ?int $id = null)
    {
        $zonesTableName = (new Zone())->getTable();
        $itemsTableName = (new SettingItem())->getTable();

        $rules = [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'set_bonuses' => 'nullable|array',
            'zone_id' => 'nullable|integer|exists:' . $zonesTableName . ',id',
            'item_ids' => 'nullable|array',
            'item_ids.*' => 'integer|exists:' . $itemsTableName . ',id',
        ];

        // Validate set_bonuses structure if provided
        if (isset($data['set_bonuses']) && is_array($data['set_bonuses'])) {
            // Allowed keys: 2, 3, 'full' (or numeric values)
            foreach ($data['set_bonuses'] as $key => $bonus) {
                if (!in_array($key, [2, 3, 'full', '2', '3']) && !is_numeric($key)) {
                    $validator = Validator::make([], []);
                    $validator->errors()->add('set_bonuses', "Invalid set bonus key: {$key}. Allowed: 2, 3, 'full'");
                    throw new ValidationException($validator);
                }
                if (!is_array($bonus)) {
                    $validator = Validator::make([], []);
                    $validator->errors()->add('set_bonuses', "Set bonus for {$key} must be an object/array");
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
