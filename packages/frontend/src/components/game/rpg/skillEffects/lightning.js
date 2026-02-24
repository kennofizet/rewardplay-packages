// Lightning — electric strike with flickering bolts + spark cascade
import { SkillEffectBase, easeOut, PERSPECTIVE, TAU } from './SkillEffectBase.js';

export class LightningEffect extends SkillEffectBase {
    constructor(x, y, color, duration, params) {
        super('lightning', x, y, color, duration, params);
        this.targetX = params.tx || x;
        this.targetY = params.ty || y + 80;
        this._initParticles(22);
    }

    render(ctx, sx, sy) {
        const tx = this.targetX - (this.x - sx);
        const ty = this.targetY - (this.y - sy);
        const t = this.progress;
        const fade = t < 0.65 ? 1 : 1 - (t - 0.65) / 0.35;
        const skyY = sy - 90;

        // Strike flash
        if (t < 0.1) {
            this.screenFlash(ctx, tx, ty, 150, this.color, (1 - t / 0.1) * 0.55);
        }

        // Atmospheric glow
        this.softBloom(ctx, tx, ty, 80 * fade, this.color, 0.35 * fade);
        this.softBloom(ctx, sx, skyY, 45 * fade, this.color, 0.2 * fade);

        // Main bolt (flickering)
        const flicker = Math.sin(t * 60) > -0.3 ? 1 : 0.3;
        this.drawBolt(ctx, sx, skyY, tx, ty, this.color, fade * flicker);

        // 3 secondary bolts
        for (let i = 0; i < 3; i++) {
            const ox = (i - 1) * 10;
            ctx.globalAlpha = fade * 0.4 * flicker;
            const p2 = [];
            const segs = 7;
            for (let s = 0; s <= segs; s++) {
                const frac = s / segs;
                p2.push({
                    x: sx + ox + (tx - sx) * frac + (this.noise(i * 200 + s * 19, t * 8) - 0.5) * 35,
                    y: skyY + (ty - skyY) * frac + (this.noise(i * 200 + s * 23 + 300, t * 8) - 0.5) * 18,
                });
            }
            ctx.strokeStyle = this.rgba(this.color, fade * 0.25);
            ctx.lineWidth = 9; ctx.lineCap = 'round';
            ctx.beginPath(); p2.forEach((p, j) => j === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)); ctx.stroke();
            ctx.strokeStyle = this.rgba('#ffffff', fade * 0.65);
            ctx.lineWidth = 2.5;
            ctx.beginPath(); p2.forEach((p, j) => j === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)); ctx.stroke();
            ctx.lineCap = 'butt';
        }

        // 7 fork branches
        for (let fork = 0; fork < 7; fork++) {
            const fStart = 0.1 + fork * 0.12;
            const mx = sx + (tx - sx) * fStart;
            const my = skyY + (ty - skyY) * fStart;
            const fa = (fork - 3) * 0.5 + this.noise(fork * 7, t) * 0.4;
            const fLen = 20 + this.noise(fork + 20, 0) * 28;
            const fex = mx + Math.cos(fa) * fLen;
            const fey = my + Math.sin(fa) * fLen;
            ctx.globalAlpha = fade * 0.28 * flicker;
            ctx.strokeStyle = this.rgba(this.color, 0.35);
            ctx.lineWidth = 6; ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(fex, fey); ctx.stroke();
            ctx.globalAlpha = fade * 0.7 * flicker;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.8;
            ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(fex, fey); ctx.stroke();
            ctx.lineCap = 'butt';
        }

        // Impact light rays
        if (t < 0.45) {
            const pulse = 1 + Math.sin(t * 40) * 0.15;
            this.lightRays(ctx, tx, ty, 65 * pulse * (1 - t / 0.45), 12, this.color, 0.5 * fade * (1 - t / 0.45), t * 8);
        }

        // Impact bloom stack
        const pulse = 1 + Math.sin(t * 30) * 0.1;
        this.bloom(ctx, tx, ty, 40 * pulse * fade, '#ffffff', 0.6 * fade);
        this.bloom(ctx, tx, ty, 55 * pulse * fade, this.color, 0.45 * fade);
        // Ground ring
        ctx.globalAlpha = fade * 0.45;
        ctx.strokeStyle = this.lighten(this.color, 30);
        ctx.lineWidth = 2.5;
        this.ellipse(ctx, tx, ty, 28 * easeOut(Math.min(1, t * 2)) * pulse, 14 * easeOut(Math.min(1, t * 2)) * pulse);
        ctx.stroke();

        // Spark burst at impact
        this.sparkBurst(ctx, tx, ty, 25, 55, t, this.color, fade * 0.7);

        // 22 sparks
        this.particles.forEach(p => {
            const pt = Math.max(0, t - p.delay);
            if (pt <= 0 || pt > 0.55) return;
            const pp = pt / 0.55;
            const dist = 30 * p.d * easeOut(pp);
            const grav = pp * pp * 18;
            const px = tx + Math.cos(p.a) * dist;
            const py = ty + Math.sin(p.a) * dist * 0.5 + grav;
            ctx.globalAlpha = (1 - pp) * p.al * fade * 0.18;
            ctx.strokeStyle = this.color; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(px, py); ctx.stroke();
            ctx.globalAlpha = (1 - pp) * p.al * fade * 0.85;
            ctx.fillStyle = p.type === 0 ? '#ffffff' : this.lighten(this.color, 45);
            ctx.beginPath(); ctx.arc(px, py, 2.2, 0, TAU); ctx.fill();
        });
    }
}
