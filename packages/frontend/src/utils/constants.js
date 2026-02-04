/**
 * RewardPlay constants - loaded from window.REWARDPLAY_CONSTANTS (published by backend).
 * Use these instead of manual strings. Load constants script before app (e.g. in resource loader).
 */

function getConstants() {
  return typeof window !== 'undefined' && window.REWARDPLAY_CONSTANTS
    ? window.REWARDPLAY_CONSTANTS
    : getFallbackConstants()
}

/** Fallback when constants script not yet loaded (e.g. SSR or before load). */
function getFallbackConstants() {
  return {
    SettingItem: {
      ITEM_TYPE_GEAR: 'gear',
      ITEM_TYPE_SWORD: 'sword',
      ITEM_TYPE_HAT: 'hat',
      ITEM_TYPE_SHIRT: 'shirt',
      ITEM_TYPE_TROUSER: 'trouser',
      ITEM_TYPE_SHOE: 'shoe',
      ITEM_TYPE_NECKLACE: 'necklace',
      ITEM_TYPE_BRACELET: 'bracelet',
      ITEM_TYPE_RING: 'ring',
      ITEM_TYPE_CLOTHES: 'clothes',
      ITEM_TYPE_WING: 'wing',
      ITEM_TYPE_BOX_RANDOM: 'box_random',
      ITEM_TYPE_TICKET: 'ticket',
      ITEM_TYPE_BUFF: 'buff',
      ITEM_TYPE_NAMES: {},
      OTHER_ITEM_TYPE_NAMES: {},
      BOX_RANDOM_RATE_LIST: 'rate_list',
      BOX_RANDOM_ITEM_COUNT: 'item_count'
    },
    SettingShopItem: {
      CATEGORY_GEAR: 'gear',
      CATEGORY_TICKET: 'ticket',
      CATEGORY_BOX_RANDOM: 'box_random',
      CATEGORY_EVENT: 'event',
      PRICE_TYPE_COIN: 'coin',
      PRICE_TYPE_GEM: 'gem',
      PRICE_TYPE_RUBY: 'ruby',
      PRICE_TYPE_ITEM: 'item'
    },
    Helper: {
      TYPE_GEAR: 'gear',
      TYPE_COIN: 'coin',
      TYPE_EXP: 'exp',
      TYPE_RUBY: 'ruby',
      TYPE_TICKET: 'ticket'
    }
  }
}

let cached = null

/**
 * Get constants object (cached after first read).
 * @returns {{ SettingItem: object, SettingShopItem: object, Helper: object }}
 */
export function getRewardPlayConstants() {
  if (cached) return cached
  cached = getConstants()
  return cached
}

/** Item types (SettingItem) - use for item_type, type checks. */
export function getItemConstants() {
  return getRewardPlayConstants().SettingItem
}

/** Shop categories and price types (SettingShopItem). */
export function getShopConstants() {
  return getRewardPlayConstants().SettingShopItem
}

/** Helper / reward types. */
export function getHelperConstants() {
  return getRewardPlayConstants().Helper
}

/** All gear slot types (wearable) as array. */
export function getGearTypes() {
  const c = getItemConstants()
  return [
    c.ITEM_TYPE_SWORD,
    c.ITEM_TYPE_HAT,
    c.ITEM_TYPE_SHIRT,
    c.ITEM_TYPE_TROUSER,
    c.ITEM_TYPE_SHOE,
    c.ITEM_TYPE_NECKLACE,
    c.ITEM_TYPE_BRACELET,
    c.ITEM_TYPE_RING,
    c.ITEM_TYPE_CLOTHES,
    c.ITEM_TYPE_WING
  ]
}

/** Category key for "all" in shop (not in backend; frontend-only). */
export const SHOP_CATEGORY_ALL = 'all'

/**
 * Default bag menu list (mirrors backend UserBagItemConstant::getBagMenuList).
 * Used when API does not return bag_menu. Each entry: { key, item_types, show_when_properties_empty, image_key, label_key }.
 */
export function getBagMenuList() {
  const c = getItemConstants()
  return [
    { key: 'bag', item_types: null, show_when_properties_empty: true, image_key: 'bag.bag', label_key: 'component.bag.menuAll' },
    { key: 'sword', item_types: [c.ITEM_TYPE_SWORD], show_when_properties_empty: false, image_key: 'bag.sword', label_key: 'component.types.sword' },
    { key: 'other', item_types: [c.ITEM_TYPE_HAT, c.ITEM_TYPE_SHIRT, c.ITEM_TYPE_TROUSER, c.ITEM_TYPE_SHOE, c.ITEM_TYPE_NECKLACE, c.ITEM_TYPE_BRACELET, c.ITEM_TYPE_RING, c.ITEM_TYPE_CLOTHES, c.ITEM_TYPE_WING], show_when_properties_empty: false, image_key: 'bag.bracelet', label_key: 'component.bag.menuOther' },
    { key: 'shop', item_types: [c.ITEM_TYPE_TICKET, c.ITEM_TYPE_BOX_RANDOM, c.ITEM_TYPE_BUFF], show_when_properties_empty: false, image_key: 'bag.shop', label_key: 'component.bag.menuShop' },
  ]
}

/**
 * Relative path to the RewardPlay constants script (published by backend).
 * Use with backend origin to build full URL, e.g. load in ResourceLoader before app uses constants.
 */
export const REWARDPLAY_CONSTANTS_SCRIPT_PATH = 'rewardplay-constants/rewardplay-constants.js'

/**
 * Build full URL for the constants script from backend base URL.
 * @param {string} backendUrl - Backend base URL (e.g. https://example.com or https://example.com/api)
 * @returns {string} Full URL to rewardplay-constants.js
 */
export function getConstantsScriptUrl(backendUrl) {
  if (!backendUrl || typeof backendUrl !== 'string') return ''
  const base = backendUrl.trim().replace(/\/$/, '')
  try {
    const origin = new URL(base).origin
    return `${origin}/${REWARDPLAY_CONSTANTS_SCRIPT_PATH}`
  } catch {
    return `${base}/${REWARDPLAY_CONSTANTS_SCRIPT_PATH}`
  }
}

/** Reset cache (e.g. after constants script loaded). */
export function resetConstantsCache() {
  cached = null
}
