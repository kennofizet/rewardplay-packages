<template>
  <div class="setting-shop-page">
    <div class="page-header">
      <h2>{{ t('page.manageSetting.settingShop.title') }}</h2>
      <div class="header-actions">
        <select v-model="filters.category" class="form-select filter-select" @change="loadShopItems">
          <option value="">{{ t('page.manageSetting.settingShop.allCategories') }}</option>
          <option v-for="(label, key) in categoryLabels" :key="key" :value="key">{{ label }}</option>
        </select>
        <button class="btn-primary" @click="handleSuggest" :disabled="suggesting" style="margin-right: 10px;">
          {{ t('page.manageSetting.settingShop.suggest') || 'Suggest' }}
        </button>
        <button class="btn-primary" @click="handleCreate">
          {{ t('page.manageSetting.settingShop.create') }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading">{{ t('page.manageSetting.settingShop.loading') }}</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="!loading && !error" class="table-container">
      <table class="settings-table">
        <thead>
          <tr>
            <th>{{ t('page.manageSetting.settingShop.table.id') }}</th>
            <th>{{ t('page.manageSetting.settingShop.table.image') || 'Image' }}</th>
            <th>{{ t('page.manageSetting.settingShop.table.item') }}</th>
            <th>{{ t('page.manageSetting.settingShop.table.slug') || 'Slug' }}</th>
            <th>{{ t('page.manageSetting.settingShop.table.type') || 'Type' }}</th>
            <th>{{ t('page.manageSetting.settingShop.table.category') }}</th>
            <th>{{ t('page.manageSetting.settingShop.table.description') || 'Description' }}</th>
            <th>{{ t('page.manageSetting.settingShop.table.prices') }}</th>
            <th>{{ t('page.manageSetting.settingShop.table.timeRange') }}</th>
            <th>{{ t('page.manageSetting.settingShop.table.active') || 'Active' }}</th>
            <th>{{ t('page.manageSetting.settingShop.table.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in shopItems" :key="row.id">
            <td>{{ row.id }}</td>
            <td>
              <img v-if="row.setting_item?.image" :src="row.setting_item.image" alt="" class="shop-item-thumb" />
              <span v-else>—</span>
            </td>
            <td>{{ row.setting_item?.name ?? row.setting_item_id }}</td>
            <td>{{ row.setting_item?.slug ?? '—' }}</td>
            <td>{{ row.setting_item?.type ?? '—' }}</td>
            <td>{{ categoryLabels[row.category] ?? row.category }}</td>
            <td>{{ truncateText(row.setting_item?.description, 35) }}</td>
            <td>
              <span v-if="row.prices?.length">{{ row.prices.length }} {{ t('page.manageSetting.settingShop.priceCount') }}</span>
              <span v-else>—</span>
            </td>
            <td>
              <span v-if="!row.time_start && !row.time_end">{{ t('page.manageSetting.settingEvents.holdInShop') }}</span>
              <span v-else>{{ formatDateDisplay(row.time_start) }} – {{ formatDateDisplay(row.time_end) }}</span>
            </td>
            <td>{{ row.is_active !== false ? (t('page.manageSetting.settingEvents.yes') || 'Yes') : (t('page.manageSetting.settingEvents.no') || 'No') }}</td>
            <td class="actions-cell">
              <button class="btn-preview" @click="handlePreview(row)">{{ t('page.manageSetting.settingShop.preview') || 'Preview' }}</button>
              <button class="btn-edit" @click="handleEdit(row)">{{ t('page.manageSetting.settingShop.edit') }}</button>
              <button class="btn-delete" @click="handleDelete(row)">{{ t('page.manageSetting.settingShop.delete') }}</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="pagination" class="pagination">
        <button
          :disabled="pagination.current_page === 1"
          @click="changePage(pagination.current_page - 1)"
        >
          {{ t('page.manageSetting.settingStackBonuses.pagination.prev') }}
        </button>
        <span>{{ t('page.manageSetting.settingStackBonuses.pagination.page') }} {{ pagination.current_page }} {{ t('page.manageSetting.settingStackBonuses.pagination.of') }} {{ pagination.last_page }}</span>
        <button
          :disabled="pagination.current_page === pagination.last_page"
          @click="changePage(pagination.current_page + 1)"
        >
          {{ t('page.manageSetting.settingStackBonuses.pagination.next') }}
        </button>
      </div>
    </div>

    <!-- Preview modal: item detail as shown to user -->
    <div v-if="showPreviewModal" class="modal-overlay" @click="showPreviewModal = false">
      <div class="modal-content modal-content--preview" @click.stop>
        <div class="modal-header">
          <h3>{{ t('page.manageSetting.settingShop.preview') || 'Preview' }}: {{ previewItem?.setting_item?.name }}</h3>
          <button class="btn-close" @click="showPreviewModal = false">×</button>
        </div>
        <div v-if="previewItem" class="shop-preview-body">
          <div class="shop-preview-image-wrap">
            <img v-if="previewItem.setting_item?.image" :src="previewItem.setting_item.image" :alt="previewItem.setting_item.name" class="shop-preview-image" />
            <div v-else class="shop-preview-image-placeholder">—</div>
          </div>
          <h4 class="shop-preview-name">{{ previewItem.setting_item?.name }}</h4>
          <p class="shop-preview-desc">{{ previewItem.setting_item?.description || '—' }}</p>
          <p class="shop-preview-meta">{{ categoryLabels[previewItem.category] ?? previewItem.category }} · {{ previewItem.setting_item?.type ?? '—' }}</p>
          <div v-if="previewItem.options?.stats && Object.keys(previewItem.options.stats).length" class="shop-preview-options">
            <h5>{{ t('component.shop.detail.options') }}</h5>
            <ul>
              <li v-for="(val, key) in previewItem.options.stats" :key="key">{{ formatOptionKey(key) }}: {{ formatOptionVal(val) }}</li>
            </ul>
          </div>
          <div v-if="Array.isArray(previewItem.options?.custom_options) && previewItem.options.custom_options.length" class="shop-preview-options">
            <template v-for="(co, idx) in previewItem.options.custom_options" :key="'co-' + idx">
              <span class="shop-preview-opt-name">{{ co.name }}:</span>
              <span class="shop-preview-opt-val">{{ formatOptionVal(co.properties) }}</span>
            </template>
          </div>
          <div v-if="Array.isArray(previewItem.options?.rate_list) && previewItem.options.rate_list.length" class="shop-preview-options">
            <h5>{{ t('component.shop.detail.possibleDrops') || 'Possible drops' }}</h5>
            <ul>
              <li v-for="(entry, idx) in formatPreviewRateList(previewItem.options.rate_list)" :key="'rate-' + idx">
                {{ entry.label }}: {{ entry.rate }}% × {{ entry.count }}
              </li>
            </ul>
          </div>
          <div class="shop-preview-prices">
            <h5>{{ t('component.shop.detail.priceTitle') }}</h5>
            <template v-if="previewItem.prices?.length">
              <div v-for="(p, i) in previewItem.prices" :key="i" class="shop-preview-price-row">
                <span>{{ getPriceLabel(p) }}</span>
                <span>{{ p.value ?? p.quantity ?? '—' }}</span>
              </div>
            </template>
            <span v-else>{{ t('component.shop.detail.free') }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content modal-content--wide" @click.stop>
        <div class="modal-header">
          <h3>{{ editingItem ? t('page.manageSetting.settingShop.edit') : t('page.manageSetting.settingShop.create') }}</h3>
          <button class="btn-close" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <section class="form-section-block">
            <h4 class="form-section-title">{{ t('page.manageSetting.settingShop.form.basicInfo') }}</h4>
            <div class="form-group">
              <label>{{ t('page.manageSetting.settingShop.form.category') }}</label>
              <select v-model="formData.category" class="form-select" :disabled="!!editingItem" @change="onCategoryChange">
                <option v-for="(label, key) in categoryLabels" :key="key" :value="key">{{ label }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>{{ t('page.manageSetting.settingShop.form.item') }}</label>
              <select v-model.number="formData.setting_item_id" class="form-select" :disabled="!!editingItem">
                <option :value="null">—</option>
                <option v-for="item in shopItemOptions" :key="item.id" :value="item.id">{{ item.name }} ({{ item.type }})</option>
              </select>
              <span v-if="formData.category === shopC.CATEGORY_EVENT && !formData.event_id" class="form-hint">{{ t('page.manageSetting.settingShop.form.selectEventFirst') }}</span>
            </div>
            <div class="form-group">
              <label>{{ t('page.manageSetting.settingShop.form.event') }}</label>
              <select v-model.number="formData.event_id" class="form-select">
                <option :value="null">—</option>
                <option v-for="evt in events" :key="evt.id" :value="evt.id">{{ evt.name }}</option>
              </select>
            </div>
          </section>
          <section class="form-section-block">
            <h4 class="form-section-title">{{ t('page.manageSetting.settingShop.form.prices') }}</h4>
          <div class="form-group">
            <div v-for="(p, i) in formData.prices" :key="i" class="price-row">
              <select v-model="p.type" class="form-select form-select--small" @change="p.actions = getPriceActions(p.type)">
                <option :value="shopC.PRICE_TYPE_COIN">Coin</option>
                <option :value="shopC.PRICE_TYPE_GEM">Gem</option>
                <option :value="shopC.PRICE_TYPE_RUBY">Ruby</option>
                <option :value="shopC.PRICE_TYPE_GEAR">Gear (item)</option>
                <option :value="shopC.PRICE_TYPE_ITEM">Item (box/ticket)</option>
              </select>
              <input
                v-if="p.actions?.is_coin || p.actions?.is_ruby"
                v-model.number="p.value"
                type="number"
                min="0"
                class="form-input form-input--small"
                :placeholder="t('page.manageSetting.settingShop.form.value')"
              >
              <template v-else>
                <select v-model.number="p.item_id" class="form-select form-select--small">
                  <option :value="null">—</option>
                  <option v-for="item in zoneItems" :key="item.id" :value="item.id">{{ item.name }}</option>
                </select>
                <input v-model.number="p.quantity" type="number" min="1" class="form-input form-input--small" :placeholder="t('page.manageSetting.settingShop.form.quantity')">
              </template>
              <button type="button" class="btn-icon btn-icon--danger" @click="formData.prices.splice(i, 1)" aria-label="Remove">×</button>
            </div>
            <button type="button" class="btn-outline btn-outline--small" @click="formData.prices.push({ type: shopC.PRICE_TYPE_COIN, value: 0, item_id: null, quantity: 1, actions: getPriceActions(shopC.PRICE_TYPE_COIN) })">
              + {{ t('page.manageSetting.settingShop.form.addPrice') }}
            </button>
          </div>
          </section>
          <section class="form-section-block">
            <h4 class="form-section-title">{{ t('page.manageSetting.settingShop.form.schedule') }}</h4>
          <div class="form-row">
            <div class="form-group">
              <label>{{ t('page.manageSetting.settingShop.form.timeStart') }}</label>
              <input v-model="formData.time_start" type="datetime-local" class="form-input">
            </div>
            <div class="form-group">
              <label>{{ t('page.manageSetting.settingShop.form.timeEnd') }}</label>
              <input v-model="formData.time_end" type="datetime-local" class="form-input">
            </div>
          </div>
          <div class="form-group">
            <label>{{ t('page.manageSetting.settingShop.form.sortOrder') }}</label>
            <input v-model.number="formData.sort_order" type="number" min="0" class="form-input form-input--small">
          </div>
          <div v-if="showDisplayOptions" class="form-group form-section">
            <label class="section-label">{{ t('page.manageSetting.settingShop.form.displayOptions') }}</label>
            <span class="form-hint">{{ t('page.manageSetting.settingShop.form.displayOptionsHint') }}</span>
            <div v-for="(row, i) in propertiesList" :key="i" class="option-row property-row">
              <template v-if="row.type === 'custom_option' && row.name">
                <CustomOptionDisplay
                  :name="row.name"
                  :properties="row.properties || {}"
                  :stats-label="t('page.manageSetting.settingItems.stats')"
                  class="property-display"
                />
              </template>
              <template v-else>
                <CustomSelect
                  v-model="row.selectedValue"
                  :options="propertyOptions"
                  :placeholder="t('page.manageSetting.settingItems.selectKey') || 'Select Stat or Custom Option'"
                  @change="handlePropertyChange(i)"
                  trigger-class="form-select form-select--small"
                />
                <input
                  v-if="row.type === 'stat' && row.selectedValue"
                  v-model.number="row.value"
                  type="number"
                  step="0.01"
                  class="form-input form-input--small"
                  :placeholder="t('page.manageSetting.settingItems.valuePlaceholder') || 'Value'"
                />
              </template>
              <button type="button" class="btn-icon btn-icon--danger" @click="removePropertyRow(i)" aria-label="Remove">×</button>
            </div>
            <button type="button" class="btn-outline btn-outline--small" @click="addPropertyRow">
              + {{ t('page.manageSetting.settingItems.addProperty') || 'Add property' }}
            </button>
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input v-model="formData.is_active" type="checkbox" class="form-checkbox">
              {{ t('page.manageSetting.settingEvents.form.isActive') }}
            </label>
          </div>
          </section>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeModal">{{ t('page.manageSetting.settingStackBonuses.cancel') }}</button>
          <button class="btn-primary" :disabled="saving" @click="handleSave">
            {{ saving ? t('page.manageSetting.settingStackBonuses.saving') : t('page.manageSetting.settingStackBonuses.save') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, watch, computed, nextTick } from 'vue'
import { parsePaginatedResponse, formatDateDisplay } from '../../../utils/settingApiResponse'
import { getGlobalStats, isStatsDataLoaded } from '../../../utils/globalData'
import { getShopConstants, getItemConstants } from '../../../utils/constants'
import CustomSelect from '../../../components/CustomSelect.vue'
import CustomOptionDisplay from '../../../components/CustomOptionDisplay.vue'

const translator = inject('translator', null)
const t = translator || ((key) => key)
const gameApi = inject('gameApi')
const showAlert = inject('showAlert', (msg) => alert(msg))
const statHelpers = inject('statHelpers', null)
const shopC = getShopConstants()

function truncateText(text, maxLen = 35) {
  if (!text) return '—'
  return text.length > maxLen ? text.substring(0, maxLen) + '…' : text
}

const loading = ref(false)
const error = ref(null)
const shopItems = ref([])
const pagination = ref(null)
const showModal = ref(false)
const showPreviewModal = ref(false)
const previewItem = ref(null)
const editingItem = ref(null)
const isLoadingEdit = ref(false)
const saving = ref(false)
const suggesting = ref(false)
const zoneItems = ref([])
const events = ref([])
const stats = ref([])
const customOptions = ref([])

// For gear: same as Setting Item create – stats + custom options (propertyOptions)
const propertyOptions = computed(() => {
  const options = []
  stats.value.forEach((s) => options.push({ value: s.key, label: `${s.name} (${s.key})`, type: 'stat', isCustom: false }))
  customOptions.value.forEach((opt) => options.push({ value: opt.id, label: opt.name, type: 'custom_option', isCustom: true, properties: opt.properties || {} }))
  return options
})

/** Return actions object for a price row (use when building form rows so template can use p.actions?.is_coin). */
function getPriceActions(type) {
  const t = type ?? shopC.PRICE_TYPE_COIN
  return {
    is_coin: t === shopC.PRICE_TYPE_COIN,
    is_ruby: t === shopC.PRICE_TYPE_RUBY || t === shopC.PRICE_TYPE_GEM,
    is_gear: t === shopC.PRICE_TYPE_GEAR,
    is_item: t === shopC.PRICE_TYPE_ITEM,
  }
}

const categoryLabels = {
  gear: 'Gear',
  ticket: 'Ticket',
  box_random: 'Box Random',
  event: 'Event',
  custom: 'Custom',
}

const PRICE_LABELS = { coin: 'Coin', gem: 'Gem', ruby: 'Ruby', gear: 'Gear', item: 'Item' }

const selectedItem = computed(() => {
  if (!formData.value.setting_item_id || !zoneItems.value.length) return null
  return zoneItems.value.find((i) => i.id === formData.value.setting_item_id) ?? null
})

const showDisplayOptions = computed(() => {
  if (formData.value.category === shopC.CATEGORY_EVENT) return false
  const item = selectedItem.value
  return item && item.actions?.is_gear
})

const shopItemOptions = computed(() => {
  const cat = formData.value.category
  const list = zoneItems.value || []
  if (cat === shopC.CATEGORY_GEAR) {
    return list.filter((i) => i.actions?.is_gear)
  }
  if (cat === shopC.CATEGORY_TICKET) {
    return list.filter((i) => i.actions?.is_ticket)
  }
  if (cat === shopC.CATEGORY_BOX_RANDOM) {
    return list.filter((i) => i.actions?.is_box_random)
  }
  if (cat === shopC.CATEGORY_EVENT) {
    const eventId = formData.value.event_id
    if (!eventId || !events.value?.length) return []
    const evt = events.value.find((e) => e.id === eventId)
    const ids = (evt?.items || []).map((i) => i.id)
    return list.filter((i) => ids.includes(i.id))
  }
  return list
})

const DEFAULT_OPTIONS_ARRAY = [{ key: 'event_bonus', keyCustom: '', value: '' }]

function onCategoryChange() {
  const opts = shopItemOptions.value
  const id = formData.value.setting_item_id
  if (id && !opts.some((i) => i.id === id)) {
    formData.value.setting_item_id = null
    formData.value.optionsArray = [...DEFAULT_OPTIONS_ARRAY]
    propertiesList.value = []
  }
  if (formData.value.category === shopC.CATEGORY_EVENT) {
    propertiesList.value = []
  }
}

const defaultForm = () => ({
  setting_item_id: null,
  event_id: null,
  category: shopC.CATEGORY_GEAR,
  prices: [{ type: shopC.PRICE_TYPE_COIN, value: 0, item_id: null, quantity: 1, actions: getPriceActions(shopC.PRICE_TYPE_COIN) }],
  time_start: null,
  time_end: null,
  sort_order: 0,
  options: {},
  optionsArray: [...DEFAULT_OPTIONS_ARRAY],
  is_active: true,
})

const formData = ref(defaultForm())

// For gear: same as Setting Item create – list of stat or custom_option rows
const propertiesList = ref([])

function isStatKey(key) {
  return stats.value.some((s) => s.key === key)
}

/** Build propertiesList from shop item options (stats + custom_options). Used when loading edit form. */
function buildPropertiesListFromOptions(options) {
  const list = []
  if (options.stats && typeof options.stats === 'object' && !Array.isArray(options.stats)) {
    Object.entries(options.stats).forEach(([k, v]) => {
      if (typeof v === 'number' && isStatKey(k)) {
        list.push({ selectedValue: k, type: 'stat', key: k, value: v, name: null, properties: {} })
      }
    })
  }
  if (Array.isArray(options.custom_options)) {
    options.custom_options.forEach((co) => {
      if (co && typeof co === 'object' && co.name && co.properties) {
        const optId = customOptions.value.find((o) => o.name === co.name)?.id ?? 'custom_' + co.name
        list.push({ selectedValue: optId, type: 'custom_option', key: null, value: null, name: co.name, properties: co.properties })
      }
    })
  }
  if (list.length === 0) {
    Object.entries(options).forEach(([k, v]) => {
      if (k === 'stats' || k === 'custom_options') return
      if (typeof v === 'number' && isStatKey(k)) {
        list.push({ selectedValue: k, type: 'stat', key: k, value: v, name: null, properties: {} })
      } else if (v && typeof v === 'object' && v.name && v.properties) {
        const optId = customOptions.value.find((o) => o.name === v.name)?.id ?? 'custom_' + v.name
        list.push({ selectedValue: optId, type: 'custom_option', key: null, value: null, name: v.name, properties: v.properties })
      }
    })
  }
  return list
}

function syncPropertiesFromItem(item) {
  if (!item?.default_property || typeof item.default_property !== 'object' || Array.isArray(item.default_property)) {
    propertiesList.value = []
    return
  }
  const dp = item.default_property
  const list = []
  if (statHelpers) {
    const statsList = statHelpers.mapToList(dp, stats.value, { customPrefix: '' })
    statsList.forEach((prop) => {
      if (prop.key) {
        list.push({ selectedValue: prop.key, type: 'stat', key: prop.key, value: prop.value, name: null, properties: {} })
      }
    })
  } else {
    Object.entries(dp).forEach(([k, v]) => {
      if (stats.value.some((s) => s.key === k)) {
        list.push({ selectedValue: k, type: 'stat', key: k, value: v, name: null, properties: {} })
      }
    })
  }
  propertiesList.value = list
}

function addPropertyRow() {
  propertiesList.value.push({ selectedValue: null, type: null, key: null, value: null, name: null, properties: {} })
}

function removePropertyRow(index) {
  propertiesList.value.splice(index, 1)
}

function handlePropertyChange(index) {
  const row = propertiesList.value[index]
  if (!row?.selectedValue) return
  const opt = propertyOptions.value.find((o) => o.value === row.selectedValue)
  if (!opt) return
  if (opt.type === 'stat') {
    row.type = 'stat'
    row.key = opt.value
    row.value = null
    row.name = null
    row.properties = {}
  } else if (opt.type === 'custom_option') {
    row.type = 'custom_option'
    row.name = opt.label
    row.properties = opt.properties || {}
    row.key = null
    row.value = null
  }
}

const filters = ref({ currentPage: 1, perPage: 15, category: '' })

async function loadZoneItems() {
  try {
    const res = await gameApi.getItemsForZone({ mode: 'with-default-options' })
    if (res.data?.datas?.items) {
      zoneItems.value = res.data.datas.items
    }
  } catch (e) {
    console.error('Failed to load items', e)
  }
}

// When user selects an item: gear → sync propertiesList from default_property (same as Setting Item); ticket/box/event → clear
// Skip when we're loading edit data so we don't overwrite propertiesList with item default_property instead of shop options
watch(
  () => formData.value.setting_item_id,
  (id) => {
    if (isLoadingEdit.value) return
    if (!id || !zoneItems.value.length) return
    const item = zoneItems.value.find((i) => i.id === id)
    if (!item) return
    if (item.actions?.is_gear && formData.value.category !== shopC.CATEGORY_EVENT) {
      syncPropertiesFromItem(item)
    } else {
      propertiesList.value = []
      formData.value.optionsArray = []
    }
  }
)

async function loadEvents() {
  try {
    const res = await gameApi.getSettingEvents({ perPage: 50 })
    const { list } = parsePaginatedResponse(res, 'events')
    events.value = list
  } catch (e) {
    console.error('Failed to load events', e)
  }
}

const handleSuggest = async () => {
  if (!gameApi || suggesting.value) return
  suggesting.value = true
  try {
    await gameApi.suggestSettingShopItems()
    showAlert(t('page.manageSetting.settingShop.messages.suggestSuccess') || 'Suggested shop items created.')
    loadShopItems()
  } catch (e) {
    showAlert(t('page.manageSetting.settingShop.messages.suggestFailed') || 'Failed to suggest shop items: ' + (e.response?.data?.message || e.message))
  } finally {
    suggesting.value = false
  }
}

const loadShopItems = async () => {
  if (!gameApi) return
  loading.value = true
  error.value = null
  try {
    const params = {
      currentPage: filters.value.currentPage,
      perPage: filters.value.perPage,
    }
    if (filters.value.category) params.category = filters.value.category
    const res = await gameApi.getSettingShopItems(params)
    const { list, pagination: p } = parsePaginatedResponse(res, 'shop_items')
    shopItems.value = list
    pagination.value = p
  } catch (e) {
    error.value = e.message || t('page.manageSetting.settingShop.messages.loadFailed')
  } finally {
    loading.value = false
  }
}

const changePage = (page) => {
  filters.value.currentPage = page
  loadShopItems()
}

function formatOptionKey(key) {
  if (!key) return key
  const k = String(key)
  return k.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}
function formatOptionVal(val) {
  if (val == null) return '—'
  if (Array.isArray(val) && val.length > 0 && val.every((e) => e && typeof e === 'object')) {
    return val.map((e) => `${e.item_name || e.name || ('Item #' + (e.setting_item_id ?? '?'))} ${e.rate ?? 0}% × ${e.count ?? 1}`).join(', ')
  }
  if (typeof val === 'object') return Object.entries(val).map(([k, v]) => `${k}: ${v}`).join(', ')
  return String(val)
}
/** Format rate_list for preview: [{ label, rate (%), count }] */
function formatPreviewRateList(rateList) {
  if (!Array.isArray(rateList) || rateList.length === 0) return []
  const totalWeight = rateList.reduce((sum, e) => sum + (parseFloat(e.rate) || 0), 0) || 1
  return rateList.map((e) => ({
    label: e.item_name || e.name || ((t('component.bag.itemDetail.item') || 'Item') + ' #' + (e.setting_item_id ?? '?')),
    rate: totalWeight > 0 ? ((parseFloat(e.rate) || 0) / totalWeight * 100).toFixed(1) : '0',
    count: Math.max(1, parseInt(e.count, 10) || 1)
  }))
}
function getPriceLabel(p) {
  const type = (p && p.type) || 'coin'
  return PRICE_LABELS[type] ?? type
}

const handlePreview = (row) => {
  previewItem.value = row
  showPreviewModal.value = true
}

const handleCreate = () => {
  editingItem.value = null
  formData.value = defaultForm()
  propertiesList.value = []
  showModal.value = true
}

const handleEdit = async (row) => {
  if (!gameApi) return
  let fullRow = row
  try {
    const res = await gameApi.getSettingShopItem(row.id)
    const shopItem = res?.data?.datas?.shop_item
    if (shopItem) fullRow = shopItem
  } catch (e) {
    console.warn('Failed to fetch shop item, using row data', e)
  }
  isLoadingEdit.value = true
  editingItem.value = fullRow
  const options = fullRow.options ?? {}
  const knownKeys = ['event_bonus', 'reward_pool', 'min_rarity', 'custom_slot', 'value']
  const optionsArray =
    Object.keys(options).length === 0
      ? [...DEFAULT_OPTIONS_ARRAY]
      : Object.entries(options).map(([k, v]) => ({
          key: knownKeys.includes(k) || isStatKey(k) ? k : 'other',
          keyCustom: knownKeys.includes(k) || isStatKey(k) ? '' : k,
          value: typeof v === 'object' ? JSON.stringify(v) : String(v ?? ''),
        }))
  formData.value = {
    setting_item_id: fullRow.setting_item_id,
    event_id: fullRow.event_id ?? null,
    category: fullRow.category ?? shopC.CATEGORY_GEAR,
    prices: Array.isArray(fullRow.prices) && fullRow.prices.length
      ? fullRow.prices.map((p) => ({ type: p.type || shopC.PRICE_TYPE_COIN, value: p.value ?? 0, item_id: p.item_id ?? null, quantity: p.quantity ?? 1, actions: p.actions || getPriceActions(p.type || shopC.PRICE_TYPE_COIN) }))
      : [{ type: shopC.PRICE_TYPE_COIN, value: 0, item_id: null, quantity: 1, actions: getPriceActions(shopC.PRICE_TYPE_COIN) }],
    time_start: fullRow.time_start ? fullRow.time_start.slice(0, 16) : null,
    time_end: fullRow.time_end ? fullRow.time_end.slice(0, 16) : null,
    sort_order: fullRow.sort_order ?? 0,
    options,
    optionsArray,
    is_active: fullRow.is_active !== false,
  }
  if (fullRow.actions?.is_gear && !fullRow.actions?.is_category_event) {
    const list = buildPropertiesListFromOptions(options)
    if (list.length > 0) {
      propertiesList.value = list
    } else {
      syncPropertiesFromItem(fullRow.setting_item)
    }
  } else {
    propertiesList.value = []
  }
  showModal.value = true
  nextTick(() => {
    isLoadingEdit.value = false
  })
}

const handleDelete = async (row) => {
  if (!confirm(t('page.manageSetting.settingShop.confirmDelete'))) return
  try {
    await gameApi.deleteSettingShopItem(row.id)
    if (shopItems.value.length === 1 && filters.value.currentPage > 1) {
      filters.value.currentPage = 1
    }
    loadShopItems()
  } catch (e) {
    showAlert(t('page.manageSetting.settingShop.messages.deleteFailed'))
  }
}

const closeModal = () => {
  showModal.value = false
}

const handleSave = async () => {
  if (!formData.value.setting_item_id) {
    showAlert(t('page.manageSetting.settingShop.messages.itemRequired'))
    return
  }
  let options = {}
  if (formData.value.category === shopC.CATEGORY_BOX_RANDOM) {
    const rateList = formData.value.options?.rate_list ?? selectedItem.value?.default_property?.rate_list
    options = Array.isArray(rateList) && rateList.length > 0 ? { rate_list: rateList } : {}
  } else if (showDisplayOptions.value && propertiesList.value.length > 0) {
    const statsObj = {}
    const customOptionsArr = []
    const keyCounters = {}
    propertiesList.value.forEach((row) => {
      if (row.type === 'stat' && row.key) {
        const v = row.value
        if (v === null || v === undefined || v === '') return
        const num = typeof v === 'number' ? v : parseFloat(v)
        if (!Number.isNaN(num) && isFinite(num)) {
          let keyToUse = row.key
          keyCounters[keyToUse] = (keyCounters[keyToUse] || 0) + 1
          if (keyCounters[keyToUse] > 1) keyToUse = `${row.key}_${keyCounters[keyToUse]}`
          statsObj[keyToUse] = num
        }
      } else if (row.type === 'custom_option' && row.name && row.properties && Object.keys(row.properties).length > 0) {
        customOptionsArr.push({ name: row.name, properties: row.properties })
      }
    })
    options = { stats: statsObj, custom_options: customOptionsArr }
  } else {
    for (const opt of formData.value.optionsArray || []) {
      if (!opt.value && opt.key !== 'other') continue
      const key = opt.key === 'other' ? (opt.keyCustom || '').trim() : opt.key
      if (!key) continue
      let val = opt.value
      if (typeof val === 'string' && (val.startsWith('{') || val.startsWith('['))) {
        try {
          val = JSON.parse(val)
        } catch (_) {}
      } else if (val !== '' && !Number.isNaN(Number(val))) {
        val = Number(val)
      }
      options[key] = val
    }
  }
  saving.value = true
  try {
    const payload = {
      setting_item_id: formData.value.setting_item_id,
      event_id: formData.value.event_id || null,
      category: formData.value.category,
      prices: formData.value.prices
        .filter((p) => p.type && (p.value > 0 || p.item_id))
        .map((p) => ({
          type: p.type,
          value: (p.actions?.is_coin || p.actions?.is_ruby) ? Number(p.value) || 0 : null,
          item_id: (p.actions?.is_gear || p.actions?.is_item) ? p.item_id : null,
          quantity: (p.actions?.is_gear || p.actions?.is_item) ? (Number(p.quantity) || 1) : null,
        })),
      time_start: formData.value.time_start || null,
      time_end: formData.value.time_end || null,
      sort_order: Number(formData.value.sort_order) || 0,
      options,
      is_active: formData.value.is_active,
    }
    if (editingItem.value) {
      await gameApi.updateSettingShopItem(editingItem.value.id, payload)
    } else {
      await gameApi.createSettingShopItem(payload)
    }
    closeModal()
    loadShopItems()
  } catch (e) {
    showAlert(t('page.manageSetting.settingShop.messages.saveFailed') + ': ' + (e.response?.data?.message || e.message))
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  if (isStatsDataLoaded()) {
    const g = getGlobalStats()
    if (g?.stats) stats.value = g.stats
    if (g?.custom_options) customOptions.value = g.custom_options
  } else if (gameApi?.getAllStats) {
    try {
      const res = await gameApi.getAllStats()
      const data = res?.data?.datas
      if (data?.stats) stats.value = data.stats
      if (data?.custom_options) customOptions.value = data.custom_options
    } catch (e) {
      console.warn('Failed to load stats for shop options', e)
    }
  }
  loadZoneItems()
  loadEvents()
  loadShopItems()
})
</script>

<style scoped>
/* Same style as other setting pages (SettingItemsListPage) */
.setting-shop-page { width: 100%; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
.page-header h2 { color: #d0d4d6; margin: 0; }
.header-actions { display: flex; gap: 10px; align-items: center; }
.filter-select, .form-select, .form-group input { padding: 8px 12px; background: #253344; border: 1px solid #1a2332; color: #d0d4d6; border-radius: 4px; width: 100%; }
.loading, .error { padding: 20px; text-align: center; color: #d0d4d6; }
.table-container { overflow-x: auto; }
.settings-table { width: 100%; border-collapse: collapse; background: #253344; }
.settings-table th, .settings-table td { padding: 12px; text-align: left; border-bottom: 1px solid #1a2332; color: #d0d4d6; }
.settings-table th { background: #1a2332; color: #f6a901; }
.settings-table tbody tr:hover { background: #1a2332; }
.actions-cell { white-space: nowrap; }
.form-section-block { margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #253344; }
.form-section-block:last-of-type { border-bottom: none; }
.form-section-title { color: #f6a901; font-size: 0.9rem; margin: 0 0 12px; }
.form-group { margin-bottom: 15px; }
.form-group label, .section-label { display: block; margin-bottom: 5px; color: #d0d4d6; }
.form-input, .form-group textarea { width: 100%; padding: 8px 12px; background: #253344; border: 1px solid #1a2332; color: #d0d4d6; border-radius: 4px; }
.form-input--small { width: 80px; padding: 6px 8px; }
.form-select--small { min-width: 100px; padding: 6px 8px; }
.form-row { display: flex; gap: 16px; }
.form-row .form-group { flex: 1; }
.form-hint { font-size: 0.85rem; color: #8a9ba8; margin-top: 4px; display: block; }
.price-row, .option-row { display: flex; gap: 8px; margin-bottom: 8px; align-items: center; flex-wrap: wrap; }
.btn-icon { width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center; border: none; border-radius: 4px; cursor: pointer; flex-shrink: 0; background: #ff6b6b; color: white; font-size: 1.1rem; }
.btn-icon:hover { background: #ee5a5a; }
.btn-outline, .btn-outline--small { background: #253344; border: 1px solid #1a2332; color: #d0d4d6; padding: 8px 14px; border-radius: 4px; cursor: pointer; font-size: 14px; }
.btn-outline:hover { background: #1a2332; }
.btn-outline--small { padding: 6px 12px; font-size: 0.85rem; }
.checkbox-label { display: flex; align-items: center; gap: 8px; cursor: pointer; color: #d0d4d6; }
.form-checkbox { width: 16px; height: 16px; accent-color: #f6a901; cursor: pointer; }
.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.modal-content { background: #2d3a4b; border: 1px solid #253344; width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto; padding: 0; }
.modal-content--wide { max-width: 640px; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid #253344; }
.modal-header h3 { margin: 0; color: #d0d4d6; }
.modal-body { padding: 20px; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 20px; border-top: 1px solid #253344; }
.btn-primary { background: #f6a901; color: #423714; border: none; padding: 8px 16px; cursor: pointer; border-radius: 4px; font-weight: 600; }
.btn-primary:hover:not(:disabled) { background: #f6f6f8; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-secondary { background: #253344; color: #d0d4d6; border: 1px solid #1a2332; padding: 8px 16px; cursor: pointer; border-radius: 4px; }
.btn-secondary:hover { background: #1a2332; }
.btn-close { background: transparent; border: none; color: #d0d4d6; font-size: 24px; padding: 0; width: 30px; height: 30px; line-height: 30px; cursor: pointer; }
.btn-preview, .btn-edit, .btn-delete { padding: 6px 12px; margin-right: 5px; cursor: pointer; border-radius: 4px; border: none; font-size: 14px; }
.btn-preview { background: #5a6b7d; color: white; }
.btn-preview:hover { background: #4a5b6d; }
.btn-edit { background: #4a90e2; color: white; }
.btn-edit:hover { background: #357abd; }
.btn-delete { background: #ff6b6b; color: white; }
.btn-delete:hover { background: #ee5a5a; }
.modal-content--preview { max-width: 480px; }
.shop-preview-body { padding: 20px; color: #d0d4d6; }
.shop-preview-image-wrap { width: 100%; height: 200px; background: #1a2332; border-radius: 8px; margin-bottom: 16px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.shop-preview-image { max-width: 100%; max-height: 100%; object-fit: contain; }
.shop-preview-image-placeholder { color: #8a9ba8; }
.shop-preview-name { margin: 0 0 8px; font-size: 1.25rem; color: #f6a901; }
.shop-preview-desc, .shop-preview-meta { margin: 0 0 12px; font-size: 0.9rem; color: rgba(255,255,255,0.8); }
.shop-preview-options, .shop-preview-prices { margin-top: 16px; padding-top: 12px; border-top: 1px solid #253344; }
.shop-preview-options h5, .shop-preview-prices h5 { margin: 0 0 8px; font-size: 0.85rem; color: #f6a901; }
.shop-preview-options ul { margin: 0; padding-left: 1.2em; }
.shop-preview-price-row { display: flex; justify-content: space-between; margin-bottom: 4px; }
.pagination { display: flex; justify-content: center; align-items: center; gap: 15px; margin-top: 20px; color: #d0d4d6; }
.pagination button { padding: 8px 16px; background: #253344; border: 1px solid #1a2332; color: #d0d4d6; cursor: pointer; border-radius: 4px; }
.pagination button:disabled { opacity: 0.5; cursor: not-allowed; }
.pagination button:not(:disabled):hover { background: #1a2332; }
.shop-item-thumb { width: 40px; height: 40px; object-fit: contain; border-radius: 4px; vertical-align: middle; }
</style>
