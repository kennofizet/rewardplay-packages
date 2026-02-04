<template>
  <div class="bonus-section">
    <label>{{ label }}</label>
    <div class="bonus-list">
      <div 
        v-for="(bonus, index) in bonuses" 
        :key="index"
        class="bonus-item"
      >
        <template v-if="bonus.type === 'custom_option' && bonus.name">
          <!-- Show display component for custom options (snapshot) -->
          <CustomOptionDisplay
            :name="bonus.name"
            :properties="bonus.properties || {}"
            :stats-label="t('page.manageSetting.settingItems.stats')"
            class="bonus-custom-display"
          />
        </template>
        <template v-else>
          <!-- Show unified selector for stats or when nothing selected yet -->
          <CustomSelect
            v-model="bonus.selectedValue"
            :options="unifiedOptions"
            :placeholder="selectKeyPlaceholder"
            @change="handleKeyChange(index)"
            trigger-class="bonus-key-select"
          />
          <input 
            v-if="bonus.type === 'stat' && bonus.selectedValue"
            v-model.number="bonus.value"
            type="number"
            step="0.01"
            :placeholder="valuePlaceholder"
            class="bonus-value-input"
          />
        </template>
        <button 
          type="button"
          class="btn-remove-bonus"
          @click="handleRemove(index)"
          :title="removeLabel"
        >
          ×
        </button>
      </div>
      <button 
        type="button"
        class="btn-add-bonus"
        @click="handleAdd"
      >
        <span class="btn-add-icon">+</span>
        <span>{{ addOptionLabel }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { inject, computed } from 'vue'
import CustomSelect from './CustomSelect.vue'
import CustomOptionDisplay from './CustomOptionDisplay.vue'

const translator = inject('translator', null)
const t = translator || ((key) => key)

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  bonuses: {
    type: Array,
    required: true
  },
  bonusKeyOptions: {
    type: Array,
    required: true
  },
  customOptionOptions: {
    type: Array,
    default: () => []
  },
  selectKeyPlaceholder: {
    type: String,
    default: 'Select Key'
  },
  valuePlaceholder: {
    type: String,
    default: 'Value'
  },
  addOptionLabel: {
    type: String,
    default: 'Add Option'
  },
  removeLabel: {
    type: String,
    default: 'Remove'
  }
})

const emit = defineEmits(['add', 'remove', 'key-change'])

// Unified options combining stats and custom options
const unifiedOptions = computed(() => {
  const options = []
  
  // Add regular stats
  props.bonusKeyOptions.forEach(stat => {
    options.push({
      value: stat.value,
      label: stat.label,
      type: 'stat',
      isCustom: false
    })
  })
  
  // Add custom options
  props.customOptionOptions.forEach(customOption => {
    options.push({
      value: customOption.value,
      label: customOption.label,
      type: 'custom_option',
      isCustom: true,
      properties: customOption.properties
    })
  })
  
  return options
})

const handleAdd = () => {
  emit('add')
}

const handleRemove = (index) => {
  emit('remove', index)
}

const handleKeyChange = (index) => {
  emit('key-change', index)
}
</script>

<style scoped>
.bonus-section {
  display: flex;
  flex-direction: column;
}

.bonus-section label {
  margin-bottom: 5px;
  font-size: 13px;
  color: #d0d4d6;
  font-weight: 500;
}

.bonus-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bonus-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.bonus-key-select {
  flex: 1;
  min-width: 0;
}

.bonus-value-input {
  flex: 1;
  min-width: 0;
  padding: 8px 10px;
  background: #253344;
  border: 1px solid #1a2332;
  color: #d0d4d6;
  font-size: 14px;
}

.bonus-custom-value {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 10px;
  background: #1a2332;
  border: 1px solid #253344;
  border-radius: 4px;
  cursor: help;
}

.custom-value-label {
  font-size: 12px;
  color: #f6a901;
  font-weight: 500;
}

.custom-value-count {
  font-size: 11px;
  color: #999;
}

.btn-remove-bonus {
  padding: 8px 12px;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  transition: background 0.2s;
  flex-shrink: 0;
}

.btn-remove-bonus:hover {
  background: #ee5a5a;
}

.btn-add-bonus {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  background: #253344;
  border: 2px dashed #1a2332;
  color: #d0d4d6;
  cursor: pointer;
  font-size: 14px;
  border-radius: 4px;
  transition: all 0.2s;
  width: 100%;
  margin-top: 5px;
}

.btn-add-bonus:hover {
  background: #1a2332;
  border-color: #f6a901;
  color: #f6a901;
}

.btn-add-icon {
  font-size: 18px;
  font-weight: bold;
  line-height: 1;
}

.bonus-custom-display {
  flex: 1;
}
</style>
