<template>
  <Teleport to="body">
    <div class="alert-message" role="alertdialog" aria-modal="true" aria-labelledby="alert-message-title">
      <div class="alert-message__backdrop" @click="close"></div>
      <div class="alert-message__box">
        <button
          type="button"
          class="alert-message__close"
          aria-label="Close"
          @click="close"
        >
          ×
        </button>
        <h3 id="alert-message-title" class="alert-message__title">{{ t('component.alert.title') || 'Message' }}</h3>
        <p class="alert-message__text">{{ message }}</p>
        <div class="alert-message__actions">
          <button type="button" class="alert-message__btn" @click="close">
            {{ t('component.alert.close') || 'Close' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { inject } from 'vue'

defineProps({
  message: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['close'])
const translator = inject('translator', null)
const t = translator || ((key) => key)

function close() {
  emit('close')
}
</script>

<style scoped>
.alert-message {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  pointer-events: auto;
}

.alert-message__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
}

.alert-message__box {
  --alert-bg: linear-gradient(180deg, rgba(18, 28, 42, 0.98) 0%, rgba(10, 16, 26, 0.98) 100%);
  --alert-border: 1px solid rgba(255, 255, 255, 0.12);
  --alert-gold: #f6a901;
  --alert-gold-dim: rgba(246, 169, 1, 0.85);
  --alert-text: #e6eef6;
  --alert-text-dim: rgba(230, 238, 246, 0.9);
  position: relative;
  min-width: 280px;
  max-width: 420px;
  width: 90%;
  padding: 24px 20px 20px;
  background: var(--alert-bg);
  border: var(--alert-border);
  border-radius: 12px;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(246, 169, 1, 0.08);
  z-index: 10000;
  font-family: 'Nanami', system-ui, sans-serif;
  color: var(--alert-text);
  text-align: center;
}

.alert-message__close {
  position: absolute;
  right: 10px;
  top: 8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--alert-text-dim);
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  border-radius: 6px;
  transition: color 0.15s ease, background 0.15s ease;
}

.alert-message__close:hover {
  color: var(--alert-text);
  background: rgba(255, 255, 255, 0.06);
}

.alert-message__title {
  margin: 0 0 14px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--alert-gold);
  letter-spacing: 0.02em;
}

.alert-message__text {
  margin: 0 0 20px 0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--alert-text-dim);
  white-space: pre-wrap;
  word-break: break-word;
}

.alert-message__actions {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.alert-message__btn {
  padding: 10px 24px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a2332;
  background: linear-gradient(180deg, var(--alert-gold) 0%, var(--alert-gold-dim) 100%);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(246, 169, 1, 0.3);
  transition: transform 0.08s ease, box-shadow 0.15s ease;
}

.alert-message__btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(246, 169, 1, 0.35);
}

.alert-message__btn:active {
  transform: translateY(0);
}
</style>
