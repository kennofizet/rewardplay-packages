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
        v-model="filters.zone_id"
        :options="zoneOptionsWithEmpty"
        :placeholder="t('page.manageSetting.settingItems.allZones')"
        @change="loadSettingItems"
        trigger-class="zone-select"
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
            <th>{{ t('page.manageSetting.settingItems.table.zone') }}</th>
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
            <td>{{ item.type }}</td>
            <td>{{ item.zone ? item.zone.name : '-' }}</td>
            <td>
              <img v-if="item.image" :src="item.image" alt="" class="item-image" />
              <span v-else>-</span>
            </td>
            <td>
              <StatMapPreview :value="item.default_property" :max-items="3" />
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
            <label>{{ t('page.manageSetting.settingItems.form.zone') }}</label>
            <CustomSelect
              v-model="formData.zone_id"
              :options="zoneOptions"
              :placeholder="t('page.manageSetting.settingItems.selectZone')"
            />
          </div>
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
            <label>{{ t('page.manageSetting.settingItems.form.defaultProperty') }}</label>
            <div class="rates-list">
              <div 
                v-for="(prop, index) in defaultPropertiesList" 
                :key="index"
                class="rate-item"
              >
                <CustomSelect
                  v-model="prop.key"
                  :options="propertyKeyOptions"
                  :placeholder="t('page.manageSetting.settingItems.selectKey')"
                  @change="handlePropertyKeyChange(index)"
                  trigger-class="rate-key-select"
                />
                <input 
                  v-if="!prop.isCustom"
                  v-model.number="prop.value"
                  type="number"
                  step="0.01"
                  :placeholder="t('page.manageSetting.settingItems.valuePlaceholder')"
                  class="rate-value-input"
                />
                <div 
                  v-else-if="prop.isCustom"
                  class="property-custom-value"
                  :title="getPresetValuesTooltip(prop.key)"
                >
                  <span class="custom-value-label">{{ t('page.manageSetting.settingItems.presetValues') }}</span>
                  <span class="custom-value-count">{{ getPresetValuesCount(prop.key) }} {{ t('page.manageSetting.settingItems.stats') }}</span>
                </div>
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
                <span>{{ t('page.manageSetting.settingItems.addOption') }}</span>
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
            :disabled="saveLoading || !formData.type || !formData.zone_id || !formData.name"
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

const gameApi = inject('gameApi', null)
const translator = inject('translator', null)
const t = translator || ((key) => key)
const statHelpers = inject('statHelpers', null)
const loading = ref(false)
const loadingTypes = ref(false)
const loadingKeys = ref(false)
const error = ref(null)
const settingItems = ref([])
const conversionKeys = ref([])
const itemTypes = ref([])
const zones = ref([])
const pagination = ref(null)
const showModal = ref(false)
const editingItem = ref(null)
const saveLoading = ref(false)
const saveFailed = ref(false)
const defaultPropertiesList = ref([])
const selectedImageFile = ref(null)

const zoneOptions = computed(() => {
  const options = zones.value.map(zone => ({
    value: zone.id,
    label: zone.name
  }))
  return options
})

const zoneOptionsWithEmpty = computed(() => {
  return [
    { value: '', label: t('page.manageSetting.settingItems.allZones') },
    ...zoneOptions.value
  ]
})

const typeOptions = computed(() => {
  const options = itemTypes.value.map(itemType => ({
    value: itemType.type,
    label: itemType.name
  }))
  return options
})

const typeOptionsWithEmpty = computed(() => {
  return [
    { value: '', label: t('page.manageSetting.settingItems.allTypes') },
    ...typeOptions.value
  ]
})

const propertyKeyOptions = computed(() => {
  const options = conversionKeys.value.map(stat => {
    if (stat.value !== undefined) {
      return {
        value: stat.key,
        label: stat.name,
        isCustom: true,
        customValue: stat.value
      }
    }
    return {
      value: stat.key,
      label: `${stat.name} (${stat.key})`,
      isCustom: false
    }
  })
  return options
})

const isCustomStat = (key) => statHelpers ? statHelpers.isCustomStat(conversionKeys.value, key) : false
const getCustomStatValue = (key) => statHelpers ? statHelpers.getCustomStatValue(conversionKeys.value, key) : null
const getPresetValuesCount = (key) => statHelpers ? statHelpers.getPresetValuesCount(conversionKeys.value, key) : 0
const getPresetValuesTooltip = (key) => {
  const result = statHelpers ? statHelpers.getPresetValuesTooltip(conversionKeys.value, key) : null
  if (result && result !== 'Preset Values (no value set)') {
    return result
  }
  return t('page.manageSetting.settingItems.presetValuesNoValue')
}

const syncDefaultPropertiesToList = () => {
  // Convert default_property map into editable list items
  defaultPropertiesList.value = statHelpers ? statHelpers.mapToList(formData.value.default_property, conversionKeys.value, { customPrefix: 'custom_key_' }) : []
}

const handlePropertyKeyChange = (index) => {
  const prop = defaultPropertiesList.value[index]
  if (!prop) return
  const customStatValue = getCustomStatValue(prop.key)
  const isCustomKeyPrefix = prop.key && prop.key.startsWith('custom_key_')

  if (customStatValue !== null || isCustomKeyPrefix) {
    prop.isCustom = true
    prop.value = customStatValue
  } else {
    prop.isCustom = false
    if (prop.value === null || prop.value === undefined) prop.value = null
  }
}

const addProperty = () => {
  defaultPropertiesList.value.push({
    key: '',
    value: null,
    isCustom: false
  })
}

const removeProperty = (index) => {
  defaultPropertiesList.value.splice(index, 1)
}

const filters = ref({
  search: '',
  zone_id: '',
  type: '',
  currentPage: 1,
  perPage: 15
})

const formData = ref({
  name: '',
  description: '',
  type: '',
  default_property: {},
  zone_id: '',
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

    if (filters.value.zone_id) {
      params.zone_id = filters.value.zone_id
    }

    if (filters.value.type) {
      params.type = filters.value.type
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

    // Load zones from response
    if (response.data && response.data.datas && response.data.datas.zones) {
      zones.value = response.data.datas.zones
      // Set default zone if not selected
      if (!filters.value.zone_id && zones.value.length > 0) {
        filters.value.zone_id = zones.value[0].id
        // Reload with default zone
        await loadSettingItems()
        return
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
    zone_id: zones.value.length > 0 ? zones.value[0].id : '',
    image_preview: null
  }
  defaultPropertiesList.value = []
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
    zone_id: item.zone_id || '',
    image_preview: null
  }
  // Ensure stats are loaded before syncing properties (needed for custom stats)
  if (conversionKeys.value.length === 0) {
    await loadStats()
  }
  syncDefaultPropertiesToList()
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

const loadItemTypes = async () => {
  if (!gameApi) {
    return
  }

  loadingTypes.value = true
  try {
    const response = await gameApi.getItemTypes()
    if (response.data && response.data.datas && response.data.datas.item_types) {
      itemTypes.value = response.data.datas.item_types
    }
  } catch (err) {
    console.error('Error loading item types:', err)
  } finally {
    loadingTypes.value = false
  }
}

const loadStats = async () => {
  if (!gameApi) {
    return
  }

  loadingKeys.value = true
  try {
    const response = await gameApi.getAllStats()
    if (response.data && response.data.datas && response.data.datas.stats) {
      conversionKeys.value = response.data.datas.stats
    }
  } catch (err) {
    console.error('Error loading stats:', err)
  } finally {
    loadingKeys.value = false
  }
}

// Watch conversionKeys to update custom stat selections when stats load
watch(() => conversionKeys.value.length, (newLength, oldLength) => {
  // Only trigger if stats were just loaded (length changed from 0 to > 0)
  if (newLength > 0 && oldLength === 0 && editingItem.value && formData.value.default_property) {
    // Re-sync properties to update custom stat flags
    syncDefaultPropertiesToList()
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

  if (!formData.value.zone_id) {
    error.value = t('page.manageSetting.settingItems.errors.zoneRequired')
    return
  }

  saveLoading.value = true
  saveFailed.value = false
  error.value = null

  try {
    // Build default_property from list (allow duplicate keys by suffixing)
    const defaultPropertyClean = {}
    const keyCounters = {}
    
    defaultPropertiesList.value.forEach(prop => {
      // Only include properties that have a key
      if (!prop.key) {
        return
      }
      
      // Skip if value is invalid (null, undefined, or empty string)
      if (prop.value === null || prop.value === undefined || prop.value === '') {
        return
      }
      
      // For custom stats, ensure the key exists in conversionKeys and use exact format
      let keyToUse = prop.key
      if (prop.isCustom && keyToUse.startsWith('custom_key_')) {
        // Verify the key exists in conversionKeys to ensure we use the correct format
        const matchingStat = conversionKeys.value.find(s => s.key === keyToUse)
        if (matchingStat) {
          // Use the exact key from conversionKeys
          keyToUse = matchingStat.key
        }
        // If not found in conversionKeys, still use the key as-is (might be manually entered custom key)
      }
      
      // Track key usage to allow duplicates by suffixing
      if (!keyCounters[keyToUse]) {
        keyCounters[keyToUse] = 0
      }
      keyCounters[keyToUse]++
      const uniqueKey = keyCounters[keyToUse] === 1 ? keyToUse : `${keyToUse}_${keyCounters[keyToUse]}`
      
      if (prop.isCustom && keyToUse.startsWith('custom_key_')) {
        defaultPropertyClean[uniqueKey] = prop.value
      }else{
        // Parse value as number (both custom and regular stats use numeric values for items)
        const numValue = typeof prop.value === 'number' ? prop.value : parseFloat(prop.value)
        
        // Only add if the value is a valid number
        if (!isNaN(numValue) && isFinite(numValue)) {
          defaultPropertyClean[uniqueKey] = numValue
        }
      }
    })

    const formDataToSend = new FormData()
    formDataToSend.append('name', formData.value.name)
    formDataToSend.append('description', formData.value.description || '')
    formDataToSend.append('type', formData.value.type)
    formDataToSend.append('zone_id', formData.value.zone_id)

    if (Object.keys(defaultPropertyClean).length > 0) {
      formDataToSend.append('default_property', JSON.stringify(defaultPropertyClean))
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
    zone_id: '',
    image_preview: null
  }
  defaultPropertiesList.value = []
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

.zone-select,
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
</style>
