<?php

namespace Kennofizet\RewardPlay\Controllers;

use Kennofizet\RewardPlay\Controllers\Settings\SettingItemSetController as SettingsSettingItemSetController;

/**
 * Backwards-compat shim for SettingItemSetController.
 * Real implementation lives in Settings sub-namespace.
 */
class SettingItemSetController extends SettingsSettingItemSetController
{
    // shim for backward compatibility
}
