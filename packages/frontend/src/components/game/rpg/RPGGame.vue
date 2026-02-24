<template>
  <div class="rpg-game" ref="gameContainer" tabindex="0" @keydown="handleKeyDown" @click="focusGame">
    <div class="viewport">
      <canvas ref="gameCanvas" @click.stop="onCanvasClick"></canvas>

      <!-- Ground Item Tooltip -->
      <div v-if="groundItemTooltip" class="ground-item-tooltip"
           :style="{ left: groundItemTooltip.x + 'px', top: (groundItemTooltip.y - 10) + 'px' }">
        <div class="git-header" :style="{ color: groundItemTooltip.item.color }">
          {{ groundItemTooltip.item.icon }} {{ groundItemTooltip.item.name }}
        </div>
        <div class="git-rarity" :style="{ color: groundItemTooltip.item.color }">{{ groundItemTooltip.item.rarity?.toUpperCase() }}</div>
        <div class="git-stats" v-if="groundItemTooltip.item.stats">
          <div v-for="(val, stat) in groundItemTooltip.item.stats" :key="stat" class="git-stat">
            {{ stat.toUpperCase() }} +{{ val }}
          </div>
        </div>
        <button class="git-pickup-btn" @click.stop="pickupInspectedItem">📦 Pick Up</button>
        <div class="git-hint">or press SPACE to pick up all nearby</div>
      </div>
      
      <div class="hud-top-left">
        <div class="player-info-card">
           <!-- Character Portrait -->
           <div class="hero-portrait" :style="equipment.armor ? { borderColor: equipment.armor.color, boxShadow: '0 0 14px ' + equipment.armor.color + '44' } : {}">
             <div class="portrait-inner">
               <span class="portrait-emoji">{{ currentClass?.name === 'Dark Wizard' ? '🧙' : currentClass?.name === 'Fairy Elf' ? '🧝' : currentClass?.name === 'Dark Lord' ? '👑' : currentClass?.name === 'Magic Gladiator' ? '⚔️' : '🦹' }}</span>
             </div>
             <div class="portrait-level">{{ userData?.lv || 1 }}</div>
           </div>
           <!-- Info & Bars -->
           <div class="hud-info-col">
              <div class="hud-name-row">
                <span class="hud-class-name" @click="toggleClasses">{{ currentClass?.name || 'HERO' }} ▾</span>
                <span class="hud-combat-stats">⚔️{{ formatShortNum(totalStats.attack) }} 🛡️{{ formatShortNum(totalStats.defense) }}</span>
              </div>
              <!-- HP Bar -->
              <div class="hud-bar hp-bar">
                 <div class="hud-bar-fill hp-fill" :style="{ width: hpPercent + '%' }"></div>
                 <div class="hud-bar-shine"></div>
                 <span class="hud-bar-text">HP {{ formatShortNum(currentHp) }}/{{ formatShortNum(totalStats.maxHp) }}</span>
              </div>
              <!-- MP/Rage Bar -->
              <div class="hud-bar mp-bar" :class="resourceColorClass">
                 <div class="hud-bar-fill mp-fill" :style="{ width: resourcePercent + '%' }"></div>
                 <div class="hud-bar-shine"></div>
                 <span class="hud-bar-text">{{ resourceName }} {{ formatShortNum(currentResource) }}</span>
              </div>
              <!-- Stamina Bar (if applicable) -->
              <div v-if="hasStamina" class="hud-bar sta-bar">
                 <div class="hud-bar-fill sta-fill" :style="{ width: staminaPercent + '%' }"></div>
                 <div class="hud-bar-shine"></div>
                 <span class="hud-bar-text">STA {{ formatShortNum(currentStamina) }}</span>
              </div>
           </div>
        </div>
      </div>

      <!-- 15-Slot Skill Hotbar -->
      <div v-if="currentClass" class="hud-bottom-center">
         <div class="skill-tray">
            <div class="skill-slot" v-for="(skill, idx) in hotbarSkills" :key="idx"
                 :class="{ disabled: hotbarCooldowns[idx] > 0, empty: !skill }"
                 :title="skill ? skill.name + ' (' + skill.effect + ')' : 'Empty'"
                 @click="clickSkill(idx)">
               <div class="key-hint">{{ hotbarKeyLabels[idx] }}</div>
               <div v-if="skill" class="skill-icon" :style="{ color: skill.color }">{{ skill.icon }}</div>
               <div v-if="hotbarCooldowns[idx] > 0" class="cooldown-overlay">{{ Math.ceil(hotbarCooldowns[idx] / 1000) }}</div>
            </div>
            <!-- Separator -->
            <div class="tray-separator"></div>
            <!-- Consumable Slots -->
            <div class="consumable-slot" v-for="(con, ci) in consumableSlots" :key="'con'+ci"
                 :class="{ disabled: con.cooldown > 0 || con.count <= 0, empty: !con.id }"
                 :title="con.id ? con.name + ' (x' + con.count + ') — right-click to clear' : 'Empty slot — assign from bag'"
                 :style="{ borderColor: con.id ? con.color : '#333' }"
                 @click="useConsumable(ci)"
                 @contextmenu.prevent="clearConsumableSlot(ci)">
               <div class="consumable-icon">{{ con.id ? con.icon : '➕' }}</div>
               <div class="consumable-count">{{ con.id ? con.count : '' }}</div>
               <div v-if="con.cooldown > 0" class="cooldown-overlay">{{ Math.ceil(con.cooldown / 1000) }}</div>
            </div>
         </div>
      </div>

      <!-- Current Map Selector (above night card, centered) -->
      <div class="hud-top-center">
        <div class="map-indicator" @click="showMapMenu = true">
          <span class="map-icon">{{ currentMapMeta?.icon || '🗺️' }}</span>
          <span class="map-name">{{ currentMapMeta?.name || 'Unknown' }}</span>
          <span class="map-arrow">▾</span>
        </div>
      </div>

      <div class="hud-bottom-right">
         <button class="action-btn auto-btn" :class="{ active: autoModeActive }" @click="toggleAutoMode">🤖 {{ autoModeActive ? 'AUTO ON' : 'AUTO' }}</button>
         <button v-if="autoModeActive" class="action-btn settings-btn" @click="showAutoSettings = !showAutoSettings">⚙️ SETTINGS</button>
         <button class="action-btn map-btn" @click="showMapMenu = true">🗺️ MAP</button>
         <button class="action-btn skills-btn" @click="toggleSkills">⚔️ SKILLS</button>
         <button class="action-btn bag-btn" @click="toggleBag">🎒 BAG</button>
      </div>

      <!-- Auto-Mode Settings Panel -->
      <div v-if="showAutoSettings" class="auto-settings-panel">
        <div class="auto-settings-header">
          <span>⚙️ Auto-Mode Settings</span>
          <button class="close-btn" @click="showAutoSettings = false">✕</button>
        </div>
        <div class="auto-settings-body">
          <div class="auto-setting-section">
            <label class="auto-setting-label">Skills to use:</label>
            <div class="auto-skill-list">
              <template v-for="(skill, idx) in hotbarSkills" :key="idx">
              <div v-if="skill"
                   class="auto-skill-toggle" :class="{ enabled: autoEnabledSkills.includes(idx) }"
                   @click="toggleAutoSkill(idx)">
                <span class="auto-skill-icon" :style="{ color: skill.color }">{{ skill.icon }}</span>
                <span class="auto-skill-name">{{ skill.name }}</span>
                <span class="auto-skill-check">{{ autoEnabledSkills.includes(idx) ? '✅' : '⬜' }}</span>
              </div>
              </template>
            </div>
          </div>
          <div class="auto-setting-section">
            <label class="auto-setting-label">Use HP Potion below:</label>
            <div class="threshold-row">
              <input type="range" min="10" max="90" v-model.number="autoHpThreshold" class="threshold-slider" @change="saveAutoSettings">
              <span class="threshold-val">{{ autoHpThreshold }}%</span>
            </div>
          </div>
          <div class="auto-setting-section">
            <label class="auto-setting-label">Use MP Potion below:</label>
            <div class="threshold-row">
              <input type="range" min="10" max="90" v-model.number="autoMpThreshold" class="threshold-slider" @change="saveAutoSettings">
              <span class="threshold-val">{{ autoMpThreshold }}%</span>
            </div>
          </div>
          <div class="auto-setting-section">
            <label class="auto-setting-label">Auto-move to enemies:</label>
            <div class="threshold-row">
              <button class="auto-pickup-toggle" :class="{ enabled: autoMove }" @click="toggleAutoMove">
                {{ autoMove ? '✅ ON' : '⬜ OFF' }}
              </button>
            </div>
          </div>
          <div class="auto-setting-section">
            <label class="auto-setting-label">Auto-pickup items:</label>
            <div class="threshold-row">
              <button class="auto-pickup-toggle" :class="{ enabled: autoPickup }" @click="toggleAutoPickup">
                {{ autoPickup ? '✅ ON' : '⬜ OFF' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Virtual Joystick (left side) -->
      <div v-if="isMobile" class="mobile-joystick" @touchstart.prevent="joystickStart" @touchmove.prevent="joystickMove" @touchend.prevent="joystickEnd">
        <div class="joystick-base" ref="joystickBase">
          <div class="joystick-knob" :style="joystickKnobStyle"></div>
        </div>
      </div>

      <!-- Mobile Action Buttons (right side) -->
      <div v-if="isMobile" class="mobile-action-pad">
        <button class="mobile-atk-btn" @touchstart.prevent="mobileAttack">⚔️</button>
        <button class="mobile-dodge-btn" @touchstart.prevent="mobileDodge">💨</button>
        <button v-if="nearbyNPC" class="mobile-interact-btn" @touchstart.prevent="mobileNPCInteract">💬</button>
      </div>

      <!-- Map Travel Menu Modal -->
      <div v-if="showMapMenu" class="modal-overlay" @click.self="showMapMenu = false">
        <div class="rpg-modal map-modal">
          <div class="modal-header">
            <h3>🗺️ World Map - Travel</h3>
            <button class="close-btn" @click="showMapMenu = false">X</button>
          </div>
          <div class="modal-body map-grid">
            <div class="map-card" v-for="m in mapList" :key="m.id"
                 :class="{ active: currentMapId === m.id }"
                 @click="travelToMap(m.id)">
              <div class="map-card-icon" :style="{ background: m.color + '22', borderColor: m.color }">{{ m.icon }}</div>
              <div class="map-card-info">
                <div class="map-card-name" :style="{ color: m.color }">{{ m.name }}</div>
                <div class="map-card-level">Lv. {{ m.level }}</div>
                <div class="map-card-desc">{{ m.desc }}</div>
              </div>
              <div v-if="currentMapId === m.id" class="map-card-badge">HERE</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Class Selection Modal -->
      <div v-if="showClassSelect" class="modal-overlay" @click.self="showClassSelect = false">
         <div class="rpg-modal">
            <div class="modal-header"><h3>Select Class</h3> <button class="close-btn" @click="showClassSelect=false">X</button></div>
            <div class="modal-body class-grid">
               <div class="class-category-label eclipse-label">⚡ Eclipse: Shattered Realm</div>
               <div class="class-card eclipse-class" v-for="cls in eclipseClasses" :key="cls.id" @click="selectClass(cls)">
                  <div class="class-icon">{{ cls.skills.SPACE.icon }}</div>
                  <h4>{{ cls.name }}</h4>
                  <p>{{ cls.role }}</p>
                  <div class="class-specs" v-if="cls.specializations">
                     <span v-for="spec in cls.specializations" :key="spec.id" class="spec-badge">{{ spec.icon }} {{ spec.name }}</span>
                  </div>
               </div>
               <div class="class-category-label mu-label">🏰 MU Online Classic</div>
               <div class="class-card" v-for="cls in muClasses" :key="cls.id" @click="selectClass(cls)">
                  <div class="class-icon">{{ cls.skills.SPACE.icon }}</div>
                  <h4>{{ cls.name }}</h4>
                  <p>{{ cls.role }}</p>
               </div>
            </div>
         </div>
      </div>

      <!-- Skills Panel Modal -->
      <div v-if="showSkills" class="modal-overlay" @click.self="showSkills = false">
         <div class="rpg-modal skills-modal large-modal">
            <div class="modal-header">
               <h3>⚔️ {{ currentClass.name }} Skills</h3>
               <button class="close-btn" @click="showSkills = false">X</button>
            </div>
            <div class="skills-panel-body">
               <div class="skills-hotbar-info">
                  <span class="hotbar-label">Hotbar:</span>
                  <span class="hotbar-slot" v-for="(sk, i) in hotbarSkills.slice(0, 15)" :key="i">{{ hotbarKeyLabels[i] }}: {{ sk ? sk.icon : '—' }}</span>
               </div>
               <div class="skills-grid">
                  <div class="skill-card" v-for="skill in currentClassSkills" :key="skill.id"
                       :class="{ equipped: isSkillEquipped(skill), locked: playerLevel < skill.lvl }"
                       @click="showSkillDetail(skill)">
                     <div class="skill-card-icon" :style="{ background: skill.color + '33', borderColor: skill.color }">{{ skill.icon }}</div>
                     <div class="skill-card-info">
                        <div class="skill-card-name">{{ skill.name }}</div>
                        <div class="skill-card-lvl">Lv.{{ skill.lvl || 1 }}</div>
                     </div>
                     <div class="skill-card-effect">{{ skill.effect }}</div>
                  </div>
               </div>
               <div v-if="selectedSkill" class="skill-detail-panel">
                  <div class="skill-detail-header">
                     <span class="skill-detail-icon" :style="{ color: selectedSkill.color }">{{ selectedSkill.icon }}</span>
                     <span class="skill-detail-name">{{ selectedSkill.name }}</span>
                     <span class="skill-detail-lvl">Lv.{{ selectedSkill.lvl || 1 }}</span>
                  </div>
                  <p class="skill-detail-desc">{{ selectedSkill.description }}</p>
                  <div class="skill-detail-stats">
                     <span v-if="selectedSkill.damage">⚔️ DMG: {{ selectedSkill.damage }}</span>
                     <span v-if="selectedSkill.cost">💧 Cost: {{ selectedSkill.cost }}</span>
                     <span v-if="selectedSkill.cooldown">⏱️ CD: {{ (selectedSkill.cooldown / 1000).toFixed(1) }}s</span>
                     <span v-if="selectedSkill.range">📏 Range: {{ selectedSkill.range }}</span>
                     <span v-if="selectedSkill.aoeRadius">💥 AOE: {{ selectedSkill.aoeRadius }}</span>
                     <span v-if="selectedSkill.healAmount">💚 Heal: {{ selectedSkill.healAmount }}</span>
                     <span v-if="selectedSkill.hits">🎯 Hits: {{ selectedSkill.hits }}</span>
                  </div>
                  <div class="skill-assign-btns">
                     <span class="assign-label">Assign to slot:</span>
                     <button v-for="(label, i) in hotbarKeyLabels" :key="i" @click="assignSkill(i, selectedSkill)" class="assign-slot-btn">{{ label }}</button>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <!-- Inventory / Bag -->
      <div v-if="showBag" class="modal-overlay" @click.self="showBag = false">
        <div class="rpg-modal bag-modal large-modal">
           <div class="modal-header">
             <h3>🎒 Inventory</h3>
             <div class="shop-gold">💰 {{ goldDisplay }} &nbsp; 💎 {{ gemsDisplay }}</div>
             <button class="close-btn" @click="showBag = false">X</button>
           </div>
           <div class="char-sheet-layout">
              <div class="equipment-panel">
                 <div class="equip-label">{{ currentClass?.name || 'HERO' }}</div>
                 <div class="hero-doll-container">
                    <!-- Helmet slot (top center) -->
                    <div class="doll-slot doll-slot-helmet" @click="unequip('helmet')" @mouseenter="previewEquip('helmet')">
                      <div v-if="equipment.helmet" class="item-icon" :style="{ borderColor: equipment.helmet.color }">{{ equipment.helmet.icon }}</div>
                      <div v-else class="slot-placeholder">🪖</div>
                      <div v-if="equipment.helmet" class="equip-level">+{{ equipment.helmet.level || 0 }}</div>
                      <div class="slot-label">Head</div>
                    </div>

                    <!-- Weapon slot (left) -->
                    <div class="doll-slot doll-slot-weapon" @click="unequip('weapon')" @mouseenter="previewEquip('weapon')">
                      <div v-if="equipment.weapon" class="item-icon" :style="{ borderColor: equipment.weapon.color }">{{ equipment.weapon.icon }}</div>
                      <div v-else class="slot-placeholder">⚔️</div>
                      <div v-if="equipment.weapon" class="equip-level">+{{ equipment.weapon.level || 0 }}</div>
                      <div class="slot-label">Weapon</div>
                    </div>

                    <!-- Hero Body (center) -->
                    <div class="hero-body">
                      <div class="hero-silhouette">
                        <div class="hero-head" :class="{ 'has-helmet': equipment.helmet }" :style="equipment.helmet ? { boxShadow: '0 0 12px ' + equipment.helmet.color } : {}">
                          <span class="hero-face">{{ currentClass?.name === 'Dark Wizard' ? '🧙' : currentClass?.name === 'Fairy Elf' ? '🧝' : currentClass?.name === 'Dark Lord' ? '👑' : '🦹' }}</span>
                        </div>
                        <div class="hero-torso" :class="{ 'has-armor': equipment.armor }" :style="equipment.armor ? { boxShadow: '0 0 14px ' + equipment.armor.color, borderColor: equipment.armor.color } : {}">
                          <span v-if="equipment.armor" class="torso-gear">{{ equipment.armor.icon }}</span>
                          <span v-else class="torso-default">👤</span>
                        </div>
                        <div class="hero-arms">
                          <div class="hero-arm left" :style="equipment.weapon ? { boxShadow: '0 0 10px ' + equipment.weapon.color } : {}"></div>
                          <div class="hero-arm right" :style="equipment.accessory ? { boxShadow: '0 0 10px ' + equipment.accessory.color } : {}"></div>
                        </div>
                        <div class="hero-legs">
                          <div class="hero-leg left" :style="equipment.boots ? { boxShadow: '0 0 10px ' + equipment.boots.color, borderColor: equipment.boots.color } : {}"></div>
                          <div class="hero-leg right" :style="equipment.boots ? { boxShadow: '0 0 10px ' + equipment.boots.color, borderColor: equipment.boots.color } : {}"></div>
                        </div>
                      </div>
                      <div class="hero-level-badge">Lv.{{ playerLevel }}</div>
                    </div>

                    <!-- Armor slot (right-top) -->
                    <div class="doll-slot doll-slot-armor" @click="unequip('armor')" @mouseenter="previewEquip('armor')">
                      <div v-if="equipment.armor" class="item-icon" :style="{ borderColor: equipment.armor.color }">{{ equipment.armor.icon }}</div>
                      <div v-else class="slot-placeholder">🛡️</div>
                      <div v-if="equipment.armor" class="equip-level">+{{ equipment.armor.level || 0 }}</div>
                      <div class="slot-label">Armor</div>
                    </div>

                    <!-- Boots slot (bottom-left) -->
                    <div class="doll-slot doll-slot-boots" @click="unequip('boots')" @mouseenter="previewEquip('boots')">
                      <div v-if="equipment.boots" class="item-icon" :style="{ borderColor: equipment.boots.color }">{{ equipment.boots.icon }}</div>
                      <div v-else class="slot-placeholder">👢</div>
                      <div v-if="equipment.boots" class="equip-level">+{{ equipment.boots.level || 0 }}</div>
                      <div class="slot-label">Boots</div>
                    </div>

                    <!-- Accessory slot (bottom-right) -->
                    <div class="doll-slot doll-slot-accessory" @click="unequip('accessory')" @mouseenter="previewEquip('accessory')">
                      <div v-if="equipment.accessory" class="item-icon" :style="{ borderColor: equipment.accessory.color }">{{ equipment.accessory.icon }}</div>
                      <div v-else class="slot-placeholder">💍</div>
                      <div class="slot-label">Ring</div>
                    </div>
                 </div>
                 <!-- Stats Summary -->
                 <div class="doll-stats">
                   <div class="doll-stat"><span>⚔️</span> {{ computedStats.attack || 0 }}</div>
                   <div class="doll-stat"><span>🛡️</span> {{ computedStats.defense || 0 }}</div>
                   <div class="doll-stat"><span>❤️</span> {{ computedStats.hp || 0 }}</div>
                   <div class="doll-stat"><span>💨</span> {{ computedStats.speed || 0 }}</div>
                 </div>
              </div>
              <div class="bag-panel">
                 <div class="bag-actions-bar">
                     <button class="bag-action-btn sell-all-btn" @click="sellAll">💰 Sell All</button>
                     <button class="bag-action-btn wear-best-btn" @click="wearBest">⚔️ Wear Best</button>
                  </div>
                  <div class="bag-grid">
                    <div class="item-slot" v-for="(item, i) in inventory" :key="i"
                         @click="bagItemClick(item, i)" @mouseenter="hoveredItem = item" @mouseleave="hoveredItem = null"
                         :class="{ stackable: item.count > 1, selected: pinnedItem === item }">
                       <div class="item-icon" :style="{ borderColor: item.color }">{{ item.icon }}</div>
                       <div v-if="item.count > 1" class="stack-count">{{ item.count }}</div>
                       <div v-if="item.level > 0" class="item-level-badge">+{{ item.level }}</div>
                    </div>
                     <div class="item-slot empty" v-for="i in Math.max(0, 30 - inventory.length)" :key="'e'+i"></div>
                 </div>
              </div>
              <div class="info-panel">
                  <div v-if="displayedItem" class="item-detail-card">
                     <h4 :style="{ color: displayedItem.color }">{{ displayedItem.name }}</h4>
                     <div class="item-type-badge" :style="{ background: displayedItem.color + '22', color: displayedItem.color }">
                       {{ displayedItem.rarity?.toUpperCase() }} {{ displayedItem.type?.toUpperCase() }}
                     </div>
                     <div v-if="displayedItem.level > 0" class="item-upgrade-level">Enhancement: +{{ displayedItem.level }}</div>
                     <div class="item-stat-list">
                       <div v-for="(val, stat) in displayedItem.stats" :key="stat" class="item-stat-row">
                         <span class="stat-label">{{ stat.toUpperCase() }}</span>
                         <span class="stat-value">+{{ val }}</span>
                       </div>
                     </div>
                     <div v-if="displayedItem.description" class="item-description">{{ displayedItem.description }}</div>
                     <div v-if="displayedItem.count > 1" class="item-stack-info">Stack: {{ displayedItem.count }} / 999</div>
                     <div class="item-actions">
                       <button v-if="isEquippable(displayedItem)" class="item-action-btn equip-btn" @click="equip(displayedItem, inventory.indexOf(displayedItem))">⚔️ Equip</button>
                       <button v-if="isUsable(displayedItem)" class="item-action-btn use-btn" @click="useItem(displayedItem, inventory.indexOf(displayedItem))">✨ Use</button>
                        <button v-if="isUsable(displayedItem)" class="item-action-btn assign-btn" @click="showSlotAssign = !showSlotAssign">📦 Assign to Slot</button>
                        <div v-if="showSlotAssign && isUsable(displayedItem)" class="slot-assign-row">
                          <button v-for="si in 3" :key="si" class="slot-assign-btn" @click="assignConsumableToSlot(displayedItem, inventory.indexOf(displayedItem), si - 1)"
                                  :style="{ borderColor: consumableSlots[si-1].color || '#555' }">
                            Slot {{ si }}: {{ consumableSlots[si-1].id ? consumableSlots[si-1].icon : '—' }}
                          </button>
                        </div>
                        <button class="item-action-btn sell-btn" @click="sellItem(inventory.indexOf(displayedItem))">💰 Sell ({{ Math.floor((displayedItem.price || 20) * 0.5) }}g)</button>

                        <button class="item-action-btn drop-btn" @click="dropItem(inventory.indexOf(displayedItem))">🗑️ Drop</button>

                     </div>
                  </div>
                  <div v-else class="item-detail-empty">Click an item to view details</div>
              </div>
           </div>
        </div>
      </div>

      <!-- ═══ SHOP MODAL ═══ -->
      <div v-if="showShop" class="modal-overlay" @click.self="showShop = false">
        <div class="rpg-modal shop-modal large-modal">
          <div class="modal-header">
            <h3>{{ shopNPC?.icon }} {{ shopNPC?.name || 'Shop' }}</h3>
            <div class="shop-gold">💰 {{ goldDisplay }}</div>
            <button class="close-btn" @click="showShop = false">X</button>
          </div>
          <div class="shop-tabs">
            <button v-for="cat in shopCategories" :key="cat" class="shop-tab" :class="{ active: shopActiveTab === cat }" @click="shopActiveTab = cat">{{ cat }}</button>
          </div>
          <div class="modal-body shop-grid">
            <div class="shop-item" v-for="item in filteredShopItems" :key="item.id" :class="{ 'cant-afford': item.price > playerGold }">
              <div class="shop-item-icon" :style="{ borderColor: item.color }">{{ item.icon }}</div>
              <div class="shop-item-info">
                <div class="shop-item-name" :style="{ color: item.color }">{{ item.name }}</div>
                <div class="shop-item-rarity">{{ item.rarity.toUpperCase() }}</div>
                <div class="shop-item-stats" v-if="item.stats">
                  <span v-for="(val, stat) in item.stats" :key="stat">+{{ val }} {{ stat }}</span>
                </div>
              </div>
              <div class="shop-item-buy">
                <div class="shop-item-price">💰 {{ item.price }}</div>
                <button class="buy-btn" @click="buyItem(item)" :disabled="item.price > playerGold">BUY</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══ NPC DIALOGUE MODAL ═══ -->
      <div v-if="showDialogue" class="modal-overlay" @click.self="closeDialogue">
        <div class="rpg-modal dialogue-modal">
          <div class="dialogue-portrait">
            <span class="portrait-icon">{{ dialogueNPC?.icon }}</span>
            <span class="portrait-name">{{ dialogueNPC?.name }}</span>
          </div>
          <div class="dialogue-body">
            <p class="dialogue-text">{{ currentDialogueLine }}</p>
          </div>
          <div class="dialogue-actions">
            <button v-if="dialogueIndex < dialogueLines.length - 1" class="dialogue-btn" @click="nextDialogue">Next ▸</button>
            <template v-else>
              <div v-if="questList.length" class="quest-list">
                <div v-for="q in questList" :key="q.id" class="quest-item" @click="acceptQuest(q)">
                  <span class="quest-icon">{{ q.icon }}</span>
                  <div class="quest-info">
                    <div class="quest-name">{{ q.name }}</div>
                    <div class="quest-desc">{{ q.description }}</div>
                    <div class="quest-reward">🎁 {{ q.reward.gold }}g + {{ q.reward.xp }} XP</div>
                  </div>
                </div>
              </div>
              <button class="dialogue-btn" @click="closeDialogue">Close</button>
            </template>
          </div>
        </div>
      </div>

      <!-- ═══ STORAGE MODAL ═══ -->
      <div v-if="showStorage" class="modal-overlay" @click.self="showStorage = false">
        <div class="rpg-modal storage-modal large-modal">
          <div class="modal-header">
            <h3>📦 Storage</h3>
            <button class="close-btn" @click="showStorage = false">X</button>
          </div>
          <div class="storage-layout">
            <div class="storage-panel">
              <div class="storage-label">🎒 Inventory</div>
              <div class="storage-grid">
                <div class="storage-slot" v-for="(item, i) in inventory" :key="'inv'+i" @click="storeItem(i)">
                  <div class="item-icon" :style="{ borderColor: item.color }">{{ item.icon }}</div>
                </div>
                <div class="storage-slot empty" v-for="i in Math.max(0, 20 - inventory.length)" :key="'ie'+i"></div>
              </div>
            </div>
            <div class="storage-arrow">⇄</div>
            <div class="storage-panel">
              <div class="storage-label">📦 Storage ({{ storageItems.length }}/30)</div>
              <div class="storage-grid">
                <div class="storage-slot" v-for="(item, i) in storageItems" :key="'st'+i" @click="retrieveItem(i)">
                  <div class="item-icon" :style="{ borderColor: item.color }">{{ item.icon }}</div>
                </div>
                <div class="storage-slot empty" v-for="i in Math.max(0, 30 - storageItems.length)" :key="'se'+i"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══ SUMMON / GACHA MODAL ═══ -->
      <div v-if="showSummon" class="modal-overlay" @click.self="closeSummon">
        <div class="rpg-modal summon-modal large-modal">
          <div class="modal-header">
            <h3>🌳 Tree of Wishes</h3>
            <div class="summon-gems">💎 {{ gemsDisplay }}</div>
            <button class="close-btn" @click="closeSummon">X</button>
          </div>
          <div class="summon-banner-tabs">
            <button v-for="b in summonBannerList" :key="b.id" class="banner-tab" :class="{ active: activeBannerId === b.id }" :style="{ borderColor: b.color }" @click="activeBannerId = b.id">
              {{ b.name }}
            </button>
          </div>
          <div v-if="activeBanner" class="summon-banner-display" :style="{ borderColor: activeBanner.color }">
            <div class="banner-featured">{{ activeBanner.featured }}</div>
            <div class="banner-desc">{{ activeBanner.desc }}</div>
            <div class="pity-info">Pity: {{ pityCounter }} / 50</div>
          </div>
          <!-- Pull results -->
          <div v-if="summonResults.length" class="summon-results">
            <div v-for="(item, i) in summonResults" :key="i" class="summon-result-card" :class="item.rarity">
              <div class="result-icon" :style="{ borderColor: item.color }">{{ item.icon }}</div>
              <div class="result-name" :style="{ color: item.color }">{{ item.name }}</div>
              <div class="result-rarity">{{ item.rarity?.toUpperCase() }}</div>
            </div>
          </div>
          <div class="summon-actions">
            <button class="summon-btn single" @click="doSummon(1)" :disabled="playerGems < 100">Summon x1 (💎100)</button>
            <button class="summon-btn multi" @click="doSummon(10)" :disabled="playerGems < 900">Summon x10 (💎900)</button>
          </div>
        </div>
      </div>

      <!-- ═══ TEMPLE OF DESCENDANTS MODAL ═══ -->
      <div v-if="showTemple" class="modal-overlay" @click.self="closeTemple">
        <div class="rpg-modal temple-modal large-modal">
          <div class="modal-header">
            <h3>🏛️ Temple of Descendants</h3>
            <div class="summon-gems">💎 {{ gemsDisplay }}</div>
            <button class="close-btn" @click="closeTemple">X</button>
          </div>
          <div class="temple-intro">
            <p>Your ancestors send blessings from beyond. Offer gems to receive their gifts.</p>
          </div>
          <!-- Results -->
          <div v-if="templeResults.length" class="summon-results">
            <div v-for="(item, i) in templeResults" :key="i" class="summon-result-card" :class="item.rarity">
              <div class="result-icon" :style="{ borderColor: item.color }">{{ item.icon }}</div>
              <div class="result-name" :style="{ color: item.color }">{{ item.name }}</div>
              <div class="result-category">{{ item.category?.toUpperCase() }}</div>
              <div class="result-rarity">{{ item.rarity?.toUpperCase() }}</div>
              <div class="result-desc" style="font-size:10px;opacity:0.7">{{ item.description }}</div>
            </div>
          </div>
          <div class="summon-actions">
            <button class="summon-btn single" @click="claimTempleReward(1)" :disabled="playerGems < 200">Claim x1 (💎200)</button>
            <button class="summon-btn multi" @click="claimTempleReward(5)" :disabled="playerGems < 900">Claim x5 (💎900)</button>
          </div>
        </div>
      </div>

      <!-- ═══ FARM CROP SELECTION ═══ -->
      <div v-if="showFarmCropMenu" class="modal-overlay" @click.self="closeFarmMenus">
        <div class="rpg-modal farm-modal">
          <div class="modal-header">
            <h3>🌱 Plant a Crop</h3>
            <div class="farm-gold">💰 {{ farmGold.toLocaleString() }}</div>
            <button class="close-btn" @click="closeFarmMenus">X</button>
          </div>
          <div class="farm-grid">
            <div v-for="crop in farmCropList" :key="crop.id"
                 class="farm-card" :class="{ disabled: farmGold < crop.cost }"
                 @click="farmGold >= crop.cost && farmSelectCrop(crop.id)">
              <div class="farm-icon">{{ crop.icon }}</div>
              <div class="farm-name">{{ crop.name }}</div>
              <div class="farm-cost">💰 {{ crop.cost }}</div>
              <div class="farm-info">⏱️ {{ Math.round(crop.growTime / 1000) }}s</div>
              <div class="farm-value">💎 {{ crop.sellValue }}</div>
            </div>
          </div>
          <div class="farm-switch-row">
            <button class="farm-switch-btn" @click="switchToDefenseMenu">🛡️ Switch to Defense Plants</button>
          </div>
        </div>
      </div>

      <!-- ═══ FARM DEFENSE PLANT SELECTION ═══ -->
      <div v-if="showFarmPlantMenu" class="modal-overlay" @click.self="closeFarmMenus">
        <div class="rpg-modal farm-modal large-modal">
          <div class="modal-header">
            <h3>🛡️ Place Defense</h3>
            <div class="farm-gold">💰 {{ farmGold.toLocaleString() }}</div>
            <button class="close-btn" @click="closeFarmMenus">X</button>
          </div>
          <div class="farm-grid">
            <div v-for="plant in farmPlantList" :key="plant.id"
                 class="farm-card defense-card" :class="{ disabled: farmGold < plant.cost }"
                 @click="farmGold >= plant.cost && farmSelectPlant(plant.id)">
              <div class="farm-icon">{{ plant.icon }}</div>
              <div class="farm-name">{{ plant.name }}</div>
              <div class="farm-cost">💰 {{ plant.cost }}</div>
              <div class="farm-desc">{{ plant.desc }}</div>
              <div class="farm-stats">
                <span v-if="plant.damage">⚔️{{ plant.damage }}</span>
                <span v-if="plant.hp">❤️{{ plant.hp }}</span>
                <span v-if="plant.range">📏{{ plant.range }} tiles</span>
                <span v-if="plant.attackSpeed">⏱️{{ (plant.attackSpeed / 1000).toFixed(1) }}s</span>
              </div>
              <div v-if="plant.special" class="farm-special">✨ {{ plant.special }}</div>
            </div>
          </div>
          <div class="farm-switch-row">
            <button class="farm-switch-btn" @click="openUpgradeAllModal">⬆️ Upgrade all to max</button>
            <button class="farm-switch-btn" @click="switchToCropMenu">🌱 Switch to Crops</button>
          </div>
        </div>
      </div>

      <!-- ═══ UPGRADE ALL PLANTS MODAL ═══ -->
      <div v-if="showUpgradeAllModal" class="modal-overlay" @click.self="showUpgradeAllModal = false">
        <div class="rpg-modal farm-modal">
          <div class="modal-header">
            <h3>⬆️ Upgrade all to max</h3>
            <button class="close-btn" @click="showUpgradeAllModal = false">X</button>
          </div>
          <div class="upgrade-all-body">
            <p class="upgrade-all-intro">Plants to upgrade (by current gold):</p>
            <ul class="upgrade-all-list">
              <li v-for="item in upgradeAllPreview.list" :key="item.slotIndex">
                {{ item.icon }} {{ item.plantName }} Lv.{{ item.currentLevel }} → {{ item.targetLevel }} — {{ item.cost.toLocaleString() }}💰
              </li>
            </ul>
            <p v-if="upgradeAllPreview.list.length === 0" class="upgrade-all-empty">No plants can be fully upgraded with current gold.</p>
            <div v-else class="upgrade-all-total">Total: <strong>{{ upgradeAllPreview.totalCost.toLocaleString() }}💰</strong></div>
            <div class="upgrade-all-actions">
              <button class="action-btn upgrade-btn" :class="{ disabled: farmGold < upgradeAllPreview.totalCost }"
                      @click="farmGold >= upgradeAllPreview.totalCost && confirmUpgradeAll()">
                Accept
              </button>
              <button class="action-btn remove-btn" @click="showUpgradeAllModal = false">Cancel</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══ PLANT INFO POPUP ═══ -->
      <div v-if="showPlantInfo && plantInfoData" class="modal-overlay" @click.self="closePlantInfo">
        <div class="rpg-modal farm-modal plant-info-modal" :style="{ borderColor: plantInfoData.plant.levelColor }">
          <div class="modal-header">
            <h3>{{ plantInfoData.plant.icon }} {{ plantInfoData.plant.name }}</h3>
            <div class="plant-level-badge" :style="{ background: plantInfoData.plant.levelColor }">Lv.{{ plantInfoData.plant.level }}</div>
            <button class="close-btn" @click="closePlantInfo">X</button>
          </div>
          <div class="plant-info-body">
            <div class="plant-info-stats">
              <div v-if="plantInfoData.plant.damage" class="stat-row">⚔️ Damage: {{ plantInfoData.plant.damage }}</div>
              <div class="stat-row">❤️ HP: {{ plantInfoData.plant.currentHp }} / {{ plantInfoData.plant.maxHp }}</div>
              <div v-if="plantInfoData.plant.range" class="stat-row">📏 Range: {{ plantInfoData.plant.range }} tiles</div>
              <div v-if="plantInfoData.plant.attackSpeed" class="stat-row">⏱️ Attack Speed: {{ (plantInfoData.plant.attackSpeed / 1000).toFixed(1) }}s</div>
              <div v-if="plantInfoData.plant.special" class="stat-row special">✨ {{ plantInfoData.plant.special }}</div>
              <div class="stat-row">🏷️ Type: {{ plantInfoData.plant.type }}</div>
              <div class="stat-row desc">{{ plantInfoData.plant.desc }}</div>
            </div>
            <div class="plant-info-actions">
              <button v-if="plantInfoData.canUpgrade" class="action-btn upgrade-btn"
                      :class="{ disabled: farmGold < plantInfoData.upgradeCost }"
                      @click="farmGold >= plantInfoData.upgradeCost && upgradePlant()">
                ⬆️ Upgrade ({{ plantInfoData.upgradeCost }}💰)
              </button>
              <button v-else class="action-btn max-btn" disabled>⚡ MAX LEVEL</button>
              <button class="action-btn merge-btn" @click="startMerge">🔀 Merge</button>
              <button class="action-btn remove-btn" @click="removePlant">🗑️ Remove (50% refund)</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══ FARM NOTIFICATION BANNER ═══ -->
      <div v-if="farmMessage" class="farm-notification">
        {{ farmMessage }}
      </div>

      <!-- ═══ FARM JOIN REPORT ═══ -->
      <div v-if="showFarmJoinReport && farmJoinReport" class="modal-overlay" @click.self="dismissFarmJoinReport">
        <div class="rpg-modal farm-modal farm-join-report-modal">
          <div class="modal-header">
            <h3>🌾 Farm Status Report</h3>
            <button class="close-btn" @click="dismissFarmJoinReport">X</button>
          </div>
          <div class="farm-report-body">
            <div class="report-row">📅 Day: <strong>{{ farmJoinReport.totalDays }}</strong></div>
            <div class="report-row">⏰ Hours Played: <strong>{{ farmJoinReport.hoursPlayed }}h</strong></div>
            <div class="report-row">🛡️ Waves Defended: <strong class="text-green">{{ farmJoinReport.totalWavesDefended }}</strong></div>
            <div class="report-row">💀 Waves Lost: <strong class="text-red">{{ farmJoinReport.totalWavesLost }}</strong></div>
            <div v-if="farmJoinReport.currentStreak > 0" class="report-row warning">
              ⚠️ Loss Streak: <strong>{{ farmJoinReport.currentStreak }} / 10</strong>
              <span class="streak-warn">(10 losses = all gold & crops wiped!)</span>
            </div>
            <template v-if="hasOfflineActivity">
              <div class="report-divider">While you were away...</div>
              <div class="report-row">🌙 Days Passed: {{ farmJoinReport.offlineReport.offlineDays }}</div>
              <div class="report-row">✅ Waves Won: <span class="text-green">{{ farmJoinReport.offlineReport.wavesWon }}</span></div>
              <div class="report-row">❌ Waves Lost: <span class="text-red">{{ farmJoinReport.offlineReport.wavesLost }}</span></div>
              <div v-if="farmJoinReport.offlineReport.plantsLost > 0" class="report-row">
                🌱 Plants Destroyed: <span class="text-red">{{ farmJoinReport.offlineReport.plantsLost }}</span>
              </div>
              <div v-if="farmJoinReport.offlineReport.penaltyTriggered" class="report-penalty">
                💥 10-LOSS PENALTY TRIGGERED! All gold and crops have been destroyed!
              </div>
            </template>
          </div>
          <div class="report-footer">
            <button class="action-btn upgrade-btn" @click="dismissFarmJoinReport">Continue</button>
          </div>
        </div>
      </div>

      <!-- ═══ CRAFT MODAL ═══ -->
      <div v-if="showCraft" class="modal-overlay" @click.self="showCraft = false">
        <div class="rpg-modal craft-modal large-modal">
          <div class="modal-header">
            <h3>🔨 {{ craftNPC?.name || 'Blacksmith' }}</h3>
            <button class="close-btn" @click="showCraft = false">X</button>
          </div>
          <div class="craft-layout">
            <div class="craft-recipe-panel">
              <div class="craft-recipe" v-for="recipe in craftRecipes" :key="recipe.id" :class="{ active: selectedRecipe?.id === recipe.id }" @click="selectRecipe(recipe)">
                <span class="recipe-icon">{{ recipe.icon }}</span>
                <div class="recipe-info">
                  <div class="recipe-name">{{ recipe.name }}</div>
                  <div class="recipe-desc">{{ recipe.desc }}</div>
                </div>
              </div>
            </div>
            <div class="craft-work-area">
              <div v-if="selectedRecipe" class="craft-slots">
                <template v-if="selectedRecipe.id === 'combine_3'">
                  <div class="craft-slot-row">
                    <div class="craft-slot" v-for="i in 3" :key="i" @click="selectCraftItem(i-1)">
                      <div v-if="craftSlots[i-1]" class="item-icon" :style="{ borderColor: craftSlots[i-1].color }">{{ craftSlots[i-1].icon }}</div>
                      <div v-else class="slot-placeholder">+</div>
                    </div>
                  </div>
                  <div class="craft-arrow">⬇️</div>
                  <div class="craft-result" v-if="craftResult">
                    <div class="item-icon" :style="{ borderColor: craftResult.color }">{{ craftResult.icon }}</div>
                    <span :style="{ color: craftResult.color }">{{ craftResult.name }}</span>
                  </div>
                </template>
                <template v-else>
                  <!-- Upgrade recipe -->
                  <div class="craft-slot-row">
                    <div class="craft-slot" @click="selectCraftItem(0)">
                      <div v-if="craftSlots[0]" class="item-icon" :style="{ borderColor: craftSlots[0].color }">
                        {{ craftSlots[0].icon }}
                        <div v-if="craftSlots[0].level >= 0" class="item-level-badge">+{{ craftSlots[0].level || 0 }}</div>
                      </div>
                      <div v-else class="slot-placeholder">Gear</div>
                    </div>
                    <span class="craft-plus">+</span>
                    <div class="craft-slot scroll-slot">
                      <div class="slot-placeholder">{{ selectedRecipe.icon }}</div>
                    </div>
                  </div>
                  <div v-if="craftSlots[0]" class="craft-chance">
                    Success Rate: {{ upgradeSuccessRate }}%
                    <div v-if="(craftSlots[0].level || 0) >= 6 && selectedRecipe.id !== 'luck_upgrade'" class="craft-warning">⚠️ Failure will DESTROY the item!</div>
                  </div>
                  <div v-if="craftSlots[0]" class="craft-preview">
                    <div class="preview-label">If successful:</div>
                    <div class="preview-stats" v-if="craftSlots[0].stats">
                      <span v-for="(val, stat) in craftSlots[0].stats" :key="stat" class="preview-stat">
                        {{ stat }}: {{ val }} → <span class="stat-up">{{ Math.floor(val * 1.08) + 1 }}</span>
                      </span>
                    </div>
                  </div>
                </template>
                <button class="craft-go-btn" @click="doCraft" :disabled="!canCraft">🔨 Craft</button>
                <div v-if="craftMessage" class="craft-message" :class="craftMessageType">{{ craftMessage }}</div>
              </div>
              <div v-else class="craft-empty">Select a recipe to begin</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, inject, nextTick, computed, watch } from 'vue'
import { GameEngine } from './gameEngine'
import { TILE_SIZE, TILES } from './tiles'
import { maps, MAP_LIST } from './data/maps'
import { CLASSES } from './data/classes'
import { ENEMIES } from './data/enemies'
import { BOSSES } from './data/bosses'
import { SHOP_ITEMS, SUMMON_BANNERS, summonFromBanner, CRAFT_RECIPES, RARITY_ORDER, RARITY_COLORS } from './data/npcs'
import { CROP_LIST, DEFENSE_PLANT_LIST } from './data/farmData'
import { addToInventory, removeFromInventory, upgradeItem, getStackKey, STACKABLE_TYPES, UPGRADE_RATES, generateConsumableDrop } from './data/items'

// Map editor tile IDs → enemy/boss type so objects-layer enemies become live entities with AI
const TILE_TO_ENEMY = {
  [TILES.CREEP]: ENEMIES.SPIDER,
  [TILES.BOSS]: BOSSES.GOLDEN_BUDGE_DRAGON,
  [TILES.SPIDER]: ENEMIES.SPIDER,
  [TILES.GOBLIN]: ENEMIES.GOBLIN,
  [TILES.SKELETON]: ENEMIES.SKELETON,
  [TILES.DARK_WIZARD]: ENEMIES.LICH,
  [TILES.ELF]: ENEMIES.ELF_SCOUT,
  [TILES.GOLEM]: ENEMIES.BUDGE_DRAGON,
  [TILES.DRAGON]: ENEMIES.BUDGE_DRAGON,
  [TILES.DEMON]: ENEMIES.LICH,
  [TILES.ORC]: ENEMIES.BULL_FIGHTER,
  [TILES.WOLF]: ENEMIES.HOUND,
  [TILES.BAT]: ENEMIES.LARVA,
  [TILES.SERPENT]: ENEMIES.CHAIN_SCORPION,
  [TILES.UNDEAD_KNIGHT]: ENEMIES.SKELETON,
  [TILES.SHADOW]: ENEMIES.SHADOW_PHANTOM,
  [TILES.ELEMENTAL]: ENEMIES.NEREID,
}

// Merge any maps created in the Map Editor (Manage Settings) into the engine
const loadEditorMaps = () => {
  try {
    const raw = localStorage.getItem('rpg_map_editor_maps')
    if (!raw) return
    const data = JSON.parse(raw)
    if (!data.maps || !data.maps.length) return
    data.maps.forEach(editorMap => {
      const gid = editorMap.gameId
      if (!gid || gid < 10) return // skip invalid / built-in range
      const ground = Array.from(editorMap.layers?.ground || [], (v) => Number(v) || 0)
      const objects = Array.from(editorMap.layers?.objects || [], (v) => Number(v) || 0)
      const width = editorMap.width
      const height = editorMap.height
      const enemySpawns = []
      const botSpawns = []

      // Convert object-layer enemy/bot tiles into spawn lists so they get real AI (not just static images)
      for (let i = 0; i < objects.length; i++) {
        const raw = objects[i]
        const tileId = Number(raw)
        if (!tileId || tileId === TILES.EMPTY) continue
        const x = i % width
        const y = Math.floor(i / width)
        const enemyType = TILE_TO_ENEMY[tileId]
        if (enemyType) {
          enemySpawns.push({ x, y, type: enemyType })
          objects[i] = TILES.EMPTY // so we don't draw a static tile under the entity
        } else if (tileId === TILES.BOT) {
          botSpawns.push({ x, y })
          objects[i] = TILES.EMPTY
        }
      }

      maps[gid] = {
        id: gid,
        name: editorMap.name,
        width,
        height,
        startX: editorMap.startX || Math.floor(width / 2),
        startY: editorMap.startY || Math.floor(height / 2),
        layers: { ground, objects },
        teleports: [],
        npcs: [],
        enemies: [],
        enemySpawns,
        botSpawns,
      }
      if (enemySpawns.length > 0) {
        console.log('[MapEditor] Map', gid, editorMap.name, '→', enemySpawns.length, 'enemy spawns')
      }
      if (!MAP_LIST.find(m => m.id === gid)) {
        MAP_LIST.push({ id: gid, name: editorMap.name, level: 'Custom', desc: 'Custom map from Map Editor', color: '#f6a901', icon: '🗺️', custom: true })
      } else {
        const existing = MAP_LIST.find(m => m.id === gid)
        if (existing) existing.name = editorMap.name
      }
    })
  } catch (e) {
    console.warn('[MapEditor] Failed to load editor maps:', e)
  }
}
loadEditorMaps()

const userData = inject('userData', {})
const gameCanvas = ref(null)
const gameContainer = ref(null)
const engine = ref(null)

const showBag = ref(false)
const showClassSelect = ref(false)
const showSkills = ref(false)
const showMapMenu = ref(false)
const showAutoSettings = ref(false)
const selectedSkill = ref(null)
const playerLevel = ref(50)
const currentMapId = ref(1)
const mapList = MAP_LIST
const availableClasses = Object.values(CLASSES)

// Separate MU Online and Eclipse classes
const ECLIPSE_IDS = ['vanguard', 'nightreaver', 'arcanist', 'soul_engineer'];
const eclipseClasses = computed(() => availableClasses.filter(c => ECLIPSE_IDS.includes(c.id)))
const muClasses = computed(() => availableClasses.filter(c => !ECLIPSE_IDS.includes(c.id)))

// State
const inventory = ref([])
const equipment = ref({ weapon: null, helmet: null, armor: null, boots: null, accessory: null })
const lastPickedItem = ref(null)
const pinnedItem = ref(null)
const hoveredItem = ref(null)
const displayedItem = computed(() => pinnedItem.value || hoveredItem.value)
const currentClass = ref(CLASSES.DARK_KNIGHT)

const currentHp = ref(100)
const currentResource = ref(0)
const currentStamina = ref(100)
const autoModeActive = ref(false)
const consumableSlots = ref([
  { id: '', name: '', icon: '', count: 0, cooldown: 0, color: '#333' },
  { id: '', name: '', icon: '', count: 0, cooldown: 0, color: '#333' },
  { id: '', name: '', icon: '', count: 0, cooldown: 0, color: '#333' },
])
const hotbarCooldowns = ref(new Array(15).fill(0))
const hotbarKeyLabels = ['1','2','3','4','5','6','7','8','9','0','Q','W','E','R','T']

// Auto-mode settings
const autoEnabledSkills = ref([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]) // all enabled by default
const autoHpThreshold = ref(40)
const autoMpThreshold = ref(30)
const autoPickup = ref(false)
const autoMove = ref(true)
const groundItemTooltip = ref(null) // { item, x, y, groundItem }
const showSlotAssign = ref(false)

// === NEW SYSTEM REFS ===
const showShop = ref(false)
const showDialogue = ref(false)
const showStorage = ref(false)
const showSummon = ref(false)
const showCraft = ref(false)
const showTemple = ref(false)

// Farm & Defense
const showFarmCropMenu = ref(false)
const showFarmPlantMenu = ref(false)
const showPlantInfo = ref(false)
const plantInfoData = ref(null)
const farmCropList = ref([])
const farmPlantList = ref([])
const farmSlotIndex = ref(-1)
const farmGold = ref(0)
const farmMessage = ref('')
const farmMessageTimer = ref(null)
const showFarmJoinReport = ref(false)
const farmJoinReport = ref(null)
const hasOfflineActivity = computed(() => {
  const r = farmJoinReport.value?.offlineReport
  if (!r) return false
  return (r.offlineDays || 0) > 0 || (r.wavesWon || 0) > 0 || (r.wavesLost || 0) > 0
})
const showUpgradeAllModal = ref(false)
const upgradeAllPreview = ref({ list: [], totalCost: 0 })

// Shop
const shopNPC = ref(null)
const shopItems = ref([])
const shopActiveTab = ref('all')
const playerGold = ref(500)
const playerGems = ref(100)
const goldDisplay = computed(() => playerGold.value.toLocaleString())
const gemsDisplay = computed(() => playerGems.value.toLocaleString())
const shopCategories = computed(() => {
  const types = new Set(shopItems.value.map(i => i.type));
  return ['all', ...types];
})
const filteredShopItems = computed(() => {
  if (shopActiveTab.value === 'all') return shopItems.value;
  return shopItems.value.filter(i => i.type === shopActiveTab.value);
})

// NPC Dialogue
const dialogueNPC = ref(null)
const dialogueLines = ref([])
const dialogueIndex = ref(0)
const currentDialogueLine = computed(() => dialogueLines.value[dialogueIndex.value] || '')
const questList = ref([])

// Storage
const storageItems = ref([])

// Summon / Gacha
const summonBanners = ref({})
const activeBannerId = ref('gear')
const summonResults = ref([])
const pityCounter = ref(0)
const summonBannerList = computed(() => Object.values(summonBanners.value))
const activeBanner = computed(() => summonBanners.value[activeBannerId.value])

// Craft
const craftNPC = ref(null)
const craftRecipes = CRAFT_RECIPES
const selectedRecipe = ref(null)
const craftSlots = ref([null, null, null])
const craftResult = ref(null)
const craftMessage = ref('')
const craftMessageType = ref('')

// Nearby NPC (for mobile interact button)
const nearbyNPC = ref(false)

// Mobile detection and joystick
const isMobile = ref(false)
const joystickBase = ref(null)
const joystickKnobX = ref(0)
const joystickKnobY = ref(0)
const joystickActive = ref(false)
const joystickKnobStyle = computed(() => ({
  transform: `translate(${joystickKnobX.value}px, ${joystickKnobY.value}px)`
}))

const hasStamina = computed(() => (currentClass.value.stats.maxStamina || 0) > 0)
const staminaPercent = computed(() => {
  const max = currentClass.value.stats.maxStamina || 100;
  return (currentStamina.value / max) * 100;
})

// Computed: get hotbar from engine
const hotbarSkills = computed(() => {
  if (engine.value && engine.value.hotbar) return engine.value.hotbar;
  return [];
})

// Persist Inventory & Equip & Buff Slots
const loadInv = () => {
   const d = localStorage.getItem('eclipse_inv');
   if(d) {
      const j = JSON.parse(d);
      inventory.value = (j.inv || []).map(i => ({ ...i, count: i.count || 1, level: i.level || 0 }));
      equipment.value = j.equip || { weapon: null, helmet: null, armor: null, boots: null, accessory: null };
      // Restore buff slot assignments
      if (j.buffSlots && Array.isArray(j.buffSlots)) {
         j.buffSlots.forEach((saved, i) => {
            if (saved && saved.id && i < 3) {
               consumableSlots.value[i] = { ...saved, cooldown: 0 };
            }
         });
      }
   }
}
const saveInv = () => {
   localStorage.setItem('eclipse_inv', JSON.stringify({
      inv: inventory.value,
      equip: equipment.value,
      buffSlots: consumableSlots.value
   }));
}

// Computed
const totalStats = computed(() => {
   const s = { ...currentClass.value.stats };
   Object.values(equipment.value).forEach(item => {
      if (item && item.stats) {
         if (item.stats.attack) s.attack += item.stats.attack;
         if (item.stats.defense) s.defense += item.stats.defense;
         if (item.stats.hp) s.maxHp += item.stats.hp;
         if (item.stats.speed) s.speed = (s.speed || 0) + item.stats.speed;
         if (item.stats.mana) s.maxMana = (s.maxMana || 0) + item.stats.mana;
      }
   });
   return s;
});

const hpPercent = computed(() => (currentHp.value / totalStats.value.maxHp) * 100)

function formatShortNum(n) {
  if (n == null || isNaN(n)) return '0'
  const num = Number(n)
  if (num >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, '') + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'k'
  return String(Math.floor(num))
}

const computedStats = computed(() => ({
  attack: totalStats.value.attack || 0,
  defense: totalStats.value.defense || 0,
  hp: totalStats.value.maxHp || 0,
  speed: totalStats.value.speed || 0,
}))
const resourceName = computed(() => currentClass.value.stats.maxMana > 0 ? 'MANA' : 'RAGE')
const resourceColorClass = computed(() => currentClass.value.stats.maxMana > 0 ? 'mana-bar' : 'rage-bar')
const resourcePercent = computed(() => {
   const max = currentClass.value.stats.maxMana || currentClass.value.stats.maxRage || 100;
   return (currentResource.value / max) * 100;
})

const toggleBag = () => { showBag.value = !showBag.value; saveInv(); }
const toggleClasses = () => showClassSelect.value = !showClassSelect.value
const toggleSkills = () => { showSkills.value = !showSkills.value; selectedSkill.value = null; }
const toggleAutoMode = () => {
   if (engine.value) {
      engine.value.toggleAutoMode();
      autoModeActive.value = engine.value.autoMode;
      saveAutoSettings();
   }
}
const useConsumable = (slotIndex) => {
   if (engine.value) engine.value.useConsumable(slotIndex);
}

// Assign a consumable from inventory to a buff slot (item STAYS in bag)
const assignConsumableToSlot = (item, invIndex, slotIndex) => {
  if (!engine.value || !item || item.type !== 'consumable') return;

  // Map inventory item effect to engine consumable format
  const effectMap = {
    'heal': { effect: 'heal', cd: 3000 },
    'mana': { effect: 'mana', cd: 3000 },
    'full_heal': { effect: 'heal', cd: 5000 },
    'buff_atk': { effect: 'buff_atk', cd: 20000 },
    'buff_def': { effect: 'buff_def', cd: 20000 },
    'buff_speed': { effect: 'buff_speed', cd: 15000 },
  };
  const mapped = effectMap[item.effect] || { effect: item.effect, cd: 3000 };

  // Update the engine consumable slot
  const slot = engine.value.consumables[slotIndex];
  slot.id = item.id;
  slot.name = item.name;
  slot.icon = item.icon;
  slot.count = item.count || 1;
  slot.maxCount = 99;
  slot.effect = mapped.effect;
  slot.amount = item.value || 50;
  slot.duration = (item.duration || 30) * 1000;
  slot.cooldown = 0;
  slot.cd = mapped.cd;
  slot.color = item.color || '#ccc';

  // Update Vue ref
  consumableSlots.value[slotIndex] = {
    id: slot.id, name: slot.name, icon: slot.icon,
    count: slot.count, cooldown: 0, color: slot.color,
    effect: mapped.effect
  };

  // Item stays in inventory — no removal
  showSlotAssign.value = false;
  saveInv();

  engine.value.addFloatText(engine.value.player.pixelX, engine.value.player.pixelY,
    `${item.icon} ${item.name} \u2192 Slot ${slotIndex + 1}`, item.color || '#ffd700');
}

// Clear a consumable slot (right-click) — item is still in bag, just unlink
const clearConsumableSlot = (slotIndex) => {
  if (!engine.value) return;
  const slot = engine.value.consumables[slotIndex];
  if (!slot.id) return;

  // Clear the engine slot (item stays in inventory)
  slot.id = ''; slot.name = ''; slot.icon = '';
  slot.count = 0; slot.effect = ''; slot.amount = 0; slot.cooldown = 0;

  consumableSlots.value[slotIndex] = {
    id: '', name: '', icon: '', count: 0, cooldown: 0, color: '#333'
  };
  saveInv();
}

// Get set of item IDs assigned to buff slots
const getBuffSlotItemIds = () => {
  const ids = new Set();
  consumableSlots.value.forEach(s => { if (s.id) ids.add(s.id); });
  return ids;
}

// Sync buff slot counts FROM inventory (called in game loop)
const syncBuffSlotCounts = () => {
  if (!engine.value) return;
  engine.value.consumables.forEach((slot, i) => {
    if (!slot.id) return;
    // Find matching item in inventory by id
    const invItem = inventory.value.find(it => it.id === slot.id);
    const newCount = invItem ? (invItem.count || 1) : 0;
    slot.count = newCount;
    if (consumableSlots.value[i]) {
      consumableSlots.value[i].count = newCount;
    }
    // Auto-clear if count reaches 0
    if (newCount <= 0) {
      slot.id = ''; slot.name = ''; slot.icon = '';
      slot.effect = ''; slot.amount = 0; slot.cooldown = 0;
      consumableSlots.value[i] = { id: '', name: '', icon: '', count: 0, cooldown: 0, color: '#333' };
    }
  });
}

const currentMapMeta = computed(() => MAP_LIST.find(m => m.id === currentMapId.value) || MAP_LIST[0])

const travelToMap = (mapId) => {
  if (mapId === currentMapId.value) { showMapMenu.value = false; return; }
  currentMapId.value = mapId;
  const meta = MAP_LIST.find(m => m.id === mapId);
  // Find a safe spawn near center or use map default
  const mapData = maps[mapId];
  const cx = mapData ? Math.floor(mapData.width / 2) : 10;
  const cy = mapData ? Math.floor(mapData.height / 2) : 10;
  loadMap(mapId, cx, cy);
  showMapMenu.value = false;
}

// Skill panel helpers
const currentClassSkills = computed(() => currentClass.value.allSkills || [])
const isSkillEquipped = (skill) => {
   if (!engine.value || !engine.value.hotbar) return false;
   return engine.value.hotbar.some(s => s && s.id === skill.id);
}
const showSkillDetail = (skill) => { selectedSkill.value = skill; }
const assignSkill = (slotIndex, skill) => {
   if (engine.value) {
      engine.value.setHotbarSkill(slotIndex, { ...skill });
   }
}

const selectClass = (cls) => {
   currentClass.value = cls;
   showClassSelect.value = false;
   if(engine.value) {
      engine.value.currentClass = cls;
      engine.value.player.stats = { ...cls.stats }; 
      engine.value.player.stats.hp = cls.stats.maxHp;
      engine.value.player.stats.mana = cls.stats.maxMana;
      // Reset Eclipse combat stats
      engine.value.player.stamina = cls.stats.maxStamina || 100;
      engine.value.player.maxStamina = cls.stats.maxStamina || 100;
      engine.value.player.moveSpeed = cls.stats.speed || 150;
      engine.value.initHotbar();
      // Re-apply gear bonuses to engine after class reset
      updateEngineStats();
      // Clamp HP to new maxHp
      engine.value.player.stats.hp = Math.min(engine.value.player.stats.hp, engine.value.player.stats.maxHp);
   }
}

// ... Equip/Unequip logic same as before but calls saveInv() ...
const EQUIP_TYPES = ['weapon', 'helmet', 'armor', 'boots', 'accessory'];
const isEquippable = (item) => item && EQUIP_TYPES.includes(item.type);
const isUsable = (item) => item && item.type === 'consumable';

const bagItemClick = (item, index) => {
   // Toggle pin: click same item unpins, click different item pins new one
   if (pinnedItem.value === item) {
      pinnedItem.value = null;
   } else {
      pinnedItem.value = item;
   }
   lastPickedItem.value = item;
}

const previewEquip = (slot) => {
   const item = equipment.value[slot];
   if (item) lastPickedItem.value = item;
}

const equip = (item, index) => {
   if (!item || !isEquippable(item)) return;
   lastPickedItem.value = item;
   const type = item.type;
   if (equipment.value[type] !== undefined) {
       const oldItem = equipment.value[type];
       equipment.value[type] = item;
       inventory.value.splice(index, 1);
       if (oldItem) inventory.value.push(oldItem);
       saveInv();
       updateEngineStats();
   }
}
const unequip = (slot) => {
   const item = equipment.value[slot];
   if (item) {
      lastPickedItem.value = item;
      inventory.value.push(item);
      equipment.value[slot] = null;
      saveInv();
      updateEngineStats();
   }
}

// Use a consumable item from bag
const useItem = (item, index) => {
   if (!item || item.type !== 'consumable') return;
   if (!engine.value) return;
   const p = engine.value.player;
   if (item.effect === 'heal') {
      p.stats.hp = Math.min(p.stats.maxHp, p.stats.hp + item.value);
   } else if (item.effect === 'mana') {
      p.stats.mana = Math.min(p.stats.maxMana || 100, (p.stats.mana || 0) + item.value);
   } else if (item.effect === 'full_heal') {
      p.stats.hp = p.stats.maxHp;
      p.stats.mana = p.stats.maxMana || 0;
   } else if (item.effect === 'buff_atk') {
      engine.value.addFloatText(p.pixelX, p.pixelY, `+${item.value} ATK!`, '#ff8800');
      p.stats.attack += item.value;
      setTimeout(() => { if (p.stats) p.stats.attack -= item.value; }, (item.duration || 30) * 1000);
   } else if (item.effect === 'buff_def') {
      engine.value.addFloatText(p.pixelX, p.pixelY, `+${item.value} DEF!`, '#44aaff');
      p.stats.defense += item.value;
      setTimeout(() => { if (p.stats) p.stats.defense -= item.value; }, (item.duration || 30) * 1000);
   } else if (item.effect === 'buff_speed') {
      engine.value.addFloatText(p.pixelX, p.pixelY, `+SPD!`, '#88ffcc');
      p.moveSpeed *= (1 + item.value / 100);
      setTimeout(() => { if (p) p.moveSpeed /= (1 + item.value / 100); }, (item.duration || 30) * 1000);
   }
   engine.value.addFloatText(p.pixelX, p.pixelY - 20, `Used ${item.name}`, '#88ff88');
   removeFromInventory(inventory.value, index, 1);
   saveInv();
}

// Sell item for gold (half the buy price or 10g fallback)
const sellItem = (index) => {
   const item = inventory.value[index];
   if (!item || !engine.value) return;
   const sellPrice = Math.floor((item.price || 20) * 0.5);
   engine.value.gold += sellPrice;
   playerGold.value = engine.value.gold;
   engine.value.addFloatText(engine.value.player.pixelX, engine.value.player.pixelY, `+${sellPrice} 💰`, '#ffd700');
   removeFromInventory(inventory.value, index, 1);
   // Clear pinned if the sold item was pinned
   if (pinnedItem.value === item) pinnedItem.value = null;
   lastPickedItem.value = null;
   saveInv();
   engine.value.saveProgress();
}

// Drop item (discard from inventory, no gold)
const dropItem = (index) => {
   const item = inventory.value[index];
   if (!item || !engine.value) return;
   engine.value.addFloatText(engine.value.player.pixelX, engine.value.player.pixelY, `Dropped ${item.name}`, '#888');
   removeFromInventory(inventory.value, index, item.count || 1);
   if (pinnedItem.value === item) pinnedItem.value = null;
   lastPickedItem.value = null;
   saveInv();
}
const updateEngineStats = () => {
   if (engine.value) {
      engine.value.player.stats.attack = totalStats.value.attack;
      engine.value.player.stats.defense = totalStats.value.defense;
      // Sync maxHp/maxMana so engine heals and auto-mode thresholds use correct values
      engine.value.player.stats.maxHp = totalStats.value.maxHp;
      if (totalStats.value.maxMana) engine.value.player.stats.maxMana = totalStats.value.maxMana;
   }
}

const handleGameEvent = (type, data) => {
   if (type === 'teleport') { loadMap(data.targetMapId, data.targetX, data.targetY); currentMapId.value = data.targetMapId; }
   else if (type === 'pickup') { addToInventory(inventory.value, data); saveInv(); }
   else if (type === 'ground_item_clear') { groundItemTooltip.value = null; }
   else if (type === 'consumable_used') {
     // Decrement inventory item when used from buff slot
     const invItem = inventory.value.find(it => it.id === data.id);
     if (invItem) {
       removeFromInventory(inventory.value, inventory.value.indexOf(invItem), 1);
       saveInv();
     }
   }
   else if (type === 'npc_shop') {
     shopNPC.value = data.npc;
     shopItems.value = data.items;
     shopActiveTab.value = 'all';
     showShop.value = true;
   }
   else if (type === 'npc_quest') {
     dialogueNPC.value = data.npc;
     dialogueLines.value = data.npc.dialogue || ['...'];
     dialogueIndex.value = 0;
     questList.value = data.npc.quests || [];
     showDialogue.value = true;
   }
   else if (type === 'npc_storage') {
     loadStorage();
     showStorage.value = true;
   }
   else if (type === 'npc_craft') {
     craftNPC.value = data.npc;
     selectedRecipe.value = null;
     craftSlots.value = [null, null, null];
     craftResult.value = null;
     craftMessage.value = '';
     showCraft.value = true;
   }
   else if (type === 'npc_summon') {
     summonBanners.value = data.banners;
     activeBannerId.value = 'gear';
     summonResults.value = [];
     loadSummonData();
     showSummon.value = true;
   }
   else if (type === 'npc_temple') {
     templeNPC.value = data.npc;
     templeResults.value = [];
     showTemple.value = true;
   }
   // Farm events
   else if (type === 'farm_open_crop_menu') {
     farmCropList.value = data.crops || [];
     farmSlotIndex.value = data.slotIndex != null ? data.slotIndex : -1;
     farmGold.value = data.gold || 0;
     showFarmCropMenu.value = true;
   }
   else if (type === 'farm_open_plant_menu') {
     farmPlantList.value = data.plants || [];
     farmSlotIndex.value = data.slotIndex != null ? data.slotIndex : -1;
     farmGold.value = data.gold || 0;
     showFarmPlantMenu.value = true;
   }
   else if (type === 'farm_update') {
     if (data.gold != null) playerGold.value = data.gold;
   }
   else if (type === 'farm_wave_start') {
     farmMessage.value = `🌙 Night Wave ${data.wave} incoming!`;
     clearTimeout(farmMessageTimer.value);
     farmMessageTimer.value = setTimeout(() => farmMessage.value = '', 4000);
   }
   else if (type === 'farm_breach') {
     farmMessage.value = `💀 BREACH! Lost ${(data.goldStolen + data.cropsStolen).toLocaleString()}💰!`;
     clearTimeout(farmMessageTimer.value);
     farmMessageTimer.value = setTimeout(() => farmMessage.value = '', 6000);
   }
    else if (type === 'farm_night_warning') {
      farmMessage.value = '⚠️ Night is coming! Prepare defenses!';
      clearTimeout(farmMessageTimer.value);
      farmMessageTimer.value = setTimeout(() => farmMessage.value = '', 5000);
    }
    else if (type === 'farm_plant_info') {
      plantInfoData.value = data;
      farmGold.value = data.gold || 0;
      showPlantInfo.value = true;
    }
    else if (type === 'farm_plant_upgraded' || type === 'farm_plant_merged') {
      if (engine.value) {
        playerGold.value = engine.value.gold;
        farmGold.value = engine.value.gold;
        if (showPlantInfo.value && plantInfoData.value && plantInfoData.value.slotIndex === data.slotIndex) {
          const updated = engine.value.farmEngine.getPlantInfoForSlot(data.slotIndex);
          if (updated) plantInfoData.value = updated;
        }
      }
    }
    else if (type === 'farm_join_report') {
      farmJoinReport.value = data;
      showFarmJoinReport.value = true;
    }
    else if (type === 'farm_penalty') {
      if (engine.value) {
        playerGold.value = engine.value.gold;
        farmGold.value = engine.value.gold;
      }
    }
}

const loadMap = (id, x, y) => {
   if (engine.value) engine.value.setMap(id, x, y);
}

const handleKeyDown = (e) => { if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','1','2','3','4','5','6','7','8','9','0','q','w','e','r','t','Shift','f','F'].includes(e.key)) e.preventDefault(); }

// Click-to-use skill
const clickSkill = (idx) => {
  if (engine.value) engine.value.useSkill(idx);
}

// Auto-mode skill toggle
const toggleAutoSkill = (idx) => {
  const i = autoEnabledSkills.value.indexOf(idx);
  if (i >= 0) autoEnabledSkills.value.splice(i, 1);
  else autoEnabledSkills.value.push(idx);
  // Push to engine
  if (engine.value) engine.value.autoSkillSlots = [...autoEnabledSkills.value];
  saveAutoSettings();
}

const toggleAutoMove = () => {
  autoMove.value = !autoMove.value;
  if (engine.value) engine.value.autoMove = autoMove.value;
  saveAutoSettings();
}
const toggleAutoPickup = () => {
  autoPickup.value = !autoPickup.value;
  if (engine.value) engine.value.autoPickup = autoPickup.value;
  saveAutoSettings();
}

const saveAutoSettings = () => {
  localStorage.setItem('eclipse_auto_settings', JSON.stringify({
    skills: autoEnabledSkills.value,
    hpThreshold: autoHpThreshold.value,
    mpThreshold: autoMpThreshold.value,
    autoModeOn: autoModeActive.value,
    autoMove: autoMove.value,
    autoPickup: autoPickup.value
  }));
}

const loadAutoSettings = () => {
  try {
    const data = JSON.parse(localStorage.getItem('eclipse_auto_settings'));
    if (data) {
      if (data.skills) autoEnabledSkills.value = data.skills;
      if (data.hpThreshold) autoHpThreshold.value = data.hpThreshold;
      if (data.mpThreshold) autoMpThreshold.value = data.mpThreshold;
      if (data.autoModeOn !== undefined) autoModeActive.value = data.autoModeOn;
      if (data.autoMove !== undefined) autoMove.value = data.autoMove;
      if (data.autoPickup !== undefined) autoPickup.value = data.autoPickup;
    }
  } catch(e) {}
}

// Mobile joystick handlers
const joystickStart = (e) => {
  joystickActive.value = true;
  joystickMove(e);
}
const joystickMove = (e) => {
  if (!joystickActive.value || !joystickBase.value) return;
  const rect = joystickBase.value.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const touch = e.touches[0];
  let dx = touch.clientX - cx;
  let dy = touch.clientY - cy;
  const maxR = rect.width / 2 - 15;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist > maxR) { dx = dx / dist * maxR; dy = dy / dist * maxR; }
  joystickKnobX.value = dx;
  joystickKnobY.value = dy;
  // Send to engine
  if (engine.value) {
    const nx = dist > 5 ? dx / maxR : 0;
    const ny = dist > 5 ? dy / maxR : 0;
    engine.value.setMobileInput(nx, ny);
  }
}
const joystickEnd = () => {
  joystickActive.value = false;
  joystickKnobX.value = 0;
  joystickKnobY.value = 0;
  if (engine.value) engine.value.setMobileInput(0, 0);
}

// Mobile action buttons
const mobileAttack = () => {
  if (engine.value) engine.value.useSkill(0); // Fire first hotbar skill
}
const mobileDodge = () => {
  if (engine.value && engine.value.performDodge) engine.value.performDodge();
}
const mobileNPCInteract = () => {
  if (engine.value) engine.value.mobileInteractNPC();
}

// === SHOP FUNCTIONS ===
const buyItem = (item) => {
  if (!engine.value || engine.value.gold < item.price) return;
  engine.value.gold -= item.price;
  playerGold.value = engine.value.gold;
  // Gear gets unique random ID; consumables/materials keep original ID for stacking & craft matching
  const isGear = ['weapon', 'helmet', 'armor', 'boots', 'accessory'].includes(item.type);
  const bought = { ...item, count: item.count || 1 };
  if (isGear) bought.id = Math.random().toString(36).substr(2, 9);
  addToInventory(inventory.value, bought);
  engine.value.addFloatText(engine.value.player.pixelX, engine.value.player.pixelY, `Bought ${item.name}`, '#88ff88');
  saveInv();
  engine.value.saveProgress();
}

// === DIALOGUE FUNCTIONS ===
const nextDialogue = () => {
  if (dialogueIndex.value < dialogueLines.value.length - 1) dialogueIndex.value++;
}
const closeDialogue = () => { showDialogue.value = false; }
const acceptQuest = (quest) => {
  // Store active quest
  const active = JSON.parse(localStorage.getItem('eclipse_quests') || '[]');
  if (!active.find(q => q.id === quest.id)) {
    active.push({ ...quest, progress: 0 });
    localStorage.setItem('eclipse_quests', JSON.stringify(active));
  }
  closeDialogue();
}

// === STORAGE FUNCTIONS ===
const loadStorage = () => {
  try { storageItems.value = JSON.parse(localStorage.getItem('eclipse_storage') || '[]'); } catch{ storageItems.value = []; }
}
const saveStorage = () => { localStorage.setItem('eclipse_storage', JSON.stringify(storageItems.value)); }
const storeItem = (invIndex) => {
  if (storageItems.value.length >= 30) return;
  const item = inventory.value.splice(invIndex, 1)[0];
  if (item) { storageItems.value.push(item); saveStorage(); saveInv(); }
}
const retrieveItem = (stIndex) => {
  if (inventory.value.length >= 20) return;
  const item = storageItems.value.splice(stIndex, 1)[0];
  if (item) { inventory.value.push(item); saveStorage(); saveInv(); }
}

// === SUMMON / GACHA FUNCTIONS ===
const loadSummonData = () => {
  try { const d = JSON.parse(localStorage.getItem('eclipse_summon') || '{}'); pityCounter.value = d.pity || 0; } catch{ pityCounter.value = 0; }
}
const saveSummonData = () => { localStorage.setItem('eclipse_summon', JSON.stringify({ pity: pityCounter.value })); }
const closeSummon = () => { showSummon.value = false; summonResults.value = []; }

// === TEMPLE OF DESCENDANTS ===
const templeNPC = ref(null)
const templeResults = ref([])
const closeTemple = () => { showTemple.value = false; templeResults.value = []; }

// Farm functions
const farmSelectCrop = (cropId) => {
  if (!engine.value) return;
  let slotIdx = farmSlotIndex.value;
  // If no specific slot selected (e.g. from NPC), find first empty crop slot
  if (slotIdx < 0) {
    slotIdx = engine.value.farmEngine.cropSlots.findIndex(s => !s.cropId);
    if (slotIdx < 0) {
      farmMessage.value = '⚠️ No empty crop slots available!';
      return;
    }
  }
  const success = engine.value.farmEngine.plantCrop(slotIdx, cropId);
  if (success) {
    showFarmCropMenu.value = false;
    playerGold.value = engine.value.gold;
    farmGold.value = engine.value.gold;
  }
};

const farmSelectPlant = (plantId) => {
  if (!engine.value) return;
  let slotIdx = farmSlotIndex.value;
  // If no specific slot selected (e.g. from NPC), find first empty defense slot
  if (slotIdx < 0) {
    slotIdx = engine.value.farmEngine.defenseSlots.findIndex(s => !s.plant);
    if (slotIdx < 0) {
      farmMessage.value = '⚠️ No empty defense slots available!';
      return;
    }
  }
  const success = engine.value.farmEngine.placeDefense(slotIdx, plantId);
  if (success) {
    showFarmPlantMenu.value = false;
    playerGold.value = engine.value.gold;
    farmGold.value = engine.value.gold;
  }
};

const closeFarmMenus = () => {
  showFarmCropMenu.value = false;
  showFarmPlantMenu.value = false;
};

const switchToDefenseMenu = () => {
  farmPlantList.value = DEFENSE_PLANT_LIST;
  farmGold.value = engine.value ? engine.value.gold : 0;
  farmSlotIndex.value = -1; // auto-find empty defense slot
  showFarmCropMenu.value = false;
  showFarmPlantMenu.value = true;
};

const switchToCropMenu = () => {
  farmCropList.value = CROP_LIST;
  farmGold.value = engine.value ? engine.value.gold : 0;
  farmSlotIndex.value = -1;
  showFarmPlantMenu.value = false;
  showFarmCropMenu.value = true;
};

// Plant info popup actions
const closePlantInfo = () => {
  showPlantInfo.value = false;
  plantInfoData.value = null;
};

const upgradePlant = () => {
  if (!engine.value || !plantInfoData.value) return;
  engine.value.farmEngine.upgradePlant(plantInfoData.value.slotIndex);
  const updated = engine.value.farmEngine.getPlantInfoForSlot(plantInfoData.value.slotIndex);
  if (updated) {
    plantInfoData.value = updated;
    farmGold.value = engine.value.gold;
  }
};

const removePlant = () => {
  if (!engine.value || !plantInfoData.value) return;
  engine.value.farmEngine.removePlant(plantInfoData.value.slotIndex);
  closePlantInfo();
  playerGold.value = engine.value.gold;
  farmGold.value = engine.value.gold;
};

const startMerge = () => {
  if (!engine.value || !plantInfoData.value) return;
  engine.value.farmEngine.startMergeMode(plantInfoData.value.slotIndex);
  closePlantInfo();
};

const openUpgradeAllModal = () => {
  if (!engine.value?.farmEngine) return;
  upgradeAllPreview.value = engine.value.farmEngine.getUpgradeAllPreview();
  showUpgradeAllModal.value = true;
};

const dismissFarmJoinReport = () => {
  if (engine.value?.farmEngine) engine.value.farmEngine.clearOfflineReport();
  showFarmJoinReport.value = false;
};

const confirmUpgradeAll = () => {
  if (!engine.value?.farmEngine || farmGold.value < upgradeAllPreview.value.totalCost) return;
  engine.value.farmEngine.upgradeAllToMax();
  farmGold.value = engine.value.gold;
  playerGold.value = engine.value.gold;
  showUpgradeAllModal.value = false;
};
const claimTempleReward = (count) => {
  if (!engine.value || !templeNPC.value) return;
  const cost = count === 1 ? 200 : 900;
  if (engine.value.gems < cost) return;
  engine.value.gems -= cost;
  playerGems.value = engine.value.gems;
  const pool = templeNPC.value.rewards || [];
  const totalWeight = pool.reduce((s, i) => s + i.weight, 0);
  const results = [];
  for (let i = 0; i < count; i++) {
    let roll = Math.random() * totalWeight;
    let pick = pool[0];
    for (const item of pool) {
      roll -= item.weight;
      if (roll <= 0) { pick = item; break; }
    }
    results.push({ ...pick, id: Math.random().toString(36).substr(2, 9) });
  }
  templeResults.value = results;
  // Add to inventory as collectibles
  results.forEach(r => {
    inventory.value.push({ ...r, type: 'descendant', count: 1 });
  });
  saveInv();
}
const doSummon = (count) => {
  if (!engine.value || !activeBanner.value) return;
  const cost = count === 1 ? 100 : 900;
  if (engine.value.gems < cost) return;
  engine.value.gems -= cost;
  playerGems.value = engine.value.gems;
  const results = [];
  for (let i = 0; i < count; i++) {
    pityCounter.value++;
    const item = summonFromBanner(activeBanner.value, pityCounter.value);
    results.push(item);
    // If epic or above, reset appropriate pity
    if (['epic', 'legendary', 'mythic'].includes(item.rarity)) {
      if (item.rarity === 'legendary' || item.rarity === 'mythic') pityCounter.value = 0;
    }
    // Add to inventory
    inventory.value.push({ ...item });
  }
  summonResults.value = results;
  saveSummonData();
  saveInv();
  engine.value.saveProgress();
}

// === CRAFT FUNCTIONS ===
const selectCraftItem = (slotIdx) => {
  // Cycle through inventory items for the slot
  const eligible = inventory.value.filter(item => {
    if (!item) return false;
    return EQUIP_TYPES.includes(item.type);
  });
  if (!eligible.length) return;
  // Pick next item not already in another slot
  const used = craftSlots.value.filter(s => s !== null).map(s => s._craftIdx);
  const available = inventory.value.map((item, i) => ({ item, i })).filter(({ item, i }) =>
    EQUIP_TYPES.includes(item.type) && !used.includes(i)
  );
  if (available.length) {
    const pick = available[0];
    craftSlots.value[slotIdx] = { ...pick.item, _craftIdx: pick.i };
  }
}
const canCraft = computed(() => {
  if (!selectedRecipe.value) return false;
  if (selectedRecipe.value.id === 'combine_3') {
    const filled = craftSlots.value.filter(s => s !== null);
    if (filled.length < 3) return false;
    // All same rarity
    const r = filled[0].rarity;
    return filled.every(s => s.rarity === r);
  }
  // Scroll upgrades need gear in slot 0 + scroll in inventory
  if (craftSlots.value[0]) {
    const scrollId = selectedRecipe.value.requireScroll;
    return inventory.value.some(i => i.id === scrollId);
  }
  return false;
})
// Upgrade success rate computed
const upgradeSuccessRate = computed(() => {
  if (!craftSlots.value[0]) return 0;
  const lvl = craftSlots.value[0].level || 0;
  if (selectedRecipe.value?.id === 'luck_upgrade') return 100;
  return Math.floor((UPGRADE_RATES[lvl] || 0.10) * 100);
})
const selectRecipe = (recipe) => {
  selectedRecipe.value = recipe;
  craftSlots.value = [null, null, null];
  craftResult.value = null;
  craftMessage.value = '';
}
const doCraft = () => {
  if (!canCraft.value || !selectedRecipe.value) return;
  if (selectedRecipe.value.id === 'combine_3') {
    // Remove 3 items from inventory (by _craftIdx, highest first)
    const indices = craftSlots.value.map(s => s._craftIdx).sort((a, b) => b - a);
    indices.forEach(i => inventory.value.splice(i, 1));
    // Upgrade rarity
    const baseItem = craftSlots.value[0];
    const rIdx = RARITY_ORDER.indexOf(baseItem.rarity);
    const newRarity = RARITY_ORDER[Math.min(rIdx + 1, RARITY_ORDER.length - 1)];
    const newItem = { ...baseItem, rarity: newRarity, color: RARITY_COLORS[newRarity], name: `${newRarity.charAt(0).toUpperCase() + newRarity.slice(1)} ${baseItem.type}`, id: Math.random().toString(36).substr(2, 9) };
    if (newItem.stats) { Object.keys(newItem.stats).forEach(k => { newItem.stats[k] = Math.floor(newItem.stats[k] * 1.5); }); }
    delete newItem._craftIdx;
    inventory.value.push(newItem);
    craftResult.value = newItem;
    craftMessage.value = `Crafted ${newItem.name}!`;
    craftMessageType.value = 'success';
    craftSlots.value = [null, null, null];
    saveInv();
  } else {
    // Scroll upgrade using upgradeItem from items.js
    const scrollId = selectedRecipe.value.requireScroll;
    const scrollIdx = inventory.value.findIndex(i => i.id === scrollId);
    if (scrollIdx < 0) return;
    const gear = craftSlots.value[0];
    const gearIdx = gear._craftIdx;
    const useLuck = selectedRecipe.value.id === 'luck_upgrade';

    // Consume scroll (handle stacked scrolls)
    removeFromInventory(inventory.value, scrollIdx, 1);
    // Adjust gearIdx if scroll was before it
    const adjustedIdx = scrollIdx < gearIdx ? gearIdx - 1 : gearIdx;

    const result = upgradeItem(inventory.value[adjustedIdx], useLuck);
    if (result.success) {
      inventory.value[adjustedIdx] = result.item;
      craftMessage.value = result.message;
      craftMessageType.value = 'success';
      craftResult.value = result.item;
    } else {
      if (result.destroyed) {
        inventory.value.splice(adjustedIdx, 1);
      }
      craftMessage.value = result.message;
      craftMessageType.value = 'fail';
      craftResult.value = null;
    }
    craftSlots.value = [null, null, null];
    saveInv();
  }
}

const focusGame = () => {
  if (gameContainer.value) gameContainer.value.focus();
}

// === CANVAS CLICK: Ground item inspection ===
const onCanvasClick = (e) => {
  if (!engine.value) return;
  const rect = gameCanvas.value.getBoundingClientRect();
  const scaleX = gameCanvas.value.width / rect.width;
  const scaleY = gameCanvas.value.height / rect.height;
  const canvasX = (e.clientX - rect.left) * scaleX;
  const canvasY = (e.clientY - rect.top) * scaleY;

  const gi = engine.value.getGroundItemAt(canvasX, canvasY);
  if (gi) {
    e.stopPropagation(); // Don't trigger focusGame parent click
    if (engine.value.inspectedGroundItem === gi) {
      // Second click = pick up the item
      engine.value.pickupSingleGroundItem(gi);
      groundItemTooltip.value = null;
    } else {
      // First click = inspect
      engine.value.inspectedGroundItem = gi;
      groundItemTooltip.value = {
        item: gi.item,
        x: e.clientX,
        y: e.clientY,
        groundItem: gi
      };
    }
  } else {
    // Clicked empty space — clear inspection
    engine.value.inspectedGroundItem = null;
    groundItemTooltip.value = null;

    // Farm tile click (Map 8 only)
    if (currentMapId.value === 8) {
      const worldX = canvasX + engine.value.cameraX;
      const worldY = canvasY + engine.value.cameraY;
      const tileX = Math.floor(worldX / TILE_SIZE);
      const tileY = Math.floor(worldY / TILE_SIZE);
      engine.value.handleFarmTileClick(tileX, tileY);
    }
  }
}

// Sync autoPickup to engine
// When opening map menu, refresh editor maps from localStorage so custom maps and enemies are up to date
watch(showMapMenu, (open) => {
  if (open) {
    loadEditorMaps();
    // If currently on an editor map (id >= 10), refresh engine map so new enemy count applies without re-joining
    if (engine.value?.mapData?.id >= 10) {
      const id = engine.value.mapData.id;
      const px = engine.value.player.x;
      const py = engine.value.player.y;
      engine.value.setMap(id, px, py);
    }
  }
});

watch(autoPickup, (val) => {
  if (engine.value) engine.value.autoPickup = val;
})

// Pick up inspected ground item from tooltip button
const pickupInspectedItem = () => {
  if (!engine.value || !groundItemTooltip.value) return;
  engine.value.pickupSingleGroundItem(groundItemTooltip.value.groundItem);
  groundItemTooltip.value = null;
}

// === SELL ALL ===
const sellAll = () => {
   if (!engine.value || inventory.value.length === 0) return;
   const buffIds = getBuffSlotItemIds();
   let totalGold = 0;
   const keep = [];
   for (const item of inventory.value) {
      // Skip items assigned to buff slots
      if (buffIds.has(item.id)) { keep.push(item); continue; }
      const count = item.count || 1;
      totalGold += Math.floor((item.price || 20) * 0.5) * count;
   }
   engine.value.gold += totalGold;
   playerGold.value = engine.value.gold;
   engine.value.addFloatText(engine.value.player.pixelX, engine.value.player.pixelY, `Sold all! +${totalGold} 💰`, '#ffd700');
   inventory.value = keep;
   pinnedItem.value = null;
   lastPickedItem.value = null;
   hoveredItem.value = null;
   saveInv();
   engine.value.saveProgress();
}

// === WEAR BEST ===
const wearBest = () => {
   if (!engine.value) return;
   const slotTypes = ['weapon', 'helmet', 'armor', 'boots', 'accessory'];
   for (const slotType of slotTypes) {
      // Find best item of this type in inventory (highest total stat value)
      let bestIdx = -1;
      let bestScore = -1;
      inventory.value.forEach((item, i) => {
         if (item.type !== slotType) return;
         const score = item.stats ? Object.values(item.stats).reduce((a, b) => a + b, 0) : 0;
         if (score > bestScore) { bestScore = score; bestIdx = i; }
      });
      if (bestIdx < 0) continue;
      // Compare with currently equipped
      const current = equipment.value[slotType];
      const currentScore = current && current.stats ? Object.values(current.stats).reduce((a, b) => a + b, 0) : 0;
      if (bestScore > currentScore) {
         equip(inventory.value[bestIdx], bestIdx);
      }
   }
   engine.value.addFloatText(engine.value.player.pixelX, engine.value.player.pixelY, 'Best gear equipped! ⚔️', '#c5a059');
}

let uiSyncInterval = null;

onMounted(() => {
  // Re-read editor maps from localStorage so custom maps and enemy spawns are up to date
  // (e.g. after user edited in Map Editor and clicked "Apply to Game")
  loadEditorMaps();
  if (gameCanvas.value) {
    // Maps list inject
    engine.value = new GameEngine(gameCanvas.value, maps, handleGameEvent);
    window.__rpgEngine = engine.value; // Debug access
    engine.value.start();
    loadInv();
    loadAutoSettings();
    updateEngineStats();
    // Restore saved buff slot assignments to engine
    consumableSlots.value.forEach((saved, i) => {
      if (saved && saved.id && engine.value.consumables[i]) {
        const effectMap = {
          'heal': { effect: 'heal', cd: 3000 },
          'mana': { effect: 'mana', cd: 3000 },
          'full_heal': { effect: 'heal', cd: 5000 },
          'buff_atk': { effect: 'buff_atk', cd: 20000 },
          'buff_def': { effect: 'buff_def', cd: 20000 },
          'buff_speed': { effect: 'buff_speed', cd: 15000 },
        };
        // Find matching inventory item for amount/value
        const invItem = inventory.value.find(it => it.id === saved.id);
        const mapped = effectMap[saved.effect] || effectMap[invItem?.effect] || { effect: saved.effect || 'heal', cd: 3000 };
        const slot = engine.value.consumables[i];
        slot.id = saved.id;
        slot.name = saved.name;
        slot.icon = saved.icon;
        slot.count = invItem ? (invItem.count || 1) : 0;
        slot.maxCount = 99;
        slot.effect = mapped.effect;
        slot.amount = invItem?.value || 50;
        slot.duration = ((invItem?.duration || 30) * 1000);
        slot.cooldown = 0;
        slot.cd = mapped.cd;
        slot.color = saved.color || '#ccc';
      }
    });
    // Push auto-settings to engine
    engine.value.autoSkillSlots = [...autoEnabledSkills.value];
    engine.value.autoHpThreshold = autoHpThreshold.value / 100;
    engine.value.autoMpThreshold = autoMpThreshold.value / 100;
    engine.value.autoMode = autoModeActive.value;
    engine.value.autoMove = autoMove.value;
    engine.value.autoPickup = autoPickup.value;

    // Mobile detection — also check screen width for tablets/small devices
    const checkMobile = () => {
      isMobile.value = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth <= 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);
    
    // Sync UI from Engine
    uiSyncInterval = setInterval(() => {
       if (engine.value && engine.value.player) {
          const p = engine.value.player;
          currentHp.value = Math.max(0, Math.ceil(p.stats.hp));
          currentResource.value = Math.max(0, Math.floor(p.stats.maxMana > 0 ? p.stats.mana : p.stats.rage));
          currentStamina.value = Math.max(0, Math.floor(p.stamina || 0));
          // Sync Class if changed internally (load game)
          if(engine.value.currentClass.id !== currentClass.value.id) currentClass.value = engine.value.currentClass;
          // Sync mapId from engine
          if(engine.value.mapData && engine.value.mapData.id !== currentMapId.value) currentMapId.value = engine.value.mapData.id;
          
          // Sync hotbar cooldowns
          if (engine.value.hotbar) {
            const cds = [];
            const isMu = engine.value.isMuClass(engine.value.currentClass);
            for (let i = 0; i < 15; i++) {
              const sk = engine.value.hotbar[i];
              if (isMu) {
                // MU classes: show global attack speed cooldown on all slots
                cds.push(sk ? Math.max(0, engine.value.globalAttackCooldown || 0) : 0);
              } else {
                cds.push(sk ? (p.cooldowns[sk.id] || 0) : 0);
              }
            }
            hotbarCooldowns.value = cds;
          }
          // Sync consumable slots (counts from inventory, cooldowns from engine)
          syncBuffSlotCounts();
          if (engine.value.consumables) {
            engine.value.consumables.forEach((c, i) => {
              if (consumableSlots.value[i]) {
                consumableSlots.value[i].cooldown = Math.max(0, c.cooldown);
              }
            });
          }
          // Sync auto-mode state
          autoModeActive.value = engine.value.autoMode || false;
          // Push thresholds to engine
          engine.value.autoHpThreshold = autoHpThreshold.value / 100;
          engine.value.autoMpThreshold = autoMpThreshold.value / 100;
           // Sync gold & gems
           playerGold.value = engine.value.gold || 0;
           playerGems.value = engine.value.gems || 0;
           // Sync nearby NPC
           nearbyNPC.value = !!engine.value.nearbyNPC;
       }
    }, 100);
    
    // Auto-focus for keyboard controls
    nextTick(() => {
      if (gameContainer.value) gameContainer.value.focus();
    });
  }
})

onUnmounted(() => { if (engine.value) engine.value.stop(); if (uiSyncInterval) clearInterval(uiSyncInterval); })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Lato:wght@400;700&display=swap');
/* ... Previous CSS ... */
.resource-bar.mana-bar .bar-fill { background: linear-gradient(90deg, #1e88e5, #42a5f5); }
.resource-bar.rage-bar .bar-fill { background: linear-gradient(90deg, #ff6f00, #ff8f00); }
.stamina-bar .bar-fill { background: linear-gradient(90deg, #2979ff, #448aff); }

.name-text { cursor: pointer; border-bottom: 1px dotted rgba(255,255,255,0.3); }

.class-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; padding: 16px; }
.class-category-label { grid-column: 1 / -1; font-family: 'Cinzel', serif; font-size: 14px; font-weight: bold; padding: 6px 0 2px 0; border-bottom: 1px solid #2d3e4f; margin-bottom: 4px; }
.class-category-label.eclipse-label { color: #aa88ff; border-color: #6644aa; }
.class-category-label.mu-label { color: #c5a059; border-color: #4a3a20; }
.class-card { background: #0f161d; border: 1px solid #2d3e4f; border-radius: 4px; padding: 10px; cursor: pointer; text-align: center; color: #fff; transition: all 0.2s; }
.class-card:hover { border-color: #c5a059; background: #1a2634; }
.class-card.eclipse-class { border-color: #3a2866; }
.class-card.eclipse-class:hover { border-color: #aa88ff; background: #1a1434; box-shadow: 0 0 12px rgba(170, 136, 255, 0.15); }
.class-specs { display: flex; flex-wrap: wrap; gap: 3px; margin-top: 6px; justify-content: center; }
.spec-badge { font-size: 9px; background: rgba(170, 136, 255, 0.15); border: 1px solid #3a2866; color: #aa88ff; padding: 1px 5px; border-radius: 8px; }
.class-icon { font-size: 32px; margin-bottom: 8px; }

/* ... Rest of CSS ... */
.rpg-game { width: 100%; height: 100%; background: #050505; display: flex; justify-content: center; align-items: center; overflow: hidden; outline: none; font-family: 'Lato', sans-serif; position: relative; }
.viewport { position: relative; max-width: 100%; max-height: 100%; overflow: auto; box-shadow: 0 0 50px rgba(0,0,0,0.8); border: 4px solid #1a2634; }
canvas { display: block; background: #000; }
.hud-top-left { position: absolute; top: 16px; left: 16px; pointer-events: none; z-index: 10; }

/* === PREMIUM PLAYER HUD === */
.player-info-card {
  display: flex; align-items: center; gap: 10px;
  background: linear-gradient(135deg, rgba(6,14,22,0.95) 0%, rgba(12,24,36,0.92) 50%, rgba(6,14,22,0.88) 100%);
  border: 2px solid #c5a059;
  border-image: linear-gradient(135deg, #c5a059, #8b6914, #c5a059) 1;
  padding: 8px 14px 8px 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.7), inset 0 1px 0 rgba(197,160,89,0.15);
  width: 320px;
  clip-path: polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%);
}

/* Character Portrait */
.hero-portrait {
  width: 60px; height: 60px; flex-shrink: 0;
  border: 3px solid #c5a059;
  border-radius: 8px;
  background: linear-gradient(135deg, #0a1520, #152535);
  display: flex; justify-content: center; align-items: center;
  position: relative;
  box-shadow: inset 0 0 12px rgba(197,160,89,0.15), 0 0 8px rgba(0,0,0,0.5);
  pointer-events: auto;
  transition: all 0.3s ease;
}
.hero-portrait::before {
  content: ''; position: absolute; inset: 2px;
  border: 1px solid rgba(197,160,89,0.2);
  border-radius: 6px;
}
.portrait-inner { display: flex; justify-content: center; align-items: center; }
.portrait-emoji { font-size: 30px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); }
.portrait-level {
  position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%);
  background: linear-gradient(135deg, #c5a059, #8b6914);
  color: #0b1622; font-weight: bold; font-size: 11px;
  padding: 1px 8px; border-radius: 8px;
  font-family: 'Cinzel', serif;
  box-shadow: 0 2px 6px rgba(0,0,0,0.5);
  border: 1px solid rgba(255,255,255,0.15);
  min-width: 24px; text-align: center;
}

/* Info Column */
.hud-info-col { flex: 1; display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.hud-name-row { display: flex; justify-content: space-between; align-items: baseline; gap: 6px; }
.hud-class-name {
  color: #f0e6d2; font-weight: bold; font-family: 'Cinzel', serif; font-size: 13px;
  cursor: pointer; pointer-events: auto;
  text-shadow: 0 1px 4px rgba(0,0,0,0.6);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.hud-class-name:hover { color: #c5a059; }
.hud-combat-stats { font-size: 10px; color: #8899a6; white-space: nowrap; flex-shrink: 0; }

/* Stat Bars */
.hud-bar {
  height: 14px; background: rgba(0,0,0,0.6); position: relative;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 2px;
  overflow: hidden;
}
.hud-bar-fill { height: 100%; transition: width 0.15s ease; position: relative; z-index: 1; }
.hud-bar-shine {
  position: absolute; top: 0; left: 0; right: 0; height: 50%;
  background: linear-gradient(180deg, rgba(255,255,255,0.15), transparent);
  z-index: 2; pointer-events: none;
}
.hud-bar-text {
  position: absolute; inset: 0; display: flex; justify-content: center; align-items: center;
  font-size: 9px; font-weight: bold; color: #fff; z-index: 3;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8), 0 0 4px rgba(0,0,0,0.5);
  letter-spacing: 0.5px;
}

/* HP Bar */
.hp-bar { border-color: rgba(198,40,40,0.3); }
.hp-fill { background: linear-gradient(90deg, #8b1a1a, #c62828, #e53935, #ef5350); }
.hp-bar::after { content: ''; position: absolute; inset: 0; box-shadow: inset 0 0 8px rgba(229,57,53,0.3); z-index: 2; pointer-events: none; }

/* MP/Mana Bar */
.mp-bar { border-color: rgba(30,90,200,0.3); }
.mp-fill { background: linear-gradient(90deg, #0d47a1, #1565c0, #1e88e5, #42a5f5); }
.mp-bar::after { content: ''; position: absolute; inset: 0; box-shadow: inset 0 0 8px rgba(30,136,229,0.3); z-index: 2; pointer-events: none; }

/* Rage Bar override */
.rage-bar .mp-fill { background: linear-gradient(90deg, #bf360c, #e64a19, #ff5722, #ff7043); }
.rage-bar { border-color: rgba(230,74,25,0.3); }
.rage-bar::after { content: ''; position: absolute; inset: 0; box-shadow: inset 0 0 8px rgba(255,87,34,0.3); z-index: 2; pointer-events: none; }

/* Stamina Bar */
.sta-bar { border-color: rgba(56,142,60,0.3); }
.sta-fill { background: linear-gradient(90deg, #1b5e20, #2e7d32, #43a047, #66bb6a); }
.sta-bar::after { content: ''; position: absolute; inset: 0; box-shadow: inset 0 0 8px rgba(67,160,71,0.3); z-index: 2; pointer-events: none; }
.hud-bottom-center { position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%); pointer-events: none; }
.skill-tray { display: flex; gap: 3px; background: linear-gradient(180deg, rgba(20,30,40,0.9), rgba(10,18,26,0.95)); border: 1px solid #4a6375; padding: 4px 6px; border-radius: 4px; }
.skill-slot { width: 38px; height: 38px; background: rgba(0,0,0,0.6); border: 1px solid #3a5060; display: flex; justify-content: center; align-items: center; position: relative; pointer-events: auto; transition: all 0.15s; border-radius: 3px; }
.skill-slot:hover { border-color: #c5a059; }
.skill-slot.disabled { opacity: 0.5; filter: grayscale(0.6); }
.skill-slot.empty { background: rgba(0,0,0,0.3); border-color: #222; }
.key-hint { position: absolute; top: -9px; left: 50%; transform: translateX(-50%); font-size: 8px; color: #c5a059; font-weight: bold; }
.skill-icon { font-size: 18px; }
.cooldown-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 10px; border-radius: 3px; }
.tray-separator { width: 2px; background: #4a6375; margin: 0 4px; align-self: stretch; }
.consumable-slot { width: 38px; height: 38px; background: rgba(0,0,0,0.6); border: 2px solid #3a5060; display: flex; justify-content: center; align-items: center; position: relative; pointer-events: auto; transition: all 0.15s; border-radius: 3px; cursor: pointer; flex-direction: column; }
.consumable-slot:hover { filter: brightness(1.3); transform: scale(1.05); }
.consumable-slot.disabled { opacity: 0.45; filter: grayscale(0.6); }
.consumable-slot.empty { opacity: 0.5; border-style: dashed; }
.consumable-slot.empty:hover { opacity: 0.8; }
.consumable-icon { font-size: 16px; line-height: 1; }
.consumable-count { font-size: 8px; color: #ccc; font-weight: bold; position: absolute; bottom: 1px; right: 2px; }
.hud-bottom-right { position: absolute; bottom: 20px; right: 20px; display: flex; gap: 8px; flex-direction: column; }
.action-btn { background: linear-gradient(#2d4b69, #1a2f45); border: 1px solid #4a7a9f; color: white; padding: 10px 20px; font-family: 'Cinzel', serif; font-weight: bold; cursor: pointer; font-size: 11px; border-radius: 4px; transition: all 0.15s; }
.action-btn:hover { filter: brightness(1.2); }
.auto-btn { background: linear-gradient(#3d2b69, #2a1f55); border-color: #6a4a9f; }
.auto-btn.active { background: linear-gradient(#2d9f4a, #1a7030); border-color: #44ff88; color: #e0ffe8; box-shadow: 0 0 12px rgba(68, 255, 136, 0.3); animation: autoPulse 2s infinite; }
@keyframes autoPulse { 0%, 100% { box-shadow: 0 0 8px rgba(68, 255, 136, 0.2); } 50% { box-shadow: 0 0 16px rgba(68, 255, 136, 0.5); } }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; z-index: 200; }
.rpg-modal { background: #111822; border: 2px solid #4a6375; width: 900px; padding-bottom: 16px; max-height: 85vh; overflow-y: auto; }
.skills-modal { width: 750px; }
.modal-header { padding: 12px 16px; background: #1a2634; border-bottom: 1px solid #4a6375; display: flex; justify-content: space-between; align-items: center; }
.modal-header h3 { margin: 0; color: #e0ecf5; font-family: 'Cinzel', serif; }
.close-btn { background: none; border: none; color: #8899a6; font-size: 18px; cursor: pointer; }
.char-sheet-layout { display: flex; flex-direction: row; padding: 16px; gap: 16px; }
.equipment-panel { width: 220px; display: flex; flex-direction: column; align-items: center; background: linear-gradient(180deg, rgba(15,22,29,0.9), rgba(8,12,18,0.95)); border: 1px solid #2d3e4f; border-radius: 8px; padding: 12px 8px; }
.equip-label { font-size: 13px; color: #c5a059; margin-bottom: 10px; font-family: 'Cinzel', serif; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; text-shadow: 0 0 8px rgba(197,160,89,0.3); }

/* Hero Doll Grid Layout */
.hero-doll-container { display: grid; grid-template-columns: 52px 100px 52px; grid-template-rows: auto auto auto; gap: 4px; align-items: center; justify-items: center; }

/* Doll Slots */
.doll-slot { width: 50px; height: 50px; background: rgba(11,16,22,0.8); border: 2px solid #2d3e4f; border-radius: 6px; display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer; position: relative; transition: all 0.25s ease; }
.doll-slot:hover { border-color: #c5a059; box-shadow: 0 0 12px rgba(197,160,89,0.3); transform: scale(1.08); }
.doll-slot .slot-placeholder { font-size: 20px; opacity: 0.4; }
.doll-slot .item-icon { font-size: 22px; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; border: none; border-radius: 4px; }
.doll-slot .slot-label { position: absolute; bottom: -14px; font-size: 8px; color: #667788; text-transform: uppercase; letter-spacing: 1px; white-space: nowrap; }
.doll-slot .equip-level { position: absolute; top: -4px; right: -4px; background: rgba(197,160,89,0.9); color: #0b1622; font-size: 8px; font-weight: bold; padding: 1px 3px; border-radius: 3px; }

/* Slot Grid Positions */
.doll-slot-helmet { grid-column: 2; grid-row: 1; }
.doll-slot-weapon { grid-column: 1; grid-row: 2; }
.doll-slot-armor { grid-column: 3; grid-row: 2; }
.doll-slot-boots { grid-column: 1; grid-row: 3; }
.doll-slot-accessory { grid-column: 3; grid-row: 3; }

/* Hero Body (center of grid) */
.hero-body { grid-column: 2; grid-row: 2 / 4; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; }
.hero-silhouette { display: flex; flex-direction: column; align-items: center; gap: 0; }
.hero-head { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #1a2a3a, #0e1820); border: 2px solid #3d5568; display: flex; justify-content: center; align-items: center; transition: all 0.3s; z-index: 2; }
.hero-head.has-helmet { border-color: #c5a059; }
.hero-face { font-size: 20px; }
.hero-torso { width: 42px; height: 48px; background: linear-gradient(180deg, #1a2a3a, #101a24); border: 2px solid #3d5568; border-radius: 4px 4px 2px 2px; margin-top: -4px; display: flex; justify-content: center; align-items: center; transition: all 0.3s; z-index: 1; }
.hero-torso.has-armor { border-color: #c5a059; background: linear-gradient(180deg, #1a2f42, #0e1e2d); }
.torso-gear { font-size: 20px; }
.torso-default { font-size: 22px; opacity: 0.4; }
.hero-arms { display: flex; justify-content: space-between; width: 56px; margin-top: -36px; z-index: 0; }
.hero-arm { width: 8px; height: 32px; background: linear-gradient(180deg, #1a2a3a, #0e1820); border: 1px solid #3d5568; border-radius: 3px; transition: all 0.3s; }
.hero-legs { display: flex; gap: 4px; margin-top: -2px; z-index: 0; }
.hero-leg { width: 12px; height: 22px; background: linear-gradient(180deg, #1a2a3a, #0e1820); border: 1px solid #3d5568; border-radius: 2px 2px 4px 4px; transition: all 0.3s; }
.hero-level-badge { margin-top: 4px; font-size: 10px; color: #c5a059; font-weight: bold; font-family: 'Cinzel', serif; background: rgba(197,160,89,0.1); padding: 1px 8px; border-radius: 8px; border: 1px solid rgba(197,160,89,0.3); }

/* Stats Summary below doll */
.doll-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 8px; margin-top: 12px; width: 100%; padding: 8px; background: rgba(0,0,0,0.3); border-radius: 4px; border: 1px solid #1a2634; }
.doll-stat { font-size: 11px; color: #aabbcc; display: flex; align-items: center; gap: 4px; }
.doll-stat span { font-size: 12px; }
.bag-panel { flex: 1; min-width: 360px; }
.bag-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; max-height: 320px; overflow-y: auto; padding-right: 4px; }
.item-slot { aspect-ratio: 1; background: #0b1016; border: 1px solid #2d3e4f; border-radius: 4px; display: flex; justify-content: center; align-items: center; cursor: pointer; }
.item-slot:hover { border-color: #c5a059; }
.item-slot.empty { background: rgba(0,0,0,0.1); }
.item-icon { font-size: 24px; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; border: 2px solid transparent; border-radius: 4px; }
.info-panel { width: 240px; background: rgba(0,0,0,0.2); border-left: 1px solid #2d3e4f; padding-left: 10px; font-size: 12px; color: #ccc; }
.info-panel h4 { margin: 0 0 4px 0; font-family: 'Cinzel', serif; }
.transition-overlay { position: absolute; inset: 0; background: #000; display: flex; justify-content: center; align-items: center; z-index: 50; animation: fadeIn 0.3s; }
.loading-text { color: #c5a059; font-family: 'Cinzel', serif; font-size: 24px; animation: pulse 1s infinite; }

/* Skills Panel */
.skills-panel-body { padding: 12px 16px; }
.skills-hotbar-info { display: flex; align-items: center; gap: 4px; padding: 6px 10px; background: rgba(197, 160, 89, 0.1); border: 1px solid #c5a059; margin-bottom: 12px; font-size: 11px; flex-wrap: wrap; }
.hotbar-label { color: #c5a059; font-weight: bold; font-family: 'Cinzel', serif; margin-right: 4px; }
.hotbar-slot { color: #e0ecf5; background: rgba(0,0,0,0.3); padding: 2px 5px; border-radius: 2px; border: 1px solid #2d3e4f; font-size: 10px; }
.skills-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; max-height: 340px; overflow-y: auto; padding-right: 4px; }
.skills-grid::-webkit-scrollbar { width: 4px; }
.skills-grid::-webkit-scrollbar-track { background: #0b1016; }
.skills-grid::-webkit-scrollbar-thumb { background: #4a6375; border-radius: 2px; }
.skill-card { display: flex; align-items: center; gap: 6px; padding: 6px 8px; background: rgba(15, 22, 30, 0.9); border: 1px solid #2d3e4f; cursor: pointer; transition: all 0.15s; }
.skill-card:hover { border-color: #c5a059; background: rgba(30, 44, 60, 0.9); }
.skill-card.equipped { border-color: #c5a059; background: rgba(197, 160, 89, 0.15); }
.skill-card.locked { opacity: 0.4; filter: grayscale(0.8); }
.skill-card-icon { width: 36px; height: 36px; border: 2px solid; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.skill-card-info { flex: 1; min-width: 0; }
.skill-card-name { color: #e0ecf5; font-size: 11px; font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.skill-card-lvl { color: #8899a6; font-size: 9px; }
.skill-card-effect { color: #5a7a8f; font-size: 9px; text-transform: uppercase; }
.skill-detail-panel { margin-top: 12px; padding: 12px; background: rgba(0,0,0,0.3); border: 1px solid #4a6375; }
.skill-detail-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.skill-detail-icon { font-size: 28px; }
.skill-detail-name { color: #e0ecf5; font-family: 'Cinzel', serif; font-size: 16px; font-weight: bold; }
.skill-detail-lvl { color: #c5a059; font-size: 11px; }
.skill-detail-desc { color: #8899a6; font-size: 12px; margin: 4px 0 8px 0; }
.skill-detail-stats { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
.skill-detail-stats span { color: #ccc; font-size: 11px; background: rgba(0,0,0,0.3); padding: 3px 8px; border-radius: 3px; border: 1px solid #1a2634; }
.skill-assign-btns { display: flex; gap: 4px; flex-wrap: wrap; align-items: center; }
.assign-label { color: #8899a6; font-size: 10px; margin-right: 4px; }
.assign-slot-btn { background: linear-gradient(#2d4b69, #1a2f45); border: 1px solid #4a7a9f; color: #c5a059; padding: 3px 8px; font-size: 10px; font-weight: bold; cursor: pointer; transition: all 0.15s; min-width: 24px; text-align: center; }
.assign-slot-btn:hover { background: linear-gradient(#3d5b79, #2a3f55); border-color: #c5a059; }

/* Map Travel Menu — map selector above night card, centered */
.hud-top-center { position: absolute; top: 8px; left: 50%; transform: translateX(-50%); z-index: 10; }
.hud-top-right { position: absolute; top: 16px; right: 16px; }
.map-indicator { display: flex; align-items: center; gap: 6px; background: linear-gradient(90deg, rgba(8, 20, 30, 0.95), rgba(8, 20, 30, 0.7)); border: 1px solid #c5a059; border-radius: 8px; padding: 6px 14px; cursor: pointer; transition: all 0.2s; }
.map-indicator:hover { border-color: #ffd700; background: rgba(8, 20, 30, 0.98); }
.map-icon { font-size: 18px; }
.map-name { color: #e0ecf5; font-family: 'Cinzel', serif; font-weight: bold; font-size: 13px; }
.map-arrow { color: #c5a059; font-size: 10px; }

.map-modal { width: 650px; }
.map-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 16px; }
.map-card { display: flex; align-items: center; gap: 10px; padding: 12px; background: #0f161d; border: 1px solid #2d3e4f; border-radius: 6px; cursor: pointer; transition: all 0.2s; position: relative; }
.map-card:hover { border-color: #c5a059; background: #1a2634; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.4); }
.map-card.active { border-color: #ffd700; background: rgba(197, 160, 89, 0.12); }
.map-card-icon { width: 48px; height: 48px; border: 2px solid; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0; }
.map-card-info { flex: 1; min-width: 0; }
.map-card-name { font-family: 'Cinzel', serif; font-weight: bold; font-size: 14px; }
.map-card-level { color: #c5a059; font-size: 11px; font-weight: bold; }
.map-card-desc { color: #8899a6; font-size: 10px; margin-top: 2px; }
.map-card-badge { position: absolute; top: 6px; right: 8px; background: #c5a059; color: #0b1622; font-size: 8px; font-weight: bold; padding: 2px 6px; border-radius: 3px; }
.map-btn { background: linear-gradient(#2d694b, #1a4530) !important; border-color: #4a9f7a !important; }
.settings-btn { background: linear-gradient(#4a4a2d, #35351a) !important; border-color: #9f9f4a !important; font-size: 10px !important; padding: 6px 14px !important; }

/* Auto-Mode Settings Panel */
.auto-settings-panel { position: absolute; bottom: 200px; right: 20px; background: linear-gradient(180deg, rgba(15,22,30,0.97), rgba(8,14,20,0.98)); border: 1px solid #4a6375; border-radius: 6px; width: 260px; z-index: 100; box-shadow: 0 8px 24px rgba(0,0,0,0.6); }
.auto-settings-header { padding: 8px 12px; background: rgba(197,160,89,0.1); border-bottom: 1px solid #4a6375; display: flex; justify-content: space-between; align-items: center; color: #c5a059; font-family: 'Cinzel', serif; font-size: 12px; font-weight: bold; }
.auto-settings-body { padding: 10px 12px; }
.auto-setting-section { margin-bottom: 10px; }
.auto-setting-label { color: #8899a6; font-size: 11px; display: block; margin-bottom: 4px; }
.auto-skill-list { display: flex; flex-direction: column; gap: 3px; max-height: 180px; overflow-y: auto; }
.auto-skill-toggle { display: flex; align-items: center; gap: 6px; padding: 4px 8px; background: rgba(0,0,0,0.3); border: 1px solid #2d3e4f; border-radius: 3px; cursor: pointer; transition: all 0.15s; }
.auto-skill-toggle:hover { border-color: #c5a059; }
.auto-skill-toggle.enabled { background: rgba(68,255,136,0.08); border-color: #44ff88; }
.auto-skill-icon { font-size: 14px; }
.auto-skill-name { flex: 1; color: #e0ecf5; font-size: 11px; }
.auto-skill-check { font-size: 12px; }
.threshold-row { display: flex; align-items: center; gap: 8px; }
.threshold-slider { flex: 1; accent-color: #c5a059; }
.threshold-val { color: #c5a059; font-weight: bold; font-size: 12px; min-width: 32px; text-align: right; }

/* Mobile Virtual Joystick */
.mobile-joystick { position: absolute; bottom: 80px; left: 30px; width: 120px; height: 120px; pointer-events: auto; z-index: 90; touch-action: none; }
.joystick-base { width: 120px; height: 120px; border-radius: 50%; background: radial-gradient(circle, rgba(30,50,70,0.5), rgba(10,20,30,0.8)); border: 2px solid rgba(197,160,89,0.4); position: relative; display: flex; align-items: center; justify-content: center; }
.joystick-knob { width: 44px; height: 44px; border-radius: 50%; background: radial-gradient(circle, rgba(197,160,89,0.7), rgba(100,80,40,0.6)); border: 2px solid rgba(197,160,89,0.8); box-shadow: 0 0 12px rgba(197,160,89,0.3); transition: transform 0.05s; will-change: transform; }

/* Mobile Action Pad (left side, next to move joystick) */
.mobile-action-pad { position: absolute; bottom: 80px; left: 160px; display: flex; flex-direction: column; gap: 12px; z-index: 90; pointer-events: auto; }
.mobile-atk-btn, .mobile-dodge-btn { width: 64px; height: 64px; border-radius: 50%; border: 2px solid; font-size: 24px; display: flex; align-items: center; justify-content: center; cursor: pointer; touch-action: none; user-select: none; -webkit-user-select: none; transition: transform 0.1s, box-shadow 0.1s; }
.mobile-atk-btn { background: radial-gradient(circle, rgba(197,160,89,0.6), rgba(80,60,20,0.8)); border-color: rgba(197,160,89,0.7); box-shadow: 0 0 16px rgba(197,160,89,0.3), inset 0 0 12px rgba(197,160,89,0.1); }
.mobile-atk-btn:active { transform: scale(0.9); box-shadow: 0 0 24px rgba(197,160,89,0.6); }
.mobile-dodge-btn { background: radial-gradient(circle, rgba(60,180,200,0.6), rgba(20,60,80,0.8)); border-color: rgba(60,180,200,0.5); box-shadow: 0 0 16px rgba(60,180,200,0.3), inset 0 0 12px rgba(60,180,200,0.1); }
.mobile-dodge-btn:active { transform: scale(0.9); box-shadow: 0 0 24px rgba(60,180,200,0.6); }

/* Make skill tray scrollable on mobile; keep map selector centered; action pad left near joystick */
@media (max-width: 768px) {
  .skill-tray { overflow-x: auto; max-width: calc(100vw - 40px); }
  .skill-slot { min-width: 36px; min-height: 36px; }
  .hud-bottom-center { bottom: 6px; }
  .hud-bottom-right { bottom: 6px; right: 6px; gap: 4px; }
  .action-btn { padding: 6px 10px; font-size: 9px; }
  .key-hint { display: none; }
  .hud-top-center { top: 6px; }
  .mobile-action-pad { left: 150px; bottom: 70px; gap: 10px; }
}
</style>

<style scoped>
/* === SHOP MODAL === */
.shop-modal { width: 680px; }
.shop-gold { color: #ffd700; font-weight: bold; font-family: 'Cinzel', serif; }
.shop-tabs { display: flex; gap: 2px; padding: 8px 16px; background: rgba(0,0,0,0.3); border-bottom: 1px solid #2d3e4f; }
.shop-tab { background: rgba(0,0,0,0.4); border: 1px solid #2d3e4f; color: #8899a6; padding: 4px 12px; cursor: pointer; text-transform: capitalize; font-size: 11px; border-radius: 3px; transition: all 0.15s; }
.shop-tab.active { background: rgba(197,160,89,0.15); border-color: #c5a059; color: #c5a059; }
.shop-grid { display: flex; flex-direction: column; gap: 6px; padding: 12px 16px; max-height: 50vh; overflow-y: auto; }
.shop-item { display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: rgba(15,22,30,0.9); border: 1px solid #2d3e4f; border-radius: 4px; transition: all 0.15s; }
.shop-item:hover { border-color: #c5a059; background: rgba(30,44,60,0.9); }
.shop-item.cant-afford { opacity: 0.5; }
.shop-item-icon { width: 42px; height: 42px; border: 2px solid; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 22px; background: rgba(0,0,0,0.4); flex-shrink: 0; }
.shop-item-info { flex: 1; }
.shop-item-name { font-weight: bold; font-size: 13px; }
.shop-item-rarity { font-size: 9px; color: #8899a6; text-transform: uppercase; }
.shop-item-stats { display: flex; gap: 6px; margin-top: 2px; }
.shop-item-stats span { font-size: 10px; color: #88cc88; }
.shop-item-buy { text-align: right; }
.shop-item-price { color: #ffd700; font-weight: bold; font-size: 12px; margin-bottom: 4px; }
.buy-btn { background: linear-gradient(#2d694b, #1a4530); border: 1px solid #4a9f7a; color: #e0ffe8; padding: 4px 14px; font-weight: bold; font-size: 11px; cursor: pointer; border-radius: 3px; transition: all 0.15s; }
.buy-btn:hover { filter: brightness(1.3); }
.buy-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* === DIALOGUE MODAL === */
.dialogue-modal { width: 500px; }
.dialogue-portrait { display: flex; align-items: center; gap: 12px; padding: 16px; background: linear-gradient(90deg, rgba(197,160,89,0.1), transparent); border-bottom: 1px solid #4a6375; }
.portrait-icon { font-size: 48px; }
.portrait-name { font-family: 'Cinzel', serif; font-size: 18px; color: #e0ecf5; font-weight: bold; }
.dialogue-body { padding: 20px 16px; min-height: 80px; }
.dialogue-text { color: #ccd8e0; font-size: 14px; line-height: 1.6; margin: 0; }
.dialogue-actions { padding: 12px 16px; border-top: 1px solid #2d3e4f; display: flex; flex-direction: column; gap: 8px; }
.dialogue-btn { background: linear-gradient(#2d4b69, #1a2f45); border: 1px solid #4a7a9f; color: #c5a059; padding: 8px 20px; font-family: 'Cinzel', serif; font-weight: bold; cursor: pointer; border-radius: 3px; transition: all 0.15s; text-align: center; }
.dialogue-btn:hover { filter: brightness(1.3); border-color: #c5a059; }
.quest-list { display: flex; flex-direction: column; gap: 6px; margin-bottom: 8px; }
.quest-item { display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: rgba(0,0,0,0.3); border: 1px solid #2d3e4f; border-radius: 4px; cursor: pointer; transition: all 0.15s; }
.quest-item:hover { border-color: #c5a059; background: rgba(197,160,89,0.08); }
.quest-icon { font-size: 28px; }
.quest-info { flex: 1; }
.quest-name { color: #e0ecf5; font-weight: bold; font-size: 13px; }
.quest-desc { color: #8899a6; font-size: 11px; margin: 2px 0; }
.quest-reward { color: #ffd700; font-size: 11px; }

/* === STORAGE MODAL === */
.storage-modal { width: 700px; }
.storage-layout { display: flex; align-items: flex-start; gap: 12px; padding: 16px; }
.storage-panel { flex: 1; }
.storage-label { font-size: 13px; color: #c5a059; font-family: 'Cinzel', serif; margin-bottom: 8px; }
.storage-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; }
.storage-slot { aspect-ratio: 1; background: #0b1016; border: 1px solid #2d3e4f; border-radius: 4px; display: flex; justify-content: center; align-items: center; cursor: pointer; transition: all 0.15s; }
.storage-slot:hover { border-color: #c5a059; }
.storage-slot.empty { background: rgba(0,0,0,0.1); }
.storage-arrow { font-size: 28px; color: #c5a059; align-self: center; padding: 0 8px; }

/* === SUMMON / GACHA MODAL === */
.summon-modal { width: 700px; }
.summon-gems { color: #aa88ff; font-weight: bold; font-family: 'Cinzel', serif; }
.summon-banner-tabs { display: flex; gap: 8px; padding: 12px 16px; background: rgba(0,0,0,0.3); }
.banner-tab { flex: 1; padding: 10px; background: rgba(0,0,0,0.4); border: 2px solid #2d3e4f; color: #8899a6; font-family: 'Cinzel', serif; font-weight: bold; cursor: pointer; text-align: center; border-radius: 6px; transition: all 0.2s; font-size: 13px; }
.banner-tab.active { color: #fff; background: rgba(170,136,255,0.15); box-shadow: 0 0 12px rgba(170,136,255,0.2); }
.summon-banner-display { margin: 12px 16px; padding: 20px; border: 2px solid; border-radius: 8px; background: linear-gradient(135deg, rgba(0,0,0,0.6), rgba(20,10,40,0.8)); text-align: center; }
.banner-featured { font-size: 20px; font-family: 'Cinzel', serif; color: #ffd700; margin-bottom: 6px; }
.banner-desc { color: #8899a6; font-size: 12px; margin-bottom: 8px; }
.pity-info { color: #aa88ff; font-size: 11px; }
.summon-results { display: flex; flex-wrap: wrap; gap: 8px; padding: 12px 16px; justify-content: center; }
.summon-result-card { width: 80px; padding: 8px; background: rgba(0,0,0,0.5); border: 2px solid #2d3e4f; border-radius: 6px; text-align: center; transition: all 0.3s; animation: summonReveal 0.5s ease-out; }
.summon-result-card.common { border-color: #b0b0b0; }
.summon-result-card.uncommon { border-color: #2ecc71; box-shadow: 0 0 8px rgba(46,204,113,0.3); }
.summon-result-card.rare { border-color: #3498db; box-shadow: 0 0 12px rgba(52,152,219,0.4); }
.summon-result-card.epic { border-color: #9b59b6; box-shadow: 0 0 16px rgba(155,89,182,0.5); }
.summon-result-card.legendary { border-color: #f1c40f; box-shadow: 0 0 20px rgba(241,196,15,0.6); animation: summonLegendary 1s ease-out; }
@keyframes summonReveal { 0% { transform: scale(0.5) rotateY(180deg); opacity: 0; } 100% { transform: scale(1) rotateY(0); opacity: 1; } }
@keyframes summonLegendary { 0% { transform: scale(0.3) rotateY(360deg); opacity: 0; box-shadow: 0 0 60px rgba(241,196,15,0.9); } 50% { box-shadow: 0 0 40px rgba(241,196,15,0.7); } 100% { transform: scale(1) rotateY(0); opacity: 1; } }
.result-icon { font-size: 28px; margin-bottom: 4px; border: 2px solid; border-radius: 4px; padding: 4px; display: inline-block; background: rgba(0,0,0,0.4); }
.result-name { font-size: 10px; font-weight: bold; word-break: break-word; }
.result-rarity { font-size: 8px; color: #8899a6; margin-top: 2px; }
.summon-actions { display: flex; gap: 12px; padding: 16px; justify-content: center; }
.summon-btn { padding: 12px 24px; font-family: 'Cinzel', serif; font-weight: bold; font-size: 13px; border-radius: 6px; cursor: pointer; transition: all 0.2s; }
.summon-btn.single { background: linear-gradient(135deg, #2d4b69, #1a2f45); border: 2px solid #4a7a9f; color: #e0ecf5; }
.summon-btn.multi { background: linear-gradient(135deg, #3d2b69, #2a1f55); border: 2px solid #8a5acf; color: #ddc8ff; }
.summon-btn:hover { filter: brightness(1.3); transform: translateY(-1px); }
.summon-btn:disabled { opacity: 0.4; cursor: not-allowed; filter: none; transform: none; }

/* === TEMPLE OF DESCENDANTS MODAL === */
.temple-modal { width: 700px; }
.temple-modal .modal-header h3 { color: #ffd700; }
.temple-intro { padding: 12px 16px; text-align: center; color: #c5a059; font-style: italic; font-size: 13px; background: linear-gradient(135deg, rgba(197,160,89,0.08), rgba(0,0,0,0.3)); border-bottom: 1px solid rgba(197,160,89,0.2); }
.result-category { font-size: 8px; color: #c5a059; margin-top: 1px; letter-spacing: 1px; }
.result-desc { font-size: 9px; color: #8899a6; margin-top: 2px; }

/* === CRAFT MODAL === */
.craft-modal { width: 650px; }
.craft-layout { display: flex; gap: 16px; padding: 16px; }
.craft-recipe-panel { width: 200px; display: flex; flex-direction: column; gap: 6px; }
.craft-recipe { display: flex; align-items: center; gap: 8px; padding: 8px 10px; background: rgba(0,0,0,0.3); border: 1px solid #2d3e4f; border-radius: 4px; cursor: pointer; transition: all 0.15s; }
.craft-recipe:hover { border-color: #c5a059; }
.craft-recipe.active { border-color: #c5a059; background: rgba(197,160,89,0.12); }
.recipe-icon { font-size: 22px; }
.recipe-name { color: #e0ecf5; font-size: 12px; font-weight: bold; }
.recipe-desc { color: #8899a6; font-size: 10px; }
.craft-work-area { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.craft-slots { text-align: center; }
.craft-slot-row { display: flex; gap: 10px; justify-content: center; margin-bottom: 10px; }
.craft-slot { width: 56px; height: 56px; background: #0b1016; border: 2px dashed #4a6375; border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.15s; }
.craft-slot:hover { border-color: #c5a059; border-style: solid; }
.craft-plus { font-size: 24px; color: #4a6375; align-self: center; }
.craft-arrow { font-size: 24px; margin: 8px 0; }
.craft-result { display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(197,160,89,0.1); border: 1px solid #c5a059; border-radius: 4px; }
.craft-chance { color: #c5a059; font-size: 12px; margin: 8px 0; }
.craft-go-btn { background: linear-gradient(#c5a059, #8b6d25); border: 1px solid #ffd700; color: #0b1622; padding: 10px 24px; font-family: 'Cinzel', serif; font-weight: bold; font-size: 14px; cursor: pointer; border-radius: 4px; margin-top: 12px; transition: all 0.2s; }
.craft-go-btn:hover { filter: brightness(1.2); }
.craft-go-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.craft-message { margin-top: 10px; padding: 6px 12px; border-radius: 4px; font-weight: bold; font-size: 12px; }
.craft-message.success { background: rgba(46,204,113,0.15); border: 1px solid #2ecc71; color: #2ecc71; }
.craft-message.fail { background: rgba(231,76,60,0.15); border: 1px solid #e74c3c; color: #e74c3c; }
.craft-empty { color: #4a6375; font-style: italic; text-align: center; }
.craft-warning { color: #e74c3c; font-weight: bold; font-size: 11px; margin-top: 4px; animation: warningPulse 1.5s infinite; }
@keyframes warningPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
.craft-preview { margin-top: 8px; padding: 8px 12px; background: rgba(0,0,0,0.3); border: 1px solid #2d3e4f; border-radius: 4px; text-align: left; }
.preview-label { color: #8899a6; font-size: 10px; margin-bottom: 4px; }
.preview-stats { display: flex; flex-direction: column; gap: 2px; }
.preview-stat { color: #ccc; font-size: 11px; }
.stat-up { color: #2ecc71; font-weight: bold; }

/* === ITEM STACK & LEVEL BADGES === */
.item-slot { position: relative; }
.item-slot.stackable { }
.stack-count { position: absolute; bottom: 2px; right: 3px; background: rgba(0,0,0,0.85); color: #ffd700; font-size: 9px; font-weight: bold; padding: 0 3px; border-radius: 2px; line-height: 1.3; min-width: 12px; text-align: center; border: 1px solid rgba(255,215,0,0.3); }
.item-level-badge { position: absolute; top: 1px; right: 2px; background: rgba(197,160,89,0.9); color: #0b1622; font-size: 8px; font-weight: bold; padding: 0 3px; border-radius: 2px; line-height: 1.3; }

/* === ITEM DETAIL CARD === */
.item-detail-card { }
.item-detail-card h4 { margin: 0 0 6px 0; font-family: 'Cinzel', serif; font-size: 14px; }
.item-type-badge { display: inline-block; font-size: 9px; font-weight: bold; padding: 2px 8px; border-radius: 3px; margin-bottom: 6px; letter-spacing: 0.5px; }
.item-upgrade-level { color: #c5a059; font-size: 11px; font-weight: bold; margin-bottom: 4px; }
.item-stat-list { display: flex; flex-direction: column; gap: 3px; margin: 6px 0; }
.item-stat-row { display: flex; justify-content: space-between; padding: 2px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
.stat-label { color: #8899a6; font-size: 10px; text-transform: uppercase; }
.stat-value { color: #2ecc71; font-size: 11px; font-weight: bold; }
.item-description { color: #8899a6; font-size: 10px; font-style: italic; margin: 6px 0; padding: 4px 6px; background: rgba(0,0,0,0.2); border-radius: 3px; }
.item-stack-info { color: #ffd700; font-size: 10px; margin-bottom: 6px; }
.item-actions { display: flex; flex-direction: column; gap: 4px; margin-top: 8px; }
.item-action-btn { padding: 5px 10px; font-size: 11px; font-weight: bold; border-radius: 3px; cursor: pointer; border: 1px solid; transition: all 0.15s; text-align: center; }
.item-action-btn:hover { filter: brightness(1.3); }
.equip-btn { background: linear-gradient(#2d4b69, #1a2f45); border-color: #4a7a9f; color: #e0ecf5; }
.use-btn { background: linear-gradient(#2d694b, #1a4530); border-color: #4a9f7a; color: #e0ffe8; }
.sell-btn { background: linear-gradient(#694b2d, #45301a); border-color: #9f7a4a; color: #ffe8c0; }
.drop-btn { background: linear-gradient(#4a2020, #2a1010); border-color: #6a3030; color: #ff9999; }
.assign-btn { background: linear-gradient(#2d4b69, #1a2f45); border-color: #4a9f7a; color: #a0ffd0; }
.assign-btn:hover { border-color: #6ecf9a; }
.slot-assign-row { display: flex; gap: 4px; margin-top: 4px; width: 100%; }
.slot-assign-btn { flex: 1; padding: 5px 4px; font-size: 11px; background: rgba(0,0,0,0.5); border: 1px solid #4a6375; color: #e0ecf5; border-radius: 3px; cursor: pointer; transition: all 0.15s; text-align: center; }
.slot-assign-btn:hover { filter: brightness(1.4); transform: translateY(-1px); background: rgba(30,60,80,0.7); }
.item-detail-empty { color: #4a6375; font-style: italic; font-size: 12px; text-align: center; padding: 20px 0; }
.bag-actions-bar { display: flex; gap: 6px; margin-bottom: 8px; }
.bag-action-btn { flex: 1; padding: 6px 10px; font-size: 11px; font-weight: bold; font-family: 'Cinzel', serif; border-radius: 4px; cursor: pointer; border: 1px solid; transition: all 0.2s; text-align: center; }
.bag-action-btn:hover { filter: brightness(1.3); transform: translateY(-1px); }
.sell-all-btn { background: linear-gradient(#694b2d, #45301a); border-color: #9f7a4a; color: #ffe8c0; }
.wear-best-btn { background: linear-gradient(#2d4b69, #1a2f45); border-color: #4a7a9f; color: #e0ecf5; }
.item-slot.selected { border-color: #c5a059 !important; box-shadow: 0 0 8px rgba(197, 160, 89, 0.5); background: rgba(197, 160, 89, 0.1); }
.bag-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; }

/* Mobile interact button */
.mobile-interact-btn { width: 64px; height: 64px; border-radius: 50%; border: 2px solid rgba(255,171,64,0.7); font-size: 24px; display: flex; align-items: center; justify-content: center; cursor: pointer; touch-action: none; user-select: none; background: radial-gradient(circle, rgba(255,171,64,0.6), rgba(120,80,20,0.8)); box-shadow: 0 0 16px rgba(255,171,64,0.3), inset 0 0 12px rgba(255,171,64,0.1); transition: transform 0.1s, box-shadow 0.1s; }
.mobile-interact-btn:active { transform: scale(0.9); box-shadow: 0 0 24px rgba(255,171,64,0.6); }

/* Large modal util */
.large-modal { max-width: 90vw; }



/* === GROUND ITEM TOOLTIP === */
.ground-item-tooltip { position: fixed; transform: translate(-50%, -100%); z-index: 1000; background: linear-gradient(135deg, #0d1b2a, #1b2838); border: 1px solid #4a6375; border-radius: 6px; padding: 10px 14px; min-width: 160px; max-width: 240px; box-shadow: 0 4px 20px rgba(0,0,0,0.7), 0 0 10px rgba(197,160,89,0.2); pointer-events: auto; }
.git-header { font-family: 'Cinzel', serif; font-size: 14px; font-weight: bold; margin-bottom: 4px; }
.git-rarity { font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; opacity: 0.8; }
.git-stats { display: flex; flex-direction: column; gap: 2px; margin-bottom: 8px; }
.git-stat { color: #7fff7f; font-size: 11px; font-weight: bold; }
.git-pickup-btn { width: 100%; padding: 6px 10px; font-size: 12px; font-weight: bold; font-family: 'Cinzel', serif; background: linear-gradient(#2d4b69, #1a2f45); border: 1px solid #4a7a9f; color: #ffd700; border-radius: 4px; cursor: pointer; transition: all 0.2s; }
.git-pickup-btn:hover { filter: brightness(1.4); border-color: #c5a059; transform: translateY(-1px); }
.git-hint { font-size: 9px; color: #4a6375; text-align: center; margin-top: 4px; font-style: italic; }

/* Auto-pickup toggle */
.auto-pickup-toggle { padding: 4px 14px; border-radius: 4px; border: 1px solid #4a6375; background: #1a2838; color: #ccd8e0; font-size: 12px; font-weight: bold; cursor: pointer; transition: all 0.2s; }
.auto-pickup-toggle.enabled { background: linear-gradient(#2d694b, #1a4530); border-color: #4a9f7a; color: #a0ffd0; }
.auto-pickup-toggle:hover { filter: brightness(1.2); }

@media (max-width: 768px) {
  .shop-modal, .storage-modal, .summon-modal, .craft-modal, .dialogue-modal, .temple-modal { width: 95vw !important; }
  .storage-layout { flex-direction: column; }
  .craft-layout { flex-direction: column; }
  .storage-arrow { transform: rotate(90deg); align-self: center; }
  .summon-results { gap: 4px; }
  .summon-result-card { width: 60px; padding: 4px; }
}

/* Farm Modals */
.farm-modal { min-width: 360px; }
.farm-gold { color: #ffd700; font-size: 14px; font-weight: bold; }
.farm-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 8px; padding: 12px; max-height: 360px; overflow-y: auto; }
.farm-card { background: rgba(30, 50, 30, 0.9); border: 1px solid #4a7030; border-radius: 8px; padding: 10px; text-align: center; cursor: pointer; transition: all 0.2s; }
.farm-card:hover:not(.disabled) { border-color: #8bc34a; background: rgba(50, 80, 50, 0.95); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4); }
.farm-card.disabled { opacity: 0.4; cursor: not-allowed; }
.farm-card.defense-card { border-color: #1565c0; background: rgba(20, 35, 60, 0.9); }
.farm-card.defense-card:hover:not(.disabled) { border-color: #42a5f5; background: rgba(30, 55, 90, 0.95); }
.farm-icon { font-size: 28px; margin-bottom: 4px; }
.farm-name { font-size: 12px; font-weight: bold; color: #e0e0e0; margin-bottom: 2px; }
.farm-cost { font-size: 11px; color: #ffd700; }
.farm-info { font-size: 10px; color: #aed581; }
.farm-value { font-size: 10px; color: #81c784; }
.farm-desc { font-size: 9px; color: #90a4ae; margin: 2px 0; }
.farm-stats { font-size: 10px; color: #b0bec5; display: flex; gap: 6px; justify-content: center; margin-top: 4px; flex-wrap: wrap; }
.farm-special { font-size: 9px; color: #ce93d8; margin-top: 3px; text-transform: capitalize; }
.farm-notification { position: fixed; top: 80px; left: 50%; transform: translateX(-50%); background: rgba(0, 0, 0, 0.85); border: 2px solid #ffd700; border-radius: 8px; padding: 8px 20px; color: #fff; font-size: 14px; font-weight: bold; z-index: 900; animation: farmNotify 0.3s ease-out; text-shadow: 0 0 8px rgba(255, 215, 0, 0.5); }
@keyframes farmNotify { from { opacity: 0; transform: translateX(-50%) translateY(-20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
.farm-switch-row { padding: 8px 12px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center; }
.farm-switch-btn { background: linear-gradient(135deg, #37474f, #455a64); border: 1px solid #607d8b; color: #e0e0e0; border-radius: 6px; padding: 8px 20px; font-size: 13px; font-weight: bold; cursor: pointer; transition: all 0.2s; }
.farm-switch-btn:hover { background: linear-gradient(135deg, #455a64, #546e7a); border-color: #90a4ae; color: #fff; transform: translateY(-1px); box-shadow: 0 3px 8px rgba(0,0,0,0.3); }

/* Plant Info Popup */
.plant-info-modal { min-width: 300px; max-width: 380px; border-width: 2px; }
.plant-level-badge { display: inline-block; padding: 2px 10px; border-radius: 12px; color: #000; font-weight: bold; font-size: 13px; margin-left: 8px; }
.plant-info-body { padding: 12px; }
.plant-info-stats { margin-bottom: 12px; }
.plant-info-stats .stat-row { font-size: 13px; color: #e0e0e0; padding: 3px 0; }
.plant-info-stats .stat-row.desc { font-size: 11px; color: #90a4ae; font-style: italic; margin-top: 6px; }
.plant-info-actions { display: flex; flex-direction: column; gap: 6px; }
.upgrade-all-body { padding: 12px; }
.upgrade-all-intro { font-size: 13px; color: #b0bec5; margin-bottom: 8px; }
.upgrade-all-list { list-style: none; padding: 0; margin: 0 0 12px; max-height: 200px; overflow-y: auto; }
.upgrade-all-list li { font-size: 12px; color: #e0e0e0; padding: 4px 0; }
.upgrade-all-empty { font-size: 12px; color: #90a4ae; margin: 8px 0; }
.upgrade-all-total { font-size: 14px; color: #ffd700; margin-bottom: 12px; }
.upgrade-all-actions { display: flex; gap: 8px; }
.action-btn { padding: 8px 12px; border-radius: 6px; font-size: 13px; font-weight: bold; cursor: pointer; border: 1px solid; transition: all 0.2s; text-align: center; }
.action-btn.upgrade-btn { background: linear-gradient(135deg, #1b5e20, #2e7d32); border-color: #4caf50; color: #c8e6c9; }
.action-btn.upgrade-btn:hover:not(.disabled) { background: linear-gradient(135deg, #2e7d32, #43a047); transform: translateY(-1px); box-shadow: 0 3px 8px rgba(76,175,80,0.3); }
.action-btn.upgrade-btn.disabled { opacity: 0.4; cursor: not-allowed; }
.action-btn.merge-btn { background: linear-gradient(135deg, #1a237e, #283593); border-color: #42a5f5; color: #bbdefb; }
.action-btn.merge-btn:hover { background: linear-gradient(135deg, #283593, #3949ab); transform: translateY(-1px); box-shadow: 0 3px 8px rgba(66,165,245,0.3); }
.action-btn.remove-btn { background: linear-gradient(135deg, #b71c1c, #c62828); border-color: #ef5350; color: #ffcdd2; }
.action-btn.remove-btn:hover { background: linear-gradient(135deg, #c62828, #e53935); transform: translateY(-1px); box-shadow: 0 3px 8px rgba(244,67,54,0.3); }
.action-btn.max-btn { background: rgba(255,215,0,0.15); border-color: #ffd700; color: #ffd700; opacity: 0.7; }

/* Farm Join Report Modal */
.farm-join-report-modal { min-width: 340px; max-width: 420px; }
.farm-report-body { padding: 14px 16px; }
.report-row { font-size: 13px; color: #e0e0e0; padding: 4px 0; display: flex; align-items: center; gap: 6px; }
.report-row strong { margin-left: auto; }
.report-row.warning { color: #ff9800; background: rgba(255,152,0,0.08); padding: 6px 8px; border-radius: 4px; margin-top: 4px; }
.streak-warn { font-size: 10px; opacity: 0.7; }
.text-green { color: #66bb6a; }
.text-red { color: #ef5350; }
.report-divider { text-align: center; padding: 10px 0 6px; margin-top: 8px; border-top: 1px solid rgba(255,255,255,0.1); color: #90a4ae; font-size: 12px; font-style: italic; }
.report-penalty { background: linear-gradient(135deg, rgba(183,28,28,0.3), rgba(198,40,40,0.2)); border: 1px solid #ef5350; border-radius: 6px; padding: 10px 12px; color: #ffcdd2; font-weight: bold; font-size: 13px; text-align: center; margin-top: 8px; animation: farmNotify 0.3s ease-out; }
.report-footer { padding: 10px 16px; border-top: 1px solid rgba(255,255,255,0.08); text-align: center; }
</style>
