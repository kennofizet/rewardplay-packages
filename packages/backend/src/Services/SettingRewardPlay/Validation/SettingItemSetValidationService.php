<?php

namespace Kennofizet\RewardPlay\Services\SettingRewardPlay\Validation;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;
use Kennofizet\RewardPlay\Models\Zone;
use Kennofizet\RewardPlay\Models\SettingItem;
use Kennofizet\RewardPlay\Models\SettingOption;
use Kennofizet\RewardPlay\Services\SettingRewardPlay\Validation\Traits\StatsCustomCheckTrait;

class SettingItemSetValidationService
{
    use StatsCustomCheckTrait;
    
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
        $allowedKeys = array_keys(HelperConstant::CONVERSION_KEYS);

        $rules = [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'set_bonuses' => 'nullable|array',
            'zone_id' => 'nullable|integer|exists:' . $zonesTableName . ',id',
            'item_ids' => 'nullable|array',
            'item_ids.*' => 'integer|exists:' . $itemsTableName . ',id',
        ];

        $validator = Validator::make($data, $rules);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        // Extra validation: ensure all provided item_ids exist (count check)
        if (isset($data['item_ids']) && is_array($data['item_ids']) && !empty($data['item_ids'])) {
            $ids = array_values(array_unique(array_map('intval', $data['item_ids'])));
            $existingCount = SettingItem::query()->whereIn('id', $ids)->count();
            if ($existingCount < count($ids)) {
                $v = Validator::make([], []);
                $v->errors()->add('item_ids', 'One or more item_ids are invalid');
                throw new ValidationException($v);
            }
        }

        // Validate set_bonuses structure if provided
        if (isset($data['set_bonuses']) && is_array($data['set_bonuses'])) {
            // Get item count from item_ids if provided, otherwise use 0
            $itemCount = 0;
            if (isset($data['item_ids']) && is_array($data['item_ids'])) {
                $itemCount = count($data['item_ids']);
            } elseif ($itemIds !== null && is_array($itemIds)) {
                $itemCount = count($itemIds);
            } elseif ($id !== null) {
                // For updates, get current item count from database
                $settingItemSet = \Kennofizet\RewardPlay\Models\SettingItemSet::findById($id);
                if ($settingItemSet) {
                    $itemCount = $settingItemSet->items()->count();
                }
            }

            // Validate each bonus level
            foreach ($data['set_bonuses'] as $key => $bonus) {
                // Check if bonus value is an array
                if (!is_array($bonus)) {
                    $validator = Validator::make([], []);
                    $validator->errors()->add('set_bonuses', "Set bonus for '{$key}' must be an object/array");
                    throw new ValidationException($validator);
                }

                // Validate stats inside each bonus
                $validatorStats = $this->statsCustomCheck($bonus);

                if(!$validatorStats['success']){
                    $validator->errors()->add('set_bonuses', $validatorStats['message']);
                }

                // Validate bonus key
                if ($key === 'full') {
                    // 'full' is always allowed
                    continue;
                }

                // Convert key to integer for comparison
                $numericKey = is_numeric($key) ? (int)$key : null;
                
                if ($numericKey === null) {
                    $validator = Validator::make([], []);
                    $validator->errors()->add('set_bonuses', "Invalid set bonus key: '{$key}'. Must be numeric (1 to item count) or 'full'");
                    throw new ValidationException($validator);
                }

                // Check if key is within valid range (1 to item count)
                if ($itemCount > 0 && ($numericKey < 1 || $numericKey > $itemCount)) {
                    $validator = Validator::make([], []);
                    $validator->errors()->add('set_bonuses', "Invalid set bonus key: {$numericKey}. Must be between 1 and {$itemCount} (item count) or 'full'");
                    throw new ValidationException($validator);
                }

                // If no items selected, only 'full' is allowed
                if ($itemCount === 0 && $numericKey !== null) {
                    $validator = Validator::make([], []);
                    $validator->errors()->add('set_bonuses', "Cannot set bonus levels without items. Only 'full' bonus is allowed when no items are selected.");
                    throw new ValidationException($validator);
                }
            }
        }
    }
}
