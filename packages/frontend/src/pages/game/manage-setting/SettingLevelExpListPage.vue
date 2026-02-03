<template>
  <div class="setting-level-exps-page">
    <div class="page-header">
      <h2>{{ t('page.manageSetting.settingLevelExps.title') }}</h2>
      <div class="actions">
        <button class="btn-primary" @click="handleSuggest" style="margin-right: 10px;">
          {{ t('page.manageSetting.settingLevelExps.suggest') }}
        </button>
        <button class="btn-primary" @click="handleCreate">
          {{ t('page.manageSetting.settingLevelExps.create') }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading">{{ t('page.manageSetting.settingLevelExps.loading') }}</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="!loading && !error" class="table-container">
      <table class="settings-table">
        <thead>
          <tr>
            <th>{{ t('page.manageSetting.settingLevelExps.table.id') }}</th>
            <th>{{ t('page.manageSetting.settingLevelExps.table.lv') }}</th>
            <th>{{ t('page.manageSetting.settingLevelExps.table.expNeeded') }}</th>
            <th>{{ t('page.manageSetting.settingLevelExps.table.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in levelExps" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.lv }}</td>
            <td>{{ item.exp_needed }}</td>
            <td class="actions-cell">
              <button class="btn-edit" @click="handleEdit(item)">{{ t('page.manageSetting.settingLevelExps.edit') }}</button>
              <button class="btn-delete" @click="handleDelete(item)">{{ t('page.manageSetting.settingLevelExps.delete') }}</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="pagination" class="pagination">
        <button 
          :disabled="pagination.current_page === 1"
          @click="changePage(pagination.current_page - 1)"
        >
          {{ t('page.manageSetting.settingLevelExps.pagination.prev') }}
        </button>
        <span>{{ t('page.manageSetting.settingLevelExps.pagination.page') }} {{ pagination.current_page }} {{ t('page.manageSetting.settingLevelExps.pagination.of') }} {{ pagination.last_page }}</span>
        <button 
          :disabled="pagination.current_page === pagination.last_page"
          @click="changePage(pagination.current_page + 1)"
        >
          {{ t('page.manageSetting.settingLevelExps.pagination.next') }}
        </button>
      </div>
    </div>

    <!-- Modal Implementation -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ editingItem ? t('page.manageSetting.settingLevelExps.edit') : t('page.manageSetting.settingLevelExps.create') }}</h3>
          <button class="btn-close" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>{{ t('page.manageSetting.settingLevelExps.form.lv') }}</label>
            <input v-model.number="formData.lv" type="number" required min="1" />
          </div>
          <div class="form-group">
            <label>{{ t('page.manageSetting.settingLevelExps.form.expNeeded') }}</label>
            <input v-model.number="formData.exp_needed" type="number" required min="0" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeModal">{{ t('page.manageSetting.settingLevelExps.cancel') }}</button>
          <button class="btn-primary" @click="handleSave" :disabled="saving">
            {{ saving ? t('page.manageSetting.settingLevelExps.saving') : t('page.manageSetting.settingLevelExps.save') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'

const translator = inject('translator', null)
const t = translator || ((key) => key)

const gameApi = inject('gameApi')
const showAlert = inject('showAlert', (msg) => alert(msg))
const loading = ref(false)
const error = ref(null)
const levelExps = ref([])
const pagination = ref(null)
const showModal = ref(false)
const editingItem = ref(null)
const formData = ref({ lv: 1, exp_needed: 0 })
const saving = ref(false)

const filters = ref({
  currentPage: 1,
  perPage: 15
})

const loadLevelExps = async () => {
  if (!gameApi) return
  loading.value = true
  try {
    const params = {
      currentPage: filters.value.currentPage,
      perPage: filters.value.perPage
    }
    const res = await gameApi.getLevelExps(params)
    if(res.data && res.data.datas && res.data.datas.level_exps) {
      levelExps.value = res.data.datas.level_exps.data || []
      pagination.value = {
        current_page: res.data.datas.level_exps.current_page,
        last_page: res.data.datas.level_exps.last_page,
        total: res.data.datas.level_exps.total
      }
    }
  } catch (e) {
    error.value = e.message || t('page.manageSetting.settingLevelExps.messages.loadFailed')
  } finally {
    loading.value = false
  }
}

const changePage = (page) => {
  filters.value.currentPage = page
  loadLevelExps()
}

const handleCreate = () => {
  editingItem.value = null
  formData.value = { lv: 1, exp_needed: 0 }
  showModal.value = true
}

const handleSuggest = async () => {
  if (loading.value) return // Prevent double-click
  
  loading.value = true
  try {
    const response = await gameApi.suggestLevelExps()
    filters.value.currentPage = 1
    await loadLevelExps()
    showAlert('Level exp data created successfully!')
  } catch (e) {
    console.error('Error suggesting data:', e)
    showAlert('Failed to suggest data: ' + (e.response?.data?.message || e.message))
  } finally {
    loading.value = false
  }
}

const handleEdit = (item) => {
  editingItem.value = item
  formData.value = JSON.parse(JSON.stringify(item))
  showModal.value = true
}

const handleDelete = async (item) => {
  if (!confirm(t('page.manageSetting.settingLevelExps.messages.confirmDelete'))) {
    return
  }
  try {
    await gameApi.deleteLevelExp(item.id)
    // Reset to page 1 if current page becomes empty
    if (levelExps.value.length === 1 && filters.value.currentPage > 1) {
      filters.value.currentPage = 1
    }
    loadLevelExps()
  } catch (e) {
    showAlert(t('page.manageSetting.settingLevelExps.messages.deleteFailed'))
  }
}

const closeModal = () => showModal.value = false

const handleSave = async () => {
  if (!formData.value.lv || formData.value.exp_needed < 0) {
    showAlert(t('page.manageSetting.settingLevelExps.messages.invalidData'))
    return
  }
  
  saving.value = true
  try {
    if(editingItem.value) {
      await gameApi.updateLevelExp(editingItem.value.id, formData.value)
    } else {
      await gameApi.createLevelExp(formData.value)
    }
    closeModal()
    loadLevelExps()
  } catch (e) {
    showAlert(t('page.manageSetting.settingLevelExps.messages.saveFailed') + ': ' + (e.response?.data?.message || e.message))
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadLevelExps()
})
</script>

<style scoped>
/* Reuse styles from SettingStackBonusListPage */
.setting-level-exps-page { width: 100%; }
.page-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
.page-header h2 { color: #d0d4d6; margin: 0; }
.actions { display: flex; gap: 10px; }
.loading, .error { padding: 20px; text-align: center; color: #d0d4d6; }
.table-container { overflow-x: auto; }
.settings-table { width: 100%; border-collapse: collapse; background: #253344; }
.settings-table th, .settings-table td { padding: 12px; text-align: left; border-bottom: 1px solid #1a2332; color: #d0d4d6; }
.settings-table th { background: #1a2332; color: #f6a901; }
.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 5px; color: #d0d4d6; }
.form-group input { width: 100%; padding: 8px; background: #2f3e52; border: 1px solid #1a2332; color: white; }
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.modal-content { background: #253344; padding: 20px; border-radius: 8px; width: 500px; max-width: 90%; max-height: 90vh; overflow-y: auto; color: #d0d4d6; }
.modal-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
.modal-header h3 { color: #f6a901; margin: 0; }
.btn-close { background: none; border: none; color: #d0d4d6; font-size: 24px; cursor: pointer; padding: 0; width: 30px; height: 30px; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
.btn-primary { background: #f6a901; border: none; padding: 8px 16px; color: #1a2332; font-weight: 600; cursor: pointer; border-radius: 4px; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-secondary { background: #1a2332; border: 1px solid #4a5b70; color: #d0d4d6; padding: 8px 16px; cursor: pointer; border-radius: 4px; }
.btn-edit, .btn-delete { padding: 4px 8px; margin-right: 5px; cursor: pointer; border-radius: 2px; border: 1px solid #4a5b70; background: #2f3e52; color: white; }
.btn-delete { background: #e74c3c; border-color: #e74c3c; }
.actions-cell { white-space: nowrap; }
.pagination { display: flex; justify-content: center; align-items: center; gap: 15px; margin-top: 20px; padding: 15px; }
.pagination button { background: #2f3e52; border: 1px solid #4a5b70; color: #d0d4d6; padding: 8px 16px; cursor: pointer; border-radius: 4px; }
.pagination button:disabled { opacity: 0.5; cursor: not-allowed; }
.pagination button:not(:disabled):hover { background: #3d4f66; }
.pagination span { color: #d0d4d6; }
</style>
