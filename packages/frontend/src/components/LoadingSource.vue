<template>
  <div 
    v-if="isLoading" 
    class="loading-overlay"
    :class="{ 'loading-active': isLoading }"
  >
    <div class="animated-background">
      <div class="particles-container">
        <div 
          v-for="i in 50" 
          :key="i" 
          class="particle"
          :ref="el => updateParticleElement(i, el)"
        ></div>
      </div>
    </div>
    <canvas 
      ref="canvasRef" 
      class="loading-canvas"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  loadingProgress: {
    type: Number,
    default: 0
  },
  unzipProgress: {
    type: Number,
    default: 0
  },
  userDataProgress: {
    type: Number,
    default: 0
  },
  backgroundImage: {
    type: String,
    default: null
  },
  loadingTitle: {
    type: String,
    default: 'LOADING'
  },
  loadingSubtitle: {
    type: String,
    default: 'Preparing your gaming experience...'
  },
  loadingLabels: {
    type: Object,
    default: () => ({
      assets: 'Loading Assets',
      unzipping: 'Unzipping Files',
      userData: 'Load Data User'
    })
  }
})

const emit = defineEmits(['loading-complete'])

const canvasRef = ref(null)
let animationFrameId = null
let animationTime = 0
let particles = []
let particleElements = []

// Initialize particles for animated background
const initParticles = () => {
  particles = []
  const width = window.innerWidth
  const height = window.innerHeight
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2
    })
  }
}

const updateParticleElement = (index, el) => {
  if (el) {
    particleElements[index - 1] = el
  }
}

const updateParticles = () => {
  const width = window.innerWidth
  const height = window.innerHeight
  
  particles.forEach((particle, index) => {
    particle.x += particle.speedX
    particle.y += particle.speedY
    
    // Wrap around screen
    if (particle.x < 0) particle.x = width
    if (particle.x > width) particle.x = 0
    if (particle.y < 0) particle.y = height
    if (particle.y > height) particle.y = 0
    
    // Update DOM element
    const element = particleElements[index]
    if (element) {
      element.style.left = `${particle.x}px`
      element.style.top = `${particle.y}px`
      element.style.width = `${particle.size}px`
      element.style.height = `${particle.size}px`
      element.style.opacity = particle.opacity
    }
  })
}

const updateCanvas = () => {
  if (!canvasRef.value) return

  const canvas = canvasRef.value
  const width = window.innerWidth
  const height = window.innerHeight
  
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  
  // Draw animated gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  const timeOffset = animationTime * 0.001
  const hue1 = (Math.sin(timeOffset) * 30 + 220) % 360
  const hue2 = (Math.cos(timeOffset) * 30 + 240) % 360
  
  gradient.addColorStop(0, `hsl(${hue1}, 70%, 15%)`)
  gradient.addColorStop(0.5, `hsl(${hue2}, 60%, 12%)`)
  gradient.addColorStop(1, `hsl(${(hue1 + hue2) / 2}, 65%, 10%)`)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  // Draw animated grid pattern
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
  ctx.lineWidth = 1
  const gridSize = 50
  const offset = (animationTime * 0.1) % gridSize
  
  for (let x = -offset; x < width + gridSize; x += gridSize) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }
  
  for (let y = -offset; y < height + gridSize; y += gridSize) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }

  // Draw glowing title with animation
  const titleY = height * 0.35
  const pulse = Math.sin(animationTime * 0.005) * 0.1 + 1
  
  // Title glow effect
  ctx.shadowBlur = 30 * pulse
  ctx.shadowColor = '#00d4ff'
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 48px Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const loadingTitle = props.loadingTitle || 'LOADING'
  ctx.fillText(loadingTitle, width / 2, titleY)
  
  // Reset shadow
  ctx.shadowBlur = 0

  // Draw subtitle
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
  ctx.font = '18px Arial, sans-serif'
  const loadingSubtitle = props.loadingSubtitle || 'Preparing your gaming experience...'
  ctx.fillText(loadingSubtitle, width / 2, titleY + 50)

  // Draw main loading bar with chunky game-like style
  // Calculate total progress as average of Loading Assets, Unzipping Files, and Load Data User
  const totalProgress = (props.loadingProgress + props.unzipProgress + props.userDataProgress) / 3
  const barWidth = width * 0.65
  const barHeight = 35
  const barX = (width - barWidth) / 2
  const barY = height * 0.55
  const progressWidth = (barWidth * totalProgress) / 100
  
  // Bar background with border (chunky style)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
  ctx.fillRect(barX, barY, barWidth, barHeight)
  
  // Outer border (thick chunky border)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
  ctx.lineWidth = 3
  ctx.strokeRect(barX, barY, barWidth, barHeight)
  
  // Inner border
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)'
  ctx.lineWidth = 2
  ctx.strokeRect(barX + 2, barY + 2, barWidth - 4, barHeight - 4)
  
  // Animated progress bar with chunky segmented style
  if (progressWidth > 0) {
    // Segment size for chunky appearance
    const segmentSize = 8
    const numSegments = Math.ceil(progressWidth / segmentSize)
    
    // Draw segmented progress bar
    for (let i = 0; i < numSegments; i++) {
      const segmentX = barX + (i * segmentSize)
      const segmentWidth = Math.min(segmentSize, progressWidth - (i * segmentSize))
      
      if (segmentWidth > 0) {
        // Base color with slight variation per segment
        const segmentHue = 195 + (i % 3) * 5
        ctx.fillStyle = `hsl(${segmentHue}, 80%, 50%)`
        ctx.fillRect(segmentX + 3, barY + 3, segmentWidth - 2, barHeight - 6)
        
        // Highlight on top of each segment
        ctx.fillStyle = `rgba(255, 255, 255, 0.3)`
        ctx.fillRect(segmentX + 3, barY + 3, segmentWidth - 2, (barHeight - 6) * 0.3)
        
        // Darker bottom for depth
        ctx.fillStyle = `rgba(0, 0, 0, 0.2)`
        ctx.fillRect(segmentX + 3, barY + barHeight - 8, segmentWidth - 2, 3)
      }
    }
    
    // Running shimmer animation effect (always runs when there's any progress)
    if (totalProgress > 0) {
      const shimmerWidth = 40
      const shimmerSpeed = animationTime * 0.3
      const maxProgressWidth = barWidth - 6 // Maximum possible progress width
      const shimmerX = barX + (shimmerSpeed % (maxProgressWidth + shimmerWidth)) - shimmerWidth
      
      if (shimmerX < barX + progressWidth && shimmerX + shimmerWidth > barX) {
        const shimmerStart = Math.max(barX + 3, shimmerX)
        const shimmerEnd = Math.min(barX + progressWidth - 2, shimmerX + shimmerWidth)
        const shimmerActualWidth = shimmerEnd - shimmerStart
        
        if (shimmerActualWidth > 0) {
          const shimmerGradient = ctx.createLinearGradient(shimmerStart, barY, shimmerEnd, barY)
          shimmerGradient.addColorStop(0, 'rgba(255, 255, 255, 0)')
          shimmerGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.6)')
          shimmerGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
          ctx.fillStyle = shimmerGradient
          ctx.fillRect(shimmerStart, barY + 3, shimmerActualWidth, barHeight - 6)
        }
      }
    }
    
    // Glow effect at progress edge
    ctx.shadowBlur = 15
    ctx.shadowColor = '#00d4ff'
    ctx.fillStyle = '#00d4ff'
    ctx.fillRect(barX + progressWidth - 3, barY + 3, 3, barHeight - 6)
    ctx.shadowBlur = 0
  }
  
  // Progress percentage with glow (chunky font style) - shows total progress
  ctx.shadowBlur = 15
  ctx.shadowColor = '#00d4ff'
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 22px Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(
    `${Math.round(totalProgress)}%`,
    barX + barWidth / 2,
    barY + barHeight / 2
  )
  ctx.shadowBlur = 0

  // Draw progress items with better styling
  const progressItems = [
    { label: props.loadingLabels.assets, progress: Math.min(props.loadingProgress, 100) },
    { label: props.loadingLabels.unzipping, progress: Math.min(props.unzipProgress, 100) },
    { label: props.loadingLabels.userData, progress: Math.min(props.userDataProgress, 100) }
  ]

  const startY = height * 0.68
  const itemHeight = 30
  const spacing = 12

  progressItems.forEach((item, index) => {
    const y = startY + (index * (itemHeight + spacing))
    const itemBarWidth = width * 0.5
    const itemBarX = (width - itemBarWidth) / 2
    const itemProgressWidth = (itemBarWidth * item.progress) / 100
    
    // Item label
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.font = '14px Arial, sans-serif'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText(item.label, itemBarX, y - 5)
    
    // Item progress bar background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.fillRect(itemBarX, y + 5, itemBarWidth, 4)
    
    // Item progress bar
    if (itemProgressWidth > 0) {
      const itemGradient = ctx.createLinearGradient(itemBarX, y + 5, itemBarX + itemProgressWidth, y + 9)
      itemGradient.addColorStop(0, '#00ff88')
      itemGradient.addColorStop(1, '#00cc66')
      ctx.fillStyle = itemGradient
      ctx.fillRect(itemBarX, y + 5, itemProgressWidth, 4)
    }
    
    // Item percentage
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.textAlign = 'right'
    ctx.fillText(`${Math.round(item.progress)}%`, itemBarX + itemBarWidth, y - 5)
  })

  // Check if loading is complete
  if (props.loadingProgress >= 100 && props.unzipProgress >= 100) {
    emit('loading-complete')
  }
}

const animate = () => {
  animationTime += 16 // ~60fps
  updateParticles()
  updateCanvas()
  if (props.isLoading) {
    animationFrameId = requestAnimationFrame(animate)
  }
}

const handleResize = () => {
  initParticles()
  nextTick(() => {
    updateParticles()
    updateCanvas()
  })
}

watch([() => props.isLoading, () => props.loadingProgress, () => props.unzipProgress, () => props.userDataProgress], () => {
  if (props.isLoading) {
    nextTick(() => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      initParticles()
      animate()
    })
  } else {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
  }
}, { immediate: true })

onMounted(() => {
  initParticles()
  // Initialize particle positions after DOM is ready
  nextTick(() => {
    updateParticles()
  })
  window.addEventListener('resize', handleResize)
  if (props.isLoading) {
    nextTick(() => {
      animate()
    })
  }
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background: #000000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.loading-overlay.loading-active {
  opacity: 1;
  pointer-events: all;
}

.animated-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.particles-container {
  position: absolute;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  background: radial-gradient(circle, rgba(0, 212, 255, 0.8) 0%, rgba(0, 212, 255, 0) 70%);
  border-radius: 50%;
  pointer-events: none;
  transition: transform 0.1s ease-out, opacity 0.1s ease-out;
  will-change: transform, opacity;
}

.loading-canvas {
  position: relative;
  width: 100%;
  height: 100%;
  display: block;
  z-index: 2;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}
</style>

