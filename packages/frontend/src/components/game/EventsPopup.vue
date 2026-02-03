<template>
  <div class="events-popup">
    <div class="events-popup__backdrop" @click="$emit('close')"></div>
    <div class="events-popup__panel">
      <button type="button" class="events-popup__close" aria-label="Close" @click="$emit('close')">×</button>
      <h2 class="events-popup__title">{{ t('component.events.title') }}</h2>

      <div class="events-popup__body">
        <!-- Left: list of event cards -->
        <aside class="events-popup__list">
          <button
            v-for="evt in events"
            :key="evt.id"
            type="button"
            class="events-popup__card"
            :class="{ 'events-popup__card--active': selectedEvent?.id === evt.id }"
            @click="selectedEvent = evt"
          >
            <div class="events-popup__card-image-wrap">
              <img
                :src="getImageUrl(evt.image)"
                :alt="evt.name"
                class="events-popup__card-image"
              >
            </div>
            <span class="events-popup__card-name">{{ evt.name }}</span>
          </button>
        </aside>

        <!-- Right: event detail (event image as background, cover) -->
        <main
          class="events-popup__detail"
          :class="{ 'events-popup__detail--empty': !selectedEvent, 'events-popup__detail--has-bg': selectedEvent?.image }"
          :style="detailBackgroundStyle"
        >
          <div class="events-popup__detail-inner">
            <template v-if="selectedEvent">
              <h3 class="events-popup__detail-name">{{ selectedEvent.name }}</h3>
              <p class="events-popup__detail-desc">{{ selectedEvent.description }}</p>

              <section v-if="selectedEvent.bonus?.length" class="events-popup__section">
                <h4 class="events-popup__section-title">{{ t('component.events.bonus') }}</h4>
                <ul class="events-popup__bonus-list">
                  <li
                    v-for="(b, i) in selectedEvent.bonus"
                    :key="i"
                    class="events-popup__bonus-item"
                  >
                    <span class="events-popup__bonus-label">{{ b.label }}:</span>
                    <span class="events-popup__bonus-value">{{ b.value }}</span>
                  </li>
                </ul>
              </section>

              <section v-if="selectedEvent.itemsInEvent?.length" class="events-popup__section">
                <h4 class="events-popup__section-title">{{ t('component.events.itemsInEvent') }}</h4>
                <div class="events-popup__item-grid">
                  <div
                    v-for="item in selectedEvent.itemsInEvent"
                    :key="item.id"
                    class="events-popup__item-tile"
                  >
                    <img
                      :src="getImageUrl(item.image)"
                      :alt="item.name"
                      class="events-popup__item-tile-img"
                    >
                    <span class="events-popup__item-tile-name">{{ item.name }}</span>
                  </div>
                </div>
              </section>

              <section v-if="selectedEvent.newItems?.length" class="events-popup__section">
                <h4 class="events-popup__section-title">{{ t('component.events.newItems') }}</h4>
                <div class="events-popup__item-grid">
                  <div
                    v-for="item in selectedEvent.newItems"
                    :key="item.id"
                    class="events-popup__item-tile events-popup__item-tile--new"
                  >
                    <img
                      :src="getImageUrl(item.image)"
                      :alt="item.name"
                      class="events-popup__item-tile-img"
                    >
                    <span class="events-popup__item-tile-name">{{ item.name }}</span>
                  </div>
                </div>
              </section>
            </template>
            <template v-else>
              <p class="events-popup__placeholder">{{ t('component.events.selectEvent') }}</p>
            </template>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, inject } from 'vue'
import { getFileImageUrl } from '../../utils/imageResolverRuntime'

const props = defineProps({
  events: {
    type: Array,
    default: () => [],
  },
})

const translator = inject('translator', null)
const t = translator || ((key) => key)

const getImageUrl = (key) => getFileImageUrl(key)

const selectedEvent = ref(null)

const detailBackgroundStyle = computed(() => {
  const evt = selectedEvent.value
  if (!evt?.image) return {}
  const url = getImageUrl(evt.image)
  if (!url) return {}
  return {
    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.7) 100%), url(${url})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }
})

watch(
  () => props.events,
  (list) => {
    const arr = Array.isArray(list) ? list : []
    if (arr.length && (!selectedEvent.value || !arr.find((e) => e.id === selectedEvent.value.id))) {
      selectedEvent.value = arr[0]
    } else if (!arr.length) {
      selectedEvent.value = null
    }
  },
  { immediate: true }
)

defineEmits(['close'])
</script>

<style scoped>
/* Inside game-container: ~90% of canvas (1920×1080), rotates with game */
.events-popup {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
  pointer-events: auto;
}

.events-popup__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
}

.events-popup__panel {
  --evt-bg: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
  --evt-border: 1px solid rgba(255, 255, 255, 0.1);
  --evt-gold: #f6a901;
  --evt-text: #fff;
  --evt-text-dim: rgba(255, 255, 255, 0.75);
  position: relative;
  width: 90%;
  height: 90%;
  max-width: none;
  background: linear-gradient(180deg, rgba(12, 20, 30, 0.98) 0%, rgba(6, 10, 16, 0.98) 100%);
  border: var(--evt-border);
  border-radius: 12px;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.5);
  z-index: 1300;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Nanami', system-ui, sans-serif;
  color: var(--evt-text);
}

.events-popup__close {
  position: absolute;
  right: 12px;
  top: 10px;
  background: transparent;
  border: none;
  color: var(--evt-text);
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  z-index: 2;
}

.events-popup__close:hover {
  color: var(--evt-gold);
}

.events-popup__title {
  margin: 0;
  padding: 16px 40px 12px;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--evt-gold);
  text-align: center;
  border-bottom: var(--evt-border);
  flex-shrink: 0;
}

.events-popup__body {
  flex: 1;
  min-height: 0;
  display: flex;
}

/* Left: event cards list */
.events-popup__list {
  width: 200px;
  min-width: 200px;
  padding: 16px;
  background: var(--evt-bg);
  border-right: var(--evt-border);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.events-popup__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  font-family: inherit;
  color: var(--evt-text);
  background: rgba(255, 255, 255, 0.04);
  border: var(--evt-border);
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, transform 0.15s;
}

.events-popup__card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.events-popup__card--active {
  background: rgba(246, 169, 1, 0.12);
  border-color: var(--evt-gold);
  box-shadow: 0 0 12px rgba(246, 169, 1, 0.2);
}

.events-popup__card-image-wrap {
  width: 64px;
  height: 64px;
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.events-popup__card-image {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
}

.events-popup__card-name {
  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Right: event detail */
.events-popup__detail {
  flex: 1;
  min-width: 0;
  min-height: 0;
  background: var(--evt-bg);
  overflow-y: auto;
}

.events-popup__detail-inner {
  padding: 24px;
  position: relative;
  z-index: 1;
  min-height: 100%;
}

.events-popup__detail--empty .events-popup__detail-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.events-popup__placeholder {
  color: var(--evt-text-dim);
  font-size: 1rem;
  margin: 0;
}

.events-popup__detail-name {
  margin: 0 0 12px;
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--evt-gold);
  border-bottom: var(--evt-border);
  padding-bottom: 8px;
}

.events-popup__detail-desc {
  margin: 0 0 20px;
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--evt-text-dim);
}

.events-popup__section {
  margin-bottom: 20px;
}

.events-popup__section-title {
  margin: 0 0 10px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--evt-text);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.events-popup__bonus-list {
  margin: 0;
  padding-left: 1.2em;
  font-size: 0.9rem;
  color: var(--evt-text-dim);
}

.events-popup__bonus-item {
  margin-bottom: 4px;
}

.events-popup__bonus-label {
  color: var(--evt-text);
  margin-right: 6px;
}

.events-popup__bonus-value {
  color: var(--evt-gold);
  font-weight: 600;
}

.events-popup__item-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 12px;
}

.events-popup__item-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: var(--evt-border);
  border-radius: 6px;
}

.events-popup__item-tile--new {
  border-color: rgba(246, 169, 1, 0.4);
  background: rgba(246, 169, 1, 0.06);
}

.events-popup__item-tile-img {
  width: 48px;
  height: 48px;
  object-fit: contain;
  margin-bottom: 6px;
}

.events-popup__item-tile-name {
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: var(--evt-text);
}
</style>
