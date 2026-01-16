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

  return {
    // Auth
    checkUser: () => api.get('/api/rewardplay/auth/check'),
    getUserData: () => api.get('/api/rewardplay/auth/user-data'),
    
    // Manifest
    getManifest: () => api.get('/api/rewardplay/manifest'),

    // Ranking
    getRanking: () => api.get('/api/rewardplay/ranking'),
    
    // Demo
    getDemo: () => api.get('/api/rewardplay/demo'),

    // Setting Items CRUD
    getSettingItems: (params) => api.get('/api/rewardplay/setting-items', { params }),
    getSettingItem: (id) => api.get(`/api/rewardplay/setting-items/${id}`),
    getItemTypes: () => api.get('/api/rewardplay/setting-items/types'),
    getCustomImages: (params) => api.get('/api/rewardplay/setting-items/custom-images', { params }),
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
      // If data is FormData, use PATCH with multipart/form-data, otherwise use PUT with JSON
      if (data instanceof FormData) {
        return api.patch(`/api/rewardplay/setting-items/${id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      }
      return api.put(`/api/rewardplay/setting-items/${id}`, data)
    },
    deleteSettingItem: (id) => api.delete(`/api/rewardplay/setting-items/${id}`),
  }
}

