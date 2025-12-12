<?php

namespace Kennofizet\RewardPlay\Services\SettingRewardPlay\Validation;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class ZoneValidationService
{
    /**
     * Validate create / update zone data.
     *
     * @throws ValidationException
     */
    public function validateZone(array $data)
    {
        $validator = Validator::make($data, [
            'name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
    }
}

