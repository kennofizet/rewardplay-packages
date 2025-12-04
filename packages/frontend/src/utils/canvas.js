/**
 * Canvas utility functions for generating game UI elements
 */

/**
 * Create canvas element
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @returns {HTMLCanvasElement}
 */
export function createCanvas(width, height) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}

/**
 * Draw background image on canvas
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {string} imageUrl - Background image URL
 * @param {Object} options - Drawing options
 */
export function drawBackground(canvas, imageUrl, options = {}) {
  const ctx = canvas.getContext('2d')
  const { width, height } = canvas
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height)
  
  // Create gradient background as fallback
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, options.startColor || '#1a1a2e')
  gradient.addColorStop(1, options.endColor || '#16213e')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  
  // Load and draw image if provided
  if (imageUrl) {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height)
    }
    img.src = imageUrl
  }
}

/**
 * Draw loading bar on canvas
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {number} progress - Progress percentage (0-100)
 * @param {Object} options - Drawing options
 */
export function drawLoadingBar(canvas, progress, options = {}) {
  const ctx = canvas.getContext('2d')
  const { width, height } = canvas
  
  const barWidth = options.width || width * 0.6
  const barHeight = options.height || 20
  const x = (width - barWidth) / 2
  const y = options.y || height * 0.7
  
  const progressWidth = (barWidth * progress) / 100
  
  // Draw background bar
  ctx.fillStyle = options.bgColor || 'rgba(0, 0, 0, 0.5)'
  ctx.fillRect(x, y, barWidth, barHeight)
  
  // Draw progress bar
  const gradient = ctx.createLinearGradient(x, y, x + progressWidth, y)
  gradient.addColorStop(0, options.progressStartColor || '#4CAF50')
  gradient.addColorStop(1, options.progressEndColor || '#45a049')
  ctx.fillStyle = gradient
  ctx.fillRect(x, y, progressWidth, barHeight)
  
  // Draw border
  ctx.strokeStyle = options.borderColor || '#ffffff'
  ctx.lineWidth = options.borderWidth || 2
  ctx.strokeRect(x, y, barWidth, barHeight)
  
  // Draw progress text
  if (options.showText !== false) {
    ctx.fillStyle = options.textColor || '#ffffff'
    ctx.font = options.font || '16px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(
      `${Math.round(progress)}%`,
      x + barWidth / 2,
      y + barHeight / 2
    )
  }
}

/**
 * Draw text on canvas
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {string} text - Text to draw
 * @param {Object} options - Drawing options
 */
export function drawText(canvas, text, options = {}) {
  const ctx = canvas.getContext('2d')
  const { width, height } = canvas
  
  const x = options.x || width / 2
  const y = options.y || height * 0.6
  
  ctx.fillStyle = options.color || '#ffffff'
  ctx.font = options.font || '18px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, x, y)
}

/**
 * Draw multiple progress indicators
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {Array} progressItems - Array of {label, progress} objects
 * @param {Object} options - Drawing options
 */
export function drawProgressItems(canvas, progressItems, options = {}) {
  const ctx = canvas.getContext('2d')
  const { width, height } = canvas
  
  const startY = options.startY || height * 0.75
  const itemHeight = options.itemHeight || 30
  const spacing = options.spacing || 10
  const fontSize = options.fontSize || 14
  
  progressItems.forEach((item, index) => {
    const y = startY + (index * (itemHeight + spacing))
    
    // Draw label
    ctx.fillStyle = options.labelColor || '#cccccc'
    ctx.font = `${fontSize}px Arial`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText(item.label, width * 0.2, y)
    
    // Draw progress percentage
    ctx.fillStyle = options.progressColor || '#ffffff'
    ctx.textAlign = 'right'
    ctx.fillText(`${Math.round(item.progress)}%`, width * 0.8, y)
  })
}

/**
 * Generate canvas image data URL
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @returns {string} Data URL
 */
export function canvasToDataURL(canvas) {
  return canvas.toDataURL('image/png')
}

