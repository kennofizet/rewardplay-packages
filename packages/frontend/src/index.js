import { createGameApi } from './api'
import RewardPlayPage from './pages/RewardPlayPage.vue'
import LoadingSource from './components/LoadingSource.vue'
import LoginScreen from './components/LoginScreen.vue'

/**
 * Install game module
 * @param {Object} app - Vue app instance
 * @param {Object} options - Configuration
 * @param {string} options.backendUrl - Backend API URL (required)
 * @param {string} options.token - RewardPlay token (required)
 */
export function installGameModule(app, options = {}) {
  const { backendUrl, token } = options

  if (!backendUrl) {
    throw new Error('Game Module: backendUrl is required')
  }

  if (!token) {
    throw new Error('Game Module: token is required')
  }

  const gameApi = createGameApi(backendUrl, token)
  
  app.provide('gameApi', gameApi)
  app.config.globalProperties.$gameApi = gameApi

  // Register components
  app.component('RewardPlayPage', RewardPlayPage)
  app.component('LoadingSource', LoadingSource)
  app.component('LoginScreen', LoginScreen)
}

export {
  createGameApi,
  RewardPlayPage,
  LoadingSource,
  LoginScreen,
}

// Export utilities
export { ResourceLoader } from './utils/resourceLoader'
export { useResourceLoader } from './composables/useResourceLoader'

export default {
  install: installGameModule,
}

