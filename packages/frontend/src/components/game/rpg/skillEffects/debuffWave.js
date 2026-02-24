// Debuff Wave — dark expanding ring with drain particles
import { SkillEffectBase, easeOut, PERSPECTIVE, TAU } from './SkillEffectBase.js';

export class DebuffWaveEffect extends SkillEffectBase {
    constructor(x, y, color, duration, params) {
        super('debuff_wave', x, y, color, duration, params);
        this._initParticles(16);
    }

    render(ctx, sx, sy) {
        const maxR = this.params.maxRadius || 85;
        const t = this.progress;
        const fade = t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3;
        const waveR = maxR * easeOut(t);

        // Dark ground
        ctx.globalAlpha = fade * 0.38;
        const grd = ctx.createRadialGradient(sx, sy, 0, sx, sy, waveR * 0.55);
        grd.addColorStop(0, this.rgba(this.darken(this.color, 60), 0.5));
        grd.addColorStop(0.6, this.rgba(this.darken(this.color, 40), 0.2));
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd;
        this.ellipse(ctx, sx, sy, waveR * 0.55, waveR * 0.4);
        ctx.fill();

        // Expanding wave (glow + core)
        ctx.globalAlpha = fade * 0.28;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 9 * fade;
        this.ellipse(ctx, sx, sy, waveR, waveR * PERSPECTIVE);
        ctx.stroke();
        ctx.globalAlpha = fade * 0.65;
        ctx.lineWidth = 3.5 * fade;
        ctx.stroke();

        // Inner ring
        ctx.globalAlpha = fade * 0.45;
        ctx.strokeStyle = this.lighten(this.color, 35);
        ctx.lineWidth = 2.5;
        this.ellipse(ctx, sx, sy, waveR * 0.4, waveR * 0.4 * PERSPECTIVE);
        ctx.stroke();

        // Dark light rays
        this.lightRays(ctx, sx, sy, waveR * 0.55 * fade, 10, this.color, 0.35 * fade, this.angle * 0.5);

        // Center bloom
        this.bloom(ctx, sx, sy, 28 * fade, this.color, 0.55 * fade);

        // 16 drain particles
        this.particles.forEach(p => {
            const pt = Math.max(0, t - p.delay * 0.4);
            if (pt <= 0 || pt > 0.7) return;
            const pp = pt / 0.7;
            const dist = waveR * 0.55 * p.d * easeOut(pp);
            const px = sx + Math.cos(p.a) * dist;
            const py = sy + Math.sin(p.a) * dist * PERSPECTIVE;
            ctx.globalAlpha = (1 - pp) * p.al * fade * 0.18;
            ctx.strokeStyle = this.color; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(px, py); ctx.stroke();
            ctx.globalAlpha = (1 - pp) * p.al * fade * 0.7;
            ctx.fillStyle = p.type === 0 ? '#ffffff' : this.color;
            ctx.beginPath(); ctx.arc(px, py, 2.8, 0, TAU); ctx.fill();
        });
    }
}
