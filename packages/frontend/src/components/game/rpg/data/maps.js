import { TILES } from '../tiles';
import { ENEMIES } from './enemies';
import { BOSSES } from './bosses';
import { NPCS } from './npcs';

// ==========================================
// ECLIPSE: SHATTERED REALM - MU-STYLE WORLD MAPS
// Full procedural generation, 7 zones
// ==========================================

const setTile = (map, x, y, tile, layer = 'objects') => {
    if (x >= 0 && x < map.width && y >= 0 && y < map.height) {
        map.layers[layer][y * map.width + x] = tile;
    }
};

const fillRect = (map, x, y, w, h, tile, layer = 'ground') => {
    for (let iy = y; iy < y + h; iy++)
        for (let ix = x; ix < x + w; ix++)
            setTile(map, ix, iy, tile, layer);
};

const drawCircle = (map, cx, cy, r, tile, layer = 'objects') => {
    for (let y = -r; y <= r; y++)
        for (let x = -r; x <= r; x++)
            if (x * x + y * y <= r * r) setTile(map, cx + x, cy + y, tile, layer);
};

const drawRing = (map, cx, cy, r, tile, layer = 'objects') => {
    for (let y = -r; y <= r; y++)
        for (let x = -r; x <= r; x++) {
            const d = x * x + y * y;
            if (d <= r * r && d >= (r - 1) * (r - 1)) setTile(map, cx + x, cy + y, tile, layer);
        }
};

const createMap = (id, name, width, height, baseTile = TILES.GRASS) => ({
    id, name, width, height,
    layers: {
        ground: new Array(width * height).fill(baseTile),
        objects: new Array(width * height).fill(TILES.EMPTY),
    },
    teleports: [],
    npcs: [],
    enemies: [],
    enemySpawns: [],
    botSpawns: [],
});

// Helper: random walkable position within bounds
const randPos = (minX, maxX, minY, maxY) => ({
    x: minX + Math.floor(Math.random() * (maxX - minX)),
    y: minY + Math.floor(Math.random() * (maxY - minY)),
});

// ==========================================
// MAP 1: LORENCIA (Hub Town + Fields)
// MU Online starter town - green meadow
// ==========================================
const generateLorencia = () => {
    const map = createMap(1, "Lorencia", 100, 80, TILES.GRASS);

    // === TOWN AREA (center-left quadrant) ===
    // Main plaza
    fillRect(map, 30, 30, 20, 15, TILES.PATH, 'ground');
    // Central fountain
    drawCircle(map, 40, 37, 3, TILES.WATER, 'ground');
    setTile(map, 40, 37, TILES.CRYSTAL, 'objects');

    // North-South main road
    fillRect(map, 39, 5, 3, 70, TILES.PATH, 'ground');
    // East-West main road
    fillRect(map, 10, 36, 80, 3, TILES.PATH, 'ground');

    // Town buildings
    const buildings = [
        { x: 32, y: 22, t: TILES.SHOP },  // Weapon Shop
        { x: 38, y: 22, t: TILES.SHOP },  // Armor Shop
        { x: 44, y: 22, t: TILES.SHOP },  // Potion Shop
        { x: 32, y: 46, t: TILES.HOUSE }, // Inn
        { x: 38, y: 46, t: TILES.HOUSE }, // Guild Hall
        { x: 44, y: 46, t: TILES.HOUSE }, // Storage
        { x: 25, y: 30, t: TILES.HOUSE }, // Residence
        { x: 25, y: 34, t: TILES.HOUSE },
        { x: 25, y: 38, t: TILES.HOUSE },
        { x: 52, y: 30, t: TILES.HOUSE },
        { x: 52, y: 34, t: TILES.HOUSE },
        { x: 52, y: 38, t: TILES.HOUSE },
    ];
    buildings.forEach(b => {
        setTile(map, b.x, b.y, b.t, 'objects');
        setTile(map, b.x + 1, b.y, TILES.FLOWER, 'objects');
    });

    // === FUNCTIONAL Town NPCs ===
    // Weapon Merchant (in front of weapon shop)
    setTile(map, 32, 24, TILES.NPC, 'objects');
    map.npcs.push({ x: 32, y: 24, npcId: NPCS.WEAPON_MERCHANT.id });
    // Armor Merchant (in front of armor shop)
    setTile(map, 38, 24, TILES.NPC, 'objects');
    map.npcs.push({ x: 38, y: 24, npcId: NPCS.ARMOR_MERCHANT.id });
    // Potion Merchant (in front of potion shop)
    setTile(map, 44, 24, TILES.NPC, 'objects');
    map.npcs.push({ x: 44, y: 24, npcId: NPCS.POTION_MERCHANT.id });
    // Blacksmith (south side)
    setTile(map, 32, 48, TILES.ANVIL, 'objects');
    map.npcs.push({ x: 32, y: 48, npcId: NPCS.BLACKSMITH.id });
    // Storage Keeper (south side)
    setTile(map, 44, 48, TILES.STORAGE, 'objects');
    map.npcs.push({ x: 44, y: 48, npcId: NPCS.STORAGE_KEEPER.id });
    // Town Elder (plaza center)
    setTile(map, 40, 34, TILES.NPC, 'objects');
    map.npcs.push({ x: 40, y: 34, npcId: NPCS.QUEST_ELDER.id });

    // Gardens & decoration
    for (let i = 0; i < 40; i++) {
        const gx = 28 + Math.floor(Math.random() * 24);
        const gy = 28 + Math.floor(Math.random() * 18);
        if (map.layers.objects[gy * map.width + gx] === TILES.EMPTY)
            setTile(map, gx, gy, Math.random() > 0.5 ? TILES.FLOWER : TILES.BUSH, 'objects');
    }

    // Town walls
    fillRect(map, 20, 18, 40, 1, TILES.FENCE, 'objects');
    fillRect(map, 20, 50, 40, 1, TILES.FENCE, 'objects');
    for (let y = 18; y <= 50; y++) {
        setTile(map, 20, y, TILES.FENCE, 'objects');
        setTile(map, 59, y, TILES.FENCE, 'objects');
    }
    // Town gates
    fillRect(map, 38, 18, 4, 1, TILES.PATH, 'objects'); // North gate
    fillRect(map, 38, 50, 4, 1, TILES.PATH, 'objects'); // South gate
    fillRect(map, 20, 36, 1, 3, TILES.PATH, 'objects'); // West gate
    fillRect(map, 59, 36, 1, 3, TILES.PATH, 'objects'); // East gate

    // === HUNTING GROUNDS (outside town) ===
    // Scattered trees
    for (let i = 0; i < 150; i++) {
        const tx = Math.floor(Math.random() * 100);
        const ty = Math.floor(Math.random() * 80);
        if (tx < 20 || tx > 59 || ty < 18 || ty > 50) {
            if (map.layers.objects[ty * map.width + tx] === TILES.EMPTY)
                setTile(map, tx, ty, TILES.TREE, 'objects');
        }
    }

    // Small ponds
    for (let p = 0; p < 4; p++) {
        const px = p < 2 ? 8 + Math.floor(Math.random() * 10) : 70 + Math.floor(Math.random() * 15);
        const py = 10 + Math.floor(Math.random() * 55);
        drawCircle(map, px, py, 2, TILES.WATER, 'ground');
        setTile(map, px, py, TILES.WATER_LILY, 'objects');
    }

    // Map border mountains
    for (let x = 0; x < 100; x++) { setTile(map, x, 0, TILES.MOUNTAIN, 'objects'); setTile(map, x, 79, TILES.MOUNTAIN, 'objects'); }
    for (let y = 0; y < 80; y++) { setTile(map, 0, y, TILES.MOUNTAIN, 'objects'); setTile(map, 99, y, TILES.MOUNTAIN, 'objects'); }

    // === ENEMY SPAWNS (outside town) ===
    // NW zone - Budge Dragons
    for (let i = 0; i < 15; i++) map.enemySpawns.push({ ...randPos(3, 18, 3, 16), type: ENEMIES.BUDGE_DRAGON });
    for (let i = 0; i < 12; i++) map.enemySpawns.push({ ...randPos(3, 18, 3, 16), type: ENEMIES.SPIDER });
    // NE zone - Hounds
    for (let i = 0; i < 12; i++) map.enemySpawns.push({ ...randPos(62, 95, 3, 16), type: ENEMIES.HOUND });
    for (let i = 0; i < 10; i++) map.enemySpawns.push({ ...randPos(62, 95, 3, 16), type: ENEMIES.SPIDER });
    // SW zone - Bull Fighters
    for (let i = 0; i < 12; i++) map.enemySpawns.push({ ...randPos(3, 18, 53, 75), type: ENEMIES.BULL_FIGHTER });
    for (let i = 0; i < 8; i++) map.enemySpawns.push({ ...randPos(3, 18, 53, 75), type: ENEMIES.BUDGE_DRAGON });
    // SE zone - Elf Scouts
    for (let i = 0; i < 10; i++) map.enemySpawns.push({ ...randPos(62, 95, 53, 75), type: ENEMIES.ELF_SCOUT });
    for (let i = 0; i < 10; i++) map.enemySpawns.push({ ...randPos(62, 95, 53, 75), type: ENEMIES.BULL_FIGHTER });
    // Boss
    map.enemySpawns.push({ x: 85, y: 10, type: BOSSES.GOLDEN_BUDGE_DRAGON });

    // === BOT SPAWNS ===
    map.botSpawns = [{ x: 35, y: 35 }, { x: 45, y: 35 }, { x: 40, y: 40 }, { x: 43, y: 33 }];

    // === TELEPORTS ===
    // North → Dungeon (Map 2)
    for (let x = 38; x <= 41; x++) { setTile(map, x, 0, TILES.TELEPORT, 'objects'); map.teleports.push({ x, y: 0, targetMapId: 2, targetX: 25, targetY: 58 }); }
    // East → Devias (Map 3)
    for (let y = 36; y <= 38; y++) { setTile(map, 99, y, TILES.TELEPORT, 'objects'); map.teleports.push({ x: 99, y, targetMapId: 3, targetX: 2, targetY: 40 }); }
    // South → Noria (Map 4)
    for (let x = 38; x <= 41; x++) { setTile(map, x, 79, TILES.TELEPORT, 'objects'); map.teleports.push({ x, y: 79, targetMapId: 4, targetX: 40, targetY: 2 }); }
    // West → Lost Tower (Map 5)
    for (let y = 36; y <= 38; y++) { setTile(map, 0, y, TILES.TELEPORT, 'objects'); map.teleports.push({ x: 0, y, targetMapId: 5, targetX: 58, targetY: 30 }); }
    // House Portal (near inn, south wall)
    setTile(map, 36, 50, TILES.TELEPORT, 'objects');
    map.teleports.push({ x: 36, y: 50, targetMapId: 8, targetX: 15, targetY: 22 });
    // Tree of Summon Portal (near east gate)
    setTile(map, 57, 37, TILES.TELEPORT, 'objects');
    map.teleports.push({ x: 57, y: 37, targetMapId: 9, targetX: 25, targetY: 38 });

    // Signs near gates
    setTile(map, 37, 17, TILES.SIGN, 'objects');
    setTile(map, 37, 51, TILES.SIGN, 'objects');
    setTile(map, 19, 35, TILES.SIGN, 'objects');
    setTile(map, 60, 35, TILES.SIGN, 'objects');

    return map;
};

// ==========================================
// MAP 2: DUNGEON (Underground Dark Zone)
// ==========================================
const generateDungeon = () => {
    const map = createMap(2, "Dungeon", 80, 60, TILES.MOUNTAIN);

    // Carve main corridors
    fillRect(map, 10, 28, 60, 4, TILES.PATH, 'ground'); // E-W main
    fillRect(map, 24, 10, 4, 40, TILES.PATH, 'ground'); // N-S left
    fillRect(map, 50, 10, 4, 40, TILES.PATH, 'ground'); // N-S right

    // Rooms
    const rooms = [
        { x: 12, y: 12, w: 16, h: 12 }, // NW room
        { x: 40, y: 8, w: 18, h: 14 },  // NE room
        { x: 12, y: 38, w: 16, h: 14 }, // SW room
        { x: 40, y: 38, w: 18, h: 14 }, // SE room (boss)
        { x: 30, y: 20, w: 14, h: 10 }, // Central room
    ];
    rooms.forEach(r => {
        fillRect(map, r.x, r.y, r.w, r.h, TILES.PATH, 'ground');
        // Room border
        for (let x = r.x; x < r.x + r.w; x++) {
            setTile(map, x, r.y, TILES.FENCE, 'objects');
            setTile(map, x, r.y + r.h - 1, TILES.FENCE, 'objects');
        }
        for (let y = r.y; y < r.y + r.h; y++) {
            setTile(map, r.x, y, TILES.FENCE, 'objects');
            setTile(map, r.x + r.w - 1, y, TILES.FENCE, 'objects');
        }
        // Doorways
        setTile(map, r.x + Math.floor(r.w / 2), r.y, TILES.EMPTY, 'objects');
        setTile(map, r.x + Math.floor(r.w / 2), r.y + r.h - 1, TILES.EMPTY, 'objects');
        setTile(map, r.x, r.y + Math.floor(r.h / 2), TILES.EMPTY, 'objects');
        setTile(map, r.x + r.w - 1, r.y + Math.floor(r.h / 2), TILES.EMPTY, 'objects');
    });

    // Crystals as light sources
    for (let i = 0; i < 20; i++) {
        const rx = 10 + Math.floor(Math.random() * 60);
        const ry = 8 + Math.floor(Math.random() * 44);
        if (map.layers.ground[ry * map.width + rx] === TILES.PATH && map.layers.objects[ry * map.width + rx] === TILES.EMPTY)
            setTile(map, rx, ry, TILES.CRYSTAL, 'objects');
    }

    // Water pools (blood pools)
    drawCircle(map, 37, 25, 2, TILES.WATER, 'ground');
    drawCircle(map, 20, 44, 2, TILES.WATER, 'ground');

    // Enemies per room
    // NW Room - Skeletons
    for (let i = 0; i < 12; i++) map.enemySpawns.push({ ...randPos(14, 26, 14, 22), type: ENEMIES.SKELETON });
    for (let i = 0; i < 8; i++) map.enemySpawns.push({ ...randPos(14, 26, 14, 22), type: ENEMIES.LARVA });
    // NE Room - Lichs
    for (let i = 0; i < 10; i++) map.enemySpawns.push({ ...randPos(42, 56, 10, 20), type: ENEMIES.LICH });
    for (let i = 0; i < 6; i++) map.enemySpawns.push({ ...randPos(42, 56, 10, 20), type: ENEMIES.HELL_SPIDER });
    // SW Room - Hell Spiders
    for (let i = 0; i < 12; i++) map.enemySpawns.push({ ...randPos(14, 26, 40, 50), type: ENEMIES.HELL_SPIDER });
    for (let i = 0; i < 8; i++) map.enemySpawns.push({ ...randPos(14, 26, 40, 50), type: ENEMIES.SKELETON });
    // SE Room - Boss Room
    for (let i = 0; i < 6; i++) map.enemySpawns.push({ ...randPos(42, 56, 40, 50), type: ENEMIES.LICH });
    map.enemySpawns.push({ x: 49, y: 45, type: BOSSES.GORGON });
    // Corridors
    for (let i = 0; i < 15; i++) map.enemySpawns.push({ ...randPos(12, 68, 28, 32), type: ENEMIES.LARVA });

    // Bots
    map.botSpawns = [{ x: 36, y: 24 }, { x: 38, y: 26 }, { x: 34, y: 26 }];

    // Teleports
    setTile(map, 25, 59, TILES.TELEPORT, 'objects');
    map.teleports.push({ x: 25, y: 59, targetMapId: 1, targetX: 40, targetY: 2 }); // → Lorencia

    return map;
};

// ==========================================
// MAP 3: DEVIAS (Snowy Mountain Region)
// ==========================================
const generateDevias = () => {
    const map = createMap(3, "Devias", 90, 70, TILES.GRASS_VARIANT);

    // Snow areas (using mountain tile for snow ground)
    fillRect(map, 0, 0, 90, 30, TILES.MOUNTAIN, 'ground'); // Northern snow
    // Transition zone
    fillRect(map, 0, 30, 90, 5, TILES.PATH, 'ground');

    // Town area (center)
    fillRect(map, 30, 35, 30, 20, TILES.PATH, 'ground');
    // Town buildings
    for (let i = 0; i < 6; i++) {
        setTile(map, 33 + i * 4, 38, TILES.SHOP, 'objects');
        setTile(map, 33 + i * 4, 49, TILES.HOUSE, 'objects');
    }
    // Town fountain
    drawCircle(map, 45, 44, 2, TILES.WATER, 'ground');
    setTile(map, 45, 44, TILES.CRYSTAL, 'objects');

    // Roads
    fillRect(map, 44, 0, 3, 70, TILES.PATH, 'ground');
    fillRect(map, 0, 44, 90, 3, TILES.PATH, 'ground');

    // Ice lakes
    drawCircle(map, 20, 15, 6, TILES.WATER, 'ground');
    drawCircle(map, 70, 12, 5, TILES.WATER, 'ground');
    for (let i = 0; i < 8; i++) {
        setTile(map, 17 + Math.floor(Math.random() * 7), 12 + Math.floor(Math.random() * 7), TILES.WATER_LILY, 'objects');
    }

    // Pine forests (using trees)
    for (let i = 0; i < 120; i++) {
        const tx = Math.floor(Math.random() * 90);
        const ty = Math.floor(Math.random() * 70);
        if (map.layers.objects[ty * map.width + tx] === TILES.EMPTY && map.layers.ground[ty * map.width + tx] !== TILES.WATER) {
            if (tx < 30 || tx > 59 || ty < 35 || ty > 54)
                setTile(map, tx, ty, TILES.TREE, 'objects');
        }
    }

    // Mountain barriers
    for (let x = 0; x < 90; x++) { setTile(map, x, 0, TILES.FENCE, 'objects'); setTile(map, x, 69, TILES.FENCE, 'objects'); }
    for (let y = 0; y < 70; y++) { setTile(map, 0, y, TILES.FENCE, 'objects'); setTile(map, 89, y, TILES.FENCE, 'objects'); }

    // === ENEMIES ===
    // North snow - Yetis + Ice Archers
    for (let i = 0; i < 15; i++) map.enemySpawns.push({ ...randPos(5, 40, 3, 25), type: ENEMIES.YETI });
    for (let i = 0; i < 12; i++) map.enemySpawns.push({ ...randPos(5, 40, 3, 25), type: ENEMIES.ICE_ARCHER });
    // NE - Ice Queens + Frozen Golems
    for (let i = 0; i < 10; i++) map.enemySpawns.push({ ...randPos(50, 85, 3, 25), type: ENEMIES.ICE_QUEEN });
    for (let i = 0; i < 6; i++) map.enemySpawns.push({ ...randPos(50, 85, 3, 25), type: ENEMIES.FROZEN_GOLEM });
    // South fields
    for (let i = 0; i < 12; i++) map.enemySpawns.push({ ...randPos(5, 85, 55, 66), type: ENEMIES.ICE_ARCHER });
    for (let i = 0; i < 8; i++) map.enemySpawns.push({ ...randPos(5, 85, 55, 66), type: ENEMIES.YETI });
    // Boss
    map.enemySpawns.push({ x: 75, y: 8, type: BOSSES.ICE_DRAGON });

    // Bots
    map.botSpawns = [{ x: 43, y: 42 }, { x: 47, y: 42 }, { x: 45, y: 46 }, { x: 42, y: 45 }];

    // Teleports
    for (let y = 39; y <= 41; y++) { setTile(map, 0, y, TILES.TELEPORT, 'objects'); map.teleports.push({ x: 0, y, targetMapId: 1, targetX: 97, targetY: 37 }); }
    // → Atlans
    for (let x = 44; x <= 46; x++) { setTile(map, x, 69, TILES.TELEPORT, 'objects'); map.teleports.push({ x, y: 69, targetMapId: 6, targetX: 40, targetY: 2 }); }

    return map;
};

// ==========================================
// MAP 4: NORIA (Fairy Forest)
// ==========================================
const generateNoria = () => {
    const map = createMap(4, "Noria", 80, 70, TILES.GRASS);

    // Dense mushroom forests
    for (let i = 0; i < 100; i++) {
        const tx = Math.floor(Math.random() * 80);
        const ty = Math.floor(Math.random() * 70);
        if (map.layers.objects[ty * map.width + tx] === TILES.EMPTY)
            setTile(map, tx, ty, Math.random() > 0.4 ? TILES.TREE : TILES.MUSHROOM, 'objects');
    }

    // Fairy village (center)
    fillRect(map, 25, 25, 30, 20, TILES.PATH, 'ground');
    drawCircle(map, 40, 35, 8, TILES.GRASS, 'ground');
    // Buildings - mushroom houses
    const noriaBuildings = [
        { x: 28, y: 28 }, { x: 34, y: 28 }, { x: 46, y: 28 },
        { x: 28, y: 40 }, { x: 34, y: 40 }, { x: 46, y: 40 },
    ];
    noriaBuildings.forEach(b => {
        setTile(map, b.x, b.y, TILES.HOUSE, 'objects');
        setTile(map, b.x + 1, b.y + 1, TILES.MUSHROOM, 'objects');
    });
    setTile(map, 40, 28, TILES.SHOP, 'objects'); // Elf Shop
    setTile(map, 40, 40, TILES.SHOP, 'objects');

    // Magic crystals cluster
    for (let i = 0; i < 15; i++) {
        const cx = 35 + Math.floor(Math.random() * 10);
        const cy = 32 + Math.floor(Math.random() * 6);
        if (map.layers.objects[cy * map.width + cx] === TILES.EMPTY)
            setTile(map, cx, cy, TILES.CRYSTAL, 'objects');
    }

    // Flower meadows
    for (let i = 0; i < 50; i++) {
        const fx = Math.floor(Math.random() * 80);
        const fy = Math.floor(Math.random() * 70);
        if (map.layers.objects[fy * map.width + fx] === TILES.EMPTY)
            setTile(map, fx, fy, TILES.FLOWER, 'objects');
    }

    // River
    for (let x = 0; x < 80; x++) {
        const ry = 55 + Math.floor(Math.sin(x / 6) * 3);
        for (let w = 0; w < 3; w++) setTile(map, x, ry + w, TILES.WATER, 'ground');
    }
    // Bridges
    fillRect(map, 20, 53, 3, 8, TILES.PATH, 'ground');
    fillRect(map, 50, 53, 3, 8, TILES.PATH, 'ground');

    // Borders
    for (let x = 0; x < 80; x++) { setTile(map, x, 0, TILES.FENCE, 'objects'); setTile(map, x, 69, TILES.FENCE, 'objects'); }
    for (let y = 0; y < 70; y++) { setTile(map, 0, y, TILES.FENCE, 'objects'); setTile(map, 79, y, TILES.FENCE, 'objects'); }

    // Paths
    fillRect(map, 39, 0, 3, 70, TILES.PATH, 'ground');
    fillRect(map, 0, 35, 80, 3, TILES.PATH, 'ground');

    // NPCs
    setTile(map, 40, 35, TILES.BOT, 'objects'); // Fairy Elder

    // === ENEMIES ===
    // North area - Goblins
    for (let i = 0; i < 15; i++) map.enemySpawns.push({ ...randPos(5, 75, 3, 22), type: ENEMIES.GOBLIN });
    for (let i = 0; i < 8; i++) map.enemySpawns.push({ ...randPos(5, 75, 3, 22), type: ENEMIES.CHAIN_SCORPION });
    // East area - Elite Goblins
    for (let i = 0; i < 10; i++) map.enemySpawns.push({ ...randPos(55, 75, 25, 50), type: ENEMIES.ELITE_GOBLIN });
    for (let i = 0; i < 6; i++) map.enemySpawns.push({ ...randPos(55, 75, 25, 50), type: ENEMIES.FAIRY_ASSASSIN });
    // South of river
    for (let i = 0; i < 12; i++) map.enemySpawns.push({ ...randPos(5, 75, 60, 67), type: ENEMIES.CHAIN_SCORPION });
    for (let i = 0; i < 8; i++) map.enemySpawns.push({ ...randPos(5, 75, 60, 67), type: ENEMIES.ELITE_GOBLIN });
    // Boss
    map.enemySpawns.push({ x: 70, y: 10, type: BOSSES.SPIDER_QUEEN });

    // Bots
    map.botSpawns = [{ x: 38, y: 34 }, { x: 42, y: 34 }, { x: 40, y: 38 }];

    // Teleports
    for (let x = 39; x <= 41; x++) { setTile(map, x, 0, TILES.TELEPORT, 'objects'); map.teleports.push({ x, y: 0, targetMapId: 1, targetX: 40, targetY: 77 }); }
    // → Tarkan
    for (let y = 35; y <= 37; y++) { setTile(map, 79, y, TILES.TELEPORT, 'objects'); map.teleports.push({ x: 79, y, targetMapId: 7, targetX: 2, targetY: 35 }); }

    return map;
};

// ==========================================
// MAP 5: LOST TOWER (Undead Tower)
// ==========================================
const generateLostTower = () => {
    const map = createMap(5, "Lost Tower", 60, 60, TILES.MOUNTAIN);

    // Tower interior floor by floor
    // Ground floor
    fillRect(map, 10, 35, 40, 20, TILES.PATH, 'ground');
    // Second floor (mid)
    fillRect(map, 15, 15, 30, 18, TILES.PATH, 'ground');
    // Top floor (boss)
    fillRect(map, 20, 3, 20, 10, TILES.PATH, 'ground');

    // Connecting corridors (stairs)
    fillRect(map, 28, 33, 4, 3, TILES.PATH, 'ground'); // 1st to 2nd
    fillRect(map, 28, 13, 4, 3, TILES.PATH, 'ground'); // 2nd to 3rd

    // Room walls
    [[10, 35, 40, 20], [15, 15, 30, 18], [20, 3, 20, 10]].forEach(([rx, ry, rw, rh]) => {
        for (let x = rx; x < rx + rw; x++) { setTile(map, x, ry, TILES.FENCE, 'objects'); setTile(map, x, ry + rh - 1, TILES.FENCE, 'objects'); }
        for (let y = ry; y < ry + rh; y++) { setTile(map, rx, y, TILES.FENCE, 'objects'); setTile(map, rx + rw - 1, y, TILES.FENCE, 'objects'); }
        // Doorways
        setTile(map, rx + Math.floor(rw / 2), ry, TILES.EMPTY, 'objects');
        setTile(map, rx + Math.floor(rw / 2) + 1, ry, TILES.EMPTY, 'objects');
        setTile(map, rx + Math.floor(rw / 2), ry + rh - 1, TILES.EMPTY, 'objects');
        setTile(map, rx + Math.floor(rw / 2) + 1, ry + rh - 1, TILES.EMPTY, 'objects');
    });

    // Crystals as torches
    for (let i = 0; i < 25; i++) {
        const cx = 12 + Math.floor(Math.random() * 36);
        const cy = 5 + Math.floor(Math.random() * 48);
        if (map.layers.ground[cy * map.width + cx] === TILES.PATH && map.layers.objects[cy * map.width + cx] === TILES.EMPTY)
            setTile(map, cx, cy, TILES.CRYSTAL, 'objects');
    }

    // === ENEMIES ===
    // Ground floor
    for (let i = 0; i < 15; i++) map.enemySpawns.push({ ...randPos(12, 48, 37, 53), type: ENEMIES.IRON_KNIGHT });
    for (let i = 0; i < 10; i++) map.enemySpawns.push({ ...randPos(12, 48, 37, 53), type: ENEMIES.SHADOW_PHANTOM });
    // Second floor
    for (let i = 0; i < 12; i++) map.enemySpawns.push({ ...randPos(17, 43, 17, 31), type: ENEMIES.CURSED_WIZARD });
    for (let i = 0; i < 8; i++) map.enemySpawns.push({ ...randPos(17, 43, 17, 31), type: ENEMIES.DEATH_KNIGHT });
    // Top floor - Boss
    for (let i = 0; i < 6; i++) map.enemySpawns.push({ ...randPos(22, 38, 5, 11), type: ENEMIES.CURSED_WIZARD });
    map.enemySpawns.push({ x: 30, y: 8, type: BOSSES.BALROG });

    // Bots
    map.botSpawns = [{ x: 30, y: 45 }, { x: 25, y: 42 }, { x: 35, y: 42 }];

    // Teleports
    setTile(map, 59, 30, TILES.TELEPORT, 'objects');
    map.teleports.push({ x: 59, y: 30, targetMapId: 1, targetX: 2, targetY: 37 }); // → Lorencia
    setTile(map, 30, 3, TILES.TELEPORT, 'objects');
    map.teleports.push({ x: 30, y: 3, targetMapId: 6, targetX: 40, targetY: 58 }); // → Atlans

    return map;
};

// ==========================================
// MAP 6: ATLANS (Underwater/Coastal)
// ==========================================
const generateAtlans = () => {
    const map = createMap(6, "Atlans", 90, 60, TILES.WATER);

    // Island/platforms
    const islands = [
        { x: 15, y: 15, r: 10 }, // NW island
        { x: 45, y: 10, r: 8 },  // N central
        { x: 75, y: 15, r: 9 },  // NE island
        { x: 20, y: 40, r: 12 }, // SW main island
        { x: 50, y: 35, r: 7 },  // Central
        { x: 75, y: 42, r: 11 }, // SE island
        { x: 45, y: 55, r: 6 },  // S dock
    ];
    islands.forEach(isl => {
        drawCircle(map, isl.x, isl.y, isl.r, TILES.GRASS, 'ground');
        drawCircle(map, isl.x, isl.y, isl.r - 1, TILES.PATH, 'ground');
    });

    // Bridges connecting islands
    fillRect(map, 25, 14, 15, 2, TILES.PATH, 'ground'); // NW → N
    fillRect(map, 53, 12, 17, 2, TILES.PATH, 'ground'); // N → NE
    fillRect(map, 19, 18, 2, 20, TILES.PATH, 'ground'); // NW → SW
    fillRect(map, 31, 39, 14, 2, TILES.PATH, 'ground'); // SW → Central
    fillRect(map, 56, 37, 14, 2, TILES.PATH, 'ground'); // Central → SE
    fillRect(map, 49, 17, 2, 16, TILES.PATH, 'ground'); // N → Central
    fillRect(map, 44, 42, 2, 12, TILES.PATH, 'ground'); // Central → S dock

    // Tropical vegetation
    for (let i = 0; i < 60; i++) {
        const tx = Math.floor(Math.random() * 90);
        const ty = Math.floor(Math.random() * 60);
        if (map.layers.ground[ty * map.width + tx] !== TILES.WATER && map.layers.objects[ty * map.width + tx] === TILES.EMPTY)
            setTile(map, tx, ty, Math.random() > 0.5 ? TILES.TREE : TILES.FLOWER, 'objects');
    }

    // Water lilies
    for (let i = 0; i < 30; i++) {
        const lx = Math.floor(Math.random() * 90);
        const ly = Math.floor(Math.random() * 60);
        if (map.layers.ground[ly * map.width + lx] === TILES.WATER && map.layers.objects[ly * map.width + lx] === TILES.EMPTY)
            setTile(map, lx, ly, TILES.WATER_LILY, 'objects');
    }

    // Town on main SW island
    setTile(map, 18, 38, TILES.SHOP, 'objects');
    setTile(map, 22, 38, TILES.SHOP, 'objects');
    setTile(map, 18, 42, TILES.HOUSE, 'objects');
    setTile(map, 22, 42, TILES.HOUSE, 'objects');
    setTile(map, 20, 40, TILES.BOT, 'objects'); // Atlans Elder

    // Crystals
    setTile(map, 50, 35, TILES.CRYSTAL, 'objects');
    setTile(map, 75, 42, TILES.CRYSTAL, 'objects');

    // Borders
    for (let x = 0; x < 90; x++) { setTile(map, x, 0, TILES.MOUNTAIN, 'objects'); setTile(map, x, 59, TILES.MOUNTAIN, 'objects'); }
    for (let y = 0; y < 60; y++) { setTile(map, 0, y, TILES.MOUNTAIN, 'objects'); setTile(map, 89, y, TILES.MOUNTAIN, 'objects'); }

    // === ENEMIES ===
    // NW island
    for (let i = 0; i < 10; i++) map.enemySpawns.push({ ...randPos(8, 22, 8, 22), type: ENEMIES.SEA_SERPENT });
    for (let i = 0; i < 8; i++) map.enemySpawns.push({ ...randPos(8, 22, 8, 22), type: ENEMIES.PIRANHA });
    // NE island
    for (let i = 0; i < 10; i++) map.enemySpawns.push({ ...randPos(68, 82, 8, 22), type: ENEMIES.NEREID });
    for (let i = 0; i < 6; i++) map.enemySpawns.push({ ...randPos(68, 82, 8, 22), type: ENEMIES.BAHAMUT_CRAB });
    // SE island
    for (let i = 0; i < 12; i++) map.enemySpawns.push({ ...randPos(66, 84, 34, 50), type: ENEMIES.SEA_SERPENT });
    for (let i = 0; i < 8; i++) map.enemySpawns.push({ ...randPos(66, 84, 34, 50), type: ENEMIES.NEREID });
    // Boss
    map.enemySpawns.push({ x: 75, y: 45, type: BOSSES.HYDRA });

    // Bots
    map.botSpawns = [{ x: 19, y: 40 }, { x: 21, y: 40 }, { x: 20, y: 42 }, { x: 50, y: 35 }];

    // Teleports
    for (let x = 39; x <= 41; x++) { setTile(map, x, 0, TILES.TELEPORT, 'objects'); map.teleports.push({ x, y: 0, targetMapId: 3, targetX: 45, targetY: 67 }); }
    setTile(map, 40, 59, TILES.TELEPORT, 'objects');
    map.teleports.push({ x: 40, y: 59, targetMapId: 5, targetX: 30, targetY: 5 }); // → Lost Tower
    // → Tarkan
    for (let y = 14; y <= 16; y++) { setTile(map, 89, y, TILES.TELEPORT, 'objects'); map.teleports.push({ x: 89, y, targetMapId: 7, targetX: 2, targetY: 15 }); }

    return map;
};

// ==========================================
// MAP 7: TARKAN (Desert Wasteland)
// ==========================================
const generateTarkan = () => {
    const map = createMap(7, "Tarkan", 100, 80, TILES.PATH); // Sand = path color

    // Desert terrain variation
    for (let y = 0; y < 80; y++) {
        for (let x = 0; x < 100; x++) {
            if (Math.random() > 0.7)
                setTile(map, x, y, TILES.GRASS_VARIANT, 'ground'); // Darker sand patches
        }
    }

    // Oasis (center)
    drawCircle(map, 50, 40, 8, TILES.GRASS, 'ground');
    drawCircle(map, 50, 40, 4, TILES.WATER, 'ground');
    for (let i = 0; i < 12; i++) {
        const a = (Math.PI * 2 / 12) * i;
        const ox = Math.floor(50 + Math.cos(a) * 6);
        const oy = Math.floor(40 + Math.sin(a) * 6);
        setTile(map, ox, oy, TILES.TREE, 'objects');
    }
    setTile(map, 50, 40, TILES.WATER_LILY, 'objects');

    // Sand dunes (mountain tiles as large dunes)
    for (let i = 0; i < 25; i++) {
        const dx = 5 + Math.floor(Math.random() * 90);
        const dy = 5 + Math.floor(Math.random() * 70);
        if (Math.abs(dx - 50) > 12 || Math.abs(dy - 40) > 12) // Not near oasis
            drawCircle(map, dx, dy, 2 + Math.floor(Math.random() * 2), TILES.MOUNTAIN, 'objects');
    }

    // Desert camp (NW)
    fillRect(map, 10, 10, 15, 10, TILES.PATH, 'ground');
    setTile(map, 12, 12, TILES.HOUSE, 'objects');
    setTile(map, 18, 12, TILES.HOUSE, 'objects');
    setTile(map, 15, 15, TILES.SHOP, 'objects');
    setTile(map, 15, 13, TILES.BOT, 'objects');

    // Ruins (SE)
    fillRect(map, 65, 55, 20, 15, TILES.PATH, 'ground');
    for (let i = 0; i < 8; i++) {
        setTile(map, 67 + Math.floor(Math.random() * 16), 57 + Math.floor(Math.random() * 11), TILES.FENCE, 'objects');
    }
    for (let i = 0; i < 5; i++) {
        setTile(map, 68 + Math.floor(Math.random() * 14), 58 + Math.floor(Math.random() * 10), TILES.CRYSTAL, 'objects');
    }

    // Roads
    fillRect(map, 15, 20, 3, 60, TILES.PATH, 'ground'); // West road
    fillRect(map, 10, 38, 80, 3, TILES.PATH, 'ground');  // E-W road

    // Dead trees scattered
    for (let i = 0; i < 40; i++) {
        const tx = Math.floor(Math.random() * 100);
        const ty = Math.floor(Math.random() * 80);
        if (map.layers.objects[ty * map.width + tx] === TILES.EMPTY && (Math.abs(tx - 50) > 10 || Math.abs(ty - 40) > 10))
            setTile(map, tx, ty, Math.random() > 0.6 ? TILES.BUSH : TILES.SIGN, 'objects');
    }

    // Borders
    for (let x = 0; x < 100; x++) { setTile(map, x, 0, TILES.MOUNTAIN, 'objects'); setTile(map, x, 79, TILES.MOUNTAIN, 'objects'); }
    for (let y = 0; y < 80; y++) { setTile(map, 0, y, TILES.MOUNTAIN, 'objects'); setTile(map, 99, y, TILES.MOUNTAIN, 'objects'); }

    // === ENEMIES ===
    // NW desert
    for (let i = 0; i < 12; i++) map.enemySpawns.push({ ...randPos(25, 45, 5, 30), type: ENEMIES.MUTANT });
    for (let i = 0; i < 10; i++) map.enemySpawns.push({ ...randPos(25, 45, 5, 30), type: ENEMIES.IRON_WHEEL });
    // NE desert
    for (let i = 0; i < 10; i++) map.enemySpawns.push({ ...randPos(55, 95, 5, 30), type: ENEMIES.BLOODY_WOLF });
    for (let i = 0; i < 8; i++) map.enemySpawns.push({ ...randPos(55, 95, 5, 30), type: ENEMIES.MUTANT });
    // SW desert
    for (let i = 0; i < 12; i++) map.enemySpawns.push({ ...randPos(5, 45, 50, 75), type: ENEMIES.IRON_WHEEL });
    for (let i = 0; i < 8; i++) map.enemySpawns.push({ ...randPos(5, 45, 50, 75), type: ENEMIES.BLOODY_WOLF });
    // SE ruins - Zaikan area
    for (let i = 0; i < 10; i++) map.enemySpawns.push({ ...randPos(60, 88, 50, 68), type: ENEMIES.MUTANT });
    for (let i = 0; i < 6; i++) map.enemySpawns.push({ ...randPos(60, 88, 50, 68), type: ENEMIES.IRON_WHEEL });
    // Boss
    map.enemySpawns.push({ x: 75, y: 62, type: BOSSES.KUNDUN });

    // Bots
    map.botSpawns = [{ x: 13, y: 14 }, { x: 17, y: 14 }, { x: 49, y: 39 }, { x: 51, y: 41 }];

    // Teleports
    for (let y = 34; y <= 36; y++) { setTile(map, 0, y, TILES.TELEPORT, 'objects'); map.teleports.push({ x: 0, y, targetMapId: 4, targetX: 77, targetY: 36 }); }
    for (let y = 14; y <= 16; y++) { setTile(map, 0, y, TILES.TELEPORT, 'objects'); map.teleports.push({ x: 0, y, targetMapId: 6, targetX: 87, targetY: 15 }); }

    return map;
};

// ==========================================
// MAP 8: HOUSE (Safe Interior + Temple + Farm)
// ==========================================
const generateHouse = () => {
    const map = createMap(8, "House", 80, 60, TILES.GRASS);

    // ==============================
    // ZONE 1: HOUSE INTERIOR (NW)
    // ==============================
    fillRect(map, 2, 2, 30, 22, TILES.PATH, 'ground');
    // Walls
    for (let x = 1; x < 33; x++) { setTile(map, x, 1, TILES.FENCE, 'objects'); setTile(map, x, 24, TILES.FENCE, 'objects'); }
    for (let y = 1; y < 25; y++) { setTile(map, 1, y, TILES.FENCE, 'objects'); setTile(map, 32, y, TILES.FENCE, 'objects'); }
    // Doorway (south wall opening)
    setTile(map, 15, 24, TILES.EMPTY, 'objects');
    setTile(map, 16, 24, TILES.EMPTY, 'objects');
    setTile(map, 17, 24, TILES.EMPTY, 'objects');

    // Floor rug
    fillRect(map, 10, 8, 12, 8, TILES.GRASS_VARIANT, 'ground');
    drawCircle(map, 16, 12, 3, TILES.GRASS, 'ground');

    // Fireplace
    setTile(map, 16, 2, TILES.CRYSTAL, 'objects');
    setTile(map, 15, 2, TILES.FENCE, 'objects');
    setTile(map, 17, 2, TILES.FENCE, 'objects');

    // Furniture
    setTile(map, 3, 3, TILES.HOUSE, 'objects');
    setTile(map, 4, 3, TILES.HOUSE, 'objects');
    setTile(map, 29, 3, TILES.HOUSE, 'objects');
    setTile(map, 30, 3, TILES.HOUSE, 'objects');
    setTile(map, 3, 20, TILES.HOUSE, 'objects');
    setTile(map, 4, 20, TILES.HOUSE, 'objects');
    // Potted plants
    setTile(map, 3, 10, TILES.FLOWER, 'objects');
    setTile(map, 30, 10, TILES.FLOWER, 'objects');
    setTile(map, 3, 15, TILES.BUSH, 'objects');
    setTile(map, 30, 15, TILES.BUSH, 'objects');

    // Quest NPC
    setTile(map, 22, 6, TILES.NPC, 'objects');
    map.npcs.push({ x: 22, y: 6, npcId: NPCS.QUEST_ELDER.id });

    // Storage Chest
    setTile(map, 8, 6, TILES.STORAGE, 'objects');
    map.npcs.push({ x: 8, y: 6, npcId: NPCS.HOUSE_STORAGE.id });

    // ==============================
    // ZONE 2: TEMPLE OF DESCENDANTS (NE)
    // ==============================
    // Temple floor
    fillRect(map, 44, 2, 32, 24, TILES.PATH, 'ground');
    // Inner sanctum (special floor)
    fillRect(map, 52, 6, 16, 14, TILES.GRASS_VARIANT, 'ground');
    drawCircle(map, 60, 13, 5, TILES.GRASS, 'ground');
    drawCircle(map, 60, 13, 2, TILES.WATER, 'ground');

    // Temple walls
    for (let x = 43; x < 77; x++) { setTile(map, x, 1, TILES.FENCE, 'objects'); setTile(map, x, 26, TILES.FENCE, 'objects'); }
    for (let y = 1; y < 27; y++) { setTile(map, 43, y, TILES.FENCE, 'objects'); setTile(map, 76, y, TILES.FENCE, 'objects'); }
    // Temple entrance (south)
    setTile(map, 59, 26, TILES.EMPTY, 'objects');
    setTile(map, 60, 26, TILES.EMPTY, 'objects');
    setTile(map, 61, 26, TILES.EMPTY, 'objects');

    // Crystal pillars
    const pillarPositions = [
        [50, 5], [70, 5], [50, 21], [70, 21],
        [54, 9], [66, 9], [54, 17], [66, 17],
    ];
    pillarPositions.forEach(([px, py]) => setTile(map, px, py, TILES.CRYSTAL, 'objects'));

    // Decorative flowers inside temple
    for (let i = 0; i < 12; i++) {
        const fx = 46 + Math.floor(Math.random() * 28);
        const fy = 3 + Math.floor(Math.random() * 22);
        if (map.layers.objects[fy * map.width + fx] === TILES.EMPTY && map.layers.ground[fy * map.width + fx] !== TILES.WATER)
            setTile(map, fx, fy, TILES.FLOWER, 'objects');
    }

    // Temple Keeper NPC (center of sanctum)
    setTile(map, 60, 10, TILES.NPC, 'objects');
    map.npcs.push({ x: 60, y: 10, npcId: NPCS.TEMPLE_KEEPER.id });

    // ==============================
    // ZONE 3A: FARM (SW — Planting Area)
    // ==============================
    // Farm ground (brown soil area)
    fillRect(map, 2, 32, 28, 24, TILES.GRASS, 'ground');
    // Farm fence perimeter
    for (let x = 2; x < 30; x++) { setTile(map, x, 31, TILES.FENCE, 'objects'); setTile(map, x, 56, TILES.FENCE, 'objects'); }
    for (let y = 31; y <= 56; y++) { setTile(map, 1, y, TILES.FENCE, 'objects'); setTile(map, 30, y, TILES.FENCE, 'objects'); }
    // Farm entrance (north)
    setTile(map, 15, 31, TILES.EMPTY, 'objects');
    setTile(map, 16, 31, TILES.EMPTY, 'objects');

    // Farm soil grid: 6 rows × 10 columns of plantable soil
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 10; col++) {
            const sx = 4 + col * 2 + (col >= 5 ? 2 : 0); // gap in middle
            const sy = 34 + row * 3;
            setTile(map, sx, sy, TILES.FARM_SOIL, 'ground');
        }
    }

    // Farm decorations: water trough, scarecrow
    setTile(map, 15, 33, TILES.SIGN, 'objects'); // Farm sign
    drawCircle(map, 25, 48, 2, TILES.WATER, 'ground'); // water trough

    // Farm NPC (seed vendor)
    setTile(map, 5, 33, TILES.NPC, 'objects');
    map.npcs.push({ x: 5, y: 33, npcId: 'farm_vendor' });

    // ==============================
    // ZONE 3B: DEFENSE ZONE (PvZ Grid)
    // ==============================
    fillRect(map, 32, 32, 24, 24, TILES.GRASS_VARIANT, 'ground');

    // Defense grid: 5 lanes × 8 columns
    for (let lane = 0; lane < 5; lane++) {
        for (let col = 0; col < 8; col++) {
            const dx = 33 + col * 3;
            const dy = 34 + lane * 4;
            setTile(map, dx, dy, TILES.DEFENSE_SLOT, 'ground');
        }
    }

    // Defense zone fences (top and bottom only, right is open for zombies)
    for (let x = 32; x < 56; x++) { setTile(map, x, 31, TILES.FENCE, 'objects'); setTile(map, x, 56, TILES.FENCE, 'objects'); }
    // Lane separator lines (decorative bushes)
    for (let lane = 1; lane < 5; lane++) {
        const sepY = 33 + lane * 4;
        for (let x = 33; x < 56; x += 4) {
            if (map.layers.objects[sepY * map.width + x] === TILES.EMPTY)
                setTile(map, x, sepY, TILES.BUSH, 'objects');
        }
    }

    // ==============================
    // ZONE 3C: ZOMBIE SPAWN ZONE (right side)
    // ==============================
    fillRect(map, 58, 32, 20, 24, TILES.GRASS, 'ground');
    // Spooky trees at spawn edge
    for (let i = 0; i < 8; i++) {
        const ty = 33 + Math.floor(Math.random() * 22);
        if (map.layers.objects[ty * map.width + 76] === TILES.EMPTY)
            setTile(map, 76, ty, TILES.TREE, 'objects');
    }

    // No enemies in farm — zombies come from the defense system at night
    // (Farm enemies handled by farmEngine.js)

    // ==============================
    // CONNECTING PATHS
    // ==============================
    // Path from House to Farm (south)
    fillRect(map, 14, 24, 5, 8, TILES.PATH, 'ground');
    // Path from House area to Temple area (east)
    fillRect(map, 32, 12, 12, 3, TILES.PATH, 'ground');
    // Path from Temple to Farm
    fillRect(map, 58, 26, 4, 5, TILES.PATH, 'ground');
    // Main east-west path through Farm
    fillRect(map, 2, 29, 76, 2, TILES.PATH, 'ground');

    // ==============================
    // MAP BORDERS
    // ==============================
    for (let x = 0; x < 80; x++) { setTile(map, x, 0, TILES.MOUNTAIN, 'objects'); setTile(map, x, 59, TILES.MOUNTAIN, 'objects'); }
    for (let y = 0; y < 60; y++) { setTile(map, 0, y, TILES.MOUNTAIN, 'objects'); setTile(map, 79, y, TILES.MOUNTAIN, 'objects'); }

    // ==============================
    // TELEPORT (Exit → Lorencia)
    // ==============================
    setTile(map, 40, 59, TILES.TELEPORT, 'objects');
    map.teleports.push({ x: 40, y: 59, targetMapId: 1, targetX: 36, targetY: 49 });

    // No bots in house area
    map.botSpawns = [];

    return map;
};

// ==========================================
// MAP 9: TREE OF SUMMON (Gacha Sanctuary)
// ==========================================
const generateSummonTree = () => {
    const map = createMap(9, "Tree of Summon", 50, 40, TILES.GRASS);

    // Mystical clearing (center)
    drawCircle(map, 25, 20, 12, TILES.PATH, 'ground');
    drawCircle(map, 25, 20, 8, TILES.GRASS, 'ground');
    drawCircle(map, 25, 20, 4, TILES.GRASS_VARIANT, 'ground');

    // Grand Summon Tree (center)
    setTile(map, 25, 20, TILES.SUMMON_TREE, 'objects');
    map.npcs.push({ x: 25, y: 20, npcId: NPCS.SUMMON_KEEPER.id });
    // Tree canopy (ring of trees around center)
    drawRing(map, 25, 20, 6, TILES.TREE, 'objects');
    // Clear paths through the ring
    for (let d = 0; d < 4; d++) {
        const a = (Math.PI / 2) * d;
        for (let r = 4; r <= 7; r++) {
            const cx = 25 + Math.round(Math.cos(a) * r);
            const cy = 20 + Math.round(Math.sin(a) * r);
            if (map.layers.objects[cy * map.width + cx] === TILES.TREE)
                setTile(map, cx, cy, TILES.EMPTY, 'objects');
        }
    }

    // Magical crystal ring
    for (let i = 0; i < 8; i++) {
        const a = (Math.PI * 2 / 8) * i;
        const cx = 25 + Math.round(Math.cos(a) * 10);
        const cy = 20 + Math.round(Math.sin(a) * 10);
        if (map.layers.objects[cy * map.width + cx] === TILES.EMPTY)
            setTile(map, cx, cy, TILES.CRYSTAL, 'objects');
    }

    // Flower meadows
    for (let i = 0; i < 80; i++) {
        const fx = Math.floor(Math.random() * 50);
        const fy = Math.floor(Math.random() * 40);
        if (map.layers.objects[fy * map.width + fx] === TILES.EMPTY)
            setTile(map, fx, fy, Math.random() > 0.4 ? TILES.FLOWER : TILES.MUSHROOM, 'objects');
    }

    // Scattered trees around edges
    for (let i = 0; i < 60; i++) {
        const tx = Math.floor(Math.random() * 50);
        const ty = Math.floor(Math.random() * 40);
        const dist = Math.abs(tx - 25) + Math.abs(ty - 20);
        if (dist > 14 && map.layers.objects[ty * map.width + tx] === TILES.EMPTY)
            setTile(map, tx, ty, TILES.TREE, 'objects');
    }

    // Water features
    drawCircle(map, 10, 10, 3, TILES.WATER, 'ground');
    setTile(map, 10, 10, TILES.WATER_LILY, 'objects');
    drawCircle(map, 40, 30, 3, TILES.WATER, 'ground');
    setTile(map, 40, 30, TILES.WATER_LILY, 'objects');

    // Border
    for (let x = 0; x < 50; x++) { setTile(map, x, 0, TILES.FENCE, 'objects'); setTile(map, x, 39, TILES.FENCE, 'objects'); }
    for (let y = 0; y < 40; y++) { setTile(map, 0, y, TILES.FENCE, 'objects'); setTile(map, 49, y, TILES.FENCE, 'objects'); }

    // Teleport back to Lorencia
    setTile(map, 25, 39, TILES.TELEPORT, 'objects');
    map.teleports.push({ x: 25, y: 39, targetMapId: 1, targetX: 57, targetY: 38 });

    // Side paths
    fillRect(map, 24, 32, 3, 8, TILES.PATH, 'ground');
    fillRect(map, 15, 19, 20, 3, TILES.PATH, 'ground');

    // No enemies — sanctuary
    map.botSpawns = [];

    return map;
};

// ==========================================
// EXPORT
// ==========================================
const generateAllMaps = () => {
    const m = {};
    m[1] = generateLorencia();
    m[2] = generateDungeon();
    m[3] = generateDevias();
    m[4] = generateNoria();
    m[5] = generateLostTower();
    m[6] = generateAtlans();
    m[7] = generateTarkan();
    m[8] = generateHouse();
    m[9] = generateSummonTree();
    return m;
};

export const maps = generateAllMaps();

// Map metadata for the travel menu
export const MAP_LIST = [
    { id: 1, name: 'Lorencia', level: '1-30', desc: 'Starter town with green meadows', color: '#4caf50', icon: '🏰' },
    { id: 2, name: 'Dungeon', level: '15-50', desc: 'Dark underground labyrinth', color: '#5d4037', icon: '🏚️' },
    { id: 3, name: 'Devias', level: '25-60', desc: 'Frozen mountain region', color: '#90caf9', icon: '❄️' },
    { id: 4, name: 'Noria', level: '20-55', desc: 'Mystical fairy forest', color: '#66bb6a', icon: '🌿' },
    { id: 5, name: 'Lost Tower', level: '35-70', desc: 'Tower of the undead', color: '#7e57c2', icon: '🗼' },
    { id: 6, name: 'Atlans', level: '45-75', desc: 'Ocean islands & bridges', color: '#29b6f6', icon: '🌊' },
    { id: 7, name: 'Tarkan', level: '55-99', desc: 'Scorching desert wasteland', color: '#ff8f00', icon: '🏜️' },
    { id: 8, name: 'House', level: 'Safe', desc: 'Your home — quest NPC & storage', color: '#ff9800', icon: '🏠' },
    { id: 9, name: 'Tree of Summon', level: 'Safe', desc: 'Magical gacha sanctuary', color: '#aa00ff', icon: '🌳' },
];
