// Bold fade out
import { SkillEffectBase, TAU } from './SkillEffectBase.js';

export class FadeOutEffect extends SkillEffectBase {
    constructor(x, y, color, duration, params) {
        super('fade_out', x, y, color, duration, params);
        this._initParticles(10);
    }

    render(ctx, sx, sy) {
        const t = this.progress;
        const fade = 1 - t;

        // Fading center glow
        this.bloom(ctx, sx, sy, 30 * fade, this.color, 0.45 * fade);

        // Dissolving body
        ctx.globalAlpha = fade * fade * 0.3;
        ctx.fillStyle = this.color;
        ctx.fillRect(sx - 10, sy - 22 * fade, 20, 34 * fade);

        // 10 rising wisps
        this.particles.forEach((p, i) => {
            const pt = (t + i * 0.07) % 1;
            const driftX = Math.sin(pt * Math.PI * 2 + p.phase) * 15;
            const px = sx + driftX + (p.a > Math.PI ? 5 : -5);
            const py = sy - pt * 50;
            ctx.globalAlpha = (1 - pt) * p.al * fade * 0.55;
            ctx.fillStyle = i % 3 === 0 ? '#ffffff' : this.color;
            ctx.beginPath(); ctx.arc(px, py, 3 * (1 - pt * 0.5), 0, TAU); ctx.fill();
        });
    }
}
