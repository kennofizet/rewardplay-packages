<?php

namespace Kennofizet\RewardPlay\Helpers;

use Kennofizet\PackagesCore\Helpers\Constant as CoreConstant;

/**
 * RewardPlay Constants
 *
 * Core infrastructure constants (STATUS_ON, STATUS_OFF, ZONE_ID_COLUMN, etc.)
 * have moved to Kennofizet\PackagesCore\Helpers\Constant.
 *
 * For backwards compatibility, proxy constants are declared below so existing
 * code using `HelperConstant::STATUS_ON` continues to work without changes.
 */
class Constant
{
    // ── Proxied from packages-core ──────────────────────────────────────────
    const STATUS_ON = CoreConstant::STATUS_ON;
    const STATUS_OFF = CoreConstant::STATUS_OFF;

    const ZONE_ID_COLUMN = CoreConstant::ZONE_ID_COLUMN;
    const SERVER_ID_COLUMN = CoreConstant::SERVER_ID_COLUMN;
    const IS_DELETED_STATUS_COLUMN = CoreConstant::IS_DELETED_STATUS_COLUMN;
    const STATUS_COLUMN = CoreConstant::STATUS_COLUMN;

    const REPONSE_MODE_SELECTER_API = CoreConstant::REPONSE_MODE_SELECTER_API;

    const PER_PAGE_DEFAULT = CoreConstant::PER_PAGE_DEFAULT;

    // ── RewardPlay-specific ─────────────────────────────────────────────────

    // Conversion Keys for Property Stats
    const POWER_KEY = 'power';
    const CV_KEY = 'cv';
    const CRIT_KEY = 'crit';
    const CRIT_DMG_KEY = 'crit_dmg';
    const DEFENSE_KEY = 'defense';
    const HP_KEY = 'hp';
    const MP_KEY = 'mp';
    const ATTACK_KEY = 'attack';
    const SPEED_KEY = 'speed';
    const ACCURACY_KEY = 'accuracy';
    const DODGE_KEY = 'dodge';
    const RESISTANCE_KEY = 'resistance';

    const CONVERSION_KEYS = [
        self::POWER_KEY => 'Power',
        self::CV_KEY => 'CV',
        self::CRIT_KEY => 'Crit',
        self::CRIT_DMG_KEY => 'Crit Damage',
        self::DEFENSE_KEY => 'Defense',
        self::HP_KEY => 'HP',
        self::MP_KEY => 'MP',
        self::ATTACK_KEY => 'Attack',
        self::SPEED_KEY => 'Speed',
        self::ACCURACY_KEY => 'Accuracy',
        self::DODGE_KEY => 'Dodge',
        self::RESISTANCE_KEY => 'Resistance',
    ];

    const CONVERSION_KEYS_ACCEPT_CONVERT = [
        self::POWER_KEY => 'Power',
        self::CV_KEY => 'CV',
    ];

    // Reward Types
    const TYPE_COIN = 'coin';
    const TYPE_EXP = 'exp';
    const TYPE_RUBY = 'ruby';
    const TYPE_GEAR = 'gear';
    const TYPE_TICKET = 'ticket';

    const REWARD_TYPES = [
        self::TYPE_COIN => 'Coin',
        self::TYPE_EXP => 'Exp',
        self::TYPE_RUBY => 'Ruby',
        self::TYPE_GEAR => 'Gear',
    ];

    public static function isRewardCoin(?string $type): bool
    {
        return $type === self::TYPE_COIN;
    }

    public static function isRewardExp(?string $type): bool
    {
        return $type === self::TYPE_EXP;
    }

    public static function isRewardRuby(?string $type): bool
    {
        return $type === self::TYPE_RUBY;
    }

    public static function isRewardGear(?string $type): bool
    {
        return $type === self::TYPE_GEAR;
    }

    // Level Exp Defaults
    const DEFAULT_EXP_NEEDED = 100;
}