// Heal Ring — green glow with rising particles
import { SkillEffectBase, easeOut, PERSPECTIVE, TAU } from './SkillEffectBase.js';

export class HealRingEffect extends SkillEffectBase {
    constructor(x, y, color, duration, params) {
        super('heal_ring', x, y, color, duration, params);
        this._initParticles(14);
    }

    render(ctx, sx, sy) {
        const R = this.params.radius || 50;
        const t = this.progress;
        const fade = 1 - t;
        const grow = easeOut(Math.min(1, t * 3));

        // Outer ring (glow + core)
        ctx.globalAlpha = fade * 0.32;
        ctx.strokeStyle = '#44ff44';
        ctx.lineWidth = 11;
        this.ellipse(ctx, sx, sy, R * grow, R * grow * PERSPECTIVE);
        ctx.stroke();
        ctx.globalAlpha = fade * 0.7;
        ctx.lineWidth = 4.5;
        ctx.stroke();

        // Inner ring
        ctx.globalAlpha = fade * 0.5;
        ctx.strokeStyle = '#88ffaa';
        ctx.lineWidth = 2.5;
        this.ellipse(ctx, sx, sy, R * 0.45 * grow, R * 0.45 * grow * PERSPECTIVE);
        ctx.stroke();

        // Cross
        ctx.globalAlpha = fade * 0.85;
        ctx.fillStyle = '#ffffff';
        ctx.save(); ctx.translate(sx, sy); ctx.rotate(this.angle * 0.3);
        ctx.fillRect(-3.5, -18, 7, 36);
        ctx.fillRect(-18, -3.5, 36, 7);
        ctx.restore();

        // Green light rays
        this.lightRays(ctx, sx, sy, R * 0.75 * grow * fade, 10, '#44ff44', 0.35 * fade, this.angle * 0.5);

        // Bloom
        this.bloom(ctx, sx, sy, 35 * grow * fade, '#44ff44', 0.55 * fade);
        this.bloom(ctx, sx, sy, 20 * grow * fade, '#ffffff', 0.45 * fade);

        // Rising particles
        this.risingParticles(ctx, sx, sy, this.particles, t, R * 0.4, 60, '#44ff44', fade);
    }
}
