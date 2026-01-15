<?php

namespace Kennofizet\RewardPlay\Models\Zone;

use Kennofizet\RewardPlay\Models\Zone;

trait ZoneActions
{
    /**
     * Find zone by ID
     * 
     * @param int $id
     * @return Zone|null
     */
    public static function findById(int $id): ?Zone
    {
        return Zone::find($id);
    }

}

