<template>
  <div class="menu">
    <div class="menu-left">
      <MenuItem 
        is-first 
        @click="$emit('page-change', 'reward')"
      >
        {{ t('component.menu.reward') }}
      </MenuItem>

      <MenuItem @click="$emit('page-change', 'bag')">
        {{ t('component.menu.bag') }}
      </MenuItem>

      <MenuItem @click="$emit('page-change', 'ranking')">
        {{ t('component.menu.ranking') }}
      </MenuItem>

      <MenuItem @click="$emit('page-change', 'lucky-wheel')">
        {{ t('component.menu.luckyWheel') }}
      </MenuItem>

      <MenuItem @click="$emit('page-change', 'rules')">
        {{ t('component.menu.rules') }}
      </MenuItem>

      <MenuItem @click="$emit('page-change', 'shop')">
        {{ t('component.menu.shop') }}
      </MenuItem>

      <MenuItem @click="$emit('page-change', 'manage-setting')">
        {{ t('component.menu.manageSetting') }}
      </MenuItem>
    </div>

    <div class="menu-right">
      <MenuItem 
        is-icon 
        is-light 
        @click="$emit('icon-click', 'icon1')"
      >
        &nbsp;
      </MenuItem>

      <MenuItem 
        is-icon 
        is-light 
        @click="$emit('icon-click', 'icon2')"
      >
        &nbsp;
      </MenuItem>

      <MenuItem 
        is-icon 
        is-dark 
        @click="$emit('icon-click', 'icon3')"
      >
        &nbsp;
      </MenuItem>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import MenuItem from './MenuItem.vue'

const translator = inject('translator', null)
const t = translator || ((key) => key)

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
