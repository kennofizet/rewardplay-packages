<?php

namespace Kennofizet\RewardPlay\Requests;

use Illuminate\Foundation\Http\FormRequest;

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
        return [
            'date' => 'required|date',
            'items' => 'nullable|array',
            'stack_bonuses' => 'nullable|array',
            'is_epic' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
        ];
    }
}
