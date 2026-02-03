<template>
  <div class="setting-item-sets-list-page">
    <div class="page-header">
      <h2>{{ t('page.manageSetting.settingItemSets.title') }}</h2>
      <button class="btn-primary" @click="handleCreate">
        {{ t('page.manageSetting.settingItemSets.create') }}
      </button>
    </div>

    <div class="filters">
      <input 
        v-model="filters.search"
        type="text" 
        :placeholder="t('page.manageSetting.settingItemSets.searchPlaceholder')"
        class="search-input"
        @input="handleSearch"
      />
    </div>

    <div v-if="loading" class="loading">
      {{ t('page.manageSetting.settingItemSets.loading') }}
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <div v-if="!loading && !error" class="table-container">
      <table class="settings-table">
        <thead>
          <tr>
            <th>{{ t('page.manageSetting.settingItemSets.table.id') }}</th>
            <th>{{ t('page.manageSetting.settingItemSets.table.name') }}</th>
            <th>{{ t('page.manageSetting.settingItemSets.table.items') }}</th>
            <th>{{ t('page.manageSetting.settingItemSets.table.setBonuses') }}</th>
            <th>{{ t('page.manageSetting.settingItemSets.table.description') }}</th>
            <th>{{ t('page.manageSetting.settingItemSets.table.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="set in settingItemSets" :key="set.id">
            <td>{{ set.id }}</td>
            <td>{{ set.name }}</td>
            <td>
              <span class="items-count">{{ set.items_count || 0 }} {{ t('page.manageSetting.settingItemSets.labels.items') }}</span>
              <div v-if="set.items && set.items.length > 0" class="items-preview">
                <span v-for="(item, idx) in set.items.slice(0, 3)" :key="item.id" class="item-tag">
                  {{ item.name }}
                </span>
                <span v-if="set.items.length > 3" class="item-tag more">+{{ set.items.length - 3 }}</span>
              </div>
            </td>
            <td>
              <StatMapPreview 
                :value="set.set_bonuses" 
                :custom_stats="set.custom_stats"
                :max-items-per-group="3"
                :max-custom-stats-per-group="2"
                :stats-label="t('page.manageSetting.settingItems.stats')"
              />
            </td>
            <td>{{ truncateDescription(set.description) }}</td>
            <td class="actions-cell">
              <button class="btn-edit" @click="handleEdit(set)">{{ t('page.manageSetting.settingItemSets.actions.edit') }}</button>
              <button class="btn-delete" @click="handleDelete(set)">{{ t('page.manageSetting.settingItemSets.actions.delete') }}</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="pagination" class="pagination">
        <button 
          :disabled="pagination.current_page === 1"
          @click="changePage(pagination.current_page - 1)"
        >
          {{ t('page.manageSetting.settingItemSets.pagination.prev') }}
        </button>
        <span>{{ t('page.manageSetting.settingItemSets.pagination.page') }} {{ pagination.current_page }} {{ t('page.manageSetting.settingItemSets.pagination.of') }} {{ pagination.last_page }}</span>
        <button 
          :disabled="pagination.current_page === pagination.last_page"
          @click="changePage(pagination.current_page + 1)"
        >
          {{ t('page.manageSetting.settingItemSets.pagination.next') }}
        </button>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ editingSet ? t('page.manageSetting.settingItemSets.edit') : t('page.manageSetting.settingItemSets.createModal') }}</h3>
          <button class="btn-close" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>{{ t('page.manageSetting.settingItemSets.form.name') }}</label>
            <input v-model="formData.name" type="text" required />
          </div>
          <div class="form-group">
            <label>{{ t('page.manageSetting.settingItemSets.form.description') }}</label>
            <textarea v-model="formData.description" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label>{{ t('page.manageSetting.settingItemSets.form.items') }}</label>
            <div v-if="loadingItems" class="loading-items">{{ t('page.manageSetting.settingItemSets.loadingItems') }}</div>
            <div v-else class="items-selector">
              <div 
                v-for="item in availableItems" 
                :key="item.id"
                class="item-checkbox"
              >
                <label>
                  <input 
                    type="checkbox" 
                    :value="item.id"
                    v-model="formData.item_ids"
                  />
                  <span class="item-name">{{ item.name }}</span>
                  <span class="item-type">{{ item.type }}</span>
                  <img v-if="item.image" :src="item.image" alt="" class="item-thumb" />
                </label>
              </div>
              <div v-if="availableItems.length === 0" class="no-items">
                {{ t('page.manageSetting.settingItemSets.noItems') }}
              </div>
            </div>
          </div>
          <div class="form-group">
            <label>{{ t('page.manageSetting.settingItemSets.form.setBonuses') }}</label>
            <div v-if="formData.item_ids.length === 0" class="no-items-message">
              {{ t('page.manageSetting.settingItemSets.noItemsForBonus') }}
            </div>
            <div v-else class="bonuses-editor">
              <div v-if="loadingKeys" class="loading-stats">
                {{ t('page.manageSetting.settingItemSets.loadingKeys') }}
              </div>
              <div v-else-if="stats.length === 0 && customOptions.length === 0" class="no-stats-message">
                {{ t('page.manageSetting.settingItemSets.noStats') }}
              </div>
              <template v-else>
                <BonusSection
                  v-for="bonusLevel in availableBonusLevels"
                  :key="bonusLevel.key"
                  :label="bonusLevel.label"
                  :bonuses="bonusesList[bonusLevel.key] || []"
                  :bonus-key-options="bonusKeyOptions"
                  :custom-option-options="customOptionOptions"
                  :select-key-placeholder="t('page.manageSetting.settingItemSets.selectKey')"
                  :value-placeholder="t('page.manageSetting.settingItemSets.valuePlaceholder')"
                  :add-option-label="t('page.manageSetting.settingItemSets.addOption')"
                  :remove-label="t('page.manageSetting.settingItemSets.removeBonus')"
                  @add="() => addBonus(bonusLevel.key)"
                  @remove="(index) => removeBonus(bonusLevel.key, index)"
                  @key-change="(index) => handleBonusKeyChange(bonusLevel.key, index)"
                />
              </template>
            </div>
            <small class="form-hint">{{ t('page.manageSetting.settingItemSets.bonusesHint') }}</small>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeModal" :disabled="saveLoading">{{ t('page.manageSetting.settingItemSets.actions.cancel') }}</button>
          <button 
            class="btn-primary" 
            :class="{ 'btn-loading': saveLoading, 'btn-fail': saveFailed }"
            @click="handleSave"
            :disabled="saveLoading || !formData.name || formData.item_ids.length === 0"
          >
            <span v-if="saveLoading">{{ t('page.manageSetting.settingItemSets.saving') }}</span>
            <span v-else-if="saveFailed">{{ t('page.manageSetting.settingItemSets.saveFailed') }}</span>
            <span v-else>{{ editingSet ? t('page.manageSetting.settingItemSets.actions.update') : t('page.manageSetting.settingItemSets.actions.create') }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, computed, watch, nextTick } from 'vue'
import StatMapPreview from '../../../components/StatMapPreview.vue'
import BonusSection from '../../../components/BonusSection.vue'
import { getGlobalStats, isStatsDataLoaded } from '../../../utils/globalData'

const gameApi = inject('gameApi', null)
const translator = inject('translator', null)
const t = translator || ((key) => key)
const statHelpers = inject('statHelpers', null)

const loading = ref(false)
const loadingItems = ref(false)
const loadingKeys = ref(false)
const error = ref(null)
const settingItemSets = ref([])
const stats = ref([])
const customOptions = ref([])
const availableItems = ref([])
const pagination = ref(null)
const showModal = ref(false)
const editingSet = ref(null)
const saveLoading = ref(false)
const saveFailed = ref(false)

const filters = ref({
  search: '',
  currentPage: 1,
  perPage: 11
})

const formData = ref({
  name: '',
  description: '',
  item_ids: [],
  set_bonuses: {},
  custom_stats: []
})

const bonusesList = ref({})

// Computed property for available bonus levels based on item count
const availableBonusLevels = computed(() => {
  const itemCount = formData.value.item_ids.length
  const levels = []
  
  if (itemCount === 0) {
    return []
  }
  
  // Add bonus levels from 1 to item count
  for (let i = 1; i <= itemCount; i++) {
    levels.push({
      key: i,
      label: `${i} ${i === 1 ? t('page.manageSetting.settingItemSets.itemBonus') : t('page.manageSetting.settingItemSets.itemsBonus')}`
    })
  }
  
  // Always add full set bonus
  levels.push({
    key: 'full',
    label: 'Full Set Bonus:'
  })
  
  return levels
})

// Sync bonuses from formData to bonusesList (for editing)
// Now handles both stats and custom options per level
const syncBonusesToList = () => {
  bonusesList.value = {}
  
  // Initialize empty lists for available levels
  availableBonusLevels.value.forEach(level => {
    bonusesList.value[level.key] = []
  })
  
  // Load stats from set_bonuses
  if (formData.value.set_bonuses && typeof formData.value.set_bonuses === 'object') {
    Object.keys(formData.value.set_bonuses).forEach(levelKey => {
      if (!bonusesList.value[levelKey]) {
        bonusesList.value[levelKey] = []
      }
      const statsList = statHelpers ? statHelpers.mapToList(formData.value.set_bonuses[levelKey], stats.value, { customPrefix: '' }) : []
      statsList.forEach(stat => {
        bonusesList.value[levelKey].push({
          selectedValue: stat.key,
          type: 'stat',
          key: stat.key,
          value: stat.value,
          name: null,
          properties: {}
        })
      })
    })
  }
  
  // Load custom options from custom_stats (by level)
  if (formData.value.custom_stats && typeof formData.value.custom_stats === 'object') {
    Object.keys(formData.value.custom_stats).forEach(levelKey => {
      if (!bonusesList.value[levelKey]) {
        bonusesList.value[levelKey] = []
      }
      const customStatsForLevel = formData.value.custom_stats[levelKey]
      // Ensure it's an array
      if (Array.isArray(customStatsForLevel)) {
        customStatsForLevel.forEach(cs => {
          if (cs && typeof cs === 'object' && cs.name) {
            const matchingOption = customOptions.value.find(opt => opt.name === cs.name)
            bonusesList.value[levelKey].push({
              selectedValue: matchingOption ? matchingOption.id : `custom_${cs.name}`,
              type: 'custom_option',
              key: null,
              value: null,
              name: cs.name, // Use stored name (snapshot)
              properties: cs.properties || {} // Use stored properties (snapshot)
            })
          }
        })
      }
    })
  }
}

// Sync bonuses from bonusesList to formData
// Separates stats into set_bonuses and custom options into custom_stats (by level)
const syncBonusesFromList = () => {
  const setBonuses = {}
  const customStats = {}
  
  Object.keys(bonusesList.value).forEach(levelKey => {
    const list = bonusesList.value[levelKey] || []
    const statsForLevel = {}
    const customStatsForLevel = []
    
    list.forEach(item => {
      if (item.type === 'stat' && item.key) {
        // Regular stat - add to set_bonuses
        if (item.value !== null && item.value !== undefined && item.value !== '') {
          const numValue = typeof item.value === 'number' ? item.value : parseFloat(item.value)
          if (!isNaN(numValue) && isFinite(numValue)) {
            statsForLevel[item.key] = numValue
          }
        }
      } else if (item.type === 'custom_option' && item.name && item.properties && Object.keys(item.properties).length > 0) {
        // Custom option - add to custom_stats
        customStatsForLevel.push({
          name: item.name,
          properties: item.properties
        })
      }
    })
    
    if (Object.keys(statsForLevel).length > 0) {
      setBonuses[levelKey] = statsForLevel
    }
    
    if (customStatsForLevel.length > 0) {
      customStats[levelKey] = customStatsForLevel
    }
  })
  
  formData.value.set_bonuses = Object.keys(setBonuses).length > 0 ? setBonuses : null
  formData.value.custom_stats = Object.keys(customStats).length > 0 ? customStats : {}
}

// Bonus handlers
const addBonus = (level) => {
  // Ensure the array exists for this level
  if (!bonusesList.value[level]) {
    bonusesList.value[level] = []
  }
  bonusesList.value[level].push({
    selectedValue: null,
    type: null, // 'stat' or 'custom_option'
    key: null, // for stats
    value: null, // for stats
    name: null, // for custom options
    properties: {} // for custom options
  })
}

const removeBonus = (level, index) => {
  bonusesList.value[level].splice(index, 1)
  syncBonusesFromList()
}

const handleBonusKeyChange = (level, index) => {
  const item = bonusesList.value[level][index]
  if (!item || !item.selectedValue) return
  
  // Find the selected option in unified list
  const selected = unifiedPropertyOptions.value.find(opt => opt.value === item.selectedValue)
  if (!selected) return
  
  if (selected.type === 'stat') {
    // It's a regular stat
    item.type = 'stat'
    item.key = selected.value
    item.value = null
    item.name = null
    item.properties = {}
  } else if (selected.type === 'custom_option') {
    // It's a custom option - store snapshot (name and properties) immediately
    item.type = 'custom_option'
    item.name = selected.label // Store name snapshot
    item.properties = { ...selected.properties } || {} // Store properties snapshot (copy, not reference)
    item.key = null
    item.value = null
  }
  
  syncBonusesFromList()
}

// Watch item_ids to initialize/cleanup bonus levels
watch(() => formData.value.item_ids.length, (newCount, oldCount) => {
  // Initialize bonus lists for new levels
  availableBonusLevels.value.forEach(level => {
    if (!bonusesList.value[level.key]) {
      bonusesList.value[level.key] = []
    }
  })
  
  // Remove bonus lists for levels that are no longer valid
  Object.keys(bonusesList.value).forEach(key => {
    const isValidLevel = availableBonusLevels.value.some(level => level.key.toString() === key.toString())
    if (!isValidLevel) {
      delete bonusesList.value[key]
    }
  })
  
  syncBonusesFromList()
}, { immediate: true })

// Watch stats and customOptions to update selections when they load
watch([() => stats.value.length, () => customOptions.value.length], ([statsLength, customLength], [oldStatsLength, oldCustomLength]) => {
  // Only trigger if stats were just loaded (length changed from 0 to > 0)
  if ((statsLength > 0 && oldStatsLength === 0) || (customLength > 0 && oldCustomLength === 0)) {
    if (editingSet.value) {
      // Re-sync bonuses and custom stats
      syncBonusesToList()
      syncCustomStatsToList()
    }
  }
})


// Bonus key options (for set_bonuses - only stats)
const bonusKeyOptions = computed(() => {
  return stats.value.map(stat => ({
    value: stat.key,
    label: `${stat.name} (${stat.key})`
  }))
})

// Custom option options (for custom_stats)
const customOptionOptions = computed(() => {
  // Allow duplicate custom options - don't filter out already selected ones
  return customOptions.value.map(customOption => ({
    value: customOption.id,
    label: customOption.name,
    properties: customOption.properties
  }))
})

// Unified property options (combines stats and custom options for BonusSection)
const unifiedPropertyOptions = computed(() => {
  const options = []
  
  // Add regular stats
  stats.value.forEach(stat => {
    options.push({
      value: stat.key,
      label: `${stat.name} (${stat.key})`,
      type: 'stat',
      isCustom: false
    })
  })
  
  // Add custom options
  customOptions.value.forEach(customOption => {
    options.push({
      value: customOption.id,
      label: customOption.name,
      type: 'custom_option',
      isCustom: true,
      properties: customOption.properties
    })
  })
  
  return options
})



const loadSettingItemSets = async () => {
  if (!gameApi) {
    error.value = t('page.manageSetting.settingItemSets.errors.apiNotAvailable')
    return
  }

  loading.value = true
  error.value = null

  try {
    const params = {
      currentPage: filters.value.currentPage,
      perPage: filters.value.perPage
    }

    if (filters.value.search) {
      params.keySearch = filters.value.search
    }


    const response = await gameApi.getSettingItemSets(params)
    
    if (response.data && response.data.datas && response.data.datas.setting_item_sets) {
      settingItemSets.value = response.data.datas.setting_item_sets.data || []
      pagination.value = {
        current_page: response.data.datas.setting_item_sets.current_page,
        last_page: response.data.datas.setting_item_sets.last_page,
        total: response.data.datas.setting_item_sets.total
      }
    }

  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Failed to load item sets'
    console.error('Error loading item sets:', err)
  } finally {
    loading.value = false
  }
}

const loadItemsForZone = async () => {
  if (!gameApi) {
    return
  }

  loadingItems.value = true
  try {
    const response = await gameApi.getItemsForZone()
    if (response.data && response.data.datas && response.data.datas.items) {
      availableItems.value = response.data.datas.items
    }
  } catch (err) {
    console.error('Error loading items for zone:', err)
    availableItems.value = []
  } finally {
    loadingItems.value = false
  }
}

const handleSearch = () => {
  filters.value.currentPage = 1
  loadSettingItemSets()
}

const changePage = (page) => {
  filters.value.currentPage = page
  loadSettingItemSets()
}

const handleCreate = async () => {
  editingSet.value = null
  saveLoading.value = false
  saveFailed.value = false
  formData.value = {
    name: '',
    description: '',
    item_ids: [],
    set_bonuses: {},
    custom_stats: []
  }
  bonusesList.value = {}
  await loadItemsForZone()
  showModal.value = true
}

const handleEdit = async (set) => {
  editingSet.value = set
  saveLoading.value = false
  saveFailed.value = false
  formData.value = {
    name: set.name || '',
    description: set.description || '',
    item_ids: set.items ? set.items.map(item => item.id) : [],
    set_bonuses: set.set_bonuses || {},
    custom_stats: set.custom_stats && typeof set.custom_stats === 'object' ? { ...set.custom_stats } : {}
  }
  
  // Ensure stats are loaded before syncing bonuses
  if (stats.value.length === 0) {
    await loadStats()
  }
  
  syncBonusesToList()
  await loadItemsForZone()
  showModal.value = true
}

const handleSave = async () => {
  if (!gameApi) {
    error.value = t('page.manageSetting.settingItemSets.errors.apiNotAvailable')
    return
  }

  if (!formData.value.name) {
    error.value = t('page.manageSetting.settingItemSets.errors.nameRequired')
    return
  }


  if (formData.value.item_ids.length === 0) {
    error.value = t('page.manageSetting.settingItemSets.errors.itemsRequired')
    return
  }

  saveLoading.value = true
  saveFailed.value = false
  error.value = null

  try {
    // Sync bonuses from list before saving (separates stats and custom options by level)
    syncBonusesFromList()

    // Send custom_stats and set_bonuses as objects (not stringified) for JSON requests
    // The backend's prepareForValidation will handle string decoding if needed
    const data = {
      name: formData.value.name,
      description: formData.value.description || null,
      set_bonuses: formData.value.set_bonuses && Object.keys(formData.value.set_bonuses).length > 0 
        ? formData.value.set_bonuses 
        : null,
      custom_stats: formData.value.custom_stats && Object.keys(formData.value.custom_stats).length > 0 
        ? formData.value.custom_stats 
        : null,
      item_ids: formData.value.item_ids
    }

    if (editingSet.value) {
      await gameApi.updateSettingItemSet(editingSet.value.id, data)
    } else {
      await gameApi.createSettingItemSet(data)
    }
    
    saveLoading.value = false
    saveFailed.value = false
    closeModal()
    loadSettingItemSets()
  } catch (err) {
    saveLoading.value = false
    saveFailed.value = true
    error.value = err.response?.data?.message || err.message || 'Failed to save item set'
    console.error('Error saving item set:', err)
    
    // Reset fail state after 3 seconds
    setTimeout(() => {
      saveFailed.value = false
    }, 3000)
  }
}

const handleDelete = async (set) => {
  if (!gameApi) {
    error.value = t('page.manageSetting.settingItemSets.errors.apiNotAvailable')
    return
  }

  if (!confirm(t('page.manageSetting.settingItemSets.confirm.delete', `Are you sure you want to delete "${set.name}"?`).replace('{name}', set.name))) {
    return
  }

  loading.value = true
  error.value = null

  try {
    await gameApi.deleteSettingItemSet(set.id)
    loadSettingItemSets()
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Failed to delete item set'
    console.error('Error deleting item set:', err)
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  showModal.value = false
  editingSet.value = null
  saveLoading.value = false
  saveFailed.value = false
  formData.value = {
    name: '',
    description: '',
    item_ids: [],
    set_bonuses: {},
    custom_stats: []
  }
  bonusesList.value = {}
  availableItems.value = []
}

const truncateDescription = (description) => {
  if (!description) return ''
  return description.length > 100 ? description.substring(0, 100) + '...' : description
}

const loadStats = () => {
  // Use global stats data
  if (isStatsDataLoaded()) {
    const globalData = getGlobalStats()
    stats.value = globalData.stats || []
    customOptions.value = globalData.custom_options || []
    loadingKeys.value = false
  } else {
    loadingKeys.value = true
    // Wait a bit for global data to load
    const checkInterval = setInterval(() => {
      if (isStatsDataLoaded()) {
        const globalData = getGlobalStats()
        stats.value = globalData.stats || []
        customOptions.value = globalData.custom_options || []
        loadingKeys.value = false
        clearInterval(checkInterval)
      }
    }, 100)
    setTimeout(() => {
      clearInterval(checkInterval)
      if (loadingKeys.value) {
        loadingKeys.value = false
      }
    }, 5000)
  }
}

onMounted(() => {
  loadSettingItemSets()
  loadStats()
})
</script>

<style scoped>
.setting-item-sets-list-page {
  width: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  color: #d0d4d6;
  margin: 0;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  padding: 10px;
  background: #253344;
  border: 1px solid #1a2332;
  color: #d0d4d6;
  font-size: 14px;
}


.loading, .error {
  padding: 20px;
  text-align: center;
  color: #d0d4d6;
}

.error {
  color: #ff6b6b;
}

.table-container {
  overflow-x: auto;
}

.settings-table {
  width: 100%;
  border-collapse: collapse;
  background: #253344;
}

.settings-table th,
.settings-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #1a2332;
  color: #d0d4d6;
}

.settings-table th {
  background: #1a2332;
  font-weight: 600;
  color: #f6a901;
}

.settings-table tr:hover {
  background: #1a2332;
}

.items-count {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.items-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.item-tag {
  padding: 2px 8px;
  background: #1a2332;
  border-radius: 3px;
  font-size: 12px;
}

.item-tag.more {
  color: #f6a901;
}

/* legacy JSON preview (replaced by StatMapPreview) */

.actions-cell {
  white-space: nowrap;
}

.btn-primary, .btn-secondary, .btn-edit, .btn-delete, .btn-close {
  padding: 8px 16px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.25s;
}

.btn-primary {
  background: #f6a901;
  color: #423714;
}

.btn-primary:hover:not(:disabled) {
  background: #f6f6f8;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-loading {
  background: #4a90e2 !important;
  color: white !important;
  position: relative;
  padding-right: 35px;
}

.btn-loading::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  right: 10px;
  top: 50%;
  margin-top: -8px;
}

.btn-fail {
  background: #ff6b6b !important;
  color: white !important;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.btn-secondary {
  background: #253344;
  color: #d0d4d6;
  border: 1px solid #1a2332;
}

.btn-secondary:hover {
  background: #1a2332;
}

.btn-edit {
  background: #4a90e2;
  color: white;
  margin-right: 5px;
}

.btn-edit:hover {
  background: #357abd;
}

.btn-delete {
  background: #ff6b6b;
  color: white;
}

.btn-delete:hover {
  background: #ee5a5a;
}

.btn-close {
  background: transparent;
  color: #d0d4d6;
  font-size: 24px;
  padding: 0;
  width: 30px;
  height: 30px;
  line-height: 30px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
  color: #d0d4d6;
}

.pagination button {
  padding: 8px 16px;
  background: #253344;
  border: 1px solid #1a2332;
  color: #d0d4d6;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination button:not(:disabled):hover {
  background: #1a2332;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #2d3a4b;
  border: 1px solid #253344;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #253344;
}

.modal-header h3 {
  margin: 0;
  color: #d0d4d6;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #d0d4d6;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  background: #253344;
  border: 1px solid #1a2332;
  color: #d0d4d6;
  font-size: 14px;
  font-family: inherit;
}

.form-group textarea {
  resize: vertical;
}

.form-hint {
  display: block;
  margin-top: 5px;
  font-size: 12px;
  color: #999;
}

.loading-items {
  padding: 10px;
  color: #999;
  font-size: 14px;
}

.items-selector {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #1a2332;
  padding: 10px;
  background: #253344;
}

.item-checkbox {
  margin-bottom: 10px;
}

.item-checkbox label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.item-checkbox label:hover {
  background: #1a2332;
}

.item-checkbox input[type="checkbox"] {
  width: auto;
  margin: 0;
}

.item-name {
  flex: 1;
  color: #d0d4d6;
}

.item-type {
  font-size: 12px;
  color: #999;
  padding: 2px 8px;
  background: #1a2332;
  border-radius: 3px;
}

.item-thumb {
  width: 30px;
  height: 30px;
  object-fit: cover;
  border-radius: 4px;
}

.no-items {
  padding: 20px;
  text-align: center;
  color: #999;
}

.no-items-message {
  padding: 15px;
  background: #1a2332;
  border: 1px solid #253344;
  border-radius: 4px;
  color: #999;
  text-align: center;
  font-size: 14px;
}

.loading-stats,
.no-stats-message {
  padding: 15px;
  background: #1a2332;
  border: 1px solid #253344;
  border-radius: 4px;
  color: #999;
  text-align: center;
  font-size: 14px;
}

.bonuses-editor {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}


.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #253344;
}

@media (max-width: 768px) {
  .bonuses-editor {
    grid-template-columns: 1fr;
  }
}


.custom-stats-list {
  margin-top: 10px;
}

.custom-stat-item {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 8px;
}

.custom-option-select {
  flex: 1;
}
</style>
