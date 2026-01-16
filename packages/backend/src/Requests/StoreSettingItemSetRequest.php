<?php

namespace Kennofizet\RewardPlay\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Kennofizet\RewardPlay\Models\Zone;
use Kennofizet\RewardPlay\Models\SettingItem;

class StoreSettingItemSetRequest extends FormRequest
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
        $itemsTableName = (new SettingItem())->getTable();

        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'set_bonuses' => 'nullable|array',
            'zone_id' => 'nullable|integer|exists:' . $zonesTableName . ',id',
            'item_ids' => 'nullable|array',
            'item_ids.*' => 'integer|exists:' . $itemsTableName . ',id',
        ];
    }
}
