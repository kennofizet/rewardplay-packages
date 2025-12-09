<template>
  <div class="box box-rules">
    <img 
      class="rules-box-bg" 
      :src="getImageUrl('rules-box.png')" 
      alt="Rules Box"
    >
    <div class="menu">
      <ul>
        <li 
          class="menu-roles"
          :class="{ active: activeTab === 'rules' }"
          @click="activeTab = 'rules'"
        >
          <span>{{ t('component.rules.rulesTab') }}</span>
        </li>
        <li 
          class="menu-quest"
          :class="{ active: activeTab === 'quest' }"
          @click="activeTab = 'quest'"
        >
          <span>{{ t('component.rules.questTab') }}</span>
        </li>
      </ul>
    </div>
    <div 
      class="content menu content-rules"
      :class="{ show: activeTab === 'rules' }"
    >
      <img :src="getImageUrl('rules-text.png')" alt="Rules Text">
    </div>
    <div 
      class="content menu content-quest"
      :class="{ show: activeTab === 'quest' }"
    >
      <div class="title-first">{{ displayGrindingQuest }}</div>
      <div class="text-right" style="right: 109px;bottom: 10px;position: absolute;">
        <!-- + 9000 -->
      </div>
      <div class="content-detail-quest">
        <div class="category-item">
          <div class="title">{{ t('component.rules.dailyQuest') }}</div>
          <ul>
            <li>
              <span class="text-left">{{ t('component.rules.putDailyReward') }}</span>
              <span class="text-right">
                <i class="fas fa-check-circle" style="color:snow"></i>
              </span>
            </li>
            <li>
              <span class="text-left">{{ t('component.rules.loginDaily') }}</span>
              <span class="text-right">
                <i class="fas fa-check-circle" style="color:snow"></i>
              </span>
            </li>
            <li>
              <span class="text-left">{{ t('component.rules.checkpoint') }}</span>
              <span class="text-right">
                <i class="fas fa-check-circle" style="color:snow"></i>
              </span>
            </li>
          </ul>
          <div class="title title-unf">{{ t('component.rules.mainQuest') }}</div>
          <ul>
            <li v-for="task in mainQuests" :key="task.id">
              <span class="text-left">{{ task.name }}</span>
              <span class="text-right">{{ task.reward }}</span>
            </li>
          </ul>
          <div class="title title-unf">{{ t('component.rules.other') }}</div>
          <ul>
            <li>
              <span class="text-left">{{ t('component.rules.luckyWheel') }}</span>
              <span class="text-right">1~9999</span>
            </li>
          </ul>
          <div class="title title-unf">{{ t('component.rules.buff') }}</div>
          <ul>
            <li>
              <span class="text-left">{{ t('component.rules.loginConsecutive') }}</span>
              <span class="text-right">{{ bonusDaily }}%</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, unref, computed } from 'vue'
import { removeVietnameseDiacritics } from '../../i18n/utils'

const imagesUrl = inject('imagesUrl', '')
const translator = inject('translator', null)
const language = inject('language', 'en')
const t = translator || ((key) => key)

// Remove diacritics for Vietnamese when using Chupada font
const displayGrindingQuest = computed(() => {
  const text = t('component.rules.grindingQuest')
  if (language === 'vi') {
    return removeVietnameseDiacritics(text)
  }
  return text
})

const activeTab = ref('rules')
const bonusDaily = ref(10)
const mainQuests = ref([
  { id: 1, name: 'Task 1', reward: 1000 },
  { id: 2, name: 'Task 2', reward: 2000 }
])

const getImageUrl = (filename) => {
  if (!filename) return ''
  const url = unref(imagesUrl)
  if (!url) {
    return `/${filename}`
  }
  const base = url.endsWith('/') ? url : `${url}/`
  const file = filename.startsWith('/') ? filename.slice(1) : filename
  return `${base}${file}`
}
</script>

<style scoped>
.box-rules {
  position: relative;
  width: 100%;
  min-height: 600px;
}

.rules-box-bg {
  width: 1700px;
  position: absolute;
  left: 21px;
  top: -76px;
  z-index: -1;
}

.menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 15px;
  position: relative;
  z-index: 10;
  margin-left: 20px;
}

.menu li {
  cursor: pointer;
  padding: 0;
  color: #fff;
  font-family: Nanami, sans-serif;
  position: relative;
  transition: all 0.25s ease;
}

.menu-roles,
.menu-quest {
  display: inline-block;
  position: relative;
}

.menu-roles span,
.menu-quest span {
  display: inline-block;
  padding: 8px 25px;
  background: #2d3a4b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #d0d4d6;
  font-size: 18px;
  font-weight: 400;
  letter-spacing: 1px;
  transition: all 0.25s ease;
  position: relative;
  z-index: 1;
}

.menu-roles span.bottom-mr,
.menu-quest span.top-mr {
  margin-left: -1px;
}

.menu li.active .menu-roles span,
.menu li.active .menu-quest span {
  background: #f6a901;
  border-color: #f6a901;
  color: #423714;
  font-weight: 600;
  box-shadow: 
    0 2px 8px rgba(246, 169, 1, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.menu li:hover:not(.active) .menu-roles span,
.menu li:hover:not(.active) .menu-quest span {
  background: #3d4a5b;
  border-color: rgba(246, 169, 1, 0.5);
  color: #fff;
}

.menu li.active .menu-roles span::after,
.menu li.active .menu-quest span::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 4px;
  background: #f6f6f8;
  z-index: 2;
}

.content {
  display: none;
  position: relative;
  z-index: 5;
  margin-top: 50px;
}

.content.show {
  display: block;
}

.title-first {
  font-family: Chupada, sans-serif;
  font-size: 84px;
  color: #fff;
  margin-bottom: 30px;
}

.category-item {
  color: #fff;
  font-family: Nanami, sans-serif;
}

.category-item .title {
  font-size: 24px;
  font-weight: bold;
  margin: 20px 0 10px 0;
}

.category-item .title-unf {
  margin-top: 30px;
}

.category-item ul {
  list-style: none;
  padding: 0;
  margin: 10px 0;
}

.category-item li {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.text-left {
  text-align: left;
}

.text-right {
  text-align: right;
  padding-left: 7px;
}

.box-rules .menu {
  padding-top: 20px;
}

.box-rules .content-rules {
  margin-left: 167px;
  margin-top: 22px;
}

.box-rules .content-quest {
  margin-left: 500px;
  margin-top: 223px;
}
</style>
