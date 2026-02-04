<?php

namespace Kennofizet\RewardPlay\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSettingStatsTransformRequest extends FormRequest
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
        $allowedTargetKeys = array_keys(\Kennofizet\RewardPlay\Helpers\Constant::CONVERSION_KEYS_ACCEPT_CONVERT);
        $allConversionKeys = array_keys(\Kennofizet\RewardPlay\Helpers\Constant::CONVERSION_KEYS);
        // Source keys are all conversion keys except target keys
        $allowedSourceKeys = array_diff($allConversionKeys, $allowedTargetKeys);

        return [
            'target_key' => 'required|string|in:' . implode(',', $allowedTargetKeys),
            'conversions' => 'required|array|min:1',
            'conversions.*.source_key' => 'required|string|in:' . implode(',', $allowedSourceKeys),
            'conversions.*.conversion_value' => 'required|numeric|min:0',
            // zone_id is automatically handled by BaseModel boot function
        ];
    }

    /**
     * Configure the validator instance.
     *
     * @param  \Illuminate\Validation\Validator  $validator
     * @return void
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $targetKey = $this->input('target_key');
            $conversions = $this->input('conversions', []);

            if ($targetKey && is_array($conversions)) {
                foreach ($conversions as $index => $conversion) {
                    if (isset($conversion['source_key']) && $conversion['source_key'] === $targetKey) {
                        $validator->errors()->add(
                            "conversions.{$index}.source_key",
                            'Source key cannot be the same as target key'
                        );
                    }
                }
            }
        });
    }
}
