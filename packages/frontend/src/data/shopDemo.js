/**
 * Demo shop data for RPG-style shop page.
 * Types and price types use RewardPlay constants (utils/constants).
 */
import { getShopConstants, getItemConstants, SHOP_CATEGORY_ALL } from '../utils/constants'

const shopC = getShopConstants()
const itemC = getItemConstants()

export const SHOP_ITEM_TYPES = {
  GEAR: shopC.CATEGORY_GEAR,
  TICKET: itemC.ITEM_TYPE_TICKET,
  BOX_RANDOM: itemC.ITEM_TYPE_BOX_RANDOM,
}

/** Price types for labels/icons (voucher is frontend-only) */
export const PRICE_TYPE_COIN = shopC.PRICE_TYPE_COIN
export const PRICE_TYPE_RUBY = shopC.PRICE_TYPE_RUBY
export const PRICE_TYPE_VOUCHER = 'voucher'

/** Add actions to a price row so UI can use p.actions?.is_coin etc. (no string checks). */
function addPriceActions(p) {
  const t = p?.type ?? PRICE_TYPE_COIN
  return {
    ...p,
    actions: {
      is_coin: t === PRICE_TYPE_COIN,
      is_ruby: t === PRICE_TYPE_RUBY || t === shopC.PRICE_TYPE_GEM,
      is_item: t === shopC.PRICE_TYPE_ITEM,
      is_voucher: t === PRICE_TYPE_VOUCHER,
    },
  }
}

/**
 * Normalize item to always have prices array (from item.prices or legacy price_coin/price_ruby).
 * Ensures each price has actions so UI uses p.actions?.is_coin etc.
 */
export function getItemPrices(item) {
  if (!item) return []
  if (Array.isArray(item.prices) && item.prices.length > 0) {
    return item.prices
      .filter((p) => p && (p.value > 0 || p.actions?.is_voucher))
      .map((p) => (p.actions ? p : addPriceActions(p)))
  }
  const list = []
  if (item.price_coin > 0) list.push(addPriceActions({ type: PRICE_TYPE_COIN, value: item.price_coin }))
  if (item.price_ruby > 0) list.push(addPriceActions({ type: PRICE_TYPE_RUBY, value: item.price_ruby }))
  return list
}

/**
 * Demo user balance (coin, ruby, vouchers). Replace with real user data later.
 */
export const userBalanceDemo = {
  coin: 5000,
  ruby: 50,
  voucher_spin: 2,
  voucher_vip: 0,
}

export const shopDemoItems = [
  // Gear (wear)
  {
    id: 'gear-1',
    name: 'Iron Longsword',
    type: SHOP_ITEM_TYPES.GEAR,
    description: 'A reliable iron longsword. Good balance of attack and durability.',
    image: 'bag.sword',
    prices: [addPriceActions({ type: PRICE_TYPE_COIN, value: 800 })],
    options: { stats: { attack: 28, speed: -2 } },
    isEvent: false,
  },
  {
    id: 'gear-2',
    name: 'Knight Helmet',
    type: SHOP_ITEM_TYPES.GEAR,
    description: 'Heavy helmet worn by castle knights. High defense, low mobility.',
    image: 'bag.hat',
    prices: [addPriceActions({ type: PRICE_TYPE_COIN, value: 1200 })],
    options: { stats: { defense: 35, speed: -5 } },
    isEvent: false,
  },
  {
    id: 'gear-3',
    name: 'Shadow Dagger',
    type: SHOP_ITEM_TYPES.GEAR,
    description: 'Quick and silent. Favored by assassins.',
    image: 'bag.sword',
    prices: [addPriceActions({ type: PRICE_TYPE_COIN, value: 1500 }), addPriceActions({ type: PRICE_TYPE_RUBY, value: 15 })],
    options: { stats: { attack: 22, crit: 18, speed: 8 } },
    isEvent: false,
  },
  {
    id: 'gear-4',
    name: 'Dragon Scale Ring',
    type: SHOP_ITEM_TYPES.GEAR,
    description: 'Ring forged from dragon scales. Boosts fire resistance.',
    image: 'bag.ring',
    prices: [addPriceActions({ type: PRICE_TYPE_RUBY, value: 80 })],
    options: { stats: { defense: 10, resistance: 25 } },
    isEvent: false,
  },
  // Ticket
  {
    id: 'ticket-1',
    name: 'Lucky Wheel Ticket',
    type: SHOP_ITEM_TYPES.TICKET,
    description: 'One spin on the Lucky Wheel. Chance for rare rewards.',
    image: 'bag.bonus',
    prices: [addPriceActions({ type: PRICE_TYPE_COIN, value: 300 })],
    options: { use: 'Lucky Wheel spin' },
    isEvent: false,
  },
  {
    id: 'ticket-2',
    name: 'VIP Daily Ticket',
    type: SHOP_ITEM_TYPES.TICKET,
    description: 'Unlock VIP daily rewards for one day.',
    image: 'bag.bonus',
    prices: [addPriceActions({ type: PRICE_TYPE_COIN, value: 1000 }), addPriceActions({ type: PRICE_TYPE_RUBY, value: 20 })],
    options: { use: 'VIP daily chest' },
    isEvent: false,
  },
  // Box random - one item with 3+ currencies for "+more" demo
  {
    id: 'box-1',
    name: 'Mystery Gear Box',
    type: SHOP_ITEM_TYPES.BOX_RANDOM,
    description: 'Contains one random gear item. Quality varies.',
    image: 'bag.box_coin',
    prices: [
      addPriceActions({ type: PRICE_TYPE_COIN, value: 500 }),
      addPriceActions({ type: PRICE_TYPE_RUBY, value: 5 }),
      addPriceActions({ type: PRICE_TYPE_VOUCHER, key: 'voucher_spin', value: 1 }),
    ],
    options: { reward_pool: 'random_gear', min_rarity: 'common' },
    isEvent: false,
  },
  {
    id: 'box-2',
    name: 'Epic Chest',
    type: SHOP_ITEM_TYPES.BOX_RANDOM,
    description: 'Guaranteed epic or better. May contain gear items.',
    image: 'bag.box_coin',
    prices: [addPriceActions({ type: PRICE_TYPE_COIN, value: 3000 }), addPriceActions({ type: PRICE_TYPE_RUBY, value: 50 })],
    options: { reward_pool: 'epic_plus', min_rarity: 'epic' },
    isEvent: false,
  }
]

export { SHOP_CATEGORY_ALL }

/** Ordered category keys for menu (all first, then gear, ticket, box_random). */
export const shopCategoryKeys = [
  SHOP_CATEGORY_ALL,
  SHOP_ITEM_TYPES.GEAR,
  SHOP_ITEM_TYPES.TICKET,
  SHOP_ITEM_TYPES.BOX_RANDOM,
]
