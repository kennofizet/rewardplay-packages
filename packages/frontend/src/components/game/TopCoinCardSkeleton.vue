<template>
  <div class="card top-coin-card skeleton">
    <div class="card__header">
      <div class="skeleton-line skeleton-title"></div>
      <div class="skeleton-line skeleton-select"></div>
    </div>
    <div class="card__body">
      <ul class="list">
        <li class="list__header">
          <div class="list__grid">
            <div class="skeleton-line skeleton-header"></div>
            <div class="skeleton-line skeleton-header"></div>
            <div class="skeleton-line skeleton-header"></div>
          </div>
        </li>
        <li v-for="i in 10" :key="i" class="list__item">
          <div class="list__grid">
            <div class="skeleton-line skeleton-rank"></div>
            <div class="skeleton-line skeleton-name"></div>
            <div class="skeleton-line skeleton-coin"></div>
          </div>
        </li>
      </ul>
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
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.1) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  height: 20px;
}

.skeleton-title {
  width: 150px;
  height: 24px;
}

.skeleton-select {
  width: 120px;
  height: 36px;
  border-radius: 8px;
}

.skeleton-header {
  width: 80px;
  height: 16px;
}

.skeleton-rank {
  width: 40px;
  height: 55px;
}

.skeleton-name {
  width: 120px;
  height: 20px;
}

.skeleton-coin {
  width: 100px;
  height: 20px;
}

.list__item {
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
  border-radius: 16px;
  color: #fff;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.card__header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.card__body {
  padding: 0;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list__header {
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.list__grid {
  display: grid;
  grid-template-columns: 60px 1fr auto;
  gap: 20px;
  align-items: center;
}
</style>
