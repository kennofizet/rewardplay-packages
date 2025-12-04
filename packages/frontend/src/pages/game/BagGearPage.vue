<template>
  <div class="bag-content" :style="bagContentStyle">
    <div class="main">
      <div class="table12">
        <div class="col-lg12-7 hero-gear hero-info">
          <div class="left-wp-gear col-lg12-4">
            <div class="box-item-weapon-main">
              <ItemBox 
                v-for="item in mainWeapons" 
                :key="item.key"
                :image="getImageUrl(item.image)"
                :alt="item.name"
              />
            </div>
            <div class="box-item-weapon-sp">
              <ItemBox 
                v-for="item in specialWeapons" 
                :key="item.key"
                :image="getImageUrl(item.image)"
                :alt="item.name"
              />
            </div>
            <div class="box-item-weapon-sp-hit">
              <ItemBox 
                v-for="item in specialItems" 
                :key="item.key"
                :image="getImageUrl(item.image)"
                :alt="item.name"
              />
            </div>
          </div>
          <div class="hero-animation col-lg12-8">
            <div class="col-lg12-12 hero-show">
              <img :src="getImageUrl('hero.png')" alt="Hero">
            </div>
            <div class="cup-item box-item-h-lg float-left">
              <img :src="getImageUrl('cup.png')" alt="Cup">
              <span>buff top 1: 10% coin</span>
            </div>
            <div class="craft-item float-left box-item-smm event">
              <img :src="getImageUrl('event.png')" alt="Event">
            </div>
            <div class="craft-item float-left box-item-smm friend">
              <img :src="getImageUrl('friend.png')" alt="Friend">
            </div>
            <div class="craft-item float-left box-item-smm top">
              <img :src="getImageUrl('top.png')" alt="Top">
            </div>
            <div class="bonus-item box-item-h-lg float-left">
              <img :src="getImageUrl('bonus.png')" alt="Bonus">
              <span>Buff Checkin: <span>{{ bonusCheckin }}%</span></span>
            </div>
          </div>
        </div>
        <div class="col-lg12-5 right-wp-gear">
          <div class="col-lg12-9 right-wp-gear-list right-wp-gear-package-data right-wp-gear-package-data-all show">
            <ItemBox 
              v-for="(item, index) in bagItems" 
              :key="index"
              :image="item.image ? getImageUrl(item.image) : null"
              :is-empty="!item.image"
              @click="handleItemClick(item)"
            />
          </div>
          <div class="col-lg12-3 menu-item-bag-data">
            <div class="menu-package-right menu-item-bag item" @click="filterBag('all')">
              <img :src="getImageUrl('bag.png')" alt="All">
            </div>
            <div class="menu-package-right menu-item-bag item" @click="filterBag('sword')">
              <img :src="getImageUrl('sword-df.png')" alt="Sword">
            </div>
            <div class="menu-package-right menu-item-bag item" @click="filterBag('orther')">
              <img :src="getImageUrl('bracelet-df.png')" alt="Other">
            </div>
            <div class="menu-package-right menu-item-bag item" @click="filterBag('shop')">
              <img :src="getImageUrl('shop.png')" alt="Shop">
            </div>
          </div>
          <div class="col-lg12-12 coin-and-orther">
            <div class="number">
              <img :src="getImageUrl('coin.png')" alt="Coin">
              <span>{{ coinAmount }}</span>
            </div>
            <div class="number">
              <img :src="getImageUrl('box-coin.png')" alt="Box Coin">
              <span>{{ boxCoinAmount }}</span>
            </div>
            <div class="number">
              <img :src="getImageUrl('ruby.png')" alt="Ruby">
              <span>{{ rubyAmount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, computed, unref } from 'vue'
import ItemBox from '../../components/game/ItemBox.vue'

const imagesUrl = inject('imagesUrl', '')

// Fake data for game items
const bonusCheckin = ref(10)
const coinAmount = ref(125000)
const boxCoinAmount = ref(50)
const rubyAmount = ref(999)

const mainWeapons = ref([
  { key: 'main-weapon-1', name: 'Sword', image: 'sword-df.png' },
  { key: 'main-weapon-2', name: 'Sword', image: 'sword-df.png' },
  { key: 'main-weapon-3', name: 'Hat', image: 'hat-df.png' },
  { key: 'main-weapon-4', name: 'Shirt', image: 'shirt-df.png' },
  { key: 'main-weapon-5', name: 'Trouser', image: 'trouser-df.png' },
  { key: 'main-weapon-6', name: 'Shoe', image: 'shoe-df.png' }
])

const specialWeapons = ref([
  { key: 'special-weapon-1', name: 'Necklace', image: 'necklace-df.png' },
  { key: 'special-weapon-2', name: 'Bracelet', image: 'bracelet-df.png' },
  { key: 'special-weapon-3', name: 'Ring', image: 'ring-df.png' },
  { key: 'special-weapon-4', name: 'Ring', image: 'ring-df.png' }
])

const specialItems = ref([
  { key: 'special-item-1', name: 'Clothes', image: 'clothes-df.png' },
  { key: 'special-item-2', name: 'Wing', image: 'wing-df.png' }
])

// Create 55 empty bag items (null/empty objects)
const bagItems = ref(
  Array.from({ length: 55 }, () => ({}))
)

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

// Set background image dynamically
const bagContentStyle = computed(() => {
  return {
    backgroundImage: `url('${getImageUrl('background-bag.PNG')}')`
  }
})

const handleItemClick = (item) => {
  // Handle item click
  console.log('Item clicked:', item)
}

const filterBag = (type) => {
  // Filter bag items by type
  console.log('Filter bag:', type)
}
</script>

<style scoped>
/* Grid System */
.table12 {
  width: 100%;
  display: block;
}

.table12 .col-lg12-12 {
  display: block;
  float: left;
  width: 100%;
}

.table12 .col-lg12-11 {
  display: block;
  float: left;
  width: 91.66666667%;
}

.table12 .col-lg12-10 {
  display: block;
  float: left;
  width: 83.33333333%;
}

.table12 .col-lg12-9 {
  display: block;
  float: left;
  width: 75%;
}

.table12 .col-lg12-8 {
  display: block;
  float: left;
  width: 66.66666667%;
}

.table12 .col-lg12-7 {
  display: block;
  float: left;
  width: 58.33333333%;
}

.table12 .col-lg12-6 {
  display: block;
  float: left;
  width: 50%;
}

.table12 .col-lg12-5 {
  display: block;
  float: left;
  width: 41.66666667%;
}

.table12 .col-lg12-4 {
  display: block;
  float: left;
  width: 33.33333333%;
}

.table12 .col-lg12-3 {
  display: block;
  float: left;
  width: 25%;
}

.table12 .col-lg12-2 {
  display: block;
  float: left;
  width: 16.66666667%;
}

.table12 .col-lg12-1 {
  display: block;
  float: left;
  width: 8.33333333%;
}

.float-left {
  display: block;
  float: left;
}

/* Bag Content */
.bag-content {
  width: 100%;
  margin: 20px;
  height: calc(100% - 77px);
  display: inline-block;
  margin-top: 40px;
  background-size: cover;
}

.bag-content::-webkit-scrollbar {
  width: 0;
  background: transparent;
}

.bag-content .main {
  height: 95%;
  margin: 24px;
}

/* Item Box */
.item-box {
  width: 111px;
  height: 111px;
  margin: 10px;
  background-size: cover;
}

.box-item-weapon-main {
  display: inline-block;
  margin-top: 30px;
  margin-bottom: 30px;
  text-align: center;
}

.box-item-weapon-main .item-box img {
  width: 70%;
  margin-top: 10px;
}

.box-item-weapon-sp {
  display: inline-block;
  margin-bottom: 20px;
  text-align: center;
}

.box-item-weapon-sp .item-box img {
  width: 70%;
  margin-top: 10px;
}

.box-item-weapon-sp-hit {
  text-align: center;
}

.box-item-weapon-sp-hit .item-box img {
  width: 70%;
  margin-top: 10px;
}

/* Right Weapon Gear */
.right-wp-gear {
  margin-top: 10px;
}

.box-item-h-lg {
  width: 100px;
  height: 140px;
  margin: 10px;
  background-size: cover;
  margin-top: -17% !important;
}

.box-item-smm {
  width: 50px;
  height: 50px;
  margin: 10px 45px;
  background-size: cover;
}

/* Hero Animation */
.hero-show img {
  width: 80%;
  margin-left: 83px;
}

.hero-animation .bonus-item {
  display: inline-block;
  margin-top: 5px;
  text-align: center;
}

.hero-animation .bonus-item img {
  width: 70%;
  margin-top: 10px;
}

.hero-animation .bonus-item span {
  margin-top: 2px;
  display: block;
}

.hero-animation .cup-item {
  display: inline-block;
  margin-top: 5px;
  text-align: center;
}

.hero-animation .cup-item img {
  width: 70%;
  margin-top: 10px;
}

.hero-animation .cup-item span {
  margin-top: 2px;
  display: block;
}

.hero-animation .craft-item {
  display: inline-block;
  margin-top: 5px;
  text-align: center;
}

.hero-animation .craft-item img {
  width: 70%;
  margin-top: 8px;
}

.cup-item, .bonus-item {
  display: inline-block;
  margin-top: 5px;
  text-align: center;
}

.cup-item span, .bonus-item span {
  margin-top: 2px;
  display: block;
}

.craft-item {
  display: inline-block;
  margin-top: 5px;
  text-align: center;
}

/* Coin and Other */
.coin-and-orther .number {
  margin: 1px 38px;
  display: inline-block;
  text-align: center;
  float: left;
}

.coin-and-orther .number img {
  width: 21px;
  display: block;
  float: left;
  margin-top: 9px;
}

.coin-and-orther .number span {
  display: block;
  float: left;
  margin-top: 10px;
  margin-left: 4px;
  color: dimgray;
  font-family: Nanami, sans-serif;
}

/* Right Weapon Gear List */
.right-wp-gear-list {
  height: 823px;
  overflow: auto;
}

.right-wp-gear-list::-webkit-scrollbar {
  width: 0;
  background: transparent;
}

.right-wp-gear-list .item-box {
  display: inline-block;
  text-align: center;
}

.right-wp-gear-list .item-box img {
  width: 70%;
  margin-top: 10px;
}

/* Menu Item Bag */
.menu-item-bag-data {
  margin-top: 20px;
  height: 823px;
}

.menu-item-bag-data .menu-item-bag {
  display: block;
  text-align: center;
  width: 110px;
  height: 110px;
  margin: 18px 16px;
  background-size: cover;
  cursor: pointer;
  border: solid dimgray;
}

.menu-item-bag-data .menu-item-bag img {
  width: 70%;
  margin-top: 14px;
}

.show {
  display: block !important;
}

.hidden {
  display: none;
}
</style>
