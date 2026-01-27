/**
 * Global data store for stats and types
 * Loaded once when Source is initialized and reused throughout the app
 */

// Global state
let globalStats = {
  stats: [], // Default stats (CONVERSION_KEYS)
  custom_options: [] // Custom options from SettingOption
}

let globalTypes = [] // Item types

let isStatsLoaded = false
let isTypesLoaded = false

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
 * Load item types from API
 * @param {Object} gameApi - Game API instance
 * @returns {Promise<void>}
 */
export async function loadGlobalTypes(gameApi) {
  if (!gameApi) {
    console.warn('gameApi not available, cannot load global types')
    return
  }

  try {
    const response = await gameApi.getTypes()
    if (response.data && response.data.datas) {
      globalTypes = response.data.datas.types || []
      isTypesLoaded = true
    }
  } catch (error) {
    console.error('Error loading global types:', error)
    isTypesLoaded = false
  }
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

  // Find in global types
  const typeObj = globalTypes.find(t => t.type === type)
  if (typeObj) {
    return typeObj.name
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
 * Get all global types
 * @returns {Array}
 */
export function getGlobalTypes() {
  return [...globalTypes]
}

/**
 * Check if stats are loaded
 * @returns {boolean}
 */
export function isStatsDataLoaded() {
  return isStatsLoaded
}

/**
 * Check if types are loaded
 * @returns {boolean}
 */
export function isTypesDataLoaded() {
  return isTypesLoaded
}

/**
 * Reload stats (useful when custom options are created/edited/deleted)
 * @param {Object} gameApi - Game API instance
 * @returns {Promise<void>}
 */
export async function reloadGlobalStats(gameApi) {
  await loadGlobalStats(gameApi)
}
