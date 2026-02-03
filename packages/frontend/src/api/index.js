import axios from 'axios'

/**
 * Create game API client
 * @param {string} backendUrl - Base URL for backend API
 * @param {string} token - RewardPlay token (required)
 * @returns {Object} API client with methods
 */
export function createGameApi(backendUrl, token) {
  if (!backendUrl) {
    throw new Error('Backend URL is required')
  }

  if (!token) {
    throw new Error('RewardPlay token is required')
  }

  const api = axios.create({
    baseURL: backendUrl,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-RewardPlay-Token': token,
    },
  })

  // Add interceptor to automatically include zone_id from localStorage as header
  api.interceptors.request.use((config) => {
    try {
      const selectedZone = localStorage.getItem('selected_zone')
      if (selectedZone) {
        const zone = JSON.parse(selectedZone)
        if (zone && zone.id) {
          // Add zone_id to headers (similar to X-RewardPlay-Token)
          config.headers = config.headers || {}
          if (!config.headers['X-RewardPlay-Zone-Id']) {
            config.headers['X-RewardPlay-Zone-Id'] = zone.id.toString()
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
    checkUser: () => api.get('/api/rewardplay/auth/check'),
    getUserData: () => api.get('/api/rewardplay/auth/user-data'),
    // Zones the current user belongs to
    getZones: () => api.get('/api/rewardplay/player/zones'),
    getCustomImages: (params) => api.get('/api/rewardplay/player/custom-images', { params }),
    // Manifest
    getManifest: () => api.get('/api/rewardplay/manifest'),
    // Ranking (period: day | week | month | year)
    getRanking: (period = 'day') => api.get('/api/rewardplay/ranking', { params: { period } }),
    // Zones the current user can manage (for settings)
    getManagedZones: () => api.get('/api/rewardplay/player/managed-zones'),
    // Zone management (settings)
    getAllZones: (params) => api.get('/api/rewardplay/zones', { params }),
    createZone: (data) => api.post('/api/rewardplay/zones', data),
    updateZone: (id, data) => api.put(`/api/rewardplay/zones/${id}`, data),
    deleteZone: (id) => api.delete(`/api/rewardplay/zones/${id}`),
    // Zone users (server members + assigned)
    getZoneUsers: (zoneId, params) => api.get(`/api/rewardplay/zones/${zoneId}/users`, { params }),
    assignZoneUser: (zoneId, userId) => api.post(`/api/rewardplay/zones/${zoneId}/users`, { user_id: userId }),
    removeZoneUser: (zoneId, userId) => api.delete(`/api/rewardplay/zones/${zoneId}/users/${userId}`),

    // Setting Items CRUD
    getSettingItems: (params) => api.get('/api/rewardplay/setting-items', { params }),
    suggestSettingItems: () => api.post('/api/rewardplay/setting-items/suggest'),
    createSettingItem: (data) => api.post('/api/rewardplay/setting-items', data),
    updateSettingItem: (id, data) => {
      if (data instanceof FormData) {
        if (!data.has('_method')) data.append('_method', 'PUT')
        return api.post(`/api/rewardplay/setting-items/${id}`, data)
      }
      return api.put(`/api/rewardplay/setting-items/${id}`, data)
    },
    deleteSettingItem: (id) => api.delete(`/api/rewardplay/setting-items/${id}`),

    // Setting Options CRUD
    getSettingOptions: (params) => api.get('/api/rewardplay/setting-options', { params }),
    getSettingOption: (id) => api.get(`/api/rewardplay/setting-options/${id}`),
    createSettingOption: (data) => api.post('/api/rewardplay/setting-options', data),
    updateSettingOption: (id, data) => api.put(`/api/rewardplay/setting-options/${id}`, data),
    deleteSettingOption: (id) => api.delete(`/api/rewardplay/setting-options/${id}`),

    // Setting Stats Transforms CRUD
    getSettingStatsTransforms: (params) => api.get('/api/rewardplay/setting-stats-transforms', { params }),
    createSettingStatsTransform: (data) => api.post('/api/rewardplay/setting-stats-transforms', data),
    updateSettingStatsTransform: (id, data) => api.put(`/api/rewardplay/setting-stats-transforms/${id}`, data),
    deleteSettingStatsTransform: (id) => api.delete(`/api/rewardplay/setting-stats-transforms/${id}`),
    suggestSettingStatsTransforms: () => api.post('/api/rewardplay/setting-stats-transforms/suggest'),
    getSettingStatsTransformsAllowedKeys: () => api.get('/api/rewardplay/setting-stats-transforms/allowed-keys'),

    // Global data (accessible to both player and manage)
    getAllStats: () => api.get('/api/rewardplay/stats/all'),
    getRewardTypes: (mode) => api.get('/api/rewardplay/stats/reward-types', { params: { mode } }),

    // Setting Item Sets CRUD
    getSettingItemSets: (params) => api.get('/api/rewardplay/setting-item-sets', { params }),
    getItemsForZone: (params) => api.get('/api/rewardplay/setting-items/items-for-zone', { params }),
    createSettingItemSet: (data) => api.post('/api/rewardplay/setting-item-sets', data),
    updateSettingItemSet: (id, data) => api.put(`/api/rewardplay/setting-item-sets/${id}`, data),
    deleteSettingItemSet: (id) => api.delete(`/api/rewardplay/setting-item-sets/${id}`),

    // Setting Stack Bonuses CRUD
    getStackBonuses: (params) => api.get('/api/rewardplay/setting-stack-bonuses', { params }),
    getStackBonus: (id) => api.get(`/api/rewardplay/setting-stack-bonuses/${id}`),
    createStackBonus: (data) => api.post('/api/rewardplay/setting-stack-bonuses', data),
    updateStackBonus: (id, data) => api.put(`/api/rewardplay/setting-stack-bonuses/${id}`, data),
    deleteStackBonus: (id) => api.delete(`/api/rewardplay/setting-stack-bonuses/${id}`),
    suggestStackBonuses: () => api.post('/api/rewardplay/setting-stack-bonuses/suggest'),

    // Setting Daily Rewards (Manage)
    getDailyRewardConfigs: (params) => api.get('/api/rewardplay/setting-daily-rewards', { params }), // Expects month/year
    saveDailyRewardConfig: (data) => api.post('/api/rewardplay/setting-daily-rewards', data), // Update or Create based on date
    suggestDailyRewards: (data) => api.post('/api/rewardplay/setting-daily-rewards/suggest', data),

    // Setting Level Exps (Manage)
    getLevelExps: (params) => api.get('/api/rewardplay/setting-level-exps', { params }),
    getLevelExp: (id) => api.get(`/api/rewardplay/setting-level-exps/${id}`),
    createLevelExp: (data) => api.post('/api/rewardplay/setting-level-exps', data),
    updateLevelExp: (id, data) => api.put(`/api/rewardplay/setting-level-exps/${id}`, data),
    deleteLevelExp: (id) => api.delete(`/api/rewardplay/setting-level-exps/${id}`),
    suggestLevelExps: () => api.post('/api/rewardplay/setting-level-exps/suggest'),

    // Setting Events (Manage)
    getSettingEvents: (params) => api.get('/api/rewardplay/setting-events', { params }),
    getSettingEvent: (id) => api.get(`/api/rewardplay/setting-events/${id}`),
    suggestSettingEvents: () => api.post('/api/rewardplay/setting-events/suggest'),
    createSettingEvent: (data) => api.post('/api/rewardplay/setting-events', data),
    updateSettingEvent: (id, data) => {
      if (data instanceof FormData) {
        return api.post(`/api/rewardplay/setting-events/${id}`, data)
      }
      return api.put(`/api/rewardplay/setting-events/${id}`, data)
    },
    deleteSettingEvent: (id) => api.delete(`/api/rewardplay/setting-events/${id}`),

    // Setting Shop Items (Manage)
    getSettingShopItems: (params) => api.get('/api/rewardplay/setting-shop-items', { params }),
    getSettingShopItem: (id) => api.get(`/api/rewardplay/setting-shop-items/${id}`),
    suggestSettingShopItems: () => api.post('/api/rewardplay/setting-shop-items/suggest'),
    createSettingShopItem: (data) => api.post('/api/rewardplay/setting-shop-items', data),
    updateSettingShopItem: (id, data) => api.put(`/api/rewardplay/setting-shop-items/${id}`, data),
    deleteSettingShopItem: (id) => api.delete(`/api/rewardplay/setting-shop-items/${id}`),

    // Player Daily Rewards & Bag
    getPlayerDailyRewardState: () => api.get('/api/rewardplay/player/daily-rewards'), // Includes stack info
    collectDailyReward: () => api.post('/api/rewardplay/player/daily-rewards/collect'),
    getPlayerBag: () => api.get('/api/rewardplay/player/bag'),
    saveGears: (gears) => api.post('/api/rewardplay/player/bag/gears', { gears }),
    openBox: (userBagItemId, quantity = 1) =>
      api.post('/api/rewardplay/player/bag/open-box', { user_bag_item_id: userBagItemId, quantity: Math.max(1, Math.min(parseInt(quantity, 10) || 1, 99)) }),

    // Player Events (active events for popup)
    getPlayerEvents: () => api.get('/api/rewardplay/player/events'),

    // Player Shop (active shop items + purchase)
    getPlayerShop: () => api.get('/api/rewardplay/player/shop'),
    purchaseShopItem: (shopItemId, quantity = 1) =>
      api.post('/api/rewardplay/player/shop/purchase', { shop_item_id: shopItemId, quantity }),
  }
}

