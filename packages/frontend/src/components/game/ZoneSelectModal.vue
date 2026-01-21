<template>
  <div class="zone-modal">
    <div class="zone-modal__backdrop" @click="$emit('close')"></div>
    <div class="zone-modal__panel">
        <button class="zone-modal__close" @click="$emit('close')">×</button>
        <h3 class="zone-modal__title">{{ title }}</h3>
        <div class="zone-list">
          <button v-for="zone in zones" :key="zone.id" class="zone-btn" @click="select(zone)">
            <div class="zone-btn__name">{{ zone.name || ('Zone ' + zone.id) }}</div>
            <div class="zone-btn__id">ID: {{ zone.id }}</div>
          </button>
        </div>
      </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  zones: { type: Array, default: () => [] },
  title: { type: String, default: 'Select Zone' }
})

const emit = defineEmits(['select', 'close'])

function select(zone) {
  emit('select', zone)
}
</script>

<style scoped>
.zone-modal { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 1200; }
.zone-modal__backdrop { position: absolute; inset: 0; background: rgba(0,0,0,0.65); backdrop-filter: blur(4px); }
.zone-modal__panel {
  position: relative;
  background: linear-gradient(180deg, rgba(12,20,30,0.98) 0%, rgba(6,10,16,0.98) 100%);
  color: #e6eef6;
  padding: 24px;
  border-radius: 12px;
  min-width: 360px;
  max-width: 520px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0,0,0,0.6);
  z-index: 1300;
}
.zone-modal__close {
  position: absolute;
  right: 12px;
  top: 8px;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 22px;
  cursor: pointer;
}
.zone-modal__title { margin: 0 0 10px 0; font-size: 20px; color: #ffd66b; text-align: center }
.zone-list { display: flex; flex-direction: column; gap: 10px; margin-top: 8px }
.zone-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  border-radius: 10px;
  background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
  border: 1px solid rgba(255,255,255,0.06);
  color: #eaf6ff;
  cursor: pointer;
  transition: transform .08s ease, box-shadow .08s ease, background .08s ease;
}
.zone-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,0.5) }
.zone-btn__name { font-weight: 600 }
.zone-btn__id { font-size: 12px; opacity: 0.6 }

.zone-btn:active { transform: translateY(0) }
</style>
