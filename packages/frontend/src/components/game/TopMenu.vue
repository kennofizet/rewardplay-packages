<template>
  <div class="menu">
    <div class="menu-left">
      <MenuItem 
        is-first 
        @click="$emit('page-change', 'reward')"
      >
        Reward
      </MenuItem>

      <MenuItem @click="$emit('page-change', 'bag')">
        Bag
      </MenuItem>

      <MenuItem @click="$emit('page-change', 'lucky-wheel')">
        Lucky Wheel
      </MenuItem>

      <MenuItem @click="$emit('page-change', 'ranking')">
        Ranking
      </MenuItem>

      <MenuItem @click="$emit('page-change', 'rules')">
        Rules
      </MenuItem>

      <MenuItem @click="$emit('page-change', 'shop')">
        Shop
      </MenuItem>
    </div>

    <div class="menu-right">
      <MenuItem 
        is-icon 
        is-light 
        icon-image="test.png"
        @click="$emit('icon-click', 'icon1')"
      >
        &nbsp;
      </MenuItem>

      <MenuItem 
        is-icon 
        is-light 
        icon-image="test.png"
        @click="$emit('icon-click', 'icon2')"
      >
        &nbsp;
      </MenuItem>

      <MenuItem 
        is-icon 
        is-dark 
        icon-image="test.png"
        @click="$emit('icon-click', 'icon3')"
      >
        &nbsp;
      </MenuItem>
    </div>
  </div>
</template>

<script setup>
import MenuItem from './MenuItem.vue'

defineEmits(['page-change', 'icon-click'])
</script>

<style scoped>
.menu {
  padding: 10px 10px 0;
  background: linear-gradient(to top, #293545 1px, transparent 1px);
  user-select: none;
  overflow: hidden;
  min-width: 1315px;
}

.menu-right {
  float: right;
  margin-right: 5px;
}

.menu-left {
  float: left;
}
</style>
