<template>
  <div class="week-day-reward-item">
    <i class="reward-ico"></i>
    <span class="reward-text">{{ text }}</span>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.week-day-reward-item {
  margin-bottom: 5px;
}

.week-day-reward-item > .reward-text {
  font-variant: normal;
}

.reward-ico {
  display: inline-block;
  background-color: #fff;
  -webkit-mask-size: 18px;
  height: 18px;
  width: 18px; 
  transform: translate(0, 25%);
  margin-right: 5px;
}

.reward-text {
  display: inline;
  margin-top: -10px;
  word-wrap: break-word;
  color: #fff;
  font-family: Nanami, sans-serif;
  font-size: 14px;
}
</style>
