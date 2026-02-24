// Slash Arc — blade sweep with ghost trail + spark burst
import { SkillEffectBase, easeOut, TAU } from './SkillEffectBase.js';

export class SlashArcEffect extends SkillEffectBase {
    constructor(x, y, color, duration, params) {
        super('slash_arc', x, y, color, duration, params);
        this.dx = params.dx || 1;
        this.dy = params.dy || 0;
        this._initParticles(30);
    }

    render(ctx, sx, sy) {
        const t = this.progress;
        const fade = t < 0.65 ? 1 : 1 - (t - 0.65) / 0.35;
        const angle = Math.atan2(this.dy, this.dx);
        const sweep = easeOut(t) * Math.PI * 0.95;
        const startA = angle - Math.PI * 0.47;
        const R = 80;

        // Impact flash
        if (t < 0.12) {
            this.screenFlash(ctx, sx, sy, 110, this.color, (1 - t / 0.12) * 0.4);
        }

        // 12 ghost motion trails
        for (let trail = 11; trail >= 0; trail--) {
            const tOff = trail * 0.018;
            const trailT = Math.max(0, t - tOff);
            if (trailT <= 0) continue;
            const trailSweep = easeOut(trailT) * Math.PI * 0.95;
            const trailR = R - trail * 0.7;
            ctx.globalAlpha = fade * 0.14 * (1 - trail / 12);
            ctx.strokeStyle = this.color;
            ctx.lineWidth = (32 - trail * 2.3) * fade;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.arc(sx, sy, trailR, startA + trailSweep * 0.15, startA + trailSweep);
            ctx.stroke();
        }

        // 7-layer gradient blade
        const bladeA = startA + sweep;
        const span = Math.PI * 0.4;
        const layers = [
            { w: 36, alpha: 0.22, clr: this.darken(this.color, 20), shrink: 0 },
            { w: 26, alpha: 0.35, clr: this.color, shrink: 0.04 },
            { w: 18, alpha: 0.5, clr: this.lighten(this.color, 30), shrink: 0.1 },
            { w: 12, alpha: 0.65, clr: this.lighten(this.color, 60), shrink: 0.17 },
            { w: 8, alpha: 0.75, clr: this.lighten(this.color, 90), shrink: 0.25 },
            { w: 4, alpha: 0.85, clr: this.lighten(this.color, 110), shrink: 0.32 },
            { w: 2, alpha: 0.95, clr: '#ffffff', shrink: 0.4 },
        ];
        layers.forEach(l => {
            ctx.globalAlpha = fade * l.alpha;
            ctx.strokeStyle = l.clr;
            ctx.lineWidth = l.w * fade;
            ctx.beginPath();
            ctx.arc(sx, sy, R, bladeA - span * (1 - l.shrink), bladeA);
            ctx.stroke();
        });

        // Inner edge
        ctx.globalAlpha = fade * 0.4;
        ctx.strokeStyle = this.lighten(this.color, 50);
        ctx.lineWidth = 9 * fade;
        ctx.beginPath();
        ctx.arc(sx, sy, R * 0.65, bladeA - span * 0.75, bladeA);
        ctx.stroke();
        ctx.lineCap = 'butt';

        // Tip light rays
        const tipX = sx + Math.cos(bladeA) * R;
        const tipY = sy + Math.sin(bladeA) * R;
        if (t < 0.5) {
            this.lightRays(ctx, tipX, tipY, 55 * (1 - t / 0.5), 10, this.color, 0.45 * fade * (1 - t / 0.5), bladeA + t * 3);
        }

        // Tip bloom
        this.bloom(ctx, tipX, tipY, 45 * fade, '#ffffff', 0.7 * fade);
        this.bloom(ctx, tipX, tipY, 60 * fade, this.color, 0.4 * fade);

        // Origin burst
        if (t < 0.25) {
            const flash = 1 - easeOut(t / 0.25);
            this.bloom(ctx, sx, sy, 45 * flash, this.color, 0.55 * flash);
            this.bloom(ctx, sx, sy, 25 * flash, '#ffffff', 0.65 * flash);
            this.lightRays(ctx, sx, sy, 40 * flash, 6, '#ffffff', 0.35 * flash, this.angle);
        }

        // Dense spark burst
        this.sparkBurst(ctx, tipX, tipY, 30, 60, t, this.color, fade * 0.7);

        // 30 sparks along blade
        this.particles.forEach((p, i) => {
            const st = Math.max(0, t - p.delay * 0.6);
            if (st <= 0 || st > 0.55) return;
            const sp = st / 0.55;
            const sparkA = bladeA - span * p.d;
            const sR = R * (0.6 + easeOut(sp) * 0.6);
            const grav = sp * sp * 22;
            const px = sx + Math.cos(sparkA) * sR;
            const py = sy + Math.sin(sparkA) * sR + grav;

            // 3-frame afterimage trail
            for (let g = 2; g >= 0; g--) {
                const gsp = Math.max(0, sp - g * 0.05);
                const gsR = R * (0.6 + easeOut(gsp) * 0.6);
                const gg = gsp * gsp * 22;
                ctx.globalAlpha = (1 - sp) * fade * 0.12 * (1 - g / 3);
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(sx + Math.cos(sparkA) * gsR, sy + Math.sin(sparkA) * gsR + gg, 2, 0, TAU);
                ctx.fill();
            }

            ctx.globalAlpha = (1 - sp) * fade * 0.9;
            ctx.fillStyle = p.type === 0 ? '#ffffff' : this.lighten(this.color, 60);
            ctx.beginPath(); ctx.arc(px, py, 1.8 + p.sz * 0.4, 0, TAU); ctx.fill();
        });
    }
}
