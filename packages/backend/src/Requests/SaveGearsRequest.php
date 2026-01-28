<?php

namespace Kennofizet\RewardPlay\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Kennofizet\RewardPlay\Models\UserProfile\UserProfileConstant;

class SaveGearsRequest extends FormRequest
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
            'gears' => 'required|array',
            'gears.*' => 'required|integer', // Each value should be a UserBagItem ID
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $gears = $this->input('gears', []);
            $allSlots = UserProfileConstant::getAllGearSlots();
            $validSlotKeys = array_column($allSlots, 'key');

            // Validate that all keys in gears array are valid slot keys
            foreach ($gears as $slotKey => $userBagItemId) {
                if (!in_array($slotKey, $validSlotKeys)) {
                    $validator->errors()->add(
                        "gears.{$slotKey}",
                        "Invalid slot key: {$slotKey}"
                    );
                }
            }
        });
    }
}
