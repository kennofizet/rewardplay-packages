<template>
  <div class="ranking-page">
    <div class="ranking-page__grid">
      <div class="ranking-page__main">
        <TopCoinCard
          :top-users="topUsersByMetric"
          :period="period"
          :metric="metric"
          :loading="isLoading"
          :error="hasError ? errorMessage : null"
          @period-change="handlePeriodChange"
          @metric-change="handleMetricChange"
          @retry="loadRankingData(period, true)"
        />
      </div>
      <div class="ranking-page__sidebar">
        <TopMeCard
          :rank="myRankByMetric"
          :coin="rankingData.my_coin"
          :level="rankingData.my_level"
          :power="rankingData.my_power"
          :loading="isLoading"
          :error="hasError ? errorMessage : null"
          @retry="loadRankingData(period, true)"
        />
        <TopWeekCard
          :top-three="topThree"
          :remaining-players="remainingPlayers"
          :value-key="metric"
          :loading="isLoading"
          :error="hasError ? errorMessage : null"
          @retry="loadRankingData(period, true)"
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

const period = ref('day')
const metric = ref('coin')
const rankingData = ref({
  period: 'day',
  period_key: '',
  top_coin: [],
  top_level: [],
  top_power: [],
  my_rank_coin: 0,
  my_rank_level: 0,
  my_rank_power: 0,
  my_coin: 0,
  my_level: 1,
  my_power: 0,
})
const isLoading = ref(true)
const hasError = ref(false)
const errorMessage = ref('')

const topUsersByMetric = computed(() => {
  const list = rankingData.value[`top_${metric.value}`]
  return Array.isArray(list) ? list : []
})

const myRankByMetric = computed(() => {
  const rank = rankingData.value[`my_rank_${metric.value}`]
  return typeof rank === 'number' ? rank : 0
})

const topThree = computed(() => topUsersByMetric.value.slice(0, 3))
const remainingPlayers = computed(() => topUsersByMetric.value.slice(3, 7))

const handlePeriodChange = (newPeriod) => {
  period.value = newPeriod
  loadRankingData(newPeriod, true)
}

const handleMetricChange = (newMetric) => {
  metric.value = newMetric
}

const CACHE_KEY_PREFIX = 'rewardplay_ranking_'
const CACHE_DURATION = 5 * 60 * 1000

function getCachedRanking(p) {
  try {
    const cached = localStorage.getItem(CACHE_KEY_PREFIX + p)
    if (!cached) return null
    const { data, timestamp } = JSON.parse(cached)
    if (Date.now() - timestamp < CACHE_DURATION) return data
    localStorage.removeItem(CACHE_KEY_PREFIX + p)
    return null
  } catch {
    localStorage.removeItem(CACHE_KEY_PREFIX + p)
    return null
  }
}

function setCachedRanking(p, data) {
  try {
    localStorage.setItem(CACHE_KEY_PREFIX + p, JSON.stringify({ data, timestamp: Date.now() }))
  } catch (e) {
    console.error('Error saving ranking cache', e)
  }
}

function applyRankingData(data) {
  if (!data) return
  rankingData.value = {
    period: data.period ?? 'day',
    period_key: data.period_key ?? '',
    top_coin: data.top_coin ?? [],
    top_level: data.top_level ?? [],
    top_power: data.top_power ?? [],
    my_rank_coin: data.my_rank_coin ?? 0,
    my_rank_level: data.my_rank_level ?? 0,
    my_rank_power: data.my_rank_power ?? 0,
    my_coin: data.my_coin ?? 0,
    my_level: data.my_level ?? 1,
    my_power: data.my_power ?? 0,
  }
}

const loadRankingData = async (p, forceRefresh = false) => {
  if (!gameApi) {
    hasError.value = true
    errorMessage.value = t('page.ranking.errorApiNotAvailable')
    isLoading.value = false
    return
  }

  if (!forceRefresh) {
    const cached = getCachedRanking(p)
    if (cached) {
      applyRankingData(cached)
      hasError.value = false
      isLoading.value = false
      return
    }
  }

  isLoading.value = true
  hasError.value = false
  errorMessage.value = ''

  try {
    const response = await gameApi.getRanking(p)
    if (response.data?.success && response.data?.datas) {
      applyRankingData(response.data.datas)
      setCachedRanking(p, response.data.datas)
      hasError.value = false
    } else {
      hasError.value = true
      errorMessage.value = t('page.ranking.error')
    }
  } catch (error) {
    console.error('Error loading ranking', error)
    hasError.value = true
    errorMessage.value = error.response?.data?.message || error.message || t('page.ranking.errorGeneric')
    const cached = getCachedRanking(p)
    if (cached) {
      applyRankingData(cached)
      hasError.value = false
      errorMessage.value = t('page.ranking.usingCachedData') + ' ' + errorMessage.value
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadRankingData(period.value)
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
