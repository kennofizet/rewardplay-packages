<template>
  <div class="reward-items-tooltip-wrapper" @mouseenter="showTooltip" @mouseleave="hideTooltip" @click="toggleTooltip">
    <slot></slot>
    <Teleport to="body" v-if="isVisible && isClicked">
      <div 
        class="reward-items-tooltip tooltip-clicked"
        :style="{ left: clickPosition.x + 'px', top: (clickPosition.y - 20) + 'px' }"
        @click.stop
      >
        <div class="tooltip-header">{{ t('component.dailyReward.allItems') || 'All Items' }}</div>
        <div class="tooltip-items">
          <div 
            v-for="(item, index) in allItems" 
            :key="index" 
            class="tooltip-item"
          >
            {{ formatItem(item) }}
          </div>
        </div>
      </div>
    </Teleport>
    <div 
      v-if="isVisible && !isClicked" 
      class="reward-items-tooltip"
      @click.stop
    >
      <div class="tooltip-header">{{ t('component.dailyReward.allItems') || 'All Items' }}</div>
      <div class="tooltip-items">
        <div 
          v-for="(item, index) in allItems" 
          :key="index" 
          class="tooltip-item"
        >
          {{ formatItem(item) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, onUnmounted } from 'vue'

const translator = inject('translator', null)
const t = translator || ((key) => key)

const props = defineProps({
  allItems: {
    type: Array,
    required: true
  },
  trigger: {
    type: String,
    default: 'hover', // 'hover', 'click', or 'both'
    validator: (value) => ['hover', 'click', 'both'].includes(value)
  }
})

const isVisible = ref(false)
const isClicked = ref(false)
const clickPosition = ref({ x: 0, y: 0 })

const formatItem = (item) => {
  if (typeof item === 'string') {
    return item
  }
  if (item.type && item.quantity !== undefined) {
    return `${item.type} x${item.quantity}`
  }
  return JSON.stringify(item)
}

const showTooltip = () => {
  if (props.trigger === 'hover' || props.trigger === 'both') {
    isVisible.value = true
  }
}

const hideTooltip = () => {
  if (props.trigger === 'hover' || props.trigger === 'both') {
    if (!isClicked.value) {
      isVisible.value = false
    }
  }
}

const toggleTooltip = (event) => {
  // if (props.trigger === 'click' || props.trigger === 'both') {
  //   event.stopPropagation()
  //   if (!isClicked.value) {
  //     // Store click position for fixed positioning
  //     clickPosition.value = {
  //       x: event.clientX,
  //       y: event.clientY
  //     }
  //   }
  //   isClicked.value = !isClicked.value
  //   isVisible.value = isClicked.value
  // }
}

// Close tooltip when clicking outside
const handleClickOutside = (event) => {
  if (isClicked.value && !event.target.closest('.reward-items-tooltip-wrapper')) {
    isClicked.value = false
    isVisible.value = false
  }
}

// Add click outside listener when clicked
onMounted(() => {
  if (props.trigger === 'click' || props.trigger === 'both') {
    document.addEventListener('click', handleClickOutside)
  }
})

onUnmounted(() => {
  if (props.trigger === 'click' || props.trigger === 'both') {
    document.removeEventListener('click', handleClickOutside)
  }
})
</script>

<style scoped>
.reward-items-tooltip-wrapper {
  position: relative;
  display: inline-block;
}

.reward-items-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
  background: rgba(0, 0, 0, 0.95);
  border: 2px solid #f6a901;
  border-radius: 8px;
  padding: 12px;
  min-width: 200px;
  max-width: 300px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  pointer-events: auto;
}

.reward-items-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 8px solid transparent;
  border-top-color: #f6a901;
}

.tooltip-header {
  font-family: Nanami, sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #f6a901;
  text-transform: uppercase;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(246, 169, 1, 0.3);
  text-align: center;
}

.tooltip-items {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 300px;
  overflow-y: auto;
}

.tooltip-item {
  font-family: Nanami, sans-serif;
  font-size: 13px;
  color: #fff;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  text-align: center;
}

.tooltip-item:hover {
  background: rgba(246, 169, 1, 0.2);
}

.tooltip-clicked {
  position: fixed;
  transform: translate(-50%, -100%);
  margin-bottom: 0;
  margin-top: -8px;
  z-index: 10000;
}

/* Custom scrollbar for tooltip */
.tooltip-items::-webkit-scrollbar {
  width: 6px;
}

.tooltip-items::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.tooltip-items::-webkit-scrollbar-thumb {
  background: rgba(246, 169, 1, 0.5);
  border-radius: 3px;
}

.tooltip-items::-webkit-scrollbar-thumb:hover {
  background: rgba(246, 169, 1, 0.7);
}
</style>
