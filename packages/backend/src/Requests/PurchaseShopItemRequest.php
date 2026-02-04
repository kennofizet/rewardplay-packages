<?php

namespace Kennofizet\RewardPlay\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PurchaseShopItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'shop_item_id' => 'required|integer|min:1',
            'quantity' => 'sometimes|integer|min:1|max:999',
        ];
    }
}
