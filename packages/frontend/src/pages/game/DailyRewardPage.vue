<template>
  <div>
    <Sector 
      :title="t('component.dailyReward.bonusTitle')"
      :footer="t('component.dailyReward.bonusFooter')"
    >
      <div class="week-line">
        <WeekDay
          v-for="day in weekDays"
          :key="day.day"
          :title="`${t('component.dailyReward.day')} ${day.day}`"
          :is-completed="day.completed"
          :is-past="day.past"
          :is-current="day.current"
        >
          <RewardItem
            v-for="(reward, index) in day.rewards"
            :key="index"
            :text="reward"
          />
        </WeekDay>
      </div>
    </Sector>
    
    <Sector :title="t('component.dailyReward.monthlyRewards')">
      <div class="reward-grid">
        <RewardCard
          v-for="reward in rewards"
          :key="reward.id"
          :day-label="reward.day"
          :title="reward.title"
          :description="reward.description"
          :rarity="reward.rarity"
          :is-current="reward.isCurrent"
          :is-collected="reward.isCollected"
          :is-epic="reward.isEpic"
          :is-feature="reward.isFeature"
          :epic-title="reward.epicTitle"
          :image-type="reward.imageType"
          :image-key="reward.imageKey"
          @collect="handleCollect(reward)"
        />
      </div>
    </Sector>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, computed } from 'vue'
import Sector from '../../components/game/Sector.vue'
import WeekDay from '../../components/game/WeekDay.vue'
import RewardItem from '../../components/game/RewardItem.vue'
import RewardCard from '../../components/game/RewardCard.vue'

const gameApi = inject('gameApi', null)
const translator = inject('translator', null)
const t = translator || ((key) => key)

const selectedZone = ref(null)
const loading = ref(false)
const state = ref(null)

const weekDays = computed(() => {
    if (!state.value || !state.value.stack_bonuses) return []
    
    // Fixed 1-7 cycle
    const weeklyStreak = state.value.weekly_streak || 0
    const bonuses = state.value.stack_bonuses || {}

    return Array.from({length: 7}, (_, i) => {
        const dayNum = i + 1
        const bonus = bonuses[dayNum]
        const rewards = bonus?.rewards || []
        
        return {
            day: dayNum,
            completed: dayNum < weeklyStreak || (dayNum === weeklyStreak && state.value.is_claimed_today),
            past: dayNum < weeklyStreak,
            current: dayNum === weeklyStreak && !state.value.is_claimed_today,
            rewards: rewards.map(r => `${r.type} x${r.quantity}`)
        }
    })
})

const rewards = computed(() => {
    if (!state.value || !state.value.seven_days_rewards) return []

    // Get 7 days starting from today
    const sevenDays = state.value.seven_days_rewards.slice(0, 7)
    const nextRewardEpic = state.value.next_reward_epic || null
    if(nextRewardEpic){
      nextRewardEpic.isSpecific = true
      sevenDays.push(nextRewardEpic)
    }
    
    const weeklyStreak = state.value.weekly_streak || 1
    const bonuses = state.value.stack_bonuses || {}

    return sevenDays.map((r, index) => {
        const dateDate = new Date(r.date)
        let dayOfMonth = dateDate.getDate() // Actual day of month (1-31)
        if(r.isSpecific){
          dayOfMonth = dateDate.getDate() + ' / ' + dateDate.getMonth()+1
        }
        const dayNumInCycle = index + 1
        
        const isCurrent = dayNumInCycle === weeklyStreak && !r.claimed
        const isCollected = r.claimed
        
        const firstItem = r.items?.[0]
        const type = firstItem?.type || 'item'

        // Mix in stack bonus for this day in cycle
        const stackBonus = bonuses[dayNumInCycle]
        let extraInfo = ''
        if (stackBonus) {
            extraInfo = `+ ${stackBonus.name}`
        }
        
        return {
            id: r.id || index,
            original_date: r.date,
            day: `${t('component.dailyReward.day')} ${dayOfMonth}`, // Show actual day of month
            title: firstItem ? firstItem.type.toUpperCase() : 'REWARD',
            description: firstItem ? `x${firstItem.quantity} ${extraInfo}` : 'Daily Reward',
            rarity: r.is_epic ? 'epic' : (dayNumInCycle % 3 === 0 ? 'rare' : 'common'),
            isCurrent: isCurrent,
            isCollected: isCollected,
            isEpic: r.isSpecific || false, // Use is_epic from database
            isFeature: r.is_epic || false,
            imageType: type === 'coin' ? 'coins' : (type === 'exp' ? 'chest' : 'backpack'),
            imageKey: type === 'coin' ? 'global.coin' : null
        }
    })
})

const loadData = async () => {
    if(!gameApi) return
    loading.value = true
    try {
        const res = await gameApi.getPlayerDailyRewardState()
        // Expected response: { current_streak: 3, stack_config: {}, month_rewards: [] }
        state.value = res.data?.datas || {}
    } catch(e) {
        console.error(e)
    } finally {
        loading.value = false
    }
}

const handleCollect = async (reward) => {
  if (!gameApi) return
  
  try {
    const params = { reward_id: reward.id, date: reward.original_date } // Depends on backend requirement
    if (selectedZone.value) params.zone_id = selectedZone.value.id
    
    await gameApi.collectDailyReward()
    
    // Optimistic update or reload
    reward.isCollected = true
    reward.isCurrent = false
    loadData() // Reload to sync everything (e.g. stack might update)
  } catch (error) {
    console.error('Error collecting reward:', error)
  }
}

onMounted(async () => {
  try {
    const stored = localStorage.getItem('selected_zone')
    if (stored) {
      selectedZone.value = JSON.parse(stored)
      if (gameApi && gameApi.setZone) gameApi.setZone(selectedZone.value)
    }
  } catch (e) {}
  
  loadData()
})
</script>

<style scoped>
.week-line {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  gap: 15px;
  margin-top: 30px;
  margin-bottom: 30px;
}

.reward-grid {
  display: flex;
  flex-wrap: nowrap;
  gap: 20px;
  justify-content: space-between;
  align-items: flex-end; /* Align to bottom so bigger card grows upwards */
  margin-bottom: 80px;
  margin-top: 40px;
}

@media (max-width: 1200px) {
    .reward-grid {
        flex-wrap: wrap;
        justify-content: center;
    }
}

/* Custom scrollbar */
.week-line::-webkit-scrollbar, .reward-grid::-webkit-scrollbar {
  height: 6px;
}
.week-line::-webkit-scrollbar-track, .reward-grid::-webkit-scrollbar-track {
  background: rgba(255,255,255,0.05);
}
.week-line::-webkit-scrollbar-thumb, .reward-grid::-webkit-scrollbar-thumb {
  background: rgba(246,169, 1, 0.5);
  border-radius: 3px;
}
</style>
