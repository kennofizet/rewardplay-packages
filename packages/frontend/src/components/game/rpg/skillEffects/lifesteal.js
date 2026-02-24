// Lifesteal — drain beam with traveling energy orbs
import { SkillEffectBase, easeOut, TAU } from './SkillEffectBase.js';

export class LifestealEffect extends SkillEffectBase {
    constructor(x, y, color, duration, params) {
        super('lifesteal', x, y, color, duration, params);
        this.targetX = params.tx || x;
        this.targetY = params.ty || y + 60;
        this._initParticles(8);
    }

    render(ctx, sx, sy) {
        const tx = this.targetX - (this.x - sx);
        const ty = this.targetY - (this.y - sy);
        const t = this.progress;
        const fade = 1 - t;

        // Wide glow beam
        ctx.globalAlpha = fade * 0.38;
        ctx.strokeStyle = '#ff4444';
        ctx.lineWidth = 18 * fade;
        ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(sx, sy); ctx.stroke();

        // Core beam
        ctx.globalAlpha = fade * 0.72;
        ctx.strokeStyle = '#ff8888';
        ctx.lineWidth = 6 * fade;
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(sx, sy); ctx.stroke();

        // White inner
        ctx.globalAlpha = fade * 0.6;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5 * fade;
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(sx, sy); ctx.stroke();
        ctx.lineCap = 'butt';

        // Light rays at drain/heal points
        this.lightRays(ctx, tx, ty, 35 * fade, 6, '#ff4444', 0.35 * fade, t * 5);
        this.lightRays(ctx, sx, sy, 32 * fade, 6, '#44ff44', 0.35 * fade, -t * 5);

        // Bloom at both ends
        this.bloom(ctx, tx, ty, 32 * fade, '#ff4444', 0.55 * fade);
        this.bloom(ctx, sx, sy, 30 * fade, '#44ff44', 0.55 * fade);

        // 5 traveling orbs with bloom
        for (let i = 0; i < 5; i++) {
            const orbT = (t * 2.8 + i * 0.18) % 1;
            const ox = tx + (sx - tx) * orbT;
            const oy = ty + (sy - ty) * orbT;
            ctx.globalAlpha = fade * 0.8;
            ctx.fillStyle = orbT < 0.5 ? '#ff6644' : '#66ff66';
            ctx.beginPath(); ctx.arc(ox, oy, 5 * fade, 0, TAU); ctx.fill();
            this.bloom(ctx, ox, oy, 12, orbT < 0.5 ? '#ff4444' : '#44ff44', 0.35 * fade);
        }
    }
}
