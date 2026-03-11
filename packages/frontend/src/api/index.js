import axios from 'axios'

/**
 * Create game API client
 * @param {string} coreUrl - Base URL for core API
 * @param {string} backendUrl - Base URL for backend API
 * @param {string} token - RewardPlay token (required)
 * @returns {Object} API client with methods
 */
export function createGameApi(coreUrl, backendUrl, token) {
  if (!coreUrl) {
    throw new Error('Core URL is required')
  }

  if (!backendUrl) {
    throw new Error('Backend URL is required')
  }

  if (!token) {
    throw new Error('RewardPlay token is required')
  }

  const api = axios.create({
    // baseURL: backendUrl,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Knf-Token': token,
    },
  })

  // Add interceptor to automatically include zone_id from localStorage as header
  api.interceptors.request.use((config) => {
    try {
      const selectedZone = localStorage.getItem('selected_zone')
      if (selectedZone) {
        const zone = JSON.parse(selectedZone)
        if (zone && zone.id) {
          // Add zone_id to headers (similar to X-Knf-Token)
          config.headers = config.headers || {}
          if (!config.headers['X-Knf-Zone-Id']) {
            config.headers['X-Knf-Zone-Id'] = zone.id.toString()
          }
        }
      }
    } catch (e) {
      // Silently fail if localStorage is not available or zone is invalid
      console.warn('Failed to get zone_id from localStorage:', e)
    }
    // When sending FormData, remove Content-Type so the browser sets multipart/form-data with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    return config
  })

  return {
    // Auth
    checkUser: () => api.get(coreUrl + '/auth/check'),
    // Zones the current user belongs to
    getZones: () => api.get(coreUrl + '/player/zones'),
    // Zones the current user can manage (for settings)
    getManagedZones: () => api.get(coreUrl + '/player/managed-zones'),
    // Zone management (settings)
    getAllZones: (params) => api.get(coreUrl + '/zones', { params }),
    createZone: (data) => api.post(coreUrl + '/zones', data),
    updateZone: (id, data) => api.put(coreUrl + `/zones/${id}`, data),
    deleteZone: (id) => api.delete(coreUrl + `/zones/${id}`),
    // Zone users (server members + assigned)
    getZoneUsers: (zoneId, params) => api.get(coreUrl + `/zones/${zoneId}/users`, { params }),
    assignZoneUser: (zoneId, userId) => api.post(coreUrl + `/zones/${zoneId}/users`, { user_id: userId }),
    removeZoneUser: (zoneId, userId) => api.delete(coreUrl + `/zones/${zoneId}/users/${userId}`),

    // Player: custom images
    getCustomImages: (params) => api.get(backendUrl + '/player/custom-images', { params }),
    // Manifest
    getManifest: () => api.get(backendUrl + '/manifest'),
    // Ranking (period: day | week | month | year)
    getRanking: (period = 'day') => api.get(backendUrl + '/ranking', { params: { period } }),
    // RewardPlay: user data
    getUserData: () => api.get(backendUrl + '/auth/user-data'),
    // Setting Items CRUD
    getSettingItems: (params) => api.get(backendUrl + '/setting-items', { params }),
    suggestSettingItems: () => api.post(backendUrl + '/setting-items/suggest'),
    createSettingItem: (data) => api.post(backendUrl + '/setting-items', data),
    updateSettingItem: (id, data) => {
      if (data instanceof FormData) {
        if (!data.has('_method')) data.append('_method', 'PUT')
        return api.post(backendUrl + `/setting-items/${id}`, data)
      }
      return api.put(backendUrl + `/setting-items/${id}`, data)
    },
    deleteSettingItem: (id) => api.delete(backendUrl + `/setting-items/${id}`),

    // Setting Options CRUD
    getSettingOptions: (params) => api.get(backendUrl + '/setting-options', { params }),
    getSettingOption: (id) => api.get(backendUrl + `/setting-options/${id}`),
    createSettingOption: (data) => api.post(backendUrl + '/setting-options', data),
    updateSettingOption: (id, data) => api.put(backendUrl + `/setting-options/${id}`, data),
    deleteSettingOption: (id) => api.delete(backendUrl + `/setting-options/${id}`),

    // Setting Stats Transforms CRUD
    getSettingStatsTransforms: (params) => api.get(backendUrl + '/setting-stats-transforms', { params }),
    createSettingStatsTransform: (data) => api.post(backendUrl + '/setting-stats-transforms', data),
    updateSettingStatsTransform: (id, data) => api.put(backendUrl + `/setting-stats-transforms/${id}`, data),
    deleteSettingStatsTransform: (id) => api.delete(backendUrl + `/setting-stats-transforms/${id}`),
    suggestSettingStatsTransforms: () => api.post(backendUrl + '/setting-stats-transforms/suggest'),
    getSettingStatsTransformsAllowedKeys: () => api.get(backendUrl + '/setting-stats-transforms/allowed-keys'),

    // Global data (accessible to both player and manage)
    getAllStats: () => api.get(backendUrl + '/stats/all'),
    getRewardTypes: (mode) => api.get(backendUrl + '/stats/reward-types', { params: { mode } }),

    // Setting Item Sets CRUD
    getSettingItemSets: (params) => api.get(backendUrl + '/setting-item-sets', { params }),
    getItemsForZone: (params) => api.get(backendUrl + '/setting-items/items-for-zone', { params }),
    createSettingItemSet: (data) => api.post(backendUrl + '/setting-item-sets', data),
    updateSettingItemSet: (id, data) => api.put(backendUrl + `/setting-item-sets/${id}`, data),
    deleteSettingItemSet: (id) => api.delete(backendUrl + `/setting-item-sets/${id}`),

    // Setting Stack Bonuses CRUD
    getStackBonuses: (params) => api.get(backendUrl + '/setting-stack-bonuses', { params }),
    getStackBonus: (id) => api.get(backendUrl + `/setting-stack-bonuses/${id}`),
    createStackBonus: (data) => api.post(backendUrl + '/setting-stack-bonuses', data),
    updateStackBonus: (id, data) => api.put(backendUrl + `/setting-stack-bonuses/${id}`, data),
    deleteStackBonus: (id) => api.delete(backendUrl + `/setting-stack-bonuses/${id}`),
    suggestStackBonuses: () => api.post(backendUrl + '/setting-stack-bonuses/suggest'),

    // Setting Daily Rewards (Manage)
    getDailyRewardConfigs: (params) => api.get(backendUrl + '/setting-daily-rewards', { params }), // Expects month/year
    saveDailyRewardConfig: (data) => api.post(backendUrl + '/setting-daily-rewards', data), // Update or Create based on date
    suggestDailyRewards: (data) => api.post(backendUrl + '/setting-daily-rewards/suggest', data),

    // Setting Level Exps (Manage)
    getLevelExps: (params) => api.get(backendUrl + '/setting-level-exps', { params }),
    getLevelExp: (id) => api.get(backendUrl + `/setting-level-exps/${id}`),
    createLevelExp: (data) => api.post(backendUrl + '/setting-level-exps', data),
    updateLevelExp: (id, data) => api.put(backendUrl + `/setting-level-exps/${id}`, data),
    deleteLevelExp: (id) => api.delete(backendUrl + `/setting-level-exps/${id}`),
    suggestLevelExps: () => api.post(backendUrl + '/setting-level-exps/suggest'),

    // Setting Events (Manage)
    getSettingEvents: (params) => api.get(backendUrl + '/setting-events', { params }),
    getSettingEvent: (id) => api.get(backendUrl + `/setting-events/${id}`),
    suggestSettingEvents: () => api.post(backendUrl + '/setting-events/suggest'),
    createSettingEvent: (data) => api.post(backendUrl + '/setting-events', data),
    updateSettingEvent: (id, data) => {
      if (data instanceof FormData) {
        return api.post(backendUrl + `/setting-events/${id}`, data)
      }
      return api.put(backendUrl + `/setting-events/${id}`, data)
    },
    deleteSettingEvent: (id) => api.delete(backendUrl + `/setting-events/${id}`),

    // Setting Shop Items (Manage)
    getSettingShopItems: (params) => api.get(backendUrl + '/setting-shop-items', { params }),
    getSettingShopItem: (id) => api.get(backendUrl + `/setting-shop-items/${id}`),
    suggestSettingShopItems: () => api.post(backendUrl + '/setting-shop-items/suggest'),
    createSettingShopItem: (data) => api.post(backendUrl + '/setting-shop-items', data),
    updateSettingShopItem: (id, data) => api.put(backendUrl + `/setting-shop-items/${id}`, data),
    deleteSettingShopItem: (id) => api.delete(backendUrl + `/setting-shop-items/${id}`),

    // Player Daily Rewards & Bag
    getPlayerDailyRewardState: () => api.get(backendUrl + '/player/daily-rewards'), // Includes stack info
    collectDailyReward: () => api.post(backendUrl + '/player/daily-rewards/collect'),
    getPlayerBag: () => api.get(backendUrl + '/player/bag'),
    saveGears: (gears) => api.post(backendUrl + '/player/bag/gears', { gears }),
    openBox: (userBagItemId, quantity = 1) =>
      api.post(backendUrl + '/player/bag/open-box', { user_bag_item_id: userBagItemId, quantity: Math.max(1, Math.min(parseInt(quantity, 10) || 1, 99)) }),

    // Player Events (active events for popup)
    getPlayerEvents: () => api.get(backendUrl + '/player/events'),

    // Player Shop (active shop items + purchase)
    getPlayerShop: () => api.get(backendUrl + '/player/shop'),
    purchaseShopItem: (shopItemId, quantity = 1) =>
      api.post(backendUrl + '/player/shop/purchase', { shop_item_id: shopItemId, quantity }),
  }
}

