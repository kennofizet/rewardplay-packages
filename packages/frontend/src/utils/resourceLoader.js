/**
 * Resource loader for tracking real loading progress
 */

/**
 * Load image and track progress
 * @param {string} url - Image URL
 * @returns {Promise<HTMLImageElement>}
 */
export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
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

    // Simulate unzip if needed (or replace with real unzip logic)
    if (this.onUnzipProgress) {
      await simulateUnzip(this.onUnzipProgress)
    }

    return {
      images: this.imageUrls.length,
      scripts: this.scriptUrls.length,
      stylesheets: this.stylesheetUrls.length,
      fonts: this.fontUrls.length
    }
  }
}

