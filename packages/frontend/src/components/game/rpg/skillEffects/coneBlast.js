// Cone Blast — flame cone with layered gradient + spark cascade
import { SkillEffectBase, easeOut, TAU } from './SkillEffectBase.js';

export class ConeBlastEffect extends SkillEffectBase {
    constructor(x, y, color, duration, params) {
        super('cone_blast', x, y, color, duration, params);
        this.dx = params.dx || 0;
        this.dy = params.dy || 1;
        this._initParticles(25);
    }

    render(ctx, sx, sy) {
        const R = this.params.radius || 90;
        const t = this.progress;
        const fade = t < 0.65 ? 1 : 1 - (t - 0.65) / 0.35;
        const angle = Math.atan2(this.dy, this.dx);
        const spread = Math.PI * 0.36;
        const reach = R * easeOut(Math.min(1, t * 2.2));

        // Screen flash
        if (t < 0.1) {
            this.screenFlash(ctx, sx, sy, 100, this.color, (1 - t / 0.1) * 0.4);
        }

        // 8 nested gradient flame layers
        const layers = [
            { shrink: 0, alpha: 0.24, color: this.darken(this.color, 30) },
            { shrink: 0.05, alpha: 0.34, color: this.color },
            { shrink: 0.1, alpha: 0.42, color: this.lighten(this.color, 15) },
            { shrink: 0.16, alpha: 0.45, color: this.lighten(this.color, 35) },
            { shrink: 0.23, alpha: 0.4, color: this.lighten(this.color, 55) },
            { shrink: 0.3, alpha: 0.32, color: this.lighten(this.color, 75) },
            { shrink: 0.37, alpha: 0.22, color: this.lighten(this.color, 95) },
            { shrink: 0.45, alpha: 0.15, color: '#ffffff' },
        ];
        layers.forEach((layer, li) => {
            const layerR = reach * (1 - layer.shrink);
            const layerSpread = spread * (1 - layer.shrink * 0.45);
            if (layerR < 5) return;
            ctx.globalAlpha = fade * layer.alpha;
            ctx.fillStyle = layer.color;
            ctx.beginPath(); ctx.moveTo(sx, sy);
            const segs = 18;
            for (let i = 0; i <= segs; i++) {
                const segFrac = i / segs;
                const a = angle - layerSpread + layerSpread * 2 * segFrac;
                const n1 = this.noise(i * 7 + li * 50, t * 5) * layerR * 0.12;
                const n2 = this.noise(i * 11 + li * 70, t * 4) * layerR * 0.06;
                ctx.lineTo(sx + Math.cos(a) * (layerR + n1 + n2), sy + Math.sin(a) * (layerR + n1 + n2));
            }
            ctx.closePath(); ctx.fill();
        });

        // 7 heat-haze lines
        for (let i = 0; i < 7; i++) {
            const la = angle - spread * 0.7 + (spread * 1.4 / 6) * i;
            ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.8; ctx.globalAlpha = fade * 0.32;
            ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(sx, sy);
            for (let s = 1; s <= 4; s++) {
                const sR = reach * (s / 4);
                const wobble = (this.noise(i * 11 + s, t * 6) - 0.5) * 14;
                ctx.lineTo(sx + Math.cos(la) * sR + Math.sin(la) * wobble,
                    sy + Math.sin(la) * sR - Math.cos(la) * wobble);
            }
            ctx.stroke(); ctx.lineCap = 'butt';
        }

        // Central axis gradient beam
        const axLen = reach * 0.7;
        const axGrad = ctx.createLinearGradient(sx, sy, sx + Math.cos(angle) * axLen, sy + Math.sin(angle) * axLen);
        axGrad.addColorStop(0, this.rgba('#ffffff', 0.5));
        axGrad.addColorStop(0.5, this.rgba(this.lighten(this.color, 50), 0.25));
        axGrad.addColorStop(1, 'transparent');
        ctx.globalAlpha = fade; ctx.strokeStyle = axGrad; ctx.lineWidth = 7 * fade;
        ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(sx, sy);
        ctx.lineTo(sx + Math.cos(angle) * axLen, sy + Math.sin(angle) * axLen);
        ctx.stroke(); ctx.lineCap = 'butt';

        // Tip light rays
        const tipX = sx + Math.cos(angle) * reach * 0.75;
        const tipY = sy + Math.sin(angle) * reach * 0.75;
        if (t < 0.4) {
            this.lightRays(ctx, tipX, tipY, 45 * (1 - t / 0.4), 10, this.color, 0.4 * fade * (1 - t / 0.4), angle + t * 4);
        }

        // Origin bloom + rays
        this.bloom(ctx, sx, sy, 35 * fade, this.color, 0.55 * fade);
        if (t < 0.2) {
            this.bloom(ctx, sx, sy, 25 * (1 - t / 0.2), '#ffffff', 0.6);
            this.lightRays(ctx, sx, sy, 35 * (1 - t / 0.2), 6, '#ffffff', 0.35 * (1 - t / 0.2), this.angle);
        }

        // Tip bloom
        this.bloom(ctx, tipX, tipY, 28 * fade, '#ffffff', 0.45 * fade);
        this.bloom(ctx, tipX, tipY, 40 * fade, this.color, 0.35 * fade);

        // Dense spark burst
        this.sparkBurst(ctx, tipX, tipY, 25, 50, t, this.color, fade * 0.65);

        // 25 embers with 3-frame trails
        this.particles.forEach(p => {
            const pt = Math.max(0, t - p.delay * 0.6);
            if (pt <= 0 || pt > 0.6) return;
            const pp = pt / 0.6;
            const pA = angle + (p.a - Math.PI) * 0.3;
            const dist = reach * 0.25 + easeOut(pp) * 55 * p.d;
            const grav = pp * pp * 20;
            const drift = Math.sin(pp * Math.PI * 2 + p.phase) * 6;
            const px = sx + Math.cos(pA) * dist + drift;
            const py = sy + Math.sin(pA) * dist + grav;
            for (let g = 2; g >= 0; g--) {
                const gpp = Math.max(0, pp - g * 0.045);
                const gd = reach * 0.25 + easeOut(gpp) * 55 * p.d;
                const gg = gpp * gpp * 20;
                ctx.globalAlpha = (1 - pp) * fade * 0.1 * (1 - g / 3);
                ctx.fillStyle = this.color;
                ctx.beginPath(); ctx.arc(sx + Math.cos(pA) * gd + drift * 0.5, sy + Math.sin(pA) * gd + gg, 2, 0, TAU); ctx.fill();
            }
            ctx.globalAlpha = (1 - pp) * p.al * fade * 0.8;
            ctx.fillStyle = p.type === 0 ? '#ffffff' : this.lighten(this.color, 45);
            ctx.beginPath(); ctx.arc(px, py, 1.8 + p.sz * 0.35, 0, TAU); ctx.fill();
        });
    }
}
