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
    
    // Ranking
    getRanking: () => api.get('/api/rewardplay/ranking'),
    
    // Demo
    getDemo: () => api.get('/api/rewardplay/demo'),
  }
}

