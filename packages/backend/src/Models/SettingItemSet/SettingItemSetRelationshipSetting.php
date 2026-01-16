<?php

namespace Kennofizet\RewardPlay\Models\SettingItemSet;

class SettingItemSetRelationshipSetting
{
    /**
     * Build array of relationships to eager load based on mode
     * 
     * @param string|null $mode
     * @return array
     */
    public static function buildWithArray(?string $mode = null): array
    {
        $with = ['zone', 'items'];

        return $with;
    }
}
