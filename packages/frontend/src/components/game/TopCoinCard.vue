<template>
  <TopCoinCardSkeleton v-if="loading" />
  <ErrorState v-else-if="error" :message="error" @retry="$emit('retry')" />
  <div v-else class="card top-coin-card">
    <div class="card__header">
      <h3 class="card__title">{{ t('component.topCoin.title') }}</h3>
      <CustomSelect
        v-model="selectedPeriod"
        :options="periodOptions"
        @change="handlePeriodChange"
        trigger-class="card__select"
      />
    </div>
    <div class="card__body">
      <ul class="list">
        <li class="list__header">
          <div class="list__grid">
            <div class="list__header-item">{{ t('component.topCoin.header.top') }}</div>
            <div class="list__header-item">{{ t('component.topCoin.header.member') }}</div>
            <div class="list__header-item">{{ t('component.topCoin.header.coin') }}</div>
          </div>
        </li>
        <RankingItem
          v-for="(user, index) in topUsers"
          :key="user.id || index"
          :rank="index + 1"
          :user="user"
        />
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, computed } from 'vue'
import RankingItem from './RankingItem.vue'
import CustomSelect from '../CustomSelect.vue'
import TopCoinCardSkeleton from './TopCoinCardSkeleton.vue'
import ErrorState from '../ui/ErrorState.vue'

const translator = inject('translator', null)
const t = translator || ((key) => key)

const props = defineProps({
  topUsers: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['period-change', 'retry'])

const selectedPeriod = ref('now')

const periodOptions = computed(() => [
  { value: 'now', label: t('component.topCoin.period.now') },
  { value: 'week', label: t('component.topCoin.period.week') },
  { value: 'month', label: t('component.topCoin.period.month') }
])

const handlePeriodChange = () => {
  emit('period-change', selectedPeriod.value)
}
</script>

<style scoped>
.card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
  border-radius: 16px;
  color: #fff;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.card__header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.card__title {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
  color: #fff;
  font-family: Nanami, sans-serif;
}

.card__select {
  width: auto;
  min-width: 120px;
}

.card__body {
  padding: 0;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list__header {
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.list__grid {
  display: grid;
  grid-template-columns: 60px 1fr auto;
  gap: 20px;
  align-items: center;
}

.list__header-item {
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 0.02em;
}

</style>
