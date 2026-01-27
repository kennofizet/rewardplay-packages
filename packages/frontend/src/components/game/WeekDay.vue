<template>
  <div class="week-day">
    <div class="week-day-title">
      <i v-if="isCompleted" class="fas fa-check ico-green"></i>
      {{ title }}
    </div>
    <div 
      :class="[
        'week-day-indicator',
        { 'week-day-indicator-past': isPast || isCompleted },
        { 'week-day-indicator-current': isCurrent }
      ]"
    ></div>
    <div class="week-day-description">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  isPast: {
    type: Boolean,
    default: false
  },
  isCurrent: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.week-day {
  width: 14%;
}

.week-day-title {
  color: #fff;
  text-align: center;
  margin-bottom: 10px;
  text-transform: uppercase;
  font-family: Nanami, sans-serif;
  letter-spacing: 2px;
  user-select: none;
}

.week-day-indicator {
  height: 30px;
  background: rgba(200,200,200, 0.6);
  transform-origin: 100% 100%;
  transform: skewX(-10deg);
}

.week-day-indicator-past {
  background: #f6a901;
}

.week-day-indicator-current {
  background: #fff;
  box-shadow: 0 0 30px 2px #f6a901;
  animation: shine 3s infinite;
}

@keyframes shine {
  0% {
    box-shadow: 0 0 10px 1px #f6a901;
  }
  50% {
    box-shadow: 0 0 30px 2px #f6a901;
  }
  100% {
    box-shadow: 0 0 10px 1px #f6a901;
  }
}

.week-day-description {
  margin: 15px;
  color: #fff;
  font-family: Nanami, sans-serif;
  font-weight: 400;
  letter-spacing: 1px;
  font-size: 14px;
  line-height: 25px;
  font-variant: small-caps;
  user-select: none;
}

.ico-green {
  color: #1fea1e;
  margin-right: 8px;
}
</style>
