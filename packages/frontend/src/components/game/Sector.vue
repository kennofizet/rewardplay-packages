<template>
  <div class="sector">
    <div class="sector-title">
      {{ displayTitle }}
    </div>
    <div class="sector-body">
      <slot></slot>
    </div>
    <div v-if="footer" class="sector-footer">
      {{ footer }}
    </div>
  </div>
</template>

<script setup>
import { inject, computed } from 'vue'
import { removeVietnameseDiacritics } from '../../i18n/utils'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  footer: {
    type: String,
    default: null
  }
})

const language = inject('language', 'en')

// Remove diacritics for Vietnamese when using Chupada font
const displayTitle = computed(() => {
  if (language === 'vi') {
    return removeVietnameseDiacritics(props.title)
  }
  return props.title
})
</script>

<style scoped>
.sector {
  margin-top: 40px;
}

.sector-title {
  font-family: Chupada, sans-serif;
  font-weight: 700;
  font-size: 90px;
  color: #fff;
  transform-origin: 100% 100%;
  transform: scale(1, 1) skewX(-10deg);
  letter-spacing: 1.5px;
  word-spacing: 4px;
  user-select: none;
}

.sector-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.5);
  padding-top: 10px;
  color: #fff;
  font-family: Nanami, sans-serif;
  font-weight: 400;
  letter-spacing: 1px;
  font-variant: small-caps;
  font-size: 14px;
  user-select: none;
}
</style>
