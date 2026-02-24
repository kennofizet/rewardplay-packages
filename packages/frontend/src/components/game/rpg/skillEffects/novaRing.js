// Nova Ring — expanding shockwave with light rays + spark cascade
import { SkillEffectBase, easeOut, PERSPECTIVE, TAU } from './SkillEffectBase.js';

export class NovaRingEffect extends SkillEffectBase {
    constructor(x, y, color, duration, params) {
        super('nova_ring', x, y, color, duration, params);
        this._initParticles(22);
    }

    render(ctx, sx, sy) {
        const maxR = this.params.maxRadius || 65;
        const t = this.progress;
        const fade = t < 0.65 ? 1 : 1 - (t - 0.65) / 0.35;

        // Screen flash
        if (t < 0.1) {
            this.screenFlash(ctx, sx, sy, 120, this.color, (1 - t / 0.1) * 0.45);
        }

        // 4 shockwave rings (glow + core)
        for (let w = 0; w < 4; w++) {
            const wT = Math.max(0, t - w * 0.035);
            const waveR = maxR * easeOut(wT);
            const wFade = (1 - easeOut(wT)) * fade;
            if (wFade < 0.02) continue;
            ctx.globalAlpha = wFade * (0.24 - w * 0.04);
            ctx.strokeStyle = this.color;
            ctx.lineWidth = (10 - w * 2) * fade;
            this.ellipse(ctx, sx, sy, waveR, waveR * PERSPECTIVE);
            ctx.stroke();
            ctx.globalAlpha = wFade * (0.65 - w * 0.12);
            ctx.strokeStyle = w === 0 ? this.lighten(this.color, 35) : this.color;
            ctx.lineWidth = (4 - w * 0.7);
            ctx.stroke();
        }

        // Gradient energy fill
        if (t < 0.4) {
            const wR = maxR * 0.55 * easeOut(t / 0.4);
            const grd = ctx.createRadialGradient(sx, sy, 0, sx, sy, wR);
            grd.addColorStop(0, this.rgba(this.color, 0.35));
            grd.addColorStop(0.6, this.rgba(this.color, 0.12));
            grd.addColorStop(1, 'transparent');
            ctx.globalAlpha = (1 - t / 0.4);
            ctx.fillStyle = grd;
            this.ellipse(ctx, sx, sy, wR, wR * PERSPECTIVE);
            ctx.fill();
        }

        // Center light rays
        if (t < 0.4) {
            this.lightRays(ctx, sx, sy, 60 * (1 - t / 0.4), 12, this.color, 0.5 * (1 - t / 0.4), t * 5);
        }

        // Center flash + bloom
        if (t < 0.25) {
            const fl = 1 - easeOut(t / 0.25);
            this.bloom(ctx, sx, sy, 40 * fl, '#ffffff', 0.75 * fl);
            this.bloom(ctx, sx, sy, 55 * fl, this.color, 0.45 * fl);
        }

        // Dense spark burst
        this.sparkBurst(ctx, sx, sy, 28, maxR * 0.8, t, this.color, fade * 0.65);

        // 22 debris with trail lines
        this.particles.forEach(p => {
            const pt = Math.max(0, t - p.delay * 0.35);
            if (pt <= 0 || pt > 0.7) return;
            const pp = pt / 0.7;
            const dist = maxR * 0.75 * p.d * easeOut(pp);
            const grav = pp * pp * 16;
            const px = sx + Math.cos(p.a) * dist;
            const py = sy + Math.sin(p.a) * dist * PERSPECTIVE + grav;
            ctx.globalAlpha = (1 - pp) * p.al * fade * 0.18;
            ctx.strokeStyle = this.color; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(px, py); ctx.stroke();
            ctx.globalAlpha = (1 - pp) * p.al * fade * 0.8;
            ctx.fillStyle = p.type === 0 ? '#ffffff' : this.lighten(this.color, 40);
            ctx.beginPath(); ctx.arc(px, py, 2.2, 0, TAU); ctx.fill();
        });
    }
}
