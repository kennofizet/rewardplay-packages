<?php

namespace Kennofizet\RewardPlay\Services\SettingRewardPlay\Validation;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class ServerManagerValidationService
{
    /**
     * Validate assign manager data.
     *
     * @throws ValidationException
     */
    public function validateAssign(array $data)
    {
        $validator = Validator::make($data, [
            'user_id' => 'required|integer',
            'server_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
    }
}
