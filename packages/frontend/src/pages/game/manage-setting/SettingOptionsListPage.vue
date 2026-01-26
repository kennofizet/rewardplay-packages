<template>
  <div class="setting-options-list-page">
    <div class="page-header">
      <h2>{{ t('page.manageSetting.settingOptions.title') }}</h2>
      <button class="btn-primary" @click="handleCreate">
        {{ t('page.manageSetting.settingOptions.create') }}
      </button>
    </div>

    <div class="filters">
      <input 
        v-model="filters.search"
        type="text" 
        :placeholder="t('page.manageSetting.settingOptions.searchPlaceholder')"
        class="search-input"
        @input="handleSearch"
      />
    </div>

    <div v-if="loading" class="loading">
      {{ t('page.manageSetting.settingOptions.loading') }}
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <div v-if="!loading && !error" class="table-container">
      <table class="settings-table">
        <thead>
          <tr>
            <th>{{ t('page.manageSetting.settingOptions.table.id') }}</th>
            <th>{{ t('page.manageSetting.settingOptions.table.name') }}</th>
            <th>{{ t('page.manageSetting.settingOptions.table.rates') }}</th>
            <th>{{ t('page.manageSetting.settingOptions.table.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="option in settingOptions" :key="option.id">
            <td>{{ option.id }}</td>
            <td>{{ option.name }}</td>
            <td>
              <StatMapPreview :value="option.rates" :max-items="4" />
            </td>
            <td class="actions-cell">
              <button class="btn-edit" @click="handleEdit(option)">{{ t('page.manageSetting.settingOptions.actions.edit') }}</button>
              <button class="btn-delete" @click="handleDelete(option)">{{ t('page.manageSetting.settingOptions.actions.delete') }}</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="pagination" class="pagination">
        <button 
          :disabled="pagination.current_page === 1"
          @click="changePage(pagination.current_page - 1)"
        >
          {{ t('page.manageSetting.settingOptions.pagination.prev') }}
        </button>
        <span>{{ t('page.manageSetting.settingOptions.pagination.page') }} {{ pagination.current_page }} {{ t('page.manageSetting.settingOptions.pagination.of') }} {{ pagination.last_page }}</span>
        <button 
          :disabled="pagination.current_page === pagination.last_page"
          @click="changePage(pagination.current_page + 1)"
        >
          {{ t('page.manageSetting.settingOptions.pagination.next') }}
        </button>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ editingOption ? t('page.manageSetting.settingOptions.edit') : t('page.manageSetting.settingOptions.createModal') }}</h3>
          <button class="btn-close" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>{{ t('page.manageSetting.settingOptions.form.name') }}</label>
            <input v-model="formData.name" type="text" required />
          </div>
          <div class="form-group">
            <label>{{ t('page.manageSetting.settingOptions.form.rates') }}</label>
            <div class="rates-list">
              <div 
                v-for="(rate, index) in ratesList" 
                :key="index"
                class="rate-item"
              >
                <CustomSelect
                  v-model="rate.key"
                  :options="rateKeyOptions"
                  :placeholder="t('page.manageSetting.settingOptions.selectKey')"
                  @change="handleRateKeyChange(index)"
                  trigger-class="rate-key-select"
                />
                <input 
                  v-model.number="rate.value"
                  type="number"
                  step="0.01"
                  :placeholder="t('page.manageSetting.settingOptions.valuePlaceholder')"
                  class="rate-value-input"
                />
                <button 
                  type="button"
                  class="btn-remove-rate"
                  @click="removeRate(index)"
                  :title="t('page.manageSetting.settingOptions.removeRate')"
                >
                  ×
                </button>
              </div>
              <button 
                type="button"
                class="btn-add-rate"
                @click="addRate"
              >
                + {{ t('page.manageSetting.settingOptions.addOption') }}
              </button>
            </div>
            <small class="form-hint">{{ t('page.manageSetting.settingOptions.ratesHint') }}</small>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeModal" :disabled="saveLoading">{{ t('page.manageSetting.settingOptions.actions.cancel') }}</button>
          <button 
            class="btn-primary" 
            :class="{ 'btn-loading': saveLoading, 'btn-fail': saveFailed }"
            @click="handleSave"
            :disabled="saveLoading || !formData.name"
          >
            <span v-if="saveLoading">{{ t('page.manageSetting.settingOptions.saving') }}</span>
            <span v-else-if="saveFailed">{{ t('page.manageSetting.settingOptions.saveFailed') }}</span>
            <span v-else>{{ editingOption ? 'Update' : 'Create' }}</span>
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
const loadingKeys = ref(false)
const error = ref(null)
const settingOptions = ref([])
const conversionKeys = ref([])
const pagination = ref(null)
const showModal = ref(false)
const editingOption = ref(null)
const saveLoading = ref(false)
const saveFailed = ref(false)

const rateKeyOptions = computed(() => {
  const options = conversionKeys.value.map(key => ({
    value: key.key,
    label: `${key.name} (${key.key})`
  }))
  return options
})

const filters = ref({
  search: '',
  currentPage: 1,
  perPage: 15
})

const formData = ref({
  name: '',
  rates: {},
  rates_json: ''
})

const ratesList = ref([])

const formatRates = (rates) => {
  if (!rates || typeof rates !== 'object') return '{}'
  return JSON.stringify(rates, null, 2)
}

const addRate = () => {
  ratesList.value.push({
    key: '',
    value: null
  })
}

const removeRate = (index) => {
  ratesList.value.splice(index, 1)
  syncRatesFromList()
}

const handleRateKeyChange = (index) => {
  syncRatesFromList()
}

const syncRatesFromList = () => {
  const cleanRates = statHelpers ? statHelpers.listToMap(ratesList.value, conversionKeys.value, { customPrefix: 'custom_key_' }) : {}
  formData.value.rates = cleanRates
  formData.value.rates_json = JSON.stringify(cleanRates, null, 2)
}

const syncRatesToList = () => {
  ratesList.value = statHelpers ? statHelpers.mapToList(formData.value.rates, conversionKeys.value, { customPrefix: 'custom_key_' }) : []
}

// Watch rates changes and sync to JSON
const watchRates = () => {
  // Initialize rates object with all conversion keys
  conversionKeys.value.forEach(key => {
    if (!(key.key in formData.value.rates)) {
      formData.value.rates[key.key] = null
    }
  })
  syncRatesToJson()
}

const loadSettingOptions = async () => {
  if (!gameApi) {
    error.value = t('page.manageSetting.settingOptions.errors.apiNotAvailable')
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


    const response = await gameApi.getSettingOptions(params)
    
    if (response.data && response.data.datas && response.data.datas.setting_options) {
      settingOptions.value = response.data.datas.setting_options.data || []
      pagination.value = {
        current_page: response.data.datas.setting_options.current_page,
        last_page: response.data.datas.setting_options.last_page,
        total: response.data.datas.setting_options.total
      }
    }

  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Failed to load setting options'
    console.error('Error loading setting options:', err)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  filters.value.currentPage = 1
  loadSettingOptions()
}

const changePage = (page) => {
  filters.value.currentPage = page
  loadSettingOptions()
}

const handleCreate = () => {
  editingOption.value = null
  saveLoading.value = false
  saveFailed.value = false
  formData.value = {
    name: '',
    rates: {},
    rates_json: '{}'
  }
  ratesList.value = []
  showModal.value = true
}

const handleEdit = (option) => {
  editingOption.value = option
  saveLoading.value = false
  saveFailed.value = false
  formData.value = {
    name: option.name || '',
    rates: option.rates ? { ...option.rates } : {},
    rates_json: formatRates(option.rates)
  }
  syncRatesToList()
  showModal.value = true
}

const loadConversionKeys = async () => {
  if (!gameApi) {
    return
  }

  loadingKeys.value = true
  try {
    const response = await gameApi.getConversionKeys()
    if (response.data && response.data.datas && response.data.datas.conversion_keys) {
      conversionKeys.value = response.data.datas.conversion_keys
    }
  } catch (err) {
    console.error('Error loading conversion keys:', err)
  } finally {
    loadingKeys.value = false
  }
}

const handleSave = async () => {
  if (!gameApi) {
    error.value = t('page.manageSetting.settingOptions.errors.apiNotAvailable')
    return
  }

  if (!formData.value.name) {
    error.value = t('page.manageSetting.settingOptions.errors.nameRequired')
    return
  }

  // Sync rates from list before saving
  syncRatesFromList()

  saveLoading.value = true
  saveFailed.value = false
  error.value = null

  try {
    // Use rates object, remove null/undefined values
    const rates = {}
    Object.keys(formData.value.rates).forEach(key => {
      if (formData.value.rates[key] !== null && formData.value.rates[key] !== undefined && formData.value.rates[key] !== '') {
        rates[key] = formData.value.rates[key]
      }
    })

    const data = {
      name: formData.value.name,
      rates: Object.keys(rates).length > 0 ? rates : null
    }

    if (editingOption.value) {
      await gameApi.updateSettingOption(editingOption.value.id, data)
    } else {
      await gameApi.createSettingOption(data)
    }
    
    saveLoading.value = false
    saveFailed.value = false
    closeModal()
    loadSettingOptions()
  } catch (err) {
    saveLoading.value = false
    saveFailed.value = true
    error.value = err.response?.data?.message || err.message || 'Failed to save setting option'
    console.error('Error saving setting option:', err)
    
    // Reset fail state after 3 seconds
    setTimeout(() => {
      saveFailed.value = false
    }, 3000)
  }
}

const handleDelete = async (option) => {
  if (!gameApi) {
    error.value = t('page.manageSetting.settingOptions.errors.apiNotAvailable')
    return
  }

  if (!confirm(t('page.manageSetting.settingOptions.confirm.delete', `Are you sure you want to delete "${option.name}"?`).replace('{name}', option.name))) {
    return
  }

  loading.value = true
  error.value = null

  try {
    await gameApi.deleteSettingOption(option.id)
    loadSettingOptions()
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Failed to delete setting option'
    console.error('Error deleting setting option:', err)
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  showModal.value = false
  editingOption.value = null
  saveLoading.value = false
  saveFailed.value = false
  formData.value = {
    name: '',
    rates: {},
    rates_json: ''
  }
  ratesList.value = []
}

// Watch ratesList changes and sync to rates object
watch(() => ratesList.value, () => {
  syncRatesFromList()
}, { deep: true })

onMounted(() => {
  loadSettingOptions()
  loadConversionKeys()
})
</script>

<style scoped>
.setting-options-list-page {
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
  max-width: 800px;
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

.rates-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.rate-item {
  display: flex;
  gap: 10px;
  align-items: center;
}

.rate-key-select {
  flex: 1;
  min-width: 200px;
}

.rate-value-input {
  flex: 1;
  min-width: 150px;
  padding: 10px;
  background: #253344;
  border: 1px solid #1a2332;
  color: #d0d4d6;
  font-size: 14px;
}

.btn-remove-rate {
  width: 32px;
  height: 32px;
  padding: 0;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.25s;
}

.btn-remove-rate:hover {
  background: #ee5a5a;
}

.btn-add-rate {
  padding: 10px 16px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.25s;
  align-self: flex-start;
}

.btn-add-rate:hover {
  background: #357abd;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #253344;
}
</style>
