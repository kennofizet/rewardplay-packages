<?php

namespace Kennofizet\RewardPlay\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OpenBoxRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_bag_item_id' => 'required|integer|min:1',
            'quantity' => 'sometimes|integer|min:1|max:99',
        ];
    }
}
