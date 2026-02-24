// ─────────────────────────────────────
// Skill Effect Base — Optimized + Beautiful
// Glow via radial gradients (NO shadowBlur)
// Additive blending handled by gameEngine
// ─────────────────────────────────────
export const TAU = Math.PI * 2;
export const PERSPECTIVE = 0.55;

export function easeOut(t) { return 1 - (1 - t) * (1 - t); }
export function easeIn(t) { return t * t; }
export function easeInOut(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
export function easeOutElastic(t) {
    if (t === 0 || t === 1) return t;
    return Math.pow(2, -10 * t) * Math.sin((t - 0.075) * (TAU / 0.3)) + 1;
}

function hashRand(seed) {
    let h = seed | 0;
    h = ((h >> 16) ^ h) * 0x45d9f3b;
    h = ((h >> 16) ^ h) * 0x45d9f3b;
    h = (h >> 16) ^ h;
    return (h & 0x7fffffff) / 0x7fffffff;
}

export class SkillEffectBase {
    constructor(type, x, y, color, duration, params) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.color = color || '#ffffff';
        this.duration = duration || 0.5;
        this.params = params || {};
        this.elapsed = 0;
        this.done = false;
        this._seed = (x * 7919 + y * 104729) | 0;
        this.angle = 0;
    }

    get progress() { return Math.min(1, this.elapsed / this.duration); }
    get life() { return this.duration - this.elapsed; }

    update(dt) {
        this.elapsed += dt;
        this.angle += dt * 4;
        if (this.elapsed >= this.duration) this.done = true;
    }

    draw(ctx, camX, camY) {
        const sx = this.x - camX;
        const sy = this.y - camY;
        ctx.save();
        this.render(ctx, sx, sy);
        ctx.restore();
    }

    render(ctx, sx, sy) { }

    // Deterministic noise
    noise(i, t) { return hashRand(this._seed + i * 1337 + (t * 100 | 0)); }

    // Init particles
    _initParticles(count) {
        this.particles = [];
        for (let i = 0; i < count; i++) {
            this.particles.push({
                a: hashRand(this._seed + i * 31) * TAU,
                d: 0.3 + hashRand(this._seed + i * 53) * 0.7,
                sz: 1 + hashRand(this._seed + i * 71) * 2,
                delay: hashRand(this._seed + i * 97) * 0.3,
                al: 0.4 + hashRand(this._seed + i * 113) * 0.6,
                phase: hashRand(this._seed + i * 137) * TAU,
                type: (hashRand(this._seed + i * 151) * 3) | 0,
                speed: 0.5 + hashRand(this._seed + i * 173) * 1.5,
            });
        }
    }

    // ── Color helpers ──
    rgba(color, alpha) {
        if (color.startsWith('rgba')) return color;
        if (color.startsWith('rgb(')) return color.replace('rgb(', 'rgba(').replace(')', `,${alpha})`);
        if (color.startsWith('#') && color.length >= 7) {
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            return `rgba(${r},${g},${b},${alpha})`;
        }
        return color;
    }

    lighten(color, amt) {
        if (!color.startsWith('#') || color.length < 7) return color;
        return `rgb(${Math.min(255, parseInt(color.slice(1, 3), 16) + amt)},${Math.min(255, parseInt(color.slice(3, 5), 16) + amt)},${Math.min(255, parseInt(color.slice(5, 7), 16) + amt)})`;
    }

    darken(color, amt) {
        if (!color.startsWith('#') || color.length < 7) return color;
        return `rgb(${Math.max(0, parseInt(color.slice(1, 3), 16) - amt)},${Math.max(0, parseInt(color.slice(3, 5), 16) - amt)},${Math.max(0, parseInt(color.slice(5, 7), 16) - amt)})`;
    }

    // ── Bloom (radial gradient glow) ──
    bloom(ctx, x, y, radius, color, alpha) {
        if (radius < 1 || alpha < 0.01) return;
        ctx.globalAlpha = alpha;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
        grad.addColorStop(0, this.rgba(color, 0.9));
        grad.addColorStop(0.3, this.rgba(color, 0.5));
        grad.addColorStop(0.6, this.rgba(color, 0.15));
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(x, y, radius, 0, TAU); ctx.fill();
    }

    // Wide ambient glow
    softBloom(ctx, x, y, radius, color, alpha) {
        if (radius < 1 || alpha < 0.01) return;
        ctx.globalAlpha = alpha;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
        grad.addColorStop(0, this.rgba(color, 0.6));
        grad.addColorStop(0.5, this.rgba(color, 0.2));
        grad.addColorStop(0.8, this.rgba(color, 0.05));
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(x, y, radius, 0, TAU); ctx.fill();
    }

    // ── Isometric ellipse ──
    ellipse(ctx, x, y, rx, ry) {
        ctx.beginPath();
        ctx.ellipse(x, y, Math.max(1, rx), Math.max(1, ry || rx * PERSPECTIVE), 0, 0, TAU);
    }

    // ── God rays (radial light beams) ──
    lightRays(ctx, x, y, radius, count, color, alpha, rotation) {
        if (alpha < 0.01) return;
        const rot = rotation || 0;
        for (let i = 0; i < count; i++) {
            const a = (TAU / count) * i + rot;
            const rayLen = radius * (0.7 + this.noise(i * 17, this.progress * 3) * 0.6);
            const rayW = Math.PI / count * 0.4;
            ctx.globalAlpha = alpha * (0.5 + this.noise(i * 23, this.progress * 5) * 0.5);
            const tipX = x + Math.cos(a) * rayLen;
            const tipY = y + Math.sin(a) * rayLen;
            const grad = ctx.createLinearGradient(x, y, tipX, tipY);
            grad.addColorStop(0, this.rgba(color, 0.8));
            grad.addColorStop(0.4, this.rgba(color, 0.3));
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.moveTo(x + Math.cos(a - rayW) * 3, y + Math.sin(a - rayW) * 3);
            ctx.lineTo(tipX, tipY);
            ctx.lineTo(x + Math.cos(a + rayW) * 3, y + Math.sin(a + rayW) * 3);
            ctx.closePath();
            ctx.fill();
        }
    }

    // ── Screen flash (big impact radial burst) ──
    screenFlash(ctx, x, y, radius, color, alpha) {
        if (alpha < 0.01) return;
        ctx.globalAlpha = alpha;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
        grad.addColorStop(0, this.rgba('#ffffff', 0.95));
        grad.addColorStop(0.2, this.rgba(color, 0.7));
        grad.addColorStop(0.5, this.rgba(color, 0.3));
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(x, y, radius, 0, TAU); ctx.fill();
    }

    // ── Dense spark burst ──
    sparkBurst(ctx, x, y, count, radius, progress, color, alpha) {
        if (alpha < 0.02) return;
        for (let i = 0; i < count; i++) {
            const a = (TAU / count) * i + this.noise(i, 0) * 0.5;
            const sparkT = Math.max(0, progress - this.noise(i + 50, 0) * 0.15);
            if (sparkT <= 0 || sparkT > 0.8) continue;
            const sp = sparkT / 0.8;
            const dist = radius * easeOut(sp) * (0.5 + this.noise(i + 100, 0) * 0.5);
            const grav = sp * sp * 12;
            const px = x + Math.cos(a) * dist;
            const py = y + Math.sin(a) * dist * 0.6 + grav;
            const fade = (1 - sp);
            // Trail line
            const tDist = dist * 0.6;
            ctx.globalAlpha = fade * alpha * 0.2;
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x + Math.cos(a) * tDist, y + Math.sin(a) * tDist * 0.6 + grav * 0.4);
            ctx.lineTo(px, py);
            ctx.stroke();
            // Spark head
            ctx.globalAlpha = fade * alpha * 0.85;
            ctx.fillStyle = i % 3 === 0 ? '#ffffff' : this.lighten(color.startsWith('#') ? color : this.color, 40);
            ctx.beginPath(); ctx.arc(px, py, 1.2 + this.noise(i, 0) * 1.5, 0, TAU); ctx.fill();
        }
    }

    // ── Rising energy particles ──
    risingParticles(ctx, x, y, particles, t, radius, height, color, fade) {
        particles.forEach((p, i) => {
            const pt = (t * 1.8 + i * 0.04) % 1;
            const drift = Math.sin(pt * Math.PI * 3 + p.phase) * radius * 0.2;
            const px = x + Math.cos(p.a) * radius * 0.35 * p.d + drift;
            const py = y - pt * height;
            const pAlpha = Math.sin(pt * Math.PI) * p.al * fade * 0.5;
            if (pAlpha < 0.02) return;
            // Trail below
            ctx.globalAlpha = pAlpha * 0.3;
            ctx.fillStyle = color;
            ctx.beginPath(); ctx.arc(px, py + 5, 1.5, 0, TAU); ctx.fill();
            // Head
            ctx.globalAlpha = pAlpha;
            ctx.fillStyle = p.type === 0 ? '#ffffff' : this.lighten(color.startsWith('#') ? color : this.color, 35);
            ctx.beginPath(); ctx.arc(px, py, 1.5 + p.sz * 0.3, 0, TAU); ctx.fill();
        });
    }

    // ── Vertical pillar of light ──
    pillar(ctx, x, y, height, width, color, alpha) {
        if (height < 1) return;
        ctx.globalAlpha = alpha;
        const grad = ctx.createLinearGradient(x, y, x, y - height);
        grad.addColorStop(0, this.rgba(color, 0.7));
        grad.addColorStop(0.3, this.rgba(color, 0.4));
        grad.addColorStop(0.7, this.rgba(color, 0.15));
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(x - width / 2, y - height, width, height);
        // White inner core
        ctx.globalAlpha = alpha * 0.5;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x - 1.5, y - height, 3, height);
    }

    // ── Textured ring (noisy edge, multi-layer) ──
    texturedRing(ctx, cx, cy, r, width, color, alpha, segments) {
        segments = segments || 40;
        // Wide soft glow
        ctx.strokeStyle = this.rgba(color, alpha * 0.25);
        ctx.lineWidth = width * 2.5;
        ctx.beginPath();
        for (let i = 0; i <= segments; i++) {
            const a = (TAU / segments) * i;
            const n = this.noise(i * 7, this.progress * 2) * (width * 0.5);
            const px = cx + Math.cos(a) * (r + n);
            const py = cy + Math.sin(a) * (r + n) * PERSPECTIVE;
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.stroke();
        // Bright core
        ctx.strokeStyle = this.rgba('#ffffff', alpha * 0.4);
        ctx.lineWidth = width * 0.4;
        ctx.beginPath();
        for (let i = 0; i <= segments; i++) {
            const a = (TAU / segments) * i;
            const n = this.noise(i * 7 + 100, this.progress * 2) * (width * 0.3);
            const px = cx + Math.cos(a) * (r + n);
            const py = cy + Math.sin(a) * (r + n) * PERSPECTIVE;
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.stroke();
    }

    // ── Lightning bolt (3-layer, rounded caps) ──
    drawBolt(ctx, x1, y1, x2, y2, color, alpha) {
        const points = [{ x: x1, y: y1 }];
        const dx = x2 - x1, dy = y2 - y1;
        const detail = 8;
        const spread = Math.sqrt(dx * dx + dy * dy) * 0.15;
        for (let i = 1; i < detail; i++) {
            const t = i / detail;
            points.push({
                x: x1 + dx * t + (this.noise(i * 31, this.progress * 6) - 0.5) * spread,
                y: y1 + dy * t + (this.noise(i * 37 + 500, this.progress * 6) - 0.5) * spread
            });
        }
        points.push({ x: x2, y: y2 });

        ctx.lineCap = 'round';
        ctx.strokeStyle = this.rgba(color, alpha * 0.3);
        ctx.lineWidth = 14;
        ctx.beginPath();
        points.forEach((p, j) => j === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.stroke();
        ctx.strokeStyle = this.rgba('#ffffff', alpha * 0.9);
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        points.forEach((p, j) => j === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.stroke();
        ctx.strokeStyle = this.rgba(color, alpha * 0.7);
        ctx.lineWidth = 2;
        ctx.beginPath();
        points.forEach((p, j) => j === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.stroke();
        ctx.lineCap = 'butt';

        return points;
    }
}
