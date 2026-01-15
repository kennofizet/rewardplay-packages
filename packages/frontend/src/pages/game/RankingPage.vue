<template>
  <div class="ranking-page">
    <div class="ranking-page__grid">
      <div class="ranking-page__main">
        <TopCoinCard 
          :top-users="topUsers" 
          :loading="isLoading"
          :error="hasError ? errorMessage : null"
          @period-change="handlePeriodChange"
          @retry="loadRankingData(true)"
        />
      </div>
      <div class="ranking-page__sidebar">
        <TopMeCard 
          :rank="myRank" 
          :coin="myCoin"
          :loading="isLoading"
          :error="hasError ? errorMessage : null"
          @retry="loadRankingData(true)"
        />
        <TopWeekCard 
          :top-three="topThree" 
          :remaining-players="remainingPlayers"
          :loading="isLoading"
          :error="hasError ? errorMessage : null"
          @retry="loadRankingData(true)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { inject } from 'vue'
import TopMeCard from '../../components/game/TopMeCard.vue'
import TopWeekCard from '../../components/game/TopWeekCard.vue'
import TopCoinCard from '../../components/game/TopCoinCard.vue'

const gameApi = inject('gameApi', null)
const translator = inject('translator', null)
const t = translator || ((key) => key)

const myRank = ref(0)
const myCoin = ref(0)
const topUsers = ref([])
const topWeek = ref([])
const isLoading = ref(true)
const hasError = ref(false)
const errorMessage = ref('')

const topThree = computed(() => {
  return topWeek.value.slice(0, 3)
})

const remainingPlayers = computed(() => {
  return topWeek.value.slice(3, 8)
})

const handlePeriodChange = (period) => {
  console.log('Period changed:', period)
  // Force refresh when period changes
  loadRankingData(true)
}

const CACHE_KEY = 'rewardplay_ranking_cache'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

const getCachedRanking = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null

    const { data, timestamp } = JSON.parse(cached)
    const now = Date.now()
    
    // Check if cache is still valid (within 5 minutes)
    if (now - timestamp < CACHE_DURATION) {
      return data
    } else {
      // Cache expired, remove it
      localStorage.removeItem(CACHE_KEY)
      return null
    }
  } catch (error) {
    console.error('Error reading cache:', error)
    localStorage.removeItem(CACHE_KEY)
    return null
  }
}

const setCachedRanking = (data) => {
  try {
    const cacheData = {
      data,
      timestamp: Date.now()
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
  } catch (error) {
    console.error('Error saving cache:', error)
  }
}

const loadRankingData = async (forceRefresh = false) => {
  if (!gameApi) {
    hasError.value = true
    errorMessage.value = t('page.ranking.errorApiNotAvailable')
    isLoading.value = false
    return
  }

  // Check cache first (unless forcing refresh)
  if (!forceRefresh) {
    const cachedData = getCachedRanking()
    if (cachedData) {
      myRank.value = cachedData.my_rank || 0
      myCoin.value = cachedData.my_coin || 0
      topUsers.value = cachedData.top_users || []
      topWeek.value = cachedData.top_week || []
      hasError.value = false
      isLoading.value = false
      // return
    }
  }

  isLoading.value = true
  hasError.value = false
  errorMessage.value = ''

  try {
    const response = await gameApi.getRanking()
    if (response.data && response.data.success && response.data.datas) {
      const ranking_data = response.data.datas
      myRank.value = ranking_data.my_rank || 0
      myCoin.value = ranking_data.my_coin || 0
      topUsers.value = ranking_data.top_users || []
      topWeek.value = ranking_data.top_week || []
      hasError.value = false
      
      // Cache the data
      setCachedRanking(ranking_data)
    } else {
      hasError.value = true
      errorMessage.value = t('page.ranking.error')
    }
  } catch (error) {
    console.error('Error loading ranking:', error)
    hasError.value = true
    errorMessage.value = error.response?.data?.message || error.message || t('page.ranking.errorGeneric')
    
    // Try to use cached data as fallback if available
    const cachedData = getCachedRanking()
    if (cachedData) {
      myRank.value = cachedData.my_rank || 0
      myCoin.value = cachedData.my_coin || 0
      topUsers.value = cachedData.top_users || []
      topWeek.value = cachedData.top_week || []
      hasError.value = false
      errorMessage.value = t('page.ranking.usingCachedData') + ' ' + errorMessage.value
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadRankingData()
})
</script>

<style scoped>
.ranking-page {
  color: var(--color);
  font-size: 1.6rem;
  font-family: 'Overpass Mono', system-ui;
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
}

.ranking-page__grid {
  display: grid;
  grid-template-columns: 8fr 4fr;
  gap: 20px;
}

.ranking-page__main {
  display: flex;
  flex-direction: column;
}

.ranking-page__sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 20px;
  height: fit-content;
}

</style>
