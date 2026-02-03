<?php

namespace Kennofizet\RewardPlay\Models\SettingEvent;

use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;

class SettingEventRelationshipSetting
{
    protected static array $settings = [
        SettingEventConstant::API_SETTING_EVENT_LIST_PAGE => [
            'items',
        ],
        HelperConstant::REPONSE_MODE_SELECTER_API => [],
    ];

    public static function getRelationships(?string $mode = null): array
    {
        return self::$settings[$mode] ?? [];
    }

    public static function buildWithArray(?string $mode = null): array
    {
        $mode = $mode ?? SettingEventModelResponse::getAvailableModeDefault();
        return self::getRelationships($mode);
    }
}
