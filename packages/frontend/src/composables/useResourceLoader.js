import { ref } from 'vue'
import { ResourceLoader } from '../utils/resourceLoader'

/**
 * Composable for loading resources with progress tracking
 */
export function useResourceLoader() {
  const loadingProgress = ref(0)
  const unzipProgress = ref(0)
  const isLoading = ref(false)
  const isComplete = ref(false)

  const loadResources = async (options = {}) => {
    const {
      imageUrls = [],
      scriptUrls = [],
      stylesheetUrls = [],
      fontUrls = [],
      enableUnzip = true
    } = options

    isLoading.value = true
    isComplete.value = false
    loadingProgress.value = 0
    unzipProgress.value = 0

    const loader = new ResourceLoader()

    // Add resources
    if (imageUrls.length > 0) {
      loader.addImages(imageUrls)
    }
    
    scriptUrls.forEach(url => loader.addScript(url))
    stylesheetUrls.forEach(url => loader.addStylesheet(url))
    fontUrls.forEach(font => {
      loader.addFont(font.url, font.fontFamily)
    })

    // Set progress callbacks
    loader.onLoadingProgressCallback((progress) => {
      loadingProgress.value = Math.min(progress, 100)
    })

    if (enableUnzip) {
      loader.onUnzipProgressCallback((progress) => {
        unzipProgress.value = Math.min(progress, 100)
      })
    } else {
      unzipProgress.value = 100
    }

    try {
      await loader.load()
      
      // Ensure progress reaches 100%
      loadingProgress.value = 100
      if (!enableUnzip) {
        unzipProgress.value = 100
      }
      
      isComplete.value = true
    } catch (error) {
      console.error('Error loading resources:', error)
      loadingProgress.value = 100
      unzipProgress.value = 100
      isComplete.value = true
    } finally {
      isLoading.value = false
    }

    return {
      images: imageUrls.length,
      scripts: scriptUrls.length,
      stylesheets: stylesheetUrls.length,
      fonts: fontUrls.length
    }
  }

  return {
    loadingProgress,
    unzipProgress,
    isLoading,
    isComplete,
    loadResources
  }
}

