// AoE Circle — ritual eruption with light rays + pillar forest
import { SkillEffectBase, easeOut, PERSPECTIVE, TAU } from './SkillEffectBase.js';

export class AoeCircleEffect extends SkillEffectBase {
    constructor(x, y, color, duration, params) {
        super('aoe_circle', x, y, color, duration, params);
        this._initParticles(35);
    }

    render(ctx, sx, sy) {
        const R = this.params.radius || 100;
        const t = this.progress;
        const fade = t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3;
        const grow = easeOut(Math.min(1, t * 2.5));
        const rr = R * grow;
        const rrY = rr * PERSPECTIVE;

        // Impact flash
        if (t < 0.08) {
            this.screenFlash(ctx, sx, sy, 140, this.color, (1 - t / 0.08) * 0.45);
        }

        // Gradient ground fill
        ctx.globalAlpha = fade * 0.5;
        const grd = ctx.createRadialGradient(sx, sy, 0, sx, sy, rr * 1.1);
        grd.addColorStop(0, this.rgba(this.darken(this.color, 80), 0.5));
        grd.addColorStop(0.5, this.rgba(this.darken(this.color, 50), 0.25));
        grd.addColorStop(0.8, this.rgba(this.darken(this.color, 30), 0.08));
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd;
        this.ellipse(ctx, sx, sy, rr * 1.1, rrY * 1.1);
        ctx.fill();

        // 4 gradient rings
        const rings = [
            { r: 0.98, w: 7, alpha: 0.75, clr: this.color },
            { r: 0.68, w: 5, alpha: 0.55, clr: this.lighten(this.color, 25) },
            { r: 0.42, w: 3.5, alpha: 0.45, clr: this.lighten(this.color, 55) },
            { r: 0.2, w: 2, alpha: 0.3, clr: '#ffffff' },
        ];
        rings.forEach(ring => {
            const ringR = rr * ring.r;
            ctx.globalAlpha = fade * ring.alpha * 0.3;
            ctx.strokeStyle = ring.clr;
            ctx.lineWidth = ring.w * 3.5;
            this.ellipse(ctx, sx, sy, ringR, ringR * PERSPECTIVE);
            ctx.stroke();
            ctx.globalAlpha = fade * ring.alpha;
            ctx.lineWidth = ring.w;
            ctx.stroke();
        });

        // 10 rune symbols with bloom
        const runeR = rr * 0.78;
        for (let i = 0; i < 10; i++) {
            const ra = (TAU / 10) * i + this.angle * 0.35;
            const rx = sx + Math.cos(ra) * runeR;
            const ry = sy + Math.sin(ra) * runeR * PERSPECTIVE;
            const pulse = 0.6 + Math.sin(t * Math.PI * 4 + i * 0.63) * 0.4;
            this.bloom(ctx, rx, ry, 12 * pulse, this.color, 0.4 * fade * pulse);
            ctx.globalAlpha = fade * 0.7 * pulse;
            ctx.fillStyle = '#ffffff';
            ctx.save(); ctx.translate(rx, ry); ctx.rotate(ra + this.angle * 1.5);
            ctx.fillRect(-1.5, -6, 3, 12);
            ctx.fillRect(-6, -1.5, 12, 3);
            ctx.restore();
        }

        // Central light rays
        this.lightRays(ctx, sx, sy, rr * 0.95 * fade, 14, this.color, 0.4 * fade, this.angle * 0.6);

        // 7 energy pillars with bloom tips
        for (let i = 0; i < 7; i++) {
            const pa = (TAU / 7) * i + 0.3;
            const pd = rr * 0.4;
            const px = sx + Math.cos(pa) * pd;
            const wave = Math.sin(t * Math.PI * 2 + i * 0.9);
            const pillarH = 80 * Math.abs(wave) * fade;
            if (pillarH > 8) {
                this.pillar(ctx, px, sy, pillarH, 11, this.color, 0.65 * fade);
                this.bloom(ctx, px, sy - pillarH, 18, '#ffffff', 0.55 * fade * Math.abs(wave));
                this.bloom(ctx, px, sy - pillarH, 28, this.color, 0.35 * fade * Math.abs(wave));
            }
        }

        // Center bloom stack
        this.softBloom(ctx, sx, sy, 75 * grow * fade, this.color, 0.35 * fade);
        this.bloom(ctx, sx, sy, 45 * grow * fade, this.color, 0.55 * fade);
        this.bloom(ctx, sx, sy, 22 * grow * fade, '#ffffff', 0.5 * fade);

        // Expanding shockwave
        if (t < 0.4) {
            const wt = easeOut(t / 0.4);
            const wR = R * 1.2 * wt * grow;
            ctx.globalAlpha = (1 - wt) * 0.55;
            ctx.strokeStyle = this.lighten(this.color, 30);
            ctx.lineWidth = 5 * (1 - wt);
            this.ellipse(ctx, sx, sy, wR, wR * PERSPECTIVE);
            ctx.stroke();
        }

        // 35 rising embers
        this.risingParticles(ctx, sx, sy, this.particles, t, rr * 0.5, 75, this.color, fade);

        // Spark burst on impact
        if (t < 0.35) {
            this.sparkBurst(ctx, sx, sy, 35, rr * 0.7, t / 0.35, this.color, (1 - t / 0.35) * 0.55);
        }
    }
}
