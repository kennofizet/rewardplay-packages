let baseManifest = null
let baseUrl = ''
let customGlobal = new Set()
let filenameMap = new Map()
let basenameMap = new Map()

export function setBaseManifest(manifest, imagesBaseUrl = '') {
  baseManifest = manifest || {}
  baseUrl = imagesBaseUrl || ''
  rebuildFilenameMap()
}

export function setCustomGlobalFiles(files) {
  if (Array.isArray(files)) {
    customGlobal = new Set(files)
  } else {
    customGlobal = new Set()
  }
}

function rebuildFilenameMap() {
  filenameMap = new Map()
  basenameMap = new Map()
  if (!baseManifest) return
  Object.entries(baseManifest).forEach(([key, file]) => {
    filenameMap.set(file, key)
    const parts = file.split('/')
    const base = parts[parts.length - 1]
    if (base) {
      basenameMap.set(base, key)
    }
  })
}

export function getFileImageUrl(key) {
  if (!key) return ''
  const normKey = key.startsWith('/') ? key.slice(1) : key

  // If no manifest loaded, fallback to base+filename
  if (!baseManifest) {
    const base = baseUrl ? (baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl) : ''
    return base ? `${base}/${normKey}` : `/${normKey}`
  }

  let resolvedKey = key
  if (!baseManifest[key] && filenameMap.has(key)) {
    resolvedKey = filenameMap.get(key)
  } else if (!baseManifest[key] && basenameMap.has(normKey)) {
    resolvedKey = basenameMap.get(normKey)
  }

  const filename = baseManifest[resolvedKey]
  if (!filename) {
    const base = baseUrl ? (baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl) : ''
    return base ? `${base}/${normKey}` : `/${normKey}`
  }

  const base = baseUrl ? (baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl) : ''
  
  // const isGlobal = resolvedKey.startsWith('global.')
  // if (isGlobal && customGlobal.has(filename)) {
  //   return base ? `${base}/custom/global/${filename}` : `/custom/global/${filename}`
  // }

  return base ? `${base}/${filename}` : `/${filename}`
}
