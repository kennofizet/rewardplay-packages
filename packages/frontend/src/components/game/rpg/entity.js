import { TILE_SIZE } from './tiles';
import { SkillEffect } from './skillEffects';

// ==========================================
// ENTITY CLASSES
// ==========================================

export class FloatingText {
    constructor(x, y, text, color) {
        this.x = x; this.y = y; this.text = text; this.color = color;
        this.life = 1.0; this.vy = -20;
    }
    update(dt) { this.y += this.vy * dt; this.life -= dt; }
    draw(ctx) {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.font = 'bold 14px monospace';
        ctx.fillText(this.text, this.x, this.y);
        ctx.globalAlpha = 1;
    }
}

export class Projectile {
    constructor(x, y, dx, dy, data, owner) {
        this.x = x; this.y = y;
        this.pixelX = x * TILE_SIZE + 16; this.pixelY = y * TILE_SIZE + 16;
        this.dx = dx; this.dy = dy;
        this.speed = 300;
        this.data = data;
        this.owner = owner;
        this.life = 1.5;
        this.radius = 8;
    }

    update(dt, engine) {
        this.pixelX += this.dx * this.speed * dt;
        this.pixelY += this.dy * this.speed * dt;
        this.life -= dt;
        // Check hit
        const projTileX = this.pixelX / TILE_SIZE;
        const projTileY = this.pixelY / TILE_SIZE;
        const hit = engine.entities.find(e => {
            if (e.isPlayer || e.isDoomed) return false;
            const dx = e.x - projTileX, dy = e.y - projTileY;
            return Math.sqrt(dx * dx + dy * dy) < 1.2;
        });
        if (hit) {
            engine.applyDamage(this.owner, hit, this.data);
            // Impact effect
            engine.skillEffects.push(new SkillEffect(
                'aoe_circle', this.pixelX, this.pixelY,
                this.data.color || '#ff4444', 0.4,
                { radius: 24 }
            ));
            this.life = 0;
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.data.color || '#ff9800';
        ctx.beginPath(); ctx.arc(this.pixelX, this.pixelY, this.radius, 0, Math.PI * 2); ctx.fill();
    }
}

export class Entity {
    constructor(x, y, typeData, isPlayer = false) {
        this.x = x; this.y = y;
        this.pixelX = x * TILE_SIZE; this.pixelY = y * TILE_SIZE;
        this.targetPixelX = this.pixelX; this.targetPixelY = this.pixelY;
        this.isMoving = false; this.moveSpeed = typeData.stats.speed || 150;

        this.name = typeData.name || 'Entity';
        this.stats = { ...typeData.stats };
        this.isPlayer = isPlayer;

        this.cooldowns = {};
        this.status = { stealth: 0, freeze: 0 };
        this.isDoomed = false;

        this.visual = typeData.tileId || 'player';
        this.direction = 'down';
        this.ai = typeData.ai || null; this.aiTimer = 0;

        // Enemy skills (for enemies that can use skills)
        this.skills = typeData.skills || [];
        this.skillTimer = 0;

        // === ECLIPSE: SHATTERED REALM COMBAT ADDITIONS ===
        // Stamina system (for dodge)
        this.stamina = typeData.stats.maxStamina || 100;
        this.maxStamina = typeData.stats.maxStamina || 100;
        this.staminaRegen = 20; // per second

        // Dodge system
        this.isDodging = false;
        this.dodgeTimer = 0;
        this.dodgeCooldown = 0;
        this.dodgeDirX = 0;
        this.dodgeDirY = 0;
        this.dodgeIframes = 0; // invincibility frames
        this.perfectDodgeWindow = 0; // time-slow on perfect dodge
        this.lastDodgeTapTime = 0;
        this.lastDodgeTapDir = '';

        // Stagger system (enemies)
        this.stagger = 0;
        this.staggerThreshold = typeData.stats.staggerThreshold || 100;
        this.isStaggered = false;
        this.staggerTimer = 0;

        // === ANIMATION STATE ===
        // Hit flash (white/red overlay when taking damage)
        this.hitFlash = 0;       // timer in ms, >0 means flashing
        this.hitFlashColor = '#fff';
        // Damage shake (sprite offset oscillation)
        this.damageShake = 0;    // timer in ms
        this.shakeOffsetX = 0;
        this.shakeOffsetY = 0;
        // Running bob (subtle Y bounce when moving)
        this.runTimer = 0;       // accumulator for bob cycle
        this.isRunning = false;
        // Attack swing animation
        this.attackAnim = 0;     // timer in ms
        this.attackDir = 0;      // direction angle of attack
        // Death fade
        this.deathFade = 1.0;    // 1.0 = fully visible, fades to 0
    }
}
