// ==========================================
// ENEMY DEFINITIONS — MU Online Style Bestiary
// Backward-compatible ENEMIES export for maps.js
// ==========================================
import { TILES } from '../tiles';

// Enemy classes determine AI behavior
export const ENEMY_CLASS = {
    MELEE: 'melee',
    RANGED: 'ranged',
    TANK: 'tank',
    SWARM: 'swarm',
    ELITE: 'elite',
};

// ── ENEMIES dict (used by maps.js for spawning) ──
export const ENEMIES = {
    // === MAP 1: LORENCIA (Lv 1-10) ===
    SPIDER: {
        name: 'Spider', tileId: TILES.SPIDER, ai: 'chase', aggroRange: 3,
        stats: { hp: 30, maxHp: 30, attack: 4, defense: 1, speed: 130, expReward: 8 },
        skills: [{ name: 'Bite', damage: 3, cooldown: 2000, range: 1 }],
    },
    BUDGE_DRAGON: {
        name: 'Budge Dragon', tileId: TILES.DRAGON, ai: 'chase', aggroRange: 4,
        stats: { hp: 65, maxHp: 65, attack: 9, defense: 3, speed: 120, expReward: 16 },
        skills: [{ name: 'Dragon Claw', damage: 7, cooldown: 2200, range: 1 }],
    },
    HOUND: {
        name: 'Hound', tileId: TILES.WOLF, ai: 'chase', aggroRange: 5,
        stats: { hp: 40, maxHp: 40, attack: 8, defense: 2, speed: 150, expReward: 14 },
        skills: [{ name: 'Fang Bite', damage: 6, cooldown: 1800, range: 1 }],
    },
    BULL_FIGHTER: {
        name: 'Bull Fighter', tileId: TILES.ORC, ai: 'chase', aggroRange: 4,
        stats: { hp: 80, maxHp: 80, attack: 10, defense: 4, speed: 100, expReward: 18 },
        skills: [
            { name: 'Bull Charge', damage: 8, cooldown: 3000, range: 2 },
            { name: 'Kick', damage: 5, cooldown: 2000, range: 1 },
        ],
    },
    ELF_SCOUT: {
        name: 'Elf Scout', tileId: TILES.ELF, ai: 'chase', aggroRange: 5,
        stats: { hp: 50, maxHp: 50, attack: 7, defense: 2, speed: 140, expReward: 15 },
        skills: [{ name: 'Quick Shot', damage: 5, cooldown: 2000, range: 4, effect: 'projectile', color: '#8bc34a' }],
    },

    // === MAP 2: DUNGEON (Lv 10-25) ===
    SKELETON: {
        name: 'Skeleton', tileId: TILES.SKELETON, ai: 'chase', aggroRange: 5,
        stats: { hp: 120, maxHp: 120, attack: 15, defense: 8, speed: 90, expReward: 30 },
        skills: [{ name: 'Bone Slash', damage: 12, cooldown: 2000, range: 1.5 }],
    },
    LARVA: {
        name: 'Larva', tileId: TILES.SPIDER, ai: 'chase', aggroRange: 4,
        stats: { hp: 60, maxHp: 60, attack: 10, defense: 3, speed: 110, expReward: 20 },
        skills: [{ name: 'Acid Spit', damage: 8, cooldown: 2500, range: 2, effect: 'projectile', color: '#8bc34a' }],
    },
    LICH: {
        name: 'Lich', tileId: TILES.DARK_WIZARD, ai: 'chase', aggroRange: 7,
        stats: { hp: 100, maxHp: 100, attack: 25, defense: 6, speed: 70, expReward: 40 },
        skills: [
            { name: 'Soul Fire', damage: 20, cooldown: 2800, range: 5, effect: 'projectile', color: '#9c27b0' },
            { name: 'Dark Curse', damage: 8, cooldown: 5000, range: 4, effect: 'debuff', color: '#6a1b9a' },
        ],
    },
    HELL_SPIDER: {
        name: 'Hell Spider', tileId: TILES.SPIDER, ai: 'chase', aggroRange: 5,
        stats: { hp: 90, maxHp: 90, attack: 18, defense: 5, speed: 130, expReward: 28 },
        skills: [
            { name: 'Venom Bite', damage: 14, cooldown: 2000, range: 1 },
            { name: 'Web Shot', damage: 5, cooldown: 4000, range: 3, effect: 'debuff', color: '#cccccc' },
        ],
    },

    // === MAP 3: DEVIAS (Lv 20-35) ===
    YETI: {
        name: 'Yeti', tileId: TILES.GOLEM, ai: 'chase', aggroRange: 4,
        stats: { hp: 200, maxHp: 200, attack: 22, defense: 15, speed: 75, expReward: 45 },
        skills: [
            { name: 'Frost Slam', damage: 18, cooldown: 3000, range: 1.5 },
            { name: 'Ice Shield', damage: 0, cooldown: 8000, range: 0, effect: 'buff' },
        ],
    },
    ICE_ARCHER: {
        name: 'Ice Archer', tileId: TILES.ELF, ai: 'chase', aggroRange: 6,
        stats: { hp: 130, maxHp: 130, attack: 28, defense: 8, speed: 100, expReward: 38 },
        skills: [
            { name: 'Frost Arrow', damage: 22, cooldown: 2500, range: 5, effect: 'projectile', color: '#42a5f5' },
        ],
    },
    ICE_QUEEN: {
        name: 'Ice Queen', tileId: TILES.DARK_WIZARD, ai: 'chase', aggroRange: 7,
        stats: { hp: 160, maxHp: 160, attack: 30, defense: 10, speed: 80, expReward: 50 },
        skills: [
            { name: 'Blizzard', damage: 22, cooldown: 5000, range: 4, effect: 'aoe_circle', color: '#90caf9', aoeRadius: 3 },
            { name: 'Ice Lance', damage: 28, cooldown: 3000, range: 5, effect: 'projectile', color: '#e3f2fd' },
        ],
    },
    FROZEN_GOLEM: {
        name: 'Frozen Golem', tileId: TILES.GOLEM, ai: 'chase', aggroRange: 3,
        stats: { hp: 300, maxHp: 300, attack: 25, defense: 22, speed: 50, expReward: 55 },
        skills: [
            { name: 'Earthquake', damage: 20, cooldown: 5000, range: 2, effect: 'earthquake', color: '#455a64', aoeRadius: 3 },
            { name: 'Stone Fist', damage: 22, cooldown: 3000, range: 1.5 },
        ],
    },

    // === MAP 4: NORIA (Lv 25-40) ===
    GOBLIN: {
        name: 'Goblin', tileId: TILES.GOBLIN, ai: 'chase', aggroRange: 4,
        stats: { hp: 140, maxHp: 140, attack: 20, defense: 8, speed: 110, expReward: 35 },
        skills: [{ name: 'Goblin Slash', damage: 16, cooldown: 2500, range: 1 }],
    },
    CHAIN_SCORPION: {
        name: 'Chain Scorpion', tileId: TILES.SERPENT, ai: 'chase', aggroRange: 4,
        stats: { hp: 160, maxHp: 160, attack: 25, defense: 10, speed: 100, expReward: 40 },
        skills: [
            { name: 'Venom Sting', damage: 20, cooldown: 2500, range: 1.5 },
            { name: 'Tail Whip', damage: 15, cooldown: 2000, range: 2 },
        ],
    },
    ELITE_GOBLIN: {
        name: 'Elite Goblin', tileId: TILES.GOBLIN, ai: 'chase', aggroRange: 5,
        stats: { hp: 250, maxHp: 250, attack: 30, defense: 14, speed: 95, expReward: 55 },
        skills: [
            { name: 'Royal Slash', damage: 25, cooldown: 2500, range: 2 },
            { name: 'War Cry', damage: 0, cooldown: 8000, range: 4, effect: 'buff' },
        ],
    },
    FAIRY_ASSASSIN: {
        name: 'Fairy Assassin', tileId: TILES.ELF, ai: 'chase', aggroRange: 5,
        stats: { hp: 120, maxHp: 120, attack: 35, defense: 6, speed: 160, expReward: 48 },
        skills: [
            { name: 'Backstab', damage: 30, cooldown: 2500, range: 1 },
            { name: 'Shadow Step', damage: 0, cooldown: 6000, range: 0, effect: 'stealth' },
        ],
    },

    // === MAP 5: LOST TOWER (Lv 35-50) ===
    IRON_KNIGHT: {
        name: 'Iron Knight', tileId: TILES.UNDEAD_KNIGHT, ai: 'chase', aggroRange: 4,
        stats: { hp: 300, maxHp: 300, attack: 32, defense: 22, speed: 70, expReward: 65 },
        skills: [
            { name: 'Shield Bash', damage: 25, cooldown: 3500, range: 1.5 },
            { name: 'Death Swing', damage: 35, cooldown: 5000, range: 2, effect: 'aoe_front', color: '#37474f', aoeRadius: 2 },
        ],
    },
    SHADOW_PHANTOM: {
        name: 'Shadow Phantom', tileId: TILES.SHADOW, ai: 'chase', aggroRange: 5,
        stats: { hp: 200, maxHp: 200, attack: 38, defense: 8, speed: 150, expReward: 60 },
        skills: [
            { name: 'Phase Strike', damage: 32, cooldown: 2000, range: 2 },
            { name: 'Vanish', damage: 0, cooldown: 6000, range: 0, effect: 'stealth' },
        ],
    },
    CURSED_WIZARD: {
        name: 'Cursed Wizard', tileId: TILES.DARK_WIZARD, ai: 'chase', aggroRange: 7,
        stats: { hp: 180, maxHp: 180, attack: 40, defense: 10, speed: 80, expReward: 58 },
        skills: [
            { name: 'Dark Bolt', damage: 35, cooldown: 2500, range: 5, effect: 'projectile', color: '#6a1b9a' },
            { name: 'Soul Drain', damage: 20, cooldown: 5000, range: 4, effect: 'debuff', color: '#9c27b0' },
        ],
    },
    DEATH_KNIGHT: {
        name: 'Death Knight', tileId: TILES.UNDEAD_KNIGHT, ai: 'chase', aggroRange: 5,
        stats: { hp: 350, maxHp: 350, attack: 35, defense: 20, speed: 85, expReward: 70 },
        skills: [
            { name: 'Death Slash', damage: 30, cooldown: 2500, range: 2, effect: 'aoe_front', color: '#263238', aoeRadius: 2 },
            { name: 'Dark Charge', damage: 40, cooldown: 4000, range: 3 },
        ],
    },

    // === MAP 6: ATLANS (Lv 45-60) ===
    SEA_SERPENT: {
        name: 'Sea Serpent', tileId: TILES.SERPENT, ai: 'chase', aggroRange: 5,
        stats: { hp: 280, maxHp: 280, attack: 38, defense: 14, speed: 120, expReward: 75 },
        skills: [
            { name: 'Venom Fang', damage: 30, cooldown: 2500, range: 1.5 },
            { name: 'Constrict', damage: 18, cooldown: 4000, range: 1, effect: 'debuff', color: '#1b5e20' },
        ],
    },
    PIRANHA: {
        name: 'Piranha', tileId: TILES.BAT, ai: 'chase', aggroRange: 6,
        stats: { hp: 150, maxHp: 150, attack: 30, defense: 5, speed: 180, expReward: 55 },
        skills: [{ name: 'Razor Bite', damage: 25, cooldown: 1800, range: 1 }],
    },
    NEREID: {
        name: 'Nereid', tileId: TILES.ELEMENTAL, ai: 'chase', aggroRange: 6,
        stats: { hp: 220, maxHp: 220, attack: 42, defense: 12, speed: 100, expReward: 70 },
        skills: [
            { name: 'Water Bolt', damage: 35, cooldown: 2500, range: 5, effect: 'projectile', color: '#29b6f6' },
            { name: 'Tidal Wave', damage: 28, cooldown: 5000, range: 3, effect: 'aoe_circle', color: '#4fc3f7', aoeRadius: 3 },
        ],
    },
    BAHAMUT_CRAB: {
        name: 'Bahamut Crab', tileId: TILES.GOLEM, ai: 'chase', aggroRange: 3,
        stats: { hp: 400, maxHp: 400, attack: 35, defense: 28, speed: 55, expReward: 80 },
        skills: [
            { name: 'Claw Crush', damage: 30, cooldown: 3000, range: 1.5 },
            { name: 'Shell Guard', damage: 0, cooldown: 8000, range: 0, effect: 'buff' },
        ],
    },

    // === MAP 7: TARKAN (Lv 55-75) ===
    MUTANT: {
        name: 'Mutant', tileId: TILES.DEMON, ai: 'chase', aggroRange: 5,
        stats: { hp: 350, maxHp: 350, attack: 45, defense: 18, speed: 110, expReward: 90 },
        skills: [
            { name: 'Berserk Slash', damage: 38, cooldown: 2500, range: 2 },
            { name: 'Rage', damage: 0, cooldown: 8000, range: 0, effect: 'buff' },
        ],
    },
    IRON_WHEEL: {
        name: 'Iron Wheel', tileId: TILES.GOLEM, ai: 'chase', aggroRange: 4,
        stats: { hp: 450, maxHp: 450, attack: 40, defense: 25, speed: 90, expReward: 85 },
        skills: [
            { name: 'Rolling Crush', damage: 35, cooldown: 3000, range: 2, effect: 'aoe_line', color: '#795548', lineLength: 3 },
            { name: 'Spin Attack', damage: 30, cooldown: 4000, range: 2, effect: 'nova', color: '#5d4037', aoeRadius: 2 },
        ],
    },
    BLOODY_WOLF: {
        name: 'Bloody Wolf', tileId: TILES.WOLF, ai: 'chase', aggroRange: 6,
        stats: { hp: 280, maxHp: 280, attack: 50, defense: 15, speed: 165, expReward: 95 },
        skills: [
            { name: 'Feral Fang', damage: 42, cooldown: 1800, range: 1 },
            { name: 'Howl', damage: 0, cooldown: 6000, range: 4, effect: 'buff' },
        ],
    },
};
