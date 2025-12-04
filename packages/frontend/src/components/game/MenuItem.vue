<template>
  <div 
    :class="[
      'menu-item-component',
      { 'menu-item-component-1st': isFirst },
      { 'menu-item-icon': isIcon },
      { 'menu-item-light': isLight },
      { 'menu-item-dark': isDark }
    ]"
    @click="$emit('click')"
  >
    <div v-if="isFirst" class="menu-item-cover-1st">
      <span class="menu-item-text-1st">
        <slot></slot>
      </span>
    </div>
    <div v-else class="menu-item-border">
      <div class="menu-item-cover">
        <span 
          class="menu-item-text"
          :class="iconClass"
          :style="iconStyle"
        >
          <slot></slot>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, toValue } from 'vue'

const props = defineProps({
  isFirst: {
    type: Boolean,
    default: false
  },
  isIcon: {
    type: Boolean,
    default: false
  },
  isLight: {
    type: Boolean,
    default: false
  },
  isDark: {
    type: Boolean,
    default: false
  },
  iconImage: {
    type: String,
    default: null
  }
})

defineEmits(['click'])

const imagesUrl = inject('imagesUrl', '')

const iconClass = computed(() => {
  if (props.iconImage) {
    return 'ico-custom'
  }
  return null
})

const iconStyle = computed(() => {
  if (props.iconImage && imagesUrl) {
    const url = toValue(imagesUrl)
    const imageUrl = url.endsWith('/') 
      ? `${url}${props.iconImage}` 
      : `${url}/${props.iconImage}`
    return {
      '-webkit-mask': `url('${imageUrl}') no-repeat 50% 50%`,
      '-webkit-mask-size': '25px'
    }
  }
  return {}
})
</script>

<style scoped>
.menu-item-component {
  border-bottom: 0px solid transparent;
  width: 200px;
  display: inline-block;
  white-space: nowrap;
  margin-right: 5px;
  margin-bottom: 7px;
  transition: .25s;
}

.menu-item-component-1st {
  width: 300px;
}

.menu-item-component:hover {
  padding-bottom: 3px;
  margin-bottom: 0;
  border-bottom: 4px solid #f6f6f8;
}

.menu-item-border {
  background: #253344;
  transform-origin: 100% 100%;
  transform: skewX(-10deg);
  padding: 0.5px;
  cursor: pointer;
  transition: .25s;
}

.menu-item-component:hover .menu-item-border {
  background: #c6ccd4;
}

.menu-item-cover-1st {
  position: relative;
  color: #423714;
  z-index: 1;
  cursor: pointer;
  border: 0.5px solid #f6a901;
  background: #f6a901;
  transition: .25s;
}

.menu-item-cover-1st:before {
  content: '';
  position: absolute;
  z-index: -1;
  top: 0; right: 0;
  width: 100%; height: 100%;
  transform-origin: 100% 100%;
  transform: skewX(-10deg);
  border: 0.5px solid #f6a901;
  background: #f6a901;
  transition: .25s;
}

.menu-item-cover {
  background: #2d3a4b;
  margin: 0.5px;
  transition: .25s;
}

.menu-item-component:hover .menu-item-cover {
  background: #f6f6f8;
}

.menu-item-text-1st, .menu-item-text {
  padding: 7px 0;
  display: block;
  text-align: center;
  transform: skewX(10deg);
  color: #d0d4d6;
  font-size: 20px;
  font-family: Nanami, sans-serif;
  font-weight: 400;
  letter-spacing: 2px;
  text-transform: uppercase;
  transition: .25s;
}

.menu-item-text-1st {
  color: #423714; 
  transform: skewX(0deg);
}

.menu-item-component:hover .menu-item-text {
  color: #4f4f51;
}

.menu-item-component-1st:hover .menu-item-cover-1st {
  border: 0.5px solid #f6f6f8;
  background: #f6f6f8;
}

.menu-item-component-1st:hover .menu-item-cover-1st:before {
  border: 0.5px solid #f6f6f8;
  background: #f6f6f8;
}

.menu-item-icon {
  width: 45px;
}

.menu-item-light > .menu-item-border {
  background: #f6a901;
}

.menu-item-light > .menu-item-border > .menu-item-cover {
  background: #f6a901;
}

.menu-item-light:hover > .menu-item-border > .menu-item-cover {
  background: #f6f6f8;
}

.ico-custom {
  background-color: #000;
}
</style>
