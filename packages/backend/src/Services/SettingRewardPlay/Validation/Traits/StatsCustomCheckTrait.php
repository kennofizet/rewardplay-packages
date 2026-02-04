<?php

namespace Kennofizet\RewardPlay\Services\SettingRewardPlay\Validation\Traits;

use Kennofizet\RewardPlay\Helpers\Constant as HelperConstant;
use Kennofizet\RewardPlay\Models\SettingOption;

trait StatsCustomCheckTrait
{
    /**
     * Validate stats for services
     * Stats default in CONVERSION_KEYS and custom stats group.
     *
     * @param array|null $stats
     * @param bool $allowCustomKeys Whether to allow custom_key_{id} format (for backward compatibility with set_bonuses)
     */
    public function statsCustomCheck(array $stats, bool $allowCustomKeys = true)
    {
         if (!is_array($stats)) {
            return [
                "success" => false,
                "message" => "Set property for stats must be an object/array"
            ];
        }

        $allowedKeys = array_keys(HelperConstant::CONVERSION_KEYS);
        
        // Validate stats inside each bonus (keys in CONVERSION_KEYS, values numeric)
        foreach ($stats as $statKey => $statValue) {
            $statKeyStr = trim((string)$statKey);
            $isCustom = str_starts_with($statKeyStr, 'custom_key_');

            // If custom keys are not allowed, reject them
            if ($isCustom && !$allowCustomKeys) {
                return [
                    "success" => false,
                    "message" => "Custom key format '{$statKey}' is not allowed. Use custom_stats array instead."
                ];
            }

            // For non-custom stats allow duplicates by suffixing (power_2)
            $baseKey = $isCustom ? $statKeyStr : preg_replace('/_\d+$/', '', $statKeyStr);

            if (!$isCustom && !in_array($baseKey, $allowedKeys)) {
                return [
                    "success" => false,
                    "message" => "Invalid stat key in '{$statKey}"
                ];
            }

            // Validate custom_key_{setting_option_id} (only if allowCustomKeys is true)
            if ($isCustom && $allowCustomKeys) {
                // Accept optional duplicate suffix: custom_key_{id} or custom_key_{id}_{n}
                if (!preg_match('/^custom_key_(\d+)(?:_\d+)?$/', $statKeyStr, $m)) {
                    return [
                        "success" => false,
                        "message" => "Invalid custom stat key in '{$statKey}"
                    ];
                }
                $customId = (int)$m[1];

                $settingOption = SettingOption::select('id')->find($customId);
                if (!$settingOption) {
                    return [
                        "success" => false,
                        "message" => "Custom stat not found for key in '{$statKey}"
                    ];
                }

                // In set_bonuses, custom_key_{id} value must be an object/array of rates
                if (!is_array($statValue)) {
                    return [
                        "success" => false,
                        "message" => "Value for '{$statKey}' must be an object/array of rates"
                    ];
                }

                foreach ($statValue as $rateKey => $rateValue) {
                    $rateBaseKey = preg_replace('/_\d+$/', '', (string)$rateKey);
                    if (!in_array($rateBaseKey, $allowedKeys)) {
                        return [
                            "success" => false,
                            "message" => "Custom stat {$statKey} has invalid rate key"
                        ];
                    }
                    if (!is_numeric($rateValue)) {
                        return [
                            "success" => false,
                            "message" => "Custom stat {$statKey} rate value for {$rateKey} must be numeric"
                        ];
                    }
                }

                // Custom stat is validated as an object; skip numeric check below
                continue;
            }
            if (!$isCustom && !is_numeric($statValue)) {
                return [
                    "success" => false,
                    "message" => "Value for {$statKey} must be numeric"
                ];
            }
        }

        return [
            "success" => true
        ];
    }
}
