<?php

namespace Kennofizet\RewardPlay\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSettingStackBonusRequest extends FormRequest
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
            'name' => 'nullable|string',
            'day' => 'sometimes|integer|min:1|max:7',
            'rewards' => 'nullable|array',
            'is_active' => 'sometimes|boolean',
        ];
    }
}
