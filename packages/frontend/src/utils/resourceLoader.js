/**
 * Resource loader for tracking real loading progress
 */
import axios from 'axios'
import { setCustomGlobalFiles, setBaseManifest } from './imageResolverRuntime'

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
 * @param {Function} onProgress - Progress callback (progress: 0-100)
 * @param {number} duration - Duration in milliseconds
 * @returns {Promise<void>}
 */
export function simulateUnzip(onProgress, duration = 2000) {
  return new Promise((resolve) => {
    let progress = 0
    const interval = 100
    const increment = (100 / duration) * interval

    const timer = setInterval(() => {
      progress += increment
      if (progress >= 100) {
        progress = 100
        clearInterval(timer)
        if (onProgress) onProgress(100)
        resolve()
      } else {
        if (onProgress) onProgress(progress)
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
    this.imagesBaseUrl = ''
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
   */
  onLoadingProgressCallback(callback) {
    this.onLoadingProgress = callback
    return this
  }

  /**
   * Set unzip progress callback
   */
  onUnzipProgressCallback(callback) {
    this.onUnzipProgress = callback
    return this
  }

  /**
   * Set backend images base URL (images_url from API) for manifest/custom fetch
   */
  setImagesBaseUrl(url) {
    this.imagesBaseUrl = url || ''
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
   * Fetch base manifest (image-manifest.json) from images base URL
   * Uses API endpoint if backendUrl is set, otherwise falls back to direct static file fetch
   */
  async fetchBaseManifest() {
    // Try API endpoint first if backendUrl is available
    if (this.backendUrl && this.gameApi && typeof this.gameApi.getManifest === 'function') {
      try {
        const res = await this.gameApi.getManifest()
        return res?.data || null
      } catch (err) {
        console.warn('Failed to fetch manifest via gameApi, falling back to static file', err)
        // Fall through to static file fetch
      }
    }

    // Fallback to direct static file fetch
    if (!this.imagesBaseUrl) return null
    const base = this.imagesBaseUrl.endsWith('/') ? this.imagesBaseUrl.slice(0, -1) : this.imagesBaseUrl
    const manifestUrl = `${base}/image-manifest.json`
    try {
      const res = await axios.get(manifestUrl, { timeout: 5000 })
      return res.data || null
    } catch (err) {
      console.warn(`Failed to fetch base manifest from ${manifestUrl}`, err)
      return null
    }
  }


  /**
   * Load all resources
   */
  async load() {
    const totalResources = 
      this.imageUrls.length + 
      this.scriptUrls.length + 
      this.stylesheetUrls.length + 
      this.fontUrls.length

    let loadedResources = 0

    const updateProgress = () => {
      loadedResources++
      const progress = totalResources > 0 
        ? (loadedResources / totalResources) * 100 
        : 100
      if (this.onLoadingProgress) {
        this.onLoadingProgress(progress)
      }
    }

    // Simulate unzip if needed (or replace with real unzip logic)
    if (this.onUnzipProgress) {
      try {
        const baseManifest = await this.fetchBaseManifest()
        if (baseManifest) {
          // Extract custom key from manifest if present
          const customList = baseManifest.custom || []
          // Remove custom key from manifest before setting it
          const { custom, ...manifestWithCustom } = baseManifest
          setBaseManifest(manifestWithCustom, this.imagesBaseUrl || '')
          if (customList && Array.isArray(customList)) {
            setCustomGlobalFiles(customList)
          }

          const convertUrls = Object.values(manifestWithCustom).map(url => {
            return this.imagesBaseUrl ? `${this.imagesBaseUrl}/${url}` : url
          })
          this.addImages(convertUrls)
        }
      } catch (err) {
        console.warn('Failed to fetch manifest', err)
      }
      await simulateUnzip(this.onUnzipProgress)
    }

    // Load images
    if (this.imageUrls.length > 0) {
      await loadImages(this.imageUrls, () => {
        updateProgress()
      })
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

