<template>
  <div class="setting-box-ticket-buff-page">
    <div class="page-header">
      <h2>{{ t('page.manageSetting.settingBoxTicketBuff.title') }}</h2>
      <div class="header-actions">
        <button class="btn-primary" @click="handleSuggest" :disabled="suggesting" style="margin-right: 10px;">
          {{ t('page.manageSetting.settingBoxTicketBuff.suggest') || 'Suggest' }}
        </button>
        <button class="btn-primary" @click="handleCreate">
          {{ t('page.manageSetting.settingBoxTicketBuff.create') }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading">{{ t('page.manageSetting.settingBoxTicketBuff.loading') }}</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="!loading && !error" class="table-container">
      <table class="settings-table">
        <thead>
          <tr>
            <th>{{ t('page.manageSetting.settingBoxTicketBuff.table.id') }}</th>
            <th>{{ t('page.manageSetting.settingBoxTicketBuff.table.image') || 'Image' }}</th>
            <th>{{ t('page.manageSetting.settingBoxTicketBuff.table.name') }}</th>
            <th>{{ t('page.manageSetting.settingBoxTicketBuff.table.type') }}</th>
            <th>{{ t('page.manageSetting.settingBoxTicketBuff.table.config') }}</th>
            <th>{{ t('page.manageSetting.settingBoxTicketBuff.table.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in items" :key="row.id">
            <td>{{ row.id }}</td>
            <td>
              <img v-if="row.image" :src="row.image" alt="" class="item-thumb" />
              <span v-else>—</span>
            </td>
            <td>{{ row.name }}</td>
            <td>{{ typeLabels[row.type] ?? row.type }}</td>
            <td>
              <span v-if="row.actions?.is_box_random">{{ (row.default_property?.rate_list?.length || 0) }} items (rate + count per item)</span>
              <span v-else-if="row.actions?.is_buff">{{ row.default_property?.buff_type ?? '—' }}: {{ row.default_property?.buff_value ?? '—' }}</span>
              <span v-else>—</span>
            </td>
            <td class="actions-cell">
              <button class="btn-edit" @click="handleEdit(row)">{{ t('page.manageSetting.settingBoxTicketBuff.edit') }}</button>
              <button class="btn-delete" @click="handleDelete(row)">{{ t('page.manageSetting.settingBoxTicketBuff.delete') }}</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="pagination" class="pagination">
        <button :disabled="pagination.current_page === 1" @click="changePage(pagination.current_page - 1)">
          {{ t('page.manageSetting.settingStackBonuses.pagination.prev') }}
        </button>
        <span>{{ t('page.manageSetting.settingStackBonuses.pagination.page') }} {{ pagination.current_page }} {{ t('page.manageSetting.settingStackBonuses.pagination.of') }} {{ pagination.last_page }}</span>
        <button :disabled="pagination.current_page === pagination.last_page" @click="changePage(pagination.current_page + 1)">
          {{ t('page.manageSetting.settingStackBonuses.pagination.next') }}
        </button>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content modal-content--wide" @click.stop>
        <div class="modal-header">
          <h3>{{ editingItem ? t('page.manageSetting.settingBoxTicketBuff.edit') : t('page.manageSetting.settingBoxTicketBuff.create') }}</h3>
          <button class="btn-close" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>{{ t('page.manageSetting.settingBoxTicketBuff.form.type') }}</label>
            <select v-model="formData.type" class="form-select" :disabled="!!editingItem">
              <option :value="itemC.ITEM_TYPE_BOX_RANDOM">{{ typeLabels[itemC.ITEM_TYPE_BOX_RANDOM] }}</option>
              <option :value="itemC.ITEM_TYPE_TICKET">{{ typeLabels[itemC.ITEM_TYPE_TICKET] }}</option>
              <option :value="itemC.ITEM_TYPE_BUFF">{{ typeLabels[itemC.ITEM_TYPE_BUFF] }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>{{ t('page.manageSetting.settingBoxTicketBuff.form.name') }}</label>
            <input v-model="formData.name" type="text" class="form-input" required />
          </div>
          <div class="form-group">
            <label>{{ t('page.manageSetting.settingBoxTicketBuff.form.description') }}</label>
            <textarea v-model="formData.description" rows="2" class="form-input"></textarea>
          </div>
          <div class="form-group form-group--image">
            <label>{{ t('page.manageSetting.settingBoxTicketBuff.form.image') }}</label>
            <input type="file" accept="image/*" class="form-input" @change="handleImageChange" />
            <div v-if="formData.image_preview" class="image-preview image-preview--cover">
              <img :src="formData.image_preview" alt="Preview" />
            </div>
            <div v-else-if="editingItem?.image" class="image-preview image-preview--cover">
              <img :src="getImageDisplayUrl(editingItem.image)" alt="Current" />
            </div>
          </div>

          <!-- Box Random: rate_list (per item: rate + count) -->
          <template v-if="formData.type === itemC.ITEM_TYPE_BOX_RANDOM">
            <div class="form-section-block">
              <h4 class="form-section-title">{{ t('page.manageSetting.settingBoxTicketBuff.form.rateList') }}</h4>
              <div class="form-hint">{{ t('page.manageSetting.settingBoxTicketBuff.form.rateListHint') }}</div>
              <div v-for="(r, i) in formData.rate_list" :key="i" class="option-row">
                <select v-model.number="r.setting_item_id" class="form-select form-select--small">
                  <option :value="null">—</option>
                  <option v-for="item in zoneItems" :key="item.id" :value="item.id">{{ item.name }} ({{ item.type }})</option>
                </select>
                <input v-model.number="r.rate" type="number" min="0" step="1" class="form-input form-input--small" :placeholder="t('page.manageSetting.settingBoxTicketBuff.form.rate')" />
                <input v-model.number="r.count" type="number" min="1" max="99" class="form-input form-input--small" :placeholder="t('page.manageSetting.settingBoxTicketBuff.form.countPerItem')" />
                <button type="button" class="btn-icon btn-icon--danger" @click="formData.rate_list.splice(i, 1)" aria-label="Remove">×</button>
              </div>
              <button type="button" class="btn-outline btn-outline--small" @click="formData.rate_list.push({ setting_item_id: null, rate: 10, count: 1 })">
                + {{ t('page.manageSetting.settingBoxTicketBuff.form.addRate') }}
              </button>
            </div>
          </template>

          <!-- Buff: buff_type, value, duration -->
          <template v-if="formData.type === itemC.ITEM_TYPE_BUFF">
            <div class="form-section-block">
              <h4 class="form-section-title">{{ t('page.manageSetting.settingBoxTicketBuff.form.buffConfig') }}</h4>
              <div class="form-group">
                <label>{{ t('page.manageSetting.settingBoxTicketBuff.form.buffType') }}</label>
                <select v-model="formData.buff_type" class="form-select">
                  <option value="exp">{{ t('page.manageSetting.settingBoxTicketBuff.form.buffExp') }}</option>
                  <option value="coin">{{ t('page.manageSetting.settingBoxTicketBuff.form.buffCoin') }}</option>
                  <option value="ruby">{{ t('page.manageSetting.settingBoxTicketBuff.form.buffRuby') }}</option>
                  <option value="drop">{{ t('page.manageSetting.settingBoxTicketBuff.form.buffDrop') }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>{{ t('page.manageSetting.settingBoxTicketBuff.form.buffValue') }}</label>
                <input v-model.number="formData.buff_value" type="number" min="0" step="0.01" class="form-input form-input--small" />
              </div>
              <div class="form-group">
                <label>{{ t('page.manageSetting.settingBoxTicketBuff.form.buffDuration') }}</label>
                <input v-model.number="formData.buff_duration_minutes" type="number" min="1" class="form-input form-input--small" :placeholder="t('page.manageSetting.settingBoxTicketBuff.form.minutes')" />
              </div>
            </div>
          </template>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeModal">{{ t('page.manageSetting.settingStackBonuses.cancel') }}</button>
          <button class="btn-primary" :disabled="saving" @click="handleSave">
            {{ saving ? t('page.manageSetting.settingStackBonuses.saving') : t('page.manageSetting.settingStackBonuses.save') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { parsePaginatedResponse } from '../../../utils/settingApiResponse'
import { getItemConstants } from '../../../utils/constants'

const itemC = getItemConstants()
const translator = inject('translator', null)
const t = translator || ((key) => key)
const gameApi = inject('gameApi')
const showAlert = inject('showAlert', (msg) => alert(msg))

const loading = ref(false)
const error = ref(null)
const items = ref([])
const pagination = ref(null)
const showModal = ref(false)
const editingItem = ref(null)
const saving = ref(false)
const suggesting = ref(false)
const zoneItems = ref([])
const selectedImageFile = ref(null)

const typeLabels = {
  [itemC.ITEM_TYPE_BOX_RANDOM]: 'Box Random',
  [itemC.ITEM_TYPE_TICKET]: 'Ticket',
  [itemC.ITEM_TYPE_BUFF]: 'Buff Card',
}

function getImageDisplayUrl(url) {
  if (!url) return ''
  if (url.startsWith('http') || url.startsWith('data:')) return url
  return url
}

function handleImageChange(event) {
  const file = event.target.files?.[0]
  selectedImageFile.value = file || null
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      formData.value.image_preview = e.target?.result || null
    }
    reader.readAsDataURL(file)
  } else {
    formData.value.image_preview = null
  }
}

const defaultForm = () => ({
  type: itemC.ITEM_TYPE_BOX_RANDOM,
  name: '',
  description: '',
  image: '',
  image_preview: null,
  rate_list: [{ setting_item_id: null, rate: 10, count: 1 }],
  buff_type: 'exp',
  buff_value: 0,
  buff_duration_minutes: 60,
})

const formData = ref(defaultForm())
const filters = ref({ currentPage: 1, perPage: 11 })

async function loadZoneItems() {
  try {
    const res = await gameApi.getItemsForZone()
    if (res.data?.datas?.items) {
      zoneItems.value = res.data.datas.items
    }
  } catch (e) {
    console.error('Failed to load items', e)
  }
}

async function handleSuggest() {
  if (!gameApi || suggesting.value) return
  suggesting.value = true
  try {
    await gameApi.suggestSettingItems()
    showAlert(t('page.manageSetting.settingBoxTicketBuff.suggestSuccess') || 'Suggested box/ticket/buff items created.')
    loadItems()
  } catch (e) {
    showAlert(t('page.manageSetting.settingBoxTicketBuff.suggestFailed') || 'Failed to suggest: ' + (e.response?.data?.message || e.message))
  } finally {
    suggesting.value = false
  }
}

async function loadItems() {
  if (!gameApi) return
  loading.value = true
  error.value = null
  try {
    const res = await gameApi.getSettingItems({
      type: 'box_random,ticket,buff',
      currentPage: filters.value.currentPage,
      perPage: filters.value.perPage,
    })
    const data = res?.data?.datas?.setting_items
    if (data?.data) {
      items.value = data.data
      pagination.value = {
        current_page: data.current_page,
        last_page: data.last_page,
        total: data.total,
      }
    } else {
      const { list, pagination: p } = parsePaginatedResponse(res, 'setting_items')
      items.value = list ?? []
      pagination.value = p
    }
  } catch (e) {
    error.value = e.message || t('page.manageSetting.settingBoxTicketBuff.loadFailed')
  } finally {
    loading.value = false
  }
}

function changePage(page) {
  filters.value.currentPage = page
  loadItems()
}

function handleCreate() {
  editingItem.value = null
  formData.value = defaultForm()
  showModal.value = true
}

function handleEdit(row) {
  editingItem.value = row
  selectedImageFile.value = null
  const dp = row.default_property ?? {}
  formData.value = {
    type: row.type ?? itemC.ITEM_TYPE_BOX_RANDOM,
    name: row.name ?? '',
    description: row.description ?? '',
    image: row.image ?? '',
    image_preview: null,
    rate_list: Array.isArray(dp.rate_list) && dp.rate_list.length
      ? dp.rate_list.map((r) => ({ setting_item_id: r.setting_item_id ?? null, rate: r.rate ?? 10, count: Math.max(1, Math.min(99, Number(r.count) ?? 1)) }))
      : [{ setting_item_id: null, rate: 10, count: 1 }],
    buff_type: dp.buff_type ?? 'exp',
    buff_value: dp.buff_value ?? 0,
    buff_duration_minutes: dp.buff_duration_minutes ?? 60,
  }
  showModal.value = true
}

async function handleDelete(row) {
  if (!confirm(t('page.manageSetting.settingBoxTicketBuff.confirmDelete'))) return
  try {
    await gameApi.deleteSettingItem(row.id)
    if (items.value.length === 1 && filters.value.currentPage > 1) {
      filters.value.currentPage = 1
    }
    loadItems()
  } catch (e) {
    showAlert(t('page.manageSetting.settingBoxTicketBuff.deleteFailed'))
  }
}

function closeModal() {
  showModal.value = false
  selectedImageFile.value = null
}

async function handleSave() {
  if (!formData.value.name?.trim()) {
    showAlert(t('page.manageSetting.settingBoxTicketBuff.nameRequired'))
    return
  }
  saving.value = true
  try {
    let default_property = {}
    if (formData.value.type === itemC.ITEM_TYPE_BOX_RANDOM) {
      default_property = {
        rate_list: formData.value.rate_list
          .filter((r) => r.setting_item_id)
          .map((r) => ({
            setting_item_id: r.setting_item_id,
            rate: Number(r.rate) || 0,
            count: Math.max(1, Math.min(99, Number(r.count) || 1)),
          })),
      }
    } else if (formData.value.type === itemC.ITEM_TYPE_BUFF) {
      default_property = {
        buff_type: formData.value.buff_type || 'exp',
        buff_value: Number(formData.value.buff_value) || 0,
        buff_duration_minutes: Number(formData.value.buff_duration_minutes) || 60,
      }
    }
    const hasImageFile = !!selectedImageFile.value
    if (hasImageFile) {
      const fd = new FormData()
      fd.append('name', formData.value.name.trim())
      fd.append('description', formData.value.description || '')
      fd.append('type', formData.value.type)
      if (Object.keys(default_property).length) {
        fd.append('default_property', JSON.stringify(default_property))
      }
      fd.append('image', selectedImageFile.value)
      if (editingItem.value) {
        await gameApi.updateSettingItem(editingItem.value.id, fd)
      } else {
        await gameApi.createSettingItem(fd)
      }
    } else {
      const payload = {
        name: formData.value.name.trim(),
        description: formData.value.description || null,
        type: formData.value.type,
        default_property: Object.keys(default_property).length ? default_property : null,
      }
      // Only send image when it's a new file; when updating with no new file, omit image so backend keeps existing (backend expects file or omit, not URL string)
      if (!editingItem.value) {
        payload.image = null
      }
      if (editingItem.value) {
        await gameApi.updateSettingItem(editingItem.value.id, payload)
      } else {
        await gameApi.createSettingItem(payload)
      }
    }
    closeModal()
    selectedImageFile.value = null
    loadItems()
  } catch (e) {
    showAlert(t('page.manageSetting.settingBoxTicketBuff.saveFailed') + ': ' + (e.response?.data?.message || e.message))
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadZoneItems()
  loadItems()
})
</script>

<style scoped>
/* Same style as other setting pages */
.setting-box-ticket-buff-page { width: 100%; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
.page-header h2 { color: #d0d4d6; margin: 0; }
.header-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.loading, .error { padding: 20px; text-align: center; color: #d0d4d6; }
.table-container { overflow-x: auto; }
.settings-table { width: 100%; border-collapse: collapse; background: #253344; }
.settings-table th, .settings-table td { padding: 12px; text-align: left; border-bottom: 1px solid #1a2332; color: #d0d4d6; }
.settings-table th { background: #1a2332; color: #f6a901; }
.settings-table tbody tr:hover { background: #1a2332; }
.actions-cell { white-space: nowrap; }
.form-section-block { margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #253344; }
.form-section-title { color: #f6a901; font-size: 0.9rem; margin: 0 0 12px; }
.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 5px; color: #d0d4d6; }
.form-input, .form-select { width: 100%; padding: 8px 12px; background: #253344; border: 1px solid #1a2332; color: #d0d4d6; border-radius: 4px; }
.form-input--small { width: 80px; padding: 6px 8px; }
.form-select--small { min-width: 120px; padding: 6px 8px; }
.form-hint { font-size: 0.85rem; color: #8a9ba8; margin-top: 4px; margin-bottom: 8px; display: block; }
.option-row { display: flex; gap: 8px; margin-bottom: 8px; align-items: center; flex-wrap: wrap; }
.btn-icon { width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center; border: none; border-radius: 4px; cursor: pointer; flex-shrink: 0; background: #ff6b6b; color: white; font-size: 1.1rem; }
.btn-icon:hover { background: #ee5a5a; }
.btn-outline, .btn-outline--small { background: #253344; border: 1px solid #1a2332; color: #d0d4d6; padding: 8px 14px; border-radius: 4px; cursor: pointer; font-size: 14px; }
.btn-outline:hover { background: #1a2332; }
.btn-outline--small { padding: 6px 12px; font-size: 0.85rem; }
.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.modal-content { background: #2d3a4b; border: 1px solid #253344; width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto; padding: 0; }
.modal-content--wide { max-width: 640px; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid #253344; }
.modal-header h3 { margin: 0; color: #d0d4d6; }
.modal-body { padding: 20px; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 20px; border-top: 1px solid #253344; }
.btn-primary { background: #f6a901; color: #423714; border: none; padding: 8px 16px; cursor: pointer; border-radius: 4px; font-weight: 600; }
.btn-primary:hover:not(:disabled) { background: #f6f6f8; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-secondary { background: #253344; color: #d0d4d6; border: 1px solid #1a2332; padding: 8px 16px; cursor: pointer; border-radius: 4px; }
.btn-secondary:hover { background: #1a2332; }
.btn-close { background: transparent; border: none; color: #d0d4d6; font-size: 24px; padding: 0; width: 30px; height: 30px; line-height: 30px; cursor: pointer; }
.btn-edit, .btn-delete { padding: 6px 12px; margin-right: 5px; cursor: pointer; border-radius: 4px; border: none; font-size: 14px; }
.btn-edit { background: #4a90e2; color: white; }
.btn-edit:hover { background: #357abd; }
.btn-delete { background: #ff6b6b; color: white; }
.btn-delete:hover { background: #ee5a5a; }
.pagination { display: flex; justify-content: center; align-items: center; gap: 15px; margin-top: 20px; color: #d0d4d6; }
.pagination button { padding: 8px 16px; background: #253344; border: 1px solid #1a2332; color: #d0d4d6; cursor: pointer; border-radius: 4px; }
.pagination button:disabled { opacity: 0.5; cursor: not-allowed; }
.pagination button:not(:disabled):hover { background: #1a2332; }
.item-thumb { width: 40px; height: 40px; object-fit: contain; border-radius: 4px; vertical-align: middle; }
.form-group--image .image-preview--cover { height: 160px; max-height: 160px; margin-top: 8px; border-radius: 8px; overflow: hidden; display: flex; align-items: center; justify-content: center; background: #1a2332; border: 1px solid #253344; }
.form-group--image .image-preview--cover img { width: 100%; height: 100%; object-fit: cover; }
</style>
