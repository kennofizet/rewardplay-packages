<template>
  <TopMeCardSkeleton v-if="loading" />
  <div v-else-if="error" class="card top-me-card error-state">
    <div class="error-content">
      <div class="error-icon">⚠️</div>
      <div class="error-message">{{ error }}</div>
      <button class="error-retry" @click="$emit('retry')">{{ t('page.ranking.retry') || 'Retry' }}</button>
    </div>
  </div>
  <div v-else class="card top-me-card">
    <div class="card__header">
      <span class="card__label">{{ t('component.topMe.title') }}</span>
    </div>
    <div class="card__metrics">
      <div class="metric">
        <div class="metric__label">{{ t('component.topMe.position') }}</div>
        <div class="metric__value">Top {{ rank }}</div>
      </div>
      <div class="metric">
        <div class="metric__label">{{ t('component.topMe.myCoin') }}</div>
        <div class="metric__value">{{ coin }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import TopMeCardSkeleton from './TopMeCardSkeleton.vue'

const props = defineProps({
  rank: {
    type: Number,
    default: 0,
  },
  coin: {
    type: Number,
    default: 0,
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

const translator = inject('translator', null)
const t = translator || ((key) => key)

defineEmits(['retry'])
</script>

<style scoped>
.card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
  border-radius: 16px;
  padding: 20px;
  color: #fff;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card__label {
  font-size: 1.2rem;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.8);
}

.card__metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.metric {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.metric__label {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 6px;
  letter-spacing: 0.04em;
}

.metric__value {
  font-size: 1.6rem;
  font-weight: 700;
  color: #ff8c00;
}

.error-state {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-content {
  text-align: center;
  padding: 20px;
}

.error-icon {
  font-size: 2rem;
  margin-bottom: 12px;
}

.error-message {
  color: #ff6b6b;
  font-size: 0.9rem;
  margin-bottom: 16px;
}

.error-retry {
  background: linear-gradient(135deg, #ff8c00 0%, #ffa366 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 140, 66, 0.3);
}

.error-retry:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 140, 66, 0.4);
}
</style>
