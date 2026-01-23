<template>
  <div class="manage-setting-page">
    <div class="manage-setting-container">
      <div class="left-menu">
        <div 
          v-for="menuItem in menuItems" 
          :key="menuItem.key"
          :class="['menu-item', { active: currentPage === menuItem.key }]"
          @click="handleMenuClick(menuItem.key)"
        >
          {{ menuItem.label }}
        </div>
      </div>
      
      <div class="content-area">
        <component :is="currentPageComponent" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import SettingItemsListPage from './manage-setting/SettingItemsListPage.vue'
import SettingOptionsListPage from './manage-setting/SettingOptionsListPage.vue'
import SettingItemSetsListPage from './manage-setting/SettingItemSetsListPage.vue'
import SettingStackBonusListPage from './manage-setting/SettingStackBonusListPage.vue'
import SettingDailyRewardConfigPage from './manage-setting/SettingDailyRewardConfigPage.vue'
import ManageZonesPage from './manage-setting/ManageZonesPage.vue'

const translator = inject('translator', null)
const t = translator || ((key) => key)

const menuItems = [
  { key: 'setting-items', label: t('page.manageSetting.menu.settingItems') },
  { key: 'setting-options', label: t('page.manageSetting.menu.settingOptions') },
  { key: 'setting-item-sets', label: t('page.manageSetting.menu.settingItemSets') },
  { key: 'manage-zones', label: t('page.manageSetting.menu.manageZones') },
  { key: 'setting-stack-bonuses', label: 'Stack Bonuses' },
  { key: 'setting-daily-rewards', label: 'Daily Rewards Config' }
]

const currentPage = ref('setting-items')

const currentPageComponent = computed(() => {
  const pageMap = {
    'setting-items': SettingItemsListPage,
    'setting-options': SettingOptionsListPage,
    'setting-item-sets': SettingItemSetsListPage,
    'manage-zones': ManageZonesPage,
    'setting-stack-bonuses': SettingStackBonusListPage,
    'setting-daily-rewards': SettingDailyRewardConfigPage
  }
  return pageMap[currentPage.value] || SettingItemsListPage
})

const handleMenuClick = (pageKey) => {
  currentPage.value = pageKey
}
</script>

<style scoped>
.manage-setting-page {
  width: 100%;
  height: 100%;
  padding: 20px;
}

.manage-setting-container {
  display: flex;
  width: 100%;
  height: 100%;
  gap: 20px;
  box-sizing: border-box;
}

.left-menu {
  width: 250px;
  background: #2d3a4b;
  border: 1px solid #253344;
  padding: 20px 0;
  min-height: 500px;
}

.menu-item {
  padding: 15px 20px;
  color: #d0d4d6;
  cursor: pointer;
  transition: all 0.25s;
  border-left: 3px solid transparent;
}

.menu-item:hover {
  background: #253344;
  color: #f6f6f8;
}

.menu-item.active {
  background: #253344;
  color: #f6a901;
  border-left-color: #f6a901;
  font-weight: 600;
}

.content-area {
  flex: 1;
  background: #2d3a4b;
  border: 1px solid #253344;
  padding: 20px;
  overflow-y: auto;
}
</style>

