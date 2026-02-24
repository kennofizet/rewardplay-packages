// Tornado — spinning vortex with helix + lightning + debris
import { SkillEffectBase, easeOut, PERSPECTIVE, TAU } from './SkillEffectBase.js';

export class TornadoEffect extends SkillEffectBase {
    constructor(x, y, color, duration, params) {
        super('tornado', x, y, color, duration, params);
        this._initParticles(30);
    }

    render(ctx, sx, sy) {
        const R = this.params.radius || 50;
        const t = this.progress;
        const fade = t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3;
        const H = 120;

        // Gradient ground shadow
        ctx.globalAlpha = fade * 0.45;
        const sGrd = ctx.createRadialGradient(sx, sy, 0, sx, sy, R * 0.85);
        sGrd.addColorStop(0, this.rgba(this.darken(this.color, 70), 0.45));
        sGrd.addColorStop(0.65, this.rgba(this.darken(this.color, 50), 0.15));
        sGrd.addColorStop(1, 'transparent');
        ctx.fillStyle = sGrd;
        this.ellipse(ctx, sx, sy, R * 0.85, R * 0.38);
        ctx.fill();

        // Inner column
        const colGrd = ctx.createLinearGradient(sx, sy, sx, sy - H);
        colGrd.addColorStop(0, this.rgba(this.color, 0.5));
        colGrd.addColorStop(0.25, this.rgba(this.color, 0.3));
        colGrd.addColorStop(0.5, this.rgba(this.lighten(this.color, 30), 0.15));
        colGrd.addColorStop(0.8, this.rgba(this.lighten(this.color, 60), 0.06));
        colGrd.addColorStop(1, 'transparent');
        ctx.globalAlpha = fade * 0.45;
        ctx.fillStyle = colGrd;
        ctx.fillRect(sx - 14, sy - H, 28, H);
        ctx.globalAlpha = fade * 0.3;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(sx - 3, sy - H, 6, H);

        // 16 helix rings
        for (let i = 0; i < 16; i++) {
            const frac = i / 16;
            const ringY = sy - frac * H;
            const taper = 1 - frac * 0.06;
            const breathe = 1 + Math.sin(this.angle * 2.8 + i * 0.4) * 0.12;
            const ringR = R * taper * breathe;
            const wobble = (this.noise(i * 7, t * 3) - 0.5) * 6;
            // Glow
            ctx.globalAlpha = fade * (0.24 - frac * 0.012);
            ctx.strokeStyle = this.color;
            ctx.lineWidth = (9 - frac * 3) * fade;
            this.ellipse(ctx, sx + wobble, ringY, ringR, ringR * 0.28);
            ctx.stroke();
            // Core
            ctx.globalAlpha = fade * (0.58 - frac * 0.025);
            ctx.strokeStyle = frac < 0.3 ? this.color : frac < 0.65 ? this.lighten(this.color, 35) : this.lighten(this.color, 70);
            ctx.lineWidth = (4 - frac * 1.2) * fade;
            ctx.stroke();
        }

        // 5 lightning arcs
        for (let i = 0; i < 5; i++) {
            const boltY = sy - H * (0.12 + i * 0.18);
            const boltA = this.angle * 4.5 + i * 1.3;
            const boltX = sx + Math.cos(boltA) * R * 0.4;
            ctx.lineCap = 'round';
            ctx.globalAlpha = fade * 0.32;
            ctx.strokeStyle = this.rgba(this.color, 0.45);
            ctx.lineWidth = 6;
            ctx.beginPath(); ctx.moveTo(boltX, boltY);
            for (let s = 1; s <= 5; s++) {
                ctx.lineTo(boltX + (this.noise(i * 100 + s, t * 12) - 0.5) * 25, boltY + s * 10);
            }
            ctx.stroke();
            ctx.globalAlpha = fade * 0.65;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.8;
            ctx.beginPath(); ctx.moveTo(boltX, boltY);
            for (let s = 1; s <= 5; s++) {
                ctx.lineTo(boltX + (this.noise(i * 100 + s, t * 12) - 0.5) * 25, boltY + s * 10);
            }
            ctx.stroke();
            ctx.lineCap = 'butt';
        }

        // Top light rays
        this.lightRays(ctx, sx, sy - H, 50 * fade, 10, this.color, 0.4 * fade, this.angle * 1.5);

        // Bloom: top + base
        this.bloom(ctx, sx, sy - H, 32 * fade, '#ffffff', 0.55 * fade);
        this.bloom(ctx, sx, sy - H, 45 * fade, this.color, 0.4 * fade);
        this.bloom(ctx, sx, sy, 25 * fade, this.color, 0.4 * fade);

        // Ground ring
        ctx.globalAlpha = fade * 0.45;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2.5;
        this.ellipse(ctx, sx, sy, R * 0.7, R * 0.3);
        ctx.stroke();

        // 30 spiral debris
        this.particles.forEach((p, i) => {
            const pt = (t + i * 0.03) % 1;
            const spiralA = p.a + this.angle * 3.5 + pt * TAU * 1.2;
            const spiralR = R * 0.55 * p.d * (1 - pt * 0.1);
            const drift = Math.sin(pt * Math.PI * 3 + p.phase) * 5;
            const px = sx + Math.cos(spiralA) * spiralR + drift;
            const py = sy - pt * H;
            const pAlpha = Math.sin(pt * Math.PI) * p.al * fade * 0.55;
            if (pAlpha < 0.02) return;
            ctx.globalAlpha = pAlpha * 0.3;
            ctx.fillStyle = this.color;
            ctx.beginPath(); ctx.arc(px, py + 5, 1.5, 0, TAU); ctx.fill();
            ctx.globalAlpha = pAlpha;
            ctx.fillStyle = p.type === 0 ? '#ffffff' : this.lighten(this.color, 35);
            ctx.beginPath(); ctx.arc(px, py, 1.8 + p.sz * 0.3, 0, TAU); ctx.fill();
        });
    }
}
