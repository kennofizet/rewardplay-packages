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
          <span class="stat-chip__key">{{ getStatNameFunc(item.key) }}</span>
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
              <span class="stat-chip__key">{{ getStatNameFunc(item.key) }}</span>
              <span class="stat-chip__sep">:</span>
              <span class="stat-chip__value">{{ formatValue(item.value) }}</span>
            </span>

            <span v-if="group.hiddenCount > 0" class="stat-chip stat-chip--more">
              +{{ group.hiddenCount }}
            </span>
          </div>

          <!-- Custom stats for this level -->
          <div v-if="group.customStats && group.customStats.length > 0" class="stat-group__custom-stats">
            <CustomOptionDisplay
              v-for="(customStat, idx) in group.visibleCustomStats"
              :key="`${group.level}-custom-${idx}`"
              :name="customStat.name"
              :properties="customStat.properties || {}"
              :stats-label="statsLabel"
              class="custom-stat-inline"
            />
            <span v-if="group.hiddenCustomCount > 0" class="stat-chip stat-chip--more">
              +{{ group.hiddenCustomCount }} {{ t('page.manageSetting.settingItems.stats') }}
            </span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'
import { getStatName } from '../utils/globalData'
import CustomOptionDisplay from './CustomOptionDisplay.vue'
const translator = inject('translator', null)
const t = translator || ((key) => key)

const props = defineProps({
  value: { type: [Object, Array, String, Number, null], default: null },
  custom_stats: { type: [Object, null], default: null },
  maxItems: { type: Number, default: 3 },
  maxItemsPerGroup: { type: Number, default: 3 },
  maxCustomStatsPerGroup: { type: Number, default: 2 },
  statsLabel: { type: String, default: 'stats' }
})

// Use global getStatName function (fallback to inject if provided for backward compatibility)
const injectedGetStatName = inject('getStatName', null)
const getStatNameFunc = injectedGetStatName || getStatName

const isPlainObject = (v) => v && typeof v === 'object' && !Array.isArray(v)

const normalized = computed(() => {
  if (!isPlainObject(props.value)) return null
  return props.value
})

const isEmpty = computed(() => {
  // Check if value has data
  const hasValue = normalized.value && Object.keys(normalized.value).length > 0
  
  // Check if custom_stats has data
  const hasCustomStats = props.custom_stats && 
    isPlainObject(props.custom_stats) && 
    Object.keys(props.custom_stats).length > 0 &&
    Object.values(props.custom_stats).some(levelStats => 
      Array.isArray(levelStats) && levelStats.length > 0
    )
  
  // Show content if either value or custom_stats has data
  return !hasValue && !hasCustomStats
})

const isNested = computed(() => {
  // If value exists and is nested, use that
  if (normalized.value) {
    const firstKey = Object.keys(normalized.value)[0]
    const firstVal = normalized.value[firstKey]
    if (isPlainObject(firstVal)) return true
  }
  
  // If custom_stats exists and has level keys, treat as nested
  if (props.custom_stats && isPlainObject(props.custom_stats)) {
    return Object.keys(props.custom_stats).length > 0
  }
  
  return false
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
  if (!isNested.value) return []
  
  // Get all level keys from both value and custom_stats
  const valueLevels = normalized.value ? Object.keys(normalized.value) : []
  const customStatsLevels = props.custom_stats && isPlainObject(props.custom_stats) 
    ? Object.keys(props.custom_stats) 
    : []
  
  // Combine and deduplicate level keys
  const allLevels = [...new Set([...valueLevels, ...customStatsLevels])]
    .sort((a, b) => {
      // Sort: numeric levels first (as numbers), then 'full' at the end
      if (a === 'full') return 1
      if (b === 'full') return -1
      const numA = parseInt(a, 10)
      const numB = parseInt(b, 10)
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB
      return String(a).localeCompare(String(b))
    })
  
  return allLevels.map((level) => {
    // Get entries from value for this level
    const entries = normalized.value && normalized.value[level]
      ? toEntries(normalized.value[level] || {})
      : []
    
    // Get custom stats for this level
    const customStatsForLevel = props.custom_stats && isPlainObject(props.custom_stats) && Array.isArray(props.custom_stats[level])
      ? props.custom_stats[level]
      : []
    
    const visibleCustomStats = customStatsForLevel.slice(0, props.maxCustomStatsPerGroup)
    const hiddenCustomCount = Math.max(0, customStatsForLevel.length - props.maxCustomStatsPerGroup)
    
    return {
      level,
      visibleItems: entries.slice(0, props.maxItemsPerGroup),
      hiddenCount: Math.max(0, entries.length - props.maxItemsPerGroup),
      customStats: customStatsForLevel,
      visibleCustomStats,
      hiddenCustomCount
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

.stat-group__custom-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #253344;
}

.custom-stat-inline {
  font-size: 11px;
  padding: 2px 8px;
  max-width: 200px;
}

.custom-stat-inline .custom-option-name {
  font-size: 11px;
  margin-right: 4px;
}

.custom-stat-inline .custom-option-info {
  font-size: 10px;
}
</style>

