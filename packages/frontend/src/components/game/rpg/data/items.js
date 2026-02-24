// ==========================================
// ITEM SYSTEM — Types, Rarity, Stacking, Generation
// ==========================================

export const RARITY = {
    COMMON: { id: 'common', name: 'Common', color: '#b0b0b0', multiplier: 1.0 },
    UNCOMMON: { id: 'uncommon', name: 'Uncommon', color: '#2ecc71', multiplier: 1.2 },
    RARE: { id: 'rare', name: 'Rare', color: '#3498db', multiplier: 1.5 },
    EPIC: { id: 'epic', name: 'Epic', color: '#9b59b6', multiplier: 2.0 },
    LEGENDARY: { id: 'legendary', name: 'Legendary', color: '#f1c40f', multiplier: 3.0 },
    MYTHIC: { id: 'mythic', name: 'Mythic', color: '#e74c3c', multiplier: 5.0 }
};

export const ITEM_TYPES = {
    WEAPON: 'weapon',
    HELMET: 'helmet',
    ARMOR: 'armor',
    BOOTS: 'boots',
    ACCESSORY: 'accessory',
    CONSUMABLE: 'consumable',
    MATERIAL: 'material',
};

// Stackable types — consumables and materials stack up to 999
export const STACKABLE_TYPES = ['consumable', 'material'];
export const MAX_STACK = 999;

// Generate a stackKey for matching identical items
export const getStackKey = (item) => {
    if (STACKABLE_TYPES.includes(item.type)) return `${item.id}_${item.rarity}`;
    // Gear stacking: same type + name + rarity + level + stats = stackable
    const statsKey = item.stats ? Object.entries(item.stats).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${k}:${v}`).join(',') : '';
    return `gear_${item.type}_${item.name}_${item.rarity}_${item.level || 0}_${statsKey}`;
};

// ── BASE GEAR ITEMS (for loot generation) ──
const BASE_ITEMS = [
    // Weapons
    { type: 'weapon', name: 'Short Sword', baseStat: 5, statName: 'attack', icon: '🗡️' },
    { type: 'weapon', name: 'Broad Sword', baseStat: 7, statName: 'attack', icon: '⚔️' },
    { type: 'weapon', name: 'War Axe', baseStat: 9, statName: 'attack', icon: '🪓' },
    { type: 'weapon', name: 'Katana', baseStat: 11, statName: 'attack', icon: '⚔️' },
    { type: 'weapon', name: 'Staff', baseStat: 6, statName: 'attack', icon: '🪄', secondary: { mana: 15 } },
    { type: 'weapon', name: 'Crossbow', baseStat: 8, statName: 'attack', icon: '🏹' },
    // Helmets
    { type: 'helmet', name: 'Leather Cap', baseStat: 2, statName: 'defense', icon: '🧢' },
    { type: 'helmet', name: 'Iron Helm', baseStat: 5, statName: 'defense', icon: '🪖' },
    { type: 'helmet', name: 'Knight Helm', baseStat: 8, statName: 'defense', icon: '🪖', secondary: { hp: 10 } },
    { type: 'helmet', name: 'Crown', baseStat: 4, statName: 'defense', icon: '👑', secondary: { mana: 20 } },
    { type: 'helmet', name: 'Hood', baseStat: 3, statName: 'defense', icon: '🧥', secondary: { speed: 1 } },
    // Armor
    { type: 'armor', name: 'Cloth Tunic', baseStat: 10, statName: 'hp', icon: '👕' },
    { type: 'armor', name: 'Leather Armor', baseStat: 20, statName: 'hp', icon: '🥋' },
    { type: 'armor', name: 'Chainmail', baseStat: 30, statName: 'hp', icon: '🥋', secondary: { defense: 3 } },
    { type: 'armor', name: 'Plate Armor', baseStat: 45, statName: 'hp', icon: '🛡️', secondary: { defense: 6 } },
    { type: 'armor', name: 'Dragon Armor', baseStat: 60, statName: 'hp', icon: '🛡️', secondary: { defense: 10 } },
    // Boots
    { type: 'boots', name: 'Old Boots', baseStat: 1, statName: 'speed', icon: '👢' },
    { type: 'boots', name: 'Leather Boots', baseStat: 2, statName: 'speed', icon: '👢', secondary: { defense: 1 } },
    { type: 'boots', name: 'Iron Greaves', baseStat: 1, statName: 'speed', icon: '👢', secondary: { defense: 5 } },
    { type: 'boots', name: 'Winged Boots', baseStat: 4, statName: 'speed', icon: '👢', secondary: { hp: 10 } },
    { type: 'boots', name: 'Dragon Boots', baseStat: 3, statName: 'speed', icon: '👢', secondary: { defense: 8, hp: 20 } },
    // Accessories
    { type: 'accessory', name: 'Ring of Power', baseStat: 3, statName: 'attack', icon: '💍' },
    { type: 'accessory', name: 'Ring of Defense', baseStat: 3, statName: 'defense', icon: '💍' },
    { type: 'accessory', name: 'Pendant of Life', baseStat: 15, statName: 'hp', icon: '📿' },
    { type: 'accessory', name: 'Amulet of Speed', baseStat: 2, statName: 'speed', icon: '📿' },
];

// ── CONSUMABLE ITEMS (stackable, usable) ──
export const CONSUMABLE_ITEMS = {
    hp_potion_s: { id: 'hp_potion_s', name: 'HP Potion', icon: '❤️', type: 'consumable', rarity: 'common', color: '#ff4444', effect: 'heal', value: 50, description: 'Restores 50 HP' },
    hp_potion_m: { id: 'hp_potion_m', name: 'HP Potion (M)', icon: '❤️', type: 'consumable', rarity: 'uncommon', color: '#ff6666', effect: 'heal', value: 150, description: 'Restores 150 HP' },
    hp_potion_l: { id: 'hp_potion_l', name: 'HP Potion (L)', icon: '❤️‍🔥', type: 'consumable', rarity: 'rare', color: '#ff8888', effect: 'heal', value: 400, description: 'Restores 400 HP' },
    mp_potion_s: { id: 'mp_potion_s', name: 'Mana Potion', icon: '💙', type: 'consumable', rarity: 'common', color: '#4488ff', effect: 'mana', value: 40, description: 'Restores 40 Mana' },
    mp_potion_m: { id: 'mp_potion_m', name: 'Mana Potion (M)', icon: '💙', type: 'consumable', rarity: 'uncommon', color: '#6699ff', effect: 'mana', value: 120, description: 'Restores 120 Mana' },
    atk_elixir: { id: 'atk_elixir', name: 'ATK Elixir', icon: '⚔️', type: 'consumable', rarity: 'uncommon', color: '#ff8800', effect: 'buff_atk', value: 10, duration: 60, description: '+10 ATK for 60s' },
    def_elixir: { id: 'def_elixir', name: 'DEF Elixir', icon: '🛡️', type: 'consumable', rarity: 'uncommon', color: '#44aaff', effect: 'buff_def', value: 10, duration: 60, description: '+10 DEF for 60s' },
    speed_elixir: { id: 'speed_elixir', name: 'Speed Elixir', icon: '💨', type: 'consumable', rarity: 'rare', color: '#88ffcc', effect: 'buff_speed', value: 30, duration: 30, description: '+30% Speed for 30s' },
    full_heal: { id: 'full_heal', name: 'Full Restore', icon: '💖', type: 'consumable', rarity: 'epic', color: '#ff44ff', effect: 'full_heal', value: 0, description: 'Fully restores HP & Mana' },
};

// ── MATERIAL ITEMS (stackable, for crafting) ──
export const MATERIAL_ITEMS = {
    upgrade_scroll: { id: 'upgrade_scroll', name: 'Upgrade Scroll', icon: '📜', type: 'material', rarity: 'rare', color: '#3498db', description: 'Used to upgrade gear +1' },
    luck_scroll: { id: 'luck_scroll', name: 'Luck Scroll', icon: '🍀', type: 'material', rarity: 'epic', color: '#9b59b6', description: 'Guaranteed upgrade success' },
    crystal_shard: { id: 'crystal_shard', name: 'Crystal Shard', icon: '💎', type: 'material', rarity: 'uncommon', color: '#2ecc71', description: 'Crafting material' },
    dragon_scale: { id: 'dragon_scale', name: 'Dragon Scale', icon: '🐉', type: 'material', rarity: 'epic', color: '#9b59b6', description: 'Rare boss drop' },
    soul_gem: { id: 'soul_gem', name: 'Soul Gem', icon: '🔮', type: 'material', rarity: 'legendary', color: '#f1c40f', description: 'Imbue with ancient power' },
};

const AFFIXES = {
    PREFIXES: ['Strong', 'Swift', 'Sturdy', 'Glowing', 'Ancient', 'Cursed', 'Blazing', 'Frozen', 'Shadow'],
    SUFFIXES: ['of the Bear', 'of the Wolf', 'of the Eagle', 'of Dimensions', 'of Eclipse', 'of Thunder', 'of Kundun']
};

export const generateLoot = (level) => {
    // 1. Pick Rarity
    const roll = Math.random();
    let rarity = RARITY.COMMON;
    if (roll > 0.98) rarity = RARITY.LEGENDARY;
    else if (roll > 0.90) rarity = RARITY.EPIC;
    else if (roll > 0.75) rarity = RARITY.RARE;
    else if (roll > 0.50) rarity = RARITY.UNCOMMON;

    // 2. Pick Base Item
    const base = BASE_ITEMS[Math.floor(Math.random() * BASE_ITEMS.length)];

    // 3. Calculate Stats
    const statValue = Math.floor(base.baseStat * rarity.multiplier * (1 + level * 0.1));

    // 4. Name Generation
    let name = base.name;
    if (rarity !== RARITY.COMMON) {
        const prefix = AFFIXES.PREFIXES[Math.floor(Math.random() * AFFIXES.PREFIXES.length)];
        const suffix = AFFIXES.SUFFIXES[Math.floor(Math.random() * AFFIXES.SUFFIXES.length)];
        name = `${prefix} ${base.name} ${suffix}`;
    }

    // 5. Build stats object with primary + secondary
    const stats = { [base.statName]: statValue };
    if (base.secondary) {
        Object.entries(base.secondary).forEach(([k, v]) => {
            stats[k] = Math.floor(v * rarity.multiplier * (1 + level * 0.05));
        });
    }

    return {
        id: Math.random().toString(36).substr(2, 9),
        name,
        type: base.type,
        rarity: rarity.id,
        color: rarity.color,
        icon: base.icon,
        stats,
        level: 0, // upgrade level (+0, +1, +2 ... +15)
        levelRequirement: level,
        count: 1, // always 1 for gear
    };
};

// Generate a consumable drop from enemies
export const generateConsumableDrop = () => {
    const roll = Math.random();
    if (roll > 0.85) return { ...CONSUMABLE_ITEMS.mp_potion_s, count: 1 };
    if (roll > 0.60) return { ...CONSUMABLE_ITEMS.hp_potion_s, count: 1 };
    if (roll > 0.50) return { ...MATERIAL_ITEMS.crystal_shard, count: 1 };
    return null; // no drop
};

// ── INVENTORY HELPERS ──

// Add item to inventory with stacking support
export const addToInventory = (inventory, item) => {
    const key = getStackKey(item);
    if (key) {
        // Stackable — find existing stack
        const existing = inventory.find(i => getStackKey(i) === key);
        if (existing) {
            existing.count = Math.min(MAX_STACK, (existing.count || 1) + (item.count || 1));
            return inventory;
        }
    }
    // New item or non-stackable
    inventory.push({ ...item, count: item.count || 1 });
    return inventory;
};

// Remove count from inventory (for consumables)
export const removeFromInventory = (inventory, index, count = 1) => {
    const item = inventory[index];
    if (!item) return inventory;
    item.count = (item.count || 1) - count;
    if (item.count <= 0) {
        inventory.splice(index, 1);
    }
    return inventory;
};

// ── UPGRADE SYSTEM (MU-style +1 to +15) ──
// Success rates decrease per level, failure at +6 can destroy item
export const UPGRADE_RATES = {
    0: 1.00, 1: 0.95, 2: 0.90, 3: 0.85, 4: 0.80,
    5: 0.75, 6: 0.60, 7: 0.50, 8: 0.40, 9: 0.35,
    10: 0.30, 11: 0.25, 12: 0.20, 13: 0.15, 14: 0.10,
};

export const upgradeItem = (item, useLuckScroll = false) => {
    const currentLevel = item.level || 0;
    if (currentLevel >= 15) return { success: false, destroyed: false, message: 'Item is already at max level (+15).' };

    const rate = useLuckScroll ? 1.0 : (UPGRADE_RATES[currentLevel] || 0.10);

    if (Math.random() < rate) {
        // Success
        const upgraded = { ...item };
        upgraded.level = currentLevel + 1;
        upgraded.name = upgraded.name.replace(/\s*\+\d+$/, '') + ` +${upgraded.level}`;
        // Boost stats by ~8% per level
        if (upgraded.stats) {
            upgraded.stats = { ...upgraded.stats };
            Object.keys(upgraded.stats).forEach(k => {
                upgraded.stats[k] = Math.floor(upgraded.stats[k] * 1.08) + 1;
            });
        }
        return { success: true, destroyed: false, item: upgraded, message: `Success! ${upgraded.name}` };
    } else {
        // Fail — destroy at +6 and above
        const destroyed = currentLevel >= 6 && !useLuckScroll;
        return {
            success: false,
            destroyed,
            message: destroyed
                ? `Upgrade failed! ${item.name} was DESTROYED!`
                : `Upgrade failed. ${item.name} is preserved.`,
        };
    }
};
