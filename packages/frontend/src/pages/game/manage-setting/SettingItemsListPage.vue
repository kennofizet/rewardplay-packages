<template>
  <div class="setting-items-list-page">
    <div class="page-header">
      <h2>{{ t('page.manageSetting.settingItems.title') }}</h2>
      <button class="btn-primary" @click="handleCreate">
        {{ t('page.manageSetting.settingItems.create') }}
      </button>
    </div>

    <div class="filters">
      <input 
        v-model="filters.search"
        type="text" 
        :placeholder="t('page.manageSetting.settingItems.searchPlaceholder')"
        class="search-input"
        @input="handleSearch"
      />
      <CustomSelect
        v-model="filters.type"
        :options="typeOptionsWithEmpty"
        :placeholder="t('page.manageSetting.settingItems.allTypes')"
        @change="loadSettingItems"
        trigger-class="type-select"
      />
    </div>

    <div v-if="loading" class="loading">
      {{ t('page.manageSetting.settingItems.loading') }}
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <div v-if="!loading && !error" class="table-container">
      <table class="settings-table">
        <thead>
          <tr>
            <th>{{ t('page.manageSetting.settingItems.table.id') }}</th>
            <th>{{ t('page.manageSetting.settingItems.table.name') }}</th>
            <th>{{ t('page.manageSetting.settingItems.table.slug') }}</th>
            <th>{{ t('page.manageSetting.settingItems.table.type') }}</th>
            <th>{{ t('page.manageSetting.settingItems.table.image') }}</th>
            <th>{{ t('page.manageSetting.settingItems.table.defaultProperty') }}</th>
            <th>{{ t('page.manageSetting.settingItems.table.description') }}</th>
            <th>{{ t('page.manageSetting.settingItems.table.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in settingItems" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.slug }}</td>
            <td>{{ getTypeName ? getTypeName(item.type) : item.type }}</td>
            <td>
              <img v-if="item.image" :src="item.image" alt="" class="item-image" />
              <span v-else>-</span>
            </td>
            <td>
              <StatMapPreview :value="item.default_property" :max-items="3" />
              <div v-if="item.custom_stats && item.custom_stats.length > 0" class="custom-stats-preview">
                <div v-for="(customStat, idx) in item.custom_stats" :key="idx" class="custom-stat-tag">
                  {{ customStat.name }}
                </div>
              </div>
            </td>
            <td>{{ truncateDescription(item.description) }}</td>
            <td class="actions-cell">
              <button class="btn-edit" @click="handleEdit(item)">{{ t('page.manageSetting.settingItems.actions.edit') }}</button>
              <button class="btn-delete" @click="handleDelete(item)">{{ t('page.manageSetting.settingItems.actions.delete') }}</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="pagination" class="pagination">
        <button 
          :disabled="pagination.current_page === 1"
          @click="changePage(pagination.current_page - 1)"
        >
          {{ t('page.manageSetting.settingItems.pagination.prev') }}
        </button>
        <span>{{ t('page.manageSetting.settingItems.pagination.page') }} {{ pagination.current_page }} {{ t('page.manageSetting.settingItems.pagination.of') }} {{ pagination.last_page }}</span>
        <button 
          :disabled="pagination.current_page === pagination.last_page"
          @click="changePage(pagination.current_page + 1)"
        >
          {{ t('page.manageSetting.settingItems.pagination.next') }}
        </button>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ editingItem ? t('page.manageSetting.settingItems.edit') : t('page.manageSetting.settingItems.createModal') }}</h3>
          <button class="btn-close" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>{{ t('page.manageSetting.settingItems.form.name') }}</label>
            <input v-model="formData.name" type="text" required />
          </div>
          <div class="form-group">
            <label>Type *</label>
            <CustomSelect
              v-model="formData.type"
              :options="typeOptions"
              :placeholder="t('page.manageSetting.settingItems.selectType')"
              :disabled="loadingTypes"
            />
            <div v-if="loadingTypes" class="loading-types">{{ t('page.manageSetting.settingItems.loadingTypes') }}</div>
          </div>
          <div class="form-group">
            <label>{{ t('page.manageSetting.settingItems.form.description') }}</label>
            <textarea v-model="formData.description" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label>{{ t('page.manageSetting.settingItems.form.defaultProperty') || 'Properties' }}</label>
            <div class="properties-list">
              <div 
                v-for="(item, index) in propertiesList" 
                :key="index"
                class="property-item"
              >
                <template v-if="item.type === 'custom_option' && item.name">
                  <!-- Show display component for custom options (snapshot, doesn't depend on customOptions list) -->
                  <CustomOptionDisplay
                    :name="item.name"
                    :properties="item.properties || {}"
                    :stats-label="t('page.manageSetting.settingItems.stats')"
                    class="property-display"
                  />
                </template>
                <template v-else>
                  <!-- Show selector for stats or when nothing selected yet -->
                  <CustomSelect
                    v-model="item.selectedValue"
                    :options="propertyOptions"
                    :placeholder="t('page.manageSetting.settingItems.selectKey') || 'Select Stat or Custom Option'"
                    @change="handlePropertyChange(index)"
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
                <button 
                  type="button"
                  class="btn-remove-rate"
                  @click="removeProperty(index)"
                  :title="t('page.manageSetting.settingItems.removeProperty')"
                >
                  ×
                </button>
              </div>
              <button 
                type="button"
                class="btn-add-rate"
                @click="addProperty"
              >
                <span class="btn-add-icon">+</span>
                <span>{{ t('page.manageSetting.settingItems.addProperty') }}</span>
              </button>
            </div>
          </div>
          <div class="form-group">
            <label>{{ t('page.manageSetting.settingItems.form.image') }}</label>
            <input type="file" accept="image/*" @change="handleImageChange" />
            <div v-if="formData.image_preview" class="image-preview">
              <img :src="formData.image_preview" alt="Preview" />
            </div>
            <div v-else-if="editingItem && editingItem.image" class="image-preview">
              <img :src="editingItem.image" alt="Current" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeModal" :disabled="saveLoading">{{ t('page.manageSetting.settingItems.actions.cancel') }}</button>
          <button 
            class="btn-primary" 
            :class="{ 'btn-loading': saveLoading, 'btn-fail': saveFailed }"
            @click="handleSave"
            :disabled="saveLoading || !formData.type || !formData.name"
          >
            <span v-if="saveLoading">{{ t('page.manageSetting.settingItems.saving') }}</span>
            <span v-else-if="saveFailed">{{ t('page.manageSetting.settingItems.saveFailed') }}</span>
            <span v-else>{{ editingItem ? 'Update' : 'Create' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, computed, watch } from 'vue'
import CustomSelect from '../../../components/CustomSelect.vue'
import StatMapPreview from '../../../components/StatMapPreview.vue'
import CustomOptionDisplay from '../../../components/CustomOptionDisplay.vue'
import { getGlobalStats, getGlobalTypes, isStatsDataLoaded, isTypesDataLoaded } from '../../../utils/globalData'
import { getGearTypes } from '../../../utils/constants'

const gameApi = inject('gameApi', null)
const translator = inject('translator', null)
const t = translator || ((key) => key)
const statHelpers = inject('statHelpers', null)
const getTypeName = inject('getTypeName', null)
const loading = ref(false)
const loadingTypes = ref(false)
const loadingKeys = ref(false)
const error = ref(null)
const settingItems = ref([])
const stats = ref([])
const customOptions = ref([])
const itemTypes = ref([])
const pagination = ref(null)
const showModal = ref(false)
const editingItem = ref(null)
const saveLoading = ref(false)
const saveFailed = ref(false)
const propertiesList = ref([])
const selectedImageFile = ref(null)

// Gear types only (this page lists gear items)
const GEAR_TYPES_CSV = getGearTypes().join(',')

const typeOptions = computed(() => {
  const options = itemTypes.value
    .map((itemType) => ({ value: itemType.type, label: itemType.name }))
  return options
})

const typeOptionsWithEmpty = computed(() => {
  return [
    { value: '', label: t('page.manageSetting.settingItems.allGear') || 'All gear' },
    ...typeOptions.value
  ]
})

// Unified selector options: combines stats and custom_options
const propertyOptions = computed(() => {
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


const syncPropertiesToList = () => {
  propertiesList.value = []
  
  // Add stats from default_property
  const defaultProperty = formData.value.default_property || {}
  if (statHelpers) {
    const statsList = statHelpers.mapToList(defaultProperty, stats.value, { customPrefix: '' })
    statsList.forEach(prop => {
      if (prop.key) {
        propertiesList.value.push({
          selectedValue: prop.key,
          type: 'stat',
          key: prop.key,
          value: prop.value,
          name: null,
          properties: {}
        })
      }
    })
  }
  
  // Add custom options from custom_stats
  // Show them even if they don't exist in customOptions (deleted/renamed)
  const customStats = formData.value.custom_stats || []
  customStats.forEach(cs => {
    // Try to find matching option, but use stored data if not found
    const matchingOption = customOptions.value.find(opt => opt.name === cs.name)
    // Use stored name and properties from custom_stats (snapshot), not from customOptions
    propertiesList.value.push({
      selectedValue: matchingOption ? matchingOption.id : `custom_${cs.name}`, // Use ID if exists, otherwise use name-based identifier
      type: 'custom_option',
      key: null,
      value: null,
      name: cs.name, // Use stored name
      properties: cs.properties || {} // Use stored properties (snapshot)
    })
  })
}


const addProperty = () => {
  propertiesList.value.push({
    selectedValue: null,
    type: null, // 'stat' or 'custom_option'
    key: null, // for stats
    value: null, // for stats
    name: null, // for custom options
    properties: {} // for custom options
  })
}

const removeProperty = (index) => {
  propertiesList.value.splice(index, 1)
}

const handlePropertyChange = (index) => {
  const item = propertiesList.value[index]
  if (!item || !item.selectedValue) return
  
  // Find the selected option in unified list
  const selected = propertyOptions.value.find(opt => opt.value === item.selectedValue)
  if (!selected) return
  
  if (selected.type === 'stat') {
    // It's a regular stat
    item.type = 'stat'
    item.key = selected.value
    item.value = null
    item.name = null
    item.properties = {}
  } else if (selected.type === 'custom_option') {
    // It's a custom option
    item.type = 'custom_option'
    item.name = selected.label
    item.properties = selected.properties || {}
    item.key = null
    item.value = null
  }
}

const filters = ref({
  search: '',
  type: '',
  currentPage: 1,
  perPage: 15
})

const formData = ref({
  name: '',
  description: '',
  type: '',
  default_property: {},
  custom_stats: [],
  image_preview: null
})


const loadSettingItems = async () => {
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


    if (filters.value.type) {
      params.type = filters.value.type
    } else {
      // Default: show only gear items
      params.type = GEAR_TYPES_CSV
    }

    const response = await gameApi.getSettingItems(params)
    
    if (response.data && response.data.datas && response.data.datas.setting_items) {
      settingItems.value = response.data.datas.setting_items.data || []
      pagination.value = {
        current_page: response.data.datas.setting_items.current_page,
        last_page: response.data.datas.setting_items.last_page,
        total: response.data.datas.setting_items.total
      }
    }

  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Failed to load setting items'
    console.error('Error loading setting items:', err)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  filters.value.currentPage = 1
  loadSettingItems()
}

const changePage = (page) => {
  filters.value.currentPage = page
  loadSettingItems()
}

const handleCreate = () => {
  editingItem.value = null
  saveLoading.value = false
  saveFailed.value = false
  selectedImageFile.value = null
  formData.value = {
    name: '',
    description: '',
    type: '',
    default_property: {},
    custom_stats: [],
    image_preview: null
  }
  propertiesList.value = []
  showModal.value = true
}

const handleEdit = async (item) => {
  editingItem.value = item
  saveLoading.value = false
  saveFailed.value = false
  selectedImageFile.value = null
  formData.value = {
    name: item.name || '',
    description: item.description || '',
    type: item.type || '',
    default_property: item.default_property ? { ...item.default_property } : {},
    custom_stats: item.custom_stats ? [...item.custom_stats] : [],
    image_preview: null
  }
  // Ensure stats are loaded before syncing properties
  if (stats.value.length === 0) {
    await loadStats()
  }
  syncPropertiesToList()
  showModal.value = true
}

const handleImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedImageFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      formData.value.image_preview = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const loadItemTypes = () => {
  // Use global types data
  if (isTypesDataLoaded()) {
    itemTypes.value = getGlobalTypes()
    loadingTypes.value = false
  } else {
    loadingTypes.value = true
    // Wait a bit for global data to load
    const checkInterval = setInterval(() => {
      if (isTypesDataLoaded()) {
        itemTypes.value = getGlobalTypes()
        loadingTypes.value = false
        clearInterval(checkInterval)
      }
    }, 100)
    setTimeout(() => {
      clearInterval(checkInterval)
      if (loadingTypes.value) {
        loadingTypes.value = false
      }
    }, 5000)
  }
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

// Watch stats and customOptions to update selections when they load
watch([() => stats.value.length, () => customOptions.value.length], ([statsLength, customLength], [oldStatsLength, oldCustomLength]) => {
  // Only trigger if stats were just loaded (length changed from 0 to > 0)
  if ((statsLength > 0 && oldStatsLength === 0) || (customLength > 0 && oldCustomLength === 0)) {
    if (editingItem.value) {
      // Re-sync properties
      syncPropertiesToList()
    }
  }
})

const handleSave = async () => {
  if (!gameApi) {
    error.value = t('page.manageSetting.settingItems.errors.apiNotAvailable')
    return
  }

  if (!formData.value.name) {
    error.value = t('page.manageSetting.settingItems.errors.nameRequired')
    return
  }

  if (!formData.value.type) {
    error.value = t('page.manageSetting.settingItems.errors.typeRequired')
    return
  }


  saveLoading.value = true
  saveFailed.value = false
  error.value = null

  try {
    // Build default_property and custom_stats from unified properties list
    const defaultPropertyClean = {}
    const customStatsClean = []
    const keyCounters = {}
    
    propertiesList.value.forEach(item => {
      if (item.type === 'stat' && item.key) {
        // Regular stat - add to default_property
        if (item.value === null || item.value === undefined || item.value === '') {
          return
        }
        
        let keyToUse = item.key
        
        // Track key usage to allow duplicates by suffixing
        if (!keyCounters[keyToUse]) {
          keyCounters[keyToUse] = 0
        }
        keyCounters[keyToUse]++
        const uniqueKey = keyCounters[keyToUse] === 1 ? keyToUse : `${keyToUse}_${keyCounters[keyToUse]}`
        
        // Parse value as number
        const numValue = typeof item.value === 'number' ? item.value : parseFloat(item.value)
        
        // Only add if the value is a valid number
        if (!isNaN(numValue) && isFinite(numValue)) {
          defaultPropertyClean[uniqueKey] = numValue
        }
      } else if (item.type === 'custom_option' && item.name && item.properties && Object.keys(item.properties).length > 0) {
        // Custom option - use stored snapshot (name and properties), not look up by ID
        // This ensures deleted/renamed options still save correctly
        customStatsClean.push({
          name: item.name, // Use stored name
          properties: item.properties // Use stored properties
        })
      }
    })

    const formDataToSend = new FormData()
    formDataToSend.append('name', formData.value.name)
    formDataToSend.append('description', formData.value.description || '')
    formDataToSend.append('type', formData.value.type)

    if (Object.keys(defaultPropertyClean).length > 0) {
      formDataToSend.append('default_property', JSON.stringify(defaultPropertyClean))
    }
    
    if (customStatsClean.length > 0) {
      formDataToSend.append('custom_stats', JSON.stringify(customStatsClean))
    }

    // Add image file if selected
    if (selectedImageFile.value) {
      formDataToSend.append('image', selectedImageFile.value)
    }

    if (editingItem.value) {
      await gameApi.updateSettingItem(editingItem.value.id, formDataToSend)
    } else {
      await gameApi.createSettingItem(formDataToSend)
    }
    
    saveLoading.value = false
    saveFailed.value = false
    closeModal()
    loadSettingItems()
  } catch (err) {
    saveLoading.value = false
    saveFailed.value = true
    error.value = err.response?.data?.message || err.message || 'Failed to save setting item'
    console.error('Error saving setting item:', err)
    
    // Reset fail state after 3 seconds
    setTimeout(() => {
      saveFailed.value = false
    }, 3000)
  }
}

const handleDelete = async (item) => {
  if (!gameApi) {
    error.value = t('page.manageSetting.settingItems.errors.apiNotAvailable')
    return
  }

  if (!confirm(t('page.manageSetting.settingItems.confirm.delete', `Are you sure you want to delete "${item.name}"?`).replace('{name}', item.name))) {
    return
  }

  loading.value = true
  error.value = null

  try {
    await gameApi.deleteSettingItem(item.id)
    loadSettingItems()
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Failed to delete setting item'
    console.error('Error deleting setting item:', err)
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  showModal.value = false
  editingItem.value = null
  saveLoading.value = false
  saveFailed.value = false
  selectedImageFile.value = null
  formData.value = {
    name: '',
    description: '',
    type: '',
    default_property: {},
    image_preview: null
  }
  propertiesList.value = []
}

const truncateDescription = (description) => {
  if (!description) return ''
  return description.length > 100 ? description.substring(0, 100) + '...' : description
}

onMounted(() => {
  loadSettingItems()
  loadItemTypes()
  loadStats()
})
</script>

<style scoped>
.setting-items-list-page {
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

.type-select {
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

.item-image {
  max-width: 50px;
  max-height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

.rates-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.rate-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.rate-key-select {
  flex: 1;
  min-width: 0;
}

.rate-value-input {
  flex: 1;
  min-width: 0;
  padding: 8px 10px;
  background: #253344;
  border: 1px solid #1a2332;
  color: #d0d4d6;
  font-size: 14px;
}

.property-custom-value {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 10px;
  background: #1a2332;
  border: 1px solid #253344;
  border-radius: 4px;
  cursor: help;
}

.custom-value-label {
  font-size: 12px;
  color: #f6a901;
  font-weight: 500;
}

.custom-value-count {
  font-size: 11px;
  color: #999;
}

.btn-remove-rate {
  padding: 8px 12px;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  transition: background 0.2s;
  flex-shrink: 0;
}

.btn-remove-rate:hover {
  background: #ee5a5a;
}

.btn-add-rate {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  background: #253344;
  border: 2px dashed #1a2332;
  color: #d0d4d6;
  cursor: pointer;
  font-size: 14px;
  border-radius: 4px;
  transition: all 0.2s;
  width: 100%;
  margin-top: 5px;
}

.btn-add-rate:hover {
  background: #1a2332;
  border-color: #f6a901;
  color: #f6a901;
}

.btn-add-icon {
  font-size: 18px;
  font-weight: bold;
  line-height: 1;
}

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

.loading-types {
  margin-top: 5px;
  font-size: 12px;
  color: #999;
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
  max-width: 600px;
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

.image-preview {
  margin-top: 10px;
}

.image-preview img {
  max-width: 200px;
  max-height: 200px;
  object-fit: cover;
  border-radius: 4px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #253344;
}

.custom-stats-preview {
  margin-top: 5px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.custom-stat-tag {
  background: #1a2332;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.75em;
  color: #f6a901;
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

.properties-list {
  margin-top: 10px;
}

.property-item {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 8px;
}

.property-select {
  flex: 1;
}
</style>
