// Blink Flash — teleport with light rays
import { SkillEffectBase, easeOut, TAU } from './SkillEffectBase.js';

export class BlinkFlashEffect extends SkillEffectBase {
    constructor(x, y, color, duration, params) {
        super('blink_flash', x, y, color, duration, params);
    }

    render(ctx, sx, sy) {
        const t = this.progress;
        const fade = 1 - t;

        // Screen flash
        if (t < 0.1) this.screenFlash(ctx, sx, sy, 85, this.color, (1 - t / 0.1) * 0.4);

        // Double ring (glow + core)
        const ringR = 48 * easeOut(t);
        ctx.globalAlpha = fade * 0.28;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 9 * fade;
        ctx.beginPath(); ctx.arc(sx, sy, ringR, 0, TAU); ctx.stroke();
        ctx.globalAlpha = fade * 0.65;
        ctx.lineWidth = 3.5 * fade;
        ctx.stroke();

        // Inner ring
        ctx.globalAlpha = fade * 0.45;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2 * fade;
        ctx.beginPath(); ctx.arc(sx, sy, ringR * 0.4, 0, TAU); ctx.stroke();

        // Light rays
        if (t < 0.35) {
            this.lightRays(ctx, sx, sy, 55 * (1 - t / 0.35), 10, this.color, 0.45 * (1 - t / 0.35), t * 8);
        }

        // Bloom
        if (t < 0.25) this.bloom(ctx, sx, sy, 35 * (1 - t / 0.25), '#ffffff', 0.75);
        this.bloom(ctx, sx, sy, 28 * fade, this.color, 0.5 * fade);

        // 10 wisps
        for (let i = 0; i < 10; i++) {
            const pt = (t + i * 0.055) % 1;
            const a = (TAU / 10) * i;
            const wx = sx + Math.cos(a) * 14 * (1 - pt);
            const wy = sy - pt * 55;
            ctx.globalAlpha = (1 - pt) * 0.55 * fade;
            ctx.fillStyle = i % 2 === 0 ? '#ffffff' : this.color;
            ctx.beginPath(); ctx.arc(wx, wy, 3.5 * (1 - pt), 0, TAU); ctx.fill();
        }
    }
}
