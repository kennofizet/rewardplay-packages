// ==========================================
// NPC DEFINITIONS — Shops, Quests, Storage, Craft, Summon
// ==========================================
import { CONSUMABLE_ITEMS, MATERIAL_ITEMS } from './items';

export const NPC_TYPES = {
    SHOP: 'shop',
    QUEST: 'quest',
    STORAGE: 'storage',
    CRAFT: 'craft',
    SUMMON: 'summon',
    TEMPLE: 'temple',
};

export const NPCS = {
    // === LORENCIA TOWN NPCs ===
    WEAPON_MERCHANT: {
        id: 'weapon_merchant', name: 'Hanzo', icon: '⚔️',
        type: NPC_TYPES.SHOP, mapId: 1,
        dialogue: ['Welcome warrior! I forge the finest blades in Lorencia.', 'Browse my weapons — each one battle-tested.'],
        shopCategory: 'weapons',
    },
    ARMOR_MERCHANT: {
        id: 'armor_merchant', name: 'Helena', icon: '🛡️',
        type: NPC_TYPES.SHOP, mapId: 1,
        dialogue: ['Protection is everything on the battlefield.', 'Try on my finest armor — it could save your life.'],
        shopCategory: 'armor',
    },
    POTION_MERCHANT: {
        id: 'potion_merchant', name: 'Lahap', icon: '🧪',
        type: NPC_TYPES.SHOP, mapId: 1,
        dialogue: ['Potions! Elixirs! Everything an adventurer needs!', 'Stock up before heading into the wilds.'],
        shopCategory: 'potions',
    },
    BLACKSMITH: {
        id: 'blacksmith', name: 'Elpis', icon: '🔨',
        type: NPC_TYPES.CRAFT, mapId: 1,
        dialogue: ['I can upgrade your gear or combine items.', 'Bring me materials and I\'ll forge something extraordinary.'],
    },
    STORAGE_KEEPER: {
        id: 'storage_keeper', name: 'Vault Keeper', icon: '📦',
        type: NPC_TYPES.STORAGE, mapId: 1,
        dialogue: ['Your vault is safe with me.', 'Store your treasures here — nobody gets past my watch.'],
    },

    // === HOUSE NPCs ===
    QUEST_ELDER: {
        id: 'quest_elder', name: 'Elder Raul', icon: '👴',
        type: NPC_TYPES.QUEST, mapId: 8,
        dialogue: [
            'Ah, a young adventurer. Listen well...',
            'Dark forces stir in the dungeons beneath Lorencia.',
            'I need someone brave enough to investigate.',
            'Will you help an old man?',
        ],
        quests: [
            {
                id: 'q_slay_spiders', name: 'Spider Menace', icon: '🕷️',
                description: 'Defeat 5 Spiders in Lorencia fields.',
                type: 'kill', target: 'spider', count: 5,
                reward: { gold: 200, xp: 100 },
                dialogue_start: 'Spiders have been terrorizing travelers. Slay 5 of them!',
                dialogue_complete: 'Excellent work! Here is your reward.',
            },
            {
                id: 'q_dungeon_scout', name: 'Dungeon Scout', icon: '🏚️',
                description: 'Visit the Dungeon and return.',
                type: 'visit_map', target: 2, count: 1,
                reward: { gold: 300, xp: 200 },
                dialogue_start: 'Scout the dungeon entrance and report back.',
                dialogue_complete: 'You made it back alive! Take this reward.',
            },
            {
                id: 'q_collect_crystals', name: 'Crystal Harvest', icon: '💎',
                description: 'Collect 3 Crystal Shards from enemies.',
                type: 'collect', target: 'crystal_shard', count: 3,
                reward: { gold: 500, xp: 300 },
                dialogue_start: 'I need magical crystal shards. Defeat monsters to find them.',
                dialogue_complete: 'These crystals will help protect the village. Thank you!',
            },
        ],
    },
    HOUSE_STORAGE: {
        id: 'house_storage', name: 'Storage Chest', icon: '📦',
        type: NPC_TYPES.STORAGE, mapId: 8,
        dialogue: ['Open your personal storage.'],
    },
    FARM_VENDOR: {
        id: 'farm_vendor', name: 'Farmer Jack', icon: '🧑‍🌾',
        type: 'farm_vendor', mapId: 8,
        dialogue: ['Welcome to the farm!', 'Buy seeds to plant crops, or browse defense plants.'],
    },
    TEMPLE_KEEPER: {
        id: 'temple_keeper', name: 'Ancestral Guardian', icon: '🏛️',
        type: NPC_TYPES.TEMPLE, mapId: 8,
        dialogue: [
            'Welcome to the Temple of Descendants.',
            'Your ancestors watch over you from beyond...',
            'Prove your worth and receive their blessings.',
        ],
        rewards: [
            { id: 'desc_house', name: 'Cozy Cottage', icon: '🏠', rarity: 'uncommon', color: '#2ecc71', weight: 25, category: 'property', description: 'A warm home for a hero' },
            { id: 'desc_villa', name: 'Grand Villa', icon: '🏡', rarity: 'rare', color: '#3498db', weight: 10, category: 'property', description: 'A luxurious estate' },
            { id: 'desc_car', name: 'Sports Car', icon: '🏎️', rarity: 'rare', color: '#3498db', weight: 12, category: 'vehicle', description: 'Speed and style combined' },
            { id: 'desc_suv', name: 'Armored SUV', icon: '🚙', rarity: 'uncommon', color: '#2ecc71', weight: 18, category: 'vehicle', description: 'Built for adventure' },
            { id: 'desc_yacht', name: 'Luxury Yacht', icon: '🛥️', rarity: 'epic', color: '#9b59b6', weight: 5, category: 'vehicle', description: 'Sail the seven seas' },
            { id: 'desc_aircraft', name: 'Private Jet', icon: '✈️', rarity: 'epic', color: '#9b59b6', weight: 4, category: 'vehicle', description: 'Travel the world in style' },
            { id: 'desc_heli', name: 'Helicopter', icon: '🚁', rarity: 'rare', color: '#3498db', weight: 8, category: 'vehicle', description: 'Vertical freedom' },
            { id: 'desc_island', name: 'Private Island', icon: '🏝️', rarity: 'legendary', color: '#f1c40f', weight: 1, category: 'property', description: 'Your own paradise' },
            { id: 'desc_castle', name: 'Ancient Castle', icon: '🏰', rarity: 'legendary', color: '#f1c40f', weight: 1, category: 'property', description: 'A fortress fit for a king' },
            { id: 'desc_rocket', name: 'Space Shuttle', icon: '🚀', rarity: 'legendary', color: '#f1c40f', weight: 0.5, category: 'vehicle', description: 'Reach for the stars' },
            { id: 'desc_bike', name: 'Mountain Bike', icon: '🚲', rarity: 'common', color: '#b0b0b0', weight: 30, category: 'vehicle', description: 'Simple but reliable' },
            { id: 'desc_scooter', name: 'Electric Scooter', icon: '🛴', rarity: 'common', color: '#b0b0b0', weight: 28, category: 'vehicle', description: 'Eco-friendly transport' },
            { id: 'desc_apartment', name: 'City Apartment', icon: '🏢', rarity: 'uncommon', color: '#2ecc71', weight: 20, category: 'property', description: 'Urban living at its finest' },
            { id: 'desc_penthouse', name: 'Sky Penthouse', icon: '🌆', rarity: 'epic', color: '#9b59b6', weight: 3, category: 'property', description: 'Top of the world' },
            { id: 'desc_gold_bar', name: 'Gold Bar', icon: '🥇', rarity: 'rare', color: '#f1c40f', weight: 15, category: 'treasure', description: 'Pure 24K gold' },
            { id: 'desc_diamond', name: 'Diamond Collection', icon: '💎', rarity: 'epic', color: '#9b59b6', weight: 4, category: 'treasure', description: 'Flawless brilliance' },
        ],
    },

    // === TREE OF SUMMON ===
    SUMMON_KEEPER: {
        id: 'summon_keeper', name: 'Tree of Wishes', icon: '🌳',
        type: NPC_TYPES.SUMMON, mapId: 9,
        dialogue: [
            'The ancient tree resonates with magical energy...',
            'Offer your gems to receive blessings from beyond.',
        ],
    },
};

// === SHOP INVENTORIES ===
// Each item has: id, name, type, icon, rarity, color, price, stats/effect
export const SHOP_ITEMS = {
    weapons: [
        { id: 'sh_short_sword', name: 'Short Sword', type: 'weapon', icon: '🗡️', rarity: 'common', color: '#b0b0b0', price: 100, stats: { attack: 5 }, level: 0 },
        { id: 'sh_broad_sword', name: 'Broad Sword', type: 'weapon', icon: '⚔️', rarity: 'common', color: '#b0b0b0', price: 250, stats: { attack: 10 }, level: 0 },
        { id: 'sh_crystal_sword', name: 'Crystal Sword', type: 'weapon', icon: '🗡️', rarity: 'uncommon', color: '#2ecc71', price: 800, stats: { attack: 18 }, level: 0 },
        { id: 'sh_katana', name: 'Katana', type: 'weapon', icon: '⚔️', rarity: 'rare', color: '#3498db', price: 2000, stats: { attack: 30 }, level: 0 },
        { id: 'sh_lightning_sword', name: 'Lightning Sword', type: 'weapon', icon: '⚡', rarity: 'epic', color: '#9b59b6', price: 5000, stats: { attack: 50 }, level: 0 },
        { id: 'sh_crossbow', name: 'Crossbow', type: 'weapon', icon: '🏹', rarity: 'uncommon', color: '#2ecc71', price: 600, stats: { attack: 14 }, level: 0 },
        { id: 'sh_staff_arcane', name: 'Arcane Staff', type: 'weapon', icon: '🪄', rarity: 'rare', color: '#3498db', price: 1500, stats: { attack: 22, mana: 20 }, level: 0 },
    ],
    armor: [
        { id: 'sh_leather_helm', name: 'Leather Helm', type: 'helmet', icon: '🧢', rarity: 'common', color: '#b0b0b0', price: 80, stats: { defense: 3 }, level: 0 },
        { id: 'sh_iron_helm', name: 'Iron Helm', type: 'helmet', icon: '🪖', rarity: 'uncommon', color: '#2ecc71', price: 350, stats: { defense: 8 }, level: 0 },
        { id: 'sh_leather_armor', name: 'Leather Armor', type: 'armor', icon: '👕', rarity: 'common', color: '#b0b0b0', price: 120, stats: { hp: 15 }, level: 0 },
        { id: 'sh_chainmail', name: 'Chainmail', type: 'armor', icon: '🥋', rarity: 'uncommon', color: '#2ecc71', price: 500, stats: { hp: 30, defense: 3 }, level: 0 },
        { id: 'sh_plate_armor', name: 'Plate Armor', type: 'armor', icon: '🛡️', rarity: 'rare', color: '#3498db', price: 1500, stats: { hp: 55, defense: 10 }, level: 0 },
        { id: 'sh_leather_boots', name: 'Leather Boots', type: 'boots', icon: '👢', rarity: 'common', color: '#b0b0b0', price: 60, stats: { speed: 1 }, level: 0 },
        { id: 'sh_iron_boots', name: 'Iron Boots', type: 'boots', icon: '👢', rarity: 'uncommon', color: '#2ecc71', price: 300, stats: { defense: 5 }, level: 0 },
        { id: 'sh_ring_power', name: 'Ring of Power', type: 'accessory', icon: '💍', rarity: 'rare', color: '#3498db', price: 1200, stats: { attack: 8 }, level: 0 },
        { id: 'sh_pendant_life', name: 'Pendant of Life', type: 'accessory', icon: '📿', rarity: 'uncommon', color: '#2ecc71', price: 800, stats: { hp: 25 }, level: 0 },
    ],
    potions: [
        { id: 'hp_potion_s', name: 'HP Potion', type: 'consumable', icon: '❤️', rarity: 'common', color: '#ff4444', price: 30, effect: 'heal', value: 50, description: 'Restores 50 HP', count: 1 },
        { id: 'mp_potion_s', name: 'Mana Potion', type: 'consumable', icon: '💙', rarity: 'common', color: '#4488ff', price: 30, effect: 'mana', value: 40, description: 'Restores 40 Mana', count: 1 },
        { id: 'hp_potion_m', name: 'HP Potion (M)', type: 'consumable', icon: '❤️', rarity: 'uncommon', color: '#ff6666', price: 100, effect: 'heal', value: 150, description: 'Restores 150 HP', count: 1 },
        { id: 'mp_potion_m', name: 'Mana Potion (M)', type: 'consumable', icon: '💙', rarity: 'uncommon', color: '#6699ff', price: 80, effect: 'mana', value: 120, description: 'Restores 120 Mana', count: 1 },
        { id: 'atk_elixir', name: 'ATK Elixir', type: 'consumable', icon: '⚔️', rarity: 'uncommon', color: '#ff8800', price: 150, effect: 'buff_atk', value: 10, duration: 60, description: '+10 ATK for 60s', count: 1 },
        { id: 'def_elixir', name: 'DEF Elixir', type: 'consumable', icon: '🛡️', rarity: 'uncommon', color: '#44aaff', price: 150, effect: 'buff_def', value: 10, duration: 60, description: '+10 DEF for 60s', count: 1 },
        { id: 'speed_elixir', name: 'Speed Elixir', type: 'consumable', icon: '💨', rarity: 'rare', color: '#88ffcc', price: 250, effect: 'buff_speed', value: 30, duration: 30, description: '+30% Speed for 30s', count: 1 },
        { id: 'upgrade_scroll', name: 'Upgrade Scroll', type: 'material', icon: '📜', rarity: 'rare', color: '#3498db', price: 500, description: 'Used to upgrade gear +1', count: 1 },
        { id: 'luck_scroll', name: 'Luck Scroll', type: 'material', icon: '🍀', rarity: 'epic', color: '#9b59b6', price: 1200, description: 'Guaranteed upgrade success', count: 1 },
    ],
};

// === SUMMON/GACHA POOLS ===
export const SUMMON_COST = { single: 100, multi: 900 }; // gems

export const SUMMON_BANNERS = {
    gear: {
        id: 'gear', name: '⚔️ Gear Banner', desc: 'Summon powerful equipment',
        color: '#c5a059', featured: '🗡️ Legendary Blade of Eclipse',
        pool: [
            { name: 'Iron Sword', type: 'weapon', icon: '🗡️', rarity: 'common', color: '#b0b0b0', weight: 15, stats: { attack: 8 }, level: 0 },
            { name: 'Leather Cap', type: 'helmet', icon: '🧢', rarity: 'common', color: '#b0b0b0', weight: 15, stats: { defense: 3 }, level: 0 },
            { name: 'Cloth Tunic', type: 'armor', icon: '👕', rarity: 'common', color: '#b0b0b0', weight: 12, stats: { hp: 15 }, level: 0 },
            { name: 'Old Boots', type: 'boots', icon: '👢', rarity: 'common', color: '#b0b0b0', weight: 8, stats: { speed: 1 }, level: 0 },
            { name: 'Steel Sword', type: 'weapon', icon: '⚔️', rarity: 'uncommon', color: '#2ecc71', weight: 8, stats: { attack: 15 }, level: 0 },
            { name: 'Iron Helm', type: 'helmet', icon: '🪖', rarity: 'uncommon', color: '#2ecc71', weight: 7, stats: { defense: 7 }, level: 0 },
            { name: 'Chainmail', type: 'armor', icon: '🥋', rarity: 'uncommon', color: '#2ecc71', weight: 8, stats: { hp: 30 }, level: 0 },
            { name: 'Swift Boots', type: 'boots', icon: '👢', rarity: 'uncommon', color: '#2ecc71', weight: 7, stats: { speed: 2, defense: 3 }, level: 0 },
            { name: 'Crystal Sword', type: 'weapon', icon: '🗡️', rarity: 'rare', color: '#3498db', weight: 4, stats: { attack: 28 }, level: 0 },
            { name: 'Knight Helm', type: 'helmet', icon: '🪖', rarity: 'rare', color: '#3498db', weight: 3, stats: { defense: 14 }, level: 0 },
            { name: 'Plate Armor', type: 'armor', icon: '🛡️', rarity: 'rare', color: '#3498db', weight: 3, stats: { hp: 55, defense: 8 }, level: 0 },
            { name: 'Winged Boots', type: 'boots', icon: '👢', rarity: 'rare', color: '#3498db', weight: 3, stats: { speed: 3, defense: 6 }, level: 0 },
            { name: 'Dragon Slayer', type: 'weapon', icon: '⚔️', rarity: 'epic', color: '#9b59b6', weight: 2, stats: { attack: 50 }, level: 0 },
            { name: 'Dragon Helm', type: 'helmet', icon: '🪖', rarity: 'epic', color: '#9b59b6', weight: 1.5, stats: { defense: 25 }, level: 0 },
            { name: 'Dragon Armor', type: 'armor', icon: '🥋', rarity: 'epic', color: '#9b59b6', weight: 1.5, stats: { hp: 100, defense: 15 }, level: 0 },
            { name: 'Blade of Eclipse', type: 'weapon', icon: '🗡️', rarity: 'legendary', color: '#f1c40f', weight: 0.8, stats: { attack: 85 }, level: 0 },
            { name: 'Crown of Kundun', type: 'helmet', icon: '👑', rarity: 'legendary', color: '#f1c40f', weight: 0.6, stats: { defense: 40, hp: 50 }, level: 0 },
            { name: 'Immortal Armor', type: 'armor', icon: '🛡️', rarity: 'legendary', color: '#f1c40f', weight: 0.6, stats: { hp: 200, defense: 30 }, level: 0 },
        ],
    },
    hero: {
        id: 'hero', name: '🦸 Hero Banner', desc: 'Summon legendary companions',
        color: '#aa88ff', featured: '🐉 Dragon Knight',
        pool: [
            { name: 'Squire', type: 'companion', icon: '🧑‍🤝‍🧑', rarity: 'common', color: '#b0b0b0', weight: 18, stats: { attack: 5, hp: 30 } },
            { name: 'Villager', type: 'companion', icon: '👤', rarity: 'common', color: '#b0b0b0', weight: 16, stats: { attack: 3, hp: 40 } },
            { name: 'Scout', type: 'companion', icon: '🏃', rarity: 'common', color: '#b0b0b0', weight: 16, stats: { attack: 4, hp: 25, speed: 2 } },
            { name: 'Knight', type: 'companion', icon: '⚔️', rarity: 'uncommon', color: '#2ecc71', weight: 9, stats: { attack: 12, hp: 60, defense: 5 } },
            { name: 'Archer', type: 'companion', icon: '🏹', rarity: 'uncommon', color: '#2ecc71', weight: 8, stats: { attack: 15, hp: 40 } },
            { name: 'Healer', type: 'companion', icon: '💚', rarity: 'uncommon', color: '#2ecc71', weight: 8, stats: { attack: 5, hp: 50, heal: 10 } },
            { name: 'Dark Mage', type: 'companion', icon: '🧙', rarity: 'rare', color: '#3498db', weight: 5, stats: { attack: 25, hp: 70, defense: 8 } },
            { name: 'Samurai', type: 'companion', icon: '⚔️', rarity: 'rare', color: '#3498db', weight: 5, stats: { attack: 30, hp: 80 } },
            { name: 'Holy Priest', type: 'companion', icon: '✨', rarity: 'rare', color: '#3498db', weight: 5, stats: { attack: 10, hp: 90, heal: 20 } },
            { name: 'Phoenix Knight', type: 'companion', icon: '🔥', rarity: 'epic', color: '#9b59b6', weight: 3, stats: { attack: 45, hp: 120, defense: 15 } },
            { name: 'Ice Empress', type: 'companion', icon: '❄️', rarity: 'epic', color: '#9b59b6', weight: 2.5, stats: { attack: 40, hp: 100, defense: 20 } },
            { name: 'Shadow Assassin', type: 'companion', icon: '🗡️', rarity: 'epic', color: '#9b59b6', weight: 1.5, stats: { attack: 60, hp: 80, speed: 5 } },
            { name: 'Dragon Knight', type: 'companion', icon: '🐉', rarity: 'legendary', color: '#f1c40f', weight: 1.2, stats: { attack: 80, hp: 200, defense: 30 } },
            { name: 'Archangel', type: 'companion', icon: '👼', rarity: 'legendary', color: '#f1c40f', weight: 1, stats: { attack: 60, hp: 180, heal: 40, defense: 25 } },
            { name: 'Void Emperor', type: 'companion', icon: '👁️', rarity: 'legendary', color: '#f1c40f', weight: 0.8, stats: { attack: 100, hp: 150, defense: 20 } },
        ],
    },
};

// Summon a single item from a banner pool (weighted random)
export const summonFromBanner = (banner, pityCounter = 0) => {
    const pool = banner.pool;
    if (pityCounter >= 50) {
        const legendaries = pool.filter(i => i.rarity === 'legendary');
        const pick = legendaries[Math.floor(Math.random() * legendaries.length)];
        return { ...pick, id: Math.random().toString(36).substr(2, 9), count: 1 };
    }
    if (pityCounter >= 10 && pityCounter % 10 === 0) {
        const epics = pool.filter(i => i.rarity === 'epic' || i.rarity === 'legendary');
        const pick = epics[Math.floor(Math.random() * epics.length)];
        return { ...pick, id: Math.random().toString(36).substr(2, 9), count: 1 };
    }
    const totalWeight = pool.reduce((s, i) => s + i.weight, 0);
    let roll = Math.random() * totalWeight;
    for (const item of pool) {
        roll -= item.weight;
        if (roll <= 0) return { ...item, id: Math.random().toString(36).substr(2, 9), count: 1 };
    }
    return { ...pool[0], id: Math.random().toString(36).substr(2, 9), count: 1 };
};

// === CRAFT RECIPES (simplified — real upgrade handled by upgradeItem in items.js) ===
export const CRAFT_RECIPES = [
    { id: 'combine_3', name: 'Combine 3 Items', desc: 'Combine 3 same-rarity gear into 1 higher rarity', icon: '🔮', inputCount: 3, requireSameRarity: true },
    { id: 'upgrade_scroll', name: 'Upgrade +1', desc: 'Use an Upgrade Scroll to enhance gear (+1). Can fail and destroy at +6+!', icon: '📜', requireScroll: 'upgrade_scroll' },
    { id: 'luck_upgrade', name: 'Lucky Upgrade +1', desc: 'Use a Luck Scroll for guaranteed success. No risk!', icon: '🍀', requireScroll: 'luck_scroll' },
];

// Rarity upgrade order
export const RARITY_ORDER = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];
export const RARITY_COLORS = { common: '#b0b0b0', uncommon: '#2ecc71', rare: '#3498db', epic: '#9b59b6', legendary: '#f1c40f', mythic: '#e74c3c' };
