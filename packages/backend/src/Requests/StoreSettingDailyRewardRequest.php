<?php

namespace Kennofizet\RewardPlay\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Kennofizet\RewardPlay\Helpers\Constant;

class StoreSettingDailyRewardRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization handled by middleware
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        // All reward types allowed for daily rewards
        $allowedTypes = array_keys(Constant::REWARD_TYPES);
        $allowedTypesString = implode(',', $allowedTypes);

        return [
            'date' => 'required|date',
            'items' => 'nullable|array',
            'items.*.type' => 'required|string|in:' . $allowedTypesString,
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.item_id' => 'nullable|integer',
            'stack_bonuses' => 'nullable|array',
            'is_epic' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $items = $this->input('items', []);
            foreach ($items as $index => $item) {
                if (isset($item['type']) && Constant::isRewardGear($item['type'])) {
                    if (empty($item['item_id'])) {
                        $validator->errors()->add("items.{$index}.item_id", 'The item_id field is required when type is item.');
                    }
                }
            }
        });
    }
}
