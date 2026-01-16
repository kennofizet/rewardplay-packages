<?php

namespace Kennofizet\RewardPlay\Models\SettingItemSet;

use Kennofizet\RewardPlay\Models\SettingItemSet;
use Kennofizet\RewardPlay\Core\Model\BaseModelActions;

trait SettingItemSetActions
{
    /**
     * Find setting item set by ID
     * 
     * @param int $id
     * @return SettingItemSet|null
     */
    public static function findById(int $id): ?SettingItemSet
    {
        return SettingItemSet::find($id);
    }
}
