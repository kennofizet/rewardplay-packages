<template>
  <div>
    <Sector 
      title="BONUS FOR EVERYDAY LOGIN"
      footer="Missing even a single day will drop your progress to basic level"
    >
      <div class="week-line">
        <WeekDay
          v-for="day in weekDays"
          :key="day.day"
          :title="`Day ${day.day}`"
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
    
    <Sector title="TODAYS REWARDS">
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
          :image-file="reward.imageFile"
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
    day: 'day 8',
    title: 'V-money',
    description: '+100 V-money',
    rarity: 'common',
    isCollected: true,
    imageType: 'coins',
    imageFile: 'coin.png'
  },
  {
    id: 2,
    day: 'day 9',
    title: 'Wing-Chest',
    description: 'acquire two common items and one rare weapon',
    rarity: 'rare',
    isCollected: true,
    imageType: 'chest',
    imageFile: 'box-coin.png'
  },
  {
    id: 3,
    day: 'day 10',
    title: 'V-money',
    description: '+250 V-money',
    rarity: 'common',
    isCollected: true,
    imageType: 'coins',
    imageFile: 'coin.png'
  },
  {
    id: 4,
    day: 'day 11',
    title: 'First-Aid',
    description: 'nicely looking upgrade to first aid backpack capacity',
    rarity: 'epic',
    isCurrent: true,
    isCollected: false,
    imageType: 'backpack',
    imageFile: 'bag.png'
  },
  {
    id: 5,
    day: 'day 12',
    title: 'V-money',
    description: '+500 V-money',
    rarity: 'common',
    isFeature: true,
    imageType: 'coins',
    imageFile: 'coin.png'
  },
  {
    id: 6,
    day: 'day 13',
    title: 'Wing-Chest',
    description: 'acquire two common items and one rare weapon',
    rarity: 'rare',
    isFeature: true,
    imageType: 'chest',
    imageFile: 'box-coin.png'
  },
  {
    id: 7,
    day: 'day 14',
    title: 'V-money',
    description: '+1000 V-money',
    rarity: 'common',
    isFeature: true,
    imageType: 'coins',
    imageFile: 'coin.png'
  },
  {
    id: 8,
    day: 'day 28',
    title: 'BOOM BOX',
    description: 'The BOOM BOX is an explosive weapon. Once thrown, it will begin to play music and emit powerful blasts that deal huge damage to all structures within its radius, but do not harm the player.',
    rarity: 'epic',
    isEpic: true,
    isFeature: true,
    epicTitle: 'EPIC REWARD',
    imageType: 'epic-chest',
    imageFile: 'gift.png'
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
