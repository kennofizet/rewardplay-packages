import { createGameApi } from './api'
import RewardPlayPage from './pages/RewardPlayPage.vue'
import ComingSoonPage from './pages/ComingSoonPage.vue'
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
  // Provide backendUrl so components (e.g., RewardPlayPage) can consume it without re-passing
  app.provide('backendUrl', backendUrl)
  app.config.globalProperties.$backendUrl = backendUrl

  // Register components
  app.component('RewardPlayPage', RewardPlayPage)
  app.component('ComingSoonPage', ComingSoonPage)
  app.component('LoadingSource', LoadingSource)
  app.component('LoginScreen', LoginScreen)
}

export {
  createGameApi,
  RewardPlayPage,
  ComingSoonPage,
  LoadingSource,
  LoginScreen,
}

// Export utilities
export { ResourceLoader } from './utils/resourceLoader'
export { useResourceLoader } from './composables/useResourceLoader'

// Export i18n
export { t, createTranslator, translations } from './i18n'

export default {
  install: installGameModule,
}

