// Meteor — cinematic 3-phase impact (warning → fall → explosion)
import { SkillEffectBase, easeOut, easeIn, PERSPECTIVE, TAU } from './SkillEffectBase.js';

export class MeteorEffect extends SkillEffectBase {
    constructor(x, y, color, duration, params) {
        super('meteor', x, y, color, duration, params);
        this._initParticles(35);
    }

    render(ctx, sx, sy) {
        const R = this.params.radius || 100;
        const t = this.progress;

        // ═══ PHASE 1: WARNING (0 - 0.22) ═══
        if (t < 0.22) {
            const wt = t / 0.22;
            const pulse = 1 + Math.sin(wt * 25) * 0.15;

            // Warning rings
            ctx.globalAlpha = wt * 0.55;
            ctx.strokeStyle = '#ff4400';
            ctx.lineWidth = 4 * pulse;
            this.ellipse(ctx, sx, sy, R * 0.8 * wt * pulse, R * 0.8 * wt * pulse * PERSPECTIVE);
            ctx.stroke();
            ctx.globalAlpha = wt * 0.4;
            ctx.strokeStyle = '#ffaa44';
            ctx.lineWidth = 2.5;
            this.ellipse(ctx, sx, sy, R * 0.45 * wt, R * 0.45 * wt * PERSPECTIVE);
            ctx.stroke();
            // Crosshair
            ctx.globalAlpha = wt * 0.35;
            const cr = R * 0.6 * wt;
            ctx.strokeStyle = '#ff6600'; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(sx - cr, sy); ctx.lineTo(sx + cr, sy); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(sx, sy - cr * PERSPECTIVE); ctx.lineTo(sx, sy + cr * PERSPECTIVE); ctx.stroke();
            // Light rays growing
            this.lightRays(ctx, sx, sy, 50 * wt, 10, '#ff4400', 0.3 * wt, wt * 3);
            this.bloom(ctx, sx, sy, 20 * wt, '#ff6600', 0.4 * wt);
            return;
        }

        // ═══ PHASE 2: FALL (0.22 - 0.42) ═══
        if (t < 0.42) {
            const ft = (t - 0.22) / 0.2;
            const meteorY = sy - 260 + easeIn(ft) * 260;

            // 14-segment flame tail
            for (let i = 0; i < 14; i++) {
                const segFrac = i / 14;
                const segY = meteorY - i * 14;
                const flicker = (this.noise(i, t * 10) - 0.5) * 7;
                const sz = 20 * (1 - segFrac * 0.65);
                // Glow
                ctx.globalAlpha = (1 - segFrac) * 0.4;
                const tGrd = ctx.createRadialGradient(sx + flicker, segY, 0, sx + flicker, segY, sz * 2.8);
                tGrd.addColorStop(0, segFrac < 0.25 ? '#ffee88' : segFrac < 0.5 ? '#ff8800' : '#ff3300');
                tGrd.addColorStop(1, 'transparent');
                ctx.fillStyle = tGrd;
                ctx.beginPath(); ctx.arc(sx + flicker, segY, sz * 2.8, 0, TAU); ctx.fill();
                // Core
                ctx.globalAlpha = (1 - segFrac) * 0.75;
                ctx.fillStyle = segFrac < 0.2 ? '#ffeeaa' : segFrac < 0.5 ? '#ffaa44' : '#ff6600';
                ctx.beginPath(); ctx.arc(sx + flicker, segY, sz, 0, TAU); ctx.fill();
            }

            // Meteor body
            this.bloom(ctx, sx, meteorY, 55, '#ff8800', 0.75);
            this.bloom(ctx, sx, meteorY, 30, '#ffdd66', 0.85);
            ctx.globalAlpha = 1;
            ctx.fillStyle = '#ffeeaa';
            ctx.beginPath(); ctx.arc(sx, meteorY, 16, 0, TAU); ctx.fill();
            this.lightRays(ctx, sx, meteorY, 45, 8, '#ff8800', 0.4, this.angle * 3);
            return;
        }

        // ═══ PHASE 3: IMPACT (0.42 - 1.0) ═══
        const it = (t - 0.42) / 0.58;
        const ifade = it < 0.75 ? 1 : 1 - (it - 0.75) / 0.25;

        // Massive screen flash
        if (it < 0.08) {
            this.screenFlash(ctx, sx, sy, 180, '#ffcc44', (1 - it / 0.08) * 0.75);
        }

        // Gradient crater
        ctx.globalAlpha = ifade * 0.55;
        const crGrd = ctx.createRadialGradient(sx, sy, 0, sx, sy, R * 0.65);
        crGrd.addColorStop(0, '#331100');
        crGrd.addColorStop(0.5, this.rgba('#221100', 0.5));
        crGrd.addColorStop(1, 'transparent');
        ctx.fillStyle = crGrd;
        this.ellipse(ctx, sx, sy, R * 0.7, R * 0.52);
        ctx.fill();

        // 3 double-layer shockwaves
        for (let w = 0; w < 3; w++) {
            const wT = Math.max(0, it - w * 0.05);
            if (wT > 0.8) continue;
            const waveR = R * 1.3 * easeOut(wT / 0.8);
            const wFade = (1 - wT / 0.8) * ifade;
            ctx.globalAlpha = wFade * (0.28 - w * 0.06);
            ctx.strokeStyle = w === 0 ? '#ffcc44' : '#ff8800';
            ctx.lineWidth = (10 - w * 2.5) * ifade;
            this.ellipse(ctx, sx, sy, waveR, waveR * PERSPECTIVE);
            ctx.stroke();
            ctx.globalAlpha = wFade * (0.6 - w * 0.13);
            ctx.lineWidth = (4 - w * 0.8);
            ctx.stroke();
        }

        // Central light rays — massive
        if (it < 0.5) {
            this.lightRays(ctx, sx, sy, R * 0.9 * (1 - it / 0.5), 16, '#ffcc44', 0.55 * ifade * (1 - it / 0.5), it * 4);
        }

        // 7 fire pillars
        for (let i = 0; i < 7; i++) {
            const pa = (TAU / 7) * i + 0.4;
            const pd = R * 0.38;
            const px = sx + Math.cos(pa) * pd;
            const pillarH = 85 * Math.sin(it * Math.PI) * ifade;
            if (pillarH > 8) {
                this.pillar(ctx, px, sy, pillarH, 13, '#ff6600', 0.7 * ifade);
                this.bloom(ctx, px, sy - pillarH, 18, '#ffcc44', 0.55 * ifade);
            }
        }

        // Triple-layer blast bloom
        this.softBloom(ctx, sx, sy, 90 * ifade, '#ff4400', 0.35 * ifade);
        this.bloom(ctx, sx, sy, 60 * ifade, '#ff6600', 0.55 * ifade);
        this.bloom(ctx, sx, sy, 35 * ifade, '#ffcc44', 0.5 * ifade);

        // Dense spark cascade
        this.sparkBurst(ctx, sx, sy, 40, R * 0.85, it, '#ff8844', ifade * 0.7);

        // 35 flying debris
        this.particles.forEach(p => {
            const pt = Math.max(0, it - p.delay * 0.35);
            if (pt <= 0 || pt > 0.7) return;
            const pp = pt / 0.7;
            const dist = R * 0.55 * p.d * easeOut(pp);
            const arcH = Math.sin(pp * Math.PI) * 40;
            const grav = pp * pp * 45;
            const px = sx + Math.cos(p.a) * dist;
            const py = sy + Math.sin(p.a) * dist * PERSPECTIVE - arcH + grav;
            ctx.globalAlpha = (1 - pp) * p.al * ifade * 0.22;
            ctx.fillStyle = '#ff6600';
            ctx.beginPath(); ctx.arc(px, py + 5, 2.5, 0, TAU); ctx.fill();
            ctx.globalAlpha = (1 - pp) * p.al * ifade * 0.85;
            ctx.fillStyle = p.type < 2 ? '#ffcc44' : '#ffffff';
            ctx.beginPath(); ctx.arc(px, py, 2.5 + p.sz * 0.45, 0, TAU); ctx.fill();
        });
    }
}
