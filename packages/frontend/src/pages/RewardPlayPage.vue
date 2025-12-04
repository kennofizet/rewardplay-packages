<template>
  <div class="rewardplay-page">
    <LoginScreen
      :show-login="showLogin"
      :background-image="backgroundImage"
      @login-success="handleLoginSuccess"
      @login-failed="handleLoginFailed"
    />

    <LoadingSource
      :is-loading="isLoading"
      :loading-progress="loadingProgress"
      :unzip-progress="unzipProgress"
      :background-image="backgroundImage"
      @loading-complete="handleLoadingComplete"
    />
    
    <div 
      class="game-content"
      :class="{ 'content-hidden': isLoading || showLogin }"
    >
      <MainGame :images-url="imagesUrl" :rotate="rotate" />
    </div>
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import LoadingSource from '../components/LoadingSource.vue'
import LoginScreen from '../components/LoginScreen.vue'
import { ResourceLoader } from '../utils/resourceLoader'
import MainGame from '../components/MainGame.vue'

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
  backgroundImage: {
    type: String,
    default: null
  },
  // Enable unzip simulation
  enableUnzip: {
    type: Boolean,
    default: true
  },
  // Enable auto-rotation when width < height (portrait mode)
  rotate: {
    type: Boolean,
    default: true
  }
})

const showLogin = ref(true)
const isLoading = ref(false)
const loadingProgress = ref(0)
const unzipProgress = ref(0)
const loginError = ref(null)
const imagesUrl = ref('')

const handleLoginSuccess = (userData) => {
  showLogin.value = false
  loginError.value = null
  // Save images URL from user data
  imagesUrl.value = userData.imagesUrl || ''
  // Start loading resources after successful login
  isLoading.value = true
  loadAllResources()
}

const handleLoginFailed = (error) => {
  loginError.value = error
  // Keep login screen visible to show error
}

const handleLoadingComplete = () => {
  setTimeout(() => {
    isLoading.value = false
  }, 500)
}

const loadAllResources = async () => {
  const loader = new ResourceLoader()

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

  // Set progress callbacks
  loader.onLoadingProgressCallback((progress) => {
    loadingProgress.value = Math.min(progress, 100)
  })

  if (props.enableUnzip) {
    loader.onUnzipProgressCallback((progress) => {
      unzipProgress.value = Math.min(progress, 100)
    })
  } else {
    unzipProgress.value = 100
  }

  try {
    await loader.load()
    
    // Ensure loading reaches 100%
    if (loadingProgress.value < 100) {
      loadingProgress.value = 100
    }
  } catch (error) {
    console.error('Error loading resources:', error)
    // Still show as loaded even if some resources failed
    loadingProgress.value = 100
    if (!props.enableUnzip) {
      unzipProgress.value = 100
    }
  }
}

// Provide images URL to all child components
provide('imagesUrl', imagesUrl)

// Login screen will auto check user on mount
// After successful login, loading will start
</script>

<style scoped>
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

