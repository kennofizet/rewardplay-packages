let baseManifest = null
let urlMap = new Map()
let basenameMap = new Map()
/** Preloaded images as blob URLs so <img> uses in-memory cache instead of re-fetching */
const preloadedBlobByKey = new Map()
const preloadedBlobByUrl = new Map()

function revokePreloadedBlobs() {
  for (const blobUrl of preloadedBlobByKey.values()) {
    try { URL.revokeObjectURL(blobUrl) } catch (_) {}
  }
  for (const blobUrl of preloadedBlobByUrl.values()) {
    try { URL.revokeObjectURL(blobUrl) } catch (_) {}
  }
  preloadedBlobByKey.clear()
  preloadedBlobByUrl.clear()
}

export function setBaseManifest(manifest) {
  revokePreloadedBlobs()
  baseManifest = manifest || {}
  rebuildUrlMap()
}

/**
 * Register a preloaded blob URL so getFileImageUrl returns it (in-memory cache).
 * No canvas used, so works for cross-origin when fetch succeeds (CORS or same-origin).
 * @param {string} url - Image URL
 * @param {string} blobUrl - URL.createObjectURL(blob) from fetch(url).then(r => r.blob())
 */
export function registerPreloadedBlobUrl(url, blobUrl) {
  if (!url || !blobUrl) return
  preloadedBlobByUrl.set(url, blobUrl)
  const key = urlMap.get(url)
  if (key) preloadedBlobByKey.set(key, blobUrl)
}

function rebuildUrlMap() {
  urlMap = new Map()
  basenameMap = new Map()
  if (!baseManifest) return
  Object.entries(baseManifest).forEach(([key, fileUrl]) => {
    // Map full URL to manifest key for reverse lookup
    urlMap.set(fileUrl, key)
    // Extract basename from URL for filename-based lookup
    const parts = fileUrl.split('/')
    const basename = parts[parts.length - 1]
    if (basename) {
      basenameMap.set(basename, key)
    }
  })
}

export function getFileImageUrl(key) {
  if (!key) return ''

  // If already a full URL, return preloaded blob if we have it, else as-is
  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(key)) {
    const blobUrl = preloadedBlobByUrl.get(key)
    if (blobUrl) return blobUrl
    return key
  }

  const normKey = key.startsWith('/') ? key.slice(1) : key

  // If no manifest loaded, return relative path
  if (!baseManifest) {
    return `/${normKey}`
  }

  let resolvedKey = key
  // Check if key is a URL that exists in manifest (reverse lookup)
  if (!baseManifest[key] && urlMap.has(key)) {
    resolvedKey = urlMap.get(key)
  } else if (!baseManifest[key] && basenameMap.has(normKey)) {
    // Check if basename matches any manifest entry
    resolvedKey = basenameMap.get(normKey)
  }

  // Return preloaded blob URL if we have it (so img uses in-memory cache)
  const preloadedBlob = preloadedBlobByKey.get(resolvedKey)
  if (preloadedBlob) return preloadedBlob

  const fileUrl = baseManifest[resolvedKey]
  if (!fileUrl) {
    // If not found in manifest, return relative path
    return `/${normKey}`
  }

  // Manifest values are now full URLs from backend, return directly
  return fileUrl
}
