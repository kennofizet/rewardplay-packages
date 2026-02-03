<template>
  <div class="manage-setting-page">
    <div class="manage-setting-container">
      <div class="left-menu">
        <div v-if="currentZoneName" class="current-zone-info">
          <div class="zone-label">{{ t('page.manageSetting.currentZone') }}</div>
          <div class="zone-name">{{ currentZoneName }}</div>
        </div>
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
import { ref, computed, inject, watch } from 'vue'
import SettingItemsListPage from './manage-setting/SettingItemsListPage.vue'
import SettingOptionsListPage from './manage-setting/SettingOptionsListPage.vue'
import SettingItemSetsListPage from './manage-setting/SettingItemSetsListPage.vue'
import SettingStatsTransformListPage from './manage-setting/SettingStatsTransformListPage.vue'
import SettingStackBonusListPage from './manage-setting/SettingStackBonusListPage.vue'
import SettingDailyRewardConfigPage from './manage-setting/SettingDailyRewardConfigPage.vue'
import SettingLevelExpListPage from './manage-setting/SettingLevelExpListPage.vue'
import SettingEventsListPage from './manage-setting/SettingEventsListPage.vue'
import SettingShopListPage from './manage-setting/SettingShopListPage.vue'
import SettingBoxTicketBuffPage from './manage-setting/SettingBoxTicketBuffPage.vue'
import ManageZonesPage from './manage-setting/ManageZonesPage.vue'

const translator = inject('translator', null)
const t = translator || ((key) => key)

const hasSelectedZone = computed(() => {
  try {
    const selectedZone = localStorage.getItem('selected_zone')
    return selectedZone && JSON.parse(selectedZone)?.id
  } catch (e) {
    return false
  }
})

const currentZoneName = computed(() => {
  try {
    const selectedZone = localStorage.getItem('selected_zone')
    if (selectedZone) {
      const zone = JSON.parse(selectedZone)
      return zone?.name || null
    }
    return null
  } catch (e) {
    return null
  }
})

const allMenuItems = [
  { key: 'setting-items', label: t('page.manageSetting.menu.settingItems'), requiresZone: true },
  { key: 'setting-options', label: t('page.manageSetting.menu.settingOptions'), requiresZone: true },
  { key: 'setting-item-sets', label: t('page.manageSetting.menu.settingItemSets'), requiresZone: true },
  { key: 'setting-stats-transform', label: t('page.manageSetting.menu.settingStatsTransform'), requiresZone: true },
  { key: 'manage-zones', label: t('page.manageSetting.menu.manageZones'), requiresZone: false },
  { key: 'setting-stack-bonuses', label: t('page.manageSetting.settingStackBonuses.title'), requiresZone: true },
  { key: 'setting-daily-rewards', label: t('page.manageSetting.settingDailyRewards.title'), requiresZone: true },
  { key: 'setting-level-exps', label: t('page.manageSetting.settingLevelExps.title'), requiresZone: true },
  { key: 'setting-events', label: t('page.manageSetting.settingEvents.title'), requiresZone: true },
  { key: 'setting-shop', label: t('page.manageSetting.settingShop.title'), requiresZone: true },
  { key: 'setting-box-ticket-buff', label: t('page.manageSetting.settingBoxTicketBuff.title'), requiresZone: true }
]

const menuItems = computed(() => {
  if (hasSelectedZone.value) {
    return allMenuItems
  }
  // Only show zones management when no zone is selected
  return allMenuItems.filter(item => !item.requiresZone)
})

const currentPage = ref('manage-zones')

const currentPageComponent = computed(() => {
  const pageMap = {
    'setting-items': SettingItemsListPage,
    'setting-options': SettingOptionsListPage,
    'setting-item-sets': SettingItemSetsListPage,
    'setting-stats-transform': SettingStatsTransformListPage,
    'manage-zones': ManageZonesPage,
    'setting-stack-bonuses': SettingStackBonusListPage,
    'setting-daily-rewards': SettingDailyRewardConfigPage,
    'setting-level-exps': SettingLevelExpListPage,
    'setting-events': SettingEventsListPage,
    'setting-shop': SettingShopListPage,
    'setting-box-ticket-buff': SettingBoxTicketBuffPage
  }
  return pageMap[currentPage.value] || SettingItemsListPage
})

const handleMenuClick = (pageKey) => {
  currentPage.value = pageKey
}

// Watch for zone selection changes and reset to manage-zones if zone is deselected
watch(hasSelectedZone, (hasZone) => {
  if (!hasZone && currentPage.value !== 'manage-zones') {
    currentPage.value = 'manage-zones'
  }
})
</script>

<style scoped>
.manage-setting-page {
  width: 100%;
  height: calc(100% - 60px);
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
  padding: 0;
  min-height: 500px;
  display: flex;
  flex-direction: column;
}

.current-zone-info {
  padding: 20px;
  background: linear-gradient(135deg, #253344 0%, #1a2332 100%);
  border-bottom: 2px solid #f6a901;
  margin-bottom: 10px;
}

.zone-label {
  font-size: 11px;
  text-transform: uppercase;
  color: #8a9196;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
  font-weight: 500;
}

.zone-name {
  font-size: 16px;
  color: #f6a901;
  font-weight: 600;
  word-break: break-word;
  line-height: 1.3;
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

