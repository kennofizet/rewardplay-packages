<template>
  <div class="level-badge-container">
    <div class="level-badge">
      <div class="level-badge-inner">
        <span class="level-label">{{ t('component.bag.level') }}</span>
        <span class="level-value">{{ level }}</span>
      </div>
      <div class="level-badge-glow"></div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'

const translator = inject('translator', null)
const t = translator || ((key) => key)

const props = defineProps({
  level: {
    type: Number,
    default: 1
  }
})
</script>

<style scoped>
.level-badge-container {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 15;
}

.level-badge {
  position: relative;
  display: inline-block;
  padding: 8px 16px;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%);
  border: 2px solid #ffed4e;
  border-radius: 20px;
  box-shadow: 
    0 4px 12px rgba(255, 215, 0, 0.4),
    0 0 20px rgba(255, 215, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
  transform: perspective(100px) rotateX(5deg);
  animation: pulse 2s ease-in-out infinite;
}

.level-badge-inner {
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
  z-index: 2;
}

.level-label {
  font-family: 'Nanami', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #8b6914;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 
    0 1px 2px rgba(255, 255, 255, 0.5),
    0 -1px 2px rgba(139, 105, 20, 0.3);
}

.level-value {
  font-family: 'Nanami', sans-serif;
  font-size: 20px;
  font-weight: 900;
  color: #8b6914;
  text-shadow: 
    0 2px 4px rgba(255, 255, 255, 0.6),
    0 -1px 2px rgba(139, 105, 20, 0.4);
  line-height: 1;
}

.level-badge-glow {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(135deg, #ffd700, #ffed4e, #ffd700);
  border-radius: 22px;
  opacity: 0.6;
  filter: blur(8px);
  z-index: 1;
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes pulse {
  0%, 100% {
    transform: perspective(100px) rotateX(5deg) scale(1);
  }
  50% {
    transform: perspective(100px) rotateX(5deg) scale(1.05);
  }
}

@keyframes glow {
  0% {
    opacity: 0.4;
  }
  100% {
    opacity: 0.8;
  }
}
</style>