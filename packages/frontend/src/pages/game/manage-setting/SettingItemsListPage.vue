<template>
  <div class="setting-items-list-page">
    <div class="page-header">
      <h2>{{ t('page.manageSetting.settingItems.title') || 'Setting Items' }}</h2>
      <button class="btn-primary" @click="handleCreate">
        {{ t('page.manageSetting.settingItems.create') || 'Create New' }}
      </button>
    </div>

    <div class="filters">
      <input 
        v-model="filters.search"
        type="text" 
        :placeholder="t('page.manageSetting.settingItems.searchPlaceholder') || 'Search by name or description...'"
        class="search-input"
        @input="handleSearch"
      />
      <CustomSelect
        v-model="filters.zone_id"
        :options="zoneOptionsWithEmpty"
        :placeholder="t('page.manageSetting.settingItems.allZones') || 'All Zones'"
        @change="loadSettingItems"
        trigger-class="zone-select"
      />
      <CustomSelect
        v-model="filters.type"
        :options="typeOptionsWithEmpty"
        :placeholder="t('page.manageSetting.settingItems.allTypes') || 'All Types'"
        @change="loadSettingItems"
        trigger-class="type-select"
      />
    </div>

    <div v-if="loading" class="loading">
      {{ t('page.manageSetting.settingItems.loading') || 'Loading...' }}
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
            <th>Slug</th>
            <th>Type</th>
            <th>Zone</th>
            <th>Image</th>
            <th>Description</th>
            <th>Actions</th>
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
              <img v-if="item.image" :src="getImageUrl(item.image)" alt="" class="item-image" />
              <span v-else>-</span>
            </td>
            <td>{{ truncateDescription(item.description) }}</td>
            <td class="actions-cell">
              <button class="btn-edit" @click="handleEdit(item)">Edit</button>
              <button class="btn-delete" @click="handleDelete(item)">Delete</button>
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
          <h3>{{ editingItem ? (t('page.manageSetting.settingItems.edit') || 'Edit Setting Item') : (t('page.manageSetting.settingItems.create') || 'Create Setting Item') }}</h3>
          <button class="btn-close" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Zone *</label>
            <CustomSelect
              v-model="formData.zone_id"
              :options="zoneOptions"
              :placeholder="t('page.manageSetting.settingItems.selectZone') || 'Select Zone'"
            />
          </div>
          <div class="form-group">
            <label>Name *</label>
            <input v-model="formData.name" type="text" required />
          </div>
          <div class="form-group">
            <label>Type *</label>
            <CustomSelect
              v-model="formData.type"
              :options="typeOptions"
              :placeholder="t('page.manageSetting.settingItems.selectType') || 'Select Type'"
              :disabled="loadingTypes"
            />
            <div v-if="loadingTypes" class="loading-types">Loading types...</div>
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="formData.description" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label>Default Property (JSON)</label>
            <textarea v-model="formData.default_property_json" rows="5" placeholder='{"key": "value"}'></textarea>
            <small class="form-hint">Enter valid JSON format</small>
          </div>
          <div class="form-group">
            <label>Image</label>
            <input type="file" accept="image/*" @change="handleImageChange" />
            <div v-if="formData.image_preview" class="image-preview">
              <img :src="formData.image_preview" alt="Preview" />
            </div>
            <div v-else-if="editingItem && editingItem.image" class="image-preview">
              <img :src="getImageUrl(editingItem.image)" alt="Current" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeModal" :disabled="saveLoading">Cancel</button>
          <button 
            class="btn-primary" 
            :class="{ 'btn-loading': saveLoading, 'btn-fail': saveFailed }"
            @click="handleSave"
            :disabled="saveLoading || !formData.type || !formData.zone_id || !formData.name"
          >
            <span v-if="saveLoading">{{ t('page.manageSetting.settingItems.saving') || 'Saving...' }}</span>
            <span v-else-if="saveFailed">{{ t('page.manageSetting.settingItems.saveFailed') || 'Failed' }}</span>
            <span v-else>{{ editingItem ? 'Update' : 'Create' }}</span>
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
const loadingTypes = ref(false)
const error = ref(null)
const settingItems = ref([])
const itemTypes = ref([])
const zones = ref([])
const pagination = ref(null)
const showModal = ref(false)
const editingItem = ref(null)
const saveLoading = ref(false)
const saveFailed = ref(false)
const selectedImageFile = ref(null)

const zoneOptions = computed(() => {
  const options = zones.value.map(zone => ({
    value: zone.id,
    label: zone.name
  }))
  return options
})

const typeOptions = computed(() => {
  const options = itemTypes.value.map(itemType => ({
    value: itemType.type,
    label: itemType.name
  }))
  return options
})

const zoneOptionsWithEmpty = computed(() => {
  return [
    { value: '', label: t('page.manageSetting.settingItems.allZones') || 'All Zones' },
    ...zoneOptions.value
  ]
})

const typeOptionsWithEmpty = computed(() => {
  return [
    { value: '', label: t('page.manageSetting.settingItems.allTypes') || 'All Types' },
    ...typeOptions.value
  ]
})

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
  default_property_json: '',
  zone_id: '',
  image_preview: null
})

const getImageUrl = (imagePath) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('http')) return imagePath
  return `/${imagePath}`
}

const loadSettingItems = async () => {
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
    default_property_json: '',
    zone_id: zones.value.length > 0 ? zones.value[0].id : '',
    image_preview: null
  }
  showModal.value = true
}

const handleEdit = (item) => {
  editingItem.value = item
  saveLoading.value = false
  saveFailed.value = false
  selectedImageFile.value = null
  formData.value = {
    name: item.name || '',
    description: item.description || '',
    type: item.type || '',
    default_property_json: item.default_property ? JSON.stringify(item.default_property, null, 2) : '',
    zone_id: item.zone_id || '',
    image_preview: null
  }
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

const handleSave = async () => {
  if (!gameApi) {
    error.value = 'Game API not available'
    return
  }

  if (!formData.value.name) {
    error.value = 'Name is required'
    return
  }

  if (!formData.value.type) {
    error.value = 'Type is required'
    return
  }

  if (!formData.value.zone_id) {
    error.value = 'Zone is required'
    return
  }

  saveLoading.value = true
  saveFailed.value = false
  error.value = null

  try {
    const formDataToSend = new FormData()
    formDataToSend.append('name', formData.value.name)
    formDataToSend.append('description', formData.value.description || '')
    formDataToSend.append('type', formData.value.type)
    formDataToSend.append('zone_id', formData.value.zone_id)

    // Parse and add default_property if valid JSON
    if (formData.value.default_property_json) {
      try {
        const parsed = JSON.parse(formData.value.default_property_json)
        formDataToSend.append('default_property', JSON.stringify(parsed))
      } catch (e) {
        error.value = 'Invalid JSON in Default Property'
        saveLoading.value = false
        return
      }
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
    error.value = 'Game API not available'
    return
  }

  if (!confirm(`Are you sure you want to delete "${item.name}"?`)) {
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
    default_property_json: '',
    zone_id: '',
    image_preview: null
  }
}

const truncateDescription = (description) => {
  if (!description) return ''
  return description.length > 100 ? description.substring(0, 100) + '...' : description
}

onMounted(() => {
  loadSettingItems()
  loadItemTypes()
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
