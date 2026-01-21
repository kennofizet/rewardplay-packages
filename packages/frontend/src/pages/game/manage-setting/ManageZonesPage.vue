<template>
  <div class="manage-zones-page">
    <div class="page-header">
      <h2>{{ t('page.manageSetting.manageZones.title') || 'Manage Zones' }}</h2>
      <button class="btn-primary" @click="handleCreate">{{ t('page.manageSetting.manageZones.create') || 'Create Zone' }}</button>
    </div>

    <div class="filters">
      <input v-model="filters.search" type="text" class="search-input" :placeholder="t('page.manageSetting.manageZones.searchPlaceholder') || 'Search zones'" @input="handleSearch" />
    </div>

    <div v-if="loading" class="loading">{{ t('page.manageSetting.manageZones.loading') || 'Loading...' }}</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="!loading && !error" class="table-container">
  <table class="settings-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="zone in zones" :key="zone.id">
            <td>{{ zone.id }}</td>
            <td>{{ zone.name }}</td>
            
            <td>
              <button class="btn-edit" @click="handleEdit(zone)">Edit</button>
              <button class="btn-edit" @click="handleManageMembers(zone)">{{ t('page.manageSetting.manageZones.members') || 'Manage Members' }}</button>
              <button class="btn-delete" @click="handleDelete(zone)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ editingZone ? t('page.manageSetting.manageZones.edit') || 'Edit Zone' : t('page.manageSetting.manageZones.create') || 'Create Zone' }}</h3>
          <button class="btn-close" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>{{ t('page.manageSetting.manageZones.form.name') || 'Name' }}</label>
            <input v-model="formData.name" type="text" required />
          </div>
          <!-- server_id is determined by server context; no input required -->
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeModal">{{ t('page.manageSetting.manageZones.cancel') || 'Cancel' }}</button>
          <button class="btn-primary" @click="handleSave" :disabled="saveLoading">
            <span v-if="saveLoading">{{ t('page.manageSetting.manageZones.saving') || 'Saving...' }}</span>
            <span v-else>{{ editingZone ? t('page.manageSetting.manageZones.update') || 'Update' : t('page.manageSetting.manageZones.create') || 'Create' }}</span>
          </button>
        </div>
      </div>
    </div>
    <!-- Members Modal -->
  <div v-if="showMembersModal" class="modal-overlay" @click="showMembersModal = false">
      <div class="modal-content" @click.stop style="width:720px; max-height:80vh; overflow:auto">
        <div class="modal-header">
          <h3>{{ t('page.manageSetting.manageZones.modal.title') || 'Manage Zone Members' }}</h3>
          <button class="btn-close" @click="showMembersModal = false">×</button>
        </div>
        <div class="modal-body">
          <div v-if="membersLoading">{{ t('page.manageSetting.manageZones.loading') || 'Loading...' }}</div>
          <div v-if="!membersLoading">
            <div style="display:flex; gap:8px; align-items:center; margin-bottom:8px">
              <input v-model="membersFilter.search" type="text" class="search-input" :placeholder="t('page.manageSetting.manageZones.modal.searchPlaceholder') || 'Search members...'" @input="() => loadZoneMembers(currentZone && currentZone.id)" />
              <CustomSelect
                v-model="membersFilter.assigned"
                :options="assignedOptions"
                :placeholder="t('page.manageSetting.manageZones.modal.searchPlaceholder') || 'Filter...'"
                trigger-class="zone-select"
                @change="() => loadZoneMembers(currentZone && currentZone.id)"
              />
            </div>
            <table class="settings-table" style="width:100%">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in serverUsers" :key="user.id">
                  <td>{{ user.id }}</td>
                  <td>{{ user.name || user.username || user.email || '-' }}</td>
                  <td>
                    <span class="members-badge" :class="user.assigned ? 'assigned' : 'unassigned'">
                      {{ user.assigned ? (t('page.manageSetting.manageZones.assigned') || 'Assigned') : (t('page.manageSetting.manageZones.unassigned') || 'Unassigned') }}
                    </span>
                  </td>
                  <td class="actions-cell">
                    <button v-if="!user.assigned" class="btn-primary" @click="handleAssign(user)">{{ t('page.manageSetting.manageZones.assign') || 'Assign' }}</button>
                    <button v-else class="btn-secondary" @click="handleRemove(user)">{{ t('page.manageSetting.manageZones.remove') || 'Remove' }}</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="showMembersModal = false">{{ t('page.manageSetting.manageZones.cancel') || 'Close' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import CustomSelect from '../../../components/CustomSelect.vue'

const gameApi = inject('gameApi', null)
const api = inject('api', null)
const translator = inject('translator', null)
const t = translator || ((k)=>k)

const loading = ref(false)
const error = ref(null)
const zones = ref([])
const showModal = ref(false)
const editingZone = ref(null)
const saveLoading = ref(false)

const filters = ref({ search: '' })

const formData = ref({ name: '' })
const membersFilter = ref({ search: '', assigned: '' })

const assignedOptions = [
  { value: '', label: t('page.manageSetting.manageZones.modal.all') || 'All' },
  { value: '1', label: t('page.manageSetting.manageZones.assigned') || 'Assigned' },
  { value: '0', label: t('page.manageSetting.manageZones.unassigned') || 'Unassigned' }
]
const showMembersModal = ref(false)
const currentZone = ref(null)
const membersLoading = ref(false)
const serverUsers = ref([])

const normalize = (resp) => {
  if (!resp) return []
  if (Array.isArray(resp)) return resp
  if (resp.data) {
    if (resp.data.datas && resp.data.datas.zones) return resp.data.datas.zones
    if (resp.data.zones) return resp.data.zones
  }
  if (resp.zones) return resp.zones
  return []
}

const loadZones = async () => {
  loading.value = true
  error.value = null

  try {
    let resp = null
    if (gameApi && gameApi.getManagedZones) {
      resp = await gameApi.getManagedZones()
    } else if (api && api.getManagedZones) {
      resp = await api.getManagedZones()
    } else if (gameApi && gameApi.getAllZones) {
      resp = await gameApi.getAllZones({ name: filters.value.search })
    } else if (api && api.getAllZones) {
      resp = await api.getAllZones({ name: filters.value.search })
    }

    zones.value = normalize(resp)
  } catch (e) {
    console.error('Failed to load zones', e)
    error.value = e.response?.data?.message || e.message || 'Failed to load zones'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadZones()
})

const handleSearch = () => {
  loadZones()
}

const handleCreate = () => {
  editingZone.value = null
  formData.value = { name: '' }
  showModal.value = true
}

const handleEdit = (zone) => {
  editingZone.value = zone
  formData.value = { name: zone.name }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const handleSave = async () => {
  saveLoading.value = true
  try {
    if (editingZone.value) {
      await gameApi.updateZone(editingZone.value.id, formData.value)
    } else {
      await gameApi.createZone(formData.value)
    }
    await loadZones()
    closeModal()
  } catch (e) {
    console.error('Failed to save zone', e)
    error.value = e.response?.data?.message || e.message || 'Failed to save zone'
  } finally {
    saveLoading.value = false
  }
}

const handleDelete = async (zone) => {
  if (!confirm(t('page.manageSetting.manageZones.confirmDelete') || `Delete zone ${zone.name}?`)) return
  try {
    await gameApi.deleteZone(zone.id)
    await loadZones()
  } catch (e) {
    console.error('Failed to delete zone', e)
    error.value = e.response?.data?.message || e.message || 'Failed to delete zone'
  }
}

const handleManageMembers = async (zone) => {
  currentZone.value = zone
  showMembersModal.value = true
  await loadZoneMembers(zone.id)
}

const loadZoneMembers = async (zoneId) => {
  if (!zoneId) return
  membersLoading.value = true
  try {
    const params = {
      search: membersFilter.value.search || undefined,
      // assigned filter handled client-side for now
    }
    const resp = await (gameApi && gameApi.getZoneUsers ? gameApi.getZoneUsers(zoneId, params) : api.getZoneUsers && api.getZoneUsers(zoneId, params))
    // normalize response from backend: { success, message, datas: { users, assigned_user_ids } }
    const datas = resp?.data?.datas || resp?.data || resp
    const users = datas.users || datas.data || []
    const assigned = datas.assigned_user_ids || []

    const allUsers = (Array.isArray(users) ? users : [])
    const mapped = allUsers.map(u => ({ ...u, assigned: assigned.includes(u.id) }))
    if (membersFilter.value.assigned !== '') {
      const wantAssigned = membersFilter.value.assigned === '1'
      serverUsers.value = mapped.filter(u => Boolean(u.assigned) === wantAssigned)
    } else {
      serverUsers.value = mapped
    }
  } catch (e) {
    console.error('Failed to load zone users', e)
    error.value = e.response?.data?.message || e.message || 'Failed to load zone users'
  } finally {
    membersLoading.value = false
  }
}

const handleAssign = async (user) => {
  try {
    await (gameApi && gameApi.assignZoneUser ? gameApi.assignZoneUser(currentZone.value.id, user.id) : api.assignZoneUser && api.assignZoneUser(currentZone.value.id, user.id))
    await loadZoneMembers(currentZone.value.id)
  } catch (e) {
    console.error('Failed to assign user', e)
    error.value = e.response?.data?.message || e.message || 'Failed to assign user'
  }
}

const handleRemove = async (user) => {
  try {
    await (gameApi && gameApi.removeZoneUser ? gameApi.removeZoneUser(currentZone.value.id, user.id) : api.removeZoneUser && api.removeZoneUser(currentZone.value.id, user.id))
    await loadZoneMembers(currentZone.value.id)
  } catch (e) {
    console.error('Failed to remove user', e)
    error.value = e.response?.data?.message || e.message || 'Failed to remove user'
  }
}
</script>

<style scoped>
.manage-zones-page {
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

.rates-list { display:flex; flex-direction:column; gap:10px }

.rate-item { display:flex; gap:10px; align-items:center }

.rate-key-select { flex:1; min-width:200px }

.rate-value-input { flex:1; min-width:150px; padding:10px; background:#253344; border:1px solid #1a2332; color:#d0d4d6; font-size:14px }

.btn-remove-rate { width:32px; height:32px; padding:0; background:#ff6b6b; color:white; border:none; border-radius:4px; cursor:pointer; font-size:20px; line-height:1; display:flex; align-items:center; justify-content:center; transition: background 0.25s }

.btn-remove-rate:hover { background:#ee5a5a }

.btn-add-rate { padding:10px 16px; background:#4a90e2; color:white; border:none; border-radius:4px; cursor:pointer; font-size:14px; transition: background 0.25s; align-self:flex-start }

.btn-add-rate:hover { background:#357abd }

.modal-footer { display:flex; justify-content:flex-end; gap:10px; padding:20px; border-top:1px solid #253344 }

.members-badge { display:inline-block; padding:4px 8px; background:#e9ecef; border-radius:999px; font-size:12px }
.members-badge.assigned { background:#17a2b8; color:#fff }
.members-badge.unassigned { background:#6c757d; color:#fff }
</style>
