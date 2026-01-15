<template>
  <div class="card top-me-card skeleton">
    <div class="card__header">
      <div class="skeleton-line skeleton-label"></div>
    </div>
    <div class="card__metrics">
      <div class="metric">
        <div class="skeleton-line skeleton-metric-label"></div>
        <div class="skeleton-line skeleton-metric-value"></div>
      </div>
      <div class="metric">
        <div class="skeleton-line skeleton-metric-label"></div>
        <div class="skeleton-line skeleton-metric-value"></div>
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
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.1) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-label {
  width: 120px;
  height: 20px;
}

.skeleton-metric-label {
  width: 80px;
  height: 16px;
  margin-bottom: 8px;
}

.skeleton-metric-value {
  width: 100px;
  height: 28px;
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
  padding: 20px;
  color: #fff;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card__metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.metric {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}
</style>
