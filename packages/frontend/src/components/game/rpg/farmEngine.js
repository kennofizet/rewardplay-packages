// ==========================================
// FARM ENGINE — Crop + Tower Defense System
// ==========================================
// Manages farming, defense placement, zombie waves,
// day/night cycle, plant upgrades/merge/remove,
// and persistent save/load on House Map (Map 8)

import { TILE_SIZE } from './tiles';
import {
    CROPS, CROP_LIST, DEFENSE_PLANTS, DEFENSE_PLANT_LIST,
    ZOMBIES, WAVES, FARM_LAYOUT,
    PLANT_LEVEL_COLORS, LEVEL_MULTIPLIERS, PLANT_MAX_LEVEL, getScaledStats
} from './data/farmData';

const SAVE_KEY = 'eclipse_farm_state';
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

export class FarmEngine {
    constructor(gameEngine) {
        this.ge = gameEngine;

        // --- Crop State ---
        this.cropSlots = [];
        this.harvestedCrops = {};
        this.initCropSlots();

        // --- Defense State ---
        this.defenseSlots = [];
        this.initDefenseSlots();

        // --- Projectiles ---
        this.projectiles = [];

        // --- Zombie State ---
        this.zombies = [];
        this.zombieIdCounter = 0;

        // --- Wave State ---
        this.currentWave = 0;
        this.waveActive = false;
        this.waveTimer = 0;
        this.waveGroupTimers = [];
        this.waveComplete = false;
        this.zombiesRemaining = 0;
        this.nightAttackStartTs = 0;   // 18:00 this night (ms)
        this.nextWaveAt = 0;           // next wave spawn time (ms)
        this.wavesStartedThisNight = 0;

        // --- Persistent Day/Wave Tracking ---
        this.firstJoinTs = Date.now(); // first ever game join timestamp
        this.dayCount = 1;             // total in-game days
        this.wavesDefended = 0;        // total waves successfully defended
        this.wavesLost = 0;            // total waves lost
        this.lossStreak = 0;           // consecutive losses toward 10-loss penalty
        this.offlineReport = null;     // report to show on game join

        // --- Day/Night Cycle ---
        this.cycleStartTs = Date.now(); // real timestamp when current cycle started
        this.dayTimer = FARM_LAYOUT.DAY_DURATION;
        this.isNight = false;
        this.nightTimer = 0;
        this.cyclePhase = 'day';

        // --- UI State ---
        this.selectedCrop = null;
        this.selectedPlant = null;
        this.showCropMenu = false;
        this.showPlantMenu = false;
        this.clickedSlotX = -1;
        this.clickedSlotY = -1;
        this.farmMessage = '';
        this.farmMessageTimer = 0;
        this.nightWarningShown = false;
        this.breachTriggered = false;

        // --- Merge mode ---
        this.mergeSourceSlot = -1; // index of first selected plant for merge

        // --- Selected plant range display ---
        this.selectedPlantSlot = -1; // index of defense slot showing range
        this.selectedPlantTimer = 0; // auto-clear after 5s

        // --- Save timer ---
        this.saveTimer = AUTO_SAVE_INTERVAL;

        // Load saved state
        this.loadFarmState();
        // Sync day/night to player's real timezone (in case no save or first run)
        this._syncRealTimePhase(Date.now());
        if (this.isNight && !this.waveActive) {
            const now = Date.now();
            const d = new Date(now);
            const nightStart = FARM_LAYOUT.REAL_TIME_NIGHT_HOUR ?? 18;
            this.nightAttackStartTs = new Date(d.getFullYear(), d.getMonth(), d.getDate(), nightStart, 0, 0, 0).getTime();
            if (d.getHours() < (FARM_LAYOUT.REAL_TIME_DAY_HOUR ?? 6)) this.nightAttackStartTs -= 86400000;
            this.nextWaveAt = this.nightAttackStartTs + (FARM_LAYOUT.WAVE_INTERVAL_MS ?? 20000);
            this.wavesStartedThisNight = 0;
            this.startWave();
        }
    }

    _syncRealTimePhase(now) {
        const info = this.getLocalTimePhase(now);
        this.cyclePhase = info.phase;
        this.isNight = info.phase === 'night';
        this.dayTimer = info.dayTimerMs;
        this.nightTimer = info.nightTimerMs;
        this.dayCount = Math.max(this.dayCount, info.dayNumber);
    }

    // --- INITIALIZATION ---
    initCropSlots() {
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 10; col++) {
                const x = 4 + col * 2 + (col >= 5 ? 2 : 0);
                const y = 34 + row * 3;
                this.cropSlots.push({ x, y, cropId: null, plantedAt: 0, growTime: 0, stage: 0, mature: false });
            }
        }
    }

    initDefenseSlots() {
        for (let lane = 0; lane < 5; lane++) {
            for (let col = 0; col < 8; col++) {
                const x = 33 + col * 3;
                const y = 34 + lane * 4;
                this.defenseSlots.push({ x, y, lane, col, plant: null });
            }
        }
    }

    // =============================================
    // SAVE / LOAD SYSTEM
    // =============================================
    saveFarmState() {
        try {
            const state = {
                ts: Date.now(),
                gold: this.ge.gold,
                currentWave: this.currentWave,
                cycleStartTs: this.cycleStartTs,
                dayTimer: this.dayTimer,
                nightTimer: this.nightTimer,
                cyclePhase: this.cyclePhase,
                isNight: this.isNight,
                nextWaveAt: this.nextWaveAt,
                nightAttackStartTs: this.nightAttackStartTs,
                wavesStartedThisNight: this.wavesStartedThisNight,
                harvestedCrops: this.harvestedCrops,
                // Persistent tracking
                firstJoinTs: this.firstJoinTs,
                dayCount: this.dayCount,
                wavesDefended: this.wavesDefended,
                wavesLost: this.wavesLost,
                lossStreak: this.lossStreak,
                crops: this.cropSlots.map(s => ({
                    cropId: s.cropId,
                    plantedAt: s.plantedAt,
                    growTime: s.growTime,
                })),
                defense: this.defenseSlots.map(s => {
                    if (!s.plant) return null;
                    return {
                        id: s.plant.id,
                        level: s.plant.level || 1,
                        currentHp: s.plant.currentHp,
                    };
                }),
            };
            localStorage.setItem(SAVE_KEY, JSON.stringify(state));
        } catch (e) { /* silently fail */ }
    }

    loadFarmState() {
        try {
            const raw = localStorage.getItem(SAVE_KEY);
            if (!raw) return;
            const state = JSON.parse(raw);
            const now = Date.now();
            const elapsed = now - (state.ts || now);

            // Restore gold
            if (state.gold != null) this.ge.gold = state.gold;

            // Restore wave
            if (state.currentWave != null) this.currentWave = state.currentWave;

            // Restore persistent tracking
            if (state.firstJoinTs) this.firstJoinTs = state.firstJoinTs;
            if (state.dayCount != null) this.dayCount = state.dayCount;
            if (state.wavesDefended != null) this.wavesDefended = state.wavesDefended;
            if (state.wavesLost != null) this.wavesLost = state.wavesLost;
            if (state.lossStreak != null) this.lossStreak = state.lossStreak;

            // Restore harvested crops
            if (state.harvestedCrops) this.harvestedCrops = state.harvestedCrops;

            // Restore crop slots (with offline growth calculation)
            if (state.crops) {
                state.crops.forEach((saved, i) => {
                    if (i >= this.cropSlots.length || !saved.cropId) return;
                    const slot = this.cropSlots[i];
                    slot.cropId = saved.cropId;
                    slot.plantedAt = saved.plantedAt;
                    slot.growTime = saved.growTime;
                    const growElapsed = now - slot.plantedAt;
                    const progress = Math.min(1, growElapsed / slot.growTime);
                    if (progress >= 1) {
                        slot.mature = true;
                        slot.stage = 3;
                    } else if (progress >= 0.5) {
                        slot.stage = 2;
                    } else {
                        slot.stage = 1;
                    }
                });
            }

            // Restore defense slots (with level)
            if (state.defense) {
                state.defense.forEach((saved, i) => {
                    if (i >= this.defenseSlots.length || !saved) return;
                    const plantDef = DEFENSE_PLANTS[Object.keys(DEFENSE_PLANTS).find(k => DEFENSE_PLANTS[k].id === saved.id)];
                    if (!plantDef) return;
                    const level = saved.level || 1;
                    const scaled = getScaledStats(plantDef, level);
                    this.defenseSlots[i].plant = {
                        ...plantDef,
                        level,
                        currentHp: Math.min(saved.currentHp, scaled.hp),
                        hp: scaled.hp,
                        damage: scaled.damage,
                        lastAttack: 0,
                        lastProduce: 0,
                        cooldown: 0,
                        isChewing: false,
                        chewTimer: 0,
                        armed: plantDef.type === 'mine' ? true : false,
                        armTimer: 0,
                    };
                });
            }

            // =====================================
            // REAL-TIMEZONE CYCLE (player local time)
            // =====================================
            const dayStart = FARM_LAYOUT.REAL_TIME_DAY_HOUR ?? 6;
            const nightStart = FARM_LAYOUT.REAL_TIME_NIGHT_HOUR ?? 18;
            let offlineDays = 0;
            let offlineWavesWon = 0;
            let offlineWavesLost = 0;
            let offlinePlantsKilled = 0;
            let penaltyTriggered = false;

            // Count real nights (18:00–6:00) that started while offline
            const startD = new Date(state.ts);
            const endD = new Date(now);
            let cur = new Date(startD.getFullYear(), startD.getMonth(), startD.getDate());
            const endDate = new Date(endD.getFullYear(), endD.getMonth(), endD.getDate());
            let offlineNights = 0;
            while (cur <= endDate) {
                const nightStartTs = new Date(cur);
                nightStartTs.setHours(nightStart, 0, 0, 0);
                if (nightStartTs > state.ts && nightStartTs <= now) offlineNights++;
                cur.setDate(cur.getDate() + 1);
            }

            const wavesPerNight = Math.min(180, Math.floor((FARM_LAYOUT.NIGHT_ATTACK_DURATION_MS ?? 3600000) / (FARM_LAYOUT.WAVE_INTERVAL_MS ?? 20000)));
            if (offlineNights > 0) {
                for (let n = 0; n < offlineNights; n++) {
                    offlineDays++;
                    for (let w = 0; w < wavesPerNight; w++) {
                        const waveResult = this._simulateOfflineWave();
                        if (waveResult.won) offlineWavesWon++;
                        else { offlineWavesLost++; offlinePlantsKilled += waveResult.plantsLost; }
                    }
                }
                this.dayCount += offlineDays;
                this.wavesDefended += offlineWavesWon;
                this.wavesLost += offlineWavesLost;
                this.lossStreak += offlineWavesLost;
                if (offlineWavesWon > 0) this.lossStreak = Math.max(0, this.lossStreak - offlineWavesWon);
                if (this.lossStreak >= 10) {
                    penaltyTriggered = true;
                    this.ge.gold = 0;
                    for (const slot of this.cropSlots) {
                        slot.cropId = null; slot.plantedAt = 0; slot.growTime = 0; slot.stage = 0; slot.mature = false;
                    }
                    this.harvestedCrops = {};
                    this.lossStreak = 0;
                }
                const totalElapsed = now - state.ts;
                this.offlineReport = {
                    elapsed: totalElapsed, offlineDays,
                    wavesWon: offlineWavesWon, wavesLost: offlineWavesLost,
                    plantsLost: offlinePlantsKilled, penaltyTriggered,
                    totalDays: this.dayCount,
                    totalWavesDefended: this.wavesDefended,
                    totalWavesLost: this.wavesLost,
                    currentStreak: this.lossStreak,
                    goldRemaining: this.ge.gold,
                };
            }

            this._syncRealTimePhase(now);
            const info = this.getLocalTimePhase(now);
            if (info.phase === 'night') {
                const d = new Date(now);
                const hour = d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600;
                const nightStartTs = new Date(d);
                nightStartTs.setHours(nightStart, 0, 0, 0);
                if (hour < dayStart) nightStartTs.setDate(nightStartTs.getDate() - 1);
                this.nightAttackStartTs = nightStartTs.getTime();
                const elapsedInNight = Math.max(0, now - this.nightAttackStartTs);
                const waveInterval = FARM_LAYOUT.WAVE_INTERVAL_MS ?? 20000;
                const wavesStarted = Math.min(180, Math.floor(elapsedInNight / waveInterval) + 1);
                this.nextWaveAt = this.nightAttackStartTs + wavesStarted * waveInterval;
                if (offlineNights === 0) {
                    this.currentWave++;
                    if (this.currentWave > WAVES.length) this.currentWave = 1;
                }
                this._reconstructMidWave(elapsedInNight);
            }

            // Always build a join report for the notification
            const timeSinceFirst = now - this.firstJoinTs;
            const totalHoursPlayed = Math.floor(timeSinceFirst / 3600000);
            this.joinReport = {
                totalDays: this.dayCount,
                totalWavesDefended: this.wavesDefended,
                totalWavesLost: this.wavesLost,
                hoursPlayed: totalHoursPlayed,
                currentStreak: this.lossStreak,
                offlineReport: this.offlineReport,
            };

            // Save updated state immediately
            this.saveFarmState();

            // Emit join report after a delay (so Vue component is ready)
            setTimeout(() => {
                this.ge.onEvent('farm_join_report', this.joinReport);
            }, 1000);

        } catch (e) { /* silently fail, start fresh */ }
    }

    /** Clear offline report after player has seen it (when back online). */
    clearOfflineReport() {
        this.offlineReport = null;
        if (this.joinReport) this.joinReport.offlineReport = null;
        this.saveFarmState();
    }

    /**
     * Simulate an offline wave — estimate outcome based on current plant DPS vs wave zombies HP.
     * Returns { won: boolean, plantsLost: number }
     */
    _simulateOfflineWave() {
        // Get current wave definition
        const waveIdx = Math.min(this.currentWave, WAVES.length - 1);
        const waveDef = WAVES[waveIdx];
        if (!waveDef) return { won: true, plantsLost: 0 };

        // Calculate total zombie HP for this wave
        let totalZombieHp = 0;
        for (const group of waveDef.groups) {
            totalZombieHp += (group.type.hp || 100) * group.count;
        }

        // Calculate total plant DPS across all defense slots
        let totalPlantDps = 0;
        let totalPlantHp = 0;
        let activePlants = 0;
        for (const slot of this.defenseSlots) {
            if (!slot.plant) continue;
            activePlants++;
            totalPlantHp += slot.plant.currentHp;
            if (slot.plant.damage > 0 && slot.plant.attackSpeed > 0) {
                totalPlantDps += (slot.plant.damage / (slot.plant.attackSpeed / 1000));
            }
        }

        // Simulate: can plants kill all zombies before breach?
        // Wave duration is NIGHT_DURATION. Calculate total damage output.
        const waveDuration = FARM_LAYOUT.NIGHT_DURATION / 1000; // seconds
        const totalDamageOutput = totalPlantDps * waveDuration;
        const won = totalDamageOutput >= totalZombieHp * 0.6; // 60% threshold (some margin)

        // If lost, estimate plant casualties based on zombie damage
        let plantsLost = 0;
        if (!won) {
            // Zombies deal damage to plants — estimate how many die
            let totalZombieDmg = 0;
            for (const group of waveDef.groups) {
                totalZombieDmg += (group.type.damage || 10) * group.count * 5; // 5 hits estimate
            }
            // Distribute damage across plants
            for (const slot of this.defenseSlots) {
                if (!slot.plant) continue;
                const dmgShare = totalZombieDmg / Math.max(1, activePlants);
                slot.plant.currentHp -= dmgShare;
                if (slot.plant.currentHp <= 0) {
                    slot.plant = null;
                    plantsLost++;
                }
            }
            // Advance wave
            this.currentWave = Math.min(this.currentWave + 1, WAVES.length);
        } else {
            // Won — advance wave, plants take proportional damage
            const damageRatio = Math.min(1, totalZombieHp / Math.max(1, totalDamageOutput));
            const wearPercent = 0.05 + damageRatio * 0.15; // 5-20% wear based on difficulty
            for (const slot of this.defenseSlots) {
                if (!slot.plant) continue;
                slot.plant.currentHp -= slot.plant.hp * wearPercent;
                if (slot.plant.currentHp <= 0) {
                    slot.plant = null;
                    plantsLost++;
                }
            }
            this.currentWave = Math.min(this.currentWave + 1, WAVES.length);
        }

        return { won, plantsLost };
    }

    /**
     * Reconstruct a live mid-wave state as if the game has been running.
     * Spawns zombies at calculated positions based on elapsed time in the night.
     * @param {number} elapsedInNight - ms elapsed since night started
     */
    _reconstructMidWave(elapsedInNight) {
        // Reconstruct the wave at current currentWave (caller handles increment)
        const waveDef = WAVES[this.currentWave - 1];
        if (!waveDef) return;

        this.waveActive = true;
        this.waveComplete = false;
        this.breachTriggered = false;
        this.zombies = [];

        const spawnX = (FARM_LAYOUT.SPAWN_X + FARM_LAYOUT.SPAWN_W - 2) * TILE_SIZE;
        const farmLeftEdge = FARM_LAYOUT.DEF_X * TILE_SIZE;
        const elapsedSec = elapsedInNight / 1000;

        // Calculate total plant DPS for kill estimation
        let totalPlantDps = 0;
        for (const slot of this.defenseSlots) {
            if (!slot.plant || slot.plant.damage <= 0 || slot.plant.attackSpeed <= 0) continue;
            totalPlantDps += (slot.plant.damage / (slot.plant.attackSpeed / 1000));
        }

        // Spawn each group's zombies at calculated positions
        let totalZombiesExpected = 0;
        let zombiesKilledByDps = 0;
        const dpsPerZombie = totalPlantDps / Math.max(1, waveDef.groups.reduce((s, g) => s + g.count, 0));

        for (const group of waveDef.groups) {
            const groupDelayMs = group.delay || 0;
            for (let j = 0; j < group.count; j++) {
                totalZombiesExpected++;
                // Each zombie spawns at: groupDelay + j * 800ms
                const zombieSpawnTime = groupDelayMs + j * 800;
                const zombieAliveMs = elapsedInNight - zombieSpawnTime;

                if (zombieAliveMs <= 0) {
                    // Not spawned yet — add to pending wave group timers
                    continue;
                }

                const zombieAliveSec = zombieAliveMs / 1000;
                const typeDef = group.type;
                const speed = typeDef.speed || 30;

                // Estimate if this zombie would have been killed by plant DPS
                const dmgReceived = dpsPerZombie * zombieAliveSec;
                if (dmgReceived >= (typeDef.hp || 100)) {
                    zombiesKilledByDps++;
                    continue; // This zombie is dead
                }

                // Calculate position
                const lane = (totalZombiesExpected - 1) % 5;
                let posX = spawnX - speed * zombieAliveSec * 0.06;

                // If zombie reached plants, it might be attacking — clamp to plant position
                let attackingPlant = null;
                for (const slot of this.defenseSlots) {
                    if (!slot.plant || slot.lane !== lane) continue;
                    const plantX = slot.x * TILE_SIZE + TILE_SIZE / 2;
                    if (posX <= plantX + TILE_SIZE * 0.8) {
                        posX = plantX + TILE_SIZE * 0.8;
                        attackingPlant = slot;
                        break;
                    }
                }

                const laneY = (34 + lane * 4) * TILE_SIZE + TILE_SIZE / 2;
                const currentHp = Math.max(1, (typeDef.hp || 100) - dmgReceived);

                this.zombies.push({
                    id: this.zombieIdCounter++,
                    type: typeDef.id,
                    x: posX, y: laneY, lane,
                    hp: currentHp, maxHp: typeDef.hp || 100,
                    speed: typeDef.speed || 30, baseSpeed: typeDef.speed || 30,
                    damage: typeDef.damage || 10, attackSpeed: typeDef.attackSpeed || 1000,
                    special: typeDef.special,
                    lastAttack: Date.now(), attackingPlant,
                    shieldHp: typeDef.shieldHp || 0,
                    hasJumped: false, thrownImp: false, slowTimer: 0,
                    redirected: false,
                });

                // If zombie was attacking a plant, apply estimated damage to plant
                if (attackingPlant && attackingPlant.plant) {
                    const attackTime = (posX - (spawnX - speed * zombieAliveSec * 0.06)) > 0
                        ? zombieAliveSec * 0.3 : 0; // rough estimate of attack time
                    const plantDmg = (typeDef.damage || 10) * Math.floor(attackTime);
                    attackingPlant.plant.currentHp = Math.max(1, attackingPlant.plant.currentHp - plantDmg);
                }
            }
        }

        // Set up remaining wave group timers for zombies not yet spawned
        this.zombiesRemaining = totalZombiesExpected - zombiesKilledByDps;
        this.waveGroupTimers = waveDef.groups.map(g => {
            const groupDelayMs = g.delay || 0;
            let spawned = 0;
            for (let j = 0; j < g.count; j++) {
                const t = groupDelayMs + j * 800;
                if (t < elapsedInNight) spawned++;
            }
            const remaining = Math.max(0, g.count - spawned);
            return {
                type: g.type, count: g.count, remaining,
                delay: g.delay, timer: Math.max(0, g.delay - elapsedInNight),
                spawnInterval: 800, spawnTimer: 0,
            };
        });

        if (this.zombies.length === 0 && this.zombiesRemaining <= zombiesKilledByDps) {
            // All zombies already killed
            this.waveComplete = true;
            this.waveActive = false;
            this.wavesDefended++;
            this.lossStreak = Math.max(0, this.lossStreak - 1);
        }
    }

    // =============================================
    // CROP SYSTEM
    // =============================================
    plantCrop(slotIndex, cropId) {
        const slot = this.cropSlots[slotIndex];
        if (!slot || slot.cropId) return false;

        const crop = CROPS[Object.keys(CROPS).find(k => CROPS[k].id === cropId)];
        if (!crop) return false;

        if (this.ge.gold < crop.cost) {
            this.showMessage(`Not enough gold! Need ${crop.cost}💰`);
            return false;
        }

        this.ge.gold -= crop.cost;
        slot.cropId = cropId;
        slot.plantedAt = Date.now();
        slot.growTime = crop.growTime;
        slot.stage = 1;
        slot.mature = false;

        this.showMessage(`Planted ${crop.icon} ${crop.name}!`);
        this.ge.onEvent('farm_update', { gold: this.ge.gold });
        this.saveFarmState();
        return true;
    }

    harvestCrop(slotIndex) {
        const slot = this.cropSlots[slotIndex];
        if (!slot || !slot.mature) return false;

        const crop = CROPS[Object.keys(CROPS).find(k => CROPS[k].id === slot.cropId)];
        if (!crop) return false;

        this.harvestedCrops[slot.cropId] = (this.harvestedCrops[slot.cropId] || 0) + 1;
        slot.cropId = null;
        slot.plantedAt = 0;
        slot.growTime = 0;
        slot.stage = 0;
        slot.mature = false;

        this.showMessage(`Harvested ${crop.icon} ${crop.name}! (+${crop.sellValue}💰)`);
        this.ge.gold += crop.sellValue;
        this.ge.onEvent('farm_update', { gold: this.ge.gold, harvested: this.harvestedCrops });
        this.saveFarmState();
        return true;
    }

    updateCrops(dt) {
        const now = Date.now();
        for (const slot of this.cropSlots) {
            if (!slot.cropId || slot.mature) continue;
            const elapsed = now - slot.plantedAt;
            const progress = Math.min(1, elapsed / slot.growTime);
            if (progress >= 1) {
                slot.mature = true;
                slot.stage = 3;
            } else if (progress >= 0.5) {
                slot.stage = 2;
            } else {
                slot.stage = 1;
            }
        }
    }

    // =============================================
    // DEFENSE SYSTEM (with levels)
    // =============================================
    placeDefense(slotIndex, plantId) {
        const slot = this.defenseSlots[slotIndex];
        if (!slot || slot.plant) return false;

        const plantDef = DEFENSE_PLANTS[Object.keys(DEFENSE_PLANTS).find(k => DEFENSE_PLANTS[k].id === plantId)];
        if (!plantDef) return false;

        if (this.ge.gold < plantDef.cost) {
            this.showMessage(`Not enough gold! Need ${plantDef.cost}💰`);
            return false;
        }

        this.ge.gold -= plantDef.cost;
        const level = 1;
        const scaled = getScaledStats(plantDef, level);
        slot.plant = {
            ...plantDef,
            level,
            currentHp: scaled.hp,
            hp: scaled.hp,
            damage: scaled.damage,
            lastAttack: 0,
            lastProduce: 0,
            cooldown: 0,
            isChewing: false,
            chewTimer: 0,
            armed: plantDef.type !== 'mine', // mines need arming
            armTimer: plantDef.type === 'mine' ? plantDef.armTime : 0,
        };

        this.showMessage(`Placed ${plantDef.icon} ${plantDef.name}!`);
        this.ge.onEvent('farm_update', { gold: this.ge.gold });

        // Instant-use plants
        if (plantDef.type === 'bomb') {
            this.detonateBomb(slot);
        } else if (plantDef.type === 'lane_bomb') {
            this.detonateLaneBomb(slot);
        } else if (plantDef.type === 'buff_consume') {
            this.applyCoffeeBean(slot);
        }

        this.saveFarmState();
        return true;
    }

    // --- UPGRADE PLANT ---
    upgradePlant(slotIndex) {
        const slot = this.defenseSlots[slotIndex];
        if (!slot || !slot.plant) return false;
        const plant = slot.plant;
        if (plant.level >= PLANT_MAX_LEVEL) {
            this.showMessage('⚡ Max level reached!');
            return false;
        }

        const nextLevel = plant.level + 1;
        const plantDef = DEFENSE_PLANTS[Object.keys(DEFENSE_PLANTS).find(k => DEFENSE_PLANTS[k].id === plant.id)];
        if (!plantDef) return false;

        const cost = getScaledStats(plantDef, nextLevel).upgradeCost;
        if (this.ge.gold < cost) {
            this.showMessage(`Not enough gold! Need ${cost}💰`);
            return false;
        }

        this.ge.gold -= cost;
        plant.level = nextLevel;
        const scaled = getScaledStats(plantDef, nextLevel);
        plant.damage = scaled.damage;
        plant.hp = scaled.hp;
        plant.currentHp = scaled.hp; // full heal on upgrade

        this.showMessage(`⬆️ ${plant.icon} upgraded to Lv.${nextLevel}!`);
        this.ge.onEvent('farm_update', { gold: this.ge.gold });
        this.ge.onEvent('farm_plant_upgraded', { slotIndex, level: nextLevel });
        this.saveFarmState();
        return true;
    }

    /** Return plant info payload for a slot (same shape as farm_plant_info) for refreshing popup */
    getPlantInfoForSlot(slotIndex) {
        const slot = this.defenseSlots[slotIndex];
        if (!slot || !slot.plant) return null;
        const plant = slot.plant;
        const plantDef = DEFENSE_PLANTS[Object.keys(DEFENSE_PLANTS).find(k => DEFENSE_PLANTS[k].id === plant.id)];
        if (!plantDef) return null;
        const levelColor = PLANT_LEVEL_COLORS[(plant.level || 1) - 1];
        return {
            slotIndex,
            plant: {
                id: plant.id,
                name: plant.name,
                icon: plant.icon,
                level: plant.level || 1,
                levelColor,
                currentHp: plant.currentHp,
                maxHp: plant.hp,
                damage: plant.damage,
                range: plant.range || 0,
                attackSpeed: plant.attackSpeed || 0,
                special: plant.special || null,
                type: plant.type,
                desc: plant.desc,
            },
            gold: this.ge.gold,
            canUpgrade: (plant.level || 1) < PLANT_MAX_LEVEL,
            upgradeCost: (plant.level || 1) < PLANT_MAX_LEVEL
                ? getScaledStats(plantDef, (plant.level || 1) + 1).upgradeCost
                : 0,
        };
    }

    /** Preview: list of plants that can be upgraded to max with current gold (cost per slot, total) */
    getUpgradeAllPreview() {
        const list = [];
        let totalCost = 0;
        let gold = this.ge.gold;
        for (let i = 0; i < this.defenseSlots.length; i++) {
            const slot = this.defenseSlots[i];
            if (!slot?.plant) continue;
            const plant = slot.plant;
            if ((plant.level || 1) >= PLANT_MAX_LEVEL) continue;
            const plantDef = DEFENSE_PLANTS[Object.keys(DEFENSE_PLANTS).find(k => DEFENSE_PLANTS[k].id === plant.id)];
            if (!plantDef) continue;
            let costForSlot = 0;
            for (let l = (plant.level || 1) + 1; l <= PLANT_MAX_LEVEL; l++) {
                costForSlot += getScaledStats(plantDef, l).upgradeCost;
            }
            if (costForSlot <= gold) {
                list.push({
                    slotIndex: i,
                    plantName: plant.name,
                    icon: plant.icon,
                    currentLevel: plant.level || 1,
                    targetLevel: PLANT_MAX_LEVEL,
                    cost: costForSlot,
                });
                totalCost += costForSlot;
                gold -= costForSlot;
            }
        }
        return { list, totalCost };
    }

    /** Apply upgrade-all: upgrade each plant in preview list to max (spend gold, apply upgrades) */
    upgradeAllToMax() {
        const { list } = this.getUpgradeAllPreview();
        for (const item of list) {
            let slot = this.defenseSlots[item.slotIndex];
            while (slot?.plant && (slot.plant.level || 1) < PLANT_MAX_LEVEL) {
                const ok = this.upgradePlant(item.slotIndex);
                if (!ok) break;
                slot = this.defenseSlots[item.slotIndex];
            }
        }
        this.ge.onEvent('farm_update', { gold: this.ge.gold });
        this.saveFarmState();
    }

    // --- REMOVE PLANT (50% refund) ---
    removePlant(slotIndex) {
        const slot = this.defenseSlots[slotIndex];
        if (!slot || !slot.plant) return false;
        const plant = slot.plant;
        const plantDef = DEFENSE_PLANTS[Object.keys(DEFENSE_PLANTS).find(k => DEFENSE_PLANTS[k].id === plant.id)];
        if (!plantDef) return false;

        // Refund 50% of total cost including upgrades
        let totalInvested = plantDef.cost;
        for (let l = 2; l <= plant.level; l++) {
            totalInvested += getScaledStats(plantDef, l).upgradeCost;
        }
        const refund = Math.floor(totalInvested * 0.5);
        this.ge.gold += refund;
        slot.plant = null;

        this.showMessage(`🗑️ Removed ${plantDef.icon} ${plantDef.name}! (+${refund}💰 refund)`);
        this.ge.onEvent('farm_update', { gold: this.ge.gold });
        this.saveFarmState();
        return true;
    }

    // --- MERGE PLANTS (same type + same level → level+1) ---
    mergePlants(slotA, slotB) {
        const a = this.defenseSlots[slotA];
        const b = this.defenseSlots[slotB];
        if (!a?.plant || !b?.plant) return false;
        if (a.plant.id !== b.plant.id) {
            this.showMessage('❌ Can only merge same type plants!');
            return false;
        }
        if (a.plant.level !== b.plant.level) {
            this.showMessage('❌ Plants must be the same level to merge!');
            return false;
        }
        if (a.plant.level >= PLANT_MAX_LEVEL) {
            this.showMessage('⚡ Already max level!');
            return false;
        }

        const newLevel = a.plant.level + 1;
        const plantDef = DEFENSE_PLANTS[Object.keys(DEFENSE_PLANTS).find(k => DEFENSE_PLANTS[k].id === a.plant.id)];
        const scaled = getScaledStats(plantDef, newLevel);

        a.plant.level = newLevel;
        a.plant.damage = scaled.damage;
        a.plant.hp = scaled.hp;
        a.plant.currentHp = scaled.hp;
        b.plant = null;

        this.showMessage(`🔀 Merged! ${plantDef.icon} ${plantDef.name} → Lv.${newLevel}!`);
        this.ge.onEvent('farm_update', { gold: this.ge.gold });
        this.ge.onEvent('farm_plant_merged', { slotIndex: slotA, level: newLevel });
        this.saveFarmState();
        return true;
    }

    // --- BOMB & SPECIAL ABILITIES ---
    detonateBomb(slot) {
        const bombX = slot.x * TILE_SIZE + TILE_SIZE / 2;
        const bombY = slot.y * TILE_SIZE + TILE_SIZE / 2;
        const range = (slot.plant.range || 2.5) * TILE_SIZE;
        for (const z of this.zombies) {
            const dx = z.x - bombX;
            const dy = z.y - bombY;
            if (Math.sqrt(dx * dx + dy * dy) < range) z.hp -= 999;
        }
        this.ge.addFloatText(bombX, bombY, '💥 BOOM!', '#ff4444');
        slot.plant = null;
    }

    detonateLaneBomb(slot) {
        const lane = slot.lane;
        for (const z of this.zombies) {
            if (z.lane === lane) z.hp -= 999;
        }
        const bombX = slot.x * TILE_SIZE + TILE_SIZE / 2;
        const bombY = slot.y * TILE_SIZE + TILE_SIZE / 2;
        this.ge.addFloatText(bombX, bombY, '🌶️ LANE BURN!', '#ff3d00');
        slot.plant = null;
    }

    applyCoffeeBean(slot) {
        // Boost adjacent plants' attack speed
        for (const other of this.defenseSlots) {
            if (!other.plant || other === slot) continue;
            const dx = Math.abs(other.x - slot.x);
            const dy = Math.abs(other.y - slot.y);
            if (dx <= 3 && dy <= 4) {
                if (other.plant.attackSpeed > 0) {
                    other.plant.attackSpeed = Math.floor(other.plant.attackSpeed / 2);
                    this.ge.addFloatText(
                        other.x * TILE_SIZE + TILE_SIZE / 2,
                        other.y * TILE_SIZE,
                        '☕ 2x SPEED!', '#6d4c41'
                    );
                }
            }
        }
        // Coffee bean is consumed
        slot.plant = null;
    }

    updateDefenses(dt) {
        const now = Date.now();
        for (const slot of this.defenseSlots) {
            if (!slot.plant) continue;
            const plant = slot.plant;
            const plantCenterX = slot.x * TILE_SIZE + TILE_SIZE / 2;
            const plantCenterY = slot.y * TILE_SIZE + TILE_SIZE / 2;

            // Mine: arm timer
            if (plant.type === 'mine' && !plant.armed) {
                plant.armTimer -= dt;
                if (plant.armTimer <= 0) {
                    plant.armed = true;
                }
                continue;
            }

            // Mine: check zombie proximity to explode
            if (plant.type === 'mine' && plant.armed) {
                for (const z of this.zombies) {
                    if (z.hp <= 0 || z.lane !== slot.lane) continue;
                    if (Math.abs(z.x - plantCenterX) < TILE_SIZE) {
                        z.hp -= 999;
                        this.ge.addFloatText(plantCenterX, plantCenterY - 10, '💣 BOOM!', '#795548');
                        slot.plant = null;
                        break;
                    }
                }
                continue;
            }

            // Producer: generate gold
            if (plant.type === 'producer') {
                if (now - plant.lastProduce >= plant.tickInterval) {
                    plant.lastProduce = now;
                    const gold = plant.goldPerTick * (plant.level || 1);
                    this.ge.gold += gold;
                    this.ge.addFloatText(plantCenterX, plantCenterY - 10, `+${gold}💰`, '#fdd835');
                    this.ge.onEvent('farm_update', { gold: this.ge.gold });
                }
                continue;
            }

            // Wall / Garlic: passive, just blocks
            if (plant.type === 'wall') continue;

            // Chomper: chewing cooldown
            if (plant.type === 'melee' && plant.isChewing) {
                plant.chewTimer -= dt;
                if (plant.chewTimer <= 0) plant.isChewing = false;
                continue;
            }

            // Ranged: shoot at zombies
            if (plant.type === 'ranged' && now - plant.lastAttack >= plant.attackSpeed) {
                const range = plant.range * TILE_SIZE;

                if (plant.special === 'pierce') {
                    // Cactus: hits all in lane within range
                    const targets = this.zombies.filter(z => z.hp > 0 && z.lane === slot.lane && z.x - plantCenterX > 0 && z.x - plantCenterX < range);
                    if (targets.length > 0) {
                        plant.lastAttack = now;
                        this.projectiles.push({
                            x: plantCenterX + 10, y: plantCenterY,
                            dx: 4, damage: plant.damage,
                            lane: slot.lane, type: 'spine', special: 'pierce',
                        });
                    }
                } else if (plant.special === 'splash') {
                    // Melon-pult: splash damage
                    const target = this.findZombieInLane(slot.lane, plantCenterX, range, 'right');
                    if (target) {
                        plant.lastAttack = now;
                        this.projectiles.push({
                            x: plantCenterX + 10, y: plantCenterY - 5,
                            dx: 2.5, damage: plant.damage,
                            lane: slot.lane, type: 'melon', special: 'splash',
                            splashRadius: (plant.splashRadius || 1.5) * TILE_SIZE,
                            targetX: target.x,
                        });
                    }
                } else {
                    // Normal ranged (peashooter, snow pea, repeater)
                    const target = this.findZombieInLane(slot.lane, plantCenterX, range, 'right');
                    if (target) {
                        plant.lastAttack = now;
                        const shots = plant.shotsPerAttack || 1;
                        for (let s = 0; s < shots; s++) {
                            this.projectiles.push({
                                x: plantCenterX + 10,
                                y: plantCenterY + (s * 6 - 3),
                                dx: 3, damage: plant.damage,
                                lane: slot.lane,
                                type: plant.special === 'slow' ? 'snow_pea' : 'pea',
                                special: plant.special || null,
                            });
                        }
                    }
                }
            }

            // Melee (chomper): eat nearby zombie
            if (plant.type === 'melee' && !plant.isChewing && now - plant.lastAttack >= 2000) {
                const target = this.findZombieInLane(slot.lane, plantCenterX, 1.2 * TILE_SIZE, 'right');
                if (target) {
                    target.hp = 0;
                    plant.isChewing = true;
                    plant.chewTimer = plant.attackSpeed;
                    plant.lastAttack = now;
                    this.ge.addFloatText(plantCenterX, plantCenterY - 10, '😋 NOM!', '#7b1fa2');
                }
            }
        }
    }

    findZombieInLane(lane, fromX, range, direction) {
        let closest = null;
        let closestDist = Infinity;
        for (const z of this.zombies) {
            if (z.hp <= 0 || z.lane !== lane) continue;
            const dist = z.x - fromX;
            if (direction === 'right' && dist > 0 && dist < range && dist < closestDist) {
                closest = z;
                closestDist = dist;
            }
        }
        return closest;
    }

    // =============================================
    // PROJECTILE SYSTEM
    // =============================================
    updateProjectiles(dt) {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            p.x += p.dx;

            // Torchwood buff for peas
            for (const slot of this.defenseSlots) {
                if (!slot.plant || slot.plant.type !== 'buff') continue;
                if (slot.lane !== p.lane) continue;
                const torchX = slot.x * TILE_SIZE + TILE_SIZE / 2;
                if (Math.abs(p.x - torchX) < 8 && p.type === 'pea') {
                    p.type = 'fire_pea';
                    p.damage *= slot.plant.damageMultiplier;
                }
            }

            // Hit zombie
            let hit = false;
            for (const z of this.zombies) {
                if (z.hp <= 0 || z.lane !== p.lane) continue;
                if (Math.abs(p.x - z.x) < 12 && Math.abs(p.y - z.y) < 16) {
                    // Shield blocks non-fire projectiles
                    if (z.special === 'shield' && z.shieldHp > 0 && p.type !== 'fire_pea') {
                        z.shieldHp -= p.damage;
                        if (z.shieldHp <= 0) z.shieldHp = 0;
                    } else {
                        z.hp -= p.damage;
                    }
                    if (p.special === 'slow') z.slowTimer = 3000;

                    // Splash damage (melon-pult)
                    if (p.special === 'splash' && p.splashRadius) {
                        for (const z2 of this.zombies) {
                            if (z2 === z || z2.hp <= 0) continue;
                            const dx = z2.x - z.x;
                            const dy = z2.y - z.y;
                            if (Math.sqrt(dx * dx + dy * dy) < p.splashRadius) {
                                z2.hp -= Math.floor(p.damage * 0.5);
                            }
                        }
                    }

                    // Pierce: don't remove, keep going
                    if (p.special === 'pierce') {
                        // Mark this zombie as already hit
                        if (!p._hitIds) p._hitIds = new Set();
                        if (p._hitIds.has(z.id)) continue;
                        p._hitIds.add(z.id);
                        z.hp -= p.damage;
                        continue; // don't set hit=true
                    }

                    hit = true;
                    break;
                }
            }

            if (hit || p.x > 80 * TILE_SIZE) {
                this.projectiles.splice(i, 1);
            }
        }
    }

    // =============================================
    // ZOMBIE SYSTEM
    // =============================================
    spawnZombie(typeDef, lane) {
        if (lane === undefined) lane = Math.floor(Math.random() * 5);
        const spawnX = (FARM_LAYOUT.SPAWN_X + FARM_LAYOUT.SPAWN_W - 2) * TILE_SIZE;
        const laneY = (34 + lane * 4) * TILE_SIZE + TILE_SIZE / 2;

        this.zombies.push({
            id: this.zombieIdCounter++,
            type: typeDef.id,
            x: spawnX, y: laneY, lane,
            hp: typeDef.hp, maxHp: typeDef.hp,
            speed: typeDef.speed, baseSpeed: typeDef.speed,
            damage: typeDef.damage, attackSpeed: typeDef.attackSpeed,
            special: typeDef.special,
            lastAttack: 0, attackingPlant: null,
            shieldHp: typeDef.shieldHp || 0,
            hasJumped: false, thrownImp: false, slowTimer: 0,
            redirected: false,
        });
    }

    updateZombies(dt) {
        const now = Date.now();
        for (let i = this.zombies.length - 1; i >= 0; i--) {
            const z = this.zombies[i];

            // Dead zombie
            if (z.hp <= 0) {
                if (z.special === 'throw_imp' && !z.thrownImp) {
                    z.thrownImp = true;
                    this.spawnZombie(ZOMBIES.IMP, z.lane);
                    this.ge.addFloatText(z.x, z.y - 20, '🎯 IMP!', '#9ccc65');
                }
                this.zombies.splice(i, 1);
                this.zombiesRemaining--;
                continue;
            }

            // Gargantuar throws imp at half HP
            if (z.special === 'throw_imp' && !z.thrownImp && z.hp <= z.maxHp / 2) {
                z.thrownImp = true;
                const imp = { ...ZOMBIES.IMP };
                this.spawnZombie(imp, z.lane);
                const lastZ = this.zombies[this.zombies.length - 1];
                if (lastZ) lastZ.x = z.x - 5 * TILE_SIZE;
                this.ge.addFloatText(z.x, z.y - 20, '🎯 IMP TOSS!', '#9ccc65');
            }

            // Slow effect
            if (z.slowTimer > 0) {
                z.slowTimer -= dt;
                z.speed = z.baseSpeed * 0.5;
            } else {
                z.speed = z.baseSpeed;
            }

            // Check if attacking a defense plant
            z.attackingPlant = null;
            for (const slot of this.defenseSlots) {
                if (!slot.plant || slot.lane !== z.lane) continue;
                const plantX = slot.x * TILE_SIZE + TILE_SIZE / 2;
                if (Math.abs(z.x - plantX) < TILE_SIZE * 0.8) {
                    // Pole vault jump
                    if (z.special === 'jump' && !z.hasJumped) {
                        z.hasJumped = true;
                        z.x -= 3 * TILE_SIZE;
                        z.speed = 0.3;
                        this.ge.addFloatText(z.x, z.y - 20, '🏃 JUMP!', '#3f51b5');
                        break;
                    }
                    // Garlic redirect
                    if (slot.plant.special === 'redirect' && !z.redirected) {
                        z.redirected = true;
                        const newLane = z.lane + (Math.random() < 0.5 ? -1 : 1);
                        z.lane = Math.max(0, Math.min(4, newLane));
                        z.y = (34 + z.lane * 4) * TILE_SIZE + TILE_SIZE / 2;
                        slot.plant.currentHp -= z.damage;
                        if (slot.plant.currentHp <= 0) slot.plant = null;
                        this.ge.addFloatText(z.x, z.y - 20, '🧄 REDIRECTED!', '#e0e0e0');
                        break;
                    }
                    z.attackingPlant = slot;
                    break;
                }
            }

            if (z.attackingPlant) {
                if (now - z.lastAttack >= z.attackSpeed) {
                    z.lastAttack = now;
                    z.attackingPlant.plant.currentHp -= z.damage;
                    if (z.attackingPlant.plant.currentHp <= 0) {
                        z.attackingPlant.plant = null;
                        z.attackingPlant = null;
                    }
                }
            } else {
                z.x -= z.speed * dt * 0.06;
                const farmRightEdge = FARM_LAYOUT.DEF_X * TILE_SIZE;
                if (z.x <= farmRightEdge) {
                    const houseLeftEdge = 2 * TILE_SIZE;
                    if (z.x <= houseLeftEdge && !this.breachTriggered) {
                        this.triggerBreach();
                    }
                }
            }
        }
    }

    triggerBreach() {
        this.breachTriggered = true;
        this.wavesLost++;
        this.lossStreak++;
        const totalCropValue = Object.entries(this.harvestedCrops).reduce((sum, [cropId, count]) => {
            const crop = CROP_LIST.find(c => c.id === cropId);
            return sum + (crop ? crop.sellValue * count : 0);
        }, 0);
        const goldStolen = Math.floor(this.ge.gold * 0.5);
        this.harvestedCrops = {};
        this.ge.gold = Math.max(0, this.ge.gold - goldStolen);
        const totalLoss = totalCropValue + goldStolen;
        this.showMessage(`💀 BREACH! Zombies stole ${totalLoss}💰!`);
        this.ge.addFloatText(this.ge.player.pixelX, this.ge.player.pixelY - 30, `💀 ZOMBIES BREACHED! Lost ${totalLoss}💰`, '#ff1744');
        this.ge.onEvent('farm_breach', { goldStolen, cropsStolen: totalCropValue, lossStreak: this.lossStreak });

        // 10-loss penalty check
        if (this.lossStreak >= 10) {
            this.ge.gold = 0;
            for (const slot of this.cropSlots) {
                slot.cropId = null; slot.plantedAt = 0; slot.growTime = 0; slot.stage = 0; slot.mature = false;
            }
            this.harvestedCrops = {};
            this.lossStreak = 0;
            this.showMessage(`💥 10 LOSSES! All gold and crops destroyed!`);
            this.ge.onEvent('farm_penalty', { reason: '10 consecutive losses' });
        }

        this.zombies = [];
        this.waveActive = false;
        this.zombiesRemaining = 0;
        this.saveFarmState();
    }

    // =============================================
    // WAVE SYSTEM (new wave every 20s during 18:00–19:00; overlapping)
    // =============================================
    startWave() {
        this.currentWave++;
        if (this.currentWave > WAVES.length) this.currentWave = 1;
        const waveDef = WAVES[this.currentWave - 1];
        const addCount = waveDef.groups.reduce((sum, g) => sum + g.count, 0);

        if (!this.waveActive) {
            this.waveActive = true;
            this.waveComplete = false;
            this.breachTriggered = false;
            this.waveGroupTimers = [];
        }
        this.zombiesRemaining += addCount;
        for (const g of waveDef.groups) {
            this.waveGroupTimers.push({
                type: g.type, count: g.count, remaining: g.count,
                delay: g.delay, timer: g.delay,
                spawnInterval: 800, spawnTimer: 0,
            });
        }
        this.wavesStartedThisNight++;
        this.showMessage(`🌙 Wave ${this.wavesStartedThisNight} (Lv.${this.currentWave})!`);
        this.ge.onEvent('farm_wave_start', { wave: this.wavesStartedThisNight, level: this.currentWave });
    }

    updateWaves(dt) {
        if (!this.waveActive) return;
        for (const group of this.waveGroupTimers) {
            if (group.remaining <= 0) continue;
            group.timer -= dt;
            if (group.timer <= 0) {
                group.spawnTimer -= dt;
                if (group.spawnTimer <= 0) {
                    this.spawnZombie(group.type, Math.floor(Math.random() * 5));
                    group.remaining--;
                    group.spawnTimer = group.spawnInterval;
                }
            }
        }
    }

    // =============================================
    // DAY/NIGHT CYCLE (player's real timezone)
    // =============================================
    /**
     * Get current day/night phase from player's local time.
     * Day = 6:00–18:00, Night = 18:00–6:00 local.
     */
    getLocalTimePhase(now) {
        const d = new Date(now);
        const hour = d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600;
        const dayStart = FARM_LAYOUT.REAL_TIME_DAY_HOUR ?? 6;
        const nightStart = FARM_LAYOUT.REAL_TIME_NIGHT_HOUR ?? 18;
        const isNight = hour >= nightStart || hour < dayStart;
        const phase = isNight ? 'night' : 'day';

        let nextTransitionMs;
        if (isNight) {
            const nextDawn = new Date(d);
            nextDawn.setHours(dayStart, 0, 0, 0);
            if (hour >= nightStart) nextDawn.setDate(nextDawn.getDate() + 1);
            nextTransitionMs = Math.max(0, nextDawn.getTime() - now);
        } else {
            const nextDusk = new Date(d);
            nextDusk.setHours(nightStart, 0, 0, 0);
            nextTransitionMs = Math.max(0, nextDusk.getTime() - now);
        }

        const dayNumber = Math.max(1, Math.floor(now / 86400000) - Math.floor((this.firstJoinTs || now) / 86400000) + 1);
        return {
            phase,
            dayTimerMs: isNight ? 0 : nextTransitionMs,
            nightTimerMs: isNight ? nextTransitionMs : 0,
            dayNumber,
        };
    }

    updateDayNight(dt) {
        const now = Date.now();
        const info = this.getLocalTimePhase(now);
        const wasPhase = this.cyclePhase;

        this.dayTimer = info.dayTimerMs;
        this.nightTimer = info.nightTimerMs;

        if (info.phase !== wasPhase && wasPhase !== 'dawn') {
            if (info.phase === 'night') {
                this.cyclePhase = 'night';
                this.isNight = true;
                const d = new Date(now);
                const nightStart = FARM_LAYOUT.REAL_TIME_NIGHT_HOUR ?? 18;
                this.nightAttackStartTs = new Date(d.getFullYear(), d.getMonth(), d.getDate(), nightStart, 0, 0, 0).getTime();
                if (d.getHours() < (FARM_LAYOUT.REAL_TIME_DAY_HOUR ?? 6)) this.nightAttackStartTs -= 86400000;
                this.nextWaveAt = this.nightAttackStartTs + (FARM_LAYOUT.WAVE_INTERVAL_MS ?? 20000);
                this.wavesStartedThisNight = 0;
                this.startWave();
                this.nightWarningShown = true;
            } else if (info.phase === 'day') {
                this.cyclePhase = 'day';
                this.isNight = false;
                this.waveActive = false;
                this.zombies = [];
                this.waveGroupTimers = [];
                this.zombiesRemaining = 0;
                this.breachTriggered = false;
                this.dayCount = Math.max(this.dayCount, info.dayNumber);
                this.nightWarningShown = false;
                this.showMessage(`☀️ Day ${this.dayCount}! The farm is safe... for now.`);
                this.saveFarmState();
            }
        } else {
            this.cyclePhase = info.phase;
            this.isNight = info.phase === 'night';
        }

        if (this.cyclePhase === 'night' && this.waveActive) {
            const attackEnd = this.nightAttackStartTs + (FARM_LAYOUT.NIGHT_ATTACK_DURATION_MS ?? 3600000);
            if (now < attackEnd && now >= this.nextWaveAt) {
                this.startWave();
                this.nextWaveAt += FARM_LAYOUT.WAVE_INTERVAL_MS ?? 20000;
            }
        }

        if (this.cyclePhase === 'day' && this.dayTimer > 0 && this.dayTimer <= 30 * 60 * 1000 && !this.nightWarningShown) {
            this.nightWarningShown = true;
            this.showMessage('⚠️ NIGHT IS COMING! Prepare your defenses!');
            this.ge.onEvent('farm_night_warning', {});
        }
    }

    // =============================================
    // CLICK HANDLING
    // =============================================
    handleTileClick(tileX, tileY) {
        // Check crop slots
        const cropSlotIdx = this.cropSlots.findIndex(s => s.x === tileX && s.y === tileY);
        if (cropSlotIdx >= 0) {
            const slot = this.cropSlots[cropSlotIdx];
            if (slot.mature) {
                this.harvestCrop(cropSlotIdx);
                return true;
            } else if (!slot.cropId) {
                this.ge.onEvent('farm_open_crop_menu', {
                    slotIndex: cropSlotIdx,
                    crops: CROP_LIST,
                    gold: this.ge.gold,
                });
                return true;
            } else {
                const crop = CROP_LIST.find(c => c.id === slot.cropId);
                const remaining = Math.max(0, slot.growTime - (Date.now() - slot.plantedAt));
                this.showMessage(`${crop.icon} ${crop.name}: ${Math.ceil(remaining / 1000)}s remaining`);
                return true;
            }
        }

        // Check defense slots
        const defSlotIdx = this.defenseSlots.findIndex(s => s.x === tileX && s.y === tileY);
        if (defSlotIdx >= 0) {
            const slot = this.defenseSlots[defSlotIdx];
            if (!slot.plant) {
                // Check merge mode
                if (this.mergeSourceSlot >= 0) {
                    this.mergeSourceSlot = -1;
                    this.showMessage('❌ Merge cancelled — empty slot');
                    return true;
                }
                this.ge.onEvent('farm_open_plant_menu', {
                    slotIndex: defSlotIdx,
                    plants: DEFENSE_PLANT_LIST,
                    gold: this.ge.gold,
                });
                return true;
            } else {
                // Has plant — check merge mode
                if (this.mergeSourceSlot >= 0 && this.mergeSourceSlot !== defSlotIdx) {
                    const result = this.mergePlants(this.mergeSourceSlot, defSlotIdx);
                    this.mergeSourceSlot = -1;
                    return result;
                }
                // Show plant info popup + show attack range
                const plant = slot.plant;
                const levelColor = PLANT_LEVEL_COLORS[(plant.level || 1) - 1];

                // Set selected plant for range display
                this.selectedPlantSlot = defSlotIdx;
                this.selectedPlantTimer = 5000; // show range for 5 seconds

                this.ge.onEvent('farm_plant_info', {
                    slotIndex: defSlotIdx,
                    plant: {
                        id: plant.id,
                        name: plant.name,
                        icon: plant.icon,
                        level: plant.level || 1,
                        levelColor,
                        currentHp: plant.currentHp,
                        maxHp: plant.hp,
                        damage: plant.damage,
                        range: plant.range || 0,
                        attackSpeed: plant.attackSpeed || 0,
                        special: plant.special || null,
                        type: plant.type,
                        desc: plant.desc,
                    },
                    gold: this.ge.gold,
                    canUpgrade: (plant.level || 1) < PLANT_MAX_LEVEL,
                    upgradeCost: (plant.level || 1) < PLANT_MAX_LEVEL
                        ? getScaledStats(DEFENSE_PLANTS[Object.keys(DEFENSE_PLANTS).find(k => DEFENSE_PLANTS[k].id === plant.id)], (plant.level || 1) + 1).upgradeCost
                        : 0,
                });
                return true;
            }
        }
        return false;
    }

    // =============================================
    // MAIN UPDATE LOOP
    // =============================================
    update(dt) {
        this.updateCrops(dt);
        this.updateDayNight(dt);
        this.updateDefenses(dt);
        this.updateProjectiles(dt);
        this.updateZombies(dt);
        this.updateWaves(dt);

        // Message timer
        if (this.farmMessageTimer > 0) {
            this.farmMessageTimer -= dt;
            if (this.farmMessageTimer <= 0) this.farmMessage = '';
        }

        // Auto-save
        this.saveTimer -= dt;
        if (this.saveTimer <= 0) {
            this.saveTimer = AUTO_SAVE_INTERVAL;
            this.saveFarmState();
        }

        // Selected plant range display timer
        if (this.selectedPlantTimer > 0) {
            this.selectedPlantTimer -= dt;
            if (this.selectedPlantTimer <= 0) {
                this.selectedPlantSlot = -1;
            }
        }
    }

    // =============================================
    // RENDERING
    // =============================================
    render(ctx, camX, camY) {
        // Night overlay
        if (this.isNight) {
            const nightAlpha = this.cyclePhase === 'dawn' ? 0.15 : 0.35;
            ctx.fillStyle = `rgba(0, 0, 40, ${nightAlpha})`;
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }

        // --- Render crops with timer ---
        for (const slot of this.cropSlots) {
            if (!slot.cropId) continue;
            const sx = slot.x * TILE_SIZE - camX;
            const sy = slot.y * TILE_SIZE - camY;
            if (sx < -TILE_SIZE || sx > ctx.canvas.width || sy < -TILE_SIZE || sy > ctx.canvas.height) continue;

            const crop = CROP_LIST.find(c => c.id === slot.cropId);
            if (!crop) continue;

            // Draw crop growth stage
            if (slot.stage === 1) {
                ctx.fillStyle = '#2e7d32';
                ctx.fillRect(sx + 12, sy + 16, 4, 10);
                ctx.fillStyle = '#4caf50';
                ctx.beginPath(); ctx.arc(sx + 14, sy + 14, 5, 0, Math.PI * 2); ctx.fill();
            } else if (slot.stage === 2) {
                ctx.fillStyle = '#2e7d32';
                ctx.fillRect(sx + 10, sy + 12, 6, 14);
                ctx.fillStyle = crop.color;
                ctx.beginPath(); ctx.arc(sx + 13, sy + 10, 7, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#4caf50';
                ctx.fillRect(sx + 6, sy + 18, 8, 3);
                ctx.fillRect(sx + 18, sy + 16, 6, 3);
            } else if (slot.stage === 3) {
                ctx.fillStyle = '#2e7d32';
                ctx.fillRect(sx + 10, sy + 8, 8, 18);
                ctx.fillStyle = crop.color;
                ctx.beginPath(); ctx.arc(sx + 14, sy + 6, 9, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#81c784';
                ctx.fillRect(sx + 4, sy + 16, 10, 4);
                ctx.fillRect(sx + 18, sy + 14, 8, 4);
                const pulse = Math.sin(Date.now() / 300) * 0.3 + 0.3;
                ctx.fillStyle = `rgba(255, 255, 100, ${pulse})`;
                ctx.beginPath(); ctx.arc(sx + 14, sy + 10, 12, 0, Math.PI * 2); ctx.fill();
                ctx.font = '12px Arial';
                ctx.fillStyle = '#fff';
                ctx.fillText(crop.icon, sx + 7, sy + 10);
            }

            // --- Crop growth timer + progress bar ---
            if (!slot.mature) {
                const elapsed = Date.now() - slot.plantedAt;
                const progress = Math.min(1, elapsed / slot.growTime);
                const remaining = Math.max(0, slot.growTime - elapsed);
                const secs = Math.ceil(remaining / 1000);

                // Progress bar background
                ctx.fillStyle = 'rgba(0,0,0,0.6)';
                ctx.fillRect(sx + 2, sy + TILE_SIZE + 1, TILE_SIZE - 4, 6);
                // Progress bar fill
                const barColor = progress < 0.5 ? '#ff9800' : progress < 0.9 ? '#8bc34a' : '#4caf50';
                ctx.fillStyle = barColor;
                ctx.fillRect(sx + 2, sy + TILE_SIZE + 1, (TILE_SIZE - 4) * progress, 6);
                // Time text
                ctx.font = '8px monospace';
                ctx.fillStyle = '#fff';
                ctx.textAlign = 'center';
                ctx.fillText(`${secs}s`, sx + TILE_SIZE / 2, sy + TILE_SIZE + 14);
                ctx.textAlign = 'left';
            } else {
                // "READY" label for mature crops
                ctx.font = 'bold 8px monospace';
                ctx.fillStyle = '#ffd700';
                ctx.textAlign = 'center';
                ctx.fillText('READY', sx + TILE_SIZE / 2, sy + TILE_SIZE + 8);
                ctx.textAlign = 'left';
            }
        }

        // --- Render attack range for selected plant ---
        if (this.selectedPlantSlot >= 0) {
            const selSlot = this.defenseSlots[this.selectedPlantSlot];
            if (selSlot && selSlot.plant && selSlot.plant.range > 0) {
                const cx = selSlot.x * TILE_SIZE + TILE_SIZE / 2 - camX;
                const cy = selSlot.y * TILE_SIZE + TILE_SIZE / 2 - camY;
                const rangePx = selSlot.plant.range * TILE_SIZE;
                const pulse = Math.sin(Date.now() / 400) * 0.08 + 0.15;
                const levelColor = PLANT_LEVEL_COLORS[(selSlot.plant.level || 1) - 1];

                // Range circle fill
                ctx.save();
                ctx.globalAlpha = pulse;
                ctx.fillStyle = levelColor;
                ctx.beginPath();
                ctx.arc(cx, cy, rangePx, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 0.6;
                ctx.strokeStyle = levelColor;
                ctx.lineWidth = 2;
                ctx.setLineDash([6, 4]);
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.restore();

                // Range label
                ctx.font = 'bold 9px monospace';
                ctx.fillStyle = '#fff';
                ctx.textAlign = 'center';
                ctx.fillText(`📏 ${selSlot.plant.range} tiles`, cx, cy - rangePx - 4);
                ctx.textAlign = 'left';
            }
        }

        // --- Render defense plants with level ---
        for (const slot of this.defenseSlots) {
            if (!slot.plant) continue;
            const sx = slot.x * TILE_SIZE - camX;
            const sy = slot.y * TILE_SIZE - camY;
            if (sx < -TILE_SIZE || sx > ctx.canvas.width || sy < -TILE_SIZE || sy > ctx.canvas.height) continue;

            const plant = slot.plant;
            const level = plant.level || 1;
            const levelColor = PLANT_LEVEL_COLORS[level - 1];

            // Level color ring
            ctx.strokeStyle = levelColor;
            ctx.lineWidth = 2;
            ctx.strokeRect(sx + 1, sy + 1, TILE_SIZE - 2, TILE_SIZE - 2);

            // Draw plant sprite
            const sprite = this.ge.images[plant.id];
            if (sprite) {
                ctx.drawImage(sprite, sx + 2, sy + 2, TILE_SIZE - 4, TILE_SIZE - 4);
            } else {
                // Fallback: colored circle with icon
                ctx.fillStyle = plant.color || '#4caf50';
                ctx.beginPath(); ctx.arc(sx + TILE_SIZE / 2, sy + TILE_SIZE / 2, 10, 0, Math.PI * 2); ctx.fill();
                ctx.font = '14px Arial';
                ctx.fillStyle = '#fff';
                ctx.textAlign = 'center';
                ctx.fillText(plant.icon, sx + TILE_SIZE / 2, sy + TILE_SIZE / 2 + 5);
                ctx.textAlign = 'left';
            }

            // Mine arming indicator
            if (plant.type === 'mine' && !plant.armed) {
                const armPct = 1 - (plant.armTimer / (DEFENSE_PLANTS.POTATO_MINE?.armTime || 15000));
                ctx.fillStyle = 'rgba(0,0,0,0.5)';
                ctx.fillRect(sx + 2, sy + TILE_SIZE - 8, TILE_SIZE - 4, 5);
                ctx.fillStyle = '#ff9800';
                ctx.fillRect(sx + 2, sy + TILE_SIZE - 8, (TILE_SIZE - 4) * armPct, 5);
                ctx.font = '7px monospace';
                ctx.fillStyle = '#fff';
                ctx.textAlign = 'center';
                ctx.fillText('ARMING', sx + TILE_SIZE / 2, sy + TILE_SIZE - 2);
                ctx.textAlign = 'left';
            }

            // HP bar
            if (plant.currentHp < plant.hp) {
                const hpPct = plant.currentHp / plant.hp;
                ctx.fillStyle = '#333';
                ctx.fillRect(sx + 2, sy - 6, TILE_SIZE - 4, 4);
                ctx.fillStyle = hpPct > 0.5 ? '#4caf50' : hpPct > 0.25 ? '#ff9800' : '#f44336';
                ctx.fillRect(sx + 2, sy - 6, (TILE_SIZE - 4) * hpPct, 4);
            }

            // Level badge
            if (level > 1) {
                ctx.fillStyle = levelColor;
                ctx.fillRect(sx + TILE_SIZE - 14, sy + 1, 13, 10);
                ctx.font = 'bold 7px monospace';
                ctx.fillStyle = '#000';
                ctx.textAlign = 'center';
                ctx.fillText(`${level}`, sx + TILE_SIZE - 7, sy + 9);
                ctx.textAlign = 'left';
            }

            // Chewing indicator
            if (plant.isChewing) {
                ctx.fillStyle = 'rgba(156, 39, 176, 0.3)';
                ctx.beginPath(); ctx.arc(sx + 16, sy + 16, 16, 0, Math.PI * 2); ctx.fill();
                ctx.font = '10px Arial';
                ctx.fillStyle = '#fff';
                ctx.fillText('💤', sx + 10, sy + 18);
            }

            // Gold production indicator
            if (plant.type === 'producer') {
                const prodProgress = (Date.now() - plant.lastProduce) / plant.tickInterval;
                if (prodProgress > 0.8 && Math.sin(Date.now() / 200) > 0) {
                    ctx.font = '10px Arial';
                    ctx.fillText('💰', sx + 10, sy - 2);
                }
            }
        }

        // --- Render projectiles ---
        for (const p of this.projectiles) {
            const sx = p.x - camX;
            const sy = p.y - camY;
            if (sx < -10 || sx > ctx.canvas.width) continue;

            if (p.type === 'fire_pea') {
                ctx.fillStyle = '#ff5722';
                ctx.beginPath(); ctx.arc(sx, sy, 5, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = 'rgba(255,87,34,0.4)';
                ctx.beginPath(); ctx.arc(sx - 4, sy, 3, 0, Math.PI * 2); ctx.fill();
            } else if (p.type === 'snow_pea') {
                ctx.fillStyle = '#4fc3f7';
                ctx.beginPath(); ctx.arc(sx, sy, 4, 0, Math.PI * 2); ctx.fill();
            } else if (p.type === 'spine') {
                ctx.fillStyle = '#558b2f';
                ctx.fillRect(sx - 5, sy - 1, 10, 3);
            } else if (p.type === 'melon') {
                ctx.fillStyle = '#43a047';
                ctx.beginPath(); ctx.arc(sx, sy, 6, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#81c784';
                ctx.beginPath(); ctx.arc(sx, sy, 3, 0, Math.PI * 2); ctx.fill();
            } else {
                ctx.fillStyle = '#4caf50';
                ctx.beginPath(); ctx.arc(sx, sy, 4, 0, Math.PI * 2); ctx.fill();
            }
        }

        // --- Render zombies ---
        for (const z of this.zombies) {
            if (z.hp <= 0) continue;
            const sx = z.x - camX;
            const sy = z.y - camY - TILE_SIZE / 2;
            if (sx < -TILE_SIZE || sx > ctx.canvas.width || sy < -TILE_SIZE || sy > ctx.canvas.height) continue;

            const sprite = this.ge.images[z.type];
            if (sprite) {
                ctx.drawImage(sprite, sx - TILE_SIZE / 2, sy, TILE_SIZE, TILE_SIZE);
            } else {
                ctx.fillStyle = '#6d8a4e';
                ctx.beginPath(); ctx.arc(sx, sy + TILE_SIZE / 2, 10, 0, Math.PI * 2); ctx.fill();
            }

            // HP bar
            const hpPct = z.hp / z.maxHp;
            ctx.fillStyle = '#333';
            ctx.fillRect(sx - 12, sy - 4, 24, 4);
            ctx.fillStyle = hpPct > 0.5 ? '#f44336' : hpPct > 0.25 ? '#ff9800' : '#d32f2f';
            ctx.fillRect(sx - 12, sy - 4, 24 * hpPct, 4);

            // Shield bar
            if (z.special === 'shield' && z.shieldHp > 0) {
                const shieldPct = z.shieldHp / (ZOMBIES.SCREEN_DOOR.shieldHp);
                ctx.fillStyle = '#795548';
                ctx.fillRect(sx - 12, sy - 9, 24 * shieldPct, 3);
            }

            // Slow visual
            if (z.slowTimer > 0) {
                ctx.fillStyle = 'rgba(79, 195, 247, 0.3)';
                ctx.beginPath(); ctx.arc(sx, sy + TILE_SIZE / 2, 14, 0, Math.PI * 2); ctx.fill();
            }
        }

        // HUD
        this.renderFarmHUD(ctx);
    }

    _formatTimeLeft(ms) {
        const secs = Math.max(0, Math.ceil(ms / 1000));
        if (secs >= 3600) {
            const h = Math.floor(secs / 3600);
            const m = Math.floor((secs % 3600) / 60);
            return m > 0 ? `${h}h ${m}m` : `${h}h`;
        }
        if (secs >= 60) return `${Math.floor(secs / 60)}m`;
        return `${secs}s`;
    }

    renderFarmHUD(ctx) {
        const w = ctx.canvas.width;
        const phase = this.cyclePhase;
        const icon = phase === 'night' ? '🌙' : phase === 'dawn' ? '🌅' : '☀️';
        const timeLeft = phase === 'day' ? this.dayTimer : this.nightTimer;
        const timeStr = this._formatTimeLeft(timeLeft);

        const cardW = 320;
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(w / 2 - cardW / 2, 44, cardW, 28);
        ctx.strokeStyle = this.isNight ? '#6a1b9a' : '#ffc107';
        ctx.lineWidth = 2;
        ctx.strokeRect(w / 2 - cardW / 2, 44, cardW, 28);

        ctx.font = 'bold 14px monospace';
        ctx.fillStyle = this.isNight ? '#ce93d8' : '#fff';
        ctx.textAlign = 'center';
        ctx.fillText(`${icon} ${phase.toUpperCase()} — ${timeStr} | Waves ${this.wavesStartedThisNight}`, w / 2, 62);
        ctx.textAlign = 'left';

        if (this.farmMessage && this.farmMessageTimer > 0) {
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(w / 2 - 180, 76, 360, 24);
            ctx.font = '13px monospace';
            ctx.fillStyle = '#ffeb3b';
            ctx.textAlign = 'center';
            ctx.fillText(this.farmMessage, w / 2, 92);
            ctx.textAlign = 'left';
        }

        if (this.cyclePhase === 'day' && this.dayTimer <= 30 * 60 * 1000 && this.dayTimer > 0) {
            const pulse = Math.sin(Date.now() / 200) * 0.3 + 0.7;
            ctx.fillStyle = `rgba(244, 67, 54, ${pulse})`;
            ctx.fillRect(0, 104, w, 30);
            ctx.font = 'bold 16px monospace';
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.fillText('⚠️ NIGHT IS COMING! Prepare your defenses! ⚠️', w / 2, 124);
            ctx.textAlign = 'left';
        }
    }

    // =============================================
    // UTILITY
    // =============================================
    showMessage(msg) {
        this.farmMessage = msg;
        this.farmMessageTimer = 4000;
    }

    getFarmState() {
        return {
            isNight: this.isNight,
            cyclePhase: this.cyclePhase,
            dayTimer: this.dayTimer,
            nightTimer: this.nightTimer,
            currentWave: this.currentWave,
            waveActive: this.waveActive,
            harvestedCrops: { ...this.harvestedCrops },
            cropSlots: this.cropSlots.map(s => ({
                cropId: s.cropId, stage: s.stage, mature: s.mature,
                remaining: s.cropId ? Math.max(0, s.growTime - (Date.now() - s.plantedAt)) : 0,
            })),
            defenseSlots: this.defenseSlots.map(s => ({
                hasPlant: !!s.plant,
                plantName: s.plant ? s.plant.name : null,
                plantHp: s.plant ? s.plant.currentHp : 0,
                plantMaxHp: s.plant ? s.plant.hp : 0,
                plantLevel: s.plant ? (s.plant.level || 1) : 0,
            })),
            zombieCount: this.zombies.length,
        };
    }

    // Start merge mode from Vue
    startMergeMode(slotIndex) {
        this.mergeSourceSlot = slotIndex;
        this.showMessage('🔀 Select another plant of the same type & level to merge');
    }

    cancelMergeMode() {
        this.mergeSourceSlot = -1;
    }
}
