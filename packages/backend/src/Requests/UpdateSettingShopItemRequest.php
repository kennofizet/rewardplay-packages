<?php

namespace Kennofizet\RewardPlay\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Kennofizet\RewardPlay\Models\SettingShopItem\SettingShopItemConstant;

class UpdateSettingShopItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $itemTable = (new \Kennofizet\RewardPlay\Models\SettingItem())->getTable();
        $eventTable = (new \Kennofizet\RewardPlay\Models\SettingEvent())->getTable();
        $categories = implode(',', [
            SettingShopItemConstant::CATEGORY_GEAR,
            SettingShopItemConstant::CATEGORY_TICKET,
            SettingShopItemConstant::CATEGORY_BOX_RANDOM,
        ]);
        $priceTypes = implode(',', [
            SettingShopItemConstant::PRICE_TYPE_COIN,
            SettingShopItemConstant::PRICE_TYPE_GEM,
            SettingShopItemConstant::PRICE_TYPE_RUBY,
            SettingShopItemConstant::PRICE_TYPE_GEAR,
            SettingShopItemConstant::PRICE_TYPE_ITEM,
        ]);

        return [
            'setting_item_id' => 'sometimes|integer|exists:' . $itemTable . ',id',
            'event_id' => 'nullable|integer|exists:' . $eventTable . ',id',
            'category' => 'sometimes|string|in:' . $categories,
            'prices' => 'nullable|array',
            'prices.*.type' => 'required_with:prices|string|in:' . $priceTypes,
            'prices.*.value' => 'nullable|numeric|min:0',
            'prices.*.item_id' => 'nullable|integer',
            'prices.*.quantity' => 'nullable|integer|min:1',
            'sort_order' => 'nullable|integer|min:0',
            'time_start' => 'nullable|date',
            'time_end' => 'nullable|date',
            'options' => 'nullable|array',
            'is_active' => 'sometimes|boolean',
        ];
    }
}
