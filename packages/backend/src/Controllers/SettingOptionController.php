<?php

namespace Kennofizet\RewardPlay\Controllers;

use Kennofizet\RewardPlay\Controllers\Settings\SettingOptionController as SettingsSettingOptionController;

/**
 * Backwards-compat shim for SettingOptionController.
 * Real implementation lives in Settings sub-namespace.
 */
class SettingOptionController extends SettingsSettingOptionController
{
    // shim for backward compatibility
}
