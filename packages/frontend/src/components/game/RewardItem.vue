<template>
  <div class="week-day-reward-item">
    <i class="reward-ico"></i>
    <span class="reward-text">
      <template v-if="typeof text === 'object' && text.items">
        <span v-for="(item, index) in text.items" :key="index" class="reward-text-item">
          {{ item }}<span v-if="index < text.items.length - 1">, </span>
        </span>
        <RewardItemsTooltip 
          v-if="text.total > text.count && text.allItems" 
          :all-items="text.allItems"
          trigger="both"
        >
          <span class="reward-text-more">
            , +{{ text.total - text.count }} {{ t('component.dailyReward.more') }}
          </span>
        </RewardItemsTooltip>
      </template>
      <template v-else>
        {{ text }}
      </template>
    </span>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import RewardItemsTooltip from './RewardItemsTooltip.vue'

const translator = inject('translator', null)
const t = translator || ((key) => key)

defineProps({
  text: {
    type: [String, Object],
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

.reward-text-item {
  display: inline;
}

.reward-text-more {
  display: inline;
  font-style: italic;
  opacity: 0.8;
  cursor: pointer;
  transition: opacity 0.2s;
}

.reward-text-more:hover {
  opacity: 1;
  text-decoration: underline;
}
</style>
