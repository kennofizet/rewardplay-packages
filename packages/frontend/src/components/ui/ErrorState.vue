<template>
  <div class="error-state">
    <div class="error-content">
      <div class="error-icon">⚠️</div>
      <div class="error-message">{{ message }}</div>
      <button class="error-retry" @click="$emit('retry')">{{ t('page.ranking.retry') }}</button>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'

const props = defineProps({
  message: { type: String, default: '' }
})

const translator = inject('translator', null)
const t = translator || ((key) => key)

defineEmits(['retry'])
</script>

<style scoped>
.error-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.error-content {
  text-align: center;
  padding: 20px;
}

.error-icon {
  font-size: 2.5rem;
  margin-bottom: 12px;
}

.error-message {
  color: #ff6b6b;
  font-size: 1rem;
  margin-bottom: 16px;
  background: rgba(255, 107, 107, 0.08);
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 107, 107, 0.18);
}

.error-retry {
  background: linear-gradient(135deg, #ff8c00 0%, #ffa366 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  font-size: 0.95rem;
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
