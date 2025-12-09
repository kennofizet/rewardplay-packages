<template>
  <div class="shop-page">
    <Sector :title="t('component.shop.title')">
      <div class="shop-content">
        <p class="coming-soon">{{ t('component.shop.comingSoon') }}</p>
        <!-- TODO: Implement shop functionality -->
      </div>
    </Sector>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import Sector from '../../components/game/Sector.vue'

const translator = inject('translator', null)
const t = translator || ((key) => key)
</script>

<style scoped>
.shop-page {
  margin-top: 20px;
}

.shop-content {
  padding: 40px;
  text-align: center;
}

.coming-soon {
  color: #fff;
  font-family: Nanami, sans-serif;
  font-size: 24px;
}
</style>
