<template>
  <GameLayout 
    :rotate="rotate"
    @page-change="handlePageChange"
    @icon-click="handleIconClick"
  >
    <component :is="currentPage" />
  </GameLayout>
</template>

<script setup>
import { ref, shallowRef } from 'vue'
import GameLayout from './game/GameLayout.vue'
import DailyRewardPage from '../pages/game/DailyRewardPage.vue'
import BagGearPage from '../pages/game/BagGearPage.vue'
import LuckyWheelPage from '../pages/game/LuckyWheelPage.vue'
import RankingPage from '../pages/game/RankingPage.vue'
import RulesPage from '../pages/game/RulesPage.vue'
import ShopPage from '../pages/game/ShopPage.vue'
import ComingSoonPage from '../pages/ComingSoonPage.vue'
import ManageSettingPage from '../pages/game/ManageSettingPage.vue'

const props = defineProps({
  rotate: {
    type: Boolean,
    default: true
  }
})

const pageMap = {
  'reward': DailyRewardPage,
  'bag': BagGearPage,
  'lucky-wheel': LuckyWheelPage,
  'ranking': RankingPage,
  'rules': ComingSoonPage,
  'shop': ComingSoonPage,
  'manage-setting': ManageSettingPage
}

const currentPage = shallowRef(DailyRewardPage) // Default to DailyReward

const handlePageChange = (page) => {
  if (page === 'back') {
    // Handle back navigation
    return
  }
  
  if (pageMap[page]) {
    const pageComponent = pageMap[page]
    if (typeof pageComponent === 'function') {
      // Lazy load component
      pageComponent().then(module => {
        currentPage.value = module.default || module
      })
    } else {
      currentPage.value = pageComponent
    }
  }
}

const handleIconClick = (icon) => {
  // Handle icon clicks (notifications, settings, etc.)
  console.log('Icon clicked:', icon)
}
</script>

<style scoped>
/* Styles are in GameLayout component */
</style>
