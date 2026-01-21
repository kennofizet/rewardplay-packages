<?php

namespace Kennofizet\RewardPlay\Controllers;

use Kennofizet\RewardPlay\Controllers\Settings\SettingItemController as SettingsSettingItemController;

/**
 * Backwards-compat shim for SettingItemController.
 * The real implementation lives in the Settings sub-namespace.
 */
class SettingItemController extends SettingsSettingItemController
{
    // shim for backward compatibility
}

