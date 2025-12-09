<template>
  <div class="coming-soon-page">
    <canvas ref="canvasRef" class="particle-canvas"></canvas>
    
    <div class="gradient-orb orb-1"></div>
    <div class="gradient-orb orb-2"></div>
    <div class="gradient-orb orb-3"></div>
    
    <div class="geometric-shape shape-1"></div>
    <div class="geometric-shape shape-2"></div>
    <div class="geometric-shape shape-3"></div>
    
    <div class="content-wrapper">
      <div class="title-container">
        <h1 class="main-title">{{ t('page.comingSoon.title') }}</h1>
        <div class="title-underline"></div>
      </div>
      <p class="subtitle">{{ t('page.comingSoon.subtitle') }}</p>
      <div class="loading-bar">
        <div class="loading-progress"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, inject } from 'vue'

const translator = inject('translator', null)
const t = translator || ((key) => key)

const canvasRef = ref(null)
let animationFrameId = null
let particles = []

class Particle {
  constructor(canvas) {
    this.canvas = canvas
    this.reset()
    this.y = Math.random() * canvas.height
  }
  
  reset() {
    this.x = Math.random() * this.canvas.width
    this.y = Math.random() * this.canvas.height
    this.size = Math.random() * 3 + 1
    this.speedX = (Math.random() - 0.5) * 0.5
    this.speedY = (Math.random() - 0.5) * 0.5
    this.opacity = Math.random() * 0.5 + 0.2
    this.color = `hsl(${200 + Math.random() * 60}, 70%, ${60 + Math.random() * 20}%)`
  }
  
  update() {
    this.x += this.speedX
    this.y += this.speedY
    
    if (this.x < 0 || this.x > this.canvas.width) this.speedX *= -1
    if (this.y < 0 || this.y > this.canvas.height) this.speedY *= -1
  }
  
  draw(ctx) {
    ctx.save()
    ctx.globalAlpha = this.opacity
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

const initCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  
  particles = []
  for (let i = 0; i < 80; i++) {
    particles.push(new Particle(canvas))
  }
}

const animate = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  
  // Clear with fade effect
  ctx.fillStyle = 'rgba(15, 32, 51, 0.1)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // Update and draw particles
  particles.forEach(particle => {
    particle.update()
    particle.draw(ctx)
  })
  
  // Draw connections
  particles.forEach((particle, i) => {
    particles.slice(i + 1).forEach(otherParticle => {
      const dx = particle.x - otherParticle.x
      const dy = particle.y - otherParticle.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < 120) {
        ctx.save()
        ctx.globalAlpha = (1 - distance / 120) * 0.3
        ctx.strokeStyle = particle.color
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.moveTo(particle.x, particle.y)
        ctx.lineTo(otherParticle.x, otherParticle.y)
        ctx.stroke()
        ctx.restore()
      }
    })
  })
  
  animationFrameId = requestAnimationFrame(animate)
}

const handleResize = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  
  particles.forEach(particle => {
    particle.canvas = canvas
  })
}

onMounted(() => {
  initCanvas()
  animate()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.coming-soon-page {
  position: relative;
  width: 100%;
  height: calc(100% - 24px);
  overflow: hidden;
  background: 
    radial-gradient(ellipse 80% 50% at 50% 0%, rgba(127, 217, 243, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse 60% 40% at 50% 100%, rgba(255, 162, 192, 0.12) 0%, transparent 50%),
    linear-gradient(180deg, #0f2033 0%, #1a2d42 50%, #0f2033 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #fff;
}

.particle-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.6;
  animation: orb-float 20s ease-in-out infinite;
  z-index: 2;
}

.orb-1 {
  width: 400px;
  height: 400px;
  top: 10%;
  left: 10%;
  background: radial-gradient(circle, rgba(127, 217, 243, 0.4) 0%, rgba(127, 217, 243, 0) 70%);
  animation-duration: 25s;
}

.orb-2 {
  width: 500px;
  height: 500px;
  bottom: 15%;
  right: 15%;
  background: radial-gradient(circle, rgba(255, 162, 192, 0.35) 0%, rgba(255, 162, 192, 0) 70%);
  animation-duration: 30s;
  animation-delay: -5s;
}

.orb-3 {
  width: 350px;
  height: 350px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(255, 230, 245, 0.3) 0%, rgba(255, 230, 245, 0) 70%);
  animation-duration: 22s;
  animation-delay: -10s;
}

@keyframes orb-float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(40px, -30px) scale(1.1); }
  66% { transform: translate(-30px, 40px) scale(0.9); }
}

.geometric-shape {
  position: absolute;
  border-radius: 20px;
  opacity: 0.15;
  animation: shape-rotate 30s linear infinite;
  z-index: 2;
}

.shape-1 {
  width: 200px;
  height: 200px;
  top: 20%;
  right: 20%;
  background: linear-gradient(135deg, rgba(127, 217, 243, 0.3) 0%, rgba(255, 162, 192, 0.3) 100%);
  transform: rotate(45deg);
  animation-duration: 40s;
}

.shape-2 {
  width: 150px;
  height: 150px;
  bottom: 25%;
  left: 15%;
  background: linear-gradient(45deg, rgba(255, 162, 192, 0.25) 0%, rgba(127, 217, 243, 0.25) 100%);
  transform: rotate(-30deg);
  animation-duration: 35s;
  animation-delay: -8s;
}

.shape-3 {
  width: 120px;
  height: 120px;
  top: 60%;
  right: 10%;
  background: linear-gradient(90deg, rgba(255, 230, 245, 0.2) 0%, rgba(127, 217, 243, 0.2) 100%);
  border-radius: 50%;
  animation-duration: 28s;
  animation-delay: -15s;
}

@keyframes shape-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.content-wrapper {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 40px;
}

.title-container {
  margin-bottom: 30px;
}

.main-title {
  font-size: 5rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  margin: 0;
  background: linear-gradient(
    135deg,
    #fff 0%,
    #e0f6ff 30%,
    #ffb6c1 60%,
    #fff 100%
  );
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 5s ease infinite;
  text-shadow: 0 0 40px rgba(255, 255, 255, 0.3);
  filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.3));
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.title-underline {
  width: 120px;
  height: 4px;
  margin: 20px auto 0;
  background: linear-gradient(90deg, transparent, #fff, transparent);
  border-radius: 2px;
  animation: underline-grow 2s ease-in-out infinite;
}

@keyframes underline-grow {
  0%, 100% { transform: scaleX(1); opacity: 0.8; }
  50% { transform: scaleX(1.3); opacity: 1; }
}

.subtitle {
  font-size: 1.8rem;
  font-weight: 300;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 50px 0;
  text-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  animation: subtitle-fade 4s ease-in-out infinite;
}

@keyframes subtitle-fade {
  0%, 100% { opacity: 0.85; }
  50% { opacity: 1; }
}

.loading-bar {
  width: 300px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
}

.loading-progress {
  height: 100%;
  width: 30%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
  border-radius: 2px;
  animation: loading-move 2s ease-in-out infinite;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
}

@keyframes loading-move {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}

@media (max-width: 900px) {
  .main-title { font-size: 3.5rem; }
  .subtitle { font-size: 1.4rem; }
  .loading-bar { width: 250px; }
}

@media (max-width: 600px) {
  .main-title { font-size: 2.5rem; }
  .subtitle { font-size: 1.2rem; }
  .loading-bar { width: 200px; }
  .gradient-orb { filter: blur(40px); }
  .geometric-shape { opacity: 0.1; }
}
</style>
