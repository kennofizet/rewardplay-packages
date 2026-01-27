<template>
  <div 
    class="rewardplay-isolated"
    :style="customStyles"
  >
    <div class="rewardplay-page">
      <LoginScreen
        :show-login="showLogin"
        :background-image="backgroundImage"
        @login-success="handleLoginSuccess"
        @login-failed="handleLoginFailed"
      />

      <ZoneSelectPage v-if="showZoneModal" :zones="zones" @select="handleZoneSelect" @close="showZoneModal = false" />

      <LoadingSource
        :is-loading="isLoading"
        :loading-progress="loadingProgress"
        :unzip-progress="unzipProgress"
        :user-data-progress="userDataProgress"
        :background-image="backgroundImage"
        :loading-title="translator('page.loading.title')"
        :loading-subtitle="translator('page.loading.subtitle')"
        :loading-labels="{
          assets: translator('page.loading.assets'),
          unzipping: translator('page.loading.unzipping'),
          userData: translator('page.loading.userData')
        }"
        :loading-sub-texts="loadingSubTexts"
        @loading-complete="handleLoadingComplete"
      />
      
      <div 
        v-if="!isLoading && !showLogin && !showZoneModal"
        class="game-content"
        :class="{ 'content-hidden': isLoading || showLogin }"
      >
        <MainGame :rotate="rotate" :is-manager="isManager" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, provide, computed, inject } from 'vue'
import LoadingSource from '../components/LoadingSource.vue'
import LoginScreen from '../components/LoginScreen.vue'
import ZoneSelectPage from '../components/game/ZoneSelectPage.vue'
import { ResourceLoader } from '../utils/resourceLoader'
import MainGame from '../components/MainGame.vue'
import { createTranslator } from '../i18n'
import { loadGlobalStats, loadGlobalTypes, getStatName, getTypeName } from '../utils/globalData'

const props = defineProps({
  // Resource URLs to load
  imageUrls: {
    type: Array,
    default: () => []
  },
  scriptUrls: {
    type: Array,
    default: () => []
  },
  stylesheetUrls: {
    type: Array,
    default: () => []
  },
  fontUrls: {
    type: Array,
    default: () => []
  },
  // Backend API base URL (passed from parent)
  backendUrl: {
    type: String,
    default: ''
  },
  backgroundImage: {
    type: String,
    default: null
  },
  // Enable auto-rotation when width < height (portrait mode)
  rotate: {
    type: Boolean,
    default: true
  },
  // Custom styles (CSS variables or inline styles)
  customStyles: {
    type: Object,
    default: () => ({})
  },
  // Language code (default: 'en')
  language: {
    type: String,
    default: 'en'
  }
})

// Merge custom styles with CSS variables
const customStyles = computed(() => {
  const styles = { ...props.customStyles }
  
  // Allow CSS custom properties to be passed
  if (props.customStyles && typeof props.customStyles === 'object') {
    Object.keys(props.customStyles).forEach(key => {
      if (key.startsWith('--')) {
        // CSS custom property
        styles[key] = props.customStyles[key]
      }
    })
  }
  
  return styles
})

const showLogin = ref(true)
const isManager = ref(false)
const isLoading = ref(false)
const loadingProgress = ref(0)
const unzipProgress = ref(0)
const userDataProgress = ref(0)
const loadingSubTexts = ref({
  assets: '',
  unzipping: '',
  userData: ''
})
const loginError = ref(null)
const gameApi = inject('gameApi', null)
const injectedBackendUrl = inject('backendUrl', '')

const zones = ref([])
const showZoneModal = ref(true)
const selectedZone = ref(null)

async function fetchZones() {
  try {
    if (gameApi && gameApi.getZones) {
      const resp = await gameApi.getZones()
      // accept multiple response shapes
      if (resp?.data?.datas?.zones) return resp.data.datas.zones
      if (resp?.data?.zones) return resp.data.zones
      if (Array.isArray(resp)) return resp
      if (resp?.zones) return resp.zones
    }
  } catch (e) {
    console.warn('Failed to fetch zones from gameApi', e)
  }

  return []
}

const handleLoginSuccess = async (payload = {}) => {
  // payload may contain { is_manager: boolean }
  isManager.value = !!payload.is_manager
  showLogin.value = false
  loginError.value = null
   
   // After successful login, fetch zones for the user and prompt selection if needed
   const userZones = await fetchZones()
   if (userZones && userZones.length == 0) {
    showZoneModal.value = false
   }

   if (userZones && userZones.length > 1) {
     zones.value = userZones
     showZoneModal.value = true
     // Defer loading resources until zone selected
     return
   }

   // If single zone, auto-select it
   if (userZones && userZones.length === 1) {
     handleZoneSelect(userZones[0])
     return // handleZoneSelect will handle loading
   }

   // If no zones or single zone case, load global data and resources
   isLoading.value = true
   await loadUserData()
   // Load global stats and types before loading resources
   if (gameApi) {
     await loadGlobalStats(gameApi)
     await loadGlobalTypes(gameApi)
   }
   loadAllResources()
}

const handleZoneSelect = async (zone) => {
  selectedZone.value = zone
  showZoneModal.value = false
  try { localStorage.setItem('selected_zone', JSON.stringify(zone)) } catch (e) {}
  if (gameApi && gameApi.setZone) gameApi.setZone(zone)

  // Proceed with loading now that zone is selected
  isLoading.value = true
  await loadUserData()
  // Load global stats and types before loading resources
  if (gameApi) {
    await loadGlobalStats(gameApi)
    await loadGlobalTypes(gameApi)
  }
  loadAllResources()
}

const handleLoginFailed = (error) => {
  loginError.value = error
  // Keep login screen visible to show error
}

const handleLoadingComplete = () => {
  setTimeout(() => {
    // isLoading.value = false
  }, 500)
}

const loadAllResources = async () => {
  const loader = new ResourceLoader()
  // Set backendUrl from parent prop or injected value
  const backendUrl = props.backendUrl || injectedBackendUrl
  if (backendUrl) {
    loader.setBackendUrl(backendUrl)
  }
  if (gameApi) {
    loader.setGameApi(gameApi)
  }

  // Add all resources to loader
  if (props.imageUrls.length > 0) {
    loader.addImages(props.imageUrls)
  }
  
  if (props.scriptUrls.length > 0) {
    props.scriptUrls.forEach(url => loader.addScript(url))
  }
  
  if (props.stylesheetUrls.length > 0) {
    props.stylesheetUrls.forEach(url => loader.addStylesheet(url))
  }
  
  if (props.fontUrls.length > 0) {
    props.fontUrls.forEach(font => {
      loader.addFont(font.url, font.fontFamily)
    })
  }

  // Set unzip progress callback with sub-text
  loader.onUnzipProgressCallback((progress, current, total) => {
    unzipProgress.value = Math.min(progress, 100)
    if (progress < 100) {
      if (current !== undefined && total !== undefined) {
        loadingSubTexts.value.unzipping = `${translator('page.loading.unzippingFiles')} ${current}/${total}`
      } else {
        loadingSubTexts.value.unzipping = translator('page.loading.unzippingFiles')
      }
    } else {
      loadingSubTexts.value.unzipping = translator('page.loading.unzipComplete')
    }
  })

  // Set loading progress callback with sub-text (includes custom images)
  loader.onLoadingProgressCallback((progress, current, total, currentFileName) => {
    loadingProgress.value = Math.min(progress, 100)
    if (progress < 100) {
      if (currentFileName) {
        // Show custom image being loaded
        loadingSubTexts.value.assets = `${translator('page.loading.loadingAssets')} ${current}/${total} - ${currentFileName}`
      } else if (total !== undefined && total > 0) {
        // Show general progress with current/total
        if (current !== undefined) {
          loadingSubTexts.value.assets = `${translator('page.loading.loadingAssets')} ${current}/${total}`
        } else {
          loadingSubTexts.value.assets = `${translator('page.loading.loadingAssets')} 0/${total}`
        }
      } else {
        loadingSubTexts.value.assets = translator('page.loading.loadingAssets')
      }
    } else {
      loadingSubTexts.value.assets = translator('page.loading.assetsLoaded')
    }
  })

  try {
    // Load base resources first
    await loader.load()
    
    // Ensure loading reaches 100%
    if (loadingProgress.value < 100) {
      loadingProgress.value = 100
      loadingSubTexts.value.assets = translator('page.loading.assetsLoaded')
    }
    
    // Ensure unzip reaches 100%
    if (unzipProgress.value < 100) {
      unzipProgress.value = 100
      loadingSubTexts.value.unzipping = translator('page.loading.unzipComplete')
    }
  } catch (error) {
    console.error('Error loading resources:', error)
    // Still show as loaded even if some resources failed
    loadingProgress.value = 100
    loadingSubTexts.value.assets = 'Assets load failed'
  }

  isLoading.value = false
}

const loadUserData = async () => {
  if (!gameApi) {
    console.warn('gameApi not available, skipping user data load')
    userDataProgress.value = 100
    loadingSubTexts.value.userData = translator('page.loading.noApiAvailable')
    return
  }

  try {
    userDataProgress.value = 0
    const totalSteps = 10 // Total steps for progress calculation
    let currentStep = 0
    loadingSubTexts.value.userData = `${translator('page.loading.loadingUserData')} ${currentStep}/${totalSteps}`
    
    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      if (currentStep < totalSteps - 1) {
        currentStep++
        userDataProgress.value = (currentStep / totalSteps) * 100
        loadingSubTexts.value.userData = `${translator('page.loading.loadingUserData')} ${currentStep}/${totalSteps}`
      }
    }, 100)

    const response = await gameApi.getUserData()
    
    clearInterval(progressInterval)
    currentStep = totalSteps
    userDataProgress.value = 100
    loadingSubTexts.value.userData = `${translator('page.loading.loadingUserData')} ${currentStep}/${totalSteps}`
    
    // Small delay to show completion
    setTimeout(() => {
      loadingSubTexts.value.userData = translator('page.loading.userDataLoaded')
    }, 200)
    
    if (response.data && response.data.success) {
      // Store user data to be provided to child components
      userData.value = response.data.datas
    }
  } catch (error) {
    console.error('Error loading user data:', error)
    // Still mark as complete even if failed
    userDataProgress.value = 100
    loadingSubTexts.value.userData = translator('page.loading.userDataLoadFailed')
  }
}

localStorage.removeItem('selected_zone')

// Create translator for the specified language
const translator = createTranslator(props.language)

// Provide language and userData to all child components
provide('language', props.language)
provide('translator', translator)
    // Provide wrapper functions that include translator
    provide('getStatName', (statKey) => getStatName(statKey, translator))
    provide('getTypeName', (type) => getTypeName(type, translator))

// Provide userData (will be set after getUserData loads)
const userData = ref(null)
provide('userData', userData)

// Login screen will auto check user on mount
// After successful login, loading will start
</script>

<style scoped>
/* CSS Isolation - Prevent parent styles from affecting RewardPlay package */
.rewardplay-isolated {
  /* CSS Containment for isolation */
  isolation: isolate !important;
  contain: layout style paint !important;
  
  /* Reset common properties that might leak from parent */
  display: block !important;
  position: relative !important;
  width: 100% !important;
  height: 100vh !important;
  overflow: hidden !important;
  box-sizing: border-box !important;
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  background: transparent !important;
  
  /* Reset typography that might be inherited */
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
  font-size: 16px !important;
  line-height: 1 !important;
  color: #000 !important;
  text-align: left !important;
  text-decoration: none !important;
  text-transform: none !important;
  letter-spacing: normal !important;
  word-spacing: normal !important;
  text-shadow: none !important;
  font-weight: normal !important;
  font-style: normal !important;
  
  /* Reset other common properties */
  box-shadow: none !important;
  outline: none !important;
  list-style: none !important;
  direction: ltr !important;
  vertical-align: baseline !important;
  white-space: normal !important;
  
  /* Prevent text selection issues */
  user-select: auto !important;
  -webkit-user-select: auto !important;
  -moz-user-select: auto !important;
  -ms-user-select: auto !important;
}

/* Reset common properties on all child elements to prevent parent CSS leakage */
.rewardplay-isolated :deep(*),
.rewardplay-isolated :deep(*::before),
.rewardplay-isolated :deep(*::after) {
  box-sizing: border-box;
}
.rewardplay-page {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.game-content {
  width: 100%;
  height: 100%;
  padding: 0;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  opacity: 1;
  visibility: visible;
  overflow: hidden;
}

.game-content.content-hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.game-content h1 {
  color: #ffffff;
  margin-bottom: 20px;
}

.game-content p {
  color: #cccccc;
}
</style>

