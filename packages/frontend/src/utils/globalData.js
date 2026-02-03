/**
 * Global data store for stats and types
 * Loaded once when Source is initialized and reused throughout the app
 */

import { getItemConstants } from './constants'

// Global state
let globalStats = {
  stats: [], // Default stats (CONVERSION_KEYS)
  custom_options: [] // Custom options from SettingOption
}

let isStatsLoaded = false
let isTypesLoaded = false

/** Build item types array from SettingItem.ITEM_TYPE_NAMES + OTHER_ITEM_TYPE_NAMES (same shape as former API). */
function buildTypesFromConstants() {
  const c = getItemConstants()
  const names = c.ITEM_TYPE_NAMES || {}
  const other = c.OTHER_ITEM_TYPE_NAMES || {}
  const list = []
  Object.keys(names).forEach((type) => list.push({ type, name: names[type] }))
  Object.keys(other).forEach((type) => list.push({ type, name: other[type] }))
  return list
}

/**
 * Load all stats from API
 * @param {Object} gameApi - Game API instance
 * @returns {Promise<void>}
 */
export async function loadGlobalStats(gameApi) {
  if (!gameApi) {
    console.warn('gameApi not available, cannot load global stats')
    return
  }

  try {
    const response = await gameApi.getAllStats()
    if (response.data && response.data.datas) {
      globalStats.stats = response.data.datas.stats || []
      globalStats.custom_options = response.data.datas.custom_options || []
      isStatsLoaded = true
    }
  } catch (error) {
    console.error('Error loading global stats:', error)
    isStatsLoaded = false
  }
}

/**
 * Load item types from global constants (SettingItem.ITEM_TYPE_NAMES + OTHER_ITEM_TYPE_NAMES).
 * No API call; kept for compatibility with callers that await loadGlobalTypes(gameApi).
 * @param {Object} [_gameApi] - Unused; kept for API compatibility
 * @returns {Promise<void>}
 */
export async function loadGlobalTypes(_gameApi) {
  isTypesLoaded = true
}

/**
 * Get stat name by key (for default stats only)
 * @param {string} statKey - Stat key (e.g., 'power', 'crit')
 * @param {Function} translator - Optional translator function for i18n
 * @returns {string} Display name or formatted key
 */
export function getStatName(statKey, translator = null) {
  if (!statKey || typeof statKey !== 'string') {
    return statKey || ''
  }

  // Strip duplicate suffixes like _2, _3
  const baseKey = statKey.replace(/_\d+$/, '')
  
  // Try to get translated name first
  if (translator) {
    const translationKey = `component.stats.${baseKey}`
    const translated = translator(translationKey)
    if (translated && translated !== translationKey) {
      return translated
    }
  }
  
  // Find in global stats
  const stat = globalStats.stats.find(s => s.key === baseKey)
  if (stat) {
    return stat.name
  }

  // Fallback: format the key
  return baseKey
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Get type name by type value
 * @param {string} type - Type value (e.g., 'weapon', 'armor')
 * @param {Function} translator - Optional translator function for i18n
 * @returns {string} Display name or formatted type
 */
export function getTypeName(type, translator = null) {
  if (!type || typeof type !== 'string') {
    return type || ''
  }

  // Try to get translated name first
  if (translator) {
    const translationKey = `component.types.${type}`
    const translated = translator(translationKey)
    if (translated && translated !== translationKey) {
      return translated
    }
  }

  // Find in constants (SettingItem.ITEM_TYPE_NAMES + OTHER_ITEM_TYPE_NAMES)
  const c = getItemConstants()
  const name = (c.ITEM_TYPE_NAMES && c.ITEM_TYPE_NAMES[type]) || (c.OTHER_ITEM_TYPE_NAMES && c.OTHER_ITEM_TYPE_NAMES[type])
  if (name) {
    return name
  }

  // Fallback: format the type
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Get all global stats
 * @returns {{stats: Array, custom_options: Array}}
 */
export function getGlobalStats() {
  return {
    stats: [...globalStats.stats],
    custom_options: [...globalStats.custom_options]
  }
}

/**
 * Get all global types (from SettingItem.ITEM_TYPE_NAMES + OTHER_ITEM_TYPE_NAMES).
 * @returns {Array<{type: string, name: string}>}
 */
export function getGlobalTypes() {
  return buildTypesFromConstants()
}

/**
 * Check if stats are loaded
 * @returns {boolean}
 */
export function isStatsDataLoaded() {
  return isStatsLoaded
}

/**
 * Check if types are loaded (always true; types come from SettingItem constants).
 * @returns {boolean}
 */
export function isTypesDataLoaded() {
  return true
}

/**
 * Reload stats (useful when custom options are created/edited/deleted)
 * @param {Object} gameApi - Game API instance
 * @returns {Promise<void>}
 */
export async function reloadGlobalStats(gameApi) {
  await loadGlobalStats(gameApi)
}
