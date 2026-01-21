<template>
  <TopWeekCardSkeleton v-if="loading" />
  <ErrorState v-else-if="error" :message="error" @retry="$emit('retry')" />
  <div v-else class="leaderboard-container">
    <div class="leaderboard-title">• {{ t('component.topWeek.title') }} •</div>
    
    <div class="top-three-section">
      <div 
        v-for="(player, index) in topThree" 
        :key="player.id || index"
        :class="[
          'player-card', 
          `player-card--${index + 1}`,
          { 'player-card--order-2': index === 0 },
          { 'player-card--order-1': index === 1 },
          { 'player-card--order-3': index === 2 }
        ]"
      >
        <div class="player-card__icon">
          <div class="coin-icon">
            <div class="coin-icon__person"></div>
          </div>
        </div>
        <div class="player-card__name">{{ player.name || `PLAYER ${index + 1}` }}</div>
        <div class="player-card__score">{{ formatScore(player.score || player.coin || 0) }}</div>
        <div class="player-card__badge">
          <span>{{ index + 1 }}</span>
        </div>
      </div>
    </div>
    
    <div class="ranked-list">
      <div 
        v-for="(player, index) in remainingPlayers" 
        :key="player.id || index + 4"
        class="ranked-item"
      >
        <div class="ranked-item__rank">{{ index + 4 }}.</div>
        <div class="ranked-item__icon">
          <div class="coin-icon coin-icon--small">
            <div class="coin-icon__person"></div>
          </div>
        </div>
        <div class="ranked-item__name">{{ player.name || `PLAYER ${index + 4}` }}</div>
        <div class="ranked-item__score">{{ formatScore(player.score || player.coin || 0) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import TopWeekCardSkeleton from './TopWeekCardSkeleton.vue'
import ErrorState from '../ui/ErrorState.vue'

const props = defineProps({
  topThree: {
    type: Array,
    default: () => [],
  },
  remainingPlayers: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: null,
  },
})

const translator = inject('translator', null)
const t = translator || ((key) => key)

const formatScore = (score) => {
  if (typeof score === 'number') {
    return score.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/,/g, '.')
  }
  return String(score).replace(/,/g, '.')
}

defineEmits(['retry'])
</script>

<style scoped>
.leaderboard-container {
  background: #34988e;
  border-radius: 24px;
  padding: 30px 20px;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
  overflow: hidden;
  min-height: 600px;
}

.leaderboard-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(circle at 15% 25%, rgba(255, 200, 150, 0.2) 0%, transparent 40%),
    radial-gradient(circle at 85% 75%, rgba(255, 220, 180, 0.18) 0%, transparent 45%),
    radial-gradient(circle at 50% 50%, rgba(52, 152, 142, 0.25) 0%, transparent 55%),
    radial-gradient(circle at 30% 70%, rgba(255, 180, 130, 0.12) 0%, transparent 35%),
    radial-gradient(circle at 70% 30%, rgba(255, 200, 160, 0.15) 0%, transparent 40%);
  pointer-events: none;
  z-index: 0;
}

.leaderboard-container::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(52, 152, 142, 0.3) 2px, transparent 2px),
    radial-gradient(circle at 90% 80%, rgba(255, 200, 150, 0.25) 3px, transparent 3px),
    radial-gradient(circle at 25% 60%, rgba(52, 152, 142, 0.2) 1.5px, transparent 1.5px),
    radial-gradient(circle at 75% 40%, rgba(255, 220, 180, 0.2) 2px, transparent 2px);
  background-size: 80px 80px, 100px 100px, 60px 60px, 90px 90px;
  background-position: 0 0, 20px 20px, 40px 40px, 60px 60px;
  pointer-events: none;
  z-index: 0;
  opacity: 0.4;
}

.leaderboard-title {
  text-align: center;
  font-size: 1.4rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  margin-bottom: 30px;
  position: relative;
  z-index: 1;
}

.top-three-section {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 30px;
  position: relative;
  z-index: 1;
  padding: 0 10px;
}

.player-card--order-1 {
  order: 1;
}

.player-card--order-2 {
  order: 2;
}

.player-card--order-3 {
  order: 3;
}

.player-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px 16px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  position: relative;
  color: #333;
  transition: transform 0.3s ease;
}

.player-card--1 {
  width: 140px;
  padding: 24px 18px;
  transform: translateY(-20px);
  z-index: 3;
}

.player-card--2,
.player-card--3 {
  width: 110px;
  padding: 18px 14px;
  transform: translateY(-10px);
}

.player-card--2 {
  z-index: 2;
}

.player-card--3 {
  z-index: 1;
}

.player-card__icon {
  margin-bottom: 12px;
  display: flex;
  justify-content: center;
}

.coin-icon {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
  position: relative;
}

.player-card--2 .coin-icon,
.player-card--3 .coin-icon {
  width: 55px;
  height: 55px;
}

.coin-icon--small {
  width: 32px;
  height: 32px;
}

.coin-icon__person {
  width: 40%;
  height: 40%;
  background: #333;
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  position: relative;
}

.coin-icon--small .coin-icon__person {
  width: 45%;
  height: 45%;
}

.player-card__name {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #1a1a1a;
  letter-spacing: 0.02em;
}

.player-card--1 .player-card__name {
  font-size: 1rem;
}

.player-card__score {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 12px;
}

.player-card--1 .player-card__score {
  font-size: 1.6rem;
}

.player-card__badge {
  position: absolute;
  bottom: -18px;
  left: 50%;
  transform: translateX(-50%);
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 3px solid #fff;
}

.player-card__badge span {
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
}

.ranked-list {
  position: relative;
  z-index: 1;
}

.ranked-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  border-radius: 12px;
  padding: 26px 16px 26px 16px;
  margin-bottom: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.ranked-item__rank {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  min-width: 32px;
}

.ranked-item__icon {
  display: flex;
  align-items: center;
}

.ranked-item__name {
  flex: 1;
  font-size: 0.95rem;
  font-weight: 500;
  color: #1a1a1a;
  letter-spacing: 0.01em;
}

.ranked-item__score {
  background: linear-gradient(135deg, #ff8c42 0%, #ffa366 100%);
  color: #fff;
  padding: 6px 14px;
  border-radius: 0 8px 8px 0;
  font-size: 0.95rem;
  font-weight: 600;
  min-width: 70px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(255, 140, 66, 0.3);
  margin-left: auto;
}

</style>
