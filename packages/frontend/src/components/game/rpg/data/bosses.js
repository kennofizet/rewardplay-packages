import { TILES } from '../tiles';

// ==========================================
// BOSSES - MU Online Style Map Bosses
// ==========================================

export const BOSSES = {
    // MAP 1: LORENCIA
    GOLDEN_BUDGE_DRAGON: {
        id: 'golden_budge', name: '★ Golden Budge Dragon',
        tileId: TILES.BOSS,
        stats: { hp: 500, maxHp: 500, attack: 25, defense: 10, speed: 80, expReward: 150 },
        ai: 'chase', aggroRange: 10,
        skills: [
            { name: 'Fire Breath', damage: 20, effect: 'aoe_front', cooldown: 4000, color: '#ff8800', aoeRadius: 3 },
            { name: 'Tail Sweep', damage: 15, effect: 'nova', cooldown: 6000, color: '#ffaa44', aoeRadius: 2 }
        ]
    },

    // MAP 2: DUNGEON
    GORGON: {
        id: 'gorgon', name: '★ Gorgon',
        tileId: TILES.BOSS,
        stats: { hp: 800, maxHp: 800, attack: 35, defense: 14, speed: 60, expReward: 250 },
        ai: 'chase', aggroRange: 10,
        skills: [
            { name: 'Petrify Gaze', damage: 25, effect: 'debuff', cooldown: 5000, color: '#666688', range: 5 },
            { name: 'Snake Strike', damage: 30, effect: 'aoe_line', cooldown: 3000, color: '#44aa44', lineLength: 4 },
            { name: 'Poison Cloud', damage: 15, effect: 'aoe_circle', cooldown: 7000, color: '#88ff44', aoeRadius: 3 }
        ]
    },

    // MAP 3: DEVIAS
    ICE_DRAGON: {
        id: 'ice_dragon', name: '★ Ice Dragon',
        tileId: TILES.BOSS,
        stats: { hp: 1200, maxHp: 1200, attack: 40, defense: 20, speed: 70, expReward: 400 },
        ai: 'chase', aggroRange: 12,
        skills: [
            { name: 'Frozen Breath', damage: 30, effect: 'aoe_front', cooldown: 4000, color: '#88ddff', aoeRadius: 4 },
            { name: 'Ice Storm', damage: 25, effect: 'tornado', cooldown: 6000, color: '#aaccff', aoeRadius: 3 },
            { name: 'Absolute Zero', damage: 35, effect: 'nova', cooldown: 10000, color: '#ccddff', aoeRadius: 5 }
        ]
    },

    // MAP 4: NORIA
    SPIDER_QUEEN: {
        id: 'spider_queen', name: '★ Spider Queen',
        tileId: TILES.BOSS,
        stats: { hp: 900, maxHp: 900, attack: 32, defense: 12, speed: 90, expReward: 300 },
        ai: 'chase', aggroRange: 10,
        skills: [
            { name: 'Web Trap', damage: 10, effect: 'debuff', cooldown: 4000, color: '#cccccc', range: 5 },
            { name: 'Venom Rain', damage: 20, effect: 'meteor', cooldown: 6000, color: '#66cc22', aoeRadius: 3 },
            { name: 'Brood Swarm', damage: 18, effect: 'aoe_circle', cooldown: 5000, color: '#448822', aoeRadius: 3 }
        ]
    },

    // MAP 5: LOST TOWER
    BALROG: {
        id: 'balrog', name: '★ Balrog',
        tileId: TILES.BOSS,
        stats: { hp: 1500, maxHp: 1500, attack: 50, defense: 25, speed: 60, expReward: 500 },
        ai: 'chase', aggroRange: 10,
        skills: [
            { name: 'Infernal Slash', damage: 40, effect: 'aoe_front', cooldown: 3000, color: '#ff4400', aoeRadius: 3 },
            { name: 'Hellfire Rain', damage: 35, effect: 'meteor', cooldown: 6000, color: '#ff6600', aoeRadius: 4 },
            { name: 'Dark Explosion', damage: 30, effect: 'earthquake', cooldown: 8000, color: '#880000', aoeRadius: 4 }
        ]
    },

    // MAP 6: ATLANS
    HYDRA: {
        id: 'hydra', name: '★ Hydra',
        tileId: TILES.BOSS,
        stats: { hp: 1800, maxHp: 1800, attack: 45, defense: 18, speed: 50, expReward: 600 },
        ai: 'chase', aggroRange: 10,
        skills: [
            { name: 'Triple Head', damage: 35, effect: 'aoe_line', cooldown: 3000, color: '#4488ff', lineLength: 5 },
            { name: 'Tsunami', damage: 30, effect: 'nova', cooldown: 7000, color: '#2266cc', aoeRadius: 5 },
            { name: 'Water Prison', damage: 20, effect: 'tornado', cooldown: 5000, color: '#3399ff', aoeRadius: 3 }
        ]
    },

    // MAP 7: TARKAN
    KUNDUN: {
        id: 'kundun', name: '★★ Kundun',
        tileId: TILES.BOSS,
        stats: { hp: 3000, maxHp: 3000, attack: 60, defense: 30, speed: 50, expReward: 1000 },
        ai: 'chase', aggroRange: 15,
        skills: [
            { name: 'Death Ray', damage: 50, effect: 'aoe_line', cooldown: 4000, color: '#ff0000', lineLength: 6 },
            { name: 'Armageddon', damage: 40, effect: 'meteor', cooldown: 6000, color: '#ff4400', aoeRadius: 5 },
            { name: 'Dark Binding', damage: 30, effect: 'debuff', cooldown: 5000, color: '#440044', range: 6 },
            { name: 'World End', damage: 45, effect: 'earthquake', cooldown: 10000, color: '#880000', aoeRadius: 5 }
        ]
    }
};
