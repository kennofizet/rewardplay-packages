<template>
  <div class="bag-content" :style="bagContentStyle">
    <div class="main">
      <div class="table12">
        <div class="col-lg12-7 hero-gear hero-info">
          <div class="left-wp-gear col-lg12-4">
            <div class="box-item-weapon-main">
              <ItemBox 
                v-for="item in mainWeapons" 
                :key="item.key"
                :image="getImageUrl(item.key_image)"
                :alt="item.name"
              />
            </div>
            <div class="box-item-weapon-sp">
              <ItemBox 
                v-for="item in specialWeapons" 
                :key="item.key"
                :image="getImageUrl(item.key_image)"
                :alt="item.name"
              />
            </div>
            <div class="box-item-weapon-sp-hit">
              <ItemBox 
                v-for="item in specialItems" 
                :key="item.key"
                :image="getImageUrl(item.key_image)"
                :alt="item.name"
              />
            </div>
          </div>
          <div class="hero-animation col-lg12-8">
            <div class="col-lg12-12 hero-show-wrapper">
              <div class="hero-show">
                <img :src="getImageUrl('character.hero')" alt="Hero">
              </div>
              <!-- Item Detail Panel (absolute positioned, appears next to character) -->
              <div v-if="selectedItem && selectedItem.property" class="item-detail-panel">
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
                  <h4 class="item-detail-properties-title">{{ t('component.bag.itemDetail.properties') }}</h4>
                  <div class="item-detail-properties">
                    <div 
                      v-for="(value, key) in selectedItem.property" 
                      :key="key"
                      class="item-detail-property"
                    >
                      <span class="item-detail-property-key">{{ formatPropertyKey(key) }}:</span>
                      <span class="item-detail-property-value">{{ value }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="cup-item box-item-h-lg float-left">
              <img :src="getImageUrl('bag.cup')" alt="Cup">
              <span>buff top 1: 10% coin</span>
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
              <span>{{ t('component.bag.buffCheckin') }} <span>{{ bonusCheckin }}%</span></span>
            </div>
            <div class="power-display-wrapper">
              <div class="power-display" :style="powerBackgroundStyle">
                <div class="power-title">{{ t('component.bag.power') }}</div>
                <div class="power-value">{{ formatPower(userPower) }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg12-5 right-wp-gear">
          <div class="col-lg12-9 right-wp-gear-list right-wp-gear-package-data right-wp-gear-package-data-all show">
            <ItemBox 
              v-for="(item, index) in bagItems" 
              :key="index"
              :image="item && item.key_image ? getImageUrl(item.key_image) : null"
              :is-empty="!item || !item.key_image"
              :quantity="item && item.quantity ? item.quantity : null"
              @click="handleItemClick(item)"
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
              :class="{ active: currentFilter === 'sword' }"
              @click="filterBag('sword')"
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
  </div>
</template>

<script setup>
import { ref, inject, computed, unref, onMounted, watch } from 'vue'
import ItemBox from '../../components/game/ItemBox.vue'
import { getFileImageUrl } from '../../utils/imageResolverRuntime'
const translator = inject('translator', null)
const userData = inject('userData', null)
const t = translator || ((key) => key)

// Fake data for game items
const bonusCheckin = ref(10)
const coinAmount = ref(0)
const boxCoinAmount = ref(0)
const rubyAmount = ref(0)
const userPower = ref(0)

// Selected item for detail panel
const selectedItem = ref(null)

// Current filter type (default to 'bag' which shows bag items)
const currentFilter = ref('bag')

const mainWeapons = computed(() => [
  { key: 'main-weapon-1', name: t('component.bag.sword'), key_image: 'bag.sword' },
  { key: 'main-weapon-2', name: t('component.bag.sword'), key_image: 'bag.sword' },
  { key: 'main-weapon-3', name: t('component.bag.hat'), key_image: 'bag.hat' },
  { key: 'main-weapon-4', name: t('component.bag.shirt'), key_image: 'bag.shirt' },
  { key: 'main-weapon-5', name: t('component.bag.trouser'), key_image: 'bag.trouser' },
  { key: 'main-weapon-6', name: t('component.bag.shoe'), key_image: 'bag.shoe' }
])

const specialWeapons = computed(() => [
  { key: 'special-weapon-1', name: t('component.bag.necklace'), key_image: 'bag.necklace' },
  { key: 'special-weapon-2', name: t('component.bag.bracelet'), key_image: 'bag.bracelet' },
  { key: 'special-weapon-3', name: t('component.bag.ring'), key_image: 'bag.ring' },
  { key: 'special-weapon-4', name: t('component.bag.ring'), key_image: 'bag.ring' }
])

const specialItems = computed(() => [
  { key: 'special-item-1', name: t('component.bag.clothes'), key_image: 'bag.clothes' },
  { key: 'special-item-2', name: t('component.bag.wing'), key_image: 'bag.wing' }
])

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
  
  // Merge items with item details for each category
  const itemDetails = userDataValue.item_detail || {}
  
  // Helper function to enrich items with details
  const enrichItems = (items) => {
    return items.map(item => {
      const itemId = item.item_id || item.id
      const itemDetail = itemDetails[itemId]
      if (itemDetail) {
        return {
          id: item.id,
          item_id: item.item_id || item.id,
          quantity: item.quantity,
          property: item.property || {},
          key_image: itemDetail.key_image,
          name: itemDetail.name,
        }
      }
      return item
    })
  }
  
  // Enrich all categories from user_bag
  const userBag = userDataValue.user_bag || {}
  allItems.value.bag = enrichItems(userBag.bag || [])
  allItems.value.sword = enrichItems(userBag.sword || [])
  allItems.value.other = enrichItems(userBag.other || [])
  allItems.value.shop = enrichItems(userBag.shop || [])
  
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

// Initialize bag items when component mounts
onMounted(() => {
  initializeBagItems()
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

const handleItemClick = (item) => {
  // Only show detail panel if item has data (has item_id or id, and has property)
  if (item && (item.item_id || item.id) && item.property) {
    selectedItem.value = item
  } else {
    selectedItem.value = null
  }
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
  // Format property keys: crit_dmg -> Crit Dmg, crit -> Crit
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
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
</script>

<style scoped>
/* Grid System */
.table12 {
  width: 100%;
  display: block;
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

/* Item Box */
.item-box {
  width: 111px;
  height: 111px;
  margin: 10px;
  background-size: cover;
}

.box-item-weapon-main {
  display: inline-block;
  margin-top: 30px;
  margin-bottom: 30px;
  text-align: center;
}

.box-item-weapon-main .item-box img {
  width: 70%;
  margin-top: 10px;
}

.box-item-weapon-sp {
  display: inline-block;
  margin-bottom: 20px;
  text-align: center;
}

.box-item-weapon-sp .item-box img {
  width: 70%;
  margin-top: 10px;
}

.box-item-weapon-sp-hit {
  text-align: center;
}

.box-item-weapon-sp-hit .item-box img {
  width: 70%;
  margin-top: 10px;
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

.right-wp-gear-list .item-box {
  display: inline-block;
  text-align: center;
}

.right-wp-gear-list .item-box img {
  width: 70%;
  margin-top: 10px;
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
  z-index: 1;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 20px;
  width: 329px;
  font-family: Nanami, sans-serif;
  height: calc(100% + 32px);
  overflow-y: auto;
  z-index: 11;
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
</style>
