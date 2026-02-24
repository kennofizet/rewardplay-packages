// Cast Flash — impact flash with light rays
import { SkillEffectBase, easeOut, TAU } from './SkillEffectBase.js';

export class CastFlashEffect extends SkillEffectBase {
    constructor(x, y, color, duration, params) {
        super('cast_flash', x, y, color, duration, params);
    }

    render(ctx, sx, sy) {
        const t = this.progress;
        const fade = 1 - t;

        // Screen flash
        if (t < 0.1) this.screenFlash(ctx, sx, sy, 75, this.color, (1 - t / 0.1) * 0.35);

        // Expanding ring
        const ringR = 38 * easeOut(t);
        ctx.globalAlpha = fade * 0.55;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 5 * fade;
        ctx.beginPath(); ctx.arc(sx, sy, ringR, 0, TAU); ctx.stroke();

        // Light rays
        if (t < 0.4) {
            this.lightRays(ctx, sx, sy, 45 * (1 - t / 0.4), 8, this.color, 0.45 * (1 - t / 0.4), t * 6);
        }

        // Bloom
        this.bloom(ctx, sx, sy, 38 * fade, this.color, 0.6 * fade);
        if (t < 0.35) this.bloom(ctx, sx, sy, 22 * (1 - t / 0.35), '#ffffff', 0.75);
    }
}
