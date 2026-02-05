<?php

namespace Kennofizet\RewardPlay\Services\SettingRewardPlay\Validation;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class ServerManagerValidationService
{
    /**
     * Validate assign manager data.
     * Permission checks are handled by middleware.
     *
     * @throws ValidationException
     */
    public function validateAssign(array $data)
    {
        $validator = Validator::make($data, [
            'user_id' => 'required|integer',
            'server_id' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
    }
}
