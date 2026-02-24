// ══════════════════════════════════════════
// MU ONLINE SKILL EFFECTS — MAIN MODULE
// Factory function that delegates to individual
// effect files in the skillEffects/ directory
//
// BACKWARDS-COMPATIBLE: callers still do
//   new SkillEffect(type, x, y, color, dur, params)
// but get back the correct MU-style subclass
// ══════════════════════════════════════════
import { SkillEffectBase } from './skillEffects/SkillEffectBase.js';
import { SlashArcEffect } from './skillEffects/slashArc.js';
import { AoeCircleEffect } from './skillEffects/aoeCircle.js';
import { ConeBlastEffect } from './skillEffects/coneBlast.js';
import { LineBlastEffect } from './skillEffects/lineBlast.js';
import { NovaRingEffect } from './skillEffects/novaRing.js';
import { EarthquakeEffect } from './skillEffects/earthquake.js';
import { TornadoEffect } from './skillEffects/tornado.js';
import { MeteorEffect } from './skillEffects/meteor.js';
import { LightningEffect } from './skillEffects/lightning.js';
import { LifestealEffect } from './skillEffects/lifesteal.js';
import { BuffAuraEffect } from './skillEffects/buffAura.js';
import { HealRingEffect } from './skillEffects/healRing.js';
import { BlinkFlashEffect } from './skillEffects/blinkFlash.js';
import { SummonCircleEffect } from './skillEffects/summonCircle.js';
import { CastFlashEffect } from './skillEffects/castFlash.js';
import { FadeOutEffect } from './skillEffects/fadeOut.js';
import { DebuffWaveEffect } from './skillEffects/debuffWave.js';

export { PERSPECTIVE, easeOut, easeIn, easeInOut, TAU } from './skillEffects/SkillEffectBase.js';

// ── Effect type → Class mapping ──
const EFFECT_MAP = {
    'slash_arc': SlashArcEffect,
    'aoe_circle': AoeCircleEffect,
    'cone_blast': ConeBlastEffect,
    'line_blast': LineBlastEffect,
    'nova_ring': NovaRingEffect,
    'earthquake': EarthquakeEffect,
    'tornado': TornadoEffect,
    'meteor': MeteorEffect,
    'lightning_bolt': LightningEffect,
    'lifesteal_beam': LifestealEffect,
    'buff_aura': BuffAuraEffect,
    'heal_ring': HealRingEffect,
    'blink_flash': BlinkFlashEffect,
    'summon_circle': SummonCircleEffect,
    'cast_flash': CastFlashEffect,
    'fade_out': FadeOutEffect,
    'debuff_wave': DebuffWaveEffect,
};

// ── Factory class (backwards-compatible with `new SkillEffect(...)`) ──
// JS constructors can return an object to override `this`:
//   "If a constructor returns an object, that object is used instead of this"
export class SkillEffect {
    constructor(type, x, y, color, duration, params) {
        const EffectClass = EFFECT_MAP[type];
        if (EffectClass) {
            return new EffectClass(x, y, color, duration, params);
        }
        // Fallback for unknown types — use generic base
        return new SkillEffectBase(type, x, y, color, duration, params);
    }
}
