<?php

namespace Kennofizet\RewardPlay\Models\SettingStatsTransform;

use Kennofizet\RewardPlay\Models\SettingStatsTransform;
use Kennofizet\RewardPlay\Core\Model\BaseModelActions;

trait SettingStatsTransformActions
{
    /**
     * Find setting stats transform by ID
     * 
     * @param int $id
     * @return SettingStatsTransform|null
     */
    public static function findById(int $id): ?SettingStatsTransform
    {
        return SettingStatsTransform::find($id);
    }
}
