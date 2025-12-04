<template>
  <div 
    :class="[
      'reward',
      { 'reward-common': rarity === 'common' },
      { 'reward-rare': rarity === 'rare' },
      { 'reward-epic': rarity === 'epic' },
      { 'reward-current': isCurrent },
      { 'epic-reward': isEpic }
    ]"
    @click="$emit('click')"
  >
    <span 
      :class="[
        'reward-day',
        { 'reward-day-feature': isFeature }
      ]"
    >
      {{ dayLabel }}
    </span>
    
    <div v-if="isEpic" class="reward-title">
      {{ epicTitle }}
    </div>
    
    <div class="reward-description">
      <div class="reward-description-title">{{ title }}</div>
      <div class="reward-description-info">{{ description }}</div>
    </div>
    
    <div 
      v-if="imageType"
      :class="`reward-${imageType}`"
      :style="{ backgroundImage: `url('${getImageUrl(imageFile)}')` }"
    ></div>
    
    <div v-if="isCurrent && !isCollected" class="current-reward-ico">
      <i class="fas fa-exclamation"></i>
    </div>
    
    <div v-if="isCollected" class="rewarded">
      <i class="fas fa-check ico-green fa-4x"></i>
    </div>
    
    <div v-if="isCurrent && !isCollected" class="collect-reward" @click.stop="$emit('collect')">
      <div>collect</div>
    </div>
  </div>
</template>

<script setup>
import { inject, toValue } from 'vue'

const props = defineProps({
  dayLabel: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  rarity: {
    type: String,
    default: 'common', // common, rare, epic
    validator: (value) => ['common', 'rare', 'epic'].includes(value)
  },
  isCurrent: {
    type: Boolean,
    default: false
  },
  isCollected: {
    type: Boolean,
    default: false
  },
  isEpic: {
    type: Boolean,
    default: false
  },
  isFeature: {
    type: Boolean,
    default: false
  },
  epicTitle: {
    type: String,
    default: 'EPIC REWARD'
  },
  imageType: {
    type: String,
    default: null // coins, chest, backpack, epic-chest
  },
  imageFile: {
    type: String,
    default: null
  }
})

defineEmits(['click', 'collect'])

const imagesUrl = inject('imagesUrl', '')

const getImageUrl = (filename) => {
  if (!filename) return ''
  const url = toValue(imagesUrl)
  if (!url) {
    return `/${filename}`
  }
  const base = url.endsWith('/') ? url : `${url}/`
  const file = filename.startsWith('/') ? filename.slice(1) : filename
  return `${base}${file}`
}
</script>

<style scoped>
.reward {
  position: relative;
  width: 8%;
  height: 220px;
  border: 4px solid #fff;
  cursor: pointer;
  min-width: 100px;
}

.reward-common {
  background: radial-gradient(#b3b3b3, #929493);
}

.reward-rare {
  background: radial-gradient(#82b35d, #477334);
}

.reward-epic {
  background: radial-gradient(#a976dd, #8159af);
}

.epic-reward:before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  box-shadow: 0 0 60px 10px #a976dd;
  border-radius: 15%;
  z-index: -1;
}

.epic-reward {
  position: relative;
  width: 25%;
  height: 350px;
  border: 4px solid #fff;
  cursor: pointer;
}

.epic-reward > .reward-title {
  position: absolute;
  left: 0;
  z-index: 5;
  top: -80px;
  font-family: Chupada, sans-serif;
  font-weight: 700;
  font-size: 70px;
  color: #fff;
  transform-origin: 100% 50%;
  transform: scale(1, 1) skewX(-10deg);
  letter-spacing: 1.5px;
  word-spacing: 4px;
  user-select: none;
}

.epic-reward > .reward-day:before, .reward > .reward-day:before {
  content: '';
  display: inline-block;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: -1;
  background: #fff;
  transform-origin: 100% 100%;
  transform: skewX(-20deg);
}

.epic-reward > .reward-day, .reward > .reward-day {
  display: inline-block;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 20;
  color: #000;
  background: #fff;
  text-align: center;
  text-transform: uppercase;
  font-family: Nanami, sans-serif;
  letter-spacing: 2px;
  padding: 5px 10px;
  user-select: none;
}

.epic-reward > .reward-day {
  padding: 10px;
}

.reward-day-feature::before {
  background: #626262 !important;
}

.reward-day-feature {
  background: #626262 !important;
  color: #fff !important;
}

.reward-backpack, .reward-chest, .reward-coins, .reward-epic-chest {
  position: absolute;
  top: 0; left: 0;
  height: 100%; width: 100%;
  background-size: 92%;
  background-repeat: no-repeat;
  background-position: 50% 50%;
}

.rewarded {
  position: absolute;
  top: 0; left: 0;
  height: 100%; width: 100%;
  background: rgba(0,0,0,0.4);
  text-align: center;
}

.rewarded > i {
  transform: translateY(130%);
}

.current-reward-ico > i {
  vertical-align: middle;
}

.current-reward-ico::after {
  content: '';
  position: absolute;
  top: 0; right: 0;
  width: 100%; height: 100%;
  border-radius: 50%;
  box-shadow: 0 0 15px 3px rgb(246,169, 1);
  animation: blink 2s infinite ease-in-out;
}

.current-reward-ico {
  position: absolute;
  bottom: 5px; right: 5px;
  background: rgba(246,169, 1, 0.9);
  box-shadow: 0 0 5px 1px rgb(246,169, 1);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  text-align: center;
  font-family: Nanami, sans-serif;
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  z-index: 15;
}

@keyframes blink {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.collect-reward {
  position: absolute;
  bottom: -60px; left: 0;
  transform-origin: 100% 0;
  transform: skewX(-10deg);
  height: 40px; width: 100%;
  background: rgb(246,169, 1);
  cursor: pointer;
  user-select: none;
}

.collect-reward > div {
  text-align: center;
  line-height: 40px;
  transform: skewX(10deg);
  text-transform: uppercase;
  font-family: Nanami, sans-serif;
  letter-spacing: 2px;
}

.reward-current {
  box-shadow: 0 0 60px -2px rgb(246,169, 1);
}

.reward:hover .reward-description, .epic-reward:hover .reward-description {
  opacity: 1;
}

.reward-description {
  position: absolute;
  display: flex;
  top: 0; left: 0;
  height: 100%; width: 100%;
  background: rgba(0,0,0, 0.8);
  z-index: 10;
  vertical-align: middle;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  opacity: 0;
  transition: .24s;
}

.reward-description > .reward-description-title, .reward-description > .reward-description-info {
  color: #fff;
  font-family: Nanami, sans-serif;
  font-weight: 400;
  letter-spacing: 1px;
  font-variant: small-caps;
  font-size: 14px;
}

.reward-description > .reward-description-title {
  font-size: 20px;
  border-bottom: 1px solid #fff;
  margin-bottom: 20px;
  width: 90%;
  text-align: center;
}

.reward-description > .reward-description-info {
  text-align: center;
  width: 90%;
}

.ico-green {
  color: #1fea1e;
}
</style>
