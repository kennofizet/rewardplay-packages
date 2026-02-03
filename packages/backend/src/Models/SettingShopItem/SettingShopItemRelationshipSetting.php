<?php

namespace Kennofizet\RewardPlay\Models\SettingShopItem;

class SettingShopItemRelationshipSetting
{
    protected static array $settings = [
        SettingShopItemConstant::API_LIST_PAGE => [
            'settingItem',
        ],
    ];

    public static function getRelationships(?string $mode = null): array
    {
        return self::$settings[$mode] ?? [];
    }

    public static function buildWithArray(?string $mode = null): array
    {
        $mode = $mode ?? SettingShopItemConstant::API_LIST_PAGE;
        return self::getRelationships($mode);
    }
}
