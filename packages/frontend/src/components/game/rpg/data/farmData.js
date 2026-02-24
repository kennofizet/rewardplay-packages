// ==========================================
// FARM & DEFENSE DATA
// ==========================================

// --- CROPS ---
export const CROPS = {
    WHEAT: { id: 'wheat', name: 'Wheat', icon: '🌾', cost: 10, growTime: 30000, sellValue: 25, color: '#d4a017' },
    CARROT: { id: 'carrot', name: 'Carrot', icon: '🥕', cost: 20, growTime: 45000, sellValue: 50, color: '#ff8c00' },
    TOMATO: { id: 'tomato', name: 'Tomato', icon: '🍅', cost: 35, growTime: 60000, sellValue: 80, color: '#e53935' },
    CORN: { id: 'corn', name: 'Corn', icon: '🌽', cost: 50, growTime: 90000, sellValue: 120, color: '#fdd835' },
    PUMPKIN: { id: 'pumpkin', name: 'Pumpkin', icon: '🎃', cost: 80, growTime: 120000, sellValue: 200, color: '#ef6c00' },
    GOLDEN_APPLE: { id: 'golden_apple', name: 'Golden Apple', icon: '🍎', cost: 150, growTime: 180000, sellValue: 400, color: '#ffd700' },
};

export const CROP_LIST = Object.values(CROPS);

// --- DEFENSE PLANTS ---
export const DEFENSE_PLANTS = {
    PEASHOOTER: {
        id: 'peashooter', name: 'Peashooter', icon: '🌱', cost: 100,
        damage: 20, range: 25, attackSpeed: 1400, hp: 80,
        type: 'ranged', color: '#4caf50',
        desc: 'Shoots peas at zombies'
    },
    SUNFLOWER: {
        id: 'sunflower', name: 'Sunflower', icon: '🌻', cost: 50,
        damage: 0, range: 0, attackSpeed: 0, hp: 60,
        type: 'producer', goldPerTick: 5, tickInterval: 10000, color: '#fdd835',
        desc: 'Produces gold over time'
    },
    WALLNUT: {
        id: 'wallnut', name: 'Wall-nut', icon: '🥜', cost: 100,
        damage: 0, range: 0, attackSpeed: 0, hp: 800,
        type: 'wall', color: '#8d6e63',
        desc: 'Blocks zombies with massive HP'
    },
    SNOW_PEA: {
        id: 'snow_pea', name: 'Snow Pea', icon: '❄️', cost: 175,
        damage: 12, range: 25, attackSpeed: 1400, hp: 80,
        type: 'ranged', special: 'slow', slowAmount: 0.5, color: '#4fc3f7',
        desc: 'Shoots frozen peas that slow zombies'
    },
    CHERRY_BOMB: {
        id: 'cherry_bomb', name: 'Cherry Bomb', icon: '🍒', cost: 150,
        damage: 999, range: 2.5, attackSpeed: 0, hp: 1,
        type: 'bomb', color: '#d32f2f',
        desc: 'Explodes, destroying nearby zombies'
    },
    REPEATER: {
        id: 'repeater', name: 'Repeater', icon: '🌿', cost: 200,
        damage: 18, range: 5, attackSpeed: 1400, hp: 80, shotsPerAttack: 2,
        type: 'ranged', color: '#2e7d32',
        desc: 'Shoots two peas at once'
    },
    CHOMPER: {
        id: 'chomper', name: 'Chomper', icon: '🪴', cost: 150,
        damage: 999, range: 1, attackSpeed: 30000, hp: 80,
        type: 'melee', color: '#7b1fa2',
        desc: 'Eats a zombie whole, long cooldown'
    },
    TORCHWOOD: {
        id: 'torchwood', name: 'Torchwood', icon: '🔥', cost: 175,
        damage: 0, range: 0, attackSpeed: 0, hp: 150,
        type: 'buff', damageMultiplier: 2, color: '#ff5722',
        desc: 'Doubles pea damage passing through'
    },
    // --- NEW PLANTS ---
    CACTUS: {
        id: 'cactus', name: 'Cactus', icon: '🌵', cost: 125,
        damage: 12, range: 28, attackSpeed: 1800, hp: 120,
        type: 'ranged', special: 'pierce', color: '#558b2f',
        desc: 'Shoots spines that pierce through all zombies in lane'
    },
    POTATO_MINE: {
        id: 'potato_mine', name: 'Potato Mine', icon: '💣', cost: 25,
        damage: 999, range: 0.5, attackSpeed: 0, hp: 1,
        type: 'mine', armTime: 15000, color: '#795548',
        desc: 'Buried trap — arms after 15s, explodes on contact'
    },
    MELON_PULT: {
        id: 'melon_pult', name: 'Melon-pult', icon: '🍈', cost: 300,
        damage: 40, range: 27, attackSpeed: 2800, hp: 100,
        type: 'ranged', special: 'splash', splashRadius: 1.5, color: '#43a047',
        desc: 'Lobs melons with splash damage'
    },
    COFFEE_BEAN: {
        id: 'coffee_bean', name: 'Coffee Bean', icon: '☕', cost: 75,
        damage: 0, range: 0, attackSpeed: 0, hp: 1,
        type: 'buff_consume', speedMultiplier: 2, color: '#6d4c41',
        desc: 'Doubles attack speed of adjacent plants (consumed)'
    },
    JALAPENO: {
        id: 'jalapeno', name: 'Jalapeno', icon: '🌶️', cost: 125,
        damage: 999, range: 99, attackSpeed: 0, hp: 1,
        type: 'lane_bomb', color: '#ff3d00',
        desc: 'Burns every zombie in the entire lane'
    },
    GARLIC: {
        id: 'garlic', name: 'Garlic', icon: '🧄', cost: 50,
        damage: 0, range: 0, attackSpeed: 0, hp: 200,
        type: 'wall', special: 'redirect', color: '#e0e0e0',
        desc: 'Redirects zombies to adjacent lanes'
    },
};

export const DEFENSE_PLANT_LIST = Object.values(DEFENSE_PLANTS);

// --- PLANT LEVEL SYSTEM ---
export const PLANT_MAX_LEVEL = 10;

export const PLANT_LEVEL_COLORS = [
    '#9e9e9e',  // Lv1  Gray
    '#4caf50',  // Lv2  Green
    '#2196f3',  // Lv3  Blue
    '#9c27b0',  // Lv4  Purple
    '#ff9800',  // Lv5  Orange
    '#f44336',  // Lv6  Red
    '#e91e63',  // Lv7  Pink
    '#ffd700',  // Lv8  Gold
    '#00e5ff',  // Lv9  Cyan
    '#ff1744',  // Lv10 Legendary
];

export const LEVEL_MULTIPLIERS = {
    damage: [1, 1.15, 1.3, 1.5, 1.7, 2.0, 2.3, 2.7, 3.2, 4.0],
    hp: [1, 1.2, 1.4, 1.7, 2.0, 2.4, 2.8, 3.3, 4.0, 5.0],
    cost: [1, 1.5, 2.0, 2.8, 3.8, 5.0, 6.5, 8.5, 11, 15],
};

// Helper: get scaled stats for a plant at a given level
export function getScaledStats(plantDef, level) {
    const lv = Math.max(0, Math.min(level - 1, 9));
    return {
        damage: Math.round(plantDef.damage * LEVEL_MULTIPLIERS.damage[lv]),
        hp: Math.round(plantDef.hp * LEVEL_MULTIPLIERS.hp[lv]),
        upgradeCost: Math.round(plantDef.cost * LEVEL_MULTIPLIERS.cost[lv]),
    };
}

// --- ZOMBIE TYPES ---
export const ZOMBIES = {
    BASIC: {
        id: 'zombie_basic', name: 'Zombie', hp: 100, speed: 0.3,
        damage: 10, attackSpeed: 1000, color: '#6d8a4e',
        special: null, desc: 'Basic shambling zombie'
    },
    CONE: {
        id: 'zombie_cone', name: 'Conehead', hp: 200, speed: 0.3,
        damage: 10, attackSpeed: 1000, color: '#ff9800',
        special: 'armor_cone', desc: 'Traffic cone for extra protection'
    },
    BUCKET: {
        id: 'zombie_bucket', name: 'Buckethead', hp: 400, speed: 0.3,
        damage: 15, attackSpeed: 1000, color: '#757575',
        special: 'armor_bucket', desc: 'Bucket helmet absorbs massive damage'
    },
    FLAG: {
        id: 'zombie_flag', name: 'Flag Zombie', hp: 80, speed: 0.5,
        damage: 10, attackSpeed: 1000, color: '#f44336',
        special: 'flag', desc: 'Signals a huge wave incoming'
    },
    POLE_VAULT: {
        id: 'zombie_pole', name: 'Pole Vaulter', hp: 120, speed: 0.6,
        damage: 12, attackSpeed: 1000, color: '#3f51b5',
        special: 'jump', desc: 'Jumps over the first plant'
    },
    FOOTBALL: {
        id: 'zombie_football', name: 'Football Zombie', hp: 500, speed: 0.5,
        damage: 20, attackSpeed: 800, color: '#1a237e',
        special: 'rush', desc: 'Fast and extremely tough'
    },
    SCREEN_DOOR: {
        id: 'zombie_screen', name: 'Screen Door', hp: 350, speed: 0.3,
        damage: 10, attackSpeed: 1000, color: '#795548',
        special: 'shield', shieldHp: 200, desc: 'Shield blocks projectiles'
    },
    GARGANTUAR: {
        id: 'zombie_garg', name: 'Gargantuar', hp: 1000, speed: 0.2,
        damage: 50, attackSpeed: 1500, color: '#4a0e0e',
        special: 'throw_imp', desc: 'Throws imp zombie when damaged'
    },
    IMP: {
        id: 'zombie_imp', name: 'Imp', hp: 60, speed: 0.8,
        damage: 8, attackSpeed: 600, color: '#9ccc65',
        special: null, desc: 'Tiny fast zombie thrown by Gargantuar'
    },
};

// --- WAVE DEFINITIONS ---
export const WAVES = [
    {
        wave: 1, groups: [
            { type: ZOMBIES.BASIC, count: 3, delay: 0 },
            { type: ZOMBIES.BASIC, count: 2, delay: 8000 },
        ]
    },
    {
        wave: 2, groups: [
            { type: ZOMBIES.BASIC, count: 4, delay: 0 },
            { type: ZOMBIES.CONE, count: 2, delay: 6000 },
        ]
    },
    {
        wave: 3, groups: [
            { type: ZOMBIES.BASIC, count: 3, delay: 0 },
            { type: ZOMBIES.CONE, count: 3, delay: 5000 },
            { type: ZOMBIES.FLAG, count: 1, delay: 10000 },
            { type: ZOMBIES.BASIC, count: 5, delay: 10500 },
        ]
    },
    {
        wave: 4, groups: [
            { type: ZOMBIES.CONE, count: 4, delay: 0 },
            { type: ZOMBIES.BUCKET, count: 2, delay: 6000 },
            { type: ZOMBIES.POLE_VAULT, count: 2, delay: 12000 },
        ]
    },
    {
        wave: 5, groups: [
            { type: ZOMBIES.FLAG, count: 1, delay: 0 },
            { type: ZOMBIES.BASIC, count: 6, delay: 500 },
            { type: ZOMBIES.CONE, count: 4, delay: 8000 },
            { type: ZOMBIES.BUCKET, count: 3, delay: 14000 },
            { type: ZOMBIES.POLE_VAULT, count: 3, delay: 18000 },
        ]
    },
    {
        wave: 6, groups: [
            { type: ZOMBIES.CONE, count: 5, delay: 0 },
            { type: ZOMBIES.SCREEN_DOOR, count: 3, delay: 6000 },
            { type: ZOMBIES.FOOTBALL, count: 2, delay: 12000 },
        ]
    },
    {
        wave: 7, groups: [
            { type: ZOMBIES.BUCKET, count: 4, delay: 0 },
            { type: ZOMBIES.FOOTBALL, count: 3, delay: 5000 },
            { type: ZOMBIES.SCREEN_DOOR, count: 3, delay: 10000 },
            { type: ZOMBIES.POLE_VAULT, count: 4, delay: 15000 },
        ]
    },
    {
        wave: 8, groups: [
            { type: ZOMBIES.FLAG, count: 1, delay: 0 },
            { type: ZOMBIES.FOOTBALL, count: 4, delay: 500 },
            { type: ZOMBIES.BUCKET, count: 5, delay: 6000 },
            { type: ZOMBIES.SCREEN_DOOR, count: 4, delay: 12000 },
            { type: ZOMBIES.GARGANTUAR, count: 1, delay: 18000 },
        ]
    },
    {
        wave: 9, groups: [
            { type: ZOMBIES.GARGANTUAR, count: 2, delay: 0 },
            { type: ZOMBIES.FOOTBALL, count: 5, delay: 4000 },
            { type: ZOMBIES.BUCKET, count: 6, delay: 10000 },
            { type: ZOMBIES.SCREEN_DOOR, count: 5, delay: 16000 },
        ]
    },
    {
        wave: 10, groups: [
            { type: ZOMBIES.FLAG, count: 1, delay: 0 },
            { type: ZOMBIES.BASIC, count: 10, delay: 500 },
            { type: ZOMBIES.CONE, count: 8, delay: 4000 },
            { type: ZOMBIES.BUCKET, count: 6, delay: 8000 },
            { type: ZOMBIES.FOOTBALL, count: 4, delay: 12000 },
            { type: ZOMBIES.GARGANTUAR, count: 3, delay: 16000 },
            { type: ZOMBIES.SCREEN_DOOR, count: 5, delay: 20000 },
        ]
    },
];

// --- FARM ZONE LAYOUT CONSTANTS ---
export const FARM_LAYOUT = {
    // Farm planting area
    FARM_X: 2, FARM_Y: 32, FARM_W: 28, FARM_H: 24,
    FARM_ROWS: 6, FARM_COLS: 10,
    FARM_GRID_START_X: 4, FARM_GRID_START_Y: 34,
    FARM_GRID_SPACING_X: 2, FARM_GRID_SPACING_Y: 3,

    // Defense zone
    DEF_X: 32, DEF_Y: 32, DEF_W: 24, DEF_H: 24,
    DEF_LANES: 5, DEF_COLS: 8,
    DEF_GRID_START_X: 33, DEF_GRID_START_Y: 34,
    DEF_LANE_HEIGHT: 4,

    // Zombie spawn zone
    SPAWN_X: 58, SPAWN_Y: 32, SPAWN_W: 20, SPAWN_H: 24,

    // Breach target (house zone)
    HOUSE_X: 2, HOUSE_Y: 2,

    // Day/night: real timezone (player's local time)
    REAL_TIME_DAY_HOUR: 6,   // 6:00 AM local = day starts
    REAL_TIME_NIGHT_HOUR: 18, // 6:00 PM local = night starts (zombie wave)
    // Night attack: first hour after 18:00, new wave every 20s (overlapping)
    NIGHT_ATTACK_DURATION_MS: 3600000, // 1 hour of waves (18:00–19:00)
    WAVE_INTERVAL_MS: 20000,           // new wave every 20s
    // Legacy demo timings (not used when using real time)
    DAY_DURATION: 180000,
    NIGHT_DURATION: 120000,
};
