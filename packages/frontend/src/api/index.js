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
    // Ranking
    getRanking: () => api.get('/api/rewardplay/ranking'),
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
    getItemTypes: () => api.get('/api/rewardplay/setting-items/types'),
    createSettingItem: (data) => {
      // If data is FormData, use multipart/form-data, otherwise use JSON
      if (data instanceof FormData) {
        return api.post('/api/rewardplay/setting-items', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      }
      return api.post('/api/rewardplay/setting-items', data)
    },
    updateSettingItem: (id, data) => {
      // Otherwise use PUT with JSON
      if (data instanceof FormData) {
        if (!data.has('_method')) {
          data.append('_method', 'PUT')
        }
        return api.post(`/api/rewardplay/setting-items/${id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
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

    // Stats
    getConversionKeys: () => api.get('/api/rewardplay/stats/conversion-keys'),
    getAllStats: () => api.get('/api/rewardplay/stats/all'),

    // Setting Item Sets CRUD
    getSettingItemSets: (params) => api.get('/api/rewardplay/setting-item-sets', { params }),
    getItemsForZone: () => api.get('/api/rewardplay/setting-items/items-for-zone'),
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

    // Player Daily Rewards & Bag
    getPlayerDailyRewardState: () => api.get('/api/rewardplay/player/daily-rewards'), // Includes stack info
    collectDailyReward: () => api.post('/api/rewardplay/player/daily-rewards/collect'),
    getPlayerBag: () => api.get('/api/rewardplay/player/bag'),
  }
}

