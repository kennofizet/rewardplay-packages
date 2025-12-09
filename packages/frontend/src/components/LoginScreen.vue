<template>
  <div 
    v-if="showLogin"
    class="login-overlay"
    :class="{ 'login-active': showLogin }"
  >
    <canvas 
      ref="canvasRef" 
      class="login-canvas"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick, inject } from 'vue'

const props = defineProps({
  showLogin: {
    type: Boolean,
    default: false
  },
  backgroundImage: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['login-success', 'login-failed'])

const gameApi = inject('gameApi')
const canvasRef = ref(null)
const error = ref(null)
const errorType = ref(null) // 'no-api', 'invalid-token', 'connection-failed', 'server-error'
const status = ref('checking') // 'checking', 'success', 'error'
let animationFrameId = null
let pulseAnimation = 0
let errorAnimation = 0

const drawBackground = (ctx, width, height, imageUrl) => {
  // Clear canvas
  ctx.clearRect(0, 0, width, height)
  
  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#1a1a2e')
  gradient.addColorStop(1, '#16213e')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  
  // Load and draw image if provided
  if (imageUrl) {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height)
      drawContent(ctx, width, height)
    }
    img.src = imageUrl
  }
}

const drawContent = (ctx, width, height) => {
  const centerX = width / 2
  const centerY = height / 2

  if (status.value === 'checking') {
    drawCheckingAnimation(ctx, centerX, centerY, width, height)
  } else if (status.value === 'error') {
    drawErrorIcon(ctx, centerX, centerY, width, height)
  } else if (status.value === 'success') {
    drawSuccessIcon(ctx, centerX, centerY, width, height)
  }
}

const drawCheckingAnimation = (ctx, centerX, centerY, width, height) => {
  // Draw pulsing circle
  const radius = 40 + Math.sin(pulseAnimation) * 10
  const opacity = 0.5 + Math.sin(pulseAnimation) * 0.3
  
  ctx.save()
  ctx.globalAlpha = opacity
  
  // Outer glow
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius + 20)
  gradient.addColorStop(0, 'rgba(76, 175, 80, 0.6)')
  gradient.addColorStop(0.5, 'rgba(76, 175, 80, 0.3)')
  gradient.addColorStop(1, 'rgba(76, 175, 80, 0)')
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius + 20, 0, Math.PI * 2)
  ctx.fill()
  
  // Main circle
  ctx.fillStyle = 'rgba(76, 175, 80, 0.8)'
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
  ctx.fill()
  
  // Inner spinning dots
  ctx.globalAlpha = 1
  ctx.fillStyle = '#ffffff'
  const dotCount = 8
  const dotRadius = 4
  const dotDistance = radius - 15
  
  for (let i = 0; i < dotCount; i++) {
    const angle = (pulseAnimation * 2 + (i / dotCount) * Math.PI * 2)
    const x = centerX + Math.cos(angle) * dotDistance
    const y = centerY + Math.sin(angle) * dotDistance
    const dotOpacity = 0.3 + (Math.sin(angle + pulseAnimation) + 1) / 2 * 0.7
    
    ctx.globalAlpha = dotOpacity
    ctx.beginPath()
    ctx.arc(x, y, dotRadius, 0, Math.PI * 2)
    ctx.fill()
  }
  
  ctx.restore()
}

const drawErrorIcon = (ctx, centerX, centerY, width, height) => {
  errorAnimation += 0.05
  const size = Math.min(width, height) * 0.12
  const x = centerX
  const y = centerY - size * 0.5
  
  ctx.save()
  
  // Pulsing error circle background with glow
  const pulse = Math.sin(errorAnimation * 2) * 0.2 + 1
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * pulse)
  gradient.addColorStop(0, 'rgba(255, 68, 68, 0.9)')
  gradient.addColorStop(0.5, 'rgba(255, 68, 68, 0.5)')
  gradient.addColorStop(1, 'rgba(255, 68, 68, 0)')
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(x, y, size * pulse, 0, Math.PI * 2)
  ctx.fill()
  
  // Draw main error circle with border
  ctx.fillStyle = '#ff4444'
  ctx.beginPath()
  ctx.arc(x, y, size * 0.7, 0, Math.PI * 2)
  ctx.fill()
  
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = size * 0.05
  ctx.stroke()
  
  // Draw X icon (thicker, more visible)
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = size * 0.2
  ctx.lineCap = 'round'
  const lineLength = size * 0.45
  
  ctx.beginPath()
  ctx.moveTo(x - lineLength, y - lineLength)
  ctx.lineTo(x + lineLength, y + lineLength)
  ctx.stroke()
  
  ctx.beginPath()
  ctx.moveTo(x + lineLength, y - lineLength)
  ctx.lineTo(x - lineLength, y + lineLength)
  ctx.stroke()
  
  // Draw error type specific graphics
  if (errorType.value === 'no-api') {
    drawNoApiError(ctx, centerX, centerY + size * 1.2, width, height)
  } else if (errorType.value === 'invalid-token') {
    drawInvalidTokenError(ctx, centerX, centerY + size * 1.2, width, height)
  } else if (errorType.value === 'connection-failed') {
    drawConnectionError(ctx, centerX, centerY + size * 1.2, width, height)
  } else if (errorType.value === 'server-error') {
    drawServerError(ctx, centerX, centerY + size * 1.2, width, height)
  } else {
    drawGenericError(ctx, centerX, centerY + size * 1.2, width, height)
  }
  
  ctx.restore()
}

const drawNoApiError = (ctx, centerX, centerY, width, height) => {
  const iconSize = Math.min(width, height) * 0.08
  const spacing = iconSize * 1.5
  
  // Draw broken chain/connection icon
  ctx.strokeStyle = '#ff6666'
  ctx.lineWidth = iconSize * 0.15
  ctx.lineCap = 'round'
  
  // Left broken link
  ctx.beginPath()
  ctx.arc(centerX - spacing, centerY, iconSize * 0.4, 0, Math.PI * 2)
  ctx.stroke()
  
  // Right broken link
  ctx.beginPath()
  ctx.arc(centerX + spacing, centerY, iconSize * 0.4, 0, Math.PI * 2)
  ctx.stroke()
  
  // Broken connection line with gap
  ctx.beginPath()
  ctx.moveTo(centerX - spacing + iconSize * 0.4, centerY)
  ctx.lineTo(centerX - spacing * 0.3, centerY)
  ctx.stroke()
  
  ctx.beginPath()
  ctx.moveTo(centerX + spacing * 0.3, centerY)
  ctx.lineTo(centerX + spacing - iconSize * 0.4, centerY)
  ctx.stroke()
  
  // X marks on broken parts
  ctx.strokeStyle = '#ff4444'
  ctx.lineWidth = iconSize * 0.1
  const xSize = iconSize * 0.2
  
  ctx.beginPath()
  ctx.moveTo(centerX - xSize, centerY - xSize)
  ctx.lineTo(centerX + xSize, centerY + xSize)
  ctx.stroke()
  
  ctx.beginPath()
  ctx.moveTo(centerX + xSize, centerY - xSize)
  ctx.lineTo(centerX - xSize, centerY + xSize)
  ctx.stroke()
}

const drawInvalidTokenError = (ctx, centerX, centerY, width, height) => {
  const iconSize = Math.min(width, height) * 0.08
  
  // Draw key icon with broken lock
  ctx.strokeStyle = '#ff6666'
  ctx.fillStyle = '#ff6666'
  ctx.lineWidth = iconSize * 0.15
  ctx.lineCap = 'round'
  
  // Lock body (broken)
  const lockX = centerX - iconSize * 0.3
  const lockY = centerY
  const lockWidth = iconSize * 0.6
  const lockHeight = iconSize * 0.8
  
  ctx.strokeRect(lockX, lockY, lockWidth, lockHeight)
  
  // Broken lock shackle
  ctx.beginPath()
  ctx.arc(lockX + lockWidth / 2, lockY - iconSize * 0.2, iconSize * 0.3, Math.PI, 0, false)
  ctx.stroke()
  
  // Crack line through lock
  ctx.strokeStyle = '#ff0000'
  ctx.lineWidth = iconSize * 0.1
  ctx.beginPath()
  ctx.moveTo(lockX + lockWidth * 0.2, lockY + lockHeight * 0.2)
  ctx.lineTo(lockX + lockWidth * 0.8, lockY + lockHeight * 0.8)
  ctx.stroke()
  
  // Key (invalid/crossed out)
  const keyX = centerX + iconSize * 0.5
  const keyY = centerY
  
  ctx.strokeStyle = '#ff6666'
  ctx.lineWidth = iconSize * 0.15
  
  // Key head
  ctx.beginPath()
  ctx.arc(keyX, keyY, iconSize * 0.25, 0, Math.PI * 2)
  ctx.stroke()
  
  // Key shaft
  ctx.beginPath()
  ctx.moveTo(keyX + iconSize * 0.25, keyY)
  ctx.lineTo(keyX + iconSize * 0.6, keyY)
  ctx.stroke()
  
  // Cross out the key
  ctx.strokeStyle = '#ff0000'
  ctx.lineWidth = iconSize * 0.12
  const crossSize = iconSize * 0.4
  ctx.beginPath()
  ctx.moveTo(keyX - crossSize * 0.3, keyY - crossSize * 0.3)
  ctx.lineTo(keyX + crossSize * 0.3, keyY + crossSize * 0.3)
  ctx.stroke()
  
  ctx.beginPath()
  ctx.moveTo(keyX + crossSize * 0.3, keyY - crossSize * 0.3)
  ctx.lineTo(keyX - crossSize * 0.3, keyY + crossSize * 0.3)
  ctx.stroke()
}

const drawConnectionError = (ctx, centerX, centerY, width, height) => {
  const iconSize = Math.min(width, height) * 0.08
  const spacing = iconSize * 1.2
  
  // Draw WiFi/connection signal with broken lines
  ctx.strokeStyle = '#ff6666'
  ctx.lineWidth = iconSize * 0.12
  ctx.lineCap = 'round'
  
  // Server/device on left
  ctx.fillStyle = '#ff6666'
  ctx.fillRect(centerX - spacing * 1.5, centerY - iconSize * 0.3, iconSize * 0.6, iconSize * 0.6)
  
  // Client/device on right
  ctx.fillRect(centerX + spacing * 0.9, centerY - iconSize * 0.3, iconSize * 0.6, iconSize * 0.6)
  
  // Broken connection waves
  const waveCount = 3
  for (let i = 0; i < waveCount; i++) {
    const waveY = centerY + (i - 1) * iconSize * 0.3
    const waveAmplitude = iconSize * 0.15 * (waveCount - i) / waveCount
    const waveLength = spacing * 0.8
    
    ctx.beginPath()
    ctx.moveTo(centerX - spacing * 1.2, waveY)
    
    // Draw broken wave
    const segments = 4
    for (let j = 0; j < segments; j++) {
      const startX = centerX - spacing * 1.2 + (j * waveLength / segments)
      const endX = centerX - spacing * 1.2 + ((j + 1) * waveLength / segments)
      const midX = (startX + endX) / 2
      
      if (j % 2 === 0) {
        // Draw segment
        ctx.quadraticCurveTo(midX, waveY - waveAmplitude, endX, waveY)
      } else {
        // Skip segment (broken)
        ctx.moveTo(endX, waveY)
      }
    }
    ctx.stroke()
  }
  
  // X mark in center
  ctx.strokeStyle = '#ff0000'
  ctx.lineWidth = iconSize * 0.15
  const xSize = iconSize * 0.3
  ctx.beginPath()
  ctx.moveTo(centerX - xSize, centerY - xSize)
  ctx.lineTo(centerX + xSize, centerY + xSize)
  ctx.stroke()
  
  ctx.beginPath()
  ctx.moveTo(centerX + xSize, centerY - xSize)
  ctx.lineTo(centerX - xSize, centerY + xSize)
  ctx.stroke()
}

const drawServerError = (ctx, centerX, centerY, width, height) => {
  const iconSize = Math.min(width, height) * 0.08
  
  // Draw server with warning symbol
  ctx.strokeStyle = '#ff6666'
  ctx.fillStyle = '#ff6666'
  ctx.lineWidth = iconSize * 0.12
  
  // Server box
  const serverX = centerX - iconSize * 0.4
  const serverY = centerY - iconSize * 0.4
  const serverWidth = iconSize * 0.8
  const serverHeight = iconSize * 1.2
  
  ctx.strokeRect(serverX, serverY, serverWidth, serverHeight)
  
  // Server slots
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(
      serverX + iconSize * 0.1,
      serverY + iconSize * 0.15 + i * iconSize * 0.3,
      iconSize * 0.6,
      iconSize * 0.15
    )
  }
  
  // Warning triangle on server
  ctx.fillStyle = '#ffaa00'
  ctx.beginPath()
  ctx.moveTo(centerX + iconSize * 0.3, centerY - iconSize * 0.2)
  ctx.lineTo(centerX + iconSize * 0.6, centerY + iconSize * 0.2)
  ctx.lineTo(centerX, centerY + iconSize * 0.2)
  ctx.closePath()
  ctx.fill()
  
  // Exclamation mark
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(centerX + iconSize * 0.3, centerY - iconSize * 0.05, iconSize * 0.08, 0, Math.PI * 2)
  ctx.fill()
  
  ctx.fillRect(centerX + iconSize * 0.3 - iconSize * 0.02, centerY + iconSize * 0.05, iconSize * 0.04, iconSize * 0.1)
}

const drawGenericError = (ctx, centerX, centerY, width, height) => {
  const iconSize = Math.min(width, height) * 0.08
  
  // Draw warning triangle
  ctx.fillStyle = '#ffaa00'
  ctx.beginPath()
  ctx.moveTo(centerX, centerY - iconSize * 0.6)
  ctx.lineTo(centerX + iconSize * 0.5, centerY + iconSize * 0.4)
  ctx.lineTo(centerX - iconSize * 0.5, centerY + iconSize * 0.4)
  ctx.closePath()
  ctx.fill()
  
  // Exclamation mark
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(centerX, centerY - iconSize * 0.1, iconSize * 0.1, 0, Math.PI * 2)
  ctx.fill()
  
  ctx.fillRect(centerX - iconSize * 0.03, centerY + iconSize * 0.05, iconSize * 0.06, iconSize * 0.15)
  
  // Error lines around
  ctx.strokeStyle = '#ff6666'
  ctx.lineWidth = iconSize * 0.08
  const lineLength = iconSize * 0.4
  const lineY = centerY + iconSize * 0.7
  
  for (let i = 0; i < 3; i++) {
    const lineX = centerX + (i - 1) * iconSize * 0.5
    ctx.beginPath()
    ctx.moveTo(lineX, lineY)
    ctx.lineTo(lineX, lineY + iconSize * 0.3)
    ctx.stroke()
  }
}

const drawSuccessIcon = (ctx, centerX, centerY, width, height) => {
  const size = Math.min(width, height) * 0.15
  const x = centerX
  const y = centerY - size * 0.3
  
  ctx.save()
  
  // Draw success circle background with glow
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, size)
  gradient.addColorStop(0, 'rgba(76, 175, 80, 0.8)')
  gradient.addColorStop(0.7, 'rgba(76, 175, 80, 0.4)')
  gradient.addColorStop(1, 'rgba(76, 175, 80, 0)')
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(x, y, size, 0, Math.PI * 2)
  ctx.fill()
  
  // Draw main success circle
  ctx.fillStyle = '#4CAF50'
  ctx.beginPath()
  ctx.arc(x, y, size * 0.7, 0, Math.PI * 2)
  ctx.fill()
  
  // Draw checkmark
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = size * 0.15
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  
  const checkSize = size * 0.4
  ctx.beginPath()
  ctx.moveTo(x - checkSize * 0.5, y)
  ctx.lineTo(x - checkSize * 0.1, y + checkSize * 0.4)
  ctx.lineTo(x + checkSize * 0.5, y - checkSize * 0.3)
  ctx.stroke()
  
  ctx.restore()
}

const updateCanvas = () => {
  if (!canvasRef.value) return

  const canvas = canvasRef.value
  const width = window.innerWidth
  const height = window.innerHeight
  
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  
  // Draw background
  drawBackground(ctx, width, height, props.backgroundImage)
  
  // Draw content based on status
  drawContent(ctx, width, height)
  
  // Update animation
  if (status.value === 'checking') {
    pulseAnimation += 0.1
  } else if (status.value === 'error') {
    errorAnimation += 0.05
  }
}

const animate = () => {
  updateCanvas()
  if (props.showLogin) {
    animationFrameId = requestAnimationFrame(animate)
  }
}

const translator = inject('translator', null)
const t = translator || ((key) => key)

const checkUser = async () => {
  if (!gameApi) {
    status.value = 'error'
    errorType.value = 'no-api'
    emit('login-failed', t('component.login.apiNotAvailable'))
    return
  }

  status.value = 'checking'
  errorType.value = null
  
  try {
    const response = await gameApi.checkUser()
    
    if (response.data.success) {
      status.value = 'success'
      // Wait a moment to show success icon
      setTimeout(() => {
        emit('login-success', {
          ...response.data.user,
          imagesUrl: response.data.images_url || ''
        })
      }, 500)
    } else {
      status.value = 'error'
      const errorMsg = response.data.error || t('component.login.authenticationFailed')
      
      // Determine error type
      if (errorMsg.toLowerCase().includes('token') || errorMsg.toLowerCase().includes('invalid')) {
        errorType.value = 'invalid-token'
      } else if (errorMsg.toLowerCase().includes('server') || errorMsg.toLowerCase().includes('500')) {
        errorType.value = 'server-error'
      } else {
        errorType.value = 'generic'
      }
      
      emit('login-failed', errorMsg)
    }
  } catch (err) {
    status.value = 'error'
    const errorMessage = err.response?.data?.error || err.message || t('component.login.connectionFailed')
    
    // Determine error type
    if (err.code === 'ECONNREFUSED' || err.message.includes('Network') || errorMessage.includes('Connection')) {
      errorType.value = 'connection-failed'
    } else if (err.response?.status >= 500) {
      errorType.value = 'server-error'
    } else if (err.response?.status === 401 || errorMessage.includes('token') || errorMessage.includes('Invalid')) {
      errorType.value = 'invalid-token'
    } else {
      errorType.value = 'generic'
    }
    
    emit('login-failed', errorMessage)
  }
}

watch(() => props.showLogin, (newVal) => {
  if (newVal) {
    nextTick(() => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      status.value = 'checking'
      error.value = null
      errorType.value = null
      pulseAnimation = 0
      errorAnimation = 0
      animate()
      checkUser()
    })
  } else {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
    status.value = 'checking'
    errorType.value = null
  }
}, { immediate: true })

onMounted(() => {
  window.addEventListener('resize', updateCanvas)
  if (props.showLogin) {
    nextTick(() => {
      animate()
    })
  }
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  window.removeEventListener('resize', updateCanvas)
})
</script>

<style scoped>
.login-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10000;
  background: #000000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.login-overlay.login-active {
  opacity: 1;
  pointer-events: all;
}

.login-canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>

