<template>
  <div 
    class="custom-option-display"
    :title="tooltipText"
  >
    <span class="custom-option-name">{{ name }}</span>
    <span class="custom-option-info">{{ statsCount }} {{ statsLabel }}</span>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  properties: {
    type: Object,
    default: () => ({})
  },
  statsLabel: {
    type: String,
    default: 'stats'
  }
})

const statsCount = computed(() => {
  return Object.keys(props.properties || {}).length
})

const tooltipText = computed(() => {
  if (!props.properties || Object.keys(props.properties).length === 0) {
    return props.name
  }
  
  // Format properties for tooltip display
  const statsList = Object.entries(props.properties)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')
  
  return `${props.name}\n\n${statsList}`
})
</script>

<style scoped>
.custom-option-display {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  background: #1a2332;
  border: 1px solid #253344;
  border-radius: 4px;
  cursor: help;
  white-space: nowrap;
}

.custom-option-display.property-display {
  min-width: 0;
}

.custom-option-name {
  font-weight: 600;
  color: #f6a901;
  font-size: 14px;
  margin-right: 8px;
}

.custom-option-info {
  font-size: 11px;
  color: #8a9196;
  flex-shrink: 0;
}
</style>
