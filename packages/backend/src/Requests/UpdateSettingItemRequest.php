<?php

namespace Kennofizet\RewardPlay\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Kennofizet\RewardPlay\Models\SettingItem\SettingItemConstant;
use Kennofizet\RewardPlay\Models\Zone;

class UpdateSettingItemRequest extends FormRequest
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
        $zonesTableName = (new Zone())->getTable();
        
        $itemTypes = array_merge(
            array_keys(SettingItemConstant::ITEM_TYPE_NAMES),
            array_keys(SettingItemConstant::OTHER_ITEM_TYPE_NAMES)
        );
        $allowedTypesString = implode(',', $itemTypes);

        return [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'sometimes|required|string|in:' . $allowedTypesString,
            'default_property' => [
                'nullable',
                function ($attribute, $value, $fail) {
                    if ($value === null) {
                        return;
                    }
                    if (is_array($value)) {
                        return;
                    }
                    if (is_string($value)) {
                        json_decode($value);
                        if (json_last_error() !== JSON_ERROR_NONE) {
                            $fail('The default property field must be a valid JSON string or object.');
                        }
                        return;
                    }
                    $fail('The default property must be an array or a valid JSON string.');
                },
            ],
            'custom_stats' => 'nullable|json',
            'custom_stats.*.name' => 'required|string',
            'custom_stats.*.properties' => 'required|array',
            'zone_id' => 'nullable|integer|exists:' . $zonesTableName . ',id',
            'image' => 'nullable|file|image|max:2048'
        ];
    }
}
