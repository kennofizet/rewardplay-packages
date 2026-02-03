<template>
  <div class="shop-page">
    <!-- Left: item detail panel (fixed width, full height) -->
    <aside class="shop-detail" :class="{ 'shop-detail--empty': !selectedItem }">
      <div class="shop-detail__inner">
        <template v-if="selectedItem">
          <div class="shop-detail__image-wrap">
            <img
              :src="getImageUrl(selectedItem.image)"
              :alt="selectedItem.name"
              class="shop-detail__image"
            >
          </div>
          <h2 class="shop-detail__name">{{ selectedItem.name }}</h2>
          <p class="shop-detail__desc">{{ selectedItem.description }}</p>
          <div v-if="hasShopItemOptions" class="shop-detail__options">
            <h4 class="shop-detail__options-title">{{ t('component.shop.detail.options') }}</h4>
            <ul class="shop-detail__options-list">
              <template v-if="selectedItem.options?.stats && Object.keys(selectedItem.options.stats).length">
                <li
                  v-for="(val, key) in selectedItem.options.stats"
                  :key="'stat-' + key"
                  class="shop-detail__option"
                >
                  <span class="shop-detail__option-key">{{ formatOptionKey(key) }}:</span>
                  <span class="shop-detail__option-val">{{ formatOptionVal(val) }}</span>
                </li>
              </template>
              <template v-if="Array.isArray(selectedItem.options?.custom_options) && selectedItem.options.custom_options.length">
                <li
                  v-for="(co, idx) in selectedItem.options.custom_options"
                  :key="'custom-' + idx"
                  class="shop-detail__option shop-detail__option--custom"
                >
                  <span class="shop-detail__option-key">{{ co.name }}:</span>
                  <span class="shop-detail__option-val">{{ formatOptionVal(co.properties) }}</span>
                </li>
              </template>
              <template v-else-if="Array.isArray(selectedItem.options?.rate_list) && selectedItem.options.rate_list.length">
                <li class="shop-detail__option shop-detail__option--label">
                  <span class="shop-detail__option-key">{{ t('component.shop.detail.possibleDrops') || 'Possible drops' }}</span>
                </li>
                <li
                  v-for="(entry, idx) in formatRateListForDisplay(selectedItem.options.rate_list)"
                  :key="'rate-' + idx"
                  class="shop-detail__option"
                >
                  <span class="shop-detail__option-key">{{ entry.label }}</span>
                  <span class="shop-detail__option-val">{{ entry.rate }}% × {{ entry.count }}</span>
                </li>
              </template>
              <template v-else-if="selectedItem.options && !selectedItem.options.stats && !selectedItem.options.custom_options && !(Array.isArray(selectedItem.options.rate_list) && selectedItem.options.rate_list.length) && Object.keys(selectedItem.options).length">
                <li
                  v-for="(val, key) in selectedItem.options"
                  :key="key"
                  class="shop-detail__option"
                >
                  <span class="shop-detail__option-key">{{ formatOptionKey(key) }}:</span>
                  <span class="shop-detail__option-val">{{ formatOptionVal(val) }}</span>
                </li>
              </template>
            </ul>
          </div>

          <!-- Full price list -->
          <div class="shop-detail__prices">
            <h4 class="shop-detail__prices-title">{{ t('component.shop.detail.priceTitle') }}</h4>
            <template v-if="selectedPrices.length > 0">
              <div
                v-for="(p, i) in selectedPrices"
                :key="i"
                class="shop-detail__price-row"
              >
                <img v-if="getPriceIconKey(p)" :src="getImageUrl(getPriceIconKey(p))" :alt="getPriceLabel(p)" class="shop-detail__price-icon">
                <span class="shop-detail__price-label">{{ getPriceLabel(p) }}</span>
                <span class="shop-detail__price-value">{{ totalForPrice(p) }}</span>
                <span v-if="detailQuantity > 1" class="shop-detail__price-unit">({{ p.value }} × {{ detailQuantity }})</span>
              </div>
            </template>
            <span v-else class="shop-detail__price-free">{{ t('component.shop.detail.free') }}</span>
          </div>

          <!-- Quantity -->
          <div class="shop-detail__quantity">
            <label class="shop-detail__quantity-label">{{ t('component.shop.detail.quantity') }}</label>
            <div class="shop-detail__quantity-control">
              <button
                type="button"
                class="shop-detail__qty-btn"
                :disabled="detailQuantity <= 1"
                @click="detailQuantity = Math.max(1, detailQuantity - 1)"
              >−</button>
              <input
                v-model.number="detailQuantity"
                type="number"
                min="1"
                max="999"
                class="shop-detail__qty-input"
                @input="clampQuantity"
              >
              <button
                type="button"
                class="shop-detail__qty-btn"
                :disabled="detailQuantity >= 999"
                @click="detailQuantity = Math.min(999, detailQuantity + 1)"
              >+</button>
            </div>
          </div>

          <!-- Not enough warning -->
          <p v-if="selectedItem && !canAfford" class="shop-detail__not-enough">
            {{ t('component.shop.detail.notEnoughToBuy') }}
          </p>

          <!-- Buy button -->
          <div class="shop-detail__actions">
            <button
              type="button"
              class="shop-detail__buy-btn"
              :disabled="!canAfford"
              @click="handleBuy"
            >
              {{ t('component.shop.detail.buy') }}
            </button>
          </div>
        </template>
        <template v-else>
          <p class="shop-detail__placeholder">{{ t('component.shop.detail.selectItem') }}</p>
        </template>
      </div>
    </aside>

    <!-- Right: category menu + item grid -->
    <main class="shop-main">
      <div v-if="loading" class="shop-loading">{{ t('component.shop.loading') || 'Loading...' }}</div>
      <template v-else>
        <div class="shop-categories">
          <button
            v-for="cat in shopCategoryKeys"
            :key="cat"
            type="button"
            class="shop-category"
            :class="{ 'shop-category--active': category === cat }"
            @click="category = cat"
          >
            {{ t(`component.shop.category.${cat}`) }}
          </button>
        </div>
        <div v-if="!filteredItems.length" class="shop-empty">{{ t('component.shop.empty') || 'No shop items available.' }}</div>
        <div v-else class="shop-grid">
          <button
            v-for="item in filteredItems"
            :key="item.id"
            type="button"
            class="shop-item"
            :class="{ 'shop-item--selected': selectedItem?.id === item.id }"
            @click="selectItem(item)"
          >
            <div class="shop-item__image-wrap">
              <img
                :src="getImageUrl(item.image)"
                :alt="item.name"
                class="shop-item__image"
              >
              <span v-if="item.isEvent" class="shop-item__badge">{{ t('component.shop.badge.event') }}</span>
            </div>
            <span class="shop-item__name">{{ item.name }}</span>
            <div class="shop-item__price">
              <template v-if="itemPrices(item).length === 0">
                <span class="shop-item__price-free">{{ t('component.shop.detail.free') }}</span>
              </template>
              <template v-else>
                <template v-for="(p, i) in itemPrices(item).slice(0, 2)" :key="i">
                  <span>{{ p.value }}</span>
                  <img v-if="getPriceIconKey(p)" :src="getImageUrl(getPriceIconKey(p))" alt="" class="shop-item__price-icon">
                </template>
                <span v-if="itemPrices(item).length > 2" class="shop-item__price-more">
                  {{ moreCountLabel(itemPrices(item).length - 2) }}
                </span>
              </template>
            </div>
          </button>
        </div>
      </template>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, inject } from 'vue'
import { getFileImageUrl } from '../../utils/imageResolverRuntime'
import { SHOP_CATEGORY_ALL, getShopConstants } from '../../utils/constants'
import { getItemPrices } from '../../data/shopDemo.js'

const translator = inject('translator', null)
const t = translator || ((key) => key)
const gameApi = inject('gameApi', null)
const userData = inject('userData', null)

const getImageUrl = (key) => getFileImageUrl(key)

const category = ref('all')
const selectedItem = ref(null)
const detailQuantity = ref(1)
const loading = ref(true)
const shopItems = ref([])
const userBalance = ref({ coin: 0, ruby: 0 })

watch(selectedItem, (item) => {
  detailQuantity.value = item ? 1 : 0
})

function selectItem(item) {
  selectedItem.value = item
}

/** Category keys: all first, then unique categories from API (event first if any). */
const shopCategoryKeys = computed(() => {
  const items = shopItems.value
  if (!items.length) return [SHOP_CATEGORY_ALL]
  const shopC = getShopConstants()
  const cats = new Set(items.map((i) => i.category || shopC.CATEGORY_GEAR))
  const list = [SHOP_CATEGORY_ALL, ...Array.from(cats)]
  return list
})

const filteredItems = computed(() => {
  const list = shopItems.value
  if (category.value === SHOP_CATEGORY_ALL) {
    return [...list].sort((a, b) => (b.isEvent ? 1 : 0) - (a.isEvent ? 1 : 0))
  }
  const shopC = getShopConstants()
  return list.filter((item) => (item.category || shopC.CATEGORY_GEAR) === category.value)
})

async function loadShop() {
  if (!gameApi?.getPlayerShop) return
  try {
    const res = await gameApi.getPlayerShop()
    const raw = res?.data?.datas?.shop_items ?? []
    shopItems.value = Array.isArray(raw) ? raw : []
  } catch (e) {
    shopItems.value = []
  } finally {
    loading.value = false
  }
}

async function loadBalance() {
  if (!gameApi?.getUserData) return
  try {
    const res = await gameApi.getUserData()
    const d = res?.data?.datas ?? {}
    userBalance.value = {
      coin: Number(d.coin) || 0,
      ruby: Number(d.ruby) || 0,
    }
  } catch (_) {
    // keep current balance
  }
}

onMounted(async () => {
  loading.value = true
  if (userData?.value && typeof userData.value.coin === 'number') {
    userBalance.value = {
      coin: userData.value.coin ?? 0,
      ruby: userData.value.ruby ?? 0,
    }
  }
  await loadBalance()
  await loadShop()
})

function itemPrices(item) {
  return getItemPrices(item)
}

const selectedPrices = computed(() => getItemPrices(selectedItem.value))

const hasShopItemOptions = computed(() => {
  const opts = selectedItem.value?.options
  if (!opts || typeof opts !== 'object') return false
  if (opts.stats && typeof opts.stats === 'object' && Object.keys(opts.stats).length > 0) return true
  if (Array.isArray(opts.custom_options) && opts.custom_options.length > 0) return true
  if (!opts.stats && !opts.custom_options && Object.keys(opts).length > 0) return true
  return false
})

function totalForPrice(p) {
  if (!p || !selectedItem.value) return 0
  return p.value * detailQuantity.value
}

function getBalanceKey(p) {
  if (p.actions?.is_coin) return 'coin'
  if (p.actions?.is_ruby) return 'ruby'
  return p.key || p.type
}

function getUserBalance(p) {
  const key = getBalanceKey(p)
  return Number(userBalance.value[key]) || 0
}

const canAfford = computed(() => {
  if (!selectedItem.value) return false
  const prices = getItemPrices(selectedItem.value)
  if (prices.length === 0) return true
  return prices.every((p) => {
    const need = p.value * detailQuantity.value
    return getUserBalance(p) >= need
  })
})

function clampQuantity() {
  const n = parseInt(detailQuantity.value, 10)
  if (Number.isNaN(n) || n < 1) detailQuantity.value = 1
  else if (n > 999) detailQuantity.value = 999
  else detailQuantity.value = n
}

function getPriceIconKey(p) {
  if (!p) return ''
  if (p.actions?.is_coin) return 'global.coin'
  if (p.actions?.is_ruby) return 'bag.ruby'
  return ''
}

function getPriceLabel(p) {
  if (!p) return ''
  if (p.actions?.is_coin) return t('component.shop.priceType.coin')
  if (p.actions?.is_ruby) return t('component.shop.priceType.ruby')
  if (p.actions?.is_voucher && p.key) return t('component.shop.priceType.voucher') + ' (' + p.key + ')'
  return p.type || ''
}

function moreCountLabel(n) {
  const str = t('component.shop.moreCount') || '+{n} more'
  return str.replace('{n}', String(n))
}

async function handleBuy() {
  if (!canAfford.value || !selectedItem.value || !gameApi?.purchaseShopItem) return
  const shopItemId = selectedItem.value.id
  const qty = detailQuantity.value
  try {
    const res = await gameApi.purchaseShopItem(shopItemId, qty)
    const d = res?.data?.datas ?? {}
    if (d.coin !== undefined) userBalance.value.coin = Number(d.coin)
    if (d.ruby !== undefined) userBalance.value.ruby = Number(d.ruby)
    if (userData?.value) {
      userData.value.coin = userBalance.value.coin
      userData.value.ruby = userBalance.value.ruby
      if (d.user_bag) userData.value.user_bag = d.user_bag
    }
    // optional: emit or refresh bag elsewhere if needed
    alert(t('component.shop.detail.purchaseSuccess') || 'Purchase successful!')
  } catch (e) {
    const msg = e.response?.data?.message ?? e.message ?? (t('component.shop.detail.purchaseFailed') || 'Purchase failed')
    alert(msg)
  }
}

function formatOptionKey(key) {
  const map = {
    stats: t('component.shop.detail.stats'),
    use: t('component.shop.detail.use'),
    event_bonus: t('component.shop.detail.eventBonus'),
    reward_pool: t('component.shop.detail.rewardPool'),
    min_rarity: t('component.shop.detail.minRarity'),
    custom_slot: t('component.shop.detail.customSlot'),
    value: t('component.shop.detail.value'),
  }
  return map[key] || key
}

function formatOptionVal(val) {
  if (val && typeof val === 'object' && !Array.isArray(val)) {
    return Object.entries(val)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ')
  }
  if (Array.isArray(val) && val.length > 0 && val.every((e) => e && typeof e === 'object')) {
    return val.map((e) => `${e.item_name || e.name || ('Item #' + (e.setting_item_id ?? '?'))} ${e.rate ?? 0}% × ${e.count ?? 1}`).join(', ')
  }
  return String(val ?? '')
}

/** Format rate_list for display: { label, rate (%), count } */
function formatRateListForDisplay(rateList) {
  if (!Array.isArray(rateList) || rateList.length === 0) return []
  const totalWeight = rateList.reduce((sum, e) => sum + (parseFloat(e.rate) || 0), 0) || 1
  return rateList.map((e) => ({
    label: e.item_name || e.name || ((t('component.bag.itemDetail.item') || 'Item') + ' #' + (e.setting_item_id ?? '?')),
    rate: totalWeight > 0 ? ((parseFloat(e.rate) || 0) / totalWeight * 100).toFixed(1) : '0',
    count: Math.max(1, parseInt(e.count, 10) || 1)
  }))
}
</script>

<style scoped>
/* Match game layout: blue gradient + card style */
.shop-page {
  --shop-detail-width: 280px;
  --shop-panel-bg: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
  --shop-border: 1px solid rgba(255, 255, 255, 0.1);
  --shop-border-light: 1px solid rgba(255, 255, 255, 0.06);
  --shop-gold: #f6a901;
  --shop-text: #fff;
  --shop-text-dim: rgba(255, 255, 255, 0.75);
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  height: calc(100% - 40px);
  min-height: 0;
  font-family: 'Nanami', system-ui, sans-serif;
  color: var(--shop-text);
}

/* Left: detail panel - full height */
.shop-detail {
  width: var(--shop-detail-width);
  min-width: var(--shop-detail-width);
  height: 100%;
  min-height: 0;
  background: var(--shop-panel-bg);
  backdrop-filter: blur(8px);
  border-right: var(--shop-border);
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.shop-detail__inner {
  padding: 20px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.shop-detail--empty .shop-detail__inner {
  display: flex;
  align-items: center;
  justify-content: center;
}

.shop-detail__placeholder {
  color: var(--shop-text-dim);
  font-size: 0.95rem;
  text-align: center;
  margin: 0;
}

.shop-detail__image-wrap {
  width: 100%;
  aspect-ratio: 1;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.04);
  border: var(--shop-border-light);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.shop-detail__image {
  max-width: 80%;
  max-height: 80%;
  object-fit: contain;
}

.shop-detail__name {
  margin: 0 0 12px;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--shop-gold);
  border-bottom: var(--shop-border-light);
  padding-bottom: 8px;
}

.shop-detail__desc {
  margin: 0 0 16px;
  font-size: 0.9rem;
  line-height: 1.45;
  color: var(--shop-text-dim);
}

.shop-detail__options-title,
.shop-detail__prices-title {
  margin: 0 0 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--shop-text);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.shop-detail__options-list {
  margin: 0 0 16px;
  padding-left: 1.2em;
  font-size: 0.85rem;
  color: var(--shop-text-dim);
}

.shop-detail__option {
  margin-bottom: 4px;
}

.shop-detail__option-key {
  color: var(--shop-text);
  margin-right: 6px;
}

.shop-detail__prices {
  margin-bottom: 16px;
}

.shop-detail__price-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
  font-size: 0.9rem;
}

.shop-detail__price-icon {
  width: 18px;
  height: 18px;
  object-fit: contain;
}

.shop-detail__price-label {
  color: var(--shop-text-dim);
  min-width: 60px;
}

.shop-detail__price-value {
  font-weight: 700;
  color: var(--shop-gold);
}

.shop-detail__price-unit {
  font-size: 0.8rem;
  color: var(--shop-text-dim);
  margin-left: 4px;
}

.shop-detail__price-free {
  color: #82b35d;
  font-weight: 600;
}

.shop-detail__quantity {
  margin-bottom: 12px;
}

.shop-detail__quantity-label {
  display: block;
  font-size: 0.85rem;
  color: var(--shop-text-dim);
  margin-bottom: 6px;
}

.shop-detail__quantity-control {
  display: flex;
  align-items: center;
  gap: 0;
}

.shop-detail__qty-btn {
  width: 36px;
  height: 36px;
  padding: 0;
  font-size: 1.2rem;
  font-family: inherit;
  color: var(--shop-text);
  background: rgba(255, 255, 255, 0.08);
  border: var(--shop-border-light);
  border-radius: 6px 0 0 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.shop-detail__qty-btn:last-of-type {
  border-radius: 0 6px 6px 0;
}

.shop-detail__qty-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.12);
}

.shop-detail__qty-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.shop-detail__qty-input {
  width: 52px;
  height: 36px;
  padding: 0 4px;
  font-size: 1rem;
  font-family: inherit;
  color: var(--shop-text);
  background: rgba(255, 255, 255, 0.06);
  border: var(--shop-border-light);
  border-left: none;
  border-right: none;
  text-align: center;
  -moz-appearance: textfield;
}

.shop-detail__qty-input::-webkit-outer-spin-button,
.shop-detail__qty-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.shop-detail__not-enough {
  font-size: 0.8rem;
  color: #e74c3c;
  margin: 0 0 10px;
}

.shop-detail__actions {
  margin-top: auto;
  padding-top: 16px;
  border-top: var(--shop-border-light);
  flex-shrink: 0;
}

.shop-detail__buy-btn {
  width: 100%;
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: 600;
  font-family: inherit;
  color: #1a2332;
  background: var(--shop-gold);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s, opacity 0.2s;
}

.shop-detail__buy-btn:hover:not(:disabled) {
  background: #ffb830;
}

.shop-detail__buy-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Right: main content */
.shop-main {
  flex: 1;
  min-width: 0;
  min-height: 0;
  padding: 20px;
  background: var(--shop-panel-bg);
  backdrop-filter: blur(6px);
  overflow-y: auto;
}

.shop-loading,
.shop-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: var(--shop-text-dim);
  font-size: 1rem;
}

.shop-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: var(--shop-border-light);
}

.shop-category {
  padding: 10px 18px;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--shop-text-dim);
  background: rgba(255, 255, 255, 0.04);
  border: var(--shop-border-light);
  border-radius: 6px;
  cursor: pointer;
  transition: color 0.2s, background 0.2s, border-color 0.2s;
}

.shop-category:hover {
  color: var(--shop-text);
  background: rgba(255, 255, 255, 0.08);
}

.shop-category--active {
  color: var(--shop-gold);
  background: rgba(246, 169, 1, 0.15);
  border-color: var(--shop-gold);
}

.shop-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
}

.shop-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  font-family: inherit;
  color: var(--shop-text);
  background: rgba(255, 255, 255, 0.04);
  border: var(--shop-border-light);
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, transform 0.15s;
}

.shop-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.shop-item--selected {
  background: rgba(246, 169, 1, 0.12);
  border-color: var(--shop-gold);
  box-shadow: 0 0 12px rgba(246, 169, 1, 0.2);
}

.shop-item__image-wrap {
  position: relative;
  width: 72px;
  height: 72px;
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.shop-item__image {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
}

.shop-item__badge {
  position: absolute;
  top: 2px;
  right: 2px;
  font-size: 0.65rem;
  font-weight: 700;
  color: #fff;
  background: rgba(220, 53, 69, 0.9);
  padding: 2px 4px;
  border-radius: 3px;
}

.shop-item__name {
  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 6px;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.shop-item__price {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 4px;
  font-size: 0.8rem;
  color: var(--shop-gold);
}

.shop-item__price-icon {
  width: 14px;
  height: 14px;
  object-fit: contain;
}

.shop-item__price-free {
  color: #82b35d;
  font-size: 0.75rem;
}

.shop-item__price-more {
  font-size: 0.75rem;
  color: var(--shop-text-dim);
  margin-left: 2px;
}
</style>
