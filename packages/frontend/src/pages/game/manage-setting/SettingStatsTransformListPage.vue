<template>
  <div class="setting-stats-transform-list-page">
    <div class="page-header">
      <h2>{{ t('page.manageSetting.settingStatsTransform.title') }}</h2>
      <div class="actions">
        <button class="btn-primary" @click="handleSuggest" style="margin-right: 10px;">
          {{ t('page.manageSetting.settingStatsTransform.suggest') }}
        </button>
        <button class="btn-primary" @click="handleCreate">
          {{ t('page.manageSetting.settingStatsTransform.create') }}
        </button>
      </div>
    </div>

    <div class="filters">
      <input 
        v-model="filters.search"
        type="text" 
        :placeholder="t('page.manageSetting.settingStatsTransform.searchPlaceholder')"
        class="search-input"
        @input="handleSearch"
      />
    </div>

    <div v-if="loading" class="loading">
      {{ t('page.manageSetting.settingStatsTransform.loading') }}
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <div v-if="!loading && !error" class="table-container">
      <table class="settings-table">
        <thead>
          <tr>
            <th>{{ t('page.manageSetting.settingStatsTransform.table.id') }}</th>
            <th>{{ t('page.manageSetting.settingStatsTransform.table.target_key') }}</th>
            <th>{{ t('page.manageSetting.settingStatsTransform.table.conversions') }}</th>
            <th>{{ t('page.manageSetting.settingStatsTransform.table.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transform in settingStatsTransforms" :key="transform.id">
            <td>{{ transform.id }}</td>
            <td>{{ getStatName(transform.target_key) || transform.target_key }}</td>
            <td>
              <div class="conversions-list">
                <div 
                  v-for="(conversion, idx) in (transform.conversions || [])" 
                  :key="idx"
                  class="conversion-item"
                >
                  <span class="conversion-source">{{ getStatName(conversion.source_key) || conversion.source_key }}</span>
                  <span class="conversion-arrow">→</span>
                  <span class="conversion-value">{{ conversion.conversion_value }}</span>
                </div>
              </div>
            </td>
            <td class="actions-cell">
              <button class="btn-edit" @click="handleEdit(transform)">{{ t('page.manageSetting.settingStatsTransform.actions.edit') }}</button>
              <button class="btn-delete" @click="handleDelete(transform)">{{ t('page.manageSetting.settingStatsTransform.actions.delete') }}</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="pagination" class="pagination">
        <button 
          :disabled="pagination.current_page === 1"
          @click="changePage(pagination.current_page - 1)"
        >
          {{ t('page.manageSetting.settingStatsTransform.pagination.prev') }}
        </button>
        <span>{{ t('page.manageSetting.settingStatsTransform.pagination.page') }} {{ pagination.current_page }} {{ t('page.manageSetting.settingStatsTransform.pagination.of') }} {{ pagination.last_page }}</span>
        <button 
          :disabled="pagination.current_page === pagination.last_page"
          @click="changePage(pagination.current_page + 1)"
        >
          {{ t('page.manageSetting.settingStatsTransform.pagination.next') }}
        </button>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ editingTransform ? t('page.manageSetting.settingStatsTransform.edit') : t('page.manageSetting.settingStatsTransform.createModal') }}</h3>
          <button class="btn-close" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>{{ t('page.manageSetting.settingStatsTransform.form.target_key') }} *</label>
            <CustomSelect
              v-model="formData.target_key"
              :options="targetKeyOptions"
              :placeholder="t('page.manageSetting.settingStatsTransform.selectTargetKey')"
            />
          </div>
          <div class="form-group">
            <label>{{ t('page.manageSetting.settingStatsTransform.form.conversions') }} *</label>
            <div class="conversions-form-list">
              <div 
                v-for="(conversion, index) in conversionsList" 
                :key="index"
                class="conversion-form-item"
              >
                <CustomSelect
                  v-model="conversion.source_key"
                  :options="sourceKeyOptions"
                  :placeholder="t('page.manageSetting.settingStatsTransform.selectSourceKey')"
                  trigger-class="conversion-source-select"
                />
                <input 
                  v-model.number="conversion.conversion_value"
                  type="number"
                  step="0.0001"
                  min="0"
                  :placeholder="t('page.manageSetting.settingStatsTransform.valuePlaceholder')"
                  class="conversion-value-input"
                />
                <button 
                  type="button"
                  class="btn-remove-rate"
                  @click="removeConversion(index)"
                  :title="t('page.manageSetting.settingStatsTransform.removeConversion')"
                >
                  ×
                </button>
              </div>
              <button 
                type="button"
                class="btn-add-rate"
                @click="addConversion"
              >
                + {{ t('page.manageSetting.settingStatsTransform.addConversion') }}
              </button>
            </div>
            <small class="form-hint">{{ t('page.manageSetting.settingStatsTransform.conversionsHint') }}</small>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeModal" :disabled="saveLoading">{{ t('page.manageSetting.settingStatsTransform.actions.cancel') }}</button>
          <button 
            class="btn-primary" 
            :class="{ 'btn-loading': saveLoading, 'btn-fail': saveFailed }"
            @click="handleSave"
            :disabled="saveLoading || !formData.target_key || conversionsList.length === 0 || conversionsList.every(c => !c.source_key)"
          >
            <span v-if="saveLoading">{{ t('page.manageSetting.settingStatsTransform.saving') }}</span>
            <span v-else-if="saveFailed">{{ t('page.manageSetting.settingStatsTransform.saveFailed') }}</span>
            <span v-else>{{ editingTransform ? 'Update' : 'Create' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, computed, watch } from 'vue'
import CustomSelect from '../../../components/CustomSelect.vue'
import { getGlobalStats, isStatsDataLoaded, getStatName } from '../../../utils/globalData'

const gameApi = inject('gameApi', null)
const translator = inject('translator', null)
const showAlert = inject('showAlert', (msg) => alert(msg))
const t = translator || ((key) => key)

const loading = ref(false)
const error = ref(null)
const settingStatsTransforms = ref([])
const conversionKeys = ref([])
const conversionKeysAcceptConvert = ref([])
const pagination = ref(null)
const showModal = ref(false)
const editingTransform = ref(null)
const saveLoading = ref(false)
const saveFailed = ref(false)

const targetKeyOptions = computed(() => {
  return conversionKeysAcceptConvert.value.map(key => ({
    value: key.key,
    label: `${key.name} (${key.key})`
  }))
})

const sourceKeyOptions = computed(() => {
  // Source keys are already filtered (don't include target keys) from the API
  // But we also need to filter out the currently selected target_key
  const filteredKeys = conversionKeys.value.filter(key => key.key !== formData.value.target_key)
  return filteredKeys.map(key => ({
    value: key.key,
    label: `${key.name} (${key.key})`
  }))
})

const filters = ref({
  search: '',
  currentPage: 1,
  perPage: 11
})

const formData = ref({
  target_key: '',
  conversions: []
})

const conversionsList = ref([])

const addConversion = () => {
  conversionsList.value.push({
    source_key: '',
    conversion_value: 1.0
  })
}

const removeConversion = (index) => {
  conversionsList.value.splice(index, 1)
  syncConversionsFromList()
}

const syncConversionsFromList = () => {
  formData.value.conversions = conversionsList.value
    .filter(item => item.source_key && item.source_key !== '')
    .map(item => ({
      source_key: item.source_key,
      conversion_value: item.conversion_value || 0
    }))
}

const syncConversionsToList = () => {
  conversionsList.value = (formData.value.conversions || []).map(conversion => ({
    source_key: conversion.source_key || '',
    conversion_value: conversion.conversion_value || 1.0
  }))
  if (conversionsList.value.length === 0) {
    conversionsList.value.push({ source_key: '', conversion_value: 1.0 })
  }
}

const loadSettingStatsTransforms = async () => {
  if (!gameApi) {
    error.value = t('page.manageSetting.settingStatsTransform.errors.apiNotAvailable')
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
      params.target_key = filters.value.search
    }

    const response = await gameApi.getSettingStatsTransforms(params)
    
    if (response.data && response.data.datas && response.data.datas.setting_stats_transforms) {
      settingStatsTransforms.value = response.data.datas.setting_stats_transforms.data || []
      pagination.value = {
        current_page: response.data.datas.setting_stats_transforms.current_page,
        last_page: response.data.datas.setting_stats_transforms.last_page,
        total: response.data.datas.setting_stats_transforms.total
      }
    }

  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Failed to load setting stats transforms'
    console.error('Error loading setting stats transforms:', err)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  filters.value.currentPage = 1
  loadSettingStatsTransforms()
}

const changePage = (page) => {
  filters.value.currentPage = page
  loadSettingStatsTransforms()
}

const handleCreate = () => {
  editingTransform.value = null
  saveLoading.value = false
  saveFailed.value = false
  formData.value = {
    target_key: '',
    conversions: []
  }
  conversionsList.value = [{ source_key: '', conversion_value: 1.0 }]
  showModal.value = true
}

const handleEdit = (transform) => {
  editingTransform.value = transform
  saveLoading.value = false
  saveFailed.value = false
  formData.value = {
    target_key: transform.target_key || '',
    conversions: transform.conversions ? [...transform.conversions] : []
  }
  syncConversionsToList()
  showModal.value = true
}

const loadConversionKeys = async () => {
  if (!gameApi) {
    return
  }

  try {
    const response = await gameApi.getSettingStatsTransformsAllowedKeys()
    
    if (response.data && response.data.datas) {
      conversionKeysAcceptConvert.value = response.data.datas.allowed_target_keys || []
      conversionKeys.value = response.data.datas.allowed_source_keys || []
    }
  } catch (err) {
    console.error('Error loading allowed keys:', err)
    // Fallback to global stats data if API fails
    if (isStatsDataLoaded()) {
      const globalData = getGlobalStats()
      conversionKeys.value = globalData.stats || []
      conversionKeysAcceptConvert.value = globalData.stats || []
    }
  }
}

const handleSave = async () => {
  if (!gameApi) {
    error.value = t('page.manageSetting.settingStatsTransform.errors.apiNotAvailable')
    return
  }

  if (!formData.value.target_key) {
    error.value = t('page.manageSetting.settingStatsTransform.errors.targetKeyRequired')
    return
  }

  // Sync conversions from list before saving
  syncConversionsFromList()

  if (formData.value.conversions.length === 0) {
    error.value = t('page.manageSetting.settingStatsTransform.errors.conversionsRequired')
    return
  }

  // Check that source keys don't include target key
  const hasInvalidSource = formData.value.conversions.some(conv => conv.source_key === formData.value.target_key)
  if (hasInvalidSource) {
    error.value = t('page.manageSetting.settingStatsTransform.errors.sourceKeysCannotIncludeTarget')
    return
  }

  saveLoading.value = true
  saveFailed.value = false
  error.value = null

  try {
    const data = {
      target_key: formData.value.target_key,
      conversions: formData.value.conversions
    }

    if (editingTransform.value) {
      await gameApi.updateSettingStatsTransform(editingTransform.value.id, data)
    } else {
      await gameApi.createSettingStatsTransform(data)
    }
    
    saveLoading.value = false
    saveFailed.value = false
    closeModal()
    loadSettingStatsTransforms()
  } catch (err) {
    saveLoading.value = false
    saveFailed.value = true
    error.value = err.response?.data?.message || err.message || 'Failed to save setting stats transform'
    console.error('Error saving setting stats transform:', err)
    
    // Reset fail state after 3 seconds
    setTimeout(() => {
      saveFailed.value = false
    }, 3000)
  }
}

const handleSuggest = async () => {
  if (!gameApi) {
    error.value = t('page.manageSetting.settingStatsTransform.errors.apiNotAvailable')
    return
  }

  if (!confirm(t('page.manageSetting.settingStatsTransform.confirm.suggest'))) {
    return
  }

  loading.value = true
  error.value = null

  try {
    const response = await gameApi.suggestSettingStatsTransforms()
    showAlert(t('page.manageSetting.settingStatsTransform.messages.suggestSuccess'))
    loadSettingStatsTransforms()
  } catch (e) {
    console.error('Error suggesting data:', e)
    showAlert('Failed to suggest data: ' + (e.response?.data?.message || e.message))
  } finally {
    loading.value = false
  }
}

const handleDelete = async (transform) => {
  if (!gameApi) {
    error.value = t('page.manageSetting.settingStatsTransform.errors.apiNotAvailable')
    return
  }

  const targetKeyName = getStatName(transform.target_key) || transform.target_key
  if (!confirm(t('page.manageSetting.settingStatsTransform.confirm.delete').replace('{target_key}', targetKeyName))) {
    return
  }

  loading.value = true
  error.value = null

  try {
    await gameApi.deleteSettingStatsTransform(transform.id)
    loadSettingStatsTransforms()
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Failed to delete setting stats transform'
    console.error('Error deleting setting stats transform:', err)
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  showModal.value = false
  editingTransform.value = null
  saveLoading.value = false
  saveFailed.value = false
  formData.value = {
    target_key: '',
    conversions: []
  }
  conversionsList.value = []
}

// Watch conversionsList changes and sync to conversions array
watch(() => conversionsList.value, () => {
  syncConversionsFromList()
}, { deep: true })

// Watch target_key changes and clear invalid source_keys
watch(() => formData.value.target_key, (newTargetKey, oldTargetKey) => {
  if (newTargetKey && newTargetKey !== oldTargetKey) {
    // Clear any conversions where source_key matches the new target_key
    conversionsList.value = conversionsList.value.map(conv => {
      if (conv.source_key === newTargetKey) {
        return { ...conv, source_key: '' }
      }
      return conv
    })
    syncConversionsFromList()
  }
})

onMounted(() => {
  loadSettingStatsTransforms()
  loadConversionKeys()
})
</script>

<style scoped>
.setting-stats-transform-list-page {
  width: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header .actions {
  display: flex;
  gap: 10px;
  align-items: center;
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

.conversions-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.conversion-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: #1a2332;
  border: 1px solid #253344;
  border-radius: 4px;
  font-size: 13px;
}

.conversion-source {
  color: #d0d4d6;
  font-weight: 500;
}

.conversion-arrow {
  color: #f6a901;
  font-weight: bold;
}

.conversion-value {
  color: #4a90e2;
  font-weight: 600;
}

.conversions-form-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.conversion-form-item {
  display: flex;
  gap: 10px;
  align-items: center;
}

.conversion-source-select {
  flex: 1;
  min-width: 200px;
}

.conversion-value-input {
  flex: 1;
  min-width: 150px;
  padding: 10px;
  background: #253344;
  border: 1px solid #1a2332;
  color: #d0d4d6;
  font-size: 14px;
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

.form-hint {
  display: block;
  margin-top: 5px;
  font-size: 12px;
  color: #999;
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
