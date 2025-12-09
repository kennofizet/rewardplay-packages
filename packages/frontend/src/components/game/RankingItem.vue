<template>
  <li class="c-list__item">
    <div class="c-list__grid">
      <div 
        :class="[
          'c-flag',
          'c-place',
          { 'u-text--dark u-bg--yellow': rank === 1 },
          { 'u-text--dark u-bg--teal': rank === 2 },
          { 'u-text--dark u-bg--orange': rank === 3 },
          { 'u-bg--transparent': rank > 3 }
        ]"
      >
        <span v-if="rank <= 3" class="c-flag__star">★</span>
        <span class="c-flag__number">{{ rank }}</span>
      </div>
      <div class="c-media">
        <div class="c-media__icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
          </svg>
        </div>
        <div class="c-media__content">
          <div class="c-media__title">{{ user.name }}</div>
          <div class="c-media__link">@{{ user.type || t('component.rankingItem.user') }}</div>
        </div>
      </div>
      <div 
        :class="[
          'u-text--right',
          'c-kudos',
          { 'u-text--orange': rank <= 3 },
          { 'u-text--white': rank > 3 }
        ]"
      >
        <strong>{{ user.coin }}</strong>
      </div>
    </div>
  </li>
</template>

<script setup>
import { inject } from 'vue'

const translator = inject('translator', null)
const t = translator || ((key) => key)

defineProps({
  rank: {
    type: Number,
    required: true
  },
  user: {
    type: Object,
    required: true,
    default: () => ({
      id: 0,
      name: '',
      avatar: '',
      coin: 0,
      type: 'USER'
    })
  }
})
</script>

<style scoped>
.c-list__item {
  padding: 22px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.c-list__grid {
  display: grid;
  grid-template-columns: 60px 1fr auto;
  gap: 20px;
  align-items: center;
}

.c-flag {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #fff;
  position: relative;
}

.c-flag__star {
  position: absolute;
  top: -2px;
  right: -2px;
  font-size: 12px;
  line-height: 1;
}

.c-flag__number {
  z-index: 1;
}

.u-bg--yellow {
  background: #ffd700;
}

.u-bg--teal {
  background: #20b2aa;
}

.u-bg--orange {
  background: #ff8c00;
}

.u-bg--transparent {
  background: transparent;
  color: #fff;
}

.c-media {
  display: flex;
  align-items: center;
  gap: 15px;
}

.c-media__icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.c-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.c-media__title {
  color: #fff;
  font-weight: 500;
  font-family: Nanami, sans-serif;
}

.c-media__link {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 12px;
}

.c-kudos {
  font-size: 18px;
  font-weight: bold;
  color: #fff;
}

.u-text--yellow {
  color: #ffd700;
}

.u-text--teal {
  color: #20b2aa;
}

.u-text--orange {
  color: #ff8c00;
}

.u-text--white {
  color: #fff;
}
</style>
