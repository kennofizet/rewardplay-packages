<?php

namespace Kennofizet\RewardPlay\Models\UserDailyStatus;

use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;
use Kennofizet\RewardPlay\Models\UserDailyStatus\UserDailyStatusConstant;

class UserDailyStatusRelationshipSetting
{
    protected static $settings = [
        UserDailyStatusConstant::API_USER_DAILY_STATUS_LIST_PAGE => [
        ],
        HelperConstant::REPONSE_MODE_SELECTER_API => [
        ]
    ];

    protected static $countSettings = [
        
    ];

    public static function getRelationships(?string $mode = null): array
    {
        return self::$settings[$mode] ?? [];
    }

    public static function getCountSettings(?string $mode = null): array
    {
        return self::$countSettings[$mode] ?? [];
    }

    public static function buildWithCountArray(?string $mode = null, $userDailyStatus = null): array
    {
        $mode = $mode ?? UserDailyStatusModelResponse::getAvailableModeDefault();
        $configs = self::getCountSettings($mode);
        
        $withCountArray = [];

        foreach ($configs as $alias => $config) {
            if (is_string($alias)) {
                $relationship = str_replace(' as ' . $config, '', $alias);
                $withCountArray[$alias] = $relationship;
            } else {
                $withCountArray[] = $config;
            }
        }

        return $withCountArray;
    }

    public static function buildWithArray(?string $mode = null): array
    {
        $mode = $mode ?? UserDailyStatusModelResponse::getAvailableModeDefault();
        $relationships = self::getRelationships($mode);

        $withArray = [];

        foreach ($relationships as $key => $value) {
            if (is_string($key)) {
                $config = is_array($value) ? $value : [];
                $relationship = $key;
                
                if (!empty($config['with'])) {
                    $withArray[$relationship] = function ($query) use ($config) {
                        if (isset($config['with'])) {
                            $query->with($config['with']);
                        }
                    };
                } else {
                    $withArray[] = $relationship;
                    if (isset($config['limit'])) {
                        $withArray[$relationship] = function ($query) use ($config) {
                            $query->limit($config['limit']);
                        };
                    }
                }
            } else {
                $withArray[] = $value;
            }
        }

        return $withArray;
    }
}
