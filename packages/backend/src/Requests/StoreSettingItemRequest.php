<?php

namespace Kennofizet\RewardPlay\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Kennofizet\RewardPlay\Models\SettingItem\SettingItemConstant;

class StoreSettingItemRequest extends FormRequest
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
        $tablePrefix = config('rewardplay.table_prefix', '');
        $zonesTableName = $tablePrefix . 'rewardplay_zones';
        
        $itemTypes = array_keys(SettingItemConstant::ITEM_TYPE_NAMES);
        $allowedTypesString = implode(',', $itemTypes);

        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|string|in:' . $allowedTypesString,
            'default_property' => 'nullable|json',
            'zone_id' => 'nullable|integer|exists:' . $zonesTableName . ',id',
            'image' => 'nullable|file|image|max:2048',
        ];
    }
}
