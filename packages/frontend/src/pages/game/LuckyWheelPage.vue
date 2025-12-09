<template>
  <div class="lucky-wheel-container">
    <div class="wheel-section">
      <div class="luckywheel">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 730 730">
          <g class="wheel" :style="{ transform: `rotate(${rotation}deg)` }">
            <circle class="frame" cx="365" cy="365" r="347.6" fill="none" stroke="#333" stroke-width="2"/>
            <g class="sticks">
              <rect x="360.4" width="9.3" height="24.33" rx="4" ry="4" fill="#333"/>
              <rect x="352.8" y="713.2" width="24.3" height="9.27" rx="4" ry="4" transform="translate(1082.8 352.8) rotate(90)" fill="#333"/>
              <rect x="176.4" y="54.8" width="24.3" height="9.27" rx="4" ry="4" transform="translate(145.8 -133.6) rotate(60)" fill="#333"/>
              <rect x="529.2" y="665.9" width="24.3" height="9.27" rx="4" ry="4" transform="translate(851.4 -133.6) rotate(60)" fill="#333"/>
              <rect x="47.3" y="183.9" width="24.3" height="9.27" rx="4" ry="4" transform="translate(102.3 -4.5) rotate(30)" fill="#333"/>
              <rect x="658.4" y="536.8" width="24.3" height="9.27" rx="4" ry="4" transform="translate(360.5 -262.7) rotate(30)" fill="#333"/>
              <rect y="360.4" width="24.3" height="9.27" rx="4" ry="4" fill="#333"/>
              <rect x="705.7" y="360.4" width="24.3" height="9.27" rx="4" ry="4" fill="#333"/>
              <rect x="47.3" y="536.8" width="24.3" height="9.27" rx="4" ry="4" transform="translate(-262.7 102.3) rotate(-30)" fill="#333"/>
              <rect x="658.4" y="183.9" width="24.3" height="9.27" rx="4" ry="4" transform="translate(-4.5 360.5) rotate(-30)" fill="#333"/>
              <rect x="176.4" y="665.9" width="24.3" height="9.27" rx="4" ry="4" transform="translate(-486.4 498.6) rotate(-60)" fill="#333"/>
              <rect x="529.2" y="54.8" width="24.3" height="9.27" rx="4" ry="4" transform="translate(219.2 498.6) rotate(-60)" fill="#333"/>
            </g>
            <g class="sectors">
              <g v-for="(item, index) in wheelItems" :key="index">
                <path 
                  :id="`_${index + 1}`" 
                  :d="getSectorPath(index)"
                  :fill="getSectorColor(index)"
                />
                <text
                  :x="getSectorTextX(index)"
                  :y="getSectorTextY(index) - 40"
                  :transform="`rotate(${index * 30 - 90}, ${getSectorTextX(index)}, ${getSectorTextY(index)})`"
                  text-anchor="middle"
                  dominant-baseline="top"
                  font-size="28"
                  class="sector-text"
                  stroke-width="1.5"
                  paint-order="stroke fill"
                >
                  {{ item.name }}
                </text>
                <text
                  :x="getSectorTextX(index) + 80"
                  :y="getSectorTextY(index) - 20"
                  :transform="`rotate(${index * 30 - 90}, ${getSectorTextX(index)}, ${getSectorTextY(index) + 22})`"
                  text-anchor="middle"
                  dominant-baseline="middle"
                  fill="#000"
                  font-size="16"
                  font-weight="bold"
                  class="sector-text"
                  stroke-width="1.5"
                  paint-order="stroke fill"
                >
                  x{{ item.qty }}
                </text>
              </g>
            </g>
            <g class="middle">
              <g id="shadow-1" opacity="0.2">
                <circle cx="368.5" cy="368.5" r="54.5" fill="#000"/>
              </g>
              <g class="wheelMiddle">
                <circle cx="365" cy="365" r="54.5" fill="#fff"/>
              </g>
              <circle id="middle-3" cx="365" cy="365" r="11.6" fill="#ccc"/>
            </g>
          </g>
          <g id="shadow-2" opacity="0.15">
            <path d="M46.9,372.5c0-181.7,147.4-329,329.1-329A327.3,327.3,0,0,1,556.3,97.2,327.3,327.3,0,0,0,365,35.9C183.3,35.9,35.9,183.3,35.9,365c0,115.2,59.2,216.5,148.8,275.3C101.3,580.6,46.9,482.9,46.9,372.5Z" transform="translate(0)" fill="#000"/>
          </g>
          <g class="active">
            <g>
              <path d="M707,160.5c-11.4-17.9-35.8-22.8-54.5-11a41.7,41.7,0,0,0-13.6,14.1l-33.6,58.9a2.3,2.3,0,0,0,0,2.4,2.4,2.4,0,0,0,2.3,1.1l67.5-5.1a43.8,43.8,0,0,0,18.6-6.3C712.4,202.7,718.3,178.5,707,160.5Z" transform="translate(0)" fill-opacity="0.22"/>
              <path class="winIndicator" d="M711.9,157.4a38.4,38.4,0,0,0-66,1.8l-31.5,57.5a2.1,2.1,0,0,0,0,2.4,2.6,2.6,0,0,0,2.2,1.2l65.6-3.9a39.6,39.6,0,0,0,17.9-5.9A38.5,38.5,0,0,0,711.9,157.4Z" transform="translate(0)" fill="#f6a901"/>
            </g>
          </g>
        </svg>
      </div>
      
      <div class="buttons">
        <div class="btnPlay_parent">
          <button 
            v-if="ticketCount > 0 && !isSpinning" 
            id="btnPlay" 
            class="btn btn-primary btnPlay"
            @click="handleSpin"
          >
            <span class="btn-icon">🎰</span>
            <span class="btn-text">{{ t('component.luckyWheel.spin') }}</span>
            <span class="btn-count">{{ ticketCount }}</span>
          </button>
          <button 
            v-else 
            class="btn btn-primary btn-disabled"
            :disabled="isSpinning"
          >
            <span class="btn-icon">🎰</span>
            <span class="btn-text">{{ isSpinning ? t('component.luckyWheel.spinning') : t('component.luckyWheel.noTickets') }}</span>
            <span class="btn-count">{{ ticketCount }}</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- <div class="drop-rate-section">
      <h3 class="drop-rate-title">Drop Rates</h3>
      <div class="drop-rate-list">
        <div 
          v-for="(item, index) in wheelItems" 
          :key="index"
          class="drop-rate-item"
        >
          <div class="drop-rate-item-icon" :style="{ backgroundColor: getSectorColor(index) }">
            <span class="item-number">{{ index + 1 }}</span>
          </div>
          <div class="drop-rate-item-info">
            <div class="item-name">{{ item.name }}</div>
            <div class="item-quantity">x{{ item.qty }}</div>
          </div>
          <div class="drop-rate-item-rate">
            <span class="rate-value">{{ getDropRate(index) }}%</span>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'

const gameApi = inject('gameApi', null)
const imagesUrl = inject('imagesUrl', '')
const translator = inject('translator', null)
const t = translator || ((key) => key)

const rotation = ref(0)
const isSpinning = ref(false)
const ticketCount = ref(5) // Set initial ticket count for testing
const wheelItems = ref([
  { name: `${t('component.luckyWheel.item')} 1`, qty: 1, rate: 8.33 },
  { name: `${t('component.luckyWheel.item')} 2`, qty: 2, rate: 8.33 },
  { name: `${t('component.luckyWheel.item')} 3`, qty: 3, rate: 8.33 },
  { name: `${t('component.luckyWheel.item')} 4`, qty: 4, rate: 8.33 },
  { name: `${t('component.luckyWheel.item')} 5`, qty: 5, rate: 8.33 },
  { name: `${t('component.luckyWheel.item')} 6`, qty: 6, rate: 8.33 },
  { name: `${t('component.luckyWheel.item')} 7`, qty: 7, rate: 8.33 },
  { name: `${t('component.luckyWheel.item')} 8`, qty: 8, rate: 8.33 },
  { name: `${t('component.luckyWheel.item')} 9`, qty: 9, rate: 8.33 },
  { name: `${t('component.luckyWheel.item')} 10`, qty: 10, rate: 8.33 },
  { name: `${t('component.luckyWheel.item')} 11`, qty: 11, rate: 8.33 },
  { name: `${t('component.luckyWheel.item')} 12`, qty: 12, rate: 8.33 }
])

const getSectorPath = (index) => {
  // Simplified sector paths - would need proper calculation
  const paths = [
    'M365,365V35.9A328.1,328.1,0,0,0,200.5,80Z',
    'M365,365,529.5,80A328.1,328.1,0,0,0,365,35.9Z',
    'M365,365,650,200.5A328.5,328.5,0,0,0,529.5,80Z',
    'M365,365H694.1A328.1,328.1,0,0,0,650,200.5Z',
    'M365,365,650,529.5A328.1,328.1,0,0,0,694.1,365Z',
    'M365,365,529.5,650A328.5,328.5,0,0,0,650,529.5Z',
    'M365,365V694.1A328.1,328.1,0,0,0,529.5,650Z',
    'M365,365,200.5,650A328.1,328.1,0,0,0,365,694.1Z',
    'M365,365,80,529.5A328.5,328.5,0,0,0,200.5,650Z',
    'M365,365H35.9A328.1,328.1,0,0,0,80,529.5Z',
    'M365,365,80,200.5A328.1,328.1,0,0,0,35.9,365Z',
    'M365,365,200.5,80A328.5,328.5,0,0,0,80,200.5Z'
  ]
  return paths[index] || paths[0]
}

const getSectorColor = (index) => {
  // Alternating colors for sectors
  const colors = [
    '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3',
    '#F38181', '#AA96DA', '#FCBAD3', '#A8E6CF',
    '#FFD3A5', '#C7CEEA', '#FFAAA5', '#FF8B94'
  ]
  return colors[index % colors.length]
}

const getSectorTextX = (index) => {
  // Calculate X position for text in the middle of each sector
  const angle = (index * 30 - 90) * (Math.PI / 180) // Convert to radians, offset by -90 to start at top
  const radius = 200 // Distance from center
  return 365 + radius * Math.cos(angle)
}

const getSectorTextY = (index) => {
  // Calculate Y position for text in the middle of each sector
  const angle = (index * 30 - 90) * (Math.PI / 180) // Convert to radians, offset by -90 to start at top
  const radius = 200 // Distance from center
  return 365 + radius * Math.sin(angle)
}

const getDropRate = (index) => {
  // Each sector has equal probability (100% / 12 sectors)
  return (100 / 12).toFixed(2)
}

const handleSpin = async () => {
  if (ticketCount.value <= 0 || isSpinning.value) return
  
  isSpinning.value = true
  ticketCount.value--
  
  try {
    // TODO: Call API to spin wheel
    // const response = await gameApi.spinLuckyWheel()
    // const targetRotation = response.rotation
    
    // Demo: Calculate random target rotation (multiple full spins + random sector)
    const fullSpins = 5
    const randomSector = Math.floor(Math.random() * 12)
    const sectorAngle = randomSector * 30 // Each sector is 30 degrees
    const targetRotation = rotation.value + (fullSpins * 360) + (360 - sectorAngle)
    
    rotation.value = targetRotation
    
    // Reset spinning state after animation completes
    setTimeout(() => {
      isSpinning.value = false
    }, 10000) // Match the CSS transition duration
  } catch (error) {
    console.error('Error spinning wheel:', error)
    ticketCount.value++
    isSpinning.value = false
  }
}
</script>

<style scoped>
.lucky-wheel-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 20px;
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 77px);
  gap: 50px;
}

.wheel-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.luckywheel {
  width: 500px;
  height: 500px;
}

.luckywheel svg {
  width: 100%;
  height: 100%;
}

.buttons {
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.btnPlay_parent {
  width: 100%;
  max-width: 300px;
}

.btn {
  width: 100%;
  padding: 18px 30px;
  font-size: 20px;
  cursor: pointer;
  background: linear-gradient(135deg, #f6a901 0%, #ff8c00 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  box-shadow: 
    0 4px 15px rgba(246, 169, 1, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-weight: bold;
  font-family: Nanami, sans-serif;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.btn:hover::before {
  left: 100%;
}

.btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #ff8c00 0%, #f6a901 100%);
  transform: translateY(-2px);
  box-shadow: 
    0 6px 20px rgba(246, 169, 1, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 
    0 2px 10px rgba(246, 169, 1, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.btn-icon {
  font-size: 24px;
  line-height: 1;
}

.btn-text {
  flex: 1;
  text-align: center;
  letter-spacing: 1px;
}

.btn-count {
  background: rgba(0, 0, 0, 0.2);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 18px;
  min-width: 40px;
  text-align: center;
}

.btn-disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: linear-gradient(135deg, #888 0%, #666 100%);
}

.btn-disabled:hover {
  transform: none;
  box-shadow: 
    0 4px 15px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.wheel {
  transition: transform 10s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform-origin: 50% 50%;
}

.sector-text {
  pointer-events: none;
  user-select: none;
}

.drop-rate-section {
  width: 420px;
  background: linear-gradient(135deg, rgba(30, 35, 50, 0.85) 0%, rgba(20, 25, 40, 0.9) 100%);
  border-radius: 16px;
  padding: 24px;
  height: fit-content;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.drop-rate-section::-webkit-scrollbar {
  width: 8px;
}

.drop-rate-section::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.drop-rate-section::-webkit-scrollbar-thumb {
  background: rgba(246, 169, 1, 0.5);
  border-radius: 4px;
}

.drop-rate-section::-webkit-scrollbar-thumb:hover {
  background: rgba(246, 169, 1, 0.7);
}

.drop-rate-title {
  color: #fff;
  font-family: Nanami, sans-serif;
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 24px 0;
  text-align: center;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(246, 169, 1, 0.3);
  letter-spacing: 0.5px;
  position: relative;
}

.drop-rate-title::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(246, 169, 1, 0.6), transparent);
}

.drop-rate-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.drop-rate-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.03) 100%);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.drop-rate-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(246, 169, 1, 0.1), transparent);
  transition: left 0.5s ease;
}

.drop-rate-item:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.06) 100%);
  border-color: rgba(246, 169, 1, 0.4);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.drop-rate-item:hover::before {
  left: 100%;
}

.drop-rate-item-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 
    0 3px 10px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.drop-rate-item-icon::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, transparent 50%);
  pointer-events: none;
}

.item-number {
  color: #fff;
  font-weight: 700;
  font-size: 17px;
  text-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.6),
    0 0 8px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
}

.drop-rate-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-name {
  color: #fff;
  font-family: Nanami, sans-serif;
  font-size: 15px;
  font-weight: 500;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
  letter-spacing: 0.2px;
}

.item-quantity {
  color: rgba(255, 255, 255, 0.65);
  font-family: Nanami, sans-serif;
  font-size: 13px;
  font-weight: 400;
  margin-top: 2px;
}

.drop-rate-item-rate {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 70px;
}

.rate-value {
  color: #f6a901;
  font-family: Nanami, sans-serif;
  font-size: 17px;
  font-weight: 700;
  text-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.6),
    0 0 10px rgba(246, 169, 1, 0.4);
  letter-spacing: 0.3px;
  padding: 4px 10px;
  background: rgba(246, 169, 1, 0.1);
  border-radius: 6px;
  border: 1px solid rgba(246, 169, 1, 0.2);
}
</style>
