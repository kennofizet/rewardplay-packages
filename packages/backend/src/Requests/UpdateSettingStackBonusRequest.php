<?php

namespace Kennofizet\RewardPlay\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Kennofizet\RewardPlay\Helpers\Constant;

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
        // Only coin and exp allowed for stack bonus
        $allowedTypes = [
            Constant::TYPE_COIN,
            Constant::TYPE_EXP,
        ];
        $allowedTypesString = implode(',', $allowedTypes);

        return [
            'name' => 'nullable|string',
            'day' => 'sometimes|integer|min:1|max:7',
            'rewards' => 'nullable|array',
            'rewards.*.type' => 'required|string|in:' . $allowedTypesString,
            'rewards.*.quantity' => 'required|integer|min:1',
            'is_active' => 'sometimes|boolean',
        ];
    }
}
