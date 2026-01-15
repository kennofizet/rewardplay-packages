<template>
  <div class="leaderboard-container skeleton">
    <div class="skeleton-line skeleton-title"></div>
    
    <div class="top-three-section">
      <div v-for="i in 3" :key="i" class="player-card skeleton-card">
        <div class="skeleton-circle"></div>
        <div class="skeleton-line skeleton-name"></div>
        <div class="skeleton-line skeleton-score"></div>
      </div>
    </div>
    
    <div class="ranked-list">
      <div v-for="i in 5" :key="i" class="ranked-item">
        <div class="skeleton-line skeleton-rank"></div>
        <div class="skeleton-circle skeleton-circle--small"></div>
        <div class="skeleton-line skeleton-name"></div>
        <div class="skeleton-line skeleton-score-small"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.skeleton {
  pointer-events: none;
}

.skeleton-line {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0.2) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0.2) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  margin: 0 auto 12px;
}

.skeleton-circle--small {
  width: 38px;
  height: 38px;
  margin: 0;
}

.skeleton-title {
  width: 200px;
  height: 24px;
  margin: 0 auto 30px;
}

.skeleton-name {
  width: 60px;
  height: 16px;
  margin: 0 auto 8px;
}

.skeleton-score {
  width: 80px;
  height: 24px;
  margin: 0 auto;
}

.skeleton-rank {
  width: 24px;
  height: 20px;
}

.skeleton-score-small {
  width: 70px;
  height: 20px;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

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

.top-three-section {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 30px;
  padding: 0 10px;
}

.player-card {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 20px 16px;
  text-align: center;
  width: 110px;
}

.ranked-list {
  position: relative;
}

.ranked-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 26px 16px;
  margin-bottom: 10px;
}
</style>
