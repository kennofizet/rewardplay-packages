// Centralized helpers for stat keys, custom stats and conversions between maps and lists

function normalizeSavedKey(key) {
  if (!key || typeof key !== 'string') return key
  const parts = key.split('_')
  // Some legacy keys may have extra suffixes; collapse to first 3 parts (e.g., custom_key_123_2 -> custom_key_123)
  if (parts.length > 3 && parts[0] === 'custom' && parts[1] === 'key') {
    return parts.slice(0, 3).join('_')
  }
  return key
}

function stripCounterSuffix(key) {
  if (!key || typeof key !== 'string') return key
  return key.replace(/_(\d+)$/, '')
}

function findStat(conversionKeys, key) {
  if (!conversionKeys || !Array.isArray(conversionKeys)) return null
  return conversionKeys.find(s => s.key === key) || null
}

function isCustomStat(conversionKeys, key, opts = {}) {
  if (!key) return false
  // explicit prefix
  if (key.startsWith(opts.customPrefix || 'custom_key_')) return true
  const stat = findStat(conversionKeys, key)
  return stat && stat.value !== undefined
}

function getCustomStatValue(conversionKeys, key) {
  if (!key) return null
  const stat = findStat(conversionKeys, key)
  return stat && stat.value !== undefined ? stat.value : null
}

function getPresetValuesCount(conversionKeys, key) {
  if (!key) return 0
  const stat = findStat(conversionKeys, key)
  if (stat && stat.value !== undefined && typeof stat.value === 'object') {
    return Object.keys(stat.value || {}).length
  }
  return 0
}

function getPresetValuesTooltip(conversionKeys, key) {
  if (!key) return 'Preset Values (no value set)'
  const stat = findStat(conversionKeys, key)
  if (stat && stat.value !== undefined && typeof stat.value === 'object') {
    return JSON.stringify(stat.value, null, 2)
  }
  return 'Preset Values (no value set)'
}

// Convert a saved map/object (possibly with _2/_3 suffixes and custom keys) into a normalized list
// Returns array of { key, value, isCustom }
function mapToList(mapObj, conversionKeys = [], opts = {}) {
  const customPrefix = opts.customPrefix || 'custom_key_'
  const list = []
  if (!mapObj || typeof mapObj !== 'object') return list

  Object.keys(mapObj).forEach(savedKey => {
    let value = mapObj[savedKey]
    // Normalize long custom keys
    let key = normalizeSavedKey(savedKey)

    const isCustomKey = key.startsWith(customPrefix)
    const isObjectValue = value !== null && typeof value === 'object'

    if (isCustomKey || isObjectValue || isCustomStat(conversionKeys, key, { customPrefix })) {
      // Keep exact key for custom stats (may include custom_key_{id})
      // If savedKey had extra suffix parts (e.g., custom_key_123_2) normalize to at most 3 parts
      if (isCustomKey && savedKey.split('_').length > 3) {
        key = normalizeSavedKey(savedKey)
      } else {
        key = savedKey
      }

      list.push({ key: key, value: value, isCustom: true })
    } else {
      // Regular stat - remove counter suffix for display
      const originalKey = stripCounterSuffix(savedKey)
      list.push({ key: originalKey, value: value, isCustom: false })
    }
  })

  return list
}

// Convert a list [{key,value,isCustom}] to a map allowing duplicate keys by suffixing _2/_3
// For custom stats (identified by prefix or conversionKeys), value objects are preserved
function listToMap(list, conversionKeys = [], opts = {}) {
  const customPrefix = opts.customPrefix || 'custom_key_'
  const map = {}
  const counters = {}

  if (!Array.isArray(list)) return map

  list.forEach(item => {
    if (!item || !item.key) return
    const rawKey = item.key
    // Skip invalid values
    if (item.value === null || item.value === undefined || item.value === '') return

    let keyToUse = rawKey
    const stat = findStat(conversionKeys, rawKey)
    const itemIsCustom = !!item.isCustom || keyToUse.startsWith(customPrefix) || (stat && stat.value !== undefined)

    if (itemIsCustom && keyToUse.startsWith(customPrefix)) {
      // Ensure correct normalized key if necessary
      const matching = findStat(conversionKeys, keyToUse)
      if (matching) keyToUse = matching.key
      // keep keyToUse as-is even if not found
    }

    // Count duplicates
    if (!counters[keyToUse]) counters[keyToUse] = 0
    counters[keyToUse]++
    const uniqueKey = counters[keyToUse] === 1 ? keyToUse : `${keyToUse}_${counters[keyToUse]}`

    if (itemIsCustom && typeof item.value === 'object') {
      map[uniqueKey] = item.value
    } else {
      const num = typeof item.value === 'number' ? item.value : parseFloat(item.value)
      if (!isNaN(num) && isFinite(num)) {
        map[uniqueKey] = num
      }
    }
  })

  return map
}

export {
  normalizeSavedKey,
  stripCounterSuffix,
  findStat,
  isCustomStat,
  getCustomStatValue,
  getPresetValuesCount,
  getPresetValuesTooltip,
  mapToList,
  listToMap,
}
