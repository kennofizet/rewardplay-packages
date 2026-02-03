<?php

namespace Kennofizet\RewardPlay\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSettingEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $data = [];
        if (is_string($this->input('bonus'))) {
            $decoded = json_decode($this->input('bonus'), true);
            if (is_array($decoded)) {
                $data['bonus'] = $decoded;
            }
        }
        if (is_string($this->input('daily_reward_bonus'))) {
            $decoded = json_decode($this->input('daily_reward_bonus'), true);
            if (is_array($decoded)) {
                $data['daily_reward_bonus'] = $decoded;
            }
        }
        if (is_string($this->input('item_ids'))) {
            $decoded = json_decode($this->input('item_ids'), true);
            if (is_array($decoded)) {
                $data['item_ids'] = $decoded;
            }
        }
        if (!empty($data)) {
            $this->merge($data);
        }
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:255',
            'slug' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|file|image|max:2048',
            'time_start' => 'nullable|date',
            'time_end' => 'nullable|date',
            'bonus' => 'nullable|array',
            'bonus.*.label' => 'required_with:bonus|string',
            'bonus.*.value' => 'required_with:bonus|string',
            'daily_reward_bonus' => 'nullable|array',
            'daily_reward_bonus.*.day' => 'required_with:daily_reward_bonus|integer|min:1|max:31',
            'daily_reward_bonus.*.rewards' => 'nullable|array',
            'daily_reward_bonus.*.rewards.*.type' => 'required|string|in:coin,exp,item',
            'daily_reward_bonus.*.rewards.*.quantity' => 'required|integer|min:0',
            'daily_reward_bonus.*.rewards.*.item_id' => 'nullable|integer',
            'is_active' => 'sometimes|boolean',
            'item_ids' => 'nullable|array',
            'item_ids.*' => 'integer',
        ];
    }
}
