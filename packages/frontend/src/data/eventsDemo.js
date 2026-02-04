/**
 * Demo data for active events popup.
 * Each event: name, description, bonus, itemsInEvent, newItems.
 */

export const eventsDemo = [
  {
    id: 'evt-lunar',
    name: 'Lunar Festival',
    description: 'Celebrate the full moon with exclusive rewards. Complete daily tasks to earn Lunar Coins and exchange them for limited gear and cosmetics. The event runs until the end of the month.',
    image: 'bag.box_coin',
    bonus: [
      { label: 'Coin gain', value: '+20%' },
      { label: 'EXP gain', value: '+15%' },
      { label: 'Drop rate', value: '+10%' },
    ],
    itemsInEvent: [
      { id: 'lunar-sword', name: 'Lunar Festival Sword', image: 'bag.sword' },
      { id: 'lunar-helm', name: 'Lunar Crown', image: 'bag.hat' },
      { id: 'lunar-ring', name: 'Moonstone Ring', image: 'bag.ring' },
    ],
    newItems: [
      { id: 'lunar-pet', name: 'Moon Spirit Pet', image: 'bag.other' },
      { id: 'lunar-title', name: 'Title: Moon Walker', image: 'bag.other' },
    ],
  },
  {
    id: 'evt-summer',
    name: 'Summer Arena',
    description: 'Compete in the Summer Arena for exclusive rewards. Climb the ranks to unlock seasonal gear and special vouchers. Top players receive unique titles and rare items.',
    image: 'bag.bonus',
    bonus: [
      { label: 'Power in PvP', value: '+5%' },
      { label: 'Ranking points', value: '+25%' },
    ],
    itemsInEvent: [
      { id: 'summer-blade', name: 'Summer Blade', image: 'bag.sword' },
      { id: 'summer-shield', name: 'Beach Shield', image: 'bag.other' },
    ],
    newItems: [
      { id: 'summer-skin', name: 'Summer Champion Skin', image: 'bag.other' },
    ],
  },
  {
    id: 'evt-dragon',
    name: 'Dragon Hunt',
    description: 'Hunt dragons to collect scales and craft legendary gear. Weekly boss spawns grant bonus loot. Team up for better drop rates.',
    image: 'bag.box_coin',
    bonus: [
      { label: 'Boss damage', value: '+15%' },
      { label: 'Legendary drop', value: '+8%' },
    ],
    itemsInEvent: [
      { id: 'dragon-sword', name: 'Dragon Slayer', image: 'bag.sword' },
      { id: 'dragon-armor', name: 'Dragon Scale Armor', image: 'bag.hat' },
      { id: 'dragon-ring', name: 'Dragon Eye Ring', image: 'bag.ring' },
    ],
    newItems: [
      { id: 'dragon-mount', name: 'Dragon Mount', image: 'bag.other' },
      { id: 'dragon-wing', name: 'Dragon Wing Cape', image: 'bag.other' },
    ],
  },
]
