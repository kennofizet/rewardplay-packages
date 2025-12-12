<?php

namespace Kennofizet\RewardPlay\Traits;

use Kennofizet\RewardPlay\Traits\SettingRewardPlay\ZoneTrait;
use Kennofizet\RewardPlay\Traits\SettingRewardPlay\ZoneManagerTrait;

/**
 * SettingRewardPlay
 * Facade trait that exposes zone and zone manager helpers.
 */
trait SettingRewardPlay
{
    use ZoneTrait, ZoneManagerTrait;
}

