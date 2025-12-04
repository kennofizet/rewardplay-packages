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
        {{ rank }}
      </div>
      <div class="c-media">
        <img 
          class="avatar-fix-content-corver-non c-avatar c-media__img" 
          :src="user.avatar" 
          :alt="user.name"
        >
        <div class="c-media__content">
          <div class="c-media__title">{{ user.name }}</div>
          <a class="c-media__link u-text--small" href="#" target="_blank">
            @{{ user.type || 'USER' }}
          </a>
        </div>
      </div>
      <div 
        :class="[
          'u-text--right',
          'c-kudos',
          { 'u-text--yellow': rank === 1 },
          { 'u-text--teal': rank === 2 },
          { 'u-text--orange': rank === 3 }
        ]"
      >
        <div class="u-mt--8">
          <strong>{{ user.coin }}</strong>
        </div>
      </div>
    </div>
  </li>
</template>

<script setup>
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
  padding: 15px;
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
</style>
