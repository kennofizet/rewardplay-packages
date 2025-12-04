<template>
  <div 
    :class="['item-box', { 'item-empty': isEmpty }]"
    :style="boxStyle"
    @click="$emit('click')"
  >
    <img v-if="image" :src="image" :alt="alt">
  </div>
</template>

<script setup>
import { computed, inject, unref } from 'vue'

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
  }
})

defineEmits(['click'])

const imagesUrl = inject('imagesUrl', '')

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

const boxStyle = computed(() => {
  return {
    backgroundImage: `url('${getImageUrl('box-item-null.PNG')}')`
  }
})
</script>

<style scoped>
.item-box {
  width: 66px;
  height: 66px;
  margin: 10px;
  background-image: url('/rewardplay-images/box-item-null.PNG');
  background-size: cover;
  display: inline-block;
  text-align: center;
  cursor: pointer;
}

.item-box img {
  width: 70%;
  margin-top: 10px;
}
</style>
