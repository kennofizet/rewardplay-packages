<template>
  <div class="custom-select" :class="{ 'is-open': isOpen, 'is-disabled': disabled }" ref="dropdownRef">
    <div 
      class="select-trigger" 
      @click="toggleDropdown"
      :class="triggerClass"
    >
      <span class="select-value">{{ displayValue }}</span>
      <span class="select-arrow" :class="{ 'rotated': isOpen }">▼</span>
    </div>
    <Transition name="dropdown">
      <div v-if="isOpen" class="select-dropdown">
        <div 
          v-for="option in options" 
          :key="option.value"
          class="select-option"
          :class="{ 'is-selected': modelValue === option.value, 'is-disabled': option.disabled }"
          @click="selectOption(option)"
        >
          {{ option.label }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array,
    required: true,
    validator: (options) => {
      return options.every(opt => opt.hasOwnProperty('value') && opt.hasOwnProperty('label'))
    }
  },
  placeholder: {
    type: String,
    default: 'Select...'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  triggerClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)
const dropdownRef = ref(null)

const displayValue = computed(() => {
  if (!props.modelValue) {
    return props.placeholder
  }
  const selectedOption = props.options.find(opt => opt.value === props.modelValue)
  return selectedOption ? selectedOption.label : props.placeholder
})

const toggleDropdown = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
}

const selectOption = (option) => {
  if (option.disabled) return
  emit('update:modelValue', option.value)
  emit('change', option.value)
  isOpen.value = false
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.custom-select {
  position: relative;
  display: inline-block;
  max-width: 100%;
}

.select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.custom-select.is-disabled .select-trigger {
  opacity: 0.6;
  cursor: not-allowed;
}

.select-trigger:hover:not(.is-disabled) {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.custom-select.is-open .select-trigger {
  border-color: rgba(255, 255, 255, 0.4);
}

.select-value {
  flex: 1;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.select-arrow {
  margin-left: 8px;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.8);
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.select-arrow.rotated {
  transform: rotate(180deg);
}

.select-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: #253344;
  border: 1px solid #1a2332;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 4px;
}

.select-option {
  padding: 10px 12px;
  color: #d0d4d6;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.select-option:hover:not(.is-disabled) {
  background: rgba(255, 255, 255, 0.1);
}

.select-option.is-selected {
  background: rgba(246, 169, 1, 0.2);
  color: #f6a901;
  font-weight: 500;
}

.select-option.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Dropdown transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Scrollbar styling */
.select-dropdown::-webkit-scrollbar {
  width: 6px;
}

.select-dropdown::-webkit-scrollbar-track {
  background: #1a2332;
  border-radius: 3px;
}

.select-dropdown::-webkit-scrollbar-thumb {
  background: #253344;
  border-radius: 3px;
}

.select-dropdown::-webkit-scrollbar-thumb:hover {
  background: #2d3a4b;
}
</style>
