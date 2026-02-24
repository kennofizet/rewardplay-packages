import { TILES } from '../tiles';
import { ENEMIES } from './enemies';

// Simple Cellular Automata or Random Walker for Dungeons
const generateDungeonMap = (id, level, width = 50, height = 50) => {
    const map = {
        id,
        name: `Abyss Floor ${level}`,
        width,
        height,
        layers: {
            ground: new Array(width * height).fill(TILES.MOUNTAIN), // Walls default
            objects: new Array(width * height).fill(TILES.EMPTY)
        },
        teleports: [],
        enemySpawns: [], // Helper for engine
        level: level
    };

    // Dig Rooms
    const rooms = [];
    const minSize = 4, maxSize = 10;

    for (let i = 0; i < 20; i++) {
        const w = Math.floor(Math.random() * (maxSize - minSize) + minSize);
        const h = Math.floor(Math.random() * (maxSize - minSize) + minSize);
        const x = Math.floor(Math.random() * (width - w - 2) + 1);
        const y = Math.floor(Math.random() * (height - h - 2) + 1);

        const newRoom = { x, y, w, h };

        // Collision free (simple)
        let failed = false;
        for (const r of rooms) {
            if (x < r.x + r.w && x + w > r.x && y < r.y + r.h && y + h > r.y) {
                failed = true; break;
            }
        }

        if (!failed) {
            rooms.push(newRoom);
            // Dig ground
            for (let ry = y; ry < y + h; ry++) {
                for (let rx = x; rx < x + w; rx++) {
                    map.layers.ground[ry * width + rx] = TILES.PATH; // Floor
                }
            }
        }
    }

    // Corridors (MST or random connect would be better, simply connecting center to center for now)
    for (let i = 0; i < rooms.length - 1; i++) {
        const r1 = rooms[i];
        const r2 = rooms[i + 1];
        const c1x = Math.floor(r1.x + r1.w / 2);
        const c1y = Math.floor(r1.y + r1.h / 2);
        const c2x = Math.floor(r2.x + r2.w / 2);
        const c2y = Math.floor(r2.y + r2.h / 2);

        // Horizontal then Vertical dig
        const minX = Math.min(c1x, c2x), maxX = Math.max(c1x, c2x);
        for (let x = minX; x <= maxX; x++) map.layers.ground[c1y * width + x] = TILES.PATH;

        const minY = Math.min(c1y, c2y), maxY = Math.max(c1y, c2y);
        for (let y = minY; y <= maxY; y++) map.layers.ground[y * width + c2x] = TILES.PATH;
    }

    // Entrance (Room 0)
    const start = rooms[0];
    map.startX = Math.floor(start.x + start.w / 2);
    map.startY = Math.floor(start.y + start.h / 2);

    // Exit (Last Room)
    const end = rooms[rooms.length - 1];
    const ex = Math.floor(end.x + end.w / 2);
    const ey = Math.floor(end.y + end.h / 2);
    map.layers.objects[ey * width + ex] = TILES.TELEPORT;
    map.teleports.push({ x: ex, y: ey, targetMapId: id + 1, type: 'dungeon_next' }); // Procedural Update Logic needed in engine

    // Decoration & Enemies
    rooms.forEach((r, idx) => {
        if (idx === 0) return; // Skip spawn
        // Chance for enemies
        if (Math.random() > 0.3) {
            const ex = Math.floor(r.x + Math.random() * r.w);
            const ey = Math.floor(r.y + Math.random() * r.h);
            map.enemySpawns.push({ x: ex, y: ey, type: ENEMIES.SKELETON });
        }
        // Chance for crystals
        if (Math.random() > 0.7) {
            const cx = Math.floor(r.x + Math.random() * r.w);
            const cy = Math.floor(r.y + Math.random() * r.h);
            map.layers.objects[cy * width + cx] = TILES.CRYSTAL;
        }
    });

    return map;
};

// Map Management Wrapper
export const MapManager = {
    staticMaps: {}, // Loaded from maps.js
    dungeonMaps: {},

    getMap(id) {
        // Convention: ID > 100 is dungeon level ID-100
        if (id > 100) {
            if (!this.dungeonMaps[id]) {
                this.dungeonMaps[id] = generateDungeonMap(id, id - 100);
            }
            return this.dungeonMaps[id];
        }
        return this.staticMaps[id];
    },

    init(staticMaps) {
        this.staticMaps = staticMaps;
    }
};
