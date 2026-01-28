<?php

namespace Kennofizet\RewardPlay\Helpers;

class Constant
{
    const STATUS_ON = 1;
    const STATUS_OFF = 0;

    const ZONE_ID_COLUMN = 'zone_id';
    const SERVER_ID_COLUMN = 'server_id';
    const IS_DELETED_STATUS_COLUMN = 'is_deleted_status';
    const STATUS_COLUMN = 'status';

    const REPONSE_MODE_SELECTER_API = 'api.selecter';

    const PER_PAGE_DEFAULT = 15;

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

    /**
     * Available conversion keys for rates (mapping key => display name)
     */
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

    /**
     * Conversion keys that can accept conversions from other stats
     * These are the target stats that can receive converted values
     */
    const CONVERSION_KEYS_ACCEPT_CONVERT = [
        self::POWER_KEY => 'Power',
        self::CV_KEY => 'CV'
    ];

    // Reward Types
    const TYPE_COIN = 'coin';
    const TYPE_EXP = 'exp';
    const TYPE_GEAR = 'gear'; // gear is a setting item
    const TYPE_TICKET = 'ticket'; // potentially mentioned later or good practice

    const REWARD_TYPES = [
        self::TYPE_COIN => 'Coin',
        self::TYPE_EXP => 'Exp',
        self::TYPE_GEAR => 'Gear',
        self::TYPE_TICKET => 'Ticket',
    ];

    // Level Exp Defaults
    const DEFAULT_EXP_NEEDED = 100; // Default exp needed to level up if no setting found
}