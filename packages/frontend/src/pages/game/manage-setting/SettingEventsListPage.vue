<template>
  <div class="setting-events-page">
    <div class="page-header">
      <h2>{{ t('page.manageSetting.settingEvents.title') }}</h2>
      <button class="btn-primary" @click="handleCreate">
        {{ t('page.manageSetting.settingEvents.create') }}
      </button>
    </div>

    <div v-if="loading" class="loading">{{ t('page.manageSetting.settingEvents.loading') }}</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="!loading && !error" class="table-container">
      <table class="settings-table">
        <thead>
          <tr>
            <th>{{ t('page.manageSetting.settingEvents.table.id') }}</th>
            <th>{{ t('page.manageSetting.settingEvents.table.image') || 'Image' }}</th>
            <th>{{ t('page.manageSetting.settingEvents.table.name') }}</th>
            <th>{{ t('page.manageSetting.settingEvents.table.slug') || 'Slug' }}</th>
            <th>{{ t('page.manageSetting.settingEvents.table.description') || 'Description' }}</th>
            <th>{{ t('page.manageSetting.settingEvents.table.timeRange') }}</th>
            <th>{{ t('page.manageSetting.settingEvents.table.bonus') }}</th>
            <th>{{ t('page.manageSetting.settingEvents.table.items') }}</th>
            <th>{{ t('page.manageSetting.settingEvents.table.active') || 'Active' }}</th>
            <th>{{ t('page.manageSetting.settingEvents.table.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="evt in events" :key="evt.id">
            <td>{{ evt.id }}</td>
            <td>
              <img v-if="evt.image" :src="evt.image" alt="" class="event-thumb" />
              <span v-else>—</span>
            </td>
            <td>{{ evt.name }}</td>
            <td>{{ evt.slug || '—' }}</td>
            <td>{{ truncateText(evt.description, 40) }}</td>
            <td>
              <span v-if="!evt.time_start && !evt.time_end">{{ t('page.manageSetting.settingEvents.holdInShop') }}</span>
              <span v-else>{{ formatDateDisplay(evt.time_start) }} – {{ formatDateDisplay(evt.time_end) }}</span>
            </td>
            <td>
              <span v-if="evt.bonus?.length">{{ evt.bonus.length }} {{ t('page.manageSetting.settingEvents.bonusCount') }}</span>
              <span v-else>—</span>
            </td>
            <td>{{ evt.items?.length ?? 0 }}</td>
            <td>{{ evt.is_active !== false ? t('page.manageSetting.settingEvents.yes') || 'Yes' : t('page.manageSetting.settingEvents.no') || 'No' }}</td>
            <td class="actions-cell">
              <button class="btn-preview" @click="handleShowPreview(evt)">{{ t('page.manageSetting.settingEvents.preview') || 'Show preview' }}</button>
              <button class="btn-edit" @click="handleEdit(evt)">{{ t('page.manageSetting.settingEvents.edit') }}</button>
              <button class="btn-delete" @click="handleDelete(evt)">{{ t('page.manageSetting.settingEvents.delete') }}</button>
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

    <!-- Fake preview popup: how event looks to user -->
    <div v-if="showPreviewModal" class="modal-overlay event-preview-overlay" @click="showPreviewModal = false">
      <div class="event-preview-panel" @click.stop>
        <button type="button" class="event-preview-close" @click="showPreviewModal = false">×</button>
        <h2 class="event-preview-title">{{ t('component.events.title') }}</h2>
        <div
          v-if="previewEvent"
          class="event-preview-detail"
          :class="{ 'event-preview-detail--has-bg': previewEvent.image }"
          :style="previewEventBackgroundStyle"
        >
          <div class="event-preview-detail-inner">
            <h3 class="event-preview-name">{{ previewEvent.name }}</h3>
            <p class="event-preview-desc">{{ previewEvent.description || '—' }}</p>
            <section v-if="previewEvent.bonus?.length" class="event-preview-section">
              <h4>{{ t('component.events.bonus') }}</h4>
              <ul>
                <li v-for="(b, i) in previewEvent.bonus" :key="i"><span class="event-preview-bonus-label">{{ b.label }}:</span> {{ b.value }}</li>
              </ul>
            </section>
            <section v-if="previewEvent.items?.length" class="event-preview-section">
              <h4>{{ t('component.events.itemsInEvent') }}</h4>
              <div class="event-preview-item-grid">
                <div v-for="item in previewEvent.items" :key="item.id" class="event-preview-item-tile">
                  <img v-if="item.image" :src="item.image" :alt="item.name" class="event-preview-item-img" />
                  <span class="event-preview-item-name">{{ item.name }}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content modal-content--wide" @click.stop>
        <div class="modal-header">
          <h3>{{ editingItem ? t('page.manageSetting.settingEvents.edit') : t('page.manageSetting.settingEvents.create') }}</h3>
          <button class="btn-close" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <section class="form-section-block">
            <h4 class="form-section-title">{{ t('page.manageSetting.settingEvents.form.basicInfo') }}</h4>
            <div class="form-group">
              <label>{{ t('page.manageSetting.settingEvents.form.name') }}</label>
              <input v-model="formData.name" type="text" class="form-input" required />
            </div>
            <div class="form-group">
              <label>{{ t('page.manageSetting.settingEvents.form.description') }}</label>
              <textarea v-model="formData.description" rows="3" class="form-input"></textarea>
            </div>
            <div class="form-group">
              <label>{{ t('page.manageSetting.settingEvents.form.image') }}</label>
              <input type="file" accept="image/*" class="form-input" @change="handleImageChange" />
              <div v-if="formData.image_preview" class="image-preview">
                <img :src="formData.image_preview" alt="Preview" />
              </div>
              <div v-else-if="editingItem?.image" class="image-preview">
                <img :src="editingItem.image" alt="Current" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>{{ t('page.manageSetting.settingEvents.form.timeStart') }}</label>
                <input v-model="formData.time_start" type="datetime-local" class="form-input" />
                <span class="form-hint">{{ t('page.manageSetting.settingEvents.form.leaveEmptyHold') }}</span>
              </div>
              <div class="form-group">
                <label>{{ t('page.manageSetting.settingEvents.form.timeEnd') }}</label>
                <input v-model="formData.time_end" type="datetime-local" class="form-input" />
              </div>
            </div>
          </section>
          <section class="form-section-block">
            <h4 class="form-section-title">{{ t('page.manageSetting.settingEvents.form.bonus') }}</h4>
            <div class="form-group">
              <div v-for="(b, i) in formData.bonus" :key="i" class="bonus-row">
                <input v-model="b.label" type="text" class="form-input form-input--flex" :placeholder="t('page.manageSetting.settingEvents.form.bonusLabel')" />
                <input v-model="b.value" type="text" class="form-input form-input--small" :placeholder="t('page.manageSetting.settingEvents.form.bonusValue')" />
                <button type="button" class="btn-icon btn-icon--danger" @click="formData.bonus.splice(i, 1)" aria-label="Remove">×</button>
              </div>
              <button type="button" class="btn-outline btn-outline--small" @click="formData.bonus.push({ label: '', value: '' })">
                + {{ t('page.manageSetting.settingEvents.form.addBonus') }}
              </button>
            </div>
          </section>
          <section class="form-section-block">
            <h4 class="form-section-title">{{ t('page.manageSetting.settingEvents.form.itemsInEvent') }}</h4>
            <div class="form-group">
              <select v-model="formData.item_ids" multiple class="form-select form-select--multi">
                <option v-for="item in zoneItems" :key="item.id" :value="item.id">{{ item.name }} ({{ item.type }})</option>
              </select>
              <span class="form-hint">{{ t('page.manageSetting.settingEvents.form.itemsHint') }}</span>
              <button
                v-if="!editingItem"
                type="button"
                class="btn-outline btn-outline--small mt-8"
                @click="openCreateItemModal"
              >
                + {{ t('page.manageSetting.settingEvents.form.createNewItem') }}
              </button>
            </div>
          </section>
          <!-- Nested modal: Create new item (same fields as Setting Items page) -->
          <div v-if="showCreateItemModal" class="modal-overlay modal-overlay--nested" @click.self="closeCreateItemModal">
            <div class="modal-content modal-content--item-form" @click.stop>
              <div class="modal-header">
                <h4 class="modal-title">{{ t('page.manageSetting.settingEvents.form.createNewItem') }}</h4>
                <button type="button" class="btn-close" @click="closeCreateItemModal">×</button>
              </div>
              <div class="modal-body">
                <div class="form-group">
                  <label>{{ t('page.manageSetting.settingEvents.form.newItemName') }}</label>
                  <input v-model="newItemForm.name" type="text" class="form-input" />
                </div>
                <div class="form-group">
                  <label>{{ t('page.manageSetting.settingEvents.form.newItemType') }}</label>
                  <CustomSelect
                    v-model="newItemForm.type"
                    :options="newItemTypeOptions"
                    :placeholder="t('page.manageSetting.settingItems.selectType')"
                    trigger-class="form-select"
                  />
                </div>
                <div class="form-group">
                  <label>{{ t('page.manageSetting.settingEvents.form.description') }}</label>
                  <textarea v-model="newItemForm.description" rows="2" class="form-input" />
                </div>
                <div class="form-group">
                  <label>{{ t('page.manageSetting.settingItems.form.defaultProperty') || 'Properties' }}</label>
                  <div class="properties-list">
                    <div v-for="(item, index) in newItemPropertiesList" :key="index" class="property-item">
                      <template v-if="item.type === 'custom_option' && item.name">
                        <CustomOptionDisplay
                          :name="item.name"
                          :properties="item.properties || {}"
                          :stats-label="t('page.manageSetting.settingItems.stats')"
                          class="property-display"
                        />
                      </template>
                      <template v-else>
                        <CustomSelect
                          v-model="item.selectedValue"
                          :options="newItemPropertyOptions"
                          :placeholder="t('page.manageSetting.settingItems.selectKey') || 'Select Stat or Custom Option'"
                          @change="handleNewItemPropertyChange(index)"
                          trigger-class="property-select"
                        />
                        <input
                          v-if="item.type === 'stat' && item.selectedValue"
                          v-model.number="item.value"
                          type="number"
                          step="0.01"
                          :placeholder="t('page.manageSetting.settingItems.valuePlaceholder')"
                          class="rate-value-input"
                        />
                      </template>
                      <button type="button" class="btn-remove-rate" @click="removeNewItemProperty(index)" :title="t('page.manageSetting.settingItems.removeProperty')">×</button>
                    </div>
                    <button type="button" class="btn-add-rate" @click="addNewItemProperty">
                      <span class="btn-add-icon">+</span>
                      <span>{{ t('page.manageSetting.settingItems.addProperty') }}</span>
                    </button>
                  </div>
                </div>
                <div class="form-group">
                  <label>{{ t('page.manageSetting.settingItems.form.image') }}</label>
                  <input type="file" accept="image/*" class="form-input" @change="handleNewItemImageChange" />
                  <div v-if="newItemForm.image_preview" class="image-preview">
                    <img :src="newItemForm.image_preview" alt="Preview" />
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn-secondary" @click="closeCreateItemModal">{{ t('page.manageSetting.settingStackBonuses.cancel') }}</button>
                <button type="button" class="btn-primary" :disabled="creatingItem || !newItemForm.name?.trim() || !newItemForm.type" @click="handleCreateNewItem">
                  {{ creatingItem ? t('page.manageSetting.settingStackBonuses.saving') : t('page.manageSetting.settingStackBonuses.save') }}
                </button>
              </div>
            </div>
          </div>
          <section class="form-section-block">
            <h4 class="form-section-title">{{ t('page.manageSetting.settingEvents.form.dailyRewardBonus') }}</h4>
            <div class="form-group">
              <div v-for="(dr, idx) in formData.daily_reward_bonus" :key="idx" class="daily-bonus-block">
                <div class="daily-bonus-header">
                  <span class="daily-bonus-label">{{ t('page.manageSetting.settingEvents.form.day') }}</span>
                  <input v-model.number="dr.day" type="number" min="1" max="31" class="form-input form-input--tiny" />
                  <button type="button" class="btn-icon btn-icon--danger" @click="formData.daily_reward_bonus.splice(idx, 1)" aria-label="Remove">×</button>
                </div>
                <div v-for="(r, ri) in dr.rewards" :key="ri" class="reward-row">
                  <select v-model="r.type" class="form-select form-select--small">
                    <option value="coin">Coin</option>
                    <option value="exp">EXP</option>
                    <option value="item">Item</option>
                  </select>
                  <input v-model.number="r.quantity" type="number" min="0" class="form-input form-input--tiny" />
                  <select v-if="r.type === 'item'" v-model.number="r.item_id" class="form-select form-select--small">
                    <option :value="null">—</option>
                    <option v-for="item in eventItemOptions" :key="item.id" :value="item.id">{{ item.name }}</option>
                  </select>
                  <button type="button" class="btn-icon btn-icon--danger" @click="dr.rewards.splice(ri, 1)" aria-label="Remove">×</button>
                </div>
                <button type="button" class="btn-outline btn-outline--small" @click="dr.rewards.push({ type: 'coin', quantity: 0, item_id: null })">
                  + {{ t('page.manageSetting.settingStackBonuses.form.addReward') }}
                </button>
              </div>
              <button type="button" class="btn-outline btn-outline--small" @click="addDailyRewardBonus">
                + {{ t('page.manageSetting.settingEvents.form.addDailyBonus') }}
              </button>
            </div>
          </section>
          <section class="form-section-block">
            <div class="form-group">
              <label class="checkbox-label">
                <input v-model="formData.is_active" type="checkbox" class="form-checkbox" />
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
import { ref, computed, onMounted, inject } from 'vue'
import { parsePaginatedResponse, formatDateDisplay } from '../../../utils/settingApiResponse'
import { getGlobalStats, getGlobalTypes, isStatsDataLoaded, isTypesDataLoaded } from '../../../utils/globalData'
import { getItemConstants } from '../../../utils/constants'
import CustomSelect from '../../../components/CustomSelect.vue'
import CustomOptionDisplay from '../../../components/CustomOptionDisplay.vue'

const translator = inject('translator', null)
const t = translator || ((key) => key)
const gameApi = inject('gameApi')

function truncateText(text, maxLen = 40) {
  if (!text) return '—'
  return text.length > maxLen ? text.substring(0, maxLen) + '…' : text
}

const loading = ref(false)
const error = ref(null)
const events = ref([])
const pagination = ref(null)
const showModal = ref(false)
const showPreviewModal = ref(false)
const previewEvent = ref(null)
const editingItem = ref(null)
const saving = ref(false)

const previewEventBackgroundStyle = computed(() => {
  const evt = previewEvent.value
  if (!evt?.image) return {}
  return {
    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.7) 100%), url(${evt.image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }
})

function handleShowPreview(evt) {
  previewEvent.value = evt
  showPreviewModal.value = true
}
const zoneItems = ref([])
const showCreateItemModal = ref(false)
const creatingItem = ref(false)
const stats = ref([])
const customOptions = ref([])
const itemTypes = ref([])
const newItemPropertiesList = ref([])
const newItemImageFile = ref(null)
const itemC = getItemConstants()

const newItemForm = ref({
  name: '',
  type: itemC.ITEM_TYPE_SWORD,
  description: '',
  image_preview: null,
})

// Type options for new item: same source as Setting Items page (gear + other)
const newItemTypeOptions = computed(() => {
  const types = itemTypes.value
  if (!types.length) {
    const names = itemC.ITEM_TYPE_NAMES || {}
    const otherNames = itemC.OTHER_ITEM_TYPE_NAMES || {}
    const gear = [
      itemC.ITEM_TYPE_SWORD, itemC.ITEM_TYPE_HAT, itemC.ITEM_TYPE_SHIRT, itemC.ITEM_TYPE_TROUSER,
      itemC.ITEM_TYPE_SHOE, itemC.ITEM_TYPE_NECKLACE, itemC.ITEM_TYPE_BRACELET, itemC.ITEM_TYPE_RING,
      itemC.ITEM_TYPE_CLOTHES, itemC.ITEM_TYPE_WING,
    ].map((t) => ({ value: t, label: names[t] || t }))
    const other = [
      { value: itemC.ITEM_TYPE_BOX_RANDOM, label: otherNames[itemC.ITEM_TYPE_BOX_RANDOM] || 'Box Random' },
      { value: itemC.ITEM_TYPE_TICKET, label: otherNames[itemC.ITEM_TYPE_TICKET] || 'Ticket' },
      { value: itemC.ITEM_TYPE_BUFF, label: otherNames[itemC.ITEM_TYPE_BUFF] || 'Buff Card' },
    ]
    return [...gear, ...other]
  }
  return types.map((itemType) => ({ value: itemType.type, label: itemType.name || itemType.type }))
})

// Property options for new item (stats + custom options), same as Setting Items page
const newItemPropertyOptions = computed(() => {
  const options = []
  stats.value.forEach((stat) => {
    options.push({ value: stat.key, label: `${stat.name} (${stat.key})`, type: 'stat', isCustom: false })
  })
  customOptions.value.forEach((opt) => {
    options.push({ value: opt.id, label: opt.name, type: 'custom_option', isCustom: true, properties: opt.properties || {} })
  })
  return options
})

const selectedImageFile = ref(null)

const defaultForm = () => ({
  name: '',
  description: '',
  image: '',
  image_preview: null,
  time_start: null,
  time_end: null,
  bonus: [],
  daily_reward_bonus: [],
  item_ids: [],
  is_active: true,
})

function handleImageChange(event) {
  const file = event.target.files?.[0]
  selectedImageFile.value = file || null
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      formData.value.image_preview = e.target?.result || null
    }
    reader.readAsDataURL(file)
  } else {
    formData.value.image_preview = null
  }
}

const formData = ref(defaultForm())

const eventItemOptions = computed(() => {
  const ids = formData.value.item_ids || []
  return zoneItems.value.filter((item) => ids.includes(item.id))
})

function addDailyRewardBonus() {
  formData.value.daily_reward_bonus.push({ day: 1, rewards: [{ type: 'coin', quantity: 0, item_id: null }] })
}

const loadZoneItems = async () => {
  try {
    const res = await gameApi.getItemsForZone()
    if (res.data?.datas?.items) {
      zoneItems.value = res.data.datas.items
    }
  } catch (e) {
    console.error('Failed to load items', e)
  }
}

const loadEvents = async () => {
  if (!gameApi) return
  loading.value = true
  error.value = null
  try {
    const params = { currentPage: filters.value.currentPage, perPage: filters.value.perPage }
    const res = await gameApi.getSettingEvents(params)
    const { list, pagination: p } = parsePaginatedResponse(res, 'events')
    events.value = list
    pagination.value = p
  } catch (e) {
    error.value = e.message || t('page.manageSetting.settingEvents.messages.loadFailed')
  } finally {
    loading.value = false
  }
}

const filters = ref({ currentPage: 1, perPage: 15 })
const changePage = (page) => {
  filters.value.currentPage = page
  loadEvents()
}

function openCreateItemModal() {
  resetNewItemForm()
  showCreateItemModal.value = true
}

function closeCreateItemModal() {
  showCreateItemModal.value = false
  resetNewItemForm()
}

function resetNewItemForm() {
  newItemForm.value = { name: '', type: itemC.ITEM_TYPE_SWORD, description: '', image_preview: null }
  newItemPropertiesList.value = []
  newItemImageFile.value = null
}

function addNewItemProperty() {
  newItemPropertiesList.value.push({
    selectedValue: null,
    type: null,
    key: null,
    value: null,
    name: null,
    properties: {},
  })
}

function removeNewItemProperty(index) {
  newItemPropertiesList.value.splice(index, 1)
}

function handleNewItemPropertyChange(index) {
  const item = newItemPropertiesList.value[index]
  if (!item?.selectedValue) return
  const opt = newItemPropertyOptions.value.find((o) => o.value === item.selectedValue)
  if (!opt) return
  if (opt.type === 'stat') {
    item.type = 'stat'
    item.key = opt.value
    item.value = null
    item.name = null
    item.properties = {}
  } else if (opt.type === 'custom_option') {
    item.type = 'custom_option'
    item.name = opt.label
    item.properties = opt.properties || {}
    item.key = null
    item.value = null
  }
}

function handleNewItemImageChange(event) {
  const file = event.target.files?.[0]
  newItemImageFile.value = file || null
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      newItemForm.value.image_preview = e.target?.result || null
    }
    reader.readAsDataURL(file)
  } else {
    newItemForm.value.image_preview = null
  }
}

const handleCreate = () => {
  editingItem.value = null
  selectedImageFile.value = null
  formData.value = defaultForm()
  resetNewItemForm()
  showModal.value = true
}

async function handleCreateNewItem() {
  if (!newItemForm.value.name?.trim() || !newItemForm.value.type || !gameApi) return
  creatingItem.value = true
  try {
    const keyCounters = {}
    const defaultPropertyClean = {}
    const customStatsClean = []
    newItemPropertiesList.value.forEach((item) => {
      if (item.type === 'stat' && item.key) {
        if (item.value === null || item.value === undefined || item.value === '') return
        const numValue = typeof item.value === 'number' ? item.value : parseFloat(item.value)
        if (Number.isNaN(numValue) || !Number.isFinite(numValue)) return
        keyCounters[item.key] = (keyCounters[item.key] || 0) + 1
        const uniqueKey = keyCounters[item.key] === 1 ? item.key : `${item.key}_${keyCounters[item.key]}`
        defaultPropertyClean[uniqueKey] = numValue
      } else if (item.type === 'custom_option' && item.name && item.properties && Object.keys(item.properties).length > 0) {
        customStatsClean.push({ name: item.name, properties: item.properties })
      }
    })

    const fd = new FormData()
    fd.append('name', newItemForm.value.name.trim())
    fd.append('description', newItemForm.value.description || '')
    fd.append('type', newItemForm.value.type)
    if (Object.keys(defaultPropertyClean).length > 0) {
      fd.append('default_property', JSON.stringify(defaultPropertyClean))
    }
    if (customStatsClean.length > 0) {
      fd.append('custom_stats', JSON.stringify(customStatsClean))
    }
    if (newItemImageFile.value) {
      fd.append('image', newItemImageFile.value)
    }

    const res = await gameApi.createSettingItem(fd)
    const newId = res?.data?.datas?.setting_item?.id
    if (newId) {
      if (!formData.value.item_ids) formData.value.item_ids = []
      formData.value.item_ids.push(newId)
      await loadZoneItems()
    }
    closeCreateItemModal()
  } catch (e) {
    alert(t('page.manageSetting.settingEvents.messages.saveFailed') + ': ' + (e.response?.data?.message || e.message))
  } finally {
    creatingItem.value = false
  }
}

const handleEdit = (evt) => {
  editingItem.value = evt
  selectedImageFile.value = null
  formData.value = {
    name: evt.name ?? '',
    description: evt.description ?? '',
    image: evt.image ?? '',
    image_preview: null,
    time_start: evt.time_start ? evt.time_start.slice(0, 16) : null,
    time_end: evt.time_end ? evt.time_end.slice(0, 16) : null,
    bonus: Array.isArray(evt.bonus) && evt.bonus.length ? evt.bonus.map((b) => ({ ...b })) : [],
    daily_reward_bonus: Array.isArray(evt.daily_reward_bonus) && evt.daily_reward_bonus.length
      ? evt.daily_reward_bonus.map((d) => ({
          day: d.day,
          rewards: (d.rewards || []).map((r) => ({ type: r.type || 'coin', quantity: r.quantity ?? 0, item_id: r.item_id ?? null })),
        }))
      : [],
    item_ids: (evt.items || []).map((i) => i.id),
    is_active: evt.is_active !== false,
  }
  showModal.value = true
}

const handleDelete = async (evt) => {
  if (!confirm(t('page.manageSetting.settingEvents.confirmDelete'))) return
  try {
    await gameApi.deleteSettingEvent(evt.id)
    if (events.value.length === 1 && filters.value.currentPage > 1) {
      filters.value.currentPage = 1
    }
    loadEvents()
  } catch (e) {
    alert(t('page.manageSetting.settingEvents.messages.deleteFailed'))
  }
}

const closeModal = () => {
  showModal.value = false
  selectedImageFile.value = null
}

const handleSave = async () => {
  if (!formData.value.name?.trim()) {
    alert(t('page.manageSetting.settingEvents.messages.nameRequired'))
    return
  }
  saving.value = true
  try {
    const bonus = formData.value.bonus.filter((b) => b.label || b.value)
    const daily_reward_bonus = formData.value.daily_reward_bonus.map((d) => ({
      day: d.day,
      rewards: (d.rewards || []).map((r) => ({
        type: r.type,
        quantity: Number(r.quantity) || 0,
        item_id: r.type === 'item' && r.item_id ? r.item_id : null,
      })),
    }))
    const item_ids = formData.value.item_ids || []
    const hasImageFile = !!selectedImageFile.value
    if (hasImageFile) {
      const fd = new FormData()
      fd.append('name', formData.value.name.trim())
      fd.append('description', formData.value.description || '')
      fd.append('time_start', formData.value.time_start || '')
      fd.append('time_end', formData.value.time_end || '')
      fd.append('bonus', JSON.stringify(bonus))
      fd.append('daily_reward_bonus', JSON.stringify(daily_reward_bonus))
      fd.append('item_ids', JSON.stringify(item_ids))
      fd.append('is_active', formData.value.is_active ? '1' : '0')
      fd.append('image', selectedImageFile.value)
      if (editingItem.value) {
        await gameApi.updateSettingEvent(editingItem.value.id, fd)
      } else {
        await gameApi.createSettingEvent(fd)
      }
    } else {
      const payload = {
        name: formData.value.name.trim(),
        description: formData.value.description || null,
        time_start: formData.value.time_start || null,
        time_end: formData.value.time_end || null,
        bonus,
        daily_reward_bonus,
        item_ids,
        is_active: formData.value.is_active,
      }
      if (editingItem.value) {
        await gameApi.updateSettingEvent(editingItem.value.id, payload)
      } else {
        payload.image = formData.value.image || null
        await gameApi.createSettingEvent(payload)
      }
    }
    closeModal()
    loadEvents()
  } catch (e) {
    alert(t('page.manageSetting.settingEvents.messages.saveFailed') + ': ' + (e.response?.data?.message || e.message))
  } finally {
    saving.value = false
  }
}

async function ensureStatsAndTypesLoaded() {
  if (isStatsDataLoaded()) {
    const g = getGlobalStats()
    stats.value = g.stats || []
    customOptions.value = g.custom_options || []
  } else if (gameApi?.getAllStats) {
    try {
      const res = await gameApi.getAllStats()
      const data = res?.data?.datas
      if (data?.stats) stats.value = data.stats
      if (data?.custom_options) customOptions.value = data.custom_options
    } catch (e) {
      console.warn('Failed to load stats for create item form', e)
    }
  }
  if (isTypesDataLoaded()) {
    itemTypes.value = getGlobalTypes()
  }
}

onMounted(() => {
  loadZoneItems()
  loadEvents()
  ensureStatsAndTypesLoaded()
})
</script>

<style scoped>
/* Same style as other setting pages (SettingItemsListPage) */
.setting-events-page { width: 100%; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
.page-header h2 { color: #d0d4d6; margin: 0; }
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
.form-group label { display: block; margin-bottom: 5px; color: #d0d4d6; }
.form-group input, .form-group textarea, .form-input, .form-select { width: 100%; padding: 8px 12px; background: #253344; border: 1px solid #1a2332; color: #d0d4d6; border-radius: 4px; }
.form-input--small { min-width: 100px; }
.form-input--flex { flex: 1; min-width: 80px; }
.form-input--tiny { width: 56px; padding: 6px 8px; }
.form-select--small { min-width: 100px; padding: 6px 8px; }
.form-select--multi { min-height: 100px; }
.form-row { display: flex; gap: 16px; }
.form-row .form-group { flex: 1; }
.form-hint { font-size: 0.85rem; color: #8a9ba8; margin-top: 4px; display: block; }
.checkbox-label { display: flex; align-items: center; gap: 8px; cursor: pointer; color: #d0d4d6; }
.form-checkbox { width: 16px; height: 16px; accent-color: #f6a901; cursor: pointer; }
.bonus-row, .reward-row { display: flex; gap: 8px; margin-bottom: 8px; align-items: center; flex-wrap: wrap; }
.daily-bonus-block { margin-bottom: 12px; padding: 10px; background: rgba(0,0,0,0.2); border-radius: 6px; border: 1px solid #253344; }
.daily-bonus-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.daily-bonus-label { color: #d0d4d6; font-size: 0.9rem; }
.btn-icon { width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center; border: none; border-radius: 4px; cursor: pointer; flex-shrink: 0; background: #ff6b6b; color: white; font-size: 1.1rem; }
.btn-icon:hover { background: #ee5a5a; }
.btn-outline, .btn-outline--small { background: #253344; border: 1px solid #1a2332; color: #d0d4d6; padding: 8px 14px; border-radius: 4px; cursor: pointer; font-size: 14px; }
.btn-outline:hover { background: #1a2332; }
.btn-outline--small { padding: 6px 12px; font-size: 0.85rem; }
.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.modal-content { background: #2d3a4b; border: 1px solid #253344; width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto; padding: 0; }
.modal-content--wide { max-width: 640px; }
.modal-content--small { max-width: 420px; }
.modal-content--item-form { max-width: 520px; }
.modal-overlay--nested { z-index: 1001; }
.modal-title { margin: 0; color: #d0d4d6; font-size: 1rem; }
.mt-8 { margin-top: 8px; }
.properties-list { margin-top: 8px; }
.property-item { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; flex-wrap: wrap; }
.property-select { min-width: 140px; padding: 6px 8px; }
.rate-value-input { width: 80px; padding: 6px 8px; background: #253344; border: 1px solid #1a2332; color: #d0d4d6; border-radius: 4px; }
.btn-remove-rate { width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center; border: none; border-radius: 4px; cursor: pointer; background: #ff6b6b; color: white; font-size: 1.1rem; flex-shrink: 0; }
.btn-remove-rate:hover { background: #ee5a5a; }
.btn-add-rate { display: inline-flex; align-items: center; gap: 6px; background: #253344; border: 1px solid #1a2332; color: #d0d4d6; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 0.9rem; margin-top: 4px; }
.btn-add-rate:hover { background: #1a2332; }
.btn-add-icon { font-weight: 700; }
.property-display { flex: 1; min-width: 0; }
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
.btn-edit, .btn-delete { padding: 6px 12px; margin-right: 5px; cursor: pointer; border-radius: 4px; border: none; font-size: 14px; }
.btn-edit { background: #4a90e2; color: white; }
.btn-edit:hover { background: #357abd; }
.btn-delete { background: #ff6b6b; color: white; }
.btn-delete:hover { background: #ee5a5a; }
.pagination { display: flex; justify-content: center; align-items: center; gap: 15px; margin-top: 20px; color: #d0d4d6; }
.pagination button { padding: 8px 16px; background: #253344; border: 1px solid #1a2332; color: #d0d4d6; cursor: pointer; border-radius: 4px; }
.pagination button:disabled { opacity: 0.5; cursor: not-allowed; }
.pagination button:not(:disabled):hover { background: #1a2332; }
.event-thumb { width: 40px; height: 40px; object-fit: contain; border-radius: 4px; vertical-align: middle; }
.btn-preview { padding: 6px 12px; margin-right: 5px; cursor: pointer; border-radius: 4px; border: none; font-size: 14px; background: #5a6b7d; color: white; }
.btn-preview:hover { background: #4a5b6d; }
.event-preview-overlay { z-index: 1001; }
.event-preview-panel { position: relative; width: 90%; height: 90%; max-width: 720px; max-height: 560px; background: linear-gradient(180deg, rgba(12,20,30,0.98) 0%, rgba(6,10,16,0.98) 100%); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; box-shadow: 0 14px 40px rgba(0,0,0,0.5); display: flex; flex-direction: column; overflow: hidden; }
.event-preview-close { position: absolute; right: 12px; top: 10px; background: transparent; border: none; color: #fff; font-size: 24px; cursor: pointer; z-index: 2; }
.event-preview-title { margin: 0; padding: 16px; font-size: 1.25rem; font-weight: 700; color: #f6a901; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); flex-shrink: 0; }
.event-preview-detail { flex: 1; min-height: 0; overflow-y: auto; position: relative; }
.event-preview-detail-inner { padding: 24px; position: relative; z-index: 1; min-height: 100%; color: #fff; }
.event-preview-name { margin: 0 0 12px; font-size: 1.35rem; font-weight: 700; color: #f6a901; }
.event-preview-desc { margin: 0 0 20px; font-size: 0.95rem; line-height: 1.5; color: rgba(255,255,255,0.85); }
.event-preview-section { margin-bottom: 20px; }
.event-preview-section h4 { margin: 0 0 10px; font-size: 0.9rem; color: #fff; text-transform: uppercase; letter-spacing: 0.05em; }
.event-preview-section ul { margin: 0; padding-left: 1.2em; color: rgba(255,255,255,0.8); }
.event-preview-bonus-label { color: #fff; margin-right: 6px; }
.event-preview-item-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 12px; }
.event-preview-item-tile { display: flex; flex-direction: column; align-items: center; padding: 8px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; }
.event-preview-item-img { width: 48px; height: 48px; object-fit: contain; margin-bottom: 6px; }
.event-preview-item-name { font-size: 0.75rem; text-align: center; line-height: 1.2; color: #fff; }
.image-preview { margin-top: 8px; }
.image-preview img { max-width: 120px; max-height: 120px; object-fit: contain; border-radius: 4px; border: 1px solid #253344; }
</style>
