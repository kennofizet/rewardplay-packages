<template>
  <div class="ranking-game">
    <div class="l-grid">
      <div class="l-grid__item l-grid__item--sticky">
        <div class="c-card u-bg--light-gradient u-text--dark">
          <div class="c-card__body">
            <div class="u-display--flex u-justify--space-between">
              <div class="u-text--left">
                <div class="u-text--small">My Rank</div>
                <h2>Top {{ myRank }}</h2>
              </div>
              <div class="u-text--right">
                <div class="u-text--small">My Coin</div>
                <h2>{{ myCoin }}</h2>
              </div>
            </div>
          </div>
        </div>
        <div class="c-card">
          <div class="c-card__body">
            <div class="u-text--center" id="winner">
              <div class="u-text-small u-text--medium u-mb--16">Top In Week</div>
              <img 
                v-if="top1User" 
                class="c-avatar c-avatar--lg avatar-fix-content-corver-non" 
                :src="top1User.avatar" 
                :alt="top1User.name"
              />
              <h3 v-if="top1User" class="u-mt--16">{{ top1User.name }}</h3>
              <span class="u-text--teal u-text--small">........</span>
            </div>
          </div>
        </div>
      </div>
      <div class="l-grid__item">
        <div class="c-card">
          <div class="c-card__header">
            <h3>Top 10 Coin</h3>
            <select class="c-select">
              <option selected>Now</option>
            </select>
          </div>
          <div class="c-card__body">
            <ul class="c-list" id="list">
              <li class="c-list__item">
                <div class="c-list__grid">
                  <div class="u-text--left u-text--small u-text--medium">Top</div>
                  <div class="u-text--left u-text--small u-text--medium">Member</div>
                  <div class="u-text--right u-text--small u-text--medium"># of Coin</div>
                </div>
              </li>
              <RankingItem
                v-for="(user, index) in topUsers"
                :key="user.id"
                :rank="index + 1"
                :user="user"
              />
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import RankingItem from '../../components/game/RankingItem.vue'

const gameApi = inject('gameApi', null)

const myRank = ref(0)
const myCoin = ref(0)
const top1User = ref(null)
const topUsers = ref([])

onMounted(async () => {
  if (gameApi) {
    try {
      // TODO: Load ranking data from API
      // const response = await gameApi.getRanking()
      // myRank.value = response.myRank
      // myCoin.value = response.myCoin
      // topUsers.value = response.topUsers
      // top1User.value = response.top1User
    } catch (error) {
      console.error('Error loading ranking:', error)
    }
  }
})
</script>

<style scoped>
.ranking-game {
  color: var(--color);
  font-size: 1.6rem;
  font-family: 'Overpass Mono', system-ui;
  margin-top: 20px;
}

.l-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
}

.l-grid__item--sticky {
  position: sticky;
  top: 20px;
  height: fit-content;
}

.c-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin-bottom: 20px;
}

.c-card__body {
  padding: 20px;
}

.c-card__header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.u-display--flex {
  display: flex;
}

.u-justify--space-between {
  justify-content: space-between;
}

.u-text--left {
  text-align: left;
}

.u-text--right {
  text-align: right;
}

.u-text--small {
  font-size: 14px;
}

.u-text--center {
  text-align: center;
}

.c-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.c-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

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

h2, h3 {
  margin: 0;
  color: #fff;
  font-family: Nanami, sans-serif;
}
</style>
