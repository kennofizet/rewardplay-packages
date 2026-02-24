// Earthquake — ground eruption with lava cracks + pillar forest
import { SkillEffectBase, easeOut, PERSPECTIVE, TAU } from './SkillEffectBase.js';

export class EarthquakeEffect extends SkillEffectBase {
    constructor(x, y, color, duration, params) {
        super('earthquake', x, y, color, duration, params);
        this._initParticles(28);
        this.cracks = [];
        for (let i = 0; i < 12; i++) {
            this.cracks.push(TAU / 12 * i + (this.noise(i, 0) - 0.5) * 0.3);
        }
    }

    render(ctx, sx, sy) {
        const R = this.params.radius || 100;
        const t = this.progress;
        const fade = t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3;
        const grow = easeOut(Math.min(1, t * 3));

        // Screen flash
        if (t < 0.08) {
            this.screenFlash(ctx, sx, sy, 130, '#ff6600', (1 - t / 0.08) * 0.45);
        }

        // Gradient ground fill
        ctx.globalAlpha = fade * 0.55;
        const grd = ctx.createRadialGradient(sx, sy, 0, sx, sy, R * 0.7 * grow);
        grd.addColorStop(0, '#442200');
        grd.addColorStop(0.5, this.rgba('#331100', 0.5));
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd;
        this.ellipse(ctx, sx, sy, R * 0.75 * grow, R * 0.55 * grow);
        ctx.fill();

        // 3 double-layer shockwaves
        for (let w = 0; w < 3; w++) {
            const wT = Math.max(0, t - w * 0.05);
            if (wT > 0.7) continue;
            const waveR = R * 1.1 * easeOut(wT / 0.7);
            const wFade = (1 - wT / 0.7) * fade;
            ctx.globalAlpha = wFade * (0.24 - w * 0.05);
            ctx.strokeStyle = w === 0 ? '#ffaa44' : '#ff6600';
            ctx.lineWidth = (9 - w * 2.5) * fade;
            this.ellipse(ctx, sx, sy, waveR, waveR * PERSPECTIVE);
            ctx.stroke();
            ctx.globalAlpha = wFade * (0.58 - w * 0.15);
            ctx.lineWidth = (4 - w);
            ctx.stroke();
        }

        // 12 jagged cracks (glow + core + tip bloom)
        this.cracks.forEach((a, i) => {
            const crackLen = R * 0.8 * grow;
            ctx.lineCap = 'round';
            ctx.strokeStyle = this.rgba('#ff5500', 0.32);
            ctx.lineWidth = 8 * fade; ctx.globalAlpha = fade * 0.32;
            ctx.beginPath(); ctx.moveTo(sx, sy);
            for (let s = 1; s <= 5; s++) {
                const sR = crackLen * (s / 5);
                const wobble = (this.noise(i * 13 + s, t * 3) - 0.5) * 18;
                ctx.lineTo(sx + Math.cos(a) * sR + Math.sin(a) * wobble,
                    sy + Math.sin(a) * sR * PERSPECTIVE - Math.cos(a) * wobble * PERSPECTIVE);
            }
            ctx.stroke();
            ctx.strokeStyle = '#ff8844';
            ctx.lineWidth = 3 * fade; ctx.globalAlpha = fade * 0.72;
            ctx.beginPath(); ctx.moveTo(sx, sy);
            for (let s = 1; s <= 5; s++) {
                const sR = crackLen * (s / 5);
                const wobble = (this.noise(i * 13 + s, t * 3) - 0.5) * 18;
                ctx.lineTo(sx + Math.cos(a) * sR + Math.sin(a) * wobble,
                    sy + Math.sin(a) * sR * PERSPECTIVE - Math.cos(a) * wobble * PERSPECTIVE);
            }
            ctx.stroke(); ctx.lineCap = 'butt';
            this.bloom(ctx, sx + Math.cos(a) * crackLen, sy + Math.sin(a) * crackLen * PERSPECTIVE, 12 * fade, '#ff8844', 0.38 * fade);
        });

        // Center lava light rays
        this.lightRays(ctx, sx, sy, R * 0.65 * grow * fade, 12, '#ff6600', 0.45 * fade, this.angle * 0.3);

        // 7 gradient pillars
        for (let i = 0; i < 7; i++) {
            const pa = (TAU / 7) * i + 0.3;
            const pd = R * 0.42 * grow;
            const px = sx + Math.cos(pa) * pd;
            const pillarH = 60 * Math.abs(Math.sin(t * Math.PI * 2 + i * 0.9)) * fade;
            if (pillarH > 6) {
                this.pillar(ctx, px, sy, pillarH, 12, '#ff8844', 0.65 * fade);
                this.bloom(ctx, px, sy - pillarH, 15, '#ffcc44', 0.55 * fade);
            }
        }

        // Triple lava bloom
        this.softBloom(ctx, sx, sy, 60 * fade, '#ff4400', 0.35 * fade);
        this.bloom(ctx, sx, sy, 42 * fade, '#ff6600', 0.55 * fade);
        this.bloom(ctx, sx, sy, 24 * fade, '#ffcc44', 0.45 * fade);

        // Spark burst
        this.sparkBurst(ctx, sx, sy, 30, R * 0.65, t, '#ff8844', fade * 0.6);

        // 28 debris with trails
        this.particles.forEach(p => {
            const pt = Math.max(0, t - p.delay);
            if (pt <= 0 || pt > 0.6) return;
            const pp = pt / 0.6;
            const dist = R * 0.45 * p.d * easeOut(pp);
            const arcH = Math.sin(pp * Math.PI) * 32;
            const grav = pp * pp * 35;
            const px = sx + Math.cos(p.a) * dist;
            const py = sy + Math.sin(p.a) * dist * PERSPECTIVE - arcH + grav;
            ctx.globalAlpha = (1 - pp) * p.al * fade * 0.2;
            ctx.fillStyle = '#ff6600';
            ctx.beginPath(); ctx.arc(px, py + 4, 2.2, 0, TAU); ctx.fill();
            ctx.globalAlpha = (1 - pp) * p.al * fade * 0.8;
            ctx.fillStyle = p.type === 0 ? '#ffaa44' : p.type === 1 ? '#ff6600' : '#ffffff';
            ctx.beginPath(); ctx.arc(px, py, 2.2 + p.sz * 0.4, 0, TAU); ctx.fill();
        });
    }
}
