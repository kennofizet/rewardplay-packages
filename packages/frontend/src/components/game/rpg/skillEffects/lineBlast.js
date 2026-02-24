// Line Blast — energy beam with gradient layers + sparks
import { SkillEffectBase, easeOut, TAU } from './SkillEffectBase.js';

export class LineBlastEffect extends SkillEffectBase {
    constructor(x, y, color, duration, params) {
        super('line_blast', x, y, color, duration, params);
        this.beamDx = params.dx || 1;
        this.beamDy = params.dy || 0;
        this.length = params.length || 130;
        this._initParticles(16);
    }

    render(ctx, sx, sy) {
        const t = this.progress;
        const fade = t < 0.65 ? 1 : 1 - (t - 0.65) / 0.35;
        const angle = Math.atan2(this.beamDy, this.beamDx);
        const travel = easeOut(Math.min(1, t * 2.2));
        const len = this.length * travel;
        const ex = sx + Math.cos(angle) * len;
        const ey = sy + Math.sin(angle) * len;
        const perpX = -Math.sin(angle);
        const perpY = Math.cos(angle);

        // Screen flash
        if (t < 0.08) {
            this.screenFlash(ctx, sx, sy, 85, this.color, (1 - t / 0.08) * 0.35);
        }

        // Outer glow beam
        const beamGrad = ctx.createLinearGradient(sx, sy, ex, ey);
        beamGrad.addColorStop(0, this.rgba(this.color, 0.45));
        beamGrad.addColorStop(0.6, this.rgba(this.color, 0.35));
        beamGrad.addColorStop(1, this.rgba(this.lighten(this.color, 30), 0.18));
        ctx.globalAlpha = fade;
        ctx.strokeStyle = beamGrad;
        ctx.lineWidth = 32 * fade;
        ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();

        // Noisy beam body
        const segs = 18;
        const halfW = 10;
        ctx.globalAlpha = fade * 0.65;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        for (let i = 0; i <= segs; i++) {
            const tt = i / segs;
            const bx = sx + (ex - sx) * tt, by = sy + (ey - sy) * tt;
            const n = (this.noise(i * 7, t * 6) - 0.5) * 8 * fade;
            ctx.lineTo(bx + perpX * (halfW + n), by + perpY * (halfW + n));
        }
        for (let i = segs; i >= 0; i--) {
            const tt = i / segs;
            const bx = sx + (ex - sx) * tt, by = sy + (ey - sy) * tt;
            const n = (this.noise(i * 7 + 100, t * 6) - 0.5) * 8 * fade;
            ctx.lineTo(bx - perpX * (halfW + n), by - perpY * (halfW + n));
        }
        ctx.closePath(); ctx.fill();

        // Inner bright body
        ctx.globalAlpha = fade * 0.55;
        ctx.fillStyle = this.lighten(this.color, 55);
        ctx.beginPath();
        for (let i = 0; i <= segs; i++) {
            const tt = i / segs;
            const bx = sx + (ex - sx) * tt, by = sy + (ey - sy) * tt;
            const n = (this.noise(i * 11, t * 7) - 0.5) * 5 * fade;
            ctx.lineTo(bx + perpX * (halfW * 0.4 + n), by + perpY * (halfW * 0.4 + n));
        }
        for (let i = segs; i >= 0; i--) {
            const tt = i / segs;
            const bx = sx + (ex - sx) * tt, by = sy + (ey - sy) * tt;
            const n = (this.noise(i * 11 + 100, t * 7) - 0.5) * 5 * fade;
            ctx.lineTo(bx - perpX * (halfW * 0.4 + n), by - perpY * (halfW * 0.4 + n));
        }
        ctx.closePath(); ctx.fill();

        // White core
        ctx.globalAlpha = fade * 0.9;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3 * fade;
        ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
        ctx.lineCap = 'butt';

        // Tip light rays
        if (travel > 0.3) {
            this.lightRays(ctx, ex, ey, 50 * fade, 10, this.color, 0.45 * fade, angle + t * 5);
        }

        // Bloom at both ends
        this.bloom(ctx, sx, sy, 28 * fade, this.color, 0.5 * fade);
        if (travel > 0.3) {
            this.bloom(ctx, ex, ey, 40 * fade, '#ffffff', 0.6 * fade);
            this.bloom(ctx, ex, ey, 55 * fade, this.color, 0.4 * fade);
        }

        // Spark burst at tip
        if (travel > 0.3) {
            this.sparkBurst(ctx, ex, ey, 20, 45, Math.max(0, t - 0.15), this.color, fade * 0.55);
        }

        // 16 side sparks
        this.particles.forEach(p => {
            const pt = Math.max(0, t - p.delay);
            if (pt <= 0 || pt > 0.5) return;
            const pp = pt / 0.5;
            const along = len * p.d;
            const side = (p.a > Math.PI ? 1 : -1);
            const spr = 10 + easeOut(pp) * 20;
            const bx = sx + Math.cos(angle) * along + perpX * side * spr;
            const by = sy + Math.sin(angle) * along + perpY * side * spr;
            const tbx = sx + Math.cos(angle) * along + perpX * side * (spr * 0.35);
            const tby = sy + Math.sin(angle) * along + perpY * side * (spr * 0.35);
            ctx.globalAlpha = (1 - pp) * p.al * fade * 0.18;
            ctx.strokeStyle = this.color; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(tbx, tby); ctx.lineTo(bx, by); ctx.stroke();
            ctx.globalAlpha = (1 - pp) * p.al * fade * 0.75;
            ctx.fillStyle = p.type === 0 ? '#ffffff' : this.lighten(this.color, 40);
            ctx.beginPath(); ctx.arc(bx, by, 2.2, 0, TAU); ctx.fill();
        });
    }
}
