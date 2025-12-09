<template>
  <div class="ranking-page">
    <!-- Loading State -->
    <div v-if="isLoading" class="ranking-page__loading">
      <div class="loading-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="31.416" stroke-dashoffset="31.416">
            <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416;0 31.416" repeatCount="indefinite"/>
            <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416;-31.416" repeatCount="indefinite"/>
          </circle>
        </svg>
      </div>
      <div class="loading-text">{{ t('page.ranking.loading') }}</div>
    </div>

    <!-- Error State -->
    <div v-else-if="hasError" class="ranking-page__error">
      <div class="error-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <path d="M12 8V12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M12 16H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <div class="error-text">{{ errorMessage }}</div>
      <button class="error-retry" @click="loadRankingData(true)">{{ t('page.ranking.retry') }}</button>
    </div>

    <!-- Content State -->
    <div v-else class="ranking-page__grid">
      <div class="ranking-page__main">
        <TopCoinCard :top-users="topUsers" @period-change="handlePeriodChange" />
      </div>
      <div class="ranking-page__sidebar">
        <TopMeCard :rank="myRank" :coin="myCoin" />
        <TopWeekCard :top-three="topThree" :remaining-players="remainingPlayers" />
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
    if (response.data && response.data.success && response.data.data) {
      const ranking_data = response.data.data
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
    errorMessage.value = error.response?.data?.error || error.message || t('page.ranking.errorGeneric')
    
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

.ranking-page__loading,
.ranking-page__error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 40px 20px;
  text-align: center;
}

.loading-icon,
.error-icon {
  margin-bottom: 20px;
  color: rgba(255, 255, 255, 0.8);
  animation: pulse 2s ease-in-out infinite;
}

.loading-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.loading-text,
.error-text {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 20px;
  font-weight: 500;
}

.error-icon {
  color: #ff6b6b;
}

.error-text {
  color: #ff6b6b;
  max-width: 500px;
}

.error-retry {
  background: linear-gradient(135deg, #ff8c00 0%, #ffa366 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 140, 66, 0.3);
}

.error-retry:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 140, 66, 0.4);
}

.error-retry:active {
  transform: translateY(0);
}
</style>
