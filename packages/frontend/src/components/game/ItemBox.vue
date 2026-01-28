<template>
  <div 
    :class="['item-box', { 'item-empty': isEmpty }]"
    :style="boxStyle"
    :draggable="draggable"
    @click="$emit('click')"
    @dblclick="$emit('dblclick')"
    @dragstart="$emit('dragstart', $event)"
  >
    <img v-if="image" :src="image" :alt="alt">
    <div v-if="quantity && quantity > 1" class="item-quantity">
      {{ quantity }}
    </div>
  </div>
</template>

<script setup>
import { computed, inject, unref } from 'vue'
import { getFileImageUrl } from '../../utils/imageResolverRuntime'

const props = defineProps({
  image: {
    type: String,
    default: null
  },
  alt: {
    type: String,
    default: ''
  },
  isEmpty: {
    type: Boolean,
    default: false
  },
  quantity: {
    type: Number,
    default: null
  },
  draggable: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click', 'dblclick', 'dragstart'])

const getImageUrl = (key) => getFileImageUrl(key)

const boxStyle = computed(() => {
  return {
    backgroundImage: `url('${getImageUrl('bag.box_item_null')}')`
  }
})
</script>

<style scoped>
.item-box {
  position: relative;
  width: 109px;
  height: 109px;
  margin: 10px;
  background-size: cover;
  display: inline-block;
  text-align: center;
  cursor: pointer;
}

.item-box img {
  width: 100%;
  padding: 18px;
  display: flex;
}

.item-quantity {
  position: absolute;
  bottom: 2px;
  right: 2px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  font-size: 11px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 8px;
  min-width: 18px;
  text-align: center;
  font-family: Nanami, sans-serif;
  border: 1px solid rgba(255, 255, 255, 0.3);
  z-index: 10;
}
</style>
