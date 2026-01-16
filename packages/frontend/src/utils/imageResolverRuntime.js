let baseManifest = null
let urlMap = new Map()
let basenameMap = new Map()

export function setBaseManifest(manifest) {
  baseManifest = manifest || {}
  rebuildUrlMap()
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
  
  // If already a full URL (http, https, or any protocol), return as-is
  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(key)) {
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

  const fileUrl = baseManifest[resolvedKey]
  if (!fileUrl) {
    // If not found in manifest, return relative path
    return `/${normKey}`
  }

  // Manifest values are now full URLs from backend, return directly
  return fileUrl
}
