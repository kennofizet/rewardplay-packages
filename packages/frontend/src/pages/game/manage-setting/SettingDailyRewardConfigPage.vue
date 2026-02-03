<template>
  <div class="setting-daily-reward-page">
    <div class="page-header">
      <h2>{{ t('page.manageSetting.settingDailyRewards.title') }}</h2>
    </div>

    <div class="controls">
       <button @click="prevMonth" class="btn-nav">&lt; {{ t('page.manageSetting.settingDailyRewards.prev') }}</button>
       <span class="month-label">{{ currentYear }} - {{ currentMonth }}</span>
       <button @click="nextMonth" class="btn-nav">{{ t('page.manageSetting.settingDailyRewards.next') }} &gt;</button>
       <button class="btn-primary" @click="suggestData">{{ t('page.manageSetting.settingDailyRewards.suggest') }}</button>
    </div>

    <div class="calendar-grid">
       <div v-for="day in daysInMonth" :key="day" class="calendar-day">
          <div class="day-header">
             <div class="day-number" @click="openDay(day)">{{ day }}</div>
             <div class="star-toggle" @click.stop="toggleEpic(day)" :class="{ 'is-epic': isEpicDay(day) }">
                ★
             </div>
          </div>
          <div class="day-content" @click="openDay(day)">
             <div v-if="getRewardForDay(day) && getRewardForDay(day).items && getRewardForDay(day).items.length">
                <div v-for="(item, idx) in getRewardForDay(day).items" :key="idx" class="reward-tag">
                   {{ item.actions?.is_gear ? getItemName(item.item_id) : item.type }} x{{ item.quantity }}
                </div>
             </div>
             <span v-else class="empty">-</span>
          </div>
       </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3>{{ t('page.manageSetting.settingDailyRewards.editDay') }} {{ selectedDay }} / {{ currentMonth }} / {{ currentYear }}</h3>
        
        <div class="modal-body">
            <div class="item-list">
                <div v-for="(item, index) in editingItems" :key="index" class="item-row">
                    <div class="input-group">
                        <label>{{ t('page.manageSetting.settingDailyRewards.form.type') }}</label>
                        <select v-model="item.type">
                            <option v-for="(label, type) in rewardTypes" :key="type" :value="type">{{ label }}</option>
                        </select>
                    </div>

                    <div class="input-group" v-if="item.actions?.is_gear">
                        <label>{{ t('page.manageSetting.settingDailyRewards.form.item') }}</label>
                        <select v-model="item.item_id">
                            <option v-for="i in availableItems" :key="i.id" :value="i.id">{{ i.name }}</option>
                        </select>
                    </div>

                    <div class="input-group">
                        <label>{{ t('page.manageSetting.settingDailyRewards.form.qty') }}</label>
                        <input type="number" v-model.number="item.quantity" min="1" />
                    </div>
                    
                    <button class="btn-danger small" @click="removeItem(index)">x</button>
                </div>
            </div>
            <button class="btn-secondary small" @click="addItem">{{ t('page.manageSetting.settingDailyRewards.form.addItem') }}</button>
        </div>
        
        <div class="modal-footer">
           <button class="btn-secondary" @click="closeModal">{{ t('page.manageSetting.settingDailyRewards.cancel') }}</button>
           <button class="btn-primary" @click="saveDay">{{ t('page.manageSetting.settingDailyRewards.save') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { useTimezone } from '../../../composables/useTimezone'
const translator = inject('translator', null)
const t = translator || ((key) => key)

const gameApi = inject('gameApi')
const { formatDate } = useTimezone()
const currentYear = ref(2026)
const currentMonth = ref(1)
const showModal = ref(false)
const selectedDay = ref(1)
const rewards = ref({}) 
const loading = ref(false)
const availableItems = ref([])
const editingItems = ref([])
const rewardTypes = ref([])

const daysInMonth = computed(() => {
    return new Date(currentYear.value, currentMonth.value, 0).getDate();
})

const getItemName = (id) => {
    const item = availableItems.value.find(i => i.id === id)
    return item ? item.name : t('page.manageSetting.settingDailyRewards.messages.unknownItem')
}

const loadItems = async () => {
    try {
        const res = await gameApi.getSettingItems({ limit: 1000 })
        // Adapt based on actual response structure
        if (res.data?.datas?.setting_items?.data) {
            availableItems.value = res.data.datas.setting_items.data
        } else if (res.data?.datas?.setting_items) {
            availableItems.value = res.data.datas.setting_items
        }
    } catch (e) {
        console.error("Failed to load items", e)
    }
}

const loadRewardTypes = async () => {
    try {
        const res = await gameApi.getRewardTypes('daily_reward')
        if (res.data?.datas?.reward_types) {
            rewardTypes.value = res.data.datas.reward_types
        }
    } catch (e) {
        console.error("Failed to load reward types", e)
    }
}

const loadRewards = async () => {
    if (!gameApi) return
    loading.value = true
    try {
        // Need to zero-pad month/day if backend expects strictly ISO date parts or handled by generic date parsing?
        // Usually plain int works if backend handles it.
        const res = await gameApi.getDailyRewardConfigs({ year: currentYear.value, month: currentMonth.value })
        const rewardList = res.data?.datas?.rewards?.data || []
        const map = {}
        rewardList.forEach(r => {
            const day = new Date(r.date).getDate()
            map[day] = r
        })
        rewards.value = map
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
}

const prevMonth = () => {
    if(currentMonth.value === 1) { currentMonth.value = 12; currentYear.value--; }
    else { currentMonth.value--; }
    loadRewards()
}

const nextMonth = () => {
    if(currentMonth.value === 12) { currentMonth.value = 1; currentYear.value++; }
    else { currentMonth.value++; }
    loadRewards()
}

const openDay = (day) => {
    selectedDay.value = day
    const existing = rewards.value[day]
    if (existing && existing.items) {
        // Deep copy items
        editingItems.value = JSON.parse(JSON.stringify(existing.items))
    } else {
        editingItems.value = []
    }
    showModal.value = true
}

const getRewardForDay = (day) => {
    return rewards.value[day]
}

const isEpicDay = (day) => {
    const reward = rewards.value[day]
    return reward?.is_epic || false
}

const toggleEpic = async (day) => {
    const dateStr = `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const existing = rewards.value[day]
    const newEpicStatus = !isEpicDay(day)
    
    try {
        await gameApi.saveDailyRewardConfig({
            date: dateStr,
            items: existing?.items || [],
            stack_bonuses: existing?.stack_bonuses || [],
            is_epic: newEpicStatus
        })
        await loadRewards()
    } catch (e) {
        alert('Failed to toggle epic status')
        console.error(e)
    }
}

const closeModal = () => showModal.value = false

const addItem = () => {
    editingItems.value.push({ type: 'coin', quantity: 100, item_id: null })
}

const removeItem = (index) => {
    editingItems.value.splice(index, 1)
}

const saveDay = async () => {
    const dateStr = `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}-${String(selectedDay.value).padStart(2, '0')}`
    try {
        await gameApi.saveDailyRewardConfig({
            date: dateStr,
            items: editingItems.value,
            stack_bonuses: [] // not editing stack bonuses per day for now
        })
        closeModal()
        loadRewards()
    } catch (e) {
        alert(t('page.manageSetting.settingDailyRewards.messages.saveFailed'))
        console.error(e)
    }
}

const suggestData = async () => {
    if (loading.value) return
    loading.value = true
    try {
        await gameApi.suggestDailyRewards({ year: currentYear.value, month: currentMonth.value })
        await loadRewards()
        alert(t('page.manageSetting.settingDailyRewards.messages.suggestSuccess'))
    } catch(e) {
        alert(t('page.manageSetting.settingDailyRewards.messages.suggestFailed') + ': ' + (e.response?.data?.message || e.message))
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    // Use timezone-aware current date
    const now = new Date()
    currentYear.value = parseInt(formatDate(now, { year: 'numeric' }))
    currentMonth.value = parseInt(formatDate(now, { month: 'numeric' }))
    loadRewardTypes()
    loadItems()
    loadRewards()
})
</script>

<style scoped>
.setting-daily-reward-page { width: 100%; color: #d0d4d6; }
.page-header { margin-bottom: 20px; }
.controls { display: flex; gap: 10px; align-items: center; margin-bottom: 20px; }
.btn-nav { padding: 5px 10px; background: #2f3e52; border: 1px solid #4a5b70; color: white; cursor: pointer; }
.month-label { font-weight: bold; min-width: 100px; text-align: center; }

.calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; }
.calendar-day { background: #253344; min-height: 100px; padding: 8px; border: 1px solid #1a2332; cursor: pointer; border-radius: 4px; transition: background 0.2s; }
.calendar-day:hover { background: #2f3e52; border-color: #f6a901; }
.day-number { font-weight: bold; margin-bottom: 5px; color: #f6a901; font-size: 0.9em; }
.day-content { font-size: 0.8em; }
.reward-tag { background: #1a2332; padding: 2px 4px; border-radius: 2px; margin-bottom: 2px; font-size: 0.75em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.empty { color: #4a5b70; }

.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.modal-content { background: #253344; padding: 20px; border-radius: 8px; width: 450px; border: 1px solid #4a5b70; max-height: 80vh; overflow-y: auto; }
.modal-body { margin-bottom: 20px; }
.item-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 10px; }
.item-row { display: flex; gap: 8px; align-items: flex-end; background: #1f2a38; padding: 8px; border-radius: 4px; }
.input-group { display: flex; flex-direction: column; gap: 2px; flex: 1; }
.input-group label { font-size: 0.7em; color: #8a9bb0; }
.input-group select, .input-group input { background: #1a2332; border: 1px solid #4a5b70; color: white; padding: 4px; border-radius: 4px; width: 100%; }
.btn-primary { background: #f6a901; border: none; padding: 8px 16px; color: #1a2332; font-weight: 600; cursor: pointer; border-radius: 4px; }
.btn-secondary { background: #2f3e52; border: 1px solid #4a5b70; color: #d0d4d6; padding: 8px 16px; cursor: pointer; border-radius: 4px; }
.btn-danger { background: #e74c3c; border: none; color: white; padding: 4px 8px; cursor: pointer; border-radius: 4px; }
.btn-danger.small { padding: 2px 6px; font-size: 0.8em; align-self: center; }
.btn-secondary.small { padding: 4px 8px; font-size: 0.9em; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid #4a5b70; padding-top: 15px; }

.calendar-day { position: relative; }
.star-toggle{ position: absolute; top: 6px; right: 6px; }
.star-toggle.is-epic { color: gold; }
</style>
