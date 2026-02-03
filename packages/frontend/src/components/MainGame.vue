<template>
  <GameLayout 
    :rotate="rotate"
    :is-manager="isManager"
    @page-change="handlePageChange"
    @icon-click="handleIconClick"
  >
    <component :is="currentPage" />
    <template #overlay>
      <EventsPopup
        v-if="showEventsPopup && activeEvents.length > 0"
        :events="activeEvents"
        @close="showEventsPopup = false"
      />
    </template>
  </GameLayout>
</template>

<script setup>
import { ref, shallowRef, onMounted, inject } from 'vue'
import GameLayout from './game/GameLayout.vue'
import EventsPopup from './game/EventsPopup.vue'
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
  },
  isManager: {
    type: Boolean,
    default: false
  }
})

const pageMap = {
  'reward': DailyRewardPage,
  'bag': BagGearPage,
  'lucky-wheel': LuckyWheelPage,
  'ranking': RankingPage,
  'rules': ComingSoonPage,
  'shop': ShopPage,
  'manage-setting': ManageSettingPage
}

const currentPage = shallowRef(DailyRewardPage) // Default to DailyReward
const showEventsPopup = ref(false)
const activeEvents = ref([])
const gameApi = inject('gameApi', null)

onMounted(async () => {
  if (gameApi) {
    try {
      const res = await gameApi.getPlayerEvents()
      const list = res?.data?.datas?.events ?? []
      activeEvents.value = Array.isArray(list) ? list : []
      if (activeEvents.value.length > 0) {
        showEventsPopup.value = true
      }
    } catch (e) {
      activeEvents.value = []
    }
  }
})

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
}
</script>

<style scoped>
/* Styles are in GameLayout component */
</style>
