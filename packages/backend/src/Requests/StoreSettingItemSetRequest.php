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
     * Prepare the data for validation.
     * Normalize JSON strings from FormData to arrays.
     */
    protected function prepareForValidation(): void
    {
        // Normalize custom_stats if it's a JSON string (from FormData)
        if ($this->has('custom_stats') && is_string($this->input('custom_stats'))) {
            $decoded = json_decode($this->input('custom_stats'), true);
            if (is_array($decoded)) {
                $this->merge(['custom_stats' => $decoded]);
            }
        }

        // Normalize set_bonuses if it's a JSON string (from FormData)
        if ($this->has('set_bonuses') && is_string($this->input('set_bonuses'))) {
            $decoded = json_decode($this->input('set_bonuses'), true);
            if (is_array($decoded)) {
                $this->merge(['set_bonuses' => $decoded]);
            }
        }
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
            'custom_stats' => 'nullable|array', // Detailed validation done in SettingItemSetValidationService
            'zone_id' => 'nullable|integer|exists:' . $zonesTableName . ',id',
            'item_ids' => 'nullable|array',
            'item_ids.*' => 'integer|exists:' . $itemsTableName . ',id',
        ];
    }
}
