<?php

namespace Kennofizet\RewardPlay\Models\UserBagItem;

use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;
use Kennofizet\RewardPlay\Models\UserBagItem\UserBagItemConstant;

class UserBagItemRelationshipSetting
{
    protected static $settings = [
        UserBagItemConstant::API_USER_BAG_ITEM_LIST_PAGE => [
            'item'
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

    public static function buildWithCountArray(?string $mode = null, $userBagItem = null): array
    {
        $mode = $mode ?? UserBagItemModelResponse::getAvailableModeDefault();
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
        $mode = $mode ?? UserBagItemModelResponse::getAvailableModeDefault();
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
