<?php

namespace Kennofizet\RewardPlay\Traits;

use Kennofizet\RewardPlay\Traits\SettingRewardPlay\ZoneTrait;
use Kennofizet\RewardPlay\Traits\SettingRewardPlay\ServerManagerTrait;

/**
 * SettingRewardPlay
 * Facade trait that exposes zone and server manager helpers.
 */
trait SettingRewardPlay
{
    use ZoneTrait, ServerManagerTrait;
}

