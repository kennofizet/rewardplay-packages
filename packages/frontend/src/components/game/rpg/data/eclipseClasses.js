// ==========================================
// ECLIPSE: SHATTERED REALM CLASSES
// 4 New classes with 3 specializations each
// Each class has ~20 skills with Eclipse-themed effects
// ==========================================

export const ECLIPSE_CLASSES = {
    // ==========================================
    // VANGUARD - Tank / Bruiser (Rage-based)
    // Specializations: Fortress | Bloodsteel | Warbringer
    // ==========================================
    VANGUARD: {
        id: 'vanguard',
        name: 'Vanguard',
        role: 'Tank / Bruiser',
        description: 'Frontline warrior wielding massive shields and heavy armor. Masters of crowd control and survivability with three paths: Fortress (pure tank), Bloodsteel (lifesteal bruiser), and Warbringer (AOE damage).',
        stats: { hp: 200, maxHp: 200, mana: 0, maxMana: 0, attack: 18, defense: 14, speed: 120, rage: 0, maxRage: 999, stamina: 100, maxStamina: 100 },
        skills: {
            SPACE: { id: 'shield_bash', name: 'Shield Bash', damage: 20, cooldown: 600, range: 1, generateRage: 15, effect: 'melee', icon: '🛡️', color: '#4488cc', description: 'Slam your shield into the enemy, generating rage.' },
            Q: { id: 'iron_bulwark', name: 'Iron Bulwark', duration: 5000, cooldown: 10000, cost: 30, effect: 'buff', buffStat: 'defense', buffAmount: 20, icon: '🏰', color: '#aabbcc', description: 'Raise your shield to massively increase defense.' },
            W: { id: 'war_cry', name: 'War Cry', damage: 30, cooldown: 3000, range: 0, cost: 25, effect: 'nova', aoeRadius: 3, taunt: true, icon: '📢', color: '#ff8844', description: 'Shout that damages and taunts all nearby enemies.' }
        },
        specializations: [
            { id: 'fortress', name: 'Fortress', desc: 'Pure tank. Maximum defense and crowd control.', icon: '🏰' },
            { id: 'bloodsteel', name: 'Bloodsteel', desc: 'Lifesteal bruiser. Sustain through combat.', icon: '🩸' },
            { id: 'warbringer', name: 'Warbringer', desc: 'AOE damage dealer. Devastate groups.', icon: '⚔️' }
        ],
        allSkills: [
            { id: 'shield_bash', name: 'Shield Bash', damage: 20, cooldown: 600, range: 1, generateRage: 15, effect: 'melee', icon: '🛡️', color: '#4488cc', lvl: 1, description: 'Basic shield strike generating rage.' },
            { id: 'sword_strike', name: 'Sword Strike', damage: 15, cooldown: 400, range: 1, effect: 'melee', icon: '⚔️', color: '#bbccdd', lvl: 2, description: 'Quick one-handed slash.' },
            { id: 'taunt', name: 'Taunt', cooldown: 5000, range: 5, cost: 10, effect: 'debuff', taunt: true, icon: '😤', color: '#ff6644', lvl: 3, description: 'Force a single enemy to target you.' },
            { id: 'shield_charge', name: 'Shield Charge', damage: 25, cooldown: 2000, range: 4, cost: 15, effect: 'aoe_line', lineLength: 4, icon: '🏃', color: '#4488cc', lvl: 5, description: 'Charge forward behind your shield, stunning anything in the way.' },
            { id: 'iron_bulwark', name: 'Iron Bulwark', duration: 5000, cooldown: 10000, cost: 30, effect: 'buff', buffStat: 'defense', buffAmount: 20, icon: '🏰', color: '#aabbcc', lvl: 8, description: 'Massive temporary defense boost.' },
            { id: 'war_cry', name: 'War Cry', damage: 30, cooldown: 3000, range: 0, cost: 25, effect: 'nova', aoeRadius: 3, taunt: true, icon: '📢', color: '#ff8844', lvl: 10, description: 'AOE taunt that damages all nearby.' },
            { id: 'shield_wall', name: 'Shield Wall', duration: 4000, cooldown: 15000, cost: 35, effect: 'buff', buffStat: 'defense', buffAmount: 40, icon: '🧱', color: '#667788', lvl: 12, description: 'Impenetrable shield stance. Cannot move but takes minimal damage.' },
            { id: 'ground_slam', name: 'Ground Slam', damage: 35, cooldown: 2500, range: 0, cost: 20, effect: 'earthquake', aoeRadius: 3, icon: '💥', color: '#886633', lvl: 14, description: 'Slam your weapon into the ground creating a shockwave.' },
            { id: 'bloodsteel_strike', name: 'Bloodsteel Strike', damage: 28, cooldown: 1200, range: 1, cost: 15, effect: 'melee', lifestealPercent: 30, icon: '🩸', color: '#cc2244', lvl: 16, description: 'Vampiric strike that heals based on damage dealt.' },
            { id: 'riposte', name: 'Riposte', damage: 40, cooldown: 800, range: 1, cost: 10, effect: 'melee', counterAttack: true, icon: '🗡️', color: '#aaddff', lvl: 18, description: 'Counter-attack after blocking. Higher damage after perfect block.' },
            { id: 'rallying_shout', name: 'Rallying Shout', duration: 8000, cooldown: 20000, cost: 30, effect: 'buff', buffStat: 'attack', buffAmount: 10, aura: true, icon: '📯', color: '#ffcc44', lvl: 20, description: 'Buff that increases nearby ally attack power.' },
            { id: 'whirlwind_cleave', name: 'Whirlwind Cleave', damage: 30, cooldown: 1500, range: 1, cost: 20, effect: 'aoe_circle', aoeRadius: 2, hits: 2, icon: '🌀', color: '#88aacc', lvl: 22, description: 'Spinning shield-and-sword cleave hitting all around you.' },
            { id: 'throw_shield', name: 'Throw Shield', damage: 35, cooldown: 3000, range: 6, cost: 25, projectile: true, effect: 'projectile', knockback: true, icon: '🛡️', color: '#4488ff', lvl: 25, description: 'Hurl your shield at a distant enemy, knocking them back.' },
            { id: 'fortress_aura', name: 'Fortress Aura', duration: 12000, cooldown: 25000, cost: 40, effect: 'buff', buffStat: 'defense', buffAmount: 15, aura: true, icon: '🏰', color: '#8899bb', lvl: 28, description: 'Defensive aura that buffs nearby ally defense.' },
            { id: 'bloodbath', name: 'Bloodbath', damage: 45, cooldown: 4000, range: 0, cost: 30, effect: 'aoe_circle', aoeRadius: 3, lifestealPercent: 40, icon: '🩸', color: '#990022', lvl: 30, description: 'AOE blood attack that heals you for each enemy hit.' },
            { id: 'unbreakable', name: 'Unbreakable', duration: 6000, cooldown: 30000, cost: 50, effect: 'buff', buffStat: 'maxHp', buffAmount: 100, icon: '💎', color: '#44ddff', lvl: 32, description: 'Become nearly invincible. Massive HP boost.' },
            { id: 'warbringer_slam', name: 'Warbringer Slam', damage: 65, cooldown: 5000, range: 0, cost: 35, effect: 'earthquake', aoeRadius: 4, screenShake: true, icon: '⚔️', color: '#ff4400', lvl: 35, description: 'Devastating ground slam from the Warbringer path.' },
            { id: 'shield_nova', name: 'Shield Nova', damage: 50, cooldown: 6000, range: 0, cost: 40, effect: 'nova', aoeRadius: 4, knockback: true, icon: '💫', color: '#88bbff', lvl: 38, description: 'Expanding shockwave from the shield pushing all enemies away.' },
            { id: 'crimson_fortress', name: 'Crimson Fortress', damage: 40, duration: 8000, cooldown: 20000, cost: 60, effect: 'buff', buffStat: 'defense', buffAmount: 30, lifestealPercent: 25, icon: '🏰', color: '#cc0022', lvl: 42, description: 'Combine Fortress and Bloodsteel. Defense + lifesteal.' },
            { id: 'last_stand', name: 'Last Stand', damage: 100, cooldown: 25000, range: 0, cost: 50, effect: 'nova', aoeRadius: 5, screenShake: true, icon: '☠️', color: '#ff2200', lvl: 50, description: 'Ultimate: Channel all rage into a single devastating explosion.' }
        ]
    },

    // ==========================================
    // NIGHTREAVER - Burst DPS / Assassin
    // Specializations: Shadow Executioner | Venom Blade | Phantom Striker
    // ==========================================
    NIGHTREAVER: {
        id: 'nightreaver',
        name: 'Nightreaver',
        role: 'Burst DPS / Assassin',
        description: 'A deadly shadow operative who strikes from stealth. Masters of poison, backstabs, and burst damage with three paths: Shadow Executioner (burst), Venom Blade (DoT), and Phantom Striker (mobility).',
        stats: { hp: 100, maxHp: 100, mana: 0, maxMana: 0, attack: 28, defense: 4, speed: 175, rage: 0, maxRage: 0, stealth: 100, maxStealth: 100, stamina: 120, maxStamina: 120 },
        skills: {
            SPACE: { id: 'backstab', name: 'Backstab', damage: 35, cooldown: 500, range: 1, effect: 'melee', backstabMultiplier: 2.0, icon: '🗡️', color: '#aa44ff', description: 'Swift dagger strike. Double damage from stealth.' },
            Q: { id: 'shadow_step', name: 'Shadow Step', range: 5, cooldown: 3000, effect: 'blink', icon: '👤', color: '#6622aa', description: 'Teleport behind the nearest enemy.' },
            W: { id: 'vanish', name: 'Vanish', duration: 5000, cooldown: 12000, effect: 'stealth', icon: '🌑', color: '#332255', description: 'Become invisible. Next attack from stealth deals bonus damage.' }
        },
        specializations: [
            { id: 'shadow_executioner', name: 'Shadow Executioner', desc: 'Massive burst damage from stealth.', icon: '☠️' },
            { id: 'venom_blade', name: 'Venom Blade', desc: 'Poison DoT specialist.', icon: '🐍' },
            { id: 'phantom_striker', name: 'Phantom Striker', desc: 'High mobility and evasion.', icon: '👻' }
        ],
        allSkills: [
            { id: 'quick_slash', name: 'Quick Slash', damage: 10, cooldown: 300, range: 1, effect: 'melee', icon: '🗡️', color: '#cc88ff', lvl: 1, description: 'Fast dagger swipe.' },
            { id: 'backstab', name: 'Backstab', damage: 35, cooldown: 500, range: 1, effect: 'melee', backstabMultiplier: 2.0, icon: '🗡️', color: '#aa44ff', lvl: 2, description: 'Double damage from stealth or behind.' },
            { id: 'poison_dagger', name: 'Poison Dagger', damage: 12, cooldown: 600, range: 1, effect: 'melee', dot: true, dotDamage: 5, dotDuration: 5000, icon: '🐍', color: '#44ff44', lvl: 4, description: 'Dagger coated in venom. Poisons on hit.' },
            { id: 'shadow_step', name: 'Shadow Step', range: 5, cooldown: 3000, effect: 'blink', icon: '👤', color: '#6622aa', lvl: 6, description: 'Blink to a nearby location.' },
            { id: 'vanish', name: 'Vanish', duration: 5000, cooldown: 12000, effect: 'stealth', icon: '🌑', color: '#332255', lvl: 8, description: 'Turn invisible for 5 seconds.' },
            { id: 'fan_of_knives', name: 'Fan of Knives', damage: 18, cooldown: 1200, range: 0, cost: 0, effect: 'nova', aoeRadius: 2, icon: '🔪', color: '#cc88ff', lvl: 10, description: 'Throw daggers in all directions.' },
            { id: 'garrote', name: 'Garrote', damage: 8, cooldown: 2000, range: 1, effect: 'melee', dot: true, dotDamage: 8, dotDuration: 8000, silence: true, icon: '🪢', color: '#cc4444', lvl: 12, description: 'Choke the enemy, silencing and bleeding them.' },
            { id: 'envenom', name: 'Envenom', duration: 10000, cooldown: 15000, effect: 'buff', buffStat: 'attack', buffAmount: 12, poisonOnHit: true, icon: '☠️', color: '#22cc44', lvl: 14, description: 'Coat your weapons in deadly poison.' },
            { id: 'shuriken_toss', name: 'Shuriken Toss', damage: 22, cooldown: 800, range: 6, projectile: true, effect: 'projectile', icon: '✦', color: '#ccccff', lvl: 16, description: 'Throw a shuriken at a distant target.' },
            { id: 'shadow_dance', name: 'Shadow Dance', duration: 6000, cooldown: 20000, effect: 'buff', buffStat: 'speed', buffAmount: 50, stealthOnKill: true, icon: '💃', color: '#7744cc', lvl: 18, description: 'Enter a frenzy. Stealth resets on every kill.' },
            { id: 'eviscerate', name: 'Eviscerate', damage: 55, cooldown: 3000, range: 1, effect: 'melee', icon: '💀', color: '#ff2244', lvl: 20, description: 'Powerful finishing strike. More damage on poisoned targets.' },
            { id: 'smoke_bomb', name: 'Smoke Bomb', cooldown: 8000, range: 0, effect: 'aoe_circle', aoeRadius: 3, blind: true, stealthSelf: true, icon: '💨', color: '#888888', lvl: 22, description: 'Drop a smoke bomb. Blinds enemies and stealths you.' },
            { id: 'blade_flurry', name: 'Blade Flurry', damage: 15, cooldown: 1500, range: 1, hits: 6, effect: 'melee', icon: '⚡', color: '#dd88ff', lvl: 25, description: 'Six rapid slashes in quick succession.' },
            { id: 'poisoned_caltrops', name: 'Poisoned Caltrops', damage: 10, cooldown: 5000, range: 3, effect: 'aoe_circle', aoeRadius: 2, dot: true, dotDamage: 6, dotDuration: 6000, icon: '📌', color: '#44cc22', lvl: 28, description: 'Scatter caltrops that poison enemies who step on them.' },
            { id: 'phantom_strike', name: 'Phantom Strike', damage: 45, cooldown: 2500, range: 5, effect: 'blink', blinkAttack: true, icon: '👻', color: '#8844ff', lvl: 30, description: 'Teleport to target and strike. Guaranteed crit from stealth.' },
            { id: 'death_mark', name: 'Death Mark', duration: 6000, cooldown: 10000, range: 5, effect: 'debuff', debuff: 'defense', debuffAmount: -15, icon: '💀', color: '#ff0044', lvl: 32, description: 'Mark an enemy for death. All damage taken increased.' },
            { id: 'venom_nova', name: 'Venom Nova', damage: 35, cooldown: 6000, range: 0, effect: 'nova', aoeRadius: 4, dot: true, dotDamage: 8, dotDuration: 8000, icon: '🐍', color: '#22ff44', lvl: 35, description: 'Expanding ring of deadly venom.' },
            { id: 'shadow_clones', name: 'Shadow Clones', duration: 10000, cooldown: 25000, effect: 'summon', summonCount: 2, summonStats: { hp: 30, attack: 15 }, icon: '👥', color: '#6633aa', lvl: 38, description: 'Summon two shadow clones that fight alongside you.' },
            { id: 'execute', name: 'Execute', damage: 80, cooldown: 8000, range: 1, effect: 'melee', executeThreshold: 0.3, icon: '⚰️', color: '#cc0000', lvl: 42, description: 'Instant kill on targets below 30% HP. High damage otherwise.' },
            { id: 'nightfall', name: 'Nightfall', damage: 120, cooldown: 20000, range: 0, effect: 'nova', aoeRadius: 5, screenShake: true, stealthAfter: true, icon: '🌑', color: '#220044', lvl: 50, description: 'Ultimate: Darkness consumes everything. Massive AOE then re-stealth.' }
        ]
    },

    // ==========================================
    // ARCANIST - Ranged DPS / Controller (Mana-based)
    // Specializations: Pyromancer | Frostbinder | Voidcaller
    // ==========================================
    ARCANIST: {
        id: 'arcanist',
        name: 'Arcanist',
        role: 'Ranged DPS / Control',
        description: 'Master of the arcane arts, cycling between fire, ice, and void elements. Excels at ranged devastation and crowd control with three paths: Pyromancer (fire DPS), Frostbinder (ice CC), and Voidcaller (dark magic).',
        stats: { hp: 85, maxHp: 85, mana: 999, maxMana: 999, attack: 12, defense: 3, speed: 130, rage: 0, maxRage: 0, stamina: 80, maxStamina: 80 },
        skills: {
            SPACE: { id: 'arcane_bolt', name: 'Arcane Bolt', damage: 22, cooldown: 600, range: 8, cost: 10, projectile: true, effect: 'projectile', icon: '✨', color: '#aa88ff', description: 'Focused bolt of arcane energy.' },
            Q: { id: 'pyroblast', name: 'Pyroblast', damage: 50, cooldown: 4000, range: 7, cost: 40, projectile: true, effect: 'projectile', aoeOnHit: true, aoeRadius: 2, icon: '🔥', color: '#ff4400', description: 'Massive fireball that explodes on impact.' },
            W: { id: 'frost_nova', name: 'Frost Nova', damage: 25, cooldown: 6000, range: 0, cost: 35, effect: 'nova', aoeRadius: 3, freeze: true, icon: '❄️', color: '#88ddff', description: 'Freezing ring that immobilizes nearby enemies.' }
        },
        specializations: [
            { id: 'pyromancer', name: 'Pyromancer', desc: 'Pure fire destruction. Maximum damage.', icon: '🔥' },
            { id: 'frostbinder', name: 'Frostbinder', desc: 'Ice control and crowd freezing.', icon: '❄️' },
            { id: 'voidcaller', name: 'Voidcaller', desc: 'Dark void magic. Debuffs and chaos.', icon: '🌑' }
        ],
        allSkills: [
            { id: 'arcane_bolt', name: 'Arcane Bolt', damage: 22, cooldown: 600, range: 8, cost: 10, projectile: true, effect: 'projectile', icon: '✨', color: '#aa88ff', lvl: 1, description: 'Basic arcane projectile.' },
            { id: 'fire_bolt', name: 'Fire Bolt', damage: 15, cooldown: 500, range: 7, cost: 8, projectile: true, effect: 'projectile', icon: '🔥', color: '#ff6600', lvl: 2, description: 'Small fire projectile.' },
            { id: 'frost_bolt', name: 'Frost Bolt', damage: 12, cooldown: 600, range: 7, cost: 10, projectile: true, effect: 'projectile', freeze: true, icon: '❄️', color: '#88ccff', lvl: 4, description: 'Ice shard that slows on hit.' },
            { id: 'mana_shield', name: 'Mana Shield', duration: 6000, cooldown: 15000, cost: 40, effect: 'buff', buffStat: 'defense', buffAmount: 15, icon: '🔮', color: '#6644dd', lvl: 6, description: 'Shield of mana that absorbs damage.' },
            { id: 'pyroblast', name: 'Pyroblast', damage: 50, cooldown: 4000, range: 7, cost: 40, projectile: true, effect: 'projectile', aoeOnHit: true, aoeRadius: 2, icon: '🔥', color: '#ff4400', lvl: 8, description: 'Massive fireball with explosion.' },
            { id: 'frost_nova', name: 'Frost Nova', damage: 25, cooldown: 6000, range: 0, cost: 35, effect: 'nova', aoeRadius: 3, freeze: true, icon: '❄️', color: '#88ddff', lvl: 10, description: 'Freezing ring around the caster.' },
            { id: 'flame_wall', name: 'Flame Wall', damage: 20, cooldown: 3000, range: 4, cost: 25, effect: 'aoe_line', lineLength: 5, dot: true, dotDamage: 6, dotDuration: 4000, icon: '🔥', color: '#ff3300', lvl: 12, description: 'Line of fire that burns enemies who cross it.' },
            { id: 'blizzard', name: 'Blizzard', damage: 30, cooldown: 6000, range: 5, cost: 50, effect: 'aoe_circle', aoeRadius: 4, freeze: true, duration: 3000, icon: '🌨️', color: '#aaddff', lvl: 14, description: 'Area blizzard freezing and damaging.' },
            { id: 'arcane_blink', name: 'Arcane Blink', range: 5, cooldown: 4000, cost: 30, effect: 'blink', icon: '⚡', color: '#bb88ff', lvl: 16, description: 'Short-range teleport leaving an arcane echo.' },
            { id: 'void_bolt', name: 'Void Bolt', damage: 30, cooldown: 1000, range: 8, cost: 20, projectile: true, effect: 'projectile', debuff: 'defense', debuffAmount: -5, icon: '🌑', color: '#440088', lvl: 18, description: 'Void projectile that weakens target defense.' },
            { id: 'meteor_strike', name: 'Meteor Strike', damage: 65, cooldown: 8000, range: 6, cost: 60, effect: 'meteor', aoeRadius: 3, icon: '☄️', color: '#ff4400', lvl: 20, description: 'Call down a blazing meteor from the sky.' },
            { id: 'ice_prison', name: 'Ice Prison', duration: 4000, cooldown: 10000, range: 5, cost: 35, effect: 'freeze', root: true, icon: '🧊', color: '#66bbff', lvl: 22, description: 'Trap an enemy in ice, freezing them completely.' },
            { id: 'chain_lightning_arc', name: 'Chain Lightning', damage: 28, cooldown: 2000, range: 6, cost: 25, effect: 'lightning', chainTargets: 4, icon: '⚡', color: '#aaffff', lvl: 24, description: 'Lightning bouncing between multiple enemies.' },
            { id: 'void_rift', name: 'Void Rift', damage: 40, cooldown: 5000, range: 5, cost: 45, effect: 'aoe_circle', aoeRadius: 3, pullEnemies: true, icon: '🕳️', color: '#220044', lvl: 26, description: 'Open a rift in space that pulls enemies in and damages them.' },
            { id: 'firestorm', name: 'Firestorm', damage: 50, cooldown: 6000, range: 4, cost: 55, effect: 'aoe_circle', aoeRadius: 4, icon: '🔥', color: '#ff2200', lvl: 28, description: 'Raging fire tornado on target area.' },
            { id: 'mana_overload', name: 'Mana Overload', duration: 8000, cooldown: 25000, cost: 0, effect: 'buff', buffStat: 'attack', buffAmount: 20, manaOverload: true, icon: '💎', color: '#4488ff', lvl: 30, description: 'Overdrive your mana. Spells cost no mana but drain HP.' },
            { id: 'glacial_cascade', name: 'Glacial Cascade', damage: 45, cooldown: 4000, range: 5, cost: 40, effect: 'aoe_line', lineLength: 6, freeze: true, icon: '🏔️', color: '#66ddff', lvl: 33, description: 'Line of ice spikes erupting from the ground.' },
            { id: 'void_storm', name: 'Void Storm', damage: 55, cooldown: 7000, range: 0, cost: 60, effect: 'tornado', aoeRadius: 4, duration: 3000, icon: '🌀', color: '#440066', lvl: 36, description: 'Swirling vortex of void energy.' },
            { id: 'spell_weave', name: 'Spell Weave', damage: 40, cooldown: 2000, range: 6, cost: 30, hits: 3, projectile: true, effect: 'projectile', elementCycle: true, icon: '🔮', color: '#ff88ff', lvl: 40, description: 'Rapid-fire three spells cycling fire-ice-void.' },
            { id: 'cataclysm', name: 'Cataclysm', damage: 150, cooldown: 20000, range: 5, cost: 100, effect: 'meteor', aoeRadius: 5, screenShake: true, icon: '🌋', color: '#ff0000', lvl: 50, description: 'Ultimate: Apocalyptic meteor shower devastating a massive area.' }
        ]
    },

    // ==========================================
    // SOUL ENGINEER - Tactical DPS / Support (Mana-based)
    // Specializations: Summoner | Trapmaster | Overclocked Artificer
    // ==========================================
    SOUL_ENGINEER: {
        id: 'soul_engineer',
        name: 'Soul Engineer',
        role: 'Tactical DPS / Support',
        description: 'Ingenious inventor combining arcane engineering with soul magic. Deploys constructs, traps, and tech-enhanced weapons. Three paths: Summoner (pets), Trapmaster (control), and Overclocked Artificer (tech DPS).',
        stats: { hp: 110, maxHp: 110, mana: 999, maxMana: 999, attack: 16, defense: 6, speed: 140, rage: 0, maxRage: 0, stamina: 90, maxStamina: 90 },
        skills: {
            SPACE: { id: 'soul_shot', name: 'Soul Shot', damage: 20, cooldown: 500, range: 7, cost: 8, projectile: true, effect: 'projectile', icon: '🔧', color: '#ff8844', description: 'Fire a soul-infused tech bolt.' },
            Q: { id: 'deploy_turret', name: 'Deploy Turret', duration: 12000, cooldown: 15000, cost: 40, effect: 'summon', summonStats: { hp: 60, attack: 12, visual: 'turret', stationary: true }, icon: '🏗️', color: '#88aa44', description: 'Deploy an auto-attacking turret construct.' },
            W: { id: 'shock_trap', name: 'Shock Trap', damage: 30, cooldown: 5000, range: 3, cost: 20, effect: 'aoe_circle', aoeRadius: 2, root: true, duration: 2000, icon: '⚡', color: '#ffdd44', description: 'Place an electric trap that stuns enemies.' }
        },
        specializations: [
            { id: 'summoner_eng', name: 'Summoner', desc: 'Command an army of constructs.', icon: '🤖' },
            { id: 'trapmaster', name: 'Trapmaster', desc: 'Control the battlefield with traps.', icon: '🪤' },
            { id: 'overclocked', name: 'Overclocked Artificer', desc: 'Tech-enhanced DPS powerhouse.', icon: '⚡' }
        ],
        allSkills: [
            { id: 'soul_shot', name: 'Soul Shot', damage: 20, cooldown: 500, range: 7, cost: 8, projectile: true, effect: 'projectile', icon: '🔧', color: '#ff8844', lvl: 1, description: 'Basic tech projectile.' },
            { id: 'wrench_strike', name: 'Wrench Strike', damage: 14, cooldown: 400, range: 1, cost: 4, effect: 'melee', icon: '🔧', color: '#ccaa44', lvl: 2, description: 'Melee wrench bash.' },
            { id: 'deploy_drone', name: 'Deploy Drone', duration: 10000, cooldown: 12000, cost: 25, effect: 'summon', summonStats: { hp: 30, attack: 8, visual: 'drone' }, icon: '🤖', color: '#44aaff', lvl: 4, description: 'Small drone that attacks nearby enemies.' },
            { id: 'shock_trap', name: 'Shock Trap', damage: 30, cooldown: 5000, range: 3, cost: 20, effect: 'aoe_circle', aoeRadius: 2, root: true, duration: 2000, icon: '⚡', color: '#ffdd44', lvl: 6, description: 'Electric trap that stuns.' },
            { id: 'soul_grenade', name: 'Soul Grenade', damage: 28, cooldown: 2000, range: 5, cost: 18, projectile: true, effect: 'projectile', aoeOnHit: true, aoeRadius: 2, icon: '💣', color: '#ff6644', lvl: 8, description: 'Thrown grenade that explodes on impact.' },
            { id: 'deploy_turret', name: 'Deploy Turret', duration: 12000, cooldown: 15000, cost: 40, effect: 'summon', summonStats: { hp: 60, attack: 12, visual: 'turret', stationary: true }, icon: '🏗️', color: '#88aa44', lvl: 10, description: 'Auto-attacking turret.' },
            { id: 'repair_kit', name: 'Repair Kit', healAmount: 40, cooldown: 8000, cost: 25, effect: 'heal_self', icon: '🩹', color: '#44ff88', lvl: 12, description: 'Use a repair kit to restore HP.' },
            { id: 'flame_thrower', name: 'Flame Thrower', damage: 25, cooldown: 1500, range: 3, cost: 20, effect: 'aoe_front', aoeAngle: 60, aoeRadius: 3, icon: '🔥', color: '#ff4400', lvl: 14, description: 'Short-range cone of flame.' },
            { id: 'mine_field', name: 'Mine Field', damage: 20, cooldown: 6000, range: 3, cost: 30, effect: 'aoe_circle', aoeRadius: 3, dot: true, dotDamage: 8, dotDuration: 6000, icon: '💥', color: '#ff8800', lvl: 16, description: 'Scatter proximity mines in an area.' },
            { id: 'overclock', name: 'Overclock', duration: 8000, cooldown: 20000, cost: 35, effect: 'buff', buffStat: 'attack', buffAmount: 15, buffStat2: 'speed', buffAmount2: 30, icon: '⚡', color: '#ffff44', lvl: 18, description: 'Overclock your gear. Attack and speed boost.' },
            { id: 'gravity_well', name: 'Gravity Well', damage: 20, cooldown: 8000, range: 5, cost: 40, effect: 'aoe_circle', aoeRadius: 3, pullEnemies: true, icon: '🕳️', color: '#6644aa', lvl: 20, description: 'Deploy a gravity device that pulls enemies together.' },
            { id: 'deploy_guardian', name: 'Deploy Guardian', duration: 15000, cooldown: 20000, cost: 50, effect: 'summon', summonStats: { hp: 100, attack: 8, defense: 10, visual: 'guardian' }, icon: '🛡️', color: '#4488cc', lvl: 22, description: 'Summon a tanky guardian construct.' },
            { id: 'rail_gun', name: 'Rail Gun', damage: 55, cooldown: 4000, range: 10, cost: 35, effect: 'aoe_line', lineLength: 10, pierce: true, icon: '🔫', color: '#44ddff', lvl: 25, description: 'Piercing high-energy beam in a long line.' },
            { id: 'tesla_coil', name: 'Tesla Coil', damage: 35, cooldown: 5000, range: 3, cost: 30, effect: 'lightning', chainTargets: 5, icon: '⚡', color: '#aaffff', lvl: 28, description: 'Deploy a tesla coil that chains lightning between enemies.' },
            { id: 'soul_cannon', name: 'Soul Cannon', damage: 70, cooldown: 6000, range: 8, cost: 50, projectile: true, effect: 'projectile', aoeOnHit: true, aoeRadius: 3, screenShake: true, icon: '💥', color: '#ff4444', lvl: 30, description: 'Devastating cannon blast with massive splash.' },
            { id: 'trap_network', name: 'Trap Network', damage: 25, cooldown: 10000, range: 4, cost: 45, effect: 'aoe_circle', aoeRadius: 4, root: true, duration: 3000, icon: '🪤', color: '#88cc44', lvl: 32, description: 'Large trap field that immobilizes everything.' },
            { id: 'construct_army', name: 'Construct Army', duration: 15000, cooldown: 25000, cost: 60, effect: 'summon', summonCount: 3, summonStats: { hp: 40, attack: 12 }, icon: '👥', color: '#888888', lvl: 35, description: 'Summon three combat constructs.' },
            { id: 'orbital_strike', name: 'Orbital Strike', damage: 80, cooldown: 10000, range: 6, cost: 65, effect: 'meteor', aoeRadius: 4, screenShake: true, icon: '🛸', color: '#ff6600', lvl: 38, description: 'Call down an orbital bombardment.' },
            { id: 'soul_core_overcharge', name: 'Soul Core Overcharge', duration: 10000, cooldown: 30000, cost: 50, effect: 'buff', buffStat: 'attack', buffAmount: 25, aura: true, icon: '💎', color: '#ff44ff', lvl: 42, description: 'Overcharge your Soul Core. Massive damage boost to all nearby.' },
            { id: 'doomsday_device', name: 'Doomsday Device', damage: 140, cooldown: 20000, range: 5, cost: 90, effect: 'aoe_circle', aoeRadius: 6, screenShake: true, icon: '☢️', color: '#ff0000', lvl: 50, description: 'Ultimate: Deploy a doomsday device that devastates the entire area.' }
        ]
    }
};

// Helper to get Eclipse class list as array
export const ECLIPSE_CLASS_LIST = Object.values(ECLIPSE_CLASSES);
