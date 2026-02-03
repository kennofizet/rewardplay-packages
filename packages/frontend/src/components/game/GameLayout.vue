<template>
  <div ref="mainWrapper" class="main-game-wrapper">
    <div 
      class="game-container"
      :style="containerStyle"
    >
      <div class="wrapper">
        <div class="header">
          <TopMenu 
            :is-manager="isManager"
            @page-change="$emit('page-change', $event)"
            @icon-click="$emit('icon-click', $event)"
          />
        </div>
        
        <div class="body">
          <slot></slot>
        </div>
      </div>
      <div class="game-container__overlay">
        <slot name="overlay"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import TopMenu from './TopMenu.vue'

const props = defineProps({
  rotate: {
    type: Boolean,
    default: true
  }
  ,
  isManager: {
    type: Boolean,
    default: false
  }
})

defineEmits(['page-change', 'icon-click'])

// Base design size - Using 16:9 ratio (most common screen ratio)
// Full HD (1920x1080) is the most common resolution
const BASE_WIDTH = 1920
const BASE_HEIGHT = 1080

const mainWrapper = ref(null)
const scale = ref(1)
const translateX = ref(0)
const translateY = ref(0)
const rotation = ref(0)

const containerStyle = computed(() => {
  const transforms = []
  
  // Apply translation to center
  transforms.push(`translate(${translateX.value}px, ${translateY.value}px)`)
  
  // Apply rotation if needed (before scale so rotation happens around center)
  if (rotation.value !== 0) {
    transforms.push(`rotate(${rotation.value}deg)`)
  }
  
  // Apply scale last
  transforms.push(`scale(${scale.value})`)
  
  return {
    transform: transforms.join(' '),
    transformOrigin: 'center center'
  }
})

const calculateScale = () => {
  if (!mainWrapper.value) return
  
  // Get the actual dimensions of the main page content container
  const containerRect = mainWrapper.value.getBoundingClientRect()
  let viewportWidth = containerRect.width
  let viewportHeight = containerRect.height
  
  // Check if we need to rotate (portrait mode)
  const isPortrait = viewportWidth < viewportHeight
  const shouldRotate = props.rotate && isPortrait
  
  if (shouldRotate) {
    // Swap dimensions for rotation calculation
    rotation.value = 90
    // When rotated 90deg, the effective viewport dimensions swap
    const temp = viewportWidth
    viewportWidth = viewportHeight
    viewportHeight = temp
  } else {
    rotation.value = 0
  }
  
  // Calculate scale to fit both width and height, using the smaller scale to ensure it fits
  const scaleX = viewportWidth / BASE_WIDTH
  const scaleY = viewportHeight / BASE_HEIGHT
  
  // Use the smaller scale to ensure content fits within viewport
  scale.value = Math.min(scaleX, scaleY)
  
  // When transform-origin is 'center center', we need to translate so that
  // the center of the element aligns with the center of the viewport
  // The element's center is at (BASE_WIDTH/2, BASE_HEIGHT/2) in its original coordinate system
  // After scaling, we need to move it so its center is at (viewportWidth/2, viewportHeight/2)
  // But we use the actual container dimensions (not swapped) for positioning
  const actualViewportWidth = containerRect.width
  const actualViewportHeight = containerRect.height
  
  translateX.value = (actualViewportWidth / 2) - (BASE_WIDTH / 2)
  translateY.value = (actualViewportHeight / 2) - (BASE_HEIGHT / 2)
}

const handleResize = () => {
  calculateScale()
}

onMounted(() => {
  calculateScale()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
@import url('//db.onlinewebfonts.com/c/2152ce3e10c6bce3bc71fe88d9a797fa?family=Chupada');
@import url('//db.onlinewebfonts.com/c/f52829758901c0be1a275497b9d25d11?family=Nanami');
@import url('https://use.fontawesome.com/releases/v5.8.1/css/all.css');

.main-game-wrapper {
  margin: 0;
  padding: 0;
  background: linear-gradient(#101d2d 40px, #345579 50%, #395d84 85%, #101d2d 100%);
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.game-container {
  width: 1920px;
  height: 1080px;
  position: absolute;
  top: 0;
  left: 0;
  background: linear-gradient(#101d2d 40px, #345579 50%, #395d84 85%, #101d2d 100%);
}

.game-container__overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.game-container__overlay > * {
  pointer-events: auto;
}

.wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

.body {
  margin: 0 60px;
  height: 100%;
}
</style>
