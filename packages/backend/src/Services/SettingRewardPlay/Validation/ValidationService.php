<?php

namespace Kennofizet\RewardPlay\Services\SettingRewardPlay\Validation;

use Illuminate\Validation\ValidationException;

/**
 * Marker/base validation service (placeholder if needed for DI).
 */
class ValidationService
{
    /**
     * Helper to rethrow validation exception in a consistent way.
     *
     * @throws ValidationException
     */
    protected function throwValidationException($validator)
    {
        throw new ValidationException($validator);
    }
}

