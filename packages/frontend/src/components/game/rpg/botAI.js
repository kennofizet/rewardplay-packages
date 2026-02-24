import { TILE_SIZE } from './tiles';
import { CLASSES } from './data/classes';
import { Entity } from './entity';
import { SkillEffect } from './skillEffects';

// ==========================================
// BOT AI SYSTEM - Auto-playing characters
// ==========================================

const BOT_NAMES = [
    'xDarkBlade', 'SilverWolf', 'IceQueen99', 'DragonHunter',
    'NightShadow', 'CrimsonKing', 'BluePhoenix', 'StormRider',
    'MoonKnight', 'FireDemon', 'GoldArcher', 'ShadowMage',
    'ThunderGod', 'IronFist', 'DarkAngel', 'StarBreaker',
    'VoidWalker', 'LightBringer', 'DeathWhisper', 'SoulReaper',
    'MysticRune', 'BlazeFury', 'FrostBite', 'HolyPaladin',
    'WindDancer', 'EarthShaker', 'NeonBlade', 'CyberWolf',
];

const CLASS_KEYS = Object.keys(CLASSES);

// Random integer between min and max (inclusive)
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Create a bot entity with random class + stats
 */
export function createBot(x, y) {
    const classKey = CLASS_KEYS[Math.floor(Math.random() * CLASS_KEYS.length)];
    const classData = CLASSES[classKey];
    const name = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];

    // Random stat variation ±20%
    const vary = (val) => Math.floor(val * (0.8 + Math.random() * 0.4));

    const stats = {
        hp: vary(classData.stats.maxHp) * 3,  // 3x HP - bots need to survive enemy swarms
        maxHp: vary(classData.stats.maxHp) * 3,
        mana: 999, maxMana: 999,
        rage: 0, maxRage: classData.stats.maxRage || 0,
        attack: Math.floor(vary(classData.stats.attack) * 1.5),  // 1.5x attack
        defense: Math.floor(vary(classData.stats.defense) * 2),  // 2x defense to tank hits
        speed: vary(classData.stats.speed || 150),
        expReward: 0,
    };
    stats.hp = stats.maxHp;

    const typeData = {
        name: name,
        tileId: 'player', // Use player sprite
        stats: stats,
        ai: 'bot',
        skills: classData.allSkills ? classData.allSkills.slice(0, 6) : [],
    };

    const entity = new Entity(x, y, typeData, false);
    entity.isBot = true;
    entity.moveSpeed = 200; // Fast smooth movement matching player feel
    entity.botClass = classKey;
    entity.botClassName = classData.name;
    entity.botColor = classData.color || '#5c6bc0';
    entity.botSkills = typeData.skills;
    entity.botAttackTimer = 0;
    entity.botSkillTimer = 0;
    entity.botClassSwitchTimer = 60 + Math.random() * 60; // Switch class every 60-120s
    entity.botTarget = null;
    entity.botIdleTimer = 0;
    entity.botWanderDir = { dx: 0, dy: 0 };

    return entity;
}

/**
 * Spawn bots at specified positions on a map
 */
export function spawnBots(botSpawns) {
    if (!botSpawns || botSpawns.length === 0) return [];
    return botSpawns.map(spawn => createBot(spawn.x, spawn.y));
}

/**
 * Switch a bot to a random new class
 */
function switchBotClass(bot) {
    const classKey = CLASS_KEYS[Math.floor(Math.random() * CLASS_KEYS.length)];
    const classData = CLASSES[classKey];
    const vary = (val) => Math.floor(val * (0.8 + Math.random() * 0.4));

    bot.botClass = classKey;
    bot.botClassName = classData.name;
    bot.botColor = classData.color || '#5c6bc0';
    bot.botSkills = classData.allSkills ? classData.allSkills.slice(0, 6) : [];

    // Refresh stats (same multipliers as creation)
    bot.stats.maxHp = vary(classData.stats.maxHp) * 3;
    bot.stats.hp = bot.stats.maxHp;
    bot.stats.attack = Math.floor(vary(classData.stats.attack) * 1.5);
    bot.stats.defense = Math.floor(vary(classData.stats.defense) * 2);
    bot.cooldowns = {};
}

/**
 * Bot AI think function - called each frame
 * Bots move smoothly tile-to-tile (same interpolation as player)
 * and aggressively seek + attack all enemies in range.
 */
export function updateBot(bot, dt, engine) {
    if (bot.isDoomed) return;

    const dtSec = dt / 1000;

    // --- Timers that tick even while moving ---
    // Class switch timer
    bot.botClassSwitchTimer -= dtSec;
    if (bot.botClassSwitchTimer <= 0) {
        switchBotClass(bot);
        bot.botClassSwitchTimer = 60 + Math.random() * 60;
        engine.addFloatText(bot.pixelX, bot.pixelY, `→ ${bot.botClassName}`, '#ffd700');
        engine.skillEffects.push(new SkillEffect('cast_flash', bot.pixelX + 16, bot.pixelY + 16, bot.botColor, 0.5, {}));
    }

    // Cooldown management (ticks while moving too)
    Object.keys(bot.cooldowns).forEach(k => {
        if (bot.cooldowns[k] > 0) bot.cooldowns[k] -= dt;
    });

    // Mana regen
    if (bot.stats.mana < bot.stats.maxMana) bot.stats.mana += 10 * dtSec;

    // HP regen (slow, keeps bots alive longer)
    if (bot.stats.hp < bot.stats.maxHp) {
        bot.stats.hp = Math.min(bot.stats.maxHp, bot.stats.hp + 15 * dtSec);
    }

    // Don't make movement/combat decisions while still interpolating
    if (bot.isMoving) return;

    // --- Find nearest enemy (not player, not bot, not doomed) ---
    let nearest = null, nearestDist = Infinity;
    engine.entities.forEach(e => {
        if (e === bot || e.isPlayer || e.isBot || e.isDoomed) return;
        const ddx = e.x - bot.x, ddy = e.y - bot.y;
        const d = Math.sqrt(ddx * ddx + ddy * ddy); // Euclidean distance for proper range checks
        if (d < nearestDist) { nearest = e; nearestDist = d; }
    });

    bot.botTarget = nearest;
    bot.botAttackTimer -= dtSec;

    if (nearest && nearestDist <= 2.0 && bot.botAttackTimer <= 0) {
        // ── IN RANGE: ATTACK! ──
        bot.botAttackTimer = 0.3 + Math.random() * 0.2; // Very fast attacks
        const px = bot.pixelX + TILE_SIZE / 2;
        const py = bot.pixelY + TILE_SIZE / 2;
        const dx = nearest.x - bot.x;
        const dy = nearest.y - bot.y;
        bot.direction = dy < 0 ? 'up' : dy > 0 ? 'down' : dx < 0 ? 'left' : 'right';

        // Try to use a skill first
        const usedSkill = tryBotSkill(bot, nearest, engine);
        if (!usedSkill) {
            // Default melee attack
            engine.applyDamage(bot, nearest, { damage: 0, name: 'Attack' });
            engine.skillEffects.push(new SkillEffect('slash_arc', px + dx * 24, py + dy * 24, bot.botColor, 0.35, { dx, dy }));
        }
    } else if (nearest && nearestDist <= 20) {
        // ── CHASE: Move toward nearest enemy immediately ──
        // No AI timer gate — bot moves as soon as interpolation finishes (same as player)
        let dx = 0, dy = 0;

        // Prefer the axis with greater distance for natural diagonal approach
        const adx = nearest.x - bot.x;
        const ady = nearest.y - bot.y;
        if (Math.abs(adx) >= Math.abs(ady)) {
            dx = adx > 0 ? 1 : -1;
        } else {
            dy = ady > 0 ? 1 : -1;
        }

        // Try primary direction, then fallback to secondary axis
        if (dx !== 0 || dy !== 0) {
            if (!engine.isBlocked(bot.x + dx, bot.y + dy, bot)) {
                botMove(bot, dx, dy);
            } else {
                // Try the other axis as fallback
                let fdx = 0, fdy = 0;
                if (dx !== 0) { fdy = ady > 0 ? 1 : ady < 0 ? -1 : 0; }
                else { fdx = adx > 0 ? 1 : adx < 0 ? -1 : 0; }
                if ((fdx !== 0 || fdy !== 0) && !engine.isBlocked(bot.x + fdx, bot.y + fdy, bot)) {
                    botMove(bot, fdx, fdy);
                }
            }
        }
    } else {
        // ── IDLE: Wander randomly ──
        bot.botIdleTimer -= dtSec;
        if (bot.botIdleTimer <= 0) {
            bot.botIdleTimer = 0.8 + Math.random() * 1.5; // Faster wandering
            const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1], [0, 0]]; // 20% chance stay
            const d = dirs[Math.floor(Math.random() * dirs.length)];
            if (d[0] !== 0 || d[1] !== 0) {
                if (!engine.isBlocked(bot.x + d[0], bot.y + d[1], bot)) {
                    botMove(bot, d[0], d[1]);
                }
            }
        }
    }
}

/**
 * Helper: move a bot one tile with smooth interpolation
 */
function botMove(bot, dx, dy) {
    bot.x += dx; bot.y += dy;
    bot.isMoving = true;
    bot.targetPixelX = bot.x * TILE_SIZE;
    bot.targetPixelY = bot.y * TILE_SIZE;
    bot.direction = dy < 0 ? 'up' : dy > 0 ? 'down' : dx < 0 ? 'left' : 'right';
}

/**
 * Try to use a random skill from bot's skill list
 */
function tryBotSkill(bot, target, engine) {
    if (!bot.botSkills || bot.botSkills.length === 0) return false;

    // Pick a random skill
    const available = bot.botSkills.filter(s => {
        if (!s) return false;
        const cd = bot.cooldowns[s.name] || 0;
        if (cd > 0) return false;
        const manaCost = s.manaCost || 0;
        const rageCost = s.rageCost || 0;
        if (manaCost > bot.stats.mana) return false;
        if (rageCost > 0 && rageCost > bot.stats.rage) return false;
        return true;
    });

    if (available.length === 0) return false;

    const skill = available[Math.floor(Math.random() * available.length)];
    const px = bot.pixelX + TILE_SIZE / 2;
    const py = bot.pixelY + TILE_SIZE / 2;
    const dx = target.x - bot.x;
    const dy = target.y - bot.y;
    const color = skill.color || bot.botColor;
    const aoeR = (skill.aoeRadius || 2) * TILE_SIZE;

    // Consume resources
    if (skill.manaCost) bot.stats.mana -= skill.manaCost;
    if (skill.rageCost) bot.stats.rage -= skill.rageCost;
    bot.cooldowns[skill.name] = skill.cooldown || 3000;

    const effect = skill.effect || 'melee';

    // Create visual effect based on skill type
    if (effect === 'buff' || effect === 'buff_hp' || effect === 'heal_self') {
        if (effect === 'heal_self') {
            const heal = skill.healAmount || 30;
            bot.stats.hp = Math.min(bot.stats.maxHp, bot.stats.hp + heal);
            engine.addFloatText(bot.pixelX, bot.pixelY, `+${heal}`, '#44ff44');
        }
        engine.skillEffects.push(new SkillEffect('buff_aura', px, py, color, 1.8, { radius: 50 }));
        return true;
    }

    // Cast flash for big skills
    if (['aoe_circle', 'aoe_front', 'cone', 'nova', 'lightning', 'meteor', 'tornado', 'earthquake'].includes(effect)) {
        engine.skillEffects.push(new SkillEffect('cast_flash', px, py, color, 0.4, {}));
    }

    if (effect === 'aoe_circle') {
        engine.skillEffects.push(new SkillEffect('aoe_circle', px, py, color, 1.2, { radius: aoeR }));
    } else if (effect === 'aoe_front' || effect === 'cone') {
        engine.skillEffects.push(new SkillEffect('cone_blast', px + dx * 20, py + dy * 20, color, 1.0, { radius: aoeR * 1.2, dx, dy }));
    } else if (effect === 'nova') {
        engine.skillEffects.push(new SkillEffect('nova_ring', px, py, color, 1.5, { maxRadius: aoeR * 1.3 }));
    } else if (effect === 'lightning') {
        engine.skillEffects.push(new SkillEffect('lightning_bolt', px, py, color, 0.8, { tx: target.pixelX + 16, ty: target.pixelY + 16 }));
    } else if (effect === 'meteor') {
        engine.skillEffects.push(new SkillEffect('meteor', target.pixelX + 16, target.pixelY + 16, color, 2.0, { radius: aoeR * 1.3 }));
        if (engine.screenShake) engine.screenShake(8, 0.4);
    } else if (effect === 'tornado') {
        engine.skillEffects.push(new SkillEffect('tornado', px, py, color, 2.5, { radius: aoeR * 1.2 }));
    } else if (effect === 'earthquake') {
        engine.skillEffects.push(new SkillEffect('earthquake', px, py, color, 2.0, { radius: aoeR * 1.3 }));
        if (engine.screenShake) engine.screenShake(6, 0.3);
    } else {
        engine.skillEffects.push(new SkillEffect('slash_arc', px + dx * 24, py + dy * 24, color, 0.6, { dx, dy }));
    }

    // Apply damage
    engine.applyDamage(bot, target, skill);
    engine.addFloatText(bot.pixelX, bot.pixelY - 20, skill.name, color);

    return true;
}

/**
 * Draw bot name tag and class label
 */
export function drawBotTag(ctx, bot, camX, camY) {
    const sx = bot.pixelX - camX;
    const sy = bot.pixelY - camY;

    // Name tag background
    const nameWidth = bot.name.length * 6 + 8;
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(sx + 16 - nameWidth / 2, sy - 16, nameWidth, 12);

    // Name
    ctx.fillStyle = bot.botColor;
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(bot.name, sx + 16, sy - 7);

    // Class label
    ctx.fillStyle = '#aaa';
    ctx.font = '7px monospace';
    ctx.fillText(`[${bot.botClassName}]`, sx + 16, sy - 22);

    // HP bar
    const hpPercent = bot.stats.hp / bot.stats.maxHp;
    ctx.fillStyle = '#333';
    ctx.fillRect(sx + 4, sy - 2, 24, 3);
    ctx.fillStyle = hpPercent > 0.5 ? '#4caf50' : hpPercent > 0.25 ? '#ff9800' : '#f44336';
    ctx.fillRect(sx + 4, sy - 2, 24 * hpPercent, 3);

    ctx.textAlign = 'left'; // Reset
}

export { BOT_NAMES };
