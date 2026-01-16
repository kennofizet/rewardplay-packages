<template>
  <div class="setting-item-sets-list-page">
    <div class="page-header">
      <h2>{{ t('page.manageSetting.settingItemSets.title') || 'Item Sets' }}</h2>
      <button class="btn-primary" @click="handleCreate">
        {{ t('page.manageSetting.settingItemSets.create') || 'Create New' }}
      </button>
    </div>

    <div class="filters">
      <input 
        v-model="filters.search"
        type="text" 
        :placeholder="t('page.manageSetting.settingItemSets.searchPlaceholder') || 'Search by name...'"
        class="search-input"
        @input="handleSearch"
      />
      <CustomSelect
        v-model="filters.zone_id"
        :options="zoneOptionsWithEmpty"
        :placeholder="t('page.manageSetting.settingItemSets.allZones') || 'All Zones'"
        @change="loadSettingItemSets"
        trigger-class="zone-select"
      />
    </div>

    <div v-if="loading" class="loading">
      {{ t('page.manageSetting.settingItemSets.loading') || 'Loading...' }}
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <div v-if="!loading && !error" class="table-container">
      <table class="settings-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Zone</th>
            <th>Items</th>
            <th>Set Bonuses</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="set in settingItemSets" :key="set.id">
            <td>{{ set.id }}</td>
            <td>{{ set.name }}</td>
            <td>{{ set.zone ? set.zone.name : '-' }}</td>
            <td>
              <span class="items-count">{{ set.items_count || 0 }} items</span>
              <div v-if="set.items && set.items.length > 0" class="items-preview">
                <span v-for="(item, idx) in set.items.slice(0, 3)" :key="item.id" class="item-tag">
                  {{ item.name }}
                </span>
                <span v-if="set.items.length > 3" class="item-tag more">+{{ set.items.length - 3 }}</span>
              </div>
            </td>
            <td>
              <pre class="bonuses-preview">{{ formatBonuses(set.set_bonuses) }}</pre>
            </td>
            <td>{{ truncateDescription(set.description) }}</td>
            <td class="actions-cell">
              <button class="btn-edit" @click="handleEdit(set)">Edit</button>
              <button class="btn-delete" @click="handleDelete(set)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="pagination" class="pagination">
        <button 
          :disabled="pagination.current_page === 1"
          @click="changePage(pagination.current_page - 1)"
        >
          Previous
        </button>
        <span>Page {{ pagination.current_page }} of {{ pagination.last_page }}</span>
        <button 
          :disabled="pagination.current_page === pagination.last_page"
          @click="changePage(pagination.current_page + 1)"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ editingSet ? (t('page.manageSetting.settingItemSets.edit') || 'Edit Item Set') : (t('page.manageSetting.settingItemSets.create') || 'Create Item Set') }}</h3>
          <button class="btn-close" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Zone *</label>
            <CustomSelect
              v-model="formData.zone_id"
              :options="zoneOptions"
              :placeholder="t('page.manageSetting.settingItemSets.selectZone') || 'Select Zone'"
              @change="handleZoneChange"
            />
          </div>
          <div class="form-group">
            <label>Name *</label>
            <input v-model="formData.name" type="text" required />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="formData.description" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label>Items *</label>
            <div v-if="loadingItems" class="loading-items">Loading items...</div>
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
                No items available in this zone. Please select a zone first.
              </div>
            </div>
          </div>
          <div class="form-group">
            <label>Set Bonuses (JSON)</label>
            <div class="bonuses-editor">
              <div class="bonus-section">
                <label>2 Items Bonus:</label>
                <textarea 
                  v-model="formData.bonus_2_json" 
                  rows="4" 
                  placeholder='{"power": 10, "cv": 5}'
                  @input="handleBonusJsonChange(2)"
                ></textarea>
              </div>
              <div class="bonus-section">
                <label>3 Items Bonus:</label>
                <textarea 
                  v-model="formData.bonus_3_json" 
                  rows="4" 
                  placeholder='{"power": 20, "cv": 10}'
                  @input="handleBonusJsonChange(3)"
                ></textarea>
              </div>
              <div class="bonus-section">
                <label>Full Set Bonus:</label>
                <textarea 
                  v-model="formData.bonus_full_json" 
                  rows="4" 
                  placeholder='{"power": 50, "cv": 25}'
                  @input="handleBonusJsonChange('full')"
                ></textarea>
              </div>
            </div>
            <small class="form-hint">Enter valid JSON format for each bonus level</small>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeModal" :disabled="saveLoading">Cancel</button>
          <button 
            class="btn-primary" 
            :class="{ 'btn-loading': saveLoading, 'btn-fail': saveFailed }"
            @click="handleSave"
            :disabled="saveLoading || !formData.name || !formData.zone_id || formData.item_ids.length === 0"
          >
            <span v-if="saveLoading">{{ t('page.manageSetting.settingItemSets.saving') || 'Saving...' }}</span>
            <span v-else-if="saveFailed">{{ t('page.manageSetting.settingItemSets.saveFailed') || 'Failed' }}</span>
            <span v-else>{{ editingSet ? 'Update' : 'Create' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, computed } from 'vue'
import CustomSelect from '../../../components/CustomSelect.vue'

const gameApi = inject('gameApi', null)
const translator = inject('translator', null)
const t = translator || ((key) => key)

const loading = ref(false)
const loadingItems = ref(false)
const error = ref(null)
const settingItemSets = ref([])
const zones = ref([])
const availableItems = ref([])
const pagination = ref(null)
const showModal = ref(false)
const editingSet = ref(null)
const saveLoading = ref(false)
const saveFailed = ref(false)

const zoneOptions = computed(() => {
  const options = zones.value.map(zone => ({
    value: zone.id,
    label: zone.name
  }))
  return options
})

const zoneOptionsWithEmpty = computed(() => {
  return [
    { value: '', label: t('page.manageSetting.settingItemSets.allZones') || 'All Zones' },
    ...zoneOptions.value
  ]
})

const filters = ref({
  search: '',
  zone_id: '',
  currentPage: 1,
  perPage: 15
})

const formData = ref({
  name: '',
  description: '',
  zone_id: '',
  item_ids: [],
  bonus_2_json: '',
  bonus_3_json: '',
  bonus_full_json: ''
})

const formatBonuses = (bonuses) => {
  if (!bonuses || typeof bonuses !== 'object') return '{}'
  return JSON.stringify(bonuses, null, 2)
}

const handleBonusJsonChange = (level) => {
  // Validate JSON and update set_bonuses
  try {
    const bonuses = {}
    if (formData.value.bonus_2_json) {
      bonuses[2] = JSON.parse(formData.value.bonus_2_json)
    }
    if (formData.value.bonus_3_json) {
      bonuses[3] = JSON.parse(formData.value.bonus_3_json)
    }
    if (formData.value.bonus_full_json) {
      bonuses.full = JSON.parse(formData.value.bonus_full_json)
    }
  } catch (e) {
    // Invalid JSON, ignore
  }
}

const loadSettingItemSets = async () => {
  if (!gameApi) {
    error.value = 'Game API not available'
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

    if (filters.value.zone_id) {
      params.zone_id = filters.value.zone_id
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

    // Load zones from response
    if (response.data && response.data.datas && response.data.datas.zones) {
      zones.value = response.data.datas.zones
      // Set default zone if not selected
      if (!filters.value.zone_id && zones.value.length > 0) {
        filters.value.zone_id = zones.value[0].id
        // Reload with default zone
        await loadSettingItemSets()
        return
      }
    }
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Failed to load item sets'
    console.error('Error loading item sets:', err)
  } finally {
    loading.value = false
  }
}

const handleZoneChange = async () => {
  if (!formData.value.zone_id) {
    availableItems.value = []
    return
  }

  await loadItemsForZone(formData.value.zone_id)
}

const loadItemsForZone = async (zoneId) => {
  if (!gameApi || !zoneId) {
    return
  }

  loadingItems.value = true
  try {
    const response = await gameApi.getItemsForZone({ zone_id: zoneId })
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

const handleCreate = () => {
  editingSet.value = null
  saveLoading.value = false
  saveFailed.value = false
  formData.value = {
    name: '',
    description: '',
    zone_id: zones.value.length > 0 ? zones.value[0].id : '',
    item_ids: [],
    bonus_2_json: '',
    bonus_3_json: '',
    bonus_full_json: ''
  }
  if (formData.value.zone_id) {
    loadItemsForZone(formData.value.zone_id)
  }
  showModal.value = true
}

const handleEdit = async (set) => {
  editingSet.value = set
  saveLoading.value = false
  saveFailed.value = false
  formData.value = {
    name: set.name || '',
    description: set.description || '',
    zone_id: set.zone_id || '',
    item_ids: set.items ? set.items.map(item => item.id) : [],
    bonus_2_json: set.set_bonuses && set.set_bonuses[2] ? JSON.stringify(set.set_bonuses[2], null, 2) : '',
    bonus_3_json: set.set_bonuses && set.set_bonuses[3] ? JSON.stringify(set.set_bonuses[3], null, 2) : '',
    bonus_full_json: set.set_bonuses && set.set_bonuses.full ? JSON.stringify(set.set_bonuses.full, null, 2) : ''
  }
  if (formData.value.zone_id) {
    await loadItemsForZone(formData.value.zone_id)
  }
  showModal.value = true
}

const handleSave = async () => {
  if (!gameApi) {
    error.value = 'Game API not available'
    return
  }

  if (!formData.value.name) {
    error.value = 'Name is required'
    return
  }

  if (!formData.value.zone_id) {
    error.value = 'Zone is required'
    return
  }

  if (formData.value.item_ids.length === 0) {
    error.value = 'At least one item is required'
    return
  }

  saveLoading.value = true
  saveFailed.value = false
  error.value = null

  try {
    // Build set_bonuses from JSON fields
    const setBonuses = {}
    if (formData.value.bonus_2_json) {
      try {
        setBonuses[2] = JSON.parse(formData.value.bonus_2_json)
      } catch (e) {
        error.value = 'Invalid JSON in 2 Items Bonus'
        saveLoading.value = false
        return
      }
    }
    if (formData.value.bonus_3_json) {
      try {
        setBonuses[3] = JSON.parse(formData.value.bonus_3_json)
      } catch (e) {
        error.value = 'Invalid JSON in 3 Items Bonus'
        saveLoading.value = false
        return
      }
    }
    if (formData.value.bonus_full_json) {
      try {
        setBonuses.full = JSON.parse(formData.value.bonus_full_json)
      } catch (e) {
        error.value = 'Invalid JSON in Full Set Bonus'
        saveLoading.value = false
        return
      }
    }

    const data = {
      name: formData.value.name,
      description: formData.value.description || null,
      zone_id: formData.value.zone_id,
      set_bonuses: Object.keys(setBonuses).length > 0 ? setBonuses : null,
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
    error.value = 'Game API not available'
    return
  }

  if (!confirm(`Are you sure you want to delete "${set.name}"?`)) {
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
    zone_id: '',
    item_ids: [],
    bonus_2_json: '',
    bonus_3_json: '',
    bonus_full_json: ''
  }
  availableItems.value = []
}

const truncateDescription = (description) => {
  if (!description) return ''
  return description.length > 100 ? description.substring(0, 100) + '...' : description
}

onMounted(() => {
  loadSettingItemSets()
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

.zone-select {
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

.bonuses-preview {
  max-width: 200px;
  max-height: 100px;
  overflow: auto;
  margin: 0;
  padding: 5px;
  background: #1a2332;
  border-radius: 4px;
  font-size: 11px;
  color: #d0d4d6;
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

.bonuses-editor {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.bonus-section {
  display: flex;
  flex-direction: column;
}

.bonus-section label {
  margin-bottom: 5px;
  font-size: 13px;
}

.bonus-section textarea {
  min-height: 80px;
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
</style>
