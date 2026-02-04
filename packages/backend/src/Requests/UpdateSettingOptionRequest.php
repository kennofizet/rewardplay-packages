<?php

namespace Kennofizet\RewardPlay\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSettingOptionRequest extends FormRequest
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
            'name' => 'sometimes|required|string|max:255',
            'rates' => 'nullable|array',
            'zone_id' => 'nullable|integer|exists:' . (new \Kennofizet\RewardPlay\Models\Zone())->getTable() . ',id',
        ];
    }
}
