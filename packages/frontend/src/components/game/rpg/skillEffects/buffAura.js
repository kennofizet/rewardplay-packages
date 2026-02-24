// Buff Aura — orbiting dots + rising particles
import { SkillEffectBase, easeOut, PERSPECTIVE, TAU } from './SkillEffectBase.js';

export class BuffAuraEffect extends SkillEffectBase {
    constructor(x, y, color, duration, params) {
        super('buff_aura', x, y, color, duration, params);
        this._initParticles(14);
    }

    render(ctx, sx, sy) {
        const R = this.params.radius || 42;
        const t = this.progress;
        const fade = 1 - t;
        const pulse = 1 + Math.sin(t * Math.PI * 6) * 0.1;

        // Ground fill
        ctx.globalAlpha = fade * 0.25;
        const grd = ctx.createRadialGradient(sx, sy, 0, sx, sy, R * pulse);
        grd.addColorStop(0, this.rgba(this.darken(this.color, 50), 0.3));
        grd.addColorStop(0.7, this.rgba(this.darken(this.color, 30), 0.1));
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd;
        this.ellipse(ctx, sx, sy, R * pulse, R * pulse * PERSPECTIVE);
        ctx.fill();

        // Outer ring (glow + core)
        ctx.globalAlpha = fade * 0.32;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 9;
        this.ellipse(ctx, sx, sy, R * pulse, R * pulse * PERSPECTIVE);
        ctx.stroke();
        ctx.globalAlpha = fade * 0.65;
        ctx.lineWidth = 3.5;
        ctx.stroke();

        // Inner ring
        ctx.globalAlpha = fade * 0.45;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        this.ellipse(ctx, sx, sy, R * 0.5, R * 0.5 * PERSPECTIVE);
        ctx.stroke();

        // 6 orbiting dots with bloom
        for (let i = 0; i < 6; i++) {
            const a = (TAU / 6) * i + this.angle * 2.5;
            const d = R * 0.75 * pulse;
            const px = sx + Math.cos(a) * d;
            const py = sy + Math.sin(a) * d * PERSPECTIVE;
            ctx.globalAlpha = fade * 0.8;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath(); ctx.arc(px, py, 4, 0, TAU); ctx.fill();
            this.bloom(ctx, px, py, 12, this.color, 0.4 * fade);
        }

        // Subtle light rays
        this.lightRays(ctx, sx, sy, R * 0.55 * fade, 6, this.color, 0.25 * fade, this.angle);

        // Rising particles
        this.risingParticles(ctx, sx, sy, this.particles, t, R * 0.4, 55, this.color, fade);

        // Center glow
        this.bloom(ctx, sx, sy, 28 * fade, this.color, 0.5 * fade);
    }
}
