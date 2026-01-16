<?php

namespace Kennofizet\RewardPlay\Models\SettingOption;

use Kennofizet\RewardPlay\Models\SettingOption;
use Kennofizet\RewardPlay\Core\Model\BaseModelActions;

trait SettingOptionActions
{
    /**
     * Find setting option by ID
     * 
     * @param int $id
     * @return SettingOption|null
     */
    public static function findById(int $id): ?SettingOption
    {
        return SettingOption::find($id);
    }
}
