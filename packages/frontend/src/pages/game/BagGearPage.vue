<template>
  <div class="bag-content" :style="bagContentStyle">
    <div class="main">
      <div class="table12 table12-with-lines">
        <div class="col-lg12-7 hero-gear hero-info">
          <div class="left-wp-gear col-lg12-4">
            <div class="box-item-weapon-main">
              <div
                v-for="slot in mainWeapons" 
                :key="slot.key"
                class="gear-slot"
                :class="{ 
                  'gear-slot-highlight': dragOverSlot === slot.key,
                  'gear-slot-worn': getGearForSlot(slot.key)
                }"
                @click="handleGearSlotClick(slot.key)"
                @dblclick="handleGearSlotDoubleClick(slot.key)"
                @dragover="handleDragOver($event, slot.key)"
                @dragleave="handleDragLeave"
                @drop="handleDrop($event, slot.key)"
                @dragstart="handleGearSlotDragStart($event, slot.key)"
                draggable="true"
              >
                <img 
                  v-if="getGearImage(slot.key)" 
                  :src="getGearImage(slot.key)" 
                  :alt="getGearForSlot(slot.key)?.item?.name || slot.name"
                  class="gear-image"
                >
                <img 
                  v-else
                  :src="getImageUrl(slot.key_image)" 
                  :alt="slot.name"
                  class="gear-placeholder"
                >
              </div>
            </div>
            <div class="box-item-weapon-sp">
              <div
                v-for="slot in specialWeapons" 
                :key="slot.key"
                class="gear-slot"
                :class="{ 
                  'gear-slot-highlight': dragOverSlot === slot.key,
                  'gear-slot-worn': getGearForSlot(slot.key)
                }"
                @click="handleGearSlotClick(slot.key)"
                @dblclick="handleGearSlotDoubleClick(slot.key)"
                @dragover="handleDragOver($event, slot.key)"
                @dragleave="handleDragLeave"
                @drop="handleDrop($event, slot.key)"
                @dragstart="handleGearSlotDragStart($event, slot.key)"
                draggable="true"
              >
                <img 
                  v-if="getGearImage(slot.key)" 
                  :src="getGearImage(slot.key)" 
                  :alt="getGearForSlot(slot.key)?.item?.name || slot.name"
                  class="gear-image"
                >
                <img 
                  v-else
                  :src="getImageUrl(slot.key_image)" 
                  :alt="slot.name"
                  class="gear-placeholder"
                >
              </div>
            </div>
            <div class="box-item-weapon-sp-hit">
              <div
                v-for="slot in specialItems" 
                :key="slot.key"
                class="gear-slot"
                :class="{ 
                  'gear-slot-highlight': dragOverSlot === slot.key,
                  'gear-slot-worn': getGearForSlot(slot.key)
                }"
                @click="handleGearSlotClick(slot.key)"
                @dblclick="handleGearSlotDoubleClick(slot.key)"
                @dragover="handleDragOver($event, slot.key)"
                @dragleave="handleDragLeave"
                @drop="handleDrop($event, slot.key)"
                @dragstart="handleGearSlotDragStart($event, slot.key)"
                draggable="true"
              >
                <img 
                  v-if="getGearImage(slot.key)" 
                  :src="getGearImage(slot.key)" 
                  :alt="getGearForSlot(slot.key)?.item?.name || slot.name"
                  class="gear-image"
                >
                <img 
                  v-else
                  :src="getImageUrl(slot.key_image)" 
                  :alt="slot.name"
                  class="gear-placeholder"
                >
              </div>
            </div>
          </div>
          <div class="hero-animation col-lg12-8">
            <div class="col-lg12-12 hero-show-wrapper">
              <!-- SVG Lines inside same wrapper as panels so coordinates match (hero-show-wrapper has min-height) -->
              <svg 
                v-if="selectedItem && isSelectedItemWorn && setBonusesForSelectedItem.length > 0"
                class="set-bonus-lines"
                ref="linesSvgRef"
              >
                <path
                  v-if="linePathRef"
                  :d="linePathRef"
                  class="bonus-line"
                />
              </svg>
              <div class="hero-show">
                <img :src="getImageUrl('character.hero')" alt="Hero">
                <LevelBadge :level="userLevel" />
              </div>
              <!-- EXP Bar under hero character -->
              <ExpBar :current-exp="currentExp" :total-exp-needed="totalExpNeeded" />
              <!-- Item Detail Panel (absolute positioned, appears next to character) -->
              <div 
                v-if="selectedItem && canShowItemDetail(selectedItem)" 
                class="item-detail-panel"
                :class="{ 'is-wear': isSelectedItemWorn }"
                ref="itemDetailPanelRef"
              >
                <button class="item-detail-close" @click="closeItemDetail">×</button>
                <div class="item-detail-header">
                  <img 
                    v-if="selectedItem.key_image" 
                    :src="getImageUrl(selectedItem.key_image)" 
                    :alt="selectedItem.name"
                    class="item-detail-image"
                  >
                  <h3 class="item-detail-name">{{ selectedItem.name || t('component.bag.itemDetail.item') }}</h3>
                  <div v-if="selectedItem.quantity" class="item-detail-quantity">
                    {{ t('component.bag.itemDetail.quantity') }}: {{ selectedItem.quantity }}
                  </div>
                </div>
                <div class="item-detail-body">
                  <!-- Gear: properties (stats + custom options) -->
                  <template v-if="selectedItem && selectedItem.actions?.is_gear">
                    <h4 class="item-detail-properties-title">{{ t('component.bag.itemDetail.properties') }}</h4>
                    <div class="item-detail-properties">
                      <template v-if="selectedItemProperties && selectedItemProperties.stats">
                        <div 
                          v-for="(value, key) in selectedItemProperties.stats" 
                          :key="'stat-' + key"
                          class="item-detail-property"
                        >
                          <span class="item-detail-property-key">{{ formatPropertyKey(key) }}:</span>
                          <span class="item-detail-property-value">{{ value }}</span>
                        </div>
                      </template>
                      <template v-if="selectedItemProperties && selectedItemProperties.custom_options">
                        <div 
                          v-for="(customOption, index) in (Array.isArray(selectedItemProperties.custom_options) ? selectedItemProperties.custom_options : [selectedItemProperties.custom_options])" 
                          :key="'custom-' + index"
                          class="item-detail-property custom-option"
                        >
                          <span class="item-detail-property-key">{{ customOption.name || 'Custom Option' }}:</span>
                          <div class="custom-option-properties">
                            <div 
                              v-for="(value, key) in customOption.properties" 
                              :key="key"
                              class="custom-option-stat"
                            >
                              <span class="item-detail-property-key">{{ formatPropertyKey(key) }}:</span>
                              <span class="item-detail-property-value">{{ value }}</span>
                            </div>
                          </div>
                        </div>
                      </template>
                      <template v-if="selectedItemProperties && !selectedItemProperties.stats && !selectedItemProperties.custom_options">
                        <div 
                          v-for="(value, key) in selectedItemProperties" 
                          :key="key"
                          class="item-detail-property"
                        >
                          <span class="item-detail-property-key">{{ formatPropertyKey(key) }}:</span>
                          <span class="item-detail-property-value">{{ typeof value === 'object' ? JSON.stringify(value) : value }}</span>
                        </div>
                      </template>
                    </div>
                    <div class="item-detail-actions">
                      <button 
                        v-if="!isSelectedItemWorn" 
                        class="btn-wear" 
                        @click="handleWearItem(selectedItem)"
                      >
                        {{ t('component.bag.wear') }}
                      </button>
                      <button 
                        v-else 
                        class="btn-exit" 
                        @click="handleUnwearItem(getWornSlotKey)"
                      >
                        {{ t('component.bag.exit') }}
                      </button>
                    </div>
                  </template>
                  <!-- Box (box_random): possible drops (rate list) + open count + Open button -->
                  <template v-else-if="selectedItem && selectedItem.actions?.is_box_random">
                    <h4 class="item-detail-properties-title">{{ t('component.bag.itemDetail.possibleDrops') || 'Possible drops' }}</h4>
                    <div class="item-detail-properties">
                      <div 
                        v-for="(entry, idx) in boxRateList" 
                        :key="'rate-' + idx"
                        class="item-detail-property"
                      >
                        <span class="item-detail-property-key">{{ entry.label }}</span>
                        <span class="item-detail-property-value">{{ entry.rate }}% × {{ entry.count }}</span>
                      </div>
                    </div>
                    <div class="item-detail-open-count">
                      <label class="item-detail-open-count-label">{{ t('component.bag.itemDetail.openCount') || 'Open count' }}:</label>
                      <input 
                        v-model.number="openBoxCount" 
                        type="number" 
                        min="1" 
                        :max="selectedItem.quantity || 1"
                        class="item-detail-open-count-input"
                      >
                    </div>
                    <div class="item-detail-actions">
                      <button 
                        class="btn-wear" 
                        :disabled="openingBox || !openBoxCount || openBoxCount < 1 || openBoxCount > (selectedItem.quantity || 0)"
                        @click="handleOpenBox(selectedItem)"
                      >
                        {{ openingBox ? (t('component.bag.openBoxOpening') || 'Opening...') : (t('component.bag.openBox') || 'Open') }}
                      </button>
                    </div>
                  </template>
                </div>
              </div>
            </div>
            <div class="cup-item box-item-h-lg float-left">
              <img :src="getImageUrl('bag.cup')" alt="Cup">
              <span>---</span>
            </div>
            <div class="craft-item float-left box-item-smm event">
              <img :src="getImageUrl('bag.event')" alt="Event">
            </div>
            <div class="craft-item float-left box-item-smm friend">
              <img :src="getImageUrl('bag.friend')" alt="Friend">
            </div>
            <div class="craft-item float-left box-item-smm top">
              <img :src="getImageUrl('bag.top')" alt="Top">
            </div>
            <div class="bonus-item box-item-h-lg float-left">
              <img :src="getImageUrl('bag.bonus')" alt="Bonus">
              <span>---</span>
            </div>
            <div class="power-display-wrapper">
              <div class="power-display" :style="powerBackgroundStyle">
                <div class="power-title">{{ t('component.bag.power') }}</div>
                <div class="power-value">{{ formatPower(userPower) }}</div>
              </div>
            </div>
            <!-- Set Bonuses Card (position absolute, right of item-detail-panel) -->
            <div 
              v-if="selectedItem && isSelectedItemWorn && setBonusesForSelectedItem.length > 0"
              class="set-bonus-card"
            >
              <div class="set-bonus-card-header">
                <h3 class="set-bonus-card-title">{{ t('component.bag.itemDetail.setBonuses') }}</h3>
              </div>
              <div class="set-bonus-card-body">
                <div 
                  v-for="(bonusData, index) in setBonusesForSelectedItem"
                  :key="'set-bonus-' + index"
                  class="set-bonus-item"
                  :data-bonus-index="index"
                  ref="bonusItemRefs"
                >
                  <div class="set-bonus-header">
                    <span class="set-bonus-set-name">{{ bonusData.setName }}</span>
                    <span class="set-bonus-count">({{ bonusData.itemCount }}/{{ bonusData.totalItems }})</span>
                  </div>
                  <div class="set-bonus-content">
                    <div 
                      v-for="(bonus, level) in bonusData.bonuses"
                      :key="'bonus-' + level"
                      class="set-bonus-level"
                    >
                      <span class="set-bonus-level-label">{{ level === 'full' ? t('component.bag.itemDetail.fullSetBonus') : `${level} ${t('component.bag.itemDetail.items')}` }}:</span>
                      <div class="set-bonus-stats">
                        <template v-for="(value, statKey) in bonus" :key="'stat-' + statKey">
                          <span class="set-bonus-stat-inline">
                            <span class="item-detail-property-key">{{ formatPropertyKey(statKey) }}:</span>
                            <span class="item-detail-property-value">+{{ value }}</span>
                          </span>
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg12-5 right-wp-gear">
          <div 
            class="col-lg12-9 right-wp-gear-list right-wp-gear-package-data right-wp-gear-package-data-all show"
            @dragover="handleBagDragOver($event)"
            @dragleave="handleBagDragLeave"
            @drop="handleBagDrop($event)"
          >
            <ItemBox 
              v-for="(item, index) in bagItems" 
              :key="index"
              :image="item && item.key_image ? getImageUrl(item.key_image) : null"
              :is-empty="!item || !item.key_image"
              :quantity="item && item.quantity ? item.quantity : null"
              :draggable="item && item.actions?.is_gear"
              @click="handleItemClick(item)"
              @dblclick="handleItemDoubleClick(item)"
              @dragstart="handleDragStart($event, item)"
            />
          </div>
          <div class="col-lg12-3 menu-item-bag-data">
            <div 
              class="menu-package-right menu-item-bag item" 
              :class="{ active: currentFilter === 'bag' }"
              @click="filterBag('bag')"
            >
              <img :src="getImageUrl('bag.bag')" alt="Bag">
            </div>
            <div 
              class="menu-package-right menu-item-bag item" 
:class="{ active: currentFilter === itemC.ITEM_TYPE_SWORD }"
                @click="filterBag(itemC.ITEM_TYPE_SWORD)"
            >
              <img :src="getImageUrl('bag.sword')" alt="Sword">
            </div>
            <div 
              class="menu-package-right menu-item-bag item" 
              :class="{ active: currentFilter === 'other' }"
              @click="filterBag('other')"
            >
              <img :src="getImageUrl('bag.bracelet')" alt="Other">
            </div>
            <div 
              class="menu-package-right menu-item-bag item" 
              :class="{ active: currentFilter === 'shop' }"
              @click="filterBag('shop')"
            >
              <img :src="getImageUrl('bag.shop')" alt="Shop">
            </div>
          </div>
          <div class="col-lg12-12 coin-and-orther">
            <div class="number">
              <img :src="getImageUrl('global.coin')" alt="Coin">
              <span>{{ coinAmount }}</span>
            </div>
            <div class="number">
              <img :src="getImageUrl('global.box_coin')" alt="Box Coin">
              <span>{{ boxCoinAmount }}</span>
            </div>
            <div class="number">
              <img :src="getImageUrl('bag.ruby')" alt="Ruby">
              <span>{{ rubyAmount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Rewards popup (center screen) after opening box -->
    <div 
      v-if="rewardsPopupVisible" 
      class="rewards-popup-overlay"
      @click="closeRewardsPopup"
    >
      <div class="rewards-popup" @click.stop>
        <h3 class="rewards-popup-title">{{ t('component.bag.openBoxRewards') || 'You received' }}</h3>
        <div class="rewards-popup-list">
          <div 
            v-for="(r, i) in rewardsPopupRewards" 
            :key="i"
            class="rewards-popup-item"
          >
            <span class="rewards-popup-item-name">{{ r.name || ('Item #' + r.setting_item_id) }}</span>
            <span class="rewards-popup-item-qty">× {{ r.quantity }}</span>
          </div>
        </div>
        <button class="rewards-popup-close" @click="closeRewardsPopup">
          {{ t('component.bag.close') || 'Close' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, computed, unref, onMounted, watch, nextTick } from 'vue'
const gameApi = inject('gameApi')
import ItemBox from '../../components/game/ItemBox.vue'
import ExpBar from '../../components/game/ExpBar.vue'
import LevelBadge from '../../components/game/LevelBadge.vue'
import { getFileImageUrl } from '../../utils/imageResolverRuntime'
import { getStatName } from '../../utils/globalData'
import { getItemConstants } from '../../utils/constants'
const itemC = getItemConstants()
const translator = inject('translator', null)
const userData = inject('userData', null)
const gearWearConfig = inject('gearWearConfig', null)
const updateUserData = inject('updateUserData', null)
const getStatNameFunc = inject('getStatName', getStatName)
const showAlert = inject('showAlert', (msg) => alert(msg))
const t = translator || ((key) => key)

// Fake data for game items
const coinAmount = ref(0)
const boxCoinAmount = ref(0)
const rubyAmount = ref(0)
const userPower = ref(0)
const userLevel = ref(1)
const currentExp = ref(0)
const totalExpNeeded = ref(100)

// Selected item for detail panel
const selectedItem = ref(null)
const itemDetailPanelRef = ref(null)
const bonusItemRefs = ref([])
const linesSvgRef = ref(null)
const linePathRef = ref('')

// Worn gears from userData
const wornGears = ref({})

// Dragging state
const draggingItem = ref(null)
const dragOverSlot = ref(null)

// Open box (box_random) state
const openingBox = ref(false)
const openBoxCount = ref(1)
const rewardsPopupVisible = ref(false)
const rewardsPopupRewards = ref([])

// Debounce timer for reloading userData
let reloadUserDataTimer = null

// Computed property to normalize property/properties for template compatibility
const selectedItemProperties = computed(() => {
  if (!selectedItem.value) return null
  return selectedItem.value.property || selectedItem.value.properties || null
})

// Box (box_random) rate list for detail: { label, rate (%), count }
const boxRateList = computed(() => {
  const prop = selectedItemProperties.value
  const list = prop?.rate_list
  if (!Array.isArray(list) || list.length === 0) return []
  const totalWeight = list.reduce((sum, e) => sum + (parseFloat(e.rate) || 0), 0) || 1
  return list.map((e) => ({
    label: e.item_name || e.name || ((t('component.bag.itemDetail.item') || 'Item') + ' #' + (e.setting_item_id ?? '?')),
    rate: totalWeight > 0 ? ((parseFloat(e.rate) || 0) / totalWeight * 100).toFixed(1) : '0',
    count: Math.max(1, parseInt(e.count, 10) || 1)
  }))
})

// Get current_sets and gears_sets from userData
const currentSets = computed(() => {
  const userDataValue = unref(userData)
  return userDataValue?.current_sets || []
})

const gearsSets = computed(() => {
  const userDataValue = unref(userData)
  return userDataValue?.gears_sets || {}
})

// Get set bonuses for the selected item (if it's worn)
const setBonusesForSelectedItem = computed(() => {
  if (!selectedItem.value || !isSelectedItemWorn.value) {
    return []
  }

  const slotKey = selectedItem.value._wornSlotKey
  if (!slotKey) return []

  // Get set indices for this slot from gears_sets
  const setIndices = gearsSets.value[slotKey] || []
  if (setIndices.length === 0) return []

  // Get set data from current_sets
  const bonuses = []
  setIndices.forEach(index => {
    const set = currentSets.value[index]
    if (set && set.current_bonus && Object.keys(set.current_bonus).length > 0) {
      bonuses.push({
        setName: set.set_name || `Set ${set.set_id}`,
        itemCount: set.item_count,
        totalItems: set.total_items,
        bonuses: set.current_bonus
      })
    }
  })

  return bonuses
})

// Calculate smooth line path from detail panel to bonus card (called after DOM is ready)
// SVG lives inside hero-show-wrapper so coordinates are relative to that container
const updateLinePath = () => {
  linePathRef.value = ''
  if (!itemDetailPanelRef.value) return

  const bonusCard = document.querySelector('.set-bonus-card')
  if (!bonusCard) return

  const svg = linesSvgRef.value
  // Container is hero-show-wrapper (same as SVG parent) – has min-height so coordinates are correct
  const container = svg?.parentElement
  if (!container) return

  const detailPanel = itemDetailPanelRef.value
  const containerRect = container.getBoundingClientRect()
  const detailRect = detailPanel.getBoundingClientRect()
  const bonusRect = bonusCard.getBoundingClientRect()

  // Coordinates relative to hero-show-wrapper (same as SVG viewport)
  const startX = detailRect.right - containerRect.left
  const startY = detailRect.top + detailRect.height / 2 - containerRect.top
  const endX = bonusRect.left - containerRect.left
  const endY = bonusRect.top + bonusRect.height / 2 - containerRect.top

  if (isNaN(startX) || isNaN(startY) || isNaN(endX) || isNaN(endY)) return

  const controlX1 = startX + (endX - startX) * 0.5
  const controlY1 = startY - 40
  const controlX2 = endX - (endX - startX) * 0.5
  const controlY2 = endY - 40

  linePathRef.value = `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`
}

// Watch for changes and update line path after DOM/layout is ready
watch([selectedItem, setBonusesForSelectedItem], async () => {
  linePathRef.value = ''
  if (!selectedItem.value || !isSelectedItemWorn.value || setBonusesForSelectedItem.value.length === 0) return

  await nextTick()
  // Wait for refs and layout (two frames so getBoundingClientRect is correct)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      updateLinePath()
    })
  })
}, { deep: true })

// Check if selected item is currently worn
const isSelectedItemWorn = computed(() => {
  if (!selectedItem.value) return false
  
  // If selectedItem has _wornSlotKey, it's definitely worn
  if (selectedItem.value._wornSlotKey) return true
  
  // Otherwise check by item_id (for items clicked from bag)
  if (selectedItem.value.item_id) {
    return Object.values(wornGears.value).some(gear => 
      gear && gear.item_id === selectedItem.value.item_id
    )
  }
  
  // Also check by id (UserBagItem id)
  if (selectedItem.value.id) {
    // We need to check if this UserBagItem id matches any worn gear
    // Since worn gears store item_id (SettingItem id), not UserBagItem id,
    // we need to check if the selected item's item_id matches
    if (selectedItem.value.item_id) {
      return Object.values(wornGears.value).some(gear => 
        gear && gear.item_id === selectedItem.value.item_id
      )
    }
  }
  
  return false
})

// Find which slot the selected item is worn in
const getWornSlotKey = computed(() => {
  if (!selectedItem.value) return null
  
  // If selectedItem has _wornSlotKey, use that (set when clicking worn gear slot)
  if (selectedItem.value._wornSlotKey) {
    return selectedItem.value._wornSlotKey
  }
  
  // Otherwise find by item_id
  if (selectedItem.value.item_id) {
    for (const [slotKey, gear] of Object.entries(wornGears.value)) {
      if (gear && gear.item_id === selectedItem.value.item_id) {
        return slotKey
      }
    }
  }
  
  return null
})

// Current filter type (default to 'bag' which shows bag items)
const currentFilter = ref('bag')

// Map item_type to translation key
const getKeyImageManifest = (itemType) => {
  return `bag.${itemType}`
}
// Map item_type to translation key
const getItemTypeName = (itemType) => {
  return t(`component.types.${itemType}`)
}

// Convert config slot to display format
const convertSlotToDisplay = (slot) => {
  if(wornGears.value[slot.key]){
    return {
      key: slot.key,
      item_type: wornGears.value[slot.key].item_type,
      name: wornGears.value[slot.key].item.name,
      image: wornGears.value[slot.key].item.image
    }
  }
  return {
    key: slot.key,
    item_type: slot.item_type,
    name: getItemTypeName(slot.item_type),
    key_image: getKeyImageManifest(slot.item_image_manifest)
  }
}

// Get gear slots from config or fallback to default
const mainWeapons = computed(() => {
  if (gearWearConfig.value && gearWearConfig.value.main_weapons) {
    return gearWearConfig.value.main_weapons.map(convertSlotToDisplay)
  }
  // Fallback to default structure
  return [
    { key: 'main-weapon-1', item_image_manifest: itemC.ITEM_TYPE_SWORD, item_type: itemC.ITEM_TYPE_SWORD },
    { key: 'main-weapon-2', item_image_manifest: itemC.ITEM_TYPE_SWORD, item_type: itemC.ITEM_TYPE_SWORD },
    { key: 'main-weapon-3', item_image_manifest: itemC.ITEM_TYPE_HAT, item_type: itemC.ITEM_TYPE_HAT },
    { key: 'main-weapon-4', item_image_manifest: itemC.ITEM_TYPE_SHIRT, item_type: itemC.ITEM_TYPE_SHIRT },
    { key: 'main-weapon-5', item_image_manifest: itemC.ITEM_TYPE_TROUSER, item_type: itemC.ITEM_TYPE_TROUSER },
    { key: 'main-weapon-6', item_image_manifest: itemC.ITEM_TYPE_SHOE, item_type: itemC.ITEM_TYPE_SHOE }
  ].map(convertSlotToDisplay)
})

const specialWeapons = computed(() => {
  if (gearWearConfig.value && gearWearConfig.value.special_weapons) {
    return gearWearConfig.value.special_weapons.map(convertSlotToDisplay)
  }
  // Fallback to default structure
  return [
    { key: 'special-weapon-1', item_image_manifest: itemC.ITEM_TYPE_NECKLACE, item_type: itemC.ITEM_TYPE_NECKLACE },
    { key: 'special-weapon-2', item_image_manifest: itemC.ITEM_TYPE_BRACELET, item_type: itemC.ITEM_TYPE_BRACELET },
    { key: 'special-weapon-3', item_image_manifest: itemC.ITEM_TYPE_RING, item_type: itemC.ITEM_TYPE_RING },
    { key: 'special-weapon-4', item_image_manifest: itemC.ITEM_TYPE_RING, item_type: itemC.ITEM_TYPE_RING }
  ].map(convertSlotToDisplay)
})

const specialItems = computed(() => {
  if (gearWearConfig.value && gearWearConfig.value.special_items) {
    return gearWearConfig.value.special_items.map(convertSlotToDisplay)
  }
  // Fallback to default structure
  return [
    { key: 'special-item-1', item_image_manifest: 'clothes', item_type: 'clothes' },
    { key: 'special-item-2', item_image_manifest: 'wing', item_type: 'wing' }
  ].map(convertSlotToDisplay)
})

// Initialize bag items with 50 empty slots
const MIN_BAG_ITEMS = 50
const bagItems = ref(
  Array.from({ length: MIN_BAG_ITEMS }, () => ({}))
)

// Store all item categories
const allItems = ref({
  bag: [],
  sword: [],
  other: [],
  shop: []
})

// Merge user bag items with empty slots
const initializeBagItems = () => {
  const userDataValue = unref(userData)
  if (!userDataValue) return
  
  // Update coin amounts and power from API
  if (userDataValue.coin !== undefined) {
    coinAmount.value = userDataValue.coin
  }
  if (userDataValue.box_coin !== undefined) {
    boxCoinAmount.value = userDataValue.box_coin
  }
  if (userDataValue.ruby !== undefined) {
    rubyAmount.value = userDataValue.ruby
  }
  if (userDataValue.power !== undefined) {
    userPower.value = userDataValue.power
  }
  if (userDataValue.lv !== undefined) {
    userLevel.value = userDataValue.lv
  }
  if (userDataValue.exp !== undefined) {
    currentExp.value = userDataValue.exp
  }
  if (userDataValue.exp_needed !== undefined) {
    totalExpNeeded.value = userDataValue.exp_needed
  }
  if (userDataValue.gears !== undefined) {
    wornGears.value = userDataValue.gears || {}
  }
  if (userDataValue.gear_wear_config !== undefined) {
    // gearWearConfig is provided globally, but we can also update it here if needed
    // The config should already be set from RewardPlayPage
  }
  
  // Update displayed items based on current filter
  updateDisplayedItems()
}

// Update displayed items based on current filter
const updateDisplayedItems = () => {
  const currentItems = allItems.value[currentFilter.value] || []
  const filledCount = currentItems.length
  const emptyCount = Math.max(0, MIN_BAG_ITEMS - filledCount)
  const emptySlots = Array.from({ length: emptyCount }, () => ({}))
  bagItems.value = [...currentItems, ...emptySlots]
}

// Map API user_bag items to frontend expected format (shared by loadBagData and saveGears response)
const mapBagItems = (items) => {
  if (!items || !Array.isArray(items)) return []
  return items.map(bi => ({
    id: bi.id,
    item: bi.item,
    item_type: bi.item_type,
    quantity: bi.quantity,
    property: bi.properties || {},
    key_image: bi.item?.image || 'bag.other',
    name: bi.item?.name || 'Gear',
    actions: bi.actions || {},
  }))
}

// Apply user_bag from API (getPlayerBag or saveGears response) to local allItems and refresh display
const applyUserBagToAllItems = (bagData) => {
  if (!bagData) return
  allItems.value.bag = mapBagItems(bagData.bag || [])
  allItems.value.sword = mapBagItems(bagData.sword || [])
  allItems.value.other = mapBagItems(bagData.other || [])
  allItems.value.shop = mapBagItems(bagData.shop || [])
  updateDisplayedItems()
}

const loadBagData = async () => {
  if (!gameApi) return
  try {
    const res = await gameApi.getPlayerBag()
    if (res.data?.datas?.user_bag) {
      applyUserBagToAllItems(res.data.datas.user_bag)
    }
  } catch (e) {
    console.error("Failed to load bag data", e)
  }
}

// Initialize bag items when component mounts
onMounted(() => {
  initializeBagItems()
  loadBagData()
})

// Watch for userData changes (in case it loads after component mounts)
watch(() => unref(userData), (newUserData) => {
  if (newUserData) {
    initializeBagItems()
  }
}, { deep: true, immediate: true })

const getImageUrl = (key) => getFileImageUrl(key)

// Set background image dynamically
const bagContentStyle = computed(() => {
  return {
    backgroundImage: `url('${getImageUrl('bag.background_bag')}')`
  }
})

// Pick a themed background for the power badge
const powerBackgroundKey = computed(() => {
  const userDataValue = unref(userData)
  if (userDataValue?.power_bg) {
    return userDataValue.power_bg
  }
  if (userPower.value >= 100000) return 'power.power_bg_3'
  if (userPower.value >= 10000) return 'power.power_bg_2'
  return 'power.power_bg_1'
})

const powerBackgroundStyle = computed(() => ({
  backgroundImage: `url('${getImageUrl(powerBackgroundKey.value)}')`
}))

/**
 * Check if an item can show details
 * Gear: property with custom_options or stats. Box: property with rate_list.
 * @param {Object} item - Item object to check
 * @returns {boolean} True if item can show details
 */
const canShowItemDetail = (item) => {
  if (!item) return false

  // Box (box_random): show detail when has rate_list (use response actions)
  if (item.actions?.is_box_random) {
    const property = item.property || item.properties
    const rateList = property?.rate_list
    return Array.isArray(rateList) && rateList.length > 0
  }

  // Gear: property with custom_options or stats
  const property = item.property || item.properties
  if (!property) return false

  const hasCustomOptions = property.custom_options &&
    (Array.isArray(property.custom_options) ? property.custom_options.length > 0 : true)
  const hasStats = property.stats &&
    typeof property.stats === 'object' &&
    Object.keys(property.stats).length > 0

  return hasCustomOptions || hasStats
}

const handleItemClick = (item) => {
  if (canShowItemDetail(item)) {
    selectedItem.value = item
    if (item.actions?.is_box_random) {
      openBoxCount.value = Math.max(1, Math.min(parseInt(item.quantity, 10) || 1, 99))
    }
  } else {
    selectedItem.value = null
  }
}

const closeRewardsPopup = () => {
  rewardsPopupVisible.value = false
  rewardsPopupRewards.value = []
}

const closeItemDetail = () => {
  selectedItem.value = null
}

const filterBag = (type) => {
  // Filter bag items by type
  currentFilter.value = type
  updateDisplayedItems()
  // Clear selected item when switching filters
  selectedItem.value = null
}

const formatPropertyKey = (key) => {
  // Use global getStatName function for default stats
  return getStatNameFunc(key)
}

const formatPower = (power) => {
  // Format power number: 125000 -> 125K, 1250000 -> 1.25M
  if (power >= 1000000) {
    return (power / 1000000).toFixed(2) + 'M'
  } else if (power >= 1000) {
    return (power / 1000).toFixed(0) + 'K'
  }
  return power.toString()
}

// Get gear for a specific slot
const getGearForSlot = (slotKey) => {
  return wornGears.value[slotKey] || null
}

// Get gear image for slot
const getGearImage = (slotKey) => {
  const gear = getGearForSlot(slotKey)
  if (gear && gear.item && gear.item.image) {
    return gear.item.image
  }
  return null
}

// Check if slot can accept item
const canAcceptItemSlotKey = (slotKey, itemCheck) => {
  if (!itemCheck) return false
  
  // Case 1: Check if item is gear (use response actions)
  if (!itemCheck.actions?.is_gear) {
    return false
  }
  
  // Get slot config from gearWearConfig
  let slotConfig = null
  if (gearWearConfig.value) {
    const allSlots = [
      ...(gearWearConfig.value.main_weapons || []),
      ...(gearWearConfig.value.special_weapons || []),
      ...(gearWearConfig.value.special_items || [])
    ]
    slotConfig = allSlots.find(slot => slot.key === slotKey)
  }
  
  // If no slot config found, fallback to computed slots
  if (!slotConfig) {
    const allComputedSlots = [...mainWeapons.value, ...specialWeapons.value, ...specialItems.value]
    const computedSlot = allComputedSlots.find(slot => slot.key === slotKey)
    if (!computedSlot) return false
    // For computed slots, we can't check item.type match, so just return true if item_type is gear
    return true
  }
  
  // Case 2: Check if itemCheck.item.type matches slot.item_type
  // itemCheck.item.type is the actual item type (sword, hat, etc.)
  // slot.item_type is the required type for that slot
  const itemActualType = itemCheck.item?.type || null
  if (itemActualType && slotConfig.item_type) {
    return itemActualType === slotConfig.item_type
  }
  
  // If item doesn't have item.type, fallback to checking if slot exists
  return true
}

// Reload userData from backend
const reloadUserData = async () => {
  if (!gameApi || !gameApi.getUserData) return

  try {
    const response = await gameApi.getUserData()
    if (response.data && response.data.success && response.data.datas) {
      if (userData.value) {
        Object.assign(userData.value, response.data.datas)
        // Update local refs
        if (userData.value.power !== undefined) {
          userPower.value = userData.value.power
        }
        if (userData.value.gears !== undefined) {
          wornGears.value = userData.value.gears || {}
        }
      }
    }
  } catch (error) {
    console.error('Error reloading userData:', error)
  }
}

// Schedule reload of userData after 5 seconds
const scheduleUserDataReload = () => {
  // Clear existing timer
  if (reloadUserDataTimer) {
    clearTimeout(reloadUserDataTimer)
  }

  // Set new timer for 5 seconds
  reloadUserDataTimer = setTimeout(() => {
    reloadUserData()
    reloadUserDataTimer = null
  }, 5000)
}

// Wear item to slot
const wearItemToSlot = async (item, slotKey) => {
  if (!item || !item.actions?.is_gear) {
    return false
  }

  if (!canAcceptItemSlotKey(slotKey, item)) {
    return false
  }

  // Get item ID (UserBagItem id)
  const itemId = item.id
  if (!itemId) {
    console.error('Item ID is required')
    return false
  }

  // Prepare gear mapping: only send slotKey -> itemId
  const gearMapping = { [slotKey]: itemId }

  // Save to database (backend will fetch real data)
  try {
    const response = await gameApi.saveGears(gearMapping)
    
    // Update worn gears from backend response (real data)
    if (response.data && response.data.datas && response.data.datas.gears) {
      wornGears.value = response.data.datas.gears
      
      // Update userData with backend-calculated values
      if (userData.value) {
        if (response.data.datas.power !== undefined) {
          userData.value.power = response.data.datas.power
          userPower.value = response.data.datas.power
        }
        if (response.data.datas.stats !== undefined) {
          userData.value.stats = response.data.datas.stats
        }
        userData.value.gears = response.data.datas.gears
      }
    }
    
    // Update local bag: wear removed 1 item (backend sub 1; if 0 removed and sorted)
    if (response.data?.datas?.user_bag) {
      applyUserBagToAllItems(response.data.datas.user_bag)
    }
    
    // Schedule reload of userData after 5 seconds (if no other wear action happens)
    scheduleUserDataReload()
  } catch (error) {
    console.error('Error saving gears:', error)
    return false
  }

  return true
}

// Find appropriate slot for item based on config
const findSlotForItem = (item) => {
  if (!item || !item.actions?.is_gear) return null
  
  // Get item's actual type (sword, hat, etc.) from item.type
  const itemActualType = item.item?.type || null
  if (!itemActualType) return null
  
  // Get all slots from config
  if (!gearWearConfig.value) return null
  
  const allSlots = [
    ...(gearWearConfig.value.main_weapons || []),
    ...(gearWearConfig.value.special_weapons || []),
    ...(gearWearConfig.value.special_items || [])
  ]
  
  // Find first slot that matches the item's type and is empty or can be replaced
  const matchingSlotEmpty = allSlots.find(slot => slot.item_type === itemActualType && !getGearForSlot(slot.key))
  const matchingSlot = allSlots.find(slot => slot.item_type === itemActualType)
  if (matchingSlotEmpty) {
    return matchingSlotEmpty.key
  }
  if (matchingSlot) {
    return matchingSlot.key
  }
  return null
}

// Handle wear button click
const handleWearItem = async (item) => {
  if (!item || !item.actions?.is_gear) return

  // Find appropriate slot based on item type and config
  const slotKey = findSlotForItem(item)
  if (!slotKey) {
    console.warn('No available slot found for item')
    return
  }
  
  const success = await wearItemToSlot(item, slotKey)
  
  if (success) {
    selectedItem.value = null
  }
}

// Handle double-click to wear
const handleItemDoubleClick = async (item) => {
  if (item && item.actions?.is_gear) {
    await handleWearItem(item)
  }
}

// Handle drag start
const handleDragStart = (event, item) => {
  if (item && item.actions?.is_gear) {
    draggingItem.value = item
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', '')
  }
}

// Handle drag over
const handleDragOver = (event, slotKey) => {
  if (draggingItem.value && canAcceptItemSlotKey(slotKey, draggingItem.value)) {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
    dragOverSlot.value = slotKey
  }
}

// Handle drag leave
const handleDragLeave = () => {
  dragOverSlot.value = null
}

// Handle drop
const handleDrop = async (event, slotKey) => {
  event.preventDefault()
  dragOverSlot.value = null
  
  if (draggingItem.value) {
    await wearItemToSlot(draggingItem.value, slotKey)
    draggingItem.value = null
  }
}

// Handle gear slot click to view detail
const handleGearSlotClick = (slotKey) => {
  const gear = getGearForSlot(slotKey)
  if (gear) {
    selectedItem.value = {
      ...gear,
      item_id: gear.item_id,
      item_type: gear.item_type,
      properties: gear.properties,
      key_image: gear.item?.image ? gear.item.image : null,
      name: gear.item?.name || 'Gear',
      _wornSlotKey: slotKey // Store slot key for easy reference
    }
  }
}

// Handle gear slot double click to unwear
const handleGearSlotDoubleClick = async (slotKey) => {
  const gear = getGearForSlot(slotKey)
  if (gear) {
    await handleUnwearItem(slotKey)
  }
}

// Handle gear slot drag start (for dragging worn gear to bag)
const handleGearSlotDragStart = (event, slotKey) => {
  const gear = getGearForSlot(slotKey)
  if (gear) {
    // Store the slot key in draggingItem so we can unwear it when dropped
    draggingItem.value = {
      ...gear,
      _wornSlotKey: slotKey,
      item_type: itemC.ITEM_TYPE_GEAR
    }
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', '')
  }
}

// Handle drag over bag area
const handleBagDragOver = (event) => {
  // Allow drop if dragging a worn gear
  if (draggingItem.value && draggingItem.value._wornSlotKey) {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }
}

// Handle drag leave bag area
const handleBagDragLeave = () => {
  // Optional: add visual feedback
}

// Handle drop on bag area (to unwear gear)
const handleBagDrop = async (event) => {
  event.preventDefault()
  
  if (draggingItem.value && draggingItem.value._wornSlotKey) {
    const slotKey = draggingItem.value._wornSlotKey
    await handleUnwearItem(slotKey)
    draggingItem.value = null
  }
}

// Handle unwear/remove gear
const handleUnwearItem = async (slotKey) => {
  if (!slotKey) return
  
  // Remove gear by sending null/0 to backend
  const gearMapping = { [slotKey]: 0 }
  
  try {
    const response = await gameApi.saveGears(gearMapping)
    
    // Update worn gears from backend response
    if (response.data && response.data.datas && response.data.datas.gears) {
      wornGears.value = response.data.datas.gears
      
      // Update userData with backend-calculated values
      if (userData.value) {
        if (response.data.datas.power !== undefined) {
          userData.value.power = response.data.datas.power
          userPower.value = response.data.datas.power
        }
        if (response.data.datas.stats !== undefined) {
          userData.value.stats = response.data.datas.stats
        }
        userData.value.gears = response.data.datas.gears
      }
    }
    
    // Update local bag: unwear added 1 item back (backend += if found, else add new)
    if (response.data?.datas?.user_bag) {
      applyUserBagToAllItems(response.data.datas.user_bag)
    }
    
    // Close detail panel
    selectedItem.value = null
    
    // Schedule reload of userData after 5 seconds
    scheduleUserDataReload()
  } catch (error) {
    console.error('Error removing gear:', error)
  }
}

// Open box_random item (consume openBoxCount from bag, grant random rewards; show center popup)
const handleOpenBox = async (item) => {
  if (!item || !item.actions?.is_box_random || !gameApi?.openBox || openingBox.value) return
  const count = Math.max(1, Math.min(openBoxCount.value || 1, item.quantity || 1, 99))
  openingBox.value = true
  try {
    const res = await gameApi.openBox(item.id, count)
    const datas = res.data?.datas
    if (datas?.user_bag) {
      applyUserBagToAllItems(datas.user_bag)
    }
    selectedItem.value = null
    rewardsPopupRewards.value = datas?.rewards ?? []
    rewardsPopupVisible.value = true
  } catch (e) {
    showAlert(e.response?.data?.message || e.message || (t('component.bag.openBoxFailed') || 'Failed to open'))
  } finally {
    openingBox.value = false
  }
}
</script>

<style scoped>
/* Grid System */
.table12 {
  width: 100%;
  display: block;
}

.table12-with-lines {
  position: relative;
}

.table12 .col-lg12-12 {
  display: block;
  float: left;
  width: 100%;
}

.table12 .col-lg12-11 {
  display: block;
  float: left;
  width: 91.66666667%;
}

.table12 .col-lg12-10 {
  display: block;
  float: left;
  width: 83.33333333%;
}

.table12 .col-lg12-9 {
  display: block;
  float: left;
  width: 75%;
}

.table12 .col-lg12-8 {
  display: block;
  float: left;
  width: 66.66666667%;
}

.table12 .col-lg12-7 {
  display: block;
  float: left;
  width: 58.33333333%;
}

.table12 .col-lg12-6 {
  display: block;
  float: left;
  width: 50%;
}

.table12 .col-lg12-5 {
  display: block;
  float: left;
  width: 41.66666667%;
}

.table12 .col-lg12-4 {
  display: block;
  float: left;
  width: 33.33333333%;
}

.table12 .col-lg12-3 {
  display: block;
  float: left;
  width: 25%;
}

.table12 .col-lg12-2 {
  display: block;
  float: left;
  width: 16.66666667%;
}

.table12 .col-lg12-1 {
  display: block;
  float: left;
  width: 8.33333333%;
}

.float-left {
  display: block;
  float: left;
}

/* Bag Content */
.bag-content {
  width: 100%;
  margin: 20px;
  height: calc(100% - 77px);
  display: inline-block;
  margin-top: 40px;
  background-size: cover;
}

.bag-content::-webkit-scrollbar {
  width: 0;
  background: transparent;
}

.bag-content .main {
  height: 95%;
  margin: 24px;
}

.box-item-weapon-main {
  display: inline-block;
  margin-top: 30px;
  margin-bottom: 30px;
  text-align: center;
}

.box-item-weapon-main .gear-slot {
  width: 111px;
  height: 111px;
  margin: 10px;
}

.box-item-weapon-main .gear-slot img {
  width: 82%;
  /* margin-top: 10px; */
  place-self: anchor-center;
}

.box-item-weapon-sp {
  display: inline-block;
  margin-bottom: 20px;
  text-align: center;
}

.box-item-weapon-sp .gear-slot {
  width: 111px;
  height: 111px;
  margin: 10px;
}

.box-item-weapon-sp .gear-slot img {
  width: 82%;
  place-self: anchor-center;
  /* margin-top: 10px; */
}

.box-item-weapon-sp-hit {
  text-align: center;
}

.box-item-weapon-sp-hit .gear-slot {
  width: 111px;
  height: 111px;
  margin: 10px;
}

.box-item-weapon-sp-hit .gear-slot img {
  width: 82%;
  /* margin-top: 10px; */
  place-self: anchor-center;
}

/* Right Weapon Gear */
.right-wp-gear {
  margin-top: 10px;
}

.box-item-h-lg {
  width: 100px;
  height: 140px;
  margin: 10px;
  background-size: cover;
  margin-top: -17% !important;
}

.box-item-smm {
  width: 50px;
  height: 50px;
  margin: 10px 45px;
  background-size: cover;
}

/* Hero Animation */
.hero-animation {
  position: relative;
}

.hero-show-wrapper {
  position: relative;
  display: block;
  width: 100%;
  min-height: 500px;
}

.hero-show {
  display: block;
  position: relative;
}

.hero-show img {
  width: 80%;
  margin-left: 83px;
}

.hero-animation .bonus-item {
  display: inline-block;
  margin-top: 5px;
  text-align: center;
}

.hero-animation .bonus-item img {
  width: 70%;
  margin-top: 10px;
}

.hero-animation .bonus-item span {
  margin-top: 2px;
  display: block;
}

.hero-animation .cup-item {
  display: inline-block;
  margin-top: 5px;
  text-align: center;
}

.hero-animation .cup-item img {
  width: 70%;
  margin-top: 10px;
}

.hero-animation .cup-item span {
  margin-top: 2px;
  display: block;
}

.hero-animation .craft-item {
  display: inline-block;
  margin-top: 5px;
  text-align: center;
}

.hero-animation .craft-item img {
  width: 70%;
  margin-top: 8px;
}

.cup-item, .bonus-item {
  display: inline-block;
  margin-top: 5px;
  text-align: center;
}

.cup-item span, .bonus-item span {
  margin-top: 2px;
  display: block;
}

.craft-item {
  display: inline-block;
  margin-top: 5px;
  text-align: center;
}

/* Power Display */
.power-display-wrapper {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  text-align: center;
  z-index: 10;
}

.power-display {
  display: inline-block;
  text-align: center;
  padding: 120px;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}

.power-display .power-title {
  display: block;
  color: aliceblue;
  font-family: Nanami, sans-serif;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.power-display .power-value {
  display: block;
  color: #f6a901;
  font-family: Nanami, sans-serif;
  font-size: 32px;
  font-weight: 700;
  text-shadow: 0 2px 6px rgba(246, 169, 1, 0.4);
  line-height: 1.2;
}

/* Coin and Other */
.coin-and-orther .number {
  margin: 1px 38px;
  display: inline-block;
  text-align: center;
  float: left;
}

.coin-and-orther .number img {
  width: 21px;
  display: block;
  float: left;
  margin-top: 9px;
}

.coin-and-orther .number span {
  display: block;
  float: left;
  margin-top: 10px;
  margin-left: 4px;
  color: dimgray;
  font-family: Nanami, sans-serif;
}

/* Right Weapon Gear List */
.right-wp-gear-list {
  height: 823px;
  overflow: auto;
}

.right-wp-gear-list::-webkit-scrollbar {
  width: 0;
  background: transparent;
}

/* Menu Item Bag */
.menu-item-bag-data {
  margin-top: 20px;
  height: 823px;
}

.menu-item-bag-data .menu-item-bag {
  display: block;
  text-align: center;
  width: 110px;
  height: 110px;
  margin: 18px 16px;
  background-size: cover;
  cursor: pointer;
  border: solid dimgray;
  transition: all 0.2s ease;
}

.menu-item-bag-data .menu-item-bag.active {
  border: solid #f6a901;
  border-width: 3px;
  box-shadow: 0 0 10px rgba(246, 169, 1, 0.5);
}

.menu-item-bag-data .menu-item-bag img {
  width: 70%;
  margin-top: 14px;
}

.show {
  display: block !important;
}

.hidden {
  display: none;
}

/* Item Detail Panel (absolute positioned, appears next to character) */
.item-detail-panel {
  position: absolute;
  top: 17px;
  left: 50%;
  transform: translateX(20px);
  z-index: 2;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 20px;
  width: 329px;
  font-family: Nanami, sans-serif;
  height: calc(100% + 32px);
  overflow-y: auto;
  z-index: 15;
}

.item-detail-panel.is-wear {
  right: 59%;
  left: auto;
  transform: translateX(0);
}

.item-detail-close {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(105, 105, 105, 0.2);
  border: 1px solid rgba(105, 105, 105, 0.4);
  border-radius: 50%;
  width: 28px;
  height: 28px;
  color: dimgray;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.item-detail-close:hover {
  background: rgba(255, 68, 68, 0.8);
  border-color: #ff4444;
  color: #fff;
}

.item-detail-header {
  text-align: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(105, 105, 105, 0.3);
}

.item-detail-image {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-bottom: 10px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.item-detail-name {
  margin: 0 0 8px 0;
  color: dimgray;
  font-family: Nanami, sans-serif;
  font-size: 18px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.item-detail-quantity {
  color: rgba(105, 105, 105, 0.8);
  font-family: Nanami, sans-serif;
  font-size: 12px;
}

.item-detail-body {
  margin-top: 15px;
}

.item-detail-properties-title {
  margin: 0 0 12px 0;
  color: dimgray;
  font-family: Nanami, sans-serif;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.item-detail-properties {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-detail-property {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: rgba(240, 240, 240, 0.8);
}

.item-detail-property.custom-option {
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.custom-option-properties {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  padding-left: 12px;
}

.custom-option-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  background: rgba(220, 220, 220, 0.6);
  border-radius: 6px;
  border: 1px solid rgba(105, 105, 105, 0.2);
  transition: all 0.2s ease;
}

.item-detail-property:hover {
  background: rgba(230, 230, 230, 0.9);
  border-color: rgba(105, 105, 105, 0.4);
}

.item-detail-property-key {
  color: dimgray;
  font-family: Nanami, sans-serif;
  font-size: 12px;
  font-weight: 500;
}

.item-detail-property-value {
  color: #f6a901;
  font-family: Nanami, sans-serif;
  font-size: 14px;
  font-weight: 700;
}

/* Item Detail Actions */
.item-detail-actions {
  padding: 15px 20px;
  border-top: 1px solid rgba(105, 105, 105, 0.3);
  margin-top: 10px;
}

.item-detail-open-count {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.item-detail-open-count-label {
  color: dimgray;
  font-family: Nanami, sans-serif;
  font-size: 13px;
  font-weight: 600;
}

.item-detail-open-count-input {
  width: 70px;
  padding: 6px 10px;
  border: 1px solid rgba(105, 105, 105, 0.4);
  border-radius: 6px;
  font-size: 14px;
  font-family: Nanami, sans-serif;
}

/* Rewards popup (center screen, same style as game get-item) */
.rewards-popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: rewards-fade-in 0.2s ease;
}

@keyframes rewards-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.rewards-popup {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 12px;
  padding: 24px;
  min-width: 280px;
  max-width: 90vw;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  font-family: Nanami, sans-serif;
}

.rewards-popup-title {
  margin: 0 0 16px 0;
  color: dimgray;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.rewards-popup-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.rewards-popup-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: rgba(240, 240, 240, 0.9);
  border-radius: 8px;
  border: 1px solid rgba(105, 105, 105, 0.2);
}

.rewards-popup-item-name {
  font-weight: 600;
  color: dimgray;
}

.rewards-popup-item-qty {
  color: rgba(105, 105, 105, 0.9);
  font-weight: 500;
}

.rewards-popup-close {
  width: 100%;
  padding: 12px 24px;
  background: linear-gradient(135deg, #f6a901 0%, #ff8c00 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-family: Nanami, sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.rewards-popup-close:hover {
  background: linear-gradient(135deg, #ff8c00 0%, #f6a901 100%);
}

.set-bonus-card-header {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(105, 105, 105, 0.3);
  background: rgba(240, 240, 240, 0.8);
  border-radius: 8px 8px 0 0;
}

.set-bonus-card-title {
  margin: 0;
  color: dimgray;
  font-family: Nanami, sans-serif;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
}

.set-bonus-card-body {
  padding: 12px;
}

.set-bonus-item {
  margin-bottom: 12px;
  padding: 10px 12px;
  background: rgba(240, 240, 240, 0.5);
  border: 1px solid rgba(105, 105, 105, 0.15);
  border-radius: 4px;
  position: relative;
}

.set-bonus-item:hover {
  background: rgba(230, 230, 230, 0.7);
  border-color: rgba(105, 105, 105, 0.3);
}

.set-bonus-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.set-bonus-set-name {
  color: dimgray;
  font-family: Nanami, sans-serif;
  font-size: 13px;
  font-weight: 600;
}

.set-bonus-count {
  color: rgba(105, 105, 105, 0.7);
  font-family: Nanami, sans-serif;
  font-size: 11px;
}

.set-bonus-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.set-bonus-level {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.set-bonus-level-label {
  color: dimgray;
  font-family: Nanami, sans-serif;
  font-size: 11px;
  font-weight: 500;
  margin-bottom: 2px;
}

.set-bonus-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-left: 0;
}

.set-bonus-stat-inline {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* SVG Lines for connecting detail to bonuses – inside hero-show-wrapper so path coords match */
.set-bonus-lines {
  position: absolute;
  top: 57px;
  left: 110px;
  width: 100%;
  height: 100%;
  min-height: 500px;
  pointer-events: none;
  z-index: 1;
  overflow: visible;
}

.set-bonus-card {
  position: absolute;
  top: 17px;
  /* Right of item-detail-panel when worn (panel has right: 59%, so panel ends at 41% from left) */
  left: calc(41% + 20px);
  width: 280px;
  max-height: 500px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(105, 105, 105, 0.3);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 2;
  overflow-y: auto;
}

.bonus-line {
  fill: none;
  stroke: #f6a901;
  stroke-width: 2;
  stroke-opacity: 0.6;
  stroke-dasharray: 5, 5;
  animation: dash 2s linear infinite;
}

@keyframes dash {
  to {
    stroke-dashoffset: -20;
  }
}

.btn-wear {
  width: 100%;
  padding: 12px 24px;
  background: linear-gradient(135deg, #f6a901 0%, #ff8c00 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-family: Nanami, sans-serif;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(246, 169, 1, 0.3);
}

.btn-wear:hover {
  background: linear-gradient(135deg, #ff8c00 0%, #f6a901 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(246, 169, 1, 0.4);
}

.btn-wear:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(246, 169, 1, 0.3);
}

.btn-wear:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-exit {
  width: 100%;
  padding: 12px 24px;
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-exit:hover {
  background: linear-gradient(135deg, #c82333 0%, #dc3545 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(220, 53, 69, 0.4);
}

.btn-exit:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
}

/* Gear Slots */
.gear-slot {
  position: relative;
  width: 111px;
  height: 111px;
  margin: 10px;
  background-size: cover;
  display: inline-block;
  text-align: center;
  cursor: pointer;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjYiIGhlaWdodD0iNjYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjY2IiBoZWlnaHQ9IjY2IiBmaWxsPSIjM0EzQTNBIiBzdHJva2U9IiM1NTUiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==');
  transition: all 0.2s ease;
  border: 2px solid transparent;
  border-radius: 4px;
}

.gear-slot img {
  width: 100%;
  padding: 8px;
  display: block;
  object-fit: contain;
}

.gear-slot-worn {
  border: 2px solid #f6a901;
  box-shadow: 0 0 10px rgba(246, 169, 1, 0.5);
  background-color: rgba(246, 169, 1, 0.1);
}

.gear-slot-highlight {
  border: 3px solid #00ff00;
  box-shadow: 0 0 15px rgba(0, 255, 0, 0.7);
  background-color: rgba(0, 255, 0, 0.2);
  transform: scale(1.05);
}

.gear-slot:hover {
  border-color: #f6a901;
  box-shadow: 0 0 8px rgba(246, 169, 1, 0.4);
}

.gear-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 8px;
}

.gear-placeholder {
  width: 100%;
  padding: 8px;
  display: block;
  object-fit: contain;
  opacity: 0.6;
}
</style>
