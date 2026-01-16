/**
 * Resource loader for tracking real loading progress
 */
import axios from 'axios'
import { setBaseManifest } from './imageResolverRuntime'

/**
 * Load image and track progress
 * @param {string} url - Image URL
 * @returns {Promise<HTMLImageElement>}
 */
export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    // Avoid forcing CORS on hosts that don't send ACAO; set explicitly only when needed upstream
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

/**
 * Load multiple images
 * @param {Array<string>} urls - Array of image URLs
 * @param {Function} onProgress - Progress callback (loaded, total)
 * @returns {Promise<Array<HTMLImageElement>>}
 */
export function loadImages(urls, onProgress) {
  let loaded = 0
  const total = urls.length
  const images = []

  return Promise.all(
    urls.map((url, index) => {
      return loadImage(url)
        .then(img => {
          images[index] = img
          loaded++
          if (onProgress) {
            onProgress(loaded, total)
          }
          return img
        })
        .catch(err => {
          console.warn(`Failed to load image: ${url}`, err)
          loaded++
          if (onProgress) {
            onProgress(loaded, total)
          }
          return null
        })
    })
  ).then(() => images.filter(img => img !== null))
}

/**
 * Load script dynamically
 * @param {string} url - Script URL
 * @returns {Promise<void>}
 */
export function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = url
    script.onload = () => resolve()
    script.onerror = reject
    document.head.appendChild(script)
  })
}

/**
 * Load stylesheet dynamically
 * @param {string} url - Stylesheet URL
 * @returns {Promise<void>}
 */
export function loadStylesheet(url) {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = url
    link.onload = () => resolve()
    link.onerror = reject
    document.head.appendChild(link)
  })
}

/**
 * Load font
 * @param {string} url - Font URL
 * @param {string} fontFamily - Font family name
 * @returns {Promise<void>}
 */
export function loadFont(url, fontFamily) {
  return new Promise((resolve, reject) => {
    const font = new FontFace(fontFamily, `url(${url})`)
    font.load()
      .then(loadedFont => {
        document.fonts.add(loadedFont)
        resolve()
      })
      .catch(reject)
  })
}

  /**
   * Simulate unzip progress (can be replaced with real unzip logic)
   * @param {Function} onProgress - Progress callback (progress, current, total)
   * @param {number} duration - Duration in milliseconds
   * @param {number} totalSteps - Total number of steps for progress calculation
   * @returns {Promise<void>}
   */
export function simulateUnzip(onProgress, duration = 2000, totalSteps = 100) {
  return new Promise((resolve) => {
    let current = 0
    const interval = 100
    const increment = (totalSteps / duration) * interval

    // Notify start
    if (onProgress) onProgress(0, 0, totalSteps)

    const timer = setInterval(() => {
      current += increment
      if (current >= totalSteps) {
        current = totalSteps
        clearInterval(timer)
        if (onProgress) onProgress(100, totalSteps, totalSteps)
        resolve()
      } else {
        const progress = (current / totalSteps) * 100
        if (onProgress) onProgress(progress, Math.floor(current), totalSteps)
      }
    }, interval)
  })
}

/**
 * Main resource loader
 */
export class ResourceLoader {
  constructor() {
    this.imageUrls = []
    this.scriptUrls = []
    this.stylesheetUrls = []
    this.fontUrls = []
    this.onLoadingProgress = null
    this.onUnzipProgress = null
    this.backendUrl = ''
    this.gameApi = null
  }

  /**
   * Add image to load
   */
  addImage(url) {
    this.imageUrls.push(url)
    return this
  }

  /**
   * Add multiple images
   */
  addImages(urls) {
    this.imageUrls.push(...urls)
    return this
  }

  /**
   * Add script to load
   */
  addScript(url) {
    this.scriptUrls.push(url)
    return this
  }

  /**
   * Add stylesheet to load
   */
  addStylesheet(url) {
    this.stylesheetUrls.push(url)
    return this
  }

  /**
   * Add font to load
   */
  addFont(url, fontFamily) {
    this.fontUrls.push({ url, fontFamily })
    return this
  }

  /**
   * Set loading progress callback
   * Callback receives: (progress, current, total, currentFileName)
   */
  onLoadingProgressCallback(callback) {
    this.onLoadingProgress = callback
    return this
  }

  /**
   * Set unzip progress callback
   * Callback receives: (progress, current, total)
   */
  onUnzipProgressCallback(callback) {
    this.onUnzipProgress = callback
    return this
  }


  /**
   * Set backend API base URL for manifest API endpoint
   */
  setBackendUrl(url) {
    this.backendUrl = url || ''
    return this
  }

  /**
   * Set gameApi client (must include RewardPlay token via inject)
   */
  setGameApi(gameApi) {
    this.gameApi = gameApi || null
    return this
  }


  /**
   * Fetch custom images from API
   * Returns all images from zones user is in or manages (no zone_id needed)
   * @returns {Promise<Array>} Array of image objects with url, name, slug, type
   */
  async fetchCustomImages() {
    if (!this.gameApi || typeof this.gameApi.getCustomImages !== 'function') {
      console.warn('gameApi not available or getCustomImages method not found')
      return []
    }

    try {
      const res = await this.gameApi.getCustomImages()
      return res?.data?.datas?.images || []
    } catch (err) {
      console.warn('Failed to fetch custom images', err)
      return []
    }
  }

  /**
   * Fetch base manifest from API
   * Manifest now returns full URLs from backend
   */
  async fetchBaseManifest() {
    // Use API endpoint to get manifest with full URLs
    if (this.backendUrl && this.gameApi && typeof this.gameApi.getManifest === 'function') {
      try {
        const res = await this.gameApi.getManifest()
        return res?.data || null
      } catch (err) {
        console.warn('Failed to fetch manifest via gameApi', err)
        return null
      }
    }

    return null
  }



  /**
   * Calculate total resources count (including custom images)
   * This should be called before load() to get accurate totals
   */
  async calculateTotalResources() {
    // Fetch custom images to include them in total count
    let customImages = []
    if (this.gameApi && typeof this.gameApi.getCustomImages === 'function') {
      try {
        customImages = await this.fetchCustomImages()
      } catch (err) {
        console.warn('Failed to fetch custom images', err)
      }
    }

    const totalResources = 
      this.imageUrls.length + 
      this.scriptUrls.length + 
      this.stylesheetUrls.length + 
      this.fontUrls.length +
      customImages.length

    return {
      total: totalResources,
      customImages: customImages,
      breakdown: {
        images: this.imageUrls.length,
        customImages: customImages.length,
        scripts: this.scriptUrls.length,
        stylesheets: this.stylesheetUrls.length,
        fonts: this.fontUrls.length
      }
    }
  }

  /**
   * Load all resources
   */
  async load() {
    // Calculate totals first (including custom images)
    const totals = await this.calculateTotalResources()
    const totalResources = totals.total
    const customImages = totals.customImages

    let loadedResources = 0
    let currentFileName = ''

    const updateProgress = (fileName = '') => {
      loadedResources++
      currentFileName = fileName
      const progress = totalResources > 0 
        ? (loadedResources / totalResources) * 100 
        : 100
      if (this.onLoadingProgress) {
        // Pass progress with current file info for sub-text
        this.onLoadingProgress(progress, loadedResources, totalResources, currentFileName)
      }
    }

    // Notify start with totals
    if (this.onLoadingProgress && totalResources > 0) {
      this.onLoadingProgress(0, 0, totalResources, '')
    }

    // Simulate unzip if needed (or replace with real unzip logic)
    if (this.onUnzipProgress) {
      try {
        const baseManifest = await this.fetchBaseManifest()
        if (baseManifest) {
          // Remove custom key from manifest if present (not needed anymore)
          const { custom, ...manifestWithCustom } = baseManifest
          // Manifest values are already full URLs from backend
          setBaseManifest(manifestWithCustom)

          // Manifest values are already full URLs from backend, add to image loader
          const manifestUrls = Object.values(manifestWithCustom)
          this.addImages(manifestUrls)
        }
      } catch (err) {
        console.warn('Failed to fetch manifest', err)
      }
      // Pass callback that receives (progress, current, total)
      await simulateUnzip((progress, current, total) => {
        if (this.onUnzipProgress) {
          this.onUnzipProgress(progress, current, total)
        }
      })
    }

    // Load images
    if (this.imageUrls.length > 0) {
      await loadImages(this.imageUrls, () => {
        updateProgress()
      })
    }

    // Load custom images as part of assets (already full URLs from backend)
    if (customImages.length > 0) {
      for (const imageInfo of customImages) {
        try {
          // imageInfo.url is already a full URL from backend
          await loadImage(imageInfo.url)
          updateProgress(imageInfo.name || imageInfo.slug || '')
        } catch (err) {
          console.warn(`Failed to load custom image: ${imageInfo.url}`, err)
          updateProgress(imageInfo.name || imageInfo.slug || '')
        }
      }
    }

    // Load scripts
    for (const url of this.scriptUrls) {
      try {
        await loadScript(url)
        updateProgress()
      } catch (err) {
        console.warn(`Failed to load script: ${url}`, err)
        updateProgress()
      }
    }

    // Load stylesheets
    for (const url of this.stylesheetUrls) {
      try {
        await loadStylesheet(url)
        updateProgress()
      } catch (err) {
        console.warn(`Failed to load stylesheet: ${url}`, err)
        updateProgress()
      }
    }

    // Load fonts
    for (const font of this.fontUrls) {
      try {
        await loadFont(font.url, font.fontFamily)
        updateProgress()
      } catch (err) {
        console.warn(`Failed to load font: ${font.fontFamily}`, err)
        updateProgress()
      }
    }

    return {
      images: this.imageUrls.length,
      scripts: this.scriptUrls.length,
      stylesheets: this.stylesheetUrls.length,
      fonts: this.fontUrls.length
    }
  }
}

