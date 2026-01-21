<template>
  <div class="stat-preview">
    <div v-if="isEmpty" class="stat-preview__empty">-</div>

    <template v-else>
      <!-- Flat object: { key: number } -->
      <div v-if="!isNested" class="stat-preview__chips">
        <span
          v-for="(item, idx) in visibleItems"
          :key="`${item.key}-${idx}`"
          class="stat-chip"
        >
          <span class="stat-chip__key">{{ item.key }}</span>
          <span class="stat-chip__sep">:</span>
          <span class="stat-chip__value">{{ formatValue(item.value) }}</span>
        </span>

        <span v-if="hiddenCount > 0" class="stat-chip stat-chip--more">
          +{{ hiddenCount }}
        </span>
      </div>

      <!-- Nested object: { level: { key: number|object } } -->
      <div v-else class="stat-preview__groups">
        <div
          v-for="group in nestedGroups"
          :key="group.level"
          class="stat-group"
        >
          <div class="stat-group__header">{{ group.level }}</div>

          <div class="stat-group__chips">
            <span
              v-for="(item, idx) in group.visibleItems"
              :key="`${group.level}-${item.key}-${idx}`"
              class="stat-chip"
              :title="typeof item.value === 'object' ? JSON.stringify(item.value, null, 2) : ''"
            >
              <span class="stat-chip__key">{{ item.key }}</span>
              <span class="stat-chip__sep">:</span>
              <span class="stat-chip__value">{{ formatValue(item.value) }}</span>
            </span>

            <span v-if="group.hiddenCount > 0" class="stat-chip stat-chip--more">
              +{{ group.hiddenCount }}
            </span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: { type: [Object, Array, String, Number, null], default: null },
  maxItems: { type: Number, default: 3 },
  maxItemsPerGroup: { type: Number, default: 3 },
})

const isPlainObject = (v) => v && typeof v === 'object' && !Array.isArray(v)

const normalized = computed(() => {
  if (!isPlainObject(props.value)) return null
  return props.value
})

const isEmpty = computed(() => {
  if (!normalized.value) return true
  return Object.keys(normalized.value).length === 0
})

const isNested = computed(() => {
  if (!normalized.value) return false
  const firstKey = Object.keys(normalized.value)[0]
  const firstVal = normalized.value[firstKey]
  return isPlainObject(firstVal)
})

const toEntries = (obj) =>
  Object.keys(obj)
    .sort((a, b) => String(a).localeCompare(String(b)))
    .map((k) => ({ key: k, value: obj[k] }))

const visibleItems = computed(() => {
  if (!normalized.value || isNested.value) return []
  return toEntries(normalized.value).slice(0, props.maxItems)
})

const hiddenCount = computed(() => {
  if (!normalized.value || isNested.value) return 0
  const total = Object.keys(normalized.value).length
  return Math.max(0, total - props.maxItems)
})

const nestedGroups = computed(() => {
  if (!normalized.value || !isNested.value) return []
  return Object.keys(normalized.value)
    .sort((a, b) => String(a).localeCompare(String(b)))
    .map((level) => {
      const entries = toEntries(normalized.value[level] || {})
      return {
        level,
        visibleItems: entries.slice(0, props.maxItemsPerGroup),
        hiddenCount: Math.max(0, entries.length - props.maxItemsPerGroup),
      }
    })
})

const formatValue = (v) => {
  if (v === null || v === undefined) return '-'
  if (typeof v === 'number') return Number.isFinite(v) ? v : '-'
  if (typeof v === 'string') return v
  if (typeof v === 'object') return '{...}'
  return String(v)
}
</script>

<style scoped>
.stat-preview {
  display: block;
  max-width: 260px;
}

.stat-preview__empty {
  color: #999;
}

.stat-preview__chips,
.stat-group__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.stat-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background: #1a2332;
  border: 1px solid #253344;
  border-radius: 999px;
  font-size: 11px;
  line-height: 1.4;
  color: #d0d4d6;
  max-width: 100%;
}

.stat-chip__key {
  color: #f6a901;
  font-weight: 600;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stat-chip__sep {
  opacity: 0.7;
}

.stat-chip__value {
  color: #d0d4d6;
  max-width: 90px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stat-chip--more {
  background: rgba(246, 169, 1, 0.12);
  border-color: rgba(246, 169, 1, 0.35);
  color: #f6a901;
  font-weight: 600;
}

.stat-preview__groups {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stat-group__header {
  font-size: 11px;
  color: #999;
  margin-bottom: 6px;
}
</style>

