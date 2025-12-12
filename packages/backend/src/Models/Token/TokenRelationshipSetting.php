<?php

namespace Kennofizet\RewardPlay\Models\Token;

use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;
use Kennofizet\RewardPlay\Models\Token\TokenConstant;

/**
 * Token Model Relationship Settings
 * 
 * This class manages which relationships to load based on query mode.
 * This prevents N+1 queries by eager loading relationships upfront.
 */
class TokenRelationshipSetting
{
    /**
     * Relationship settings by mode
     */
    protected static $settings = [
        TokenConstant::API_TOKEN_LIST_PAGE => [
        ],
        HelperConstant::REPONSE_MODE_SELECTER_API => [
        ]
    ];

    /**
     * Count settings for optimized performance
     */
    protected static $countSettings = [
        
    ];

    /**
     * Get allowed relationships for a specific mode
     */
    public static function getRelationships(?string $mode = null): array
    {
        return self::$settings[$mode] ?? [];
    }

    /**
     * Get task count settings for a specific mode
     */
    public static function getCountSettings(?string $mode = null): array
    {
        return self::$countSettings[$mode] ?? [];
    }

    /**
     * Build the withCount array for Eloquent queries
     */
    public static function buildWithCountArray(?string $mode = null, $token = null): array
    {
        $mode = $mode ?? TokenModelResponse::getAvailableModeDefault();
        $configs = self::getCountSettings($mode);
        
        $withCountArray = [];

        foreach ($configs as $alias => $config) {
            if (is_string($alias)) {
                // Relationship with alias
                $relationship = str_replace(' as ' . $config, '', $alias);
                $withCountArray[$alias] = $relationship;
            } else {
                // Simple relationship
                $withCountArray[] = $config;
            }
        }

        return $withCountArray;
    }

    /**
     * Build the with array for Eloquent queries
     */
    public static function buildWithArray(?string $mode = null): array
    {
        $mode = $mode ?? TokenModelResponse::getAvailableModeDefault();
        $relationships = self::getRelationships($mode);

        $withArray = [];

        foreach ($relationships as $key => $value) {
            if (is_string($key)) {
                // Relationship with configuration
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
                // Simple relationship
                $withArray[] = $value;
            }
        }

        return $withArray;
    }
}

