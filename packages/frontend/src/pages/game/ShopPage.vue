<template>
  <div class="shop-page">
    <Sector title="Shop">
      <div class="shop-content">
        <p class="coming-soon">Shop coming soon...</p>
        <!-- TODO: Implement shop functionality -->
      </div>
    </Sector>
  </div>
</template>

<script setup>
import Sector from '../../components/game/Sector.vue'
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
