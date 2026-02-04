<template>
  <div class="zone-page">
    <div class="zone-page__backdrop"></div>
    <div class="zone-page__container">
      <header class="zone-page__header">
        <h2>{{ title }}</h2>
      </header>

      <div class="zone-page__list">
        <button v-for="zone in zones" :key="zone.id" class="zone-card" @click="select(zone)">
          <div class="zone-card__name">{{ zone.name || ('Zone ' + zone.id) }}</div>
          <div class="zone-card__meta">ID: {{ zone.id }}</div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  zones: { type: Array, default: () => [] },
  title: { type: String, default: 'Select Zone' },
  cancelText: { type: String, default: 'Cancel' }
})

const emit = defineEmits(['select', 'close'])

function select(zone) {
  emit('select', zone)
}
</script>

<style scoped>
.zone-page {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #051018 0%, #02050a 100%);
}
.zone-page__backdrop { position: absolute; inset: 0; background: rgba(0,0,0,0.35); }
.zone-page__container {
  position: relative;
  z-index: 10;
  width: 920px;
  max-width: 96%;
  background: rgba(10,18,28,0.95);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.6);
  color: #e6eef6;
}
.zone-page__header { text-align: center; margin-bottom: 18px }
.zone-page__list { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center }
.zone-card { flex: 0 0 280px; padding: 14px; border-radius: 10px; background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); border: 1px solid rgba(255,255,255,0.04); color: inherit; cursor: pointer }
.zone-card__name { font-weight: 700; margin-bottom: 6px }
.zone-card__meta { font-size: 13px; opacity: 0.7 }
.zone-page__footer { margin-top: 18px; text-align: center }
.zone-page__cancel { background: transparent; border: 1px solid rgba(255,255,255,0.06); color: #fff; padding: 8px 14px; border-radius: 8px; cursor: pointer }
</style>
