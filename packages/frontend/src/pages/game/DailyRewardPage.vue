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
    
    <Sector :title="t('component.dailyReward.todaysRewards')">
      <div class="reward-line">
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
import { ref, inject } from 'vue'
import Sector from '../../components/game/Sector.vue'
import WeekDay from '../../components/game/WeekDay.vue'
import RewardItem from '../../components/game/RewardItem.vue'
import RewardCard from '../../components/game/RewardCard.vue'

const gameApi = inject('gameApi', null)
const translator = inject('translator', null)
const t = translator || ((key) => key)

const weekDays = ref([
  { day: 1, completed: true, past: true, current: false, rewards: [] },
  { day: 2, completed: true, past: false, current: true, rewards: ['+5% V-money'] },
  { day: 3, completed: false, past: false, current: false, rewards: ['+5% V-money', '+5% daily limit'] },
  { day: 4, completed: false, past: false, current: false, rewards: ['+5% V-money', '+10% daily limit', '+5% EXP'] },
  { day: 5, completed: false, past: false, current: false, rewards: ['+15% V-money', '+10% daily limit', '+5% EXP'] },
  { day: 6, completed: false, past: false, current: false, rewards: ['+15% V-money', '+10% daily limit', '+15% EXP'] },
  { day: 7, completed: false, past: false, current: false, rewards: ['+15% V-money', '+30% daily limit', '+15% EXP'] }
])

const rewards = ref([
  {
    id: 1,
    day: `${t('component.dailyReward.day')} 8`,
    title: 'V-money',
    description: '+100 V-money',
    rarity: 'common',
    isCollected: true,
    imageType: 'coins',
    imageKey: 'global.coin'
  },
  {
    id: 2,
    day: `${t('component.dailyReward.day')} 9`,
    title: 'Wing-Chest',
    description: 'acquire two common items and one rare weapon',
    rarity: 'rare',
    isCollected: true,
    imageType: 'chest',
    imageKey: 'global.box_coin'
  },
  {
    id: 3,
    day: 'day 10',
    title: 'V-money',
    description: '+250 V-money',
    rarity: 'common',
    isCollected: true,
    imageType: 'coins',
    imageKey: 'global.coin'
  },
  {
    id: 4,
    day: `${t('component.dailyReward.day')} 11`,
    title: 'First-Aid',
    description: 'nicely looking upgrade to first aid backpack capacity',
    rarity: 'epic',
    isCurrent: true,
    isCollected: false,
    imageType: 'backpack',
    imageKey: 'bag.bag'
  },
  {
    id: 5,
    day: `${t('component.dailyReward.day')} 12`,
    title: 'V-money',
    description: '+500 V-money',
    rarity: 'common',
    isFeature: true,
    imageType: 'coins',
    imageKey: 'global.coin'
  },
  {
    id: 6,
    day: `${t('component.dailyReward.day')} 13`,
    title: 'Wing-Chest',
    description: 'acquire two common items and one rare weapon',
    rarity: 'rare',
    isFeature: true,
    imageType: 'chest',
    imageKey: 'global.box_coin'
  },
  {
    id: 7,
    day: 'day 14',
    title: 'V-money',
    description: '+1000 V-money',
    rarity: 'common',
    isFeature: true,
    imageType: 'coins',
    imageKey: 'global.coin'
  },
  {
    id: 8,
    day: `${t('component.dailyReward.day')} 28`,
    title: 'BOOM BOX',
    description: 'The BOOM BOX is an explosive weapon. Once thrown, it will begin to play music and emit powerful blasts that deal huge damage to all structures within its radius, but do not harm the player.',
    rarity: 'epic',
    isEpic: true,
    isFeature: true,
    epicTitle: t('component.dailyReward.epicReward'),
    imageType: 'epic-chest',
    imageKey: 'global.epic_chest'
  }
])

const handleCollect = async (reward) => {
  if (!gameApi) {
    console.error('Game API not available')
    return
  }
  
  try {
    // TODO: Call API to collect reward
    // const response = await gameApi.collectDailyReward(reward.id)
    reward.isCollected = true
    reward.isCurrent = false
  } catch (error) {
    console.error('Error collecting reward:', error)
  }
}
</script>

<style scoped>
.week-line {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  margin-top: 30px;
  margin-bottom: 10px;
}

.reward-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 60px;
  margin-top: 128px;
}
</style>
