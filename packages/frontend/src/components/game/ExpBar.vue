<template>
  <div class="exp-bar-container">
    <div class="exp-bar-wrapper">
      <div class="exp-bar-background">
        <div 
          class="exp-bar-fill" 
          :style="{ width: expPercentage + '%' }"
        >
          <div class="exp-bar-shine"></div>
        </div>
      </div>
      <div class="exp-bar-text">
        <span class="exp-label">{{ t('component.bag.exp') }}</span>
        <span class="exp-value">{{ currentExp }} / {{ totalExpNeeded }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'

const translator = inject('translator', null)
const t = translator || ((key) => key)

const props = defineProps({
  currentExp: {
    type: Number,
    default: 0
  },
  totalExpNeeded: {
    type: Number,
    default: 100
  }
})

const expPercentage = computed(() => {
  if (props.totalExpNeeded <= 0) return 0
  const percentage = (props.currentExp / props.totalExpNeeded) * 100
  return Math.min(100, Math.max(0, percentage))
})
</script>

<style scoped>
.exp-bar-container {
  width: 50%;
  margin-left: 170px;
  margin-top: 20px;
  margin-bottom: 10px;
}

.exp-bar-wrapper {
  position: relative;
  width: 100%;
}

.exp-bar-background {
  width: 100%;
  height: 28px;
  background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1e 100%);
  border: 2px solid #4a4a6a;
  border-radius: 14px;
  box-shadow: 
    inset 0 2px 4px rgba(0, 0, 0, 0.5),
    0 2px 8px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

.exp-bar-fill {
  height: 100%;
  background: linear-gradient(180deg, #4a9eff 0%, #1e6fd9 50%, #0d4a9e 100%);
  border-radius: 12px;
  position: relative;
  transition: width 0.5s ease-out;
  box-shadow: 
    0 0 10px rgba(74, 158, 255, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  overflow: hidden;
}

.exp-bar-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%
  );
  animation: shine 3s infinite;
}

@keyframes shine {
  0% {
    left: -100%;
  }
  50% {
    left: 100%;
  }
  100% {
    left: 100%;
  }
}

.exp-bar-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 2;
  pointer-events: none;
  text-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.8),
    0 0 4px rgba(0, 0, 0, 0.6);
}

.exp-label {
  font-family: 'Nanami', sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.exp-value {
  font-family: 'Nanami', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #a8d5ff;
  letter-spacing: 0.5px;
}
</style>