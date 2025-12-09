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

  return {
    loadingProgress,
    unzipProgress,
    isLoading,
    isComplete
  }
}

