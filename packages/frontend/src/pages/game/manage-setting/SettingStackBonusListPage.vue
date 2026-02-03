<template>
  <div class="setting-stack-bonuses-page">
    <div class="page-header">
      <h2>{{ t('page.manageSetting.settingStackBonuses.title') }}</h2>
      <div class="actions">
        <button class="btn-primary" @click="handleSuggest" style="margin-right: 10px;">
          {{ t('page.manageSetting.settingStackBonuses.suggest') }}
        </button>
        <button class="btn-primary" @click="handleCreate">
          {{ t('page.manageSetting.settingStackBonuses.create') }}
        </button>
      </div>
    </div>

    <!-- TODO: Filters if needed -->

    <div v-if="loading" class="loading">{{ t('page.manageSetting.settingStackBonuses.loading') }}</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="!loading && !error" class="table-container">
      <table class="settings-table">
        <thead>
          <tr>
            <th>{{ t('page.manageSetting.settingStackBonuses.table.id') }}</th>
            <th>{{ t('page.manageSetting.settingStackBonuses.table.name') }}</th>
            <th>{{ t('page.manageSetting.settingStackBonuses.table.consecutiveDay') }}</th>
            <th>{{ t('page.manageSetting.settingStackBonuses.table.rewards') }}</th>
            <th>{{ t('page.manageSetting.settingStackBonuses.table.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in bonuses" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.day }}</td>
            <td>
              <div v-for="(reward, idx) in item.rewards" :key="idx" class="reward-inline">
                {{ reward.type }} x{{ reward.quantity }}
              </div>
            </td>
            <td class="actions-cell">
              <button class="btn-edit" @click="handleEdit(item)">{{ t('page.manageSetting.settingStackBonuses.edit') }}</button>
              <button class="btn-delete" @click="handleDelete(item)">{{ t('page.manageSetting.settingStackBonuses.delete') }}</button>
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

    <!-- Modal Implementation -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ editingItem ? t('page.manageSetting.settingStackBonuses.edit') : t('page.manageSetting.settingStackBonuses.create') }}</h3>
          <button class="btn-close" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>{{ t('page.manageSetting.settingStackBonuses.form.name') }}</label>
            <input v-model="formData.name" type="text" required />
          </div>
          <div class="form-group">
            <label>{{ t('page.manageSetting.settingStackBonuses.form.consecutiveDay') }}</label>
            <input v-model.number="formData.day" type="number" required min="1" />
          </div>

          <div class="rewards-section">
             <label>{{ t('page.manageSetting.settingStackBonuses.form.rewards') }}</label>
             <div v-for="(reward, index) in formData.rewards" :key="index" class="reward-row">
                <select v-model="reward.type" class="form-select small">
                  <option v-for="(label, type) in rewardTypes" :key="type" :value="type">{{ label }}</option>
                </select>
                <input v-model.number="reward.quantity" type="number" :placeholder="t('page.manageSetting.settingStackBonuses.form.qty')" class="small-input" />
                <button class="btn-danger small" @click="removeReward(index)">x</button>
             </div>
             <button class="btn-secondary small" @click="addReward">{{ t('page.manageSetting.settingStackBonuses.form.addReward') }}</button>
          </div>

        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeModal">{{ t('page.manageSetting.settingStackBonuses.cancel') }}</button>
          <button class="btn-primary" @click="handleSave" :disabled="saving">
            {{ saving ? t('page.manageSetting.settingStackBonuses.saving') : t('page.manageSetting.settingStackBonuses.save') }}
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
const bonuses = ref([])
const pagination = ref(null)
const showModal = ref(false)
const editingItem = ref(null)
const formData = ref({ name: '', day: 3, rewards: [{ type: 'coin', quantity: 100 }] })
const saving = ref(false)
const rewardTypes = ref([])

const filters = ref({
  currentPage: 1,
  perPage: 15
})

const loadRewardTypes = async () => {
    try {
        const res = await gameApi.getRewardTypes('stack_bonus')
        if (res.data?.datas?.reward_types) {
            rewardTypes.value = res.data.datas.reward_types
        }
    } catch (e) {
        console.error("Failed to load reward types", e)
    }
}

const loadBonuses = async () => {
    if (!gameApi) return
    loading.value = true
    try {
        const params = {
            currentPage: filters.value.currentPage,
            perPage: filters.value.perPage
        }
        const res = await gameApi.getStackBonuses(params)
        if(res.data && res.data.datas && res.data.datas.bonuses) {
            bonuses.value = res.data.datas.bonuses.data || []
            pagination.value = {
                current_page: res.data.datas.bonuses.current_page,
                last_page: res.data.datas.bonuses.last_page,
                total: res.data.datas.bonuses.total
            }
        }
    } catch (e) {
        error.value = e.message || t('page.manageSetting.settingStackBonuses.messages.loadFailed')
    } finally {
        loading.value = false
    }
}

const changePage = (page) => {
    filters.value.currentPage = page
    loadBonuses()
}

const handleCreate = () => {
    editingItem.value = null
    formData.value = { name: '', day: 3, rewards: [{ type: 'coin', quantity: 100 }] }
    showModal.value = true
}

const handleSuggest = async () => {
    if (loading.value) return // Prevent double-click
    
    loading.value = true
    try {
        const response = await gameApi.suggestStackBonuses()
        filters.value.currentPage = 1
        await loadBonuses()
        showAlert('Stack bonuses created successfully!')
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
    if (!formData.value.rewards) formData.value.rewards = []
    showModal.value = true
}

const addReward = () => {
    formData.value.rewards.push({ type: 'coin', quantity: 100 })
}

const removeReward = (index) => {
    formData.value.rewards.splice(index, 1)
}

const handleDelete = async (item) => {
    try {
        await gameApi.deleteStackBonus(item.id)
        // Reset to page 1 if current page becomes empty
        if (bonuses.value.length === 1 && filters.value.currentPage > 1) {
            filters.value.currentPage = 1
        }
        loadBonuses()
    } catch (e) {
        showAlert(t('page.manageSetting.settingStackBonuses.messages.deleteFailed'))
    }
}

const closeModal = () => showModal.value = false

const handleSave = async () => {
    saving.value = true
    try {
        if(editingItem.value) {
            await gameApi.updateStackBonus(editingItem.value.id, formData.value)
        } else {
            await gameApi.createStackBonus(formData.value)
        }
        closeModal()
        loadBonuses()
    } catch (e) {
        showAlert(t('page.manageSetting.settingStackBonuses.messages.saveFailed') + ': ' + (e.response?.data?.message || e.message))
    } finally {
        saving.value = false
    }
}

onMounted(() => {
    loadRewardTypes()
    loadBonuses()
})
</script>

<style scoped>
/* Reuse styles from SettingItemsListPage or shared styles */
.setting-stack-bonuses-page { width: 100%; }
.page-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
.page-header h2 { color: #d0d4d6; margin: 0; }
.loading, .error { padding: 20px; text-align: center; color: #d0d4d6; }
.table-container { overflow-x: auto; }
.settings-table { width: 100%; border-collapse: collapse; background: #253344; }
.settings-table th, .settings-table td { padding: 12px; text-align: left; border-bottom: 1px solid #1a2332; color: #d0d4d6; }
.settings-table th { background: #1a2332; color: #f6a901; }
.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 5px; color: #d0d4d6; }
.form-group input, .form-select { width: 100%; padding: 8px; background: #2f3e52; border: 1px solid #1a2332; color: white; }
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.modal-content { background: #253344; padding: 20px; border-radius: 8px; width: 500px; max-width: 90%; max-height: 90vh; overflow-y: auto; color: #d0d4d6; }
.modal-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
.btn-primary { background: #f6a901; border: none; padding: 8px 16px; color: #1a2332; font-weight: 600; cursor: pointer; border-radius: 4px; }
.btn-secondary { background: #1a2332; border: 1px solid #4a5b70; color: #d0d4d6; padding: 8px 16px; cursor: pointer; border-radius: 4px; }
.btn-edit, .btn-delete { padding: 4px 8px; margin-right: 5px; cursor: pointer; border-radius: 2px; border: 1px solid #4a5b70; background: #2f3e52; color: white; }
.btn-delete { background: #e74c3c; border-color: #e74c3c; }

.rewards-section { margin-top: 15px; border-top: 1px solid #1a2332; padding-top: 10px; }
.reward-row { display: flex; gap: 10px; margin-bottom: 8px; align-items: center; }
.form-select.small, .small-input { padding: 4px; font-size: 0.9em; }
.small-input { width: 80px; }
.reward-inline { display: inline-block; background: #1a2332; padding: 2px 6px; border-radius: 4px; margin-right: 5px; font-size: 0.85em; }
.btn-danger.small { padding: 2px 6px; font-size: 0.8em; }
.btn-secondary.small { padding: 4px 8px; font-size: 0.9em; }
.pagination { display: flex; justify-content: center; align-items: center; gap: 15px; margin-top: 20px; padding: 15px; }
.pagination button { background: #2f3e52; border: 1px solid #4a5b70; color: #d0d4d6; padding: 8px 16px; cursor: pointer; border-radius: 4px; }
.pagination button:disabled { opacity: 0.5; cursor: not-allowed; }
.pagination button:not(:disabled):hover { background: #3d4f66; }
.pagination span { color: #d0d4d6; }
</style>
