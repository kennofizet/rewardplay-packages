<?php

namespace Kennofizet\RewardPlay\Services\SettingRewardPlay\Validation;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class ZoneManagerValidationService
{
    /**
     * Validate assign/remove manager payload.
     *
     * @throws ValidationException
     */
    public function validateAssign(array $data)
    {
        $validator = Validator::make($data, [
            'zone_id' => 'required|integer|exists:' . (config('rewardplay.table_prefix', '') . 'rewardplay_zones') . ',id',
            'user_id' => 'required|integer|exists:' . config('rewardplay.table_user', 'users') . ',id',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
    }
}

