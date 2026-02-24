import { TILE_SIZE, TILES, TILE_COLORS, WALKABLE } from './tiles';
import { CLASSES } from './data/classes';
import { ENEMIES } from './data/enemies';
import { BOSSES } from './data/bosses';
import { generateLoot } from './data/items';
import { NPCS, SHOP_ITEMS, SUMMON_BANNERS } from './data/npcs';
import { CROP_LIST, DEFENSE_PLANT_LIST } from './data/farmData';
import { MapManager } from './data/dungeonGenerator';
import { SPRITE_GENERATORS, WALK_FRAME_GENERATORS } from './sprites';
import { SkillEffect } from './skillEffects';
import { FarmEngine } from './farmEngine';
import { FloatingText, Projectile, Entity } from './entity';
import { spawnBots, updateBot, drawBotTag } from './botAI';

// Map editor object-layer tile IDs → enemy/boss type (so editor-placed enemies become live entities)
const TILE_TO_ENEMY = {
  [TILES.CREEP]: ENEMIES.SPIDER,
  [TILES.BOSS]: BOSSES.GOLDEN_BUDGE_DRAGON,
  [TILES.SPIDER]: ENEMIES.SPIDER,
  [TILES.GOBLIN]: ENEMIES.GOBLIN,
  [TILES.SKELETON]: ENEMIES.SKELETON,
  [TILES.DARK_WIZARD]: ENEMIES.LICH,
  [TILES.ELF]: ENEMIES.ELF_SCOUT,
  [TILES.GOLEM]: ENEMIES.BUDGE_DRAGON,
  [TILES.DRAGON]: ENEMIES.BUDGE_DRAGON,
  [TILES.DEMON]: ENEMIES.LICH,
  [TILES.ORC]: ENEMIES.BULL_FIGHTER,
  [TILES.WOLF]: ENEMIES.HOUND,
  [TILES.BAT]: ENEMIES.LARVA,
  [TILES.SERPENT]: ENEMIES.CHAIN_SCORPION,
  [TILES.UNDEAD_KNIGHT]: ENEMIES.SKELETON,
  [TILES.SHADOW]: ENEMIES.SHADOW_PHANTOM,
  [TILES.ELEMENTAL]: ENEMIES.NEREID,
};

// Never draw these as static tiles (only as live entities)
const STATIC_TILE_BLACKLIST = new Set([
  TILES.BOT,
  ...Object.keys(TILE_TO_ENEMY).map(Number).filter((n) => !isNaN(n)),
]);

/** Build enemySpawns and botSpawns from map object layer (e.g. from Map Editor). Run when setting map so editor-placed enemies get real AI. */
function ensureSpawnsFromObjectLayer(mapData) {
  if (!mapData?.layers?.objects || !mapData.width) return;
  const width = mapData.width;
  const objects = mapData.layers.objects;
  const enemySpawns = mapData.enemySpawns ? [...mapData.enemySpawns] : [];
  const botSpawns = mapData.botSpawns ? [...mapData.botSpawns] : [];
  for (let i = 0; i < objects.length; i++) {
    const tileId = Number(objects[i]);
    if (!tileId || tileId === TILES.EMPTY) continue;
    const x = i % width;
    const y = Math.floor(i / width);
    const enemyType = TILE_TO_ENEMY[tileId];
    if (enemyType) {
      enemySpawns.push({ x, y, type: enemyType });
      objects[i] = TILES.EMPTY;
    } else if (tileId === TILES.BOT) {
      botSpawns.push({ x, y });
      objects[i] = TILES.EMPTY;
    }
  }
  mapData.enemySpawns = enemySpawns;
  mapData.botSpawns = botSpawns;
}

// ==========================================
// GAME ENGINE (Core only - modules imported)
// ==========================================

export class GameEngine {
  constructor(canvas, staticMaps, onEvent) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    MapManager.init(staticMaps);
    this.mapData = MapManager.getMap(1);
    if (this.mapData) ensureSpawnsFromObjectLayer(this.mapData);

    this.currentClass = CLASSES.DARK_KNIGHT;
    this.player = new Entity(10, 8, this.currentClass, true);

    this.entities = [this.player];
    this.bots = [];
    this.groundItems = [];
    this.projectiles = [];
    this.onEvent = onEvent;

    this.floatingTexts = []; this.effects = []; this.skillEffects = []; this.keys = {}; this.images = {};
    this.shakeX = 0; this.shakeY = 0; this.shakeIntensity = 0;

    // NPC interaction
    this.nearbyNPC = null; // { npcId, x, y, npcData }
    this.npcInteractCooldown = 0;

    // Gold currency
    this.gold = 500; // starting gold
    this.gems = 100; // starting gems (gacha currency)
    this.isRunning = false; this.lastTime = 0;

    // Farm & Defense engine (Map 8 only)
    this.farmEngine = new FarmEngine(this);

    // 15-slot hotbar
    this.hotbarSlots = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'q', 'w', 'e', 'r', 't'];
    this.hotbar = [];
    this.initHotbar();

    // Camera
    this.cameraX = 0;
    this.cameraY = 0;
    this.cameraSmooth = 0.1;

    // === AUTO MODE ===
    this.autoMode = false;
    this.autoTimer = 0;
    this.autoSkillTimer = 0;
    this.autoItemTimer = 0;
    this.autoSkillSlots = []; // which hotbar slots auto-mode can use
    this.autoHpThreshold = 0.4; // use HP potion below 40%
    this.autoMpThreshold = 0.3; // use MP potion below 30%
    this.autoPickup = false; // auto-mode: auto-pickup ground items
    this.autoMove = true;    // auto-mode: move toward enemies
    this.autoPickupTimer = 0;
    this.inspectedGroundItem = null; // currently inspected ground item (click)

    // === MOBILE INPUT ===
    this.mobileInputX = 0;
    this.mobileInputY = 0;

    // === CONSUMABLE SLOTS (3 assignable from bag) ===
    this.consumables = [
      { id: '', name: '', icon: '', count: 0, maxCount: 99, effect: '', amount: 0, cooldown: 0, cd: 0, color: '#333' },
      { id: '', name: '', icon: '', count: 0, maxCount: 99, effect: '', amount: 0, cooldown: 0, cd: 0, color: '#333' },
      { id: '', name: '', icon: '', count: 0, maxCount: 99, effect: '', amount: 0, cooldown: 0, cd: 0, color: '#333' },
    ];
    this.activeBuff = null; // { stat, amount, timer }

    this.loop = this.loop.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);

    this.loadImages();
    this.resizeCanvas();
    this.spawnEnemies();
    this.loadProgress();

    // Global attack cooldown for MU classes (attack speed based)
    this.globalAttackCooldown = 0;
    // Round-robin skill rotation for auto-mode
    this.lastAutoSkillIndex = 0;
  }

  // Mobile input setter
  setMobileInput(dx, dy) {
    this.mobileInputX = dx;
    this.mobileInputY = dy;
  }

  // MU Online classes use attack-speed gating, Eclipse uses per-skill cooldowns
  isMuClass(cls) {
    const eclipseIds = ['vanguard', 'nightreaver', 'arcanist', 'soul_engineer'];
    return !eclipseIds.includes(cls?.id);
  }

  resizeCanvas() {
    this.canvas.width = 1750;
    this.canvas.height = 1000;
  }

  saveProgress() {
    if (!this.player) return;
    const data = {
      stats: this.player.stats,
      classId: this.currentClass.id,
      mapId: this.mapData.id,
      x: this.player.x, y: this.player.y,
      gold: this.gold,
      gems: this.gems,
    };
    localStorage.setItem('eclipse_save', JSON.stringify(data));
  }

  loadProgress() {
    const data = localStorage.getItem('eclipse_save');
    if (data) {
      try {
        const json = JSON.parse(data);
        if (json.classId) {
          const cls = Object.values(CLASSES).find(c => c.id === json.classId);
          if (cls) this.currentClass = cls;
        }
        if (json.stats) {
          // Only load persistent stats, keep maxHp/maxMana from class definition
          const baseMax = this.currentClass.stats;
          this.player.stats.maxHp = baseMax.maxHp;
          this.player.stats.maxMana = baseMax.maxMana || 0;
          this.player.stats.maxRage = baseMax.maxRage || 0;
          // Restore mutable stats
          if (json.stats.hp !== undefined) this.player.stats.hp = json.stats.hp;
          if (json.stats.mana !== undefined) this.player.stats.mana = json.stats.mana;
          if (json.stats.rage !== undefined) this.player.stats.rage = json.stats.rage;
          if (json.stats.exp !== undefined) this.player.stats.exp = json.stats.exp;
          // Cap HP at actual maxHp
          this.player.stats.hp = Math.min(this.player.stats.hp, this.player.stats.maxHp);
          // If player was dead when saved, revive with 50% HP
          if (this.player.stats.hp <= 0) {
            this.player.stats.hp = Math.floor(this.player.stats.maxHp * 0.5);
          }
        }
        // Restore map and position
        if (json.mapId && json.mapId !== this.mapData.id) {
          this.setMap(json.mapId, json.x, json.y);
        } else if (json.x !== undefined && json.y !== undefined) {
          this.player.x = json.x; this.player.y = json.y;
          this.player.pixelX = json.x * TILE_SIZE; this.player.pixelY = json.y * TILE_SIZE;
          this.player.targetPixelX = this.player.pixelX;
          this.player.targetPixelY = this.player.pixelY;
        }
        // Restore gold & gems
        if (json.gold !== undefined) this.gold = json.gold;
        if (json.gems !== undefined) this.gems = json.gems;
      } catch (e) { console.error("Save load failed", e); }
    }
  }

  loadImages() {
    Object.entries(SPRITE_GENERATORS).forEach(([id, generator]) => {
      this.images[id] = generator();
    });
    // Load walk animation frames
    this.walkFrames = {};
    Object.entries(WALK_FRAME_GENERATORS).forEach(([id, generator]) => {
      this.walkFrames[id] = generator();
    });
  }

  setMap(mapId, startX, startY) {
    console.log('[GameEngine] setMap', mapId);
    this.mapData = MapManager.getMap(mapId);
    if (!this.mapData) {
      console.log('[GameEngine] setMap: no map for id', mapId);
      return;
    }
    ensureSpawnsFromObjectLayer(this.mapData);
    this.spawnEnemies();

    let px, py;
    if (startX !== undefined) {
      px = startX; py = startY;
    } else if (this.mapData.startX) {
      px = this.mapData.startX; py = this.mapData.startY;
    } else {
      px = 10; py = 10;
    }

    // Validate spawn: if position is blocked, find nearest safe tile
    if (this.isTileBlocked(px, py)) {
      const safe = this.findSafeSpawn(px, py);
      px = safe.x; py = safe.y;
    }

    this.player.x = px; this.player.y = py;
    this.player.pixelX = px * TILE_SIZE; this.player.pixelY = py * TILE_SIZE;
    this.player.targetPixelX = this.player.pixelX;
    this.player.targetPixelY = this.player.pixelY;
    this.player.isMoving = false;
    this.saveProgress();
  }

  /** Check if a tile is blocked (ignoring entities, just terrain) */
  isTileBlocked(x, y) {
    if (x < 0 || x >= this.mapData.width || y < 0 || y >= this.mapData.height) return true;
    const idx = y * this.mapData.width + x;
    const groundTile = this.mapData.layers.ground[idx];
    const objectTile = this.mapData.layers.objects[idx];
    if (WALKABLE[groundTile] === false) return true;
    if (WALKABLE[objectTile] === false && objectTile !== 0) return true;
    return false;
  }

  /** Spiral search outward from (cx, cy) to find walkable tile */
  findSafeSpawn(cx, cy) {
    for (let radius = 1; radius < 30; radius++) {
      for (let dx = -radius; dx <= radius; dx++) {
        for (let dy = -radius; dy <= radius; dy++) {
          if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue; // Only check ring
          const nx = cx + dx, ny = cy + dy;
          if (!this.isTileBlocked(nx, ny)) return { x: nx, y: ny };
        }
      }
    }
    // Absolute fallback: find any walkable tile on map
    for (let y = 0; y < this.mapData.height; y++) {
      for (let x = 0; x < this.mapData.width; x++) {
        if (!this.isTileBlocked(x, y)) return { x, y };
      }
    }
    return { x: 10, y: 10 };
  }

  spawnEnemies() {
    this.entities = [this.player];
    this.groundItems = [];
    this.projectiles = [];

    if (!this.mapData) {
      console.log('[GameEngine] spawnEnemies: no mapData, skip');
      return;
    }
    ensureSpawnsFromObjectLayer(this.mapData);
    // Editor/custom maps (id >= 10) with no enemy tiles get default spawns so the map isn't empty
    if (this.mapData.id >= 10 && (!this.mapData.enemySpawns || this.mapData.enemySpawns.length === 0)) {
      const w = this.mapData.width || 50;
      const h = this.mapData.height || 50;
      const defaults = [ENEMIES.SPIDER, ENEMIES.GOBLIN, ENEMIES.SKELETON, ENEMIES.BUDGE_DRAGON];
      this.mapData.enemySpawns = [];
      const wantCount = Math.min(32, Math.max(16, Math.floor((w * h) / 80)));
      let placed = 0;
      for (let attempt = 0; attempt < wantCount * 50 && placed < wantCount; attempt++) {
        const x = Math.floor(Math.random() * (w - 4)) + 2;
        const y = Math.floor(Math.random() * (h - 4)) + 2;
        if (!this.isTileBlocked(x, y)) {
          this.mapData.enemySpawns.push({ x, y, type: defaults[placed % defaults.length] });
          placed++;
        }
      }
      console.log('[GameEngine] spawnEnemies: editor map', this.mapData.id, 'had 0 spawns, added', this.mapData.enemySpawns.length, 'default enemies');
    }
    const spawnCount = this.mapData.enemySpawns ? this.mapData.enemySpawns.length : 0;
    console.log('[GameEngine] spawnEnemies: mapId=', this.mapData.id, 'enemySpawns=', spawnCount);

    // Spawn enemies from map data
    if (this.mapData.enemySpawns && this.mapData.enemySpawns.length > 0) {
      this.mapData.enemySpawns.forEach(s => {
        const enemy = new Entity(s.x, s.y, s.type);
        // Save original spawn position for respawn
        enemy.spawnX = s.x;
        enemy.spawnY = s.y;
        this.entities.push(enemy);
      });
    }

    // Spawn bots
    this.bots = spawnBots(this.mapData.botSpawns);
    this.bots.forEach(bot => this.entities.push(bot));
    console.log('[GameEngine] spawnEnemies: total entities=', this.entities.length, 'enemies=', this.entities.length - 1 - (this.bots?.length || 0));
  }

  start() {
    this.isRunning = true; this.lastTime = performance.now();
    requestAnimationFrame(this.loop);
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  stop() {
    this.isRunning = false;
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    this.saveProgress();
  }

  handleKeyDown(e) {
    this.keys[e.key] = true;
    // Dodge: Shift + arrow key
    if (e.key === 'Shift') this.keys['Shift'] = true;
    // NPC Interact: F key
    if (e.key === 'f' || e.key === 'F') {
      if (this.nearbyNPC && this.npcInteractCooldown <= 0) {
        this.interactWithNPC(this.nearbyNPC);
        this.npcInteractCooldown = 500;
      }
    }
    // Space: pick up nearby ground items + farm interaction
    if (e.key === ' ') {
      this.pickupGroundItems();
      // Farm tile interaction (Map 8) — check nearby tiles in a radius
      if (this.mapData.id === 8) {
        const px = Math.floor(this.player.x);
        const py = Math.floor(this.player.y);
        // Check the tile the player is on + adjacent tiles
        const offsets = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]];
        for (const [ox, oy] of offsets) {
          const tx = px + ox;
          const ty = py + oy;
          const idx = ty * this.mapData.width + tx;
          const groundTile = this.mapData.layers.ground[idx];
          if (groundTile === TILES.FARM_SOIL || groundTile === TILES.DEFENSE_SLOT) {
            if (this.handleFarmTileClick(tx, ty)) break;
          }
        }
      }
    }
  }
  handleKeyUp(e) {
    this.keys[e.key] = false;
    if (e.key === 'Shift') this.keys['Shift'] = false;
  }

  // === DODGE SYSTEM ===
  attemptDodge(dx, dy) {
    const p = this.player;
    if (p.isDodging || p.dodgeCooldown > 0) return;
    if (p.stamina < 25) return; // Dodge costs 25 stamina

    p.stamina -= 25;
    p.isDodging = true;
    p.dodgeTimer = 200; // 200ms dodge duration
    p.dodgeCooldown = 500; // 500ms between dodges
    p.dodgeDirX = dx; p.dodgeDirY = dy;
    p.dodgeIframes = 200; // invincible during dodge

    // Move player 2 tiles in dodge direction
    let finalX = p.x, finalY = p.y;
    for (let i = 1; i <= 2; i++) {
      const nx = p.x + dx * i, ny = p.y + dy * i;
      if (!this.isBlocked(nx, ny, p)) { finalX = nx; finalY = ny; }
      else break;
    }
    p.x = finalX; p.y = finalY;
    p.targetPixelX = finalX * TILE_SIZE; p.targetPixelY = finalY * TILE_SIZE;
    p.isMoving = true;
    p.moveSpeed = 500; // fast dodge movement

    // Dodge visual effect
    const px = p.pixelX + TILE_SIZE / 2;
    const py = p.pixelY + TILE_SIZE / 2;
    this.skillEffects.push(new SkillEffect('fade_out', px, py, '#aaddff', 0.3, {}));
    this.addFloatText(p.pixelX, p.pixelY, 'DODGE!', '#88ccff');
  }

  isBlocked(x, y, ignoreEntity = null) {
    // Only checks terrain, entities do NOT block (players/enemies can overlap)
    const ix = Math.floor(x), iy = Math.floor(y);
    if (ix < 0 || ix >= this.mapData.width || iy < 0 || iy >= this.mapData.height) return true;
    const idx = iy * this.mapData.width + ix;
    const groundTile = this.mapData.layers.ground[idx];
    const objectTile = this.mapData.layers.objects[idx];
    if (WALKABLE[groundTile] === false) return true;
    if (WALKABLE[objectTile] === false && objectTile !== 0) return true;
    return false;
  }

  // Smooth collision: check if moving to fractional (fx, fy) is valid
  isTileWalkable(tileX, tileY) {
    if (tileX < 0 || tileX >= this.mapData.width || tileY < 0 || tileY >= this.mapData.height) return false;
    const idx = tileY * this.mapData.width + tileX;
    const groundTile = this.mapData.layers.ground[idx];
    const objectTile = this.mapData.layers.objects[idx];
    if (WALKABLE[groundTile] === false) return false;
    if (WALKABLE[objectTile] === false && objectTile !== 0) return false;
    return true;
  }

  // Check if a smooth position is walkable (check all corner tiles the entity bounding box covers)
  canMoveTo(fx, fy, ignoreEntity = null) {
    const pad = 0.15; // small padding so entity doesn't clip edges
    const corners = [
      [fx + pad, fy + pad], [fx + 1 - pad, fy + pad],
      [fx + pad, fy + 1 - pad], [fx + 1 - pad, fy + 1 - pad]
    ];
    for (const [cx, cy] of corners) {
      if (!this.isTileWalkable(Math.floor(cx), Math.floor(cy))) return false;
    }
    return true;
  }

  initHotbar() {
    this.hotbar = [];
    const cls = this.currentClass;
    if (cls.skills.SPACE) this.hotbar.push(cls.skills.SPACE);
    if (cls.skills.Q) this.hotbar.push(cls.skills.Q);
    if (cls.skills.W) this.hotbar.push(cls.skills.W);
    if (cls.allSkills) {
      const equipped = new Set(this.hotbar.map(s => s.id));
      for (const sk of cls.allSkills) {
        if (this.hotbar.length >= 15) break;
        if (!equipped.has(sk.id)) { this.hotbar.push(sk); equipped.add(sk.id); }
      }
    }
  }

  setHotbarSkill(slotIndex, skill) {
    if (slotIndex >= 0 && slotIndex < 15) this.hotbar[slotIndex] = skill;
  }

  useSkill(slotIndex) {
    const skill = this.hotbar[slotIndex];
    if (!skill) return;

    const isMu = this.isMuClass(this.currentClass);

    if (isMu) {
      // MU classes: no individual cooldowns, gated by global attack speed timer
      if (this.globalAttackCooldown > 0) return;
    } else {
      // Eclipse classes: per-skill cooldowns
      if (this.player.cooldowns[skill.id] > 0) return;
    }

    if (skill.cost) {
      if (this.currentClass.stats.maxMana > 0) {
        if (this.player.stats.mana < skill.cost) return;
        this.player.stats.mana -= skill.cost;
      } else if (this.currentClass.stats.maxRage > 0) {
        if (this.player.stats.rage < skill.cost) return;
        this.player.stats.rage -= skill.cost;
      }
    }
    this.performSkill(skill);

    if (isMu) {
      // Global cooldown based on attack speed (attacks per second)
      // attackSpeed default ~1.5 attacks/sec → 667ms between attacks
      const atkSpeed = this.currentClass.stats.attackSpeed || 1.5;
      this.globalAttackCooldown = 1000 / atkSpeed;
    } else {
      this.player.cooldowns[skill.id] = skill.cooldown;
    }
  }

  getDirectionVec() {
    let dx = 0, dy = 0;
    if (this.player.direction === 'up') dy = -1;
    if (this.player.direction === 'down') dy = 1;
    if (this.player.direction === 'left') dx = -1;
    if (this.player.direction === 'right') dx = 1;
    return { dx, dy };
  }

  performSkill(skill) {
    const px = this.player.pixelX + TILE_SIZE / 2;
    const py = this.player.pixelY + TILE_SIZE / 2;
    const { dx, dy } = this.getDirectionVec();
    const color = skill.color || '#ff4444';
    const effect = skill.effect || 'melee';
    const aoeR = (skill.aoeRadius || 5) * TILE_SIZE;

    // ── Layered caster charge flash for ANY offensive skill ──
    const isBigSkill = ['aoe_circle', 'aoe_front', 'aoe_line', 'nova', 'earthquake', 'tornado', 'meteor', 'lightning', 'lifesteal'].includes(effect);
    if (isBigSkill) {
      this.skillEffects.push(new SkillEffect('cast_flash', px, py, color, 0.5, {}));
    }

    if (effect === 'buff' || effect === 'buff_hp' || effect === 'mount') {
      this.addFloatText(this.player.pixelX, this.player.pixelY, skill.name.toUpperCase(), '#ffd700');
      this.skillEffects.push(new SkillEffect('buff_aura', px, py, color, 1.8, { radius: 55 }));
      return;
    }
    if (effect === 'heal_self') {
      const heal = skill.healAmount || 30;
      this.player.stats.hp = Math.min(this.player.stats.maxHp, this.player.stats.hp + heal);
      this.addFloatText(this.player.pixelX, this.player.pixelY, `+${heal}`, '#44ff44');
      this.skillEffects.push(new SkillEffect('heal_ring', px, py, '#44ff44', 1.5, { radius: 48 }));
      return;
    }
    if (effect === 'stealth') {
      this.player.status.stealth = skill.duration;
      this.addFloatText(this.player.pixelX, this.player.pixelY, 'STEALTH', '#ccc');
      this.skillEffects.push(new SkillEffect('fade_out', px, py, '#aaaaff', 1.0, {}));
      return;
    }
    if (effect === 'debuff' || effect === 'sleep') {
      this.addFloatText(this.player.pixelX, this.player.pixelY, skill.name.toUpperCase(), '#8888ff');
      this.skillEffects.push(new SkillEffect('cast_flash', px, py, '#8844aa', 0.4, {}));
      this.skillEffects.push(new SkillEffect('debuff_wave', px, py, color, 1.2, { maxRadius: aoeR }));
      this.hitEnemiesInRange(this.player, skill.range || 3, skill);
      return;
    }
    if (effect === 'blink') {
      this.skillEffects.push(new SkillEffect('blink_flash', px, py, color, 0.7, {}));
      if (skill.blinkAttack) {
        const tgt = this.findNearestEnemy(skill.range || 5);
        if (tgt) {
          this.player.x = tgt.x - dx; this.player.y = tgt.y - dy;
          this.player.pixelX = this.player.x * TILE_SIZE; this.player.pixelY = this.player.y * TILE_SIZE;
          this.player.targetPixelX = this.player.pixelX; this.player.targetPixelY = this.player.pixelY;
          this.skillEffects.push(new SkillEffect('blink_flash', this.player.pixelX + 16, this.player.pixelY + 16, color, 0.7, {}));
          this.applyDamage(this.player, tgt, skill);
        }
        return;
      }
      let tx = this.player.x, ty = this.player.y;
      for (let i = 0; i < skill.range; i++) {
        let nx = tx + dx, ny = ty + dy;
        if (this.isTileWalkable(Math.floor(nx), Math.floor(ny))) { tx = nx; ty = ny; } else break;
      }
      this.player.x = tx; this.player.y = ty;
      this.player.pixelX = tx * TILE_SIZE; this.player.pixelY = ty * TILE_SIZE;
      this.player.targetPixelX = this.player.pixelX; this.player.targetPixelY = this.player.pixelY;
      this.skillEffects.push(new SkillEffect('blink_flash', this.player.pixelX + 16, this.player.pixelY + 16, color, 0.7, {}));
      return;
    }
    if (effect === 'summon') {
      this.addFloatText(this.player.pixelX, this.player.pixelY, 'SUMMON!', '#aa44ff');
      this.skillEffects.push(new SkillEffect('summon_circle', px, py, color, 2.0, { radius: 55 }));
      return;
    }
    if (effect === 'freeze') {
      // Single-target freeze (e.g. Ice Prison)
      const tgt = this.findNearestEnemy(skill.range || 5);
      if (tgt) {
        this.skillEffects.push(new SkillEffect('nova_ring', tgt.pixelX + 16, tgt.pixelY + 16, color, 1.0, { maxRadius: 50 }));
        if (skill.damage) this.applyDamage(this.player, tgt, skill);
        this.addFloatText(tgt.pixelX, tgt.pixelY, 'FROZEN!', '#88ddff');
      }
      return;
    }

    if (skill.projectile) {
      this.projectiles.push(new Projectile(this.player.x, this.player.y, dx, dy, skill, this.player));
      this.skillEffects.push(new SkillEffect('cast_flash', px, py, color, 0.5, {}));
      return;
    }

    if (effect === 'aoe_circle') {
      this.skillEffects.push(new SkillEffect('aoe_circle', px, py, color, 1.2, { radius: aoeR, rings: 3 }));
      this.screenShake(5, 0.25);
      this.hitEnemiesInRange(this.player, skill.aoeRadius || 5, skill);
    } else if (effect === 'aoe_front') {
      const tx = px + dx * aoeR * 0.6;
      const ty = py + dy * aoeR * 0.6;
      this.skillEffects.push(new SkillEffect('cone_blast', tx, ty, color, 1.0, { radius: aoeR * 1.2, dx, dy }));
      this.hitEnemiesInCone(this.player, dx, dy, skill.aoeRadius || 3, skill);
    } else if (effect === 'aoe_line') {
      const len = (skill.lineLength || 5) * TILE_SIZE;
      this.skillEffects.push(new SkillEffect('line_blast', px, py, color, 0.9, { length: len, dx, dy }));
      this.hitEnemiesInLine(this.player, dx, dy, skill.lineLength || 5, skill);
    } else if (effect === 'nova') {
      this.skillEffects.push(new SkillEffect('nova_ring', px, py, color, 1.5, { maxRadius: aoeR * 1.3 }));
      this.screenShake(7, 0.35);
      this.hitEnemiesInRange(this.player, skill.aoeRadius || 5, skill);
    } else if (effect === 'earthquake') {
      this.skillEffects.push(new SkillEffect('earthquake', px, py, color, 2.0, { radius: aoeR * 1.3 }));
      this.screenShake(10, 0.5);
      this.hitEnemiesInRange(this.player, skill.aoeRadius || 5, skill);
    } else if (effect === 'tornado') {
      this.skillEffects.push(new SkillEffect('tornado', px, py, color, 2.5, { radius: aoeR * 1.2 }));
      this.screenShake(4, 0.3);
      this.hitEnemiesInRange(this.player, skill.aoeRadius || 3, skill);
    } else if (effect === 'meteor') {
      const mx = this.player.x + dx * (skill.range || 4);
      const my = this.player.y + dy * (skill.range || 4);
      this.skillEffects.push(new SkillEffect('meteor', mx * TILE_SIZE + 16, my * TILE_SIZE + 16, color, 2.0, { radius: aoeR * 1.3 }));
      this.screenShake(12, 0.6);
      this.hitEnemiesInRange(this.player, skill.aoeRadius || 3, skill);
    } else if (effect === 'lightning') {
      const tgt = this.findNearestEnemy(skill.range || 6);
      if (tgt) {
        this.skillEffects.push(new SkillEffect('lightning_bolt', px, py, color, 0.8, { tx: tgt.pixelX + 16, ty: tgt.pixelY + 16 }));
        // Hit impact at target
        this.skillEffects.push(new SkillEffect('nova_ring', tgt.pixelX + 16, tgt.pixelY + 16, color, 0.6, { maxRadius: 45 }));
        this.screenShake(4, 0.15);
        this.applyDamage(this.player, tgt, skill);
      } else {
        this.skillEffects.push(new SkillEffect('lightning_bolt', px, py, color, 0.8, { tx: px + dx * 180, ty: py + dy * 180 }));
      }
    } else if (effect === 'lifesteal') {
      const tgt = this.findNearestEnemy(skill.range || 4);
      if (tgt) {
        this.skillEffects.push(new SkillEffect('lifesteal_beam', px, py, color, 1.2, { tx: tgt.pixelX + 16, ty: tgt.pixelY + 16 }));
        this.applyDamage(this.player, tgt, skill);
        const heal = Math.floor((skill.damage || 15) * (skill.lifestealPercent || 50) / 100);
        this.player.stats.hp = Math.min(this.player.stats.maxHp, this.player.stats.hp + heal);
        this.addFloatText(this.player.pixelX, this.player.pixelY, `+${heal}`, '#44ff44');
      }
    } else {
      this.performMelee(skill);
    }
  }

  screenShake(intensity, duration) {
    this.shakeIntensity = Math.min(14, Math.max(this.shakeIntensity, intensity));
  }

  performMelee(skill) {
    const { dx, dy } = this.getDirectionVec();
    let tx = this.player.x + dx, ty = this.player.y + dy;
    const color = skill.color || '#ffffff';
    const px = this.player.pixelX + TILE_SIZE / 2;
    const py = this.player.pixelY + TILE_SIZE / 2;
    // Melee: slash arc + hit impact on target
    this.skillEffects.push(new SkillEffect('slash_arc', px + dx * 24, py + dy * 24, color, 0.6, { dx, dy }));
    this.screenShake(3, 0.15);
    this.effects.push({ x: tx, y: ty, type: 'slash', life: 0.15 });
    // Find closest enemy within melee range (1.5 tiles) in attack direction
    let target = null, bestDist = Infinity;
    this.entities.forEach(e => {
      if (e.isPlayer || e.isBot || e.isDoomed) return;
      const ex = e.x - this.player.x, ey = e.y - this.player.y;
      const dist = Math.sqrt(ex * ex + ey * ey);
      if (dist > 1.8) return; // melee range
      // Must be roughly in the attack direction
      if (dx !== 0 && Math.sign(ex) !== dx) return;
      if (dy !== 0 && Math.sign(ey) !== dy) return;
      if (dist < bestDist) { target = e; bestDist = dist; }
    });
    if (target) {
      this.applyDamage(this.player, target, skill);
      this.skillEffects.push(new SkillEffect('nova_ring', target.pixelX + 16, target.pixelY + 16, '#ffffff', 0.3, { maxRadius: 30 }));
    }
  }

  // AOE helpers
  hitEnemiesInRange(source, rangeTiles, skill) {
    this.entities.forEach(e => {
      if (e === source || e.isPlayer || e.isDoomed) return;
      // Don't hit bots (friendly fire off)
      if (e.isBot && source.isPlayer) return;
      if (e.isBot && source.isBot) return;
      const ddx = e.x - source.x, ddy = e.y - source.y;
      const dist = Math.sqrt(ddx * ddx + ddy * ddy);
      if (dist <= rangeTiles + 0.5) this.applyDamage(source, e, skill);
    });
  }

  hitEnemiesInCone(source, dx, dy, rangeTiles, skill) {
    const dirLen = Math.sqrt(dx * dx + dy * dy) || 1;
    const ndx = dx / dirLen, ndy = dy / dirLen;
    this.entities.forEach(e => {
      if (e === source || e.isPlayer || e.isDoomed) return;
      if (e.isBot && source.isPlayer) return;
      if (e.isBot && source.isBot) return;
      const ex = e.x - source.x, ey = e.y - source.y;
      const dist = Math.sqrt(ex * ex + ey * ey);
      if (dist > rangeTiles + 0.5 || dist < 0.1) return;
      // Dot product check: enemy must be in front hemisphere (angle < 90°)
      const dot = (ex * ndx + ey * ndy) / dist;
      if (dot > 0.2) {
        this.applyDamage(source, e, skill);
      }
    });
  }

  hitEnemiesInLine(source, dx, dy, length, skill) {
    const dirLen = Math.sqrt(dx * dx + dy * dy) || 1;
    const ndx = dx / dirLen, ndy = dy / dirLen;
    this.entities.forEach(e => {
      if (e === source || e.isPlayer || e.isDoomed) return;
      if (e.isBot && source.isPlayer) return;
      if (e.isBot && source.isBot) return;
      const ex = e.x - source.x, ey = e.y - source.y;
      // Project onto line direction
      const proj = ex * ndx + ey * ndy;
      if (proj < 0 || proj > length + 0.5) return;
      // Perpendicular distance from segment
      const perpX = ex - ndx * proj, perpY = ey - ndy * proj;
      const perpDist = Math.sqrt(perpX * perpX + perpY * perpY);
      if (perpDist <= 1.2) {
        this.applyDamage(source, e, skill);
      }
    });
  }

  findNearestEnemy(rangeTiles) {
    let best = null, bestDist = Infinity;
    this.entities.forEach(e => {
      if (e.isPlayer || e.isBot || e.isDoomed) return;
      const d = Math.abs(e.x - this.player.x) + Math.abs(e.y - this.player.y);
      if (d <= rangeTiles && d < bestDist) { best = e; bestDist = d; }
    });
    return best;
  }

  applyDamage(source, target, skill) {
    // Skip already-dead targets — prevents timer reset loops
    if (target.isDoomed) return;

    // === DODGE I-FRAMES ===
    if (target.dodgeIframes > 0) {
      // Check for perfect dodge (hit during first 80ms)
      if (target.dodgeTimer > 120) {
        // Perfect dodge! Time slow effect
        target.perfectDodgeWindow = 1500; // 1.5s of slow-mo
        this.addFloatText(target.pixelX, target.pixelY, '⚡ PERFECT DODGE!', '#ffdd00');
        this.skillEffects.push(new SkillEffect('nova_ring', target.pixelX + 16, target.pixelY + 16, '#ffdd00', 0.8, { maxRadius: 80 }));
      } else {
        this.addFloatText(target.pixelX, target.pixelY, 'DODGED!', '#88ccff');
      }
      return;
    }

    // === STAGGER CHECK (target is staggered = bonus damage) ===
    let staggerMult = 1.0;
    if (target.isStaggered) staggerMult = 1.5;

    let mult = 1.0;
    if (source.status && source.status.stealth > 0) { mult = 2.0; source.status.stealth = 0; }

    const dmg = Math.max(1, Math.floor(((source.stats.attack + (skill.damage || 0)) - target.stats.defense) * mult * staggerMult));
    target.stats.hp -= dmg;

    const dmgColor = staggerMult > 1 ? '#ff8800' : (mult > 1 ? '#ff0000' : '#fff');
    const dmgSuffix = staggerMult > 1 ? '💫' : (mult > 1 ? '!' : '');
    this.addFloatText(target.pixelX, target.pixelY, `-${dmg}${dmgSuffix}`, dmgColor);

    // === ANIMATION TRIGGERS ===
    // Hit flash: bright white/red overlay
    target.hitFlash = 150; // 150ms flash
    target.hitFlashColor = staggerMult > 1 ? '#ff8800' : (mult > 1 ? '#ff0000' : '#ffffff');
    // Damage shake: sprite vibrates
    target.damageShake = 200; // 200ms shake
    // Attack animation on the source
    if (source.attackAnim <= 0) {
      source.attackAnim = 250; // 250ms attack swing
      const dx = target.pixelX - source.pixelX;
      const dy = target.pixelY - source.pixelY;
      source.attackDir = Math.atan2(dy, dx);
    }

    // === STAGGER BUILDUP ===
    if (!target.isPlayer && !target.isBot && target.staggerThreshold > 0) {
      target.stagger += (skill.damage || 5) + (skill.staggerBonus || 0);
      if (target.stagger >= target.staggerThreshold && !target.isStaggered) {
        target.isStaggered = true;
        target.staggerTimer = 3000; // 3 seconds of stagger
        target.stagger = 0;
        this.addFloatText(target.pixelX, target.pixelY - 20, '💫 STAGGERED!', '#ff8800');
        this.skillEffects.push(new SkillEffect('earthquake', target.pixelX + 16, target.pixelY + 16, '#ff8800', 0.5, { radius: 40 }));
      }
    }

    if (source.stats.maxRage > 0 && skill.generateRage) {
      source.stats.rage = Math.min(source.stats.maxRage, source.stats.rage + skill.generateRage);
    }

    // Lifesteal for any skill with lifestealPercent (melee, aoe, etc.)
    if (skill.lifestealPercent && source.isPlayer) {
      const heal = Math.floor(dmg * skill.lifestealPercent / 100);
      if (heal > 0) {
        source.stats.hp = Math.min(source.stats.maxHp, source.stats.hp + heal);
        this.addFloatText(source.pixelX, source.pixelY, `+${heal}`, '#44ff44');
      }
    }

    if (target.stats.hp <= 0) {
      target.stats.hp = 0;
      source.stats.exp = (source.stats.exp || 0) + (target.stats.expReward || 10);
      this.addFloatText(target.pixelX, target.pixelY - 20, `+${target.stats.expReward || 0} XP`, '#ffd700');
      this.onEvent('kill', target);

      // Drop loot from enemy kills (player or bot kills enemy)
      if (!target.isPlayer && !target.isBot && Math.random() > 0.5) {
        const enemyLevel = target.stats.level || target.stats.expReward ? Math.max(1, Math.floor((target.stats.expReward || 10) / 5)) : 1;
        // Scatter drop slightly so multiple drops don't overlap
        const scatterX = (Math.random() - 0.5) * 0.6;
        const scatterY = (Math.random() - 0.5) * 0.6;
        this.groundItems.push({ x: target.x + scatterX, y: target.y + scatterY, pixelX: (target.x + scatterX) * TILE_SIZE, pixelY: (target.y + scatterY) * TILE_SIZE, item: generateLoot(enemyLevel), life: 120, floatOffset: 0, floatTime: Math.random() * 6 });
      }
      // Gold drop from enemy kills
      if (!target.isPlayer && !target.isBot) {
        const goldDrop = Math.floor(5 + Math.random() * (target.stats.expReward || 10) * 1.5);
        this.gold += goldDrop;
        this.addFloatText(target.pixelX + 10, target.pixelY - 30, `+${goldDrop} 💰`, '#ffd700');
      }

      // Death: set respawn timer
      target.isDoomed = true;
      if (target.isPlayer || target.isBot) {
        target.respawnTimer = target.isBot ? 5.0 : 10.0; // 5s for bots, 10s for player
        if (target.isPlayer) {
          this.addFloatText(target.pixelX, target.pixelY - 40, 'DEAD - Reviving in 10s', '#ff4444');
        }
      } else {
        target.respawnTimer = 5.0; // 5s for enemies
      }
    }
  }

  addFloatText(x, y, text, color) { this.floatingTexts.push(new FloatingText(x + TILE_SIZE / 2, y, text, color)); }

  update(dt) {
    const dtSec = dt / 1000;

    // Screen shake decay
    if (this._shakeTimer > 0) {
      this._shakeTimer -= dtSec;
      if (this._shakeTimer <= 0) {
        this._shakeTimer = 0;
        this._shakeIntensity = 0;
        this._shakeDuration = 0;
      }
    }

    // Player Movement — SMOOTH SUB-TILE with 8 directions
    if (!this.player.isDoomed && !this.player.isDodging) {
      let dx = 0, dy = 0;
      if (this.keys['ArrowUp']) { dy = -1; }
      if (this.keys['ArrowDown']) { dy = 1; }
      if (this.keys['ArrowLeft']) { dx = -1; }
      if (this.keys['ArrowRight']) { dx = 1; }

      // Mobile joystick input (overrides keyboard when active)
      if (Math.abs(this.mobileInputX) > 0.1 || Math.abs(this.mobileInputY) > 0.1) {
        dx = this.mobileInputX;
        dy = this.mobileInputY;
      }

      // Normalize diagonal movement
      const mag = Math.sqrt(dx * dx + dy * dy);
      if (mag > 1) {
        dx /= mag; dy /= mag;
      }

      // Set player facing direction
      if (dy < 0 && dx === 0) this.player.direction = 'up';
      else if (dy > 0 && dx === 0) this.player.direction = 'down';
      else if (dx < 0) this.player.direction = 'left';
      else if (dx > 0) this.player.direction = 'right';

      if (dx !== 0 || dy !== 0) {
        // === DODGE: Shift + direction ===
        if (this.keys['Shift']) {
          this.attemptDodge(Math.sign(dx), Math.sign(dy));
        } else {
          // Smooth movement: move in pixel space
          const speed = (this.currentClass.stats.speed || 150) * dtSec / TILE_SIZE; // tiles per second
          let newX = this.player.x + dx * speed;
          let newY = this.player.y + dy * speed;

          // Try full movement, then axis-slide if blocked
          if (this.canMoveTo(newX, newY, this.player)) {
            this.player.x = newX; this.player.y = newY;
          } else if (dx !== 0 && this.canMoveTo(newX, this.player.y, this.player)) {
            this.player.x = newX; // slide along X
          } else if (dy !== 0 && this.canMoveTo(this.player.x, newY, this.player)) {
            this.player.y = newY; // slide along Y
          }

          // Sync pixel position
          this.player.pixelX = this.player.x * TILE_SIZE;
          this.player.pixelY = this.player.y * TILE_SIZE;
          this.player.targetPixelX = this.player.pixelX;
          this.player.targetPixelY = this.player.pixelY;

          // Check teleport & item pickup at current tile
          const tileX = Math.floor(this.player.x), tileY = Math.floor(this.player.y);
          const objTile = this.mapData.layers.objects[tileY * this.mapData.width + tileX];
          if (objTile === TILES.TELEPORT) this.checkTeleport(tileX, tileY);
          // Ground items are now picked up via Space key or click, not walk-over

          // Check NPC proximity
          this.checkNPCProximity();
          if (this.npcInteractCooldown > 0) this.npcInteractCooldown -= dt;
        }
      }

      // 15-slot hotbar
      for (let i = 0; i < this.hotbarSlots.length; i++) {
        const k = this.hotbarSlots[i];
        if (this.keys[k]) { this.useSkill(i); this.keys[k] = false; }
      }
    }

    // === AUTO MODE ===
    if (this.autoMode && !this.player.isDoomed) {
      this.updateAutoMode(dt, dtSec);
    }

    // === CONSUMABLE COOLDOWNS ===
    this.consumables.forEach(c => { if (c.cooldown > 0) c.cooldown -= dt; });

    // === ACTIVE BUFF TIMER ===
    if (this.activeBuff) {
      this.activeBuff.timer -= dt;
      if (this.activeBuff.timer <= 0) {
        this.player.stats[this.activeBuff.stat] -= this.activeBuff.amount;
        this.addFloatText(this.player.pixelX, this.player.pixelY, 'BUFF EXPIRED', '#888');
        this.activeBuff = null;
      }
    }

    // === PERFECT DODGE TIME SLOW ===
    let effectiveDt = dt;
    let effectiveDtSec = dtSec;
    if (this.player.perfectDodgeWindow > 0) {
      this.player.perfectDodgeWindow -= dt;
      effectiveDt = dt * 0.3; // 30% speed for enemies
      // Note: player uses normal dt, enemies use effectiveDt
    }

    // Interpolation & Regen
    this.entities.forEach(e => {
      if (e.isMoving) {
        const useDt = (e.isPlayer ? dtSec : (this.player.perfectDodgeWindow > 0 ? effectiveDtSec * 0.3 : dtSec));
        const speed = e.moveSpeed * useDt;
        if (e.pixelX < e.targetPixelX) e.pixelX = Math.min(e.pixelX + speed, e.targetPixelX);
        else e.pixelX = Math.max(e.pixelX - speed, e.targetPixelX);
        if (e.pixelY < e.targetPixelY) e.pixelY = Math.min(e.pixelY + speed, e.targetPixelY);
        else e.pixelY = Math.max(e.pixelY - speed, e.targetPixelY);
        if (Math.abs(e.pixelX - e.targetPixelX) < 1 && Math.abs(e.pixelY - e.targetPixelY) < 1) {
          e.isMoving = false;
          e.pixelX = e.targetPixelX; e.pixelY = e.targetPixelY;
          // Sync fractional position from pixel
          e.x = e.pixelX / TILE_SIZE;
          e.y = e.pixelY / TILE_SIZE;
        }
      }
      // Mana regen
      if (e.stats.maxMana > 0 && e.stats.mana < e.stats.maxMana) e.stats.mana += 5 * dtSec;
      // HP/s passive regen (2 HP/s base)
      if (!e.isDoomed && e.stats.hp < e.stats.maxHp) {
        const hpRegen = e.stats.hpRegen || 2;
        if (e.stats.hp < e.stats.maxHp) {
          e.stats.hp = Math.min(e.stats.maxHp, e.stats.hp + hpRegen * dtSec);
        }
      }
      if (e.status.stealth > 0) e.status.stealth -= dt;

      // === STAMINA REGEN ===
      if (e.maxStamina > 0 && e.stamina < e.maxStamina && !e.isDodging) {
        e.stamina = Math.min(e.maxStamina, e.stamina + (e.staminaRegen || 20) * dtSec);
      }

      // === DODGE TIMERS ===
      if (e.isDodging) { e.dodgeTimer -= dt; if (e.dodgeTimer <= 0) e.isDodging = false; }
      if (e.dodgeCooldown > 0) e.dodgeCooldown -= dt;
      if (e.dodgeIframes > 0) e.dodgeIframes -= dt;

      // === STAGGER TIMERS ===
      if (e.isStaggered) {
        e.staggerTimer -= dt;
        if (e.staggerTimer <= 0) { e.isStaggered = false; e.stagger = 0; }
      }
      // Stagger decays over time when not staggered
      if (!e.isStaggered && e.stagger > 0) e.stagger = Math.max(0, e.stagger - 10 * dtSec);

      // === ANIMATION TIMERS ===
      if (e.hitFlash > 0) e.hitFlash -= dt;
      if (e.damageShake > 0) {
        e.damageShake -= dt;
        e.shakeOffsetX = (Math.random() - 0.5) * 4;
        e.shakeOffsetY = (Math.random() - 0.5) * 2;
      } else {
        e.shakeOffsetX = 0; e.shakeOffsetY = 0;
      }
      if (e.attackAnim > 0) e.attackAnim -= dt;

      // Running bob: detect movement
      const wasRunning = e.isRunning;
      if (e.isPlayer) {
        const moving = (this.keys['ArrowUp'] || this.keys['ArrowDown'] || this.keys['ArrowLeft'] || this.keys['ArrowRight']
          || Math.abs(this.mobileInputX) > 0.1 || Math.abs(this.mobileInputY) > 0.1);
        e.isRunning = moving && !e.isDodging && !e.isDoomed;
      } else {
        e.isRunning = e.isMoving;
      }
      if (e.isRunning) {
        e.runTimer += dt;
      } else {
        e.runTimer = 0;
      }

      // Death fade
      if (e.isDoomed && e.deathFade > 0) {
        e.deathFade = Math.max(0, e.deathFade - dtSec * 2); // fade over 0.5s
      } else if (!e.isDoomed && e.deathFade < 1) {
        e.deathFade = 1.0; // reset on revive
      }
    });

    // ── RESPAWN TIMER ──
    this.entities.forEach(e => {
      if (!e.isDoomed || e.respawnTimer === undefined) return;
      e.respawnTimer -= dtSec;
      if (e.respawnTimer <= 0) {
        e.isDoomed = false;
        e.respawnTimer = undefined;
        e.isMoving = false;

        if (e.isPlayer || e.isBot) {
          // Player/Bot: revive in place with 50% HP
          e.stats.hp = Math.floor(e.stats.maxHp * 0.5);
          this.addFloatText(e.pixelX, e.pixelY, 'REVIVED!', '#44ff44');
        } else {
          // Enemy: revive at original spawn with full HP
          e.stats.hp = e.stats.maxHp;
          if (e.spawnX !== undefined) {
            e.x = e.spawnX; e.y = e.spawnY;
            e.pixelX = e.x * TILE_SIZE; e.pixelY = e.y * TILE_SIZE;
            e.targetPixelX = e.pixelX; e.targetPixelY = e.pixelY;
          }
        }
      }
    });

    // Auto-save position periodically (every 5s)
    this._saveTimer = (this._saveTimer || 0) + dtSec;
    if (this._saveTimer >= 5) {
      this._saveTimer = 0;
      this.saveProgress();
    }

    this.projectiles.forEach(p => p.update(dtSec, this));
    this.projectiles = this.projectiles.filter(p => p.life > 0);

    // Enemy AI — split into per-frame movement + timed decisions
    this.entities.forEach(e => {
      if (e.isPlayer || e.isBot || e.isDoomed || e.status.freeze > 0) return;

      // Skill timer always ticks
      if (e.skillTimer > 0) e.skillTimer -= dt;

      const aggroRange = e.ai === 'chase' ? (e.skills && e.skills.length > 0 ? 8 : 6) : 4;

      // Find nearest target (runs every frame for smooth chasing)
      let target = null, targetDist = Infinity;
      [this.player, ...this.bots].forEach(t => {
        if (t.isDoomed || (t.status && t.status.stealth > 0)) return;
        const ddx = e.x - t.x, ddy = e.y - t.y;
        const d = Math.sqrt(ddx * ddx + ddy * ddy);
        if (d < targetDist) { target = t; targetDist = d; }
      });

      // === PER-FRAME: Chase movement (smooth, every frame) ===
      if (target && targetDist <= aggroRange && targetDist > 1.8) {
        const cddx = target.x - e.x;
        const cddy = target.y - e.y;
        const cdist = Math.sqrt(cddx * cddx + cddy * cddy);
        if (cdist > 0.1) {
          const nmx = cddx / cdist;
          const nmy = cddy / cdist;
          const espeed = (e.stats.speed || 200) * dtSec / TILE_SIZE;
          const enx = e.x + nmx * espeed;
          const eny = e.y + nmy * espeed;
          if (this.canMoveTo(enx, eny, e)) {
            e.x = enx; e.y = eny;
          } else if (this.canMoveTo(enx, e.y, e)) {
            e.x = enx;
          } else if (this.canMoveTo(e.x, eny, e)) {
            e.y = eny;
          }
          e.isMoving = true;
          e.pixelX = e.x * TILE_SIZE;
          e.pixelY = e.y * TILE_SIZE;
          e.targetPixelX = e.pixelX;
          e.targetPixelY = e.pixelY;
          if (Math.abs(nmx) > Math.abs(nmy)) e.direction = nmx > 0 ? 'right' : 'left';
          else e.direction = nmy > 0 ? 'down' : 'up';
        }
      }

      // === TIMED: Attack decisions (gated by aiTimer) ===
      e.aiTimer -= dt;
      if (e.aiTimer <= 0) {
        e.aiTimer = 300 + Math.random() * 300;

        if (target && targetDist <= aggroRange && targetDist <= 1.8) {
          // In attack range - try skill or melee
          e.isMoving = false;
          let usedSkill = false;
          if (e.skills && e.skills.length > 0 && e.skillTimer <= 0) {
            const available = e.skills.filter(s => {
              const cd = e.cooldowns[s.name] || 0;
              return cd <= 0;
            });
            if (available.length > 0) {
              const skill = available[Math.floor(Math.random() * available.length)];
              e.cooldowns[skill.name] = skill.cooldown || 3000;
              e.skillTimer = 800;
              const epx = e.pixelX + TILE_SIZE / 2, epy = e.pixelY + TILE_SIZE / 2;
              const edx = target.x - e.x, edy = target.y - e.y;
              const se = skill.effect || 'melee';

              // Face target
              if (Math.abs(edx) > Math.abs(edy)) e.direction = edx > 0 ? 'right' : 'left';
              else e.direction = edy > 0 ? 'down' : 'up';

              // Create visual effect — layered like player skills
              const eAoeR = (skill.aoeRadius || 5) * TILE_SIZE;
              // Cast flash for big skills
              if (['aoe_circle', 'aoe_front', 'aoe_line', 'nova', 'earthquake', 'tornado', 'meteor', 'lightning'].includes(se)) {
                this.skillEffects.push(new SkillEffect('cast_flash', epx, epy, skill.color, 0.4, {}));
              }
              if (se === 'aoe_circle') {
                this.skillEffects.push(new SkillEffect('aoe_circle', epx, epy, skill.color, 1.2, { radius: eAoeR }));
              } else if (se === 'aoe_front') {
                this.skillEffects.push(new SkillEffect('cone_blast', epx + edx * 20, epy + edy * 20, skill.color, 1.0, { radius: eAoeR * 1.2, dx: edx, dy: edy }));
              } else if (se === 'nova') {
                this.skillEffects.push(new SkillEffect('nova_ring', epx, epy, skill.color, 1.5, { maxRadius: eAoeR * 1.3 }));
              } else if (se === 'lightning') {
                this.skillEffects.push(new SkillEffect('lightning_bolt', epx, epy, skill.color, 0.8, { tx: target.pixelX + 16, ty: target.pixelY + 16 }));
              } else if (se === 'earthquake') {
                this.skillEffects.push(new SkillEffect('earthquake', epx, epy, skill.color, 2.0, { radius: eAoeR * 1.3 }));
                this.screenShake(8, 0.4);
              } else if (se === 'tornado') {
                this.skillEffects.push(new SkillEffect('tornado', epx, epy, skill.color, 2.5, { radius: eAoeR * 1.2 }));
              } else if (se === 'meteor') {
                this.skillEffects.push(new SkillEffect('meteor', target.pixelX + 16, target.pixelY + 16, skill.color, 2.0, { radius: eAoeR * 1.3 }));
                this.screenShake(10, 0.5);
              } else if (se === 'aoe_line') {
                this.skillEffects.push(new SkillEffect('line_blast', epx, epy, skill.color, 0.9, { length: (skill.lineLength || 5) * TILE_SIZE, dx: edx, dy: edy }));
              } else if (se === 'lifesteal') {
                this.skillEffects.push(new SkillEffect('lifesteal_beam', epx, epy, skill.color, 1.2, { tx: target.pixelX + 16, ty: target.pixelY + 16 }));
                const heal = Math.floor((skill.damage || 10) * (skill.lifestealPercent || 40) / 100);
                e.stats.hp = Math.min(e.stats.maxHp, e.stats.hp + heal);
              } else if (se === 'debuff' || se === 'sleep') {
                this.skillEffects.push(new SkillEffect('debuff_wave', epx, epy, skill.color, 1.2, { maxRadius: eAoeR }));
              } else {
                this.skillEffects.push(new SkillEffect('slash_arc', epx + edx * 24, epy + edy * 24, skill.color, 0.6, { dx: edx, dy: edy }));
              }
              this.applyDamage(e, target, skill);
              usedSkill = true;
            }
          }
          if (!usedSkill) {
            this.applyDamage(e, target, { damage: 0 });
          }
        } else if (!target || targetDist > aggroRange) {
          // Idle wander so enemies visibly move when player is far (no static statues)
          const tx = Math.floor(e.x), ty = Math.floor(e.y);
          const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];
          const shuffled = [...dirs].sort(() => Math.random() - 0.5);
          for (const [dx, dy] of shuffled) {
            const nx = tx + dx, ny = ty + dy;
            if (this.canMoveTo(nx, ny, e)) {
              console.log('[GameEngine] enemy wander', e.name, tx + ',' + ty, '->', nx + ',' + ny);
              e.x = nx; e.y = ny;
              e.pixelX = e.x * TILE_SIZE; e.pixelY = e.y * TILE_SIZE;
              e.targetPixelX = e.pixelX; e.targetPixelY = e.pixelY;
              e.isMoving = true;
              if (dx !== 0) e.direction = dx > 0 ? 'right' : 'left';
              else e.direction = dy > 0 ? 'down' : 'up';
              break;
            }
          }
          e.aiTimer = 1500 + Math.random() * 1500;
        }
      }
    });

    // Cooldowns for enemies
    this.entities.forEach(e => {
      if (e.isPlayer || e.isBot) return;
      Object.keys(e.cooldowns).forEach(k => { if (e.cooldowns[k] > 0) e.cooldowns[k] -= dt; });
    });

    // Bot AI
    this.bots.forEach(bot => {
      if (!bot.isDoomed) updateBot(bot, dt, this);
    });

    // Player cooldowns
    Object.keys(this.player.cooldowns).forEach(k => { if (this.player.cooldowns[k] > 0) this.player.cooldowns[k] -= dt; });
    // Global attack speed cooldown (for MU classes)
    if (this.globalAttackCooldown > 0) this.globalAttackCooldown -= dt;

    // Effects cleanup
    this.effects = this.effects.filter(fx => { fx.life -= dtSec; return fx.life > 0; });
    this.skillEffects.forEach(fx => fx.update(dtSec));
    this.skillEffects = this.skillEffects.filter(fx => fx.life > 0);
    this.floatingTexts = this.floatingTexts.filter(t => { t.update(dtSec); return t.life > 0; });
    this.groundItems.forEach(g => { g.floatTime += dtSec * 2; g.floatOffset = Math.sin(g.floatTime) * 4; g.life -= dtSec; });
    this.groundItems = this.groundItems.filter(g => g.life > 0);
    // Clear inspected item if it expired
    if (this.inspectedGroundItem && !this.groundItems.includes(this.inspectedGroundItem)) {
      this.inspectedGroundItem = null;
      this.onEvent('ground_item_clear', null);
    }
    // Only remove permanently dead entities (no respawn timer running)
    this.entities = this.entities.filter(e => !e.isDoomed || e.respawnTimer !== undefined);
    // Clean dead bots from bots array too (keep those with respawn timer)
    this.bots = this.bots.filter(b => !b.isDoomed || b.respawnTimer !== undefined);

    // Camera
    const targetCamX = this.player.pixelX - this.canvas.width / 2 + TILE_SIZE / 2;
    const targetCamY = this.player.pixelY - this.canvas.height / 2 + TILE_SIZE / 2;
    const maxCamX = Math.max(0, this.mapData.width * TILE_SIZE - this.canvas.width);
    const maxCamY = Math.max(0, this.mapData.height * TILE_SIZE - this.canvas.height);
    const clampedX = Math.max(0, Math.min(targetCamX, maxCamX));
    const clampedY = Math.max(0, Math.min(targetCamY, maxCamY));
    this.cameraX += (clampedX - this.cameraX) * this.cameraSmooth;
    this.cameraY += (clampedY - this.cameraY) * this.cameraSmooth;
    // Screen shake
    if (this.shakeIntensity > 0.5) {
      this.shakeX = (Math.random() - 0.5) * this.shakeIntensity;
      this.shakeY = (Math.random() - 0.5) * this.shakeIntensity;
      this.shakeIntensity *= 0.88;
    } else {
      this.shakeX = 0; this.shakeY = 0; this.shakeIntensity = 0;
    }

    // Farm engine update (only on House map)
    if (this.mapData.id === 8) {
      this.farmEngine.update(dt);
    }
  }

  // === AUTO MODE AI ===
  updateAutoMode(dt, dtSec) {
    this.autoTimer += dt;
    this.autoSkillTimer += dt;
    this.autoItemTimer += dt;

    // Auto-use consumables based on configured thresholds
    if (this.autoItemTimer >= 1000) {
      this.autoItemTimer = 0;
      const hpPct = this.player.stats.hp / this.player.stats.maxHp;
      const manaPct = this.player.stats.maxMana > 0 ? this.player.stats.mana / this.player.stats.maxMana : 1;
      // Find consumable slots by effect type (dynamic)
      const hpSlot = this.consumables.findIndex(c => c.id && c.effect === 'heal' && c.count > 0 && c.cooldown <= 0);
      const manaSlot = this.consumables.findIndex(c => c.id && c.effect === 'mana' && c.count > 0 && c.cooldown <= 0);
      const buffSlot = this.consumables.findIndex(c => c.id && c.effect === 'buff_atk' && c.count > 0 && c.cooldown <= 0);
      if (hpPct < this.autoHpThreshold && hpSlot >= 0) this.useConsumable(hpSlot);
      if (manaPct < this.autoMpThreshold && manaSlot >= 0) this.useConsumable(manaSlot);
      if (this.autoTarget && !this.activeBuff && buffSlot >= 0) this.useConsumable(buffSlot);
    }

    // Auto-pickup ground items
    if (this.autoPickup) {
      this.autoPickupTimer += dt;
      if (this.autoPickupTimer >= 500) {
        this.autoPickupTimer = 0;
        this.pickupGroundItems();
      }
    }

    // Find nearest enemy
    let nearestEnemy = null;
    let nearestDist = Infinity;
    for (const e of this.entities) {
      if (e.isPlayer || e.isBot || e.isDoomed) continue;
      const ddx = e.x - this.player.x, ddy = e.y - this.player.y;
      const dist = Math.sqrt(ddx * ddx + ddy * ddy);
      if (dist < nearestDist) { nearestDist = dist; nearestEnemy = e; }
    }
    this.autoTarget = nearestEnemy;

    if (!nearestEnemy) return;

    // Determine the best skill range for auto-attack
    let bestSkillRange = 1.5; // default melee range
    for (const sk of this.hotbar) {
      if (sk && (sk.range || 1) > bestSkillRange) bestSkillRange = sk.range;
    }

    // Face the enemy when in range
    const adx = nearestEnemy.x - this.player.x;
    const ady = nearestEnemy.y - this.player.y;
    if (nearestDist <= bestSkillRange + 0.5) {
      if (Math.abs(adx) > Math.abs(ady)) {
        this.player.direction = adx > 0 ? 'right' : 'left';
      } else {
        this.player.direction = ady > 0 ? 'down' : 'up';
      }
    }

    // Auto-attack: rotate through enabled skills, fallback to basic (slot 0)
    if (nearestDist <= bestSkillRange + 0.5 && this.autoSkillTimer >= 300) {
      this.autoSkillTimer = 0;
      const isMu = this.isMuClass(this.currentClass);
      const enabledSlots = this.autoSkillSlots.length > 0 ? this.autoSkillSlots : Array.from({ length: this.hotbar.length }, (_, i) => i);

      // Round-robin: rotate through enabled slots (skip basic attack slot 0)
      let used = false;
      const canUseGlobal = isMu ? this.globalAttackCooldown <= 0 : true;

      if (canUseGlobal) {
        // Filter to non-basic enabled slots that have skills
        const skillSlots = enabledSlots.filter(i => i > 0 && this.hotbar[i]);
        if (skillSlots.length > 0) {
          for (let j = 0; j < skillSlots.length; j++) {
            const idx = skillSlots[(this.lastAutoSkillIndex + j) % skillSlots.length];
            const sk = this.hotbar[idx];
            if (!sk) continue;
            if (!isMu && this.player.cooldowns[sk.id] > 0) continue;
            if (sk.cost) {
              const hasMana = this.player.stats.maxMana > 0 && this.player.stats.mana >= sk.cost;
              const hasRage = this.player.stats.maxRage > 0 && this.player.stats.rage >= sk.cost;
              if (!hasMana && !hasRage) continue;
            }
            this.useSkill(idx);
            this.lastAutoSkillIndex = (skillSlots.indexOf(idx) + 1) % skillSlots.length;
            used = true;
            break;
          }
        }
        // Fallback to basic attack (slot 0) if nothing else available
        if (!used && enabledSlots.includes(0) && this.hotbar[0]) {
          if (isMu || this.player.cooldowns[this.hotbar[0].id] <= 0) {
            this.useSkill(0);
          }
        }
      }
    }

    // Auto-move toward nearest enemy - smooth per-frame movement
    if (this.autoMove && nearestDist > 1.2) {
      const ddx = nearestEnemy.x - this.player.x;
      const ddy = nearestEnemy.y - this.player.y;
      const dist = Math.sqrt(ddx * ddx + ddy * ddy);

      // Normalize direction vector for smooth diagonal (no zigzag)
      let mx = ddx / dist;
      let my = ddy / dist;

      // Use same speed formula as normal movement: speed * dtSec / TILE_SIZE
      const speed = (this.currentClass.stats.speed || 150) * dtSec / TILE_SIZE;
      let stepX = mx * speed;
      let stepY = my * speed;

      let newX = this.player.x + stepX;
      let newY = this.player.y + stepY;

      if (this.canMoveTo(newX, newY, this.player)) {
        this.player.x = newX; this.player.y = newY;
      } else if (this.canMoveTo(newX, this.player.y, this.player)) {
        this.player.x = newX;
      } else if (this.canMoveTo(this.player.x, newY, this.player)) {
        this.player.y = newY;
      } else {
        // Stuck on obstacle — try perpendicular directions to go around
        const perpX1 = this.player.x + my * speed;
        const perpY1 = this.player.y - mx * speed;
        const perpX2 = this.player.x - my * speed;
        const perpY2 = this.player.y + mx * speed;
        if (this.canMoveTo(perpX1, perpY1, this.player)) {
          this.player.x = perpX1; this.player.y = perpY1;
        } else if (this.canMoveTo(perpX2, perpY2, this.player)) {
          this.player.x = perpX2; this.player.y = perpY2;
        }
      }
      this.player.pixelX = this.player.x * TILE_SIZE;
      this.player.pixelY = this.player.y * TILE_SIZE;
      this.player.targetPixelX = this.player.pixelX;
      this.player.targetPixelY = this.player.pixelY;

      // Set direction based on movement
      if (Math.abs(mx) > Math.abs(my)) this.player.direction = mx > 0 ? 'right' : 'left';
      else this.player.direction = my > 0 ? 'down' : 'up';
    }
  }

  // === CONSUMABLE USE ===
  useConsumable(slotIndex) {
    const item = this.consumables[slotIndex];
    if (!item || !item.id || item.count <= 0 || item.cooldown > 0) return;

    item.count--;
    item.cooldown = item.cd;

    switch (item.effect) {
      case 'heal':
        this.player.stats.hp = Math.min(this.player.stats.maxHp, this.player.stats.hp + item.amount);
        this.addFloatText(this.player.pixelX, this.player.pixelY, `+${item.amount} HP`, '#44ff44');
        break;
      case 'mana':
        this.player.stats.mana = Math.min(this.player.stats.maxMana, this.player.stats.mana + item.amount);
        this.addFloatText(this.player.pixelX, this.player.pixelY, `+${item.amount} MANA`, '#4488ff');
        break;
      case 'buff_atk':
        if (this.activeBuff) {
          this.player.stats[this.activeBuff.stat] -= this.activeBuff.amount;
        }
        this.player.stats.attack += item.amount;
        this.activeBuff = { stat: 'attack', amount: item.amount, timer: item.duration };
        this.addFloatText(this.player.pixelX, this.player.pixelY, `ATK +${item.amount}!`, '#ff8800');
        break;
    }
    // Notify Vue to decrement inventory
    this.onEvent('consumable_used', { id: item.id });
  }

  // === GROUND ITEM PICKUP ===
  pickupGroundItems() {
    const pickupRange = 2; // tiles
    const toPickup = [];
    this.groundItems.forEach((g, i) => {
      const dx = g.x - this.player.x;
      const dy = g.y - this.player.y;
      if (Math.sqrt(dx * dx + dy * dy) <= pickupRange) {
        toPickup.push(i);
      }
    });
    // Pick up in reverse order to maintain indices
    let count = 0;
    for (let i = toPickup.length - 1; i >= 0; i--) {
      const gi = this.groundItems[toPickup[i]];
      this.onEvent('pickup', gi.item);
      this.addFloatText(gi.pixelX, gi.pixelY, `+${gi.item.name}`, gi.item.color || '#fff');
      this.groundItems.splice(toPickup[i], 1);
      count++;
    }
    if (count > 0) {
      this.addFloatText(this.player.pixelX, this.player.pixelY - 20, `Picked up ${count} item${count > 1 ? 's' : ''}!`, '#ffd700');
      // Clear inspected if it was picked up
      if (this.inspectedGroundItem && !this.groundItems.includes(this.inspectedGroundItem)) {
        this.inspectedGroundItem = null;
        this.onEvent('ground_item_clear', null);
      }
    }
  }

  getGroundItemAt(canvasX, canvasY) {
    const camX = this.cameraX - this.shakeX;
    const camY = this.cameraY - this.shakeY;
    // Check each ground item's screen rect
    for (let i = this.groundItems.length - 1; i >= 0; i--) {
      const g = this.groundItems[i];
      const sx = g.pixelX - camX;
      const sy = g.pixelY + g.floatOffset - camY;
      // Hit-test a generous 36x36 area around the item icon
      if (canvasX >= sx - 2 && canvasX <= sx + 34 && canvasY >= sy - 36 && canvasY <= sy + 34) {
        return g;
      }
    }
    return null;
  }

  pickupSingleGroundItem(gi) {
    const idx = this.groundItems.indexOf(gi);
    if (idx === -1) return;
    // Check if player is close enough
    const dx = gi.x - this.player.x;
    const dy = gi.y - this.player.y;
    if (Math.sqrt(dx * dx + dy * dy) > 3) {
      this.addFloatText(this.player.pixelX, this.player.pixelY, 'Too far!', '#ff4444');
      return;
    }
    this.onEvent('pickup', gi.item);
    this.addFloatText(gi.pixelX, gi.pixelY, `+${gi.item.name}`, gi.item.color || '#fff');
    this.groundItems.splice(idx, 1);
    if (this.inspectedGroundItem === gi) {
      this.inspectedGroundItem = null;
      this.onEvent('ground_item_clear', null);
    }
  }

  toggleAutoMode() {
    this.autoMode = !this.autoMode;
    this.autoTimer = 0;
    this.autoSkillTimer = 0;
    this.autoItemTimer = 0;
  }

  checkTeleport(x, y) {
    if (this.mapData.teleports) {
      const tp = this.mapData.teleports.find(t => t.x === x && t.y === y);
      if (tp) this.onEvent('teleport', tp);
    }
  }

  // NPC proximity detection — check tiles around player
  checkNPCProximity() {
    if (!this.mapData.npcs || this.mapData.npcs.length === 0) { this.nearbyNPC = null; return; }
    const px = Math.floor(this.player.x), py = Math.floor(this.player.y);
    let closest = null, closestDist = Infinity;
    for (const npc of this.mapData.npcs) {
      const dist = Math.abs(npc.x - px) + Math.abs(npc.y - py);
      if (dist <= 2 && dist < closestDist) {
        closestDist = dist;
        const npcData = Object.values(NPCS).find(n => n.id === npc.npcId);
        if (npcData) closest = { ...npc, npcData };
      }
    }
    this.nearbyNPC = closest;
  }

  // Interact with NPC — fire event to Vue
  interactWithNPC(npc) {
    const data = npc.npcData;
    if (!data) return;
    switch (data.type) {
      case 'shop':
        this.onEvent('npc_shop', { npc: data, items: SHOP_ITEMS[data.shopCategory] || [] });
        break;
      case 'quest':
        this.onEvent('npc_quest', { npc: data });
        break;
      case 'storage':
        this.onEvent('npc_storage', { npc: data });
        break;
      case 'craft':
        this.onEvent('npc_craft', { npc: data });
        break;
      case 'summon':
        this.onEvent('npc_summon', { npc: data, banners: SUMMON_BANNERS });
        break;
      case 'temple':
        this.onEvent('npc_temple', { npc: data });
        break;
      case 'farm_vendor':
        this.onEvent('farm_open_crop_menu', {
          crops: CROP_LIST,
          gold: this.gold,
          slotIndex: this.farmEngine.cropSlots.findIndex(s => !s.cropId),
        });
        break;
    }
  }

  // Mobile NPC interact (called from Vue)
  mobileInteractNPC() {
    if (this.nearbyNPC && this.npcInteractCooldown <= 0) {
      this.interactWithNPC(this.nearbyNPC);
      this.npcInteractCooldown = 500;
    }
  }

  // ── Screen Shake ──
  screenShake(intensity = 6, duration = 0.3) {
    this._shakeIntensity = Math.max(this._shakeIntensity || 0, intensity);
    this._shakeDuration = Math.max(this._shakeDuration || 0, duration);
    this._shakeTimer = this._shakeDuration;
  }

  // ── Farm Tile Click (called when player interacts with farm/defense tiles) ──
  handleFarmTileClick(tileX, tileY) {
    if (this.mapData.id !== 8) return false;
    return this.farmEngine.handleTileClick(tileX, tileY);
  }

  draw(ctx) {
    this.drawInternal(this.ctx || ctx);
  }

  drawInternal(ctx) {
    // Screen shake offset
    let shakeX = 0, shakeY = 0;
    if (this._shakeTimer > 0) {
      const prog = this._shakeTimer / (this._shakeDuration || 0.3);
      const intensity = (this._shakeIntensity || 6) * prog;
      shakeX = (Math.random() - 0.5) * intensity * 2;
      shakeY = (Math.random() - 0.5) * intensity * 2;
    }
    const camX = Math.floor(this.cameraX + shakeX);
    const camY = Math.floor(this.cameraY + shakeY);

    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Ground
    for (let i = 0; i < this.mapData.layers.ground.length; i++) {
      const x = i % this.mapData.width;
      const y = Math.floor(i / this.mapData.width);
      const screenX = x * TILE_SIZE - camX;
      const screenY = y * TILE_SIZE - camY;
      if (screenX > -TILE_SIZE && screenX < this.canvas.width && screenY > -TILE_SIZE && screenY < this.canvas.height) {
        this.drawTileAt(ctx, this.mapData.layers.ground[i], screenX, screenY);
      }
    }

    // Pickup range indicator
    const pickupRange = 2 * TILE_SIZE;
    const prx = this.player.pixelX + TILE_SIZE / 2 - camX;
    const pry = this.player.pixelY + TILE_SIZE / 2 - camY;
    if (this.groundItems.length > 0) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.15)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.arc(prx, pry, pickupRange, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    // Ground items with labels
    this.groundItems.forEach(g => {
      const sx = g.pixelX - camX;
      const sy = g.pixelY + g.floatOffset - camY;
      const dx = g.pixelX - this.player.pixelX;
      const dy = g.pixelY - this.player.pixelY;
      const inRange = Math.sqrt(dx * dx + dy * dy) < pickupRange;
      const isInspected = g === this.inspectedGroundItem;

      // Glow under item if in pickup range
      if (inRange) {
        const glow = ctx.createRadialGradient(sx + 16, sy + 20, 2, sx + 16, sy + 20, 18);
        glow.addColorStop(0, 'rgba(255, 215, 0, 0.3)');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.fillRect(sx - 4, sy, 40, 32);
      }

      // Item icon (bigger, bouncing)
      ctx.font = '26px serif'; ctx.textAlign = 'center';
      ctx.fillText(g.item.icon || '📦', sx + 16, sy + 18);

      // Light beam
      ctx.globalAlpha = inRange ? 0.4 : 0.2;
      ctx.fillStyle = g.item.color || '#ffd700';
      ctx.fillRect(sx + 13, sy - 30, 6, 30);
      ctx.globalAlpha = 1.0;

      // Item name label
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      const labelY = sy - 34;
      // Background pill
      const nameText = g.item.name || 'Item';
      const textW = ctx.measureText(nameText).width + 8;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(sx + 16 - textW / 2, labelY - 10, textW, 14);
      // Name text in rarity color
      ctx.fillStyle = g.item.color || '#ccc';
      ctx.fillText(nameText, sx + 16, labelY);

      // Highlight if inspected
      if (isInspected) {
        ctx.strokeStyle = g.item.color || '#ffd700';
        ctx.lineWidth = 2;
        ctx.strokeRect(sx - 2, sy - 2, 36, 36);
        ctx.lineWidth = 1;
      }
    });

    // Sorted draw list — never draw enemy/bot as static tiles (only as entities)
    const list = [];
    for (let i = 0; i < this.mapData.layers.objects.length; i++) {
      const raw = this.mapData.layers.objects[i];
      const id = Number(raw);
      if (!id) continue;
      if (TILE_TO_ENEMY[id] || id === TILES.BOT) continue;
      const x = i % this.mapData.width;
      const y = Math.floor(i / this.mapData.width);
      list.push({ type: 'tile', id, x, y, sy: y * TILE_SIZE });
    }
    this.entities.forEach(e => {
      if (e.status.stealth > 0 && !e.isPlayer) return;
      if (e.isDoomed && !e.isPlayer && !e.isBot) return; // Hide dead enemies completely
      list.push({ type: 'ent', e, sy: e.pixelY });
    });
    list.sort((a, b) => a.sy - b.sy);

    list.forEach(o => {
      if (o.type === 'tile') {
        const screenX = o.x * TILE_SIZE - camX;
        const screenY = o.y * TILE_SIZE - camY;
        if (screenX > -TILE_SIZE && screenX < this.canvas.width && screenY > -TILE_SIZE && screenY < this.canvas.height) {
          this.drawTileAt(ctx, o.id, screenX, screenY);
        }
      } else {
        const e = o.e;
        // === ANIMATION OFFSETS ===
        // Running bob: sinusoidal Y offset
        let bobY = 0;
        if (e.isRunning && e.runTimer > 0) {
          bobY = Math.sin(e.runTimer * 0.012) * 3; // 3px amplitude
        }
        // Attack lunge: push sprite toward attack target
        let lungeX = 0, lungeY = 0;
        if (e.attackAnim > 0) {
          const progress = e.attackAnim / 250; // 0 to 1
          const lunge = Math.sin(progress * Math.PI) * 4; // 4px lunge
          lungeX = Math.cos(e.attackDir) * lunge;
          lungeY = Math.sin(e.attackDir) * lunge;
        }

        const sx = e.pixelX - camX + (e.shakeOffsetX || 0) + lungeX;
        const sy = e.pixelY - camY + (e.shakeOffsetY || 0) + bobY + lungeY;

        // Death fade / stealth alpha
        if (e.status.stealth > 0) ctx.globalAlpha = 0.5;
        else if (e.isDoomed) ctx.globalAlpha = Math.max(0.05, e.deathFade * 0.3);
        else ctx.globalAlpha = 1.0;

        // Player indicator
        if (e.isPlayer) {
          ctx.fillStyle = 'rgba(255, 215, 0, 0.4)';
          ctx.beginPath(); ctx.arc(sx + 16, sy + 16, 20, 0, Math.PI * 2); ctx.fill();
        }

        // Bot indicator (blue glow)
        if (e.isBot) {
          ctx.fillStyle = 'rgba(92, 107, 192, 0.35)';
          ctx.beginPath(); ctx.arc(sx + 16, sy + 16, 18, 0, Math.PI * 2); ctx.fill();
        }

        if (e.isPlayer || e.isBot) {
          // Walk animation frame selection
          const spriteId = e.isPlayer ? this.currentClass.id : 'player';
          const frames = this.walkFrames[spriteId] || this.walkFrames['player'];
          let frameIdx = 0;
          if (e.isMoving && frames && frames.length > 1) {
            // Update walk animation timer
            if (!e.walkAnimTimer) e.walkAnimTimer = 0;
            e.walkAnimTimer += 16; // ~60fps
            const frameDuration = 150; // ms per frame
            frameIdx = Math.floor(e.walkAnimTimer / frameDuration) % frames.length;
          } else {
            e.walkAnimTimer = 0;
          }

          // Directional flipping (mirror when facing left)
          const facingLeft = e.direction === 'left';
          if (facingLeft) {
            ctx.save();
            ctx.translate(sx + TILE_SIZE, sy);
            ctx.scale(-1, 1);
            if (frames && frames[frameIdx]) {
              ctx.drawImage(frames[frameIdx], 0, 0, TILE_SIZE, TILE_SIZE);
            } else if (this.images[spriteId]) {
              ctx.drawImage(this.images[spriteId], 0, 0, TILE_SIZE, TILE_SIZE);
            }
            ctx.restore();
          } else {
            if (frames && frames[frameIdx]) {
              ctx.drawImage(frames[frameIdx], sx, sy, TILE_SIZE, TILE_SIZE);
            } else if (this.images[spriteId]) {
              ctx.drawImage(this.images[spriteId], sx, sy, TILE_SIZE, TILE_SIZE);
            } else if (this.images['player']) {
              ctx.drawImage(this.images['player'], sx, sy, TILE_SIZE, TILE_SIZE);
            }
          }

          // Dust particles when moving
          if (e.isMoving && e.isPlayer) {
            if (!e.dustTimer) e.dustTimer = 0;
            e.dustTimer += 16;
            if (e.dustTimer > 200) {
              e.dustTimer = 0;
              const dustX = sx + 16 + (Math.random() - 0.5) * 8;
              const dustY = sy + TILE_SIZE - 2;
              ctx.fillStyle = 'rgba(180,160,120,0.4)';
              ctx.beginPath(); ctx.arc(dustX, dustY, 2 + Math.random() * 2, 0, Math.PI * 2); ctx.fill();
            }
          }

          // Dodge flash effect
          if (e.isDodging) {
            ctx.fillStyle = 'rgba(136, 204, 255, 0.4)';
            ctx.beginPath(); ctx.arc(sx + 16, sy + 16, 18, 0, Math.PI * 2); ctx.fill();
          }
          // Perfect dodge aura
          if (e.perfectDodgeWindow > 0) {
            ctx.strokeStyle = '#ffdd00'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(sx + 16, sy + 16, 22, 0, Math.PI * 2); ctx.stroke();
            ctx.lineWidth = 1;
          }
        } else {
          const img = this.images[e.visual] || this.images[String(e.visual)];
          if (img && img.complete && img.naturalWidth > 0) {
            ctx.drawImage(img, sx, sy, TILE_SIZE, TILE_SIZE);
          } else {
            const color = (e.visual != null && TILE_COLORS[e.visual]) ? TILE_COLORS[e.visual] : '#f00';
            ctx.fillStyle = color;
            ctx.fillRect(sx, sy, TILE_SIZE, TILE_SIZE);
            ctx.strokeStyle = 'rgba(255,255,255,0.4)';
            ctx.lineWidth = 1;
            ctx.strokeRect(sx, sy, TILE_SIZE, TILE_SIZE);
          }
        }

        // === HIT FLASH OVERLAY ===
        if (e.hitFlash > 0) {
          const flashAlpha = (e.hitFlash / 150) * 0.6; // fade from 0.6 to 0
          ctx.globalAlpha = flashAlpha;
          ctx.fillStyle = e.hitFlashColor || '#fff';
          ctx.fillRect(sx, sy, TILE_SIZE, TILE_SIZE);
          ctx.globalAlpha = e.isDoomed ? Math.max(0.05, e.deathFade * 0.3) : 1.0;
        }

        // Stagger indicator on enemies
        if (e.isStaggered && !e.isPlayer && !e.isBot) {
          ctx.font = '14px sans-serif'; ctx.textAlign = 'center';
          ctx.fillText('💫', sx + 16, sy - 10);
        }
        ctx.globalAlpha = 1.0;

        // Death X indicator over dead player/bot
        if (e.isDoomed && (e.isPlayer || e.isBot)) {
          ctx.strokeStyle = '#ff0000'; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(sx + 4, sy + 4); ctx.lineTo(sx + 28, sy + 28); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(sx + 28, sy + 4); ctx.lineTo(sx + 4, sy + 28); ctx.stroke();
          ctx.lineWidth = 1;
        }

        // Health bar
        if (!e.isDoomed) {
          ctx.fillStyle = '#333'; ctx.fillRect(sx, sy - 6, 32, 4);
          ctx.fillStyle = e.isPlayer ? '#0f0' : e.isBot ? '#5c6bc0' : '#f00';
          ctx.fillRect(sx, sy - 6, 32 * (e.stats.hp / e.stats.maxHp), 4);

          // Stamina bar (player only)
          if (e.isPlayer && e.maxStamina > 0) {
            ctx.fillStyle = '#333'; ctx.fillRect(sx, sy - 10, 32, 3);
            ctx.fillStyle = '#44aaff';
            ctx.fillRect(sx, sy - 10, 32 * (e.stamina / e.maxStamina), 3);
          }

          // Stagger bar (enemies with stagger buildup)
          if (!e.isPlayer && !e.isBot && e.stagger > 0 && e.staggerThreshold > 0) {
            ctx.fillStyle = '#333'; ctx.fillRect(sx, sy - 10, 32, 3);
            ctx.fillStyle = '#ff8800';
            ctx.fillRect(sx, sy - 10, 32 * (e.stagger / e.staggerThreshold), 3);
          }
        }

        // Bot name tag
        if (e.isBot && !e.isDoomed) {
          drawBotTag(ctx, e, camX, camY);
        }
      }
    });

    // Projectiles
    this.projectiles.forEach(p => {
      const sx = p.pixelX - camX;
      const sy = p.pixelY - camY;
      const col = (p.data && p.data.color) || '#ff5722';
      const grad = ctx.createRadialGradient(sx, sy, 2, sx, sy, p.radius * 3);
      grad.addColorStop(0, col); grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(sx, sy, p.radius * 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(sx, sy, p.radius * 0.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.arc(sx, sy, p.radius, 0, Math.PI * 2); ctx.fill();
    });

    // Basic effects
    this.effects.forEach(fx => {
      const sx = fx.x * 32 - camX;
      const sy = fx.y * 32 - camY;
      if (fx.type === 'slash') {
        ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(sx + 16, sy + 16, 20, 0, Math.PI * 2); ctx.stroke();
      }
      if (fx.type === 'hit') {
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = '#fff'; ctx.fillRect(sx, sy, 32, 32);
        ctx.globalAlpha = 1.0;
      }
    });

    // Skill Effects (additive blending for glow)
    const prevComp = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = 'lighter';
    this.skillEffects.forEach(fx => fx.draw(ctx, camX - this.shakeX, camY - this.shakeY));
    ctx.globalCompositeOperation = prevComp;

    // Farm engine render (only on House map)
    if (this.mapData.id === 8) {
      this.farmEngine.render(ctx, camX, camY);
    }

    // Floating texts
    this.floatingTexts.forEach(t => {
      const sx = t.x - camX;
      const sy = t.y - camY;
      ctx.globalAlpha = t.life / 1.0;
      ctx.fillStyle = t.color;
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(t.text, sx, sy);
      ctx.globalAlpha = 1.0;
    });

    // ── DEATH OVERLAY ──
    if (this.player.isDoomed && this.player.respawnTimer !== undefined) {
      const w = this.canvas.width, h = this.canvas.height;
      // Dark vignette
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(0, 0, w, h);

      // Red border pulse
      const pulse = 0.3 + 0.2 * Math.sin(Date.now() / 300);
      ctx.strokeStyle = `rgba(255, 0, 0, ${pulse})`;
      ctx.lineWidth = 8;
      ctx.strokeRect(4, 4, w - 8, h - 8);
      ctx.lineWidth = 1;

      // Skull icon
      ctx.font = '64px serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ff4444';
      ctx.fillText('💀', w / 2, h / 2 - 50);

      // YOU ARE DEAD text
      ctx.font = 'bold 48px sans-serif';
      ctx.fillStyle = '#ff2222';
      ctx.fillText('YOU ARE DEAD', w / 2, h / 2 + 10);

      // Countdown timer
      const secs = Math.ceil(this.player.respawnTimer);
      ctx.font = 'bold 32px sans-serif';
      ctx.fillStyle = '#ffcc00';
      ctx.fillText(`Reviving in ${secs}s...`, w / 2, h / 2 + 60);

      // Progress bar
      const barW = 300, barH = 12;
      const barX = (w - barW) / 2, barY = h / 2 + 80;
      const progress = 1 - (this.player.respawnTimer / 10);
      ctx.fillStyle = '#333'; ctx.fillRect(barX, barY, barW, barH);
      ctx.fillStyle = '#44ff44'; ctx.fillRect(barX, barY, barW * Math.max(0, progress), barH);
      ctx.strokeStyle = '#666'; ctx.strokeRect(barX, barY, barW, barH);
    }

    // ── NPC LABELS (above NPC tiles on map) ──
    if (this.mapData.npcs) {
      for (const npc of this.mapData.npcs) {
        const sx = npc.x * TILE_SIZE - camX + TILE_SIZE / 2;
        const sy = npc.y * TILE_SIZE - camY - 8;
        const npcData = Object.values(NPCS).find(n => n.id === npc.npcId);
        if (!npcData) continue;
        // Only draw labels within viewport
        if (sx < -100 || sx > this.canvas.width + 100 || sy < -100 || sy > this.canvas.height + 100) continue;
        // NPC icon above tile
        ctx.font = '18px serif';
        ctx.textAlign = 'center';
        ctx.fillText(npcData.icon, sx, sy - 10);
        // NPC name
        ctx.font = 'bold 11px sans-serif';
        ctx.fillStyle = '#ffab40';
        ctx.fillText(npcData.name, sx, sy);
      }
    }

    // ── NPC INTERACTION PROMPT ──
    if (this.nearbyNPC && this.nearbyNPC.npcData) {
      const nd = this.nearbyNPC.npcData;
      const px = this.nearbyNPC.x * TILE_SIZE - camX + TILE_SIZE / 2;
      const py = this.nearbyNPC.y * TILE_SIZE - camY - 32;
      // Floating prompt box
      const promptText = `Press F — ${nd.name}`;
      ctx.font = 'bold 13px sans-serif';
      const tw = ctx.measureText(promptText).width;
      const boxW = tw + 20, boxH = 26;
      const bx = px - boxW / 2, by = py - boxH - 4;
      // Box background with pulse
      const glow = 0.7 + 0.2 * Math.sin(Date.now() / 400);
      ctx.fillStyle = `rgba(0,0,0,${glow})`;
      ctx.beginPath();
      ctx.roundRect(bx, by, boxW, boxH, 6);
      ctx.fill();
      ctx.strokeStyle = '#ffab40';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // Text
      ctx.fillStyle = '#ffcc00';
      ctx.textAlign = 'center';
      ctx.fillText(promptText, px, by + 17);
    }

    // ── GOLD / GEMS HUD ──
    const hudY = 12;
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'right';
    // Gold
    ctx.fillStyle = '#ffd700';
    ctx.fillText(`💰 ${this.gold.toLocaleString()}`, this.canvas.width - 16, hudY + 14);
    // Gems
    ctx.fillStyle = '#aa88ff';
    ctx.fillText(`💎 ${this.gems.toLocaleString()}`, this.canvas.width - 16, hudY + 32);
    ctx.textAlign = 'left';
  }

  drawTileAt(ctx, id, screenX, screenY) {
    const tid = Number(id);
    if (!tid || STATIC_TILE_BLACKLIST.has(tid)) return;
    if (this.images[tid]) {
      ctx.drawImage(this.images[tid], screenX, screenY, 32, 32);
    } else {
      ctx.fillStyle = TILE_COLORS[tid] || '#f0f';
      ctx.fillRect(screenX, screenY, 32, 32);
    }
  }

  loop(timestamp) {
    if (!this.isRunning) return;
    let dt = timestamp - this.lastTime; this.lastTime = timestamp;
    // Clamp dt to prevent huge spikes (tab switch, etc)
    if (dt > 200) dt = 16;
    this.lastDt = dt;
    try { this.update(dt); } catch (e) { console.error('Game update error:', e); }
    try { this.draw(null); } catch (e) { console.error('Game draw error:', e); }
    requestAnimationFrame(this.loop);
  }
}
