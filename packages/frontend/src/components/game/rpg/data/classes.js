// ==========================================
// MU ONLINE STYLE CLASSES - Full Skill Trees
// Each class has ~20 skills with various effects
// ==========================================

// Skill effect types for animation system:
// 'projectile' - fires a moving projectile
// 'melee' - close range physical hit
// 'aoe_circle' - circular area damage around caster or target
// 'aoe_front' - cone/fan damage in front of caster
// 'aoe_line' - line damage in facing direction
// 'buff' - self or party buff
// 'heal' - restore HP
// 'freeze' - freeze + damage
// 'blink' - teleport
// 'stealth' - invisibility
// 'summon' - spawn creature
// 'lifesteal' - damage + heal self
// 'nova' - expanding ring from caster
// 'meteor' - falling projectile from sky
// 'lightning' - chain/bolt lightning
// 'earthquake' - ground shake AOE
// 'tornado' - spinning vortex projectile
// 'poison' - DOT effect
// 'shield' - damage absorb

export const CLASSES = {
    // ==========================================
    // DARK KNIGHT (DK) - Melee Warrior
    // ==========================================
    DARK_KNIGHT: {
        id: 'dark_knight',
        name: 'Dark Knight',
        role: 'Warrior',
        description: 'Master of blades and brute force. Excels in close combat with devastating physical attacks and powerful AOE strikes.',
        stats: { hp: 150, maxHp: 150, mana: 999, maxMana: 999, attack: 22, defense: 8, speed: 140, rage: 0, maxRage: 999, attackSpeed: 1.5 },
        skills: {
            SPACE: { id: 'twisting_slash', name: 'Twisting Slash', damage: 25, cooldown: 600, range: 1, generateRage: 15, effect: 'aoe_circle', aoeRadius: 1, icon: '⚔️', color: '#ff4444', description: 'Spinning blade attack hitting all nearby enemies.' },
            Q: { id: 'death_stab', name: 'Death Stab', damage: 45, cooldown: 2000, range: 2, cost: 20, effect: 'aoe_line', lineLength: 3, icon: '🗡️', color: '#cc0000', description: 'Deadly piercing thrust that damages enemies in a line.' },
            W: { id: 'greater_fortitude', name: 'Greater Fortitude', duration: 8000, cooldown: 15000, effect: 'buff', buffStat: 'defense', buffAmount: 10, icon: '💪', color: '#ffaa00', description: 'Temporarily increases defense.' }
        },
        allSkills: [
            { id: 'slash', name: 'Slash', damage: 12, cooldown: 400, range: 1, effect: 'melee', icon: '⚔️', color: '#ff6666', lvl: 1, description: 'Basic sword swing.' },
            { id: 'falling_slash', name: 'Falling Slash', damage: 18, cooldown: 500, range: 1, effect: 'melee', icon: '⚔️', color: '#ff4444', lvl: 2, description: 'A powerful downward sword strike.' },
            { id: 'lunge', name: 'Lunge', damage: 15, cooldown: 600, range: 2, effect: 'melee', icon: '🏃', color: '#ff8800', lvl: 3, description: 'Dash forward and stab the enemy.' },
            { id: 'uppercut', name: 'Uppercut', damage: 20, cooldown: 700, range: 1, effect: 'melee', generateRage: 10, icon: '👊', color: '#ffcc00', lvl: 5, description: 'Rising sword strike that launches enemies.' },
            { id: 'twisting_slash', name: 'Twisting Slash', damage: 25, cooldown: 600, range: 1, effect: 'aoe_circle', aoeRadius: 1, generateRage: 15, icon: '🌀', color: '#ff4444', lvl: 8, description: 'Spinning blade attack hitting all nearby enemies.' },
            { id: 'death_stab', name: 'Death Stab', damage: 45, cooldown: 2000, range: 2, cost: 20, effect: 'aoe_line', lineLength: 3, icon: '🗡️', color: '#cc0000', lvl: 10, description: 'Deadly piercing thrust in a line.' },
            { id: 'cyclone', name: 'Cyclone', damage: 30, cooldown: 1200, range: 1, cost: 15, effect: 'aoe_circle', aoeRadius: 2, icon: '🌪️', color: '#88ccff', lvl: 12, description: 'Rapid spinning attack hitting a wide area.' },
            { id: 'slash_frenzy', name: 'Slash Frenzy', damage: 8, cooldown: 300, range: 1, hits: 5, effect: 'melee', cost: 10, icon: '⚡', color: '#ffff00', lvl: 15, description: 'Five rapid slashes in quick succession.' },
            { id: 'impale', name: 'Impale', damage: 55, cooldown: 3000, range: 3, cost: 25, effect: 'aoe_line', lineLength: 4, icon: '🔱', color: '#ff0000', lvl: 18, description: 'Massive thrust that impales all enemies in a long line.' },
            { id: 'greater_fortitude', name: 'Greater Fortitude', duration: 8000, cooldown: 15000, effect: 'buff', buffStat: 'defense', buffAmount: 10, icon: '💪', color: '#ffaa00', lvl: 20, description: 'Temporarily increases defense.' },
            { id: 'swell_life', name: 'Swell Life', duration: 10000, cooldown: 20000, effect: 'buff', buffStat: 'maxHp', buffAmount: 50, icon: '❤️', color: '#ff6688', lvl: 22, description: 'Greatly increases maximum HP temporarily.' },
            { id: 'strike_of_destruction', name: 'Strike of Destruction', damage: 70, cooldown: 5000, range: 2, cost: 30, effect: 'aoe_front', aoeAngle: 90, aoeRadius: 3, icon: '💥', color: '#ff2200', lvl: 25, description: 'Devastating frontal cleave with massive AOE.' },
            { id: 'blood_storm', name: 'Blood Storm', damage: 35, cooldown: 3000, range: 1, cost: 20, effect: 'aoe_circle', aoeRadius: 3, lifestealPercent: 25, icon: '🩸', color: '#990000', lvl: 28, description: 'Whirlwind of blades that heals based on damage dealt.' },
            { id: 'earth_shake', name: 'Earth Shake', damage: 50, cooldown: 6000, range: 0, cost: 35, effect: 'earthquake', aoeRadius: 4, icon: '🌋', color: '#886633', lvl: 30, description: 'Slams the ground creating a massive shockwave.' },
            { id: 'rageful_blow', name: 'Rageful Blow', damage: 60, cooldown: 4000, range: 1, cost: 25, effect: 'aoe_circle', aoeRadius: 2, generateRage: 30, icon: '😤', color: '#ff3300', lvl: 32, description: 'A berserker strike fueled by rage.' },
            { id: 'swords_dance', name: 'Swords Dance', damage: 40, cooldown: 3500, range: 1, cost: 20, effect: 'aoe_circle', aoeRadius: 2, hits: 3, icon: '💃', color: '#ffcc44', lvl: 35, description: 'Elegant triple-spin attack.' },
            { id: 'rush', name: 'Rush', damage: 30, cooldown: 2000, range: 5, cost: 15, effect: 'aoe_line', lineLength: 5, icon: '🏃', color: '#ff8844', lvl: 38, description: 'Charge through enemies in a straight line.' },
            { id: 'flame_strike', name: 'Flame Strike', damage: 55, cooldown: 4000, range: 2, cost: 30, effect: 'aoe_front', aoeAngle: 120, aoeRadius: 3, icon: '🔥', color: '#ff6600', lvl: 40, description: 'Fiery sword sweep burning everything ahead.' },
            { id: 'blade_tornado', name: 'Blade Tornado', damage: 80, cooldown: 8000, range: 0, cost: 40, effect: 'tornado', aoeRadius: 4, duration: 3000, icon: '🌪️', color: '#aaaaff', lvl: 45, description: 'Summon a massive tornado of spinning blades.' },
            { id: 'armageddon_slash', name: 'Armageddon Slash', damage: 120, cooldown: 15000, range: 1, cost: 50, effect: 'aoe_circle', aoeRadius: 5, screenShake: true, icon: '☠️', color: '#ff0000', lvl: 50, description: 'Ultimate: Devastating world-ending strike.' }
        ]
    },

    // ==========================================
    // DARK WIZARD (DW) - Elemental Mage
    // ==========================================
    DARK_WIZARD: {
        id: 'dark_wizard',
        name: 'Dark Wizard',
        role: 'Mage',
        description: 'Master of elemental magic with devastating ranged spells. Commands fire, ice, and lightning to obliterate foes.',
        stats: { hp: 80, maxHp: 80, mana: 999, maxMana: 999, attack: 10, defense: 3, speed: 130, rage: 0, maxRage: 0, attackSpeed: 2.0 },
        skills: {
            SPACE: { id: 'soul_fire', name: 'Soul Fire', damage: 28, cooldown: 800, range: 8, cost: 18, projectile: true, effect: 'projectile', icon: '🔥', color: '#ff4400', description: 'Launches a ball of dark fire.' },
            Q: { id: 'ice_storm', name: 'Ice Storm', damage: 22, cooldown: 5000, range: 3, cost: 55, effect: 'aoe_circle', aoeRadius: 3, freeze: true, icon: '❄️', color: '#88ddff', description: 'Blizzard that damages and freezes.' },
            W: { id: 'teleport', name: 'Teleport', range: 6, cooldown: 4000, cost: 45, effect: 'blink', icon: '✨', color: '#aa88ff', description: 'Instantly teleport forward.' }
        },
        allSkills: [
            { id: 'energy_ball', name: 'Energy Ball', damage: 8, cooldown: 400, range: 6, cost: 5, projectile: true, effect: 'projectile', icon: '⚪', color: '#aaaaff', lvl: 1, description: 'Basic energy projectile.' },
            { id: 'fireball', name: 'Fireball', damage: 14, cooldown: 600, range: 7, cost: 10, projectile: true, effect: 'projectile', icon: '🔥', color: '#ff6600', lvl: 3, description: 'Classic fireball spell.' },
            { id: 'power_wave', name: 'Power Wave', damage: 18, cooldown: 800, range: 5, cost: 12, effect: 'aoe_line', lineLength: 5, icon: '〰️', color: '#6666ff', lvl: 5, description: 'Ground-travelling wave of energy.' },
            { id: 'lightning', name: 'Lightning', damage: 22, cooldown: 700, range: 8, cost: 15, effect: 'lightning', chainTargets: 1, icon: '⚡', color: '#ffff00', lvl: 8, description: 'Lightning bolt that strikes instantly.' },
            { id: 'soul_fire', name: 'Soul Fire', damage: 28, cooldown: 800, range: 8, cost: 18, projectile: true, effect: 'projectile', icon: '🔥', color: '#ff4400', lvl: 10, description: 'Dark fire that burns souls.' },
            { id: 'flame', name: 'Flame', damage: 20, cooldown: 600, range: 4, cost: 15, effect: 'aoe_front', aoeAngle: 60, aoeRadius: 4, icon: '🔥', color: '#ff3300', lvl: 12, description: 'Cone of flames in front of caster.' },
            { id: 'teleport', name: 'Teleport', range: 6, cooldown: 4000, cost: 45, effect: 'blink', icon: '✨', color: '#aa88ff', lvl: 14, description: 'Instant teleportation.' },
            { id: 'ice_storm', name: 'Ice Storm', damage: 22, cooldown: 5000, range: 3, cost: 55, effect: 'aoe_circle', aoeRadius: 3, freeze: true, icon: '❄️', color: '#88ddff', lvl: 16, description: 'Freezing blizzard AOE.' },
            { id: 'poison_spray', name: 'Poison Spray', damage: 10, cooldown: 1500, range: 4, cost: 20, effect: 'aoe_front', aoeAngle: 90, aoeRadius: 3, dot: true, dotDamage: 5, dotDuration: 5000, icon: '☠️', color: '#44ff44', lvl: 18, description: 'Poisonous cloud that deals damage over time.' },
            { id: 'evil_spirit', name: 'Evil Spirit', damage: 35, cooldown: 1200, range: 6, cost: 25, projectile: true, effect: 'projectile', pierce: true, icon: '👻', color: '#aa44ff', lvl: 20, description: 'Spectral projectile that pierces through enemies.' },
            { id: 'hellfire', name: 'Hellfire', damage: 40, cooldown: 3000, range: 5, cost: 35, effect: 'aoe_circle', aoeRadius: 3, icon: '🔥', color: '#ff2200', lvl: 22, description: 'Eruption of hellfire on target area.' },
            { id: 'aqua_beam', name: 'Aqua Beam', damage: 25, cooldown: 1000, range: 8, cost: 20, effect: 'aoe_line', lineLength: 8, icon: '🌊', color: '#4488ff', lvl: 25, description: 'High-pressure water beam in a line.' },
            { id: 'inferno', name: 'Inferno', damage: 45, cooldown: 4000, range: 3, cost: 50, effect: 'aoe_circle', aoeRadius: 4, icon: '🌋', color: '#ff4400', lvl: 28, description: 'Massive fire explosion around the caster.' },
            { id: 'chain_lightning', name: 'Chain Lightning', damage: 30, cooldown: 2000, range: 6, cost: 30, effect: 'lightning', chainTargets: 4, icon: '⚡', color: '#aaffff', lvl: 30, description: 'Lightning that bounces between 4 enemies.' },
            { id: 'nova', name: 'Nova', damage: 50, cooldown: 6000, range: 0, cost: 60, effect: 'nova', aoeRadius: 5, icon: '💫', color: '#ff88ff', lvl: 32, description: 'Expanding ring of destruction from caster.' },
            { id: 'meteor', name: 'Meteor', damage: 65, cooldown: 8000, range: 6, cost: 70, effect: 'meteor', aoeRadius: 3, icon: '☄️', color: '#ff6600', lvl: 35, description: 'Calls down a fiery meteor from the sky.' },
            { id: 'blizzard', name: 'Blizzard', damage: 40, cooldown: 7000, range: 5, cost: 65, effect: 'aoe_circle', aoeRadius: 5, freeze: true, duration: 3000, icon: '🌨️', color: '#aaddff', lvl: 38, description: 'Massive blizzard freezing a huge area.' },
            { id: 'decay', name: 'Decay', damage: 35, cooldown: 3000, range: 5, cost: 40, effect: 'aoe_circle', aoeRadius: 3, debuff: 'defense', debuffAmount: -5, icon: '💀', color: '#886644', lvl: 40, description: 'Corrodes enemy armor and flesh.' },
            { id: 'dark_blast', name: 'Dark Blast', damage: 80, cooldown: 10000, range: 4, cost: 80, effect: 'aoe_circle', aoeRadius: 4, screenShake: true, icon: '🌑', color: '#440066', lvl: 45, description: 'Concentrated blast of dark energy.' },
            { id: 'apocalypse', name: 'Apocalypse', damage: 150, cooldown: 20000, range: 0, cost: 100, effect: 'nova', aoeRadius: 8, screenShake: true, icon: '🌌', color: '#ff00ff', lvl: 50, description: 'Ultimate: Devastating magical explosion.' }
        ]
    },

    // ==========================================
    // FAIRY ELF (FE) - Archer / Buffer
    // ==========================================
    FAIRY_ELF: {
        id: 'fairy_elf',
        name: 'Fairy Elf',
        role: 'Archer / Support',
        description: 'Graceful archer with powerful ranged attacks and party buffs. Balances damage with supportive healing.',
        stats: { hp: 90, maxHp: 90, mana: 999, maxMana: 999, attack: 18, defense: 4, speed: 160, rage: 0, maxRage: 0, attackSpeed: 2.2 },
        skills: {
            SPACE: { id: 'triple_shot', name: 'Triple Shot', damage: 16, cooldown: 450, range: 7, cost: 10, projectile: true, effect: 'projectile', hits: 3, icon: '🏹', color: '#88ff88', description: 'Fires three arrows rapidly.' },
            Q: { id: 'penetration', name: 'Penetration', damage: 40, cooldown: 3000, range: 10, cost: 30, projectile: true, effect: 'projectile', pierce: true, icon: '🎯', color: '#ff8800', description: 'Arrow that pierces through enemies.' },
            W: { id: 'heal', name: 'Heal', healAmount: 45, cooldown: 6000, cost: 40, effect: 'heal_self', icon: '💚', color: '#44ff44', description: 'Restores HP.' }
        },
        allSkills: [
            { id: 'arrow', name: 'Arrow', damage: 8, cooldown: 350, range: 6, cost: 3, projectile: true, effect: 'projectile', icon: '🏹', color: '#aaffaa', lvl: 1, description: 'Basic arrow shot.' },
            { id: 'double_shot', name: 'Double Shot', damage: 10, cooldown: 400, range: 6, cost: 6, projectile: true, effect: 'projectile', hits: 2, icon: '🏹', color: '#88ff88', lvl: 3, description: 'Two arrows in quick succession.' },
            { id: 'triple_shot', name: 'Triple Shot', damage: 16, cooldown: 450, range: 7, cost: 10, projectile: true, effect: 'projectile', hits: 3, icon: '🏹', color: '#88ff88', lvl: 5, description: 'Three rapid arrows.' },
            { id: 'ice_arrow', name: 'Ice Arrow', damage: 14, cooldown: 600, range: 7, cost: 12, projectile: true, effect: 'projectile', freeze: true, icon: '🧊', color: '#88ccff', lvl: 8, description: 'Arrow that freezes on hit.' },
            { id: 'heal', name: 'Heal', healAmount: 30, cooldown: 5000, cost: 25, effect: 'heal_self', icon: '💚', color: '#44ff44', lvl: 10, description: 'Restore HP.' },
            { id: 'penetration', name: 'Penetration', damage: 40, cooldown: 3000, range: 10, cost: 30, projectile: true, effect: 'projectile', pierce: true, icon: '🎯', color: '#ff8800', lvl: 12, description: 'Piercing arrow.' },
            { id: 'greater_defense', name: 'Greater Defense', duration: 10000, cooldown: 15000, cost: 30, effect: 'buff', buffStat: 'defense', buffAmount: 8, icon: '🛡️', color: '#4488ff', lvl: 14, description: 'Increases defense.' },
            { id: 'greater_damage', name: 'Greater Damage', duration: 10000, cooldown: 15000, cost: 30, effect: 'buff', buffStat: 'attack', buffAmount: 8, icon: '⚔️', color: '#ff4444', lvl: 16, description: 'Increases attack power.' },
            { id: 'multi_shot', name: 'Multi-Shot', damage: 12, cooldown: 1500, range: 7, cost: 20, projectile: true, effect: 'projectile', hits: 5, icon: '🏹', color: '#66ff66', lvl: 18, description: 'Fires five arrows in a spread.' },
            { id: 'poison_arrow', name: 'Poison Arrow', damage: 15, cooldown: 800, range: 8, cost: 15, projectile: true, effect: 'projectile', dot: true, dotDamage: 4, dotDuration: 5000, icon: '☠️', color: '#44ff00', lvl: 20, description: 'Poisoned arrow dealing damage over time.' },
            { id: 'wind_arrow', name: 'Wind Arrow', damage: 25, cooldown: 1200, range: 9, cost: 18, projectile: true, effect: 'projectile', knockback: true, icon: '💨', color: '#aaffee', lvl: 22, description: 'Arrow infused with wind that knocks back.' },
            { id: 'arrow_rain', name: 'Arrow Rain', damage: 20, cooldown: 4000, range: 6, cost: 40, effect: 'aoe_circle', aoeRadius: 3, icon: '🌧️', color: '#88aa44', lvl: 25, description: 'Rain of arrows on a target area.' },
            { id: 'greater_heal', name: 'Greater Heal', healAmount: 60, cooldown: 8000, cost: 50, effect: 'heal_self', icon: '💖', color: '#ff66aa', lvl: 28, description: 'Powerful healing spell.' },
            { id: 'attack_speed', name: 'Attack Speed Boost', duration: 10000, cooldown: 20000, cost: 35, effect: 'buff', buffStat: 'speed', buffAmount: 30, icon: '⚡', color: '#ffff44', lvl: 30, description: 'Greatly increases attack speed.' },
            { id: 'barrage', name: 'Barrage', damage: 15, cooldown: 2000, range: 7, cost: 25, projectile: true, effect: 'projectile', hits: 8, icon: '🏹', color: '#ffaa44', lvl: 32, description: 'Rapid barrage of 8 arrows.' },
            { id: 'explosive_arrow', name: 'Explosive Arrow', damage: 35, cooldown: 3000, range: 8, cost: 30, projectile: true, effect: 'projectile', aoeOnHit: true, aoeRadius: 2, icon: '💥', color: '#ff6600', lvl: 35, description: 'Arrow that explodes on impact.' },
            { id: 'phoenix_shot', name: 'Phoenix Shot', damage: 50, cooldown: 5000, range: 8, cost: 40, projectile: true, effect: 'projectile', pierce: true, dot: true, dotDamage: 8, icon: '🔥', color: '#ff4400', lvl: 38, description: 'Flaming phoenix that pierces and burns.' },
            { id: 'natures_blessing', name: "Nature's Blessing", healAmount: 40, duration: 10000, cooldown: 25000, cost: 60, effect: 'buff', regen: 5, icon: '🌿', color: '#44ff88', lvl: 40, description: 'Regeneration buff over time.' },
            { id: 'starfall', name: 'Starfall', damage: 30, cooldown: 6000, range: 5, cost: 55, effect: 'aoe_circle', aoeRadius: 5, hits: 3, icon: '⭐', color: '#ffff88', lvl: 45, description: 'Stars fall from the sky in a wide area.' },
            { id: 'infinity_arrow', name: 'Infinity Arrow', damage: 100, cooldown: 18000, range: 10, cost: 80, projectile: true, effect: 'projectile', pierce: true, aoeOnHit: true, aoeRadius: 3, screenShake: true, icon: '🌟', color: '#ffffff', lvl: 50, description: 'Ultimate: Legendary arrow of infinite power.' }
        ]
    },

    // ==========================================
    // MAGIC GLADIATOR (MG) - Hybrid Fighter/Mage
    // ==========================================
    MAGIC_GLADIATOR: {
        id: 'magic_gladiator',
        name: 'Magic Gladiator',
        role: 'Hybrid Fighter',
        description: 'Versatile warrior combining martial prowess with magical abilities. Can switch between physical and magical combat.',
        stats: { hp: 120, maxHp: 120, mana: 999, maxMana: 999, attack: 18, defense: 6, speed: 150, rage: 0, maxRage: 0, attackSpeed: 1.8 },
        skills: {
            SPACE: { id: 'power_slash', name: 'Power Slash', damage: 22, cooldown: 600, range: 2, cost: 12, effect: 'aoe_front', aoeAngle: 60, aoeRadius: 2, icon: '⚡', color: '#ffaa00', description: 'Magical sword strike in a frontal arc.' },
            Q: { id: 'flame_strike', name: 'Flame Strike', damage: 35, cooldown: 2000, range: 3, cost: 25, effect: 'aoe_line', lineLength: 4, icon: '🔥', color: '#ff4400', description: 'Fiery blade wave in a line.' },
            W: { id: 'energy_ball', name: 'Energy Ball', damage: 25, cooldown: 1200, range: 7, cost: 20, projectile: true, effect: 'projectile', icon: '💫', color: '#8844ff', description: 'Concentrated magical energy projectile.' }
        },
        allSkills: [
            { id: 'sword_slash', name: 'Sword Slash', damage: 10, cooldown: 400, range: 1, cost: 5, effect: 'melee', icon: '⚔️', color: '#ffcc00', lvl: 1, description: 'Basic magical sword swing.' },
            { id: 'energy_ball_basic', name: 'Energy Ball', damage: 12, cooldown: 500, range: 6, cost: 8, projectile: true, effect: 'projectile', icon: '⚪', color: '#aaaaff', lvl: 3, description: 'Energy sphere projectile.' },
            { id: 'power_slash', name: 'Power Slash', damage: 22, cooldown: 600, range: 2, cost: 12, effect: 'aoe_front', aoeAngle: 60, aoeRadius: 2, icon: '⚡', color: '#ffaa00', lvl: 5, description: 'Magical frontal slash.' },
            { id: 'fireball_mg', name: 'Fireball', damage: 18, cooldown: 600, range: 7, cost: 12, projectile: true, effect: 'projectile', icon: '🔥', color: '#ff6600', lvl: 8, description: 'Fireball spell.' },
            { id: 'lightning_mg', name: 'Lightning', damage: 24, cooldown: 700, range: 8, cost: 15, effect: 'lightning', icon: '⚡', color: '#ffff00', lvl: 10, description: 'Lightning bolt.' },
            { id: 'fire_slash', name: 'Fire Slash', damage: 30, cooldown: 1200, range: 2, cost: 18, effect: 'aoe_front', aoeAngle: 90, aoeRadius: 2, icon: '🔥', color: '#ff4400', lvl: 12, description: 'Blazing sword arc.' },
            { id: 'flame_strike', name: 'Flame Strike', damage: 35, cooldown: 2000, range: 3, cost: 25, effect: 'aoe_line', lineLength: 4, icon: '🔥', color: '#ff4400', lvl: 14, description: 'Fiery blade wave.' },
            { id: 'ice_blade', name: 'Ice Blade', damage: 28, cooldown: 1000, range: 1, cost: 18, effect: 'melee', freeze: true, icon: '🧊', color: '#88ccff', lvl: 16, description: 'Freezing sword strike.' },
            { id: 'spiral_slash', name: 'Spiral Slash', damage: 25, cooldown: 800, range: 1, cost: 15, effect: 'aoe_circle', aoeRadius: 2, icon: '🌀', color: '#ff88ff', lvl: 18, description: 'Spinning magical slash.' },
            { id: 'electric_spike', name: 'Electric Spike', damage: 32, cooldown: 1500, range: 5, cost: 22, effect: 'aoe_line', lineLength: 5, icon: '⚡', color: '#ffff88', lvl: 20, description: 'Line of electric spikes.' },
            { id: 'plasma_storm', name: 'Plasma Storm', damage: 40, cooldown: 3000, range: 4, cost: 35, effect: 'aoe_circle', aoeRadius: 3, icon: '🌐', color: '#ff44ff', lvl: 22, description: 'Swirling plasma AOE.' },
            { id: 'earthquake_mg', name: 'Earthquake', damage: 45, cooldown: 5000, range: 0, cost: 40, effect: 'earthquake', aoeRadius: 4, icon: '🌋', color: '#886633', lvl: 25, description: 'Ground-shaking AOE.' },
            { id: 'gigantic_storm', name: 'Gigantic Storm', damage: 50, cooldown: 6000, range: 5, cost: 50, effect: 'aoe_circle', aoeRadius: 4, icon: '⛈️', color: '#6644ff', lvl: 28, description: 'Massive storm of magical energy.' },
            { id: 'sword_inertia', name: 'Sword Inertia', duration: 8000, cooldown: 15000, cost: 30, effect: 'buff', buffStat: 'attack', buffAmount: 12, icon: '⚔️', color: '#ffaa44', lvl: 30, description: 'Magically enhances sword damage.' },
            { id: 'tornado_slash', name: 'Tornado Slash', damage: 55, cooldown: 4000, range: 1, cost: 35, effect: 'tornado', aoeRadius: 3, icon: '🌪️', color: '#aaddff', lvl: 32, description: 'Creates a sword tornado.' },
            { id: 'dimensional_slash', name: 'Dimensional Slash', damage: 45, cooldown: 3000, range: 6, cost: 30, effect: 'aoe_line', lineLength: 6, pierce: true, icon: '🔮', color: '#aa44ff', lvl: 35, description: 'Spatial rift slash through dimensions.' },
            { id: 'fire_storm', name: 'Fire Storm', damage: 60, cooldown: 5000, range: 4, cost: 50, effect: 'aoe_circle', aoeRadius: 4, icon: '🔥', color: '#ff2200', lvl: 38, description: 'Devastating fire vortex.' },
            { id: 'thunder_blade', name: 'Thunder Blade', damage: 70, cooldown: 6000, range: 2, cost: 45, effect: 'aoe_front', aoeAngle: 120, aoeRadius: 4, icon: '⚡', color: '#ffff00', lvl: 40, description: 'Lightning-infused massive swing.' },
            { id: 'killing_blow', name: 'Killing Blow', damage: 90, cooldown: 10000, range: 1, cost: 60, effect: 'aoe_circle', aoeRadius: 3, screenShake: true, icon: '💀', color: '#ff0000', lvl: 45, description: 'Execution strike with huge AOE.' },
            { id: 'oblivion', name: 'Oblivion', damage: 130, cooldown: 18000, range: 3, cost: 80, effect: 'nova', aoeRadius: 6, screenShake: true, icon: '🌌', color: '#220044', lvl: 50, description: 'Ultimate: Void explosion obliterating all.' }
        ]
    },

    // ==========================================
    // DARK LORD (DL) - Commander
    // ==========================================
    DARK_LORD: {
        id: 'dark_lord',
        name: 'Dark Lord',
        role: 'Commander',
        description: 'Powerful leader commanding dark forces. Rides a Dark Horse and summons a Dark Raven to fight alongside.',
        stats: { hp: 130, maxHp: 130, mana: 999, maxMana: 999, attack: 18, defense: 7, speed: 145, rage: 0, maxRage: 0, attackSpeed: 1.3 },
        skills: {
            SPACE: { id: 'fire_burst', name: 'Fire Burst', damage: 28, cooldown: 700, range: 2, cost: 16, effect: 'aoe_circle', aoeRadius: 2, icon: '💥', color: '#ff6600', description: 'Explosion of dark fire around caster.' },
            Q: { id: 'force_wave', name: 'Force Wave', damage: 22, cooldown: 2000, range: 6, cost: 25, projectile: true, effect: 'projectile', knockback: true, icon: '🌊', color: '#4488ff', description: 'Force wave that knocks back.' },
            W: { id: 'dark_horse_summon', name: 'Dark Horse', duration: 12000, cooldown: 20000, cost: 50, effect: 'buff', buffStat: 'speed', buffAmount: 40, icon: '🐴', color: '#664422', description: 'Summon Dark Horse for speed.' }
        },
        allSkills: [
            { id: 'dark_strike', name: 'Dark Strike', damage: 12, cooldown: 450, range: 1, cost: 6, effect: 'melee', icon: '⚔️', color: '#885500', lvl: 1, description: 'Basic scepter strike.' },
            { id: 'fire_burst', name: 'Fire Burst', damage: 28, cooldown: 700, range: 2, cost: 16, effect: 'aoe_circle', aoeRadius: 2, icon: '💥', color: '#ff6600', lvl: 3, description: 'Dark fire explosion.' },
            { id: 'force_wave', name: 'Force Wave', damage: 22, cooldown: 2000, range: 6, cost: 25, projectile: true, effect: 'projectile', knockback: true, icon: '🌊', color: '#4488ff', lvl: 5, description: 'Knockback force projectile.' },
            { id: 'dark_bolt', name: 'Dark Bolt', damage: 18, cooldown: 600, range: 7, cost: 12, projectile: true, effect: 'projectile', icon: '🌑', color: '#442266', lvl: 8, description: 'Dark energy projectile.' },
            { id: 'critical_damage', name: 'Critical Damage', duration: 8000, cooldown: 12000, cost: 20, effect: 'buff', buffStat: 'attack', buffAmount: 10, icon: '🎯', color: '#ff4444', lvl: 10, description: 'Increases critical damage.' },
            { id: 'fire_burst_enhanced', name: 'Enhanced Fire Burst', damage: 38, cooldown: 1200, range: 3, cost: 25, effect: 'aoe_circle', aoeRadius: 3, icon: '💥', color: '#ff4400', lvl: 12, description: 'Larger fire explosion.' },
            { id: 'dark_horse_summon', name: 'Dark Horse', duration: 12000, cooldown: 20000, cost: 50, effect: 'buff', buffStat: 'speed', buffAmount: 40, icon: '🐴', color: '#664422', lvl: 14, description: 'Mount the Dark Horse.' },
            { id: 'dark_raven', name: 'Dark Raven', duration: 15000, cooldown: 25000, cost: 40, effect: 'summon', summonStats: { hp: 40, attack: 12, visual: 'raven' }, icon: '🐦‍⬛', color: '#333333', lvl: 16, description: 'Summon a Dark Raven companion.' },
            { id: 'chain_lightning_dl', name: 'Chain Lightning', damage: 28, cooldown: 2000, range: 6, cost: 25, effect: 'lightning', chainTargets: 3, icon: '⚡', color: '#aaffff', lvl: 18, description: 'Lightning bouncing between enemies.' },
            { id: 'earthshake', name: 'Earthshake', damage: 40, cooldown: 4000, range: 0, cost: 35, effect: 'earthquake', aoeRadius: 3, icon: '🌋', color: '#886633', lvl: 20, description: 'Ground-shaking stomp.' },
            { id: 'dark_aura', name: 'Dark Aura', duration: 15000, cooldown: 25000, cost: 45, effect: 'buff', buffStat: 'attack', buffAmount: 8, aura: true, icon: '😈', color: '#664488', lvl: 22, description: 'Aura boosting nearby allies.' },
            { id: 'fire_scream', name: 'Fire Scream', damage: 45, cooldown: 3000, range: 4, cost: 30, effect: 'aoe_front', aoeAngle: 120, aoeRadius: 4, icon: '🔥', color: '#ff3300', lvl: 25, description: 'Screaming fire wave ahead.' },
            { id: 'chaotic_diseier', name: 'Chaotic Diseier', damage: 50, cooldown: 4000, range: 3, cost: 40, effect: 'aoe_circle', aoeRadius: 3, icon: '☢️', color: '#ff00ff', lvl: 28, description: 'Chaotic energy explosion.' },
            { id: 'dark_horse_charge', name: 'Horse Charge', damage: 35, cooldown: 3000, range: 6, cost: 25, effect: 'aoe_line', lineLength: 6, icon: '🐴', color: '#884400', lvl: 30, description: 'Charge forward on the Dark Horse.' },
            { id: 'gravitational_pull', name: 'Gravitational Pull', damage: 20, cooldown: 5000, range: 5, cost: 35, effect: 'aoe_circle', aoeRadius: 4, pullEnemies: true, icon: '🕳️', color: '#440088', lvl: 32, description: 'Pulls all enemies toward the center.' },
            { id: 'summon_soldiers', name: 'Summon Soldiers', duration: 12000, cooldown: 20000, cost: 50, effect: 'summon', summonCount: 3, summonStats: { hp: 25, attack: 8 }, icon: '👥', color: '#886644', lvl: 35, description: 'Summon 3 dark soldiers.' },
            { id: 'dark_nova', name: 'Dark Nova', damage: 60, cooldown: 6000, range: 0, cost: 50, effect: 'nova', aoeRadius: 5, icon: '🌑', color: '#220044', lvl: 38, description: 'Expanding ring of darkness.' },
            { id: 'lord_command', name: "Lord's Command", duration: 10000, cooldown: 20000, cost: 40, effect: 'buff', buffStat: 'attack', buffAmount: 15, aura: true, icon: '👑', color: '#ffdd00', lvl: 40, description: 'Commands all to fight harder.' },
            { id: 'dark_tempest', name: 'Dark Tempest', damage: 80, cooldown: 10000, range: 0, cost: 70, effect: 'tornado', aoeRadius: 5, duration: 3000, icon: '🌪️', color: '#442266', lvl: 45, description: 'Massive dark tornado.' },
            { id: 'lord_of_destruction', name: 'Lord of Destruction', damage: 140, cooldown: 20000, range: 0, cost: 90, effect: 'earthquake', aoeRadius: 6, screenShake: true, icon: '☠️', color: '#880000', lvl: 50, description: 'Ultimate: World-shattering devastation.' }
        ]
    },

    // ==========================================
    // SUMMONER (SU) - Pet Master / Curse Mage
    // ==========================================
    SUMMONER: {
        id: 'summoner',
        name: 'Summoner',
        role: 'Pet Master / Caster',
        description: 'Mystical spellcaster who summons creatures and wields powerful curse magic. Masters both life and death.',
        stats: { hp: 75, maxHp: 75, mana: 999, maxMana: 999, attack: 12, defense: 2, speed: 135, rage: 0, maxRage: 0, attackSpeed: 1.8 },
        skills: {
            SPACE: { id: 'fire_scream_su', name: 'Fire Scream', damage: 26, cooldown: 800, range: 6, cost: 18, projectile: true, effect: 'projectile', icon: '😈', color: '#ff4444', description: 'Screaming fireball.' },
            Q: { id: 'drain_life', name: 'Drain Life', damage: 20, cooldown: 3000, range: 4, cost: 30, effect: 'lifesteal', lifestealPercent: 100, icon: '💀', color: '#44ff44', description: 'Drains enemy life force.' },
            W: { id: 'summon_creature', name: 'Summon', duration: 15000, cooldown: 20000, cost: 60, effect: 'summon', summonStats: { hp: 50, attack: 14 }, icon: '👾', color: '#aa44ff', description: 'Summon a dark creature.' }
        },
        allSkills: [
            { id: 'dark_touch', name: 'Dark Touch', damage: 8, cooldown: 400, range: 5, cost: 5, projectile: true, effect: 'projectile', icon: '✋', color: '#664488', lvl: 1, description: 'Basic dark magic bolt.' },
            { id: 'fire_scream_su', name: 'Fire Scream', damage: 26, cooldown: 800, range: 6, cost: 18, projectile: true, effect: 'projectile', icon: '😈', color: '#ff4444', lvl: 3, description: 'Screaming fireball.' },
            { id: 'curse_weakness', name: 'Curse: Weakness', duration: 8000, cooldown: 5000, range: 5, cost: 15, effect: 'debuff', debuff: 'attack', debuffAmount: -8, icon: '🔮', color: '#886644', lvl: 5, description: 'Weakens enemy attack power.' },
            { id: 'drain_life', name: 'Drain Life', damage: 20, cooldown: 3000, range: 4, cost: 30, effect: 'lifesteal', lifestealPercent: 100, icon: '💀', color: '#44ff44', lvl: 8, description: 'Drains enemy life.' },
            { id: 'summon_minor', name: 'Summon: Imp', duration: 10000, cooldown: 12000, cost: 25, effect: 'summon', summonStats: { hp: 30, attack: 8 }, icon: '👿', color: '#ff6644', lvl: 10, description: 'Summon a small imp.' },
            { id: 'sleep', name: 'Sleep', duration: 4000, cooldown: 8000, range: 5, cost: 20, effect: 'sleep', icon: '😴', color: '#8888ff', lvl: 12, description: 'Puts enemy to sleep.' },
            { id: 'curse_slow', name: 'Curse: Lethargy', duration: 6000, cooldown: 5000, range: 5, cost: 18, effect: 'debuff', debuff: 'speed', debuffAmount: -50, icon: '🐌', color: '#886688', lvl: 14, description: 'Slows enemy movement.' },
            { id: 'pollution', name: 'Pollution', damage: 15, cooldown: 2000, range: 4, cost: 22, effect: 'aoe_circle', aoeRadius: 3, dot: true, dotDamage: 6, dotDuration: 5000, icon: '☠️', color: '#66aa44', lvl: 16, description: 'Poisonous cloud AOE.' },
            { id: 'summon_creature', name: 'Summon: Demon', duration: 15000, cooldown: 20000, cost: 60, effect: 'summon', summonStats: { hp: 50, attack: 14 }, icon: '👾', color: '#aa44ff', lvl: 18, description: 'Summon a dark demon.' },
            { id: 'requiem', name: 'Requiem', damage: 35, cooldown: 4000, range: 0, cost: 40, effect: 'aoe_circle', aoeRadius: 4, icon: '🎵', color: '#bb44bb', lvl: 20, description: 'Song of death damages all around.' },
            { id: 'chain_curse', name: 'Chain Curse', damage: 22, cooldown: 2500, range: 5, cost: 25, effect: 'lightning', chainTargets: 3, icon: '⛓️', color: '#886688', lvl: 22, description: 'Curse energy bouncing between foes.' },
            { id: 'blood_pact', name: 'Blood Pact', healAmount: 50, cooldown: 10000, cost: 40, hpCost: 20, effect: 'heal_self', icon: '🩸', color: '#cc0000', lvl: 25, description: 'Sacrifice HP cost for mana restoration.' },
            { id: 'soul_harvest', name: 'Soul Harvest', damage: 30, cooldown: 3000, range: 4, cost: 35, effect: 'aoe_circle', aoeRadius: 3, lifestealPercent: 50, icon: '👻', color: '#aa88ff', lvl: 28, description: 'AOE that heals based on damage.' },
            { id: 'summon_golem', name: 'Summon: Golem', duration: 20000, cooldown: 25000, cost: 70, effect: 'summon', summonStats: { hp: 100, attack: 10, defense: 8 }, icon: '🗿', color: '#886633', lvl: 30, description: 'Summon a tanky stone golem.' },
            { id: 'death_explosion', name: 'Death Explosion', damage: 45, cooldown: 5000, range: 3, cost: 45, effect: 'aoe_circle', aoeRadius: 3, icon: '💀', color: '#660044', lvl: 32, description: 'Explodes undead energy in an area.' },
            { id: 'void_tendrils', name: 'Void Tendrils', damage: 25, cooldown: 4000, range: 5, cost: 35, effect: 'aoe_circle', aoeRadius: 3, root: true, duration: 3000, icon: '🕸️', color: '#442266', lvl: 35, description: 'Tendrils root enemies in place.' },
            { id: 'mass_sleep', name: 'Mass Sleep', duration: 3000, cooldown: 12000, range: 4, cost: 50, effect: 'aoe_circle', aoeRadius: 3, sleep: true, icon: '💤', color: '#8888ff', lvl: 38, description: 'Puts all nearby enemies to sleep.' },
            { id: 'summon_dragon', name: 'Summon: Dragon', duration: 20000, cooldown: 30000, cost: 80, effect: 'summon', summonStats: { hp: 80, attack: 25 }, icon: '🐉', color: '#ff6644', lvl: 40, description: 'Summon a fearsome dragon!' },
            { id: 'netherstorm', name: 'Netherstorm', damage: 70, cooldown: 8000, range: 4, cost: 65, effect: 'nova', aoeRadius: 5, icon: '🌀', color: '#660088', lvl: 45, description: 'Expanding vortex of dark magic.' },
            { id: 'dimension_collapse', name: 'Dimension Collapse', damage: 120, cooldown: 20000, range: 5, cost: 90, effect: 'aoe_circle', aoeRadius: 5, screenShake: true, icon: '🕳️', color: '#000033', lvl: 50, description: 'Ultimate: Collapses reality itself.' }
        ]
    }
};

// ==========================================
// MERGE ECLIPSE CLASSES
// ==========================================
import { ECLIPSE_CLASSES } from './eclipseClasses';
Object.assign(CLASSES, ECLIPSE_CLASSES);

// Helper to get class list as array
export const CLASS_LIST = Object.values(CLASSES);

// Get class by ID
export const getClassById = (id) => CLASS_LIST.find(c => c.id === id);
