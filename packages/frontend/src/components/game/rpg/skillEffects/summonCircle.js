// Summon Circle — pentagram + light rays + rising particles
import { SkillEffectBase, easeOut, PERSPECTIVE, TAU } from './SkillEffectBase.js';

export class SummonCircleEffect extends SkillEffectBase {
    constructor(x, y, color, duration, params) {
        super('summon_circle', x, y, color, duration, params);
        this._initParticles(14);
    }

    render(ctx, sx, sy) {
        const R = this.params.radius || 52;
        const t = this.progress;
        const fade = 1 - t;
        const grow = easeOut(Math.min(1, t * 2.5));

        // Textured outer ring
        this.texturedRing(ctx, sx, sy, R * grow, 5.5, this.color, fade * 0.72, 32);

        // Inner ring (glow + core)
        ctx.globalAlpha = fade * 0.28;
        ctx.strokeStyle = this.lighten(this.color, 40);
        ctx.lineWidth = 7;
        this.ellipse(ctx, sx, sy, R * 0.5 * grow, R * 0.5 * grow * PERSPECTIVE);
        ctx.stroke();
        ctx.globalAlpha = fade * 0.55;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Pentagram
        ctx.globalAlpha = fade * 0.6;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        for (let i = 0; i < 5; i++) {
            const a1 = (TAU / 5) * i + this.angle * 0.7;
            const a2 = (TAU / 5) * ((i + 2) % 5) + this.angle * 0.7;
            const d = R * 0.48 * grow;
            ctx.beginPath();
            ctx.moveTo(sx + Math.cos(a1) * d, sy + Math.sin(a1) * d * PERSPECTIVE);
            ctx.lineTo(sx + Math.cos(a2) * d, sy + Math.sin(a2) * d * PERSPECTIVE);
            ctx.stroke();
        }

        // 5 vertex dots with bloom
        for (let i = 0; i < 5; i++) {
            const a = (TAU / 5) * i + this.angle * 0.7;
            const d = R * 0.48 * grow;
            const px = sx + Math.cos(a) * d;
            const py = sy + Math.sin(a) * d * PERSPECTIVE;
            ctx.globalAlpha = fade * 0.8;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath(); ctx.arc(px, py, 4.5, 0, TAU); ctx.fill();
            this.bloom(ctx, px, py, 14, this.color, 0.45 * fade);
        }

        // Center light rays
        this.lightRays(ctx, sx, sy, R * 0.65 * grow * fade, 10, this.color, 0.35 * fade, this.angle);

        // Rising particles
        this.risingParticles(ctx, sx, sy, this.particles, t, R * 0.35, 60, this.color, fade);

        // Center bloom
        this.bloom(ctx, sx, sy, 30 * fade, this.color, 0.55 * fade);
        this.bloom(ctx, sx, sy, 18 * fade, '#ffffff', 0.4 * fade);
    }
}
