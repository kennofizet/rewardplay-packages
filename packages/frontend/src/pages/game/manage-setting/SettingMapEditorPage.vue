<template>
  <div class="map-editor-page">
    <!-- Top Bar -->
    <div class="editor-topbar">
      <div class="topbar-left">
        <h2 class="editor-title">🗺️ Map Editor</h2>
        <select v-model="currentMapId" class="map-select" @change="switchMap">
          <option v-for="m in mapList" :key="m.id" :value="m.id">{{ m.name }} ({{ m.width }}×{{ m.height }})</option>
        </select>
        <button class="btn-topbar btn-new" @click="showNewMapModal = true">＋ New Map</button>
        <button class="btn-topbar btn-generate" @click="showGenerateModal = true">⚡ Generate 1 map</button>
        <button class="btn-topbar btn-rename" @click="startRename">Rename</button>
        <button class="btn-topbar btn-delete" @click="deleteCurrentMap">🗑 Delete</button>
      </div>
      <div class="topbar-right">
        <label class="topbar-label">Zoom</label>
        <input type="range" min="1" max="4" step="0.5" v-model.number="zoom" class="zoom-slider" />
        <span class="zoom-val">{{ zoom }}×</span>
        <button class="btn-topbar btn-save" @click="applyToGame">🎮 Apply to Game</button>
        <button class="btn-topbar btn-export" @click="exportJSON">📤 Export JSON</button>
        <button class="btn-topbar btn-import" @click="triggerImport">📥 Import</button>
        <input ref="importInput" type="file" accept=".json" style="display:none" @change="importJSON" />
      </div>
    </div>

    <div class="editor-body">
      <!-- Left Sidebar: Tools & Tiles -->
      <div class="editor-sidebar">
        <!-- Draw Tools -->
        <div class="sidebar-section">
          <div class="sidebar-title">Tool</div>
          <div class="tool-row">
            <div
              v-for="tool in tools"
              :key="tool.id"
              :class="['tool-btn', { active: currentTool === tool.id }]"
              :title="tool.label"
              @click="currentTool = tool.id"
            >{{ tool.icon }}</div>
          </div>
        </div>

        <!-- Map Settings (size, game id, start - all in one place) -->
        <div class="sidebar-section">
          <div class="sidebar-title">Map Settings</div>
          <div v-if="currentMap" class="map-settings">
            <div class="ms-row">
              <label>Name</label>
              <input type="text" v-model="currentMap.name" class="ms-input" placeholder="Map name" />
            </div>
            <div class="ms-row">
              <label>Width (tiles)</label>
              <input type="number" v-model.number="currentMap.width" min="10" max="500" class="ms-input" @change="resizeMapIfNeeded" />
            </div>
            <div class="ms-row">
              <label>Height (tiles)</label>
              <input type="number" v-model.number="currentMap.height" min="10" max="500" class="ms-input" @change="resizeMapIfNeeded" />
            </div>
            <div class="ms-row">
              <label>Game ID</label>
              <input type="number" v-model.number="currentMap.gameId" min="10" max="99" class="ms-input" />
            </div>
            <div class="ms-row">
              <label>Start X</label>
              <input type="number" v-model.number="currentMap.startX" min="0" :max="currentMap.width" class="ms-input" />
            </div>
            <div class="ms-row">
              <label>Start Y</label>
              <input type="number" v-model.number="currentMap.startY" min="0" :max="currentMap.height" class="ms-input" />
            </div>
            <div class="ms-row">
              <label>Base ground (for new cells)</label>
              <select v-model.number="currentMap.baseTile" class="ms-input">
                <option v-for="tid in groundOnlyTileIds" :key="tid" :value="tid">{{ TILE_NAMES[tid] || tid }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="sidebar-section">
          <div class="sidebar-title">Layer</div>
          <div class="layer-row">
            <div
              :class="['layer-btn', { active: activeLayer === 'ground' }]"
              @click="activeLayer = 'ground'; selectedTile = TILES.GRASS"
            >Ground</div>
            <div
              :class="['layer-btn', { active: activeLayer === 'objects' }]"
              @click="activeLayer = 'objects'; selectedTile = TILES.EMPTY"
            >Objects</div>
          </div>
          <label class="show-names-row">
            <input type="checkbox" v-model="showTileNames" />
            <span>Show tile names</span>
          </label>
        </div>

        <!-- Tile list: Ground zone (only when Ground layer selected) -->
        <div class="sidebar-section tile-section" v-if="activeLayer === 'ground'">
          <div class="sidebar-title">Ground tiles</div>
          <div v-for="cat in groundCategories" :key="cat.label" class="tile-category">
            <div class="tile-cat-label">{{ cat.label }}</div>
            <div class="tile-grid">
              <div
                v-for="tileId in cat.tiles"
                :key="tileId"
                :class="['tile-swatch', { active: selectedTile === tileId }]"
                :title="TILE_NAMES[tileId] || tileId"
                :style="{ backgroundColor: TILE_COLORS[tileId] || '#333' }"
                @click="selectedTile = tileId; currentTool = 'draw'"
              >
                <span v-if="showTileNames" class="tile-label">{{ shortName(TILE_NAMES[tileId]) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tile list: Object zone (only when Objects layer selected) -->
        <div class="sidebar-section tile-section" v-if="activeLayer === 'objects'">
          <div class="sidebar-title">Object tiles</div>
          <div v-for="cat in objectCategories" :key="cat.label" class="tile-category">
            <div class="tile-cat-label">{{ cat.label }}</div>
            <div class="tile-grid">
              <div
                v-for="tileId in cat.tiles"
                :key="tileId"
                :class="['tile-swatch', { active: selectedTile === tileId }]"
                :title="TILE_NAMES[tileId] || tileId"
                :style="{ backgroundColor: TILE_COLORS[tileId] || '#333' }"
                @click="selectedTile = tileId; currentTool = 'draw'"
              >
                <span v-if="showTileNames" class="tile-label">{{ shortName(TILE_NAMES[tileId]) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Info -->
        <div class="sidebar-section cursor-info">
          <div v-if="hoverTile">Tile: ({{ hoverTile.x }}, {{ hoverTile.y }})</div>
          <div v-if="hoverTile">{{ TILE_NAMES[Number(currentLayerData[hoverTile.y * currentMap.width + hoverTile.x])] || 'Empty' }}</div>
          <div>Map: {{ currentMap?.width }}×{{ currentMap?.height }}</div>
        </div>
      </div>

      <!-- Canvas Area -->
      <div class="canvas-wrap" ref="canvasWrap" @contextmenu.prevent>
        <canvas
          ref="canvas"
          :style="{ cursor: canvasCursor }"
          @mousedown="onMouseDown"
          @mousemove="onMouseMove"
          @mouseup="onMouseUp"
          @mouseleave="onMouseLeave"
          @wheel.prevent="onWheel"
        ></canvas>
      </div>
    </div>

    <!-- New Map Modal -->
    <div v-if="showNewMapModal" class="modal-overlay" @click.self="showNewMapModal = false">
      <div class="modal-box">
        <h3>Create New Map</h3>
        <div class="form-row">
          <label>Name</label>
          <input v-model="newMapForm.name" class="modal-input" placeholder="Map name" />
        </div>
        <div class="form-row">
          <label>Width (tiles)</label>
          <input v-model.number="newMapForm.width" type="number" min="10" max="500" class="modal-input" />
        </div>
        <div class="form-row">
          <label>Height (tiles)</label>
          <input v-model.number="newMapForm.height" type="number" min="10" max="500" class="modal-input" />
        </div>
        <div class="form-row">
          <label>Base Ground Tile</label>
          <select v-model.number="newMapForm.baseTile" class="modal-input">
            <option v-for="(name, id) in TILE_NAMES" :key="id" :value="parseInt(id)">{{ name }}</option>
          </select>
        </div>
        <div class="modal-actions">
          <button class="btn-topbar btn-save" @click="createNewMap">Create</button>
          <button class="btn-topbar" @click="showNewMapModal = false">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Generate 1 map modal -->
    <div v-if="showGenerateModal" class="modal-overlay" @click.self="showGenerateModal = false">
      <div class="modal-box modal-box-wide">
        <h3>Generate 1 map (large + many enemies)</h3>
        <div class="form-row">
          <label>Map name (optional; auto: {{ nextGeneratedMapName }})</label>
          <input v-model="generateForm.name" class="modal-input" :placeholder="nextGeneratedMapName" />
        </div>
        <div class="form-row">
          <label>Map size</label>
          <select v-model.number="generateForm.size" class="modal-input">
            <option :value="100">100 × 100</option>
            <option :value="200">200 × 200</option>
            <option :value="300">300 × 300</option>
            <option :value="500">500 × 500 (max)</option>
          </select>
        </div>
        <div class="form-row">
          <label>Enemies on map (max 500)</label>
          <input v-model.number="generateForm.enemiesPerMap" type="number" min="1" max="500" class="modal-input" placeholder="e.g. 200" />
        </div>
        <p class="generate-hint">One map: grass ground + this many random enemy spawns. If save fails, use a smaller size or Export to file.</p>
        <div class="modal-actions">
          <button class="btn-topbar btn-save" :disabled="generateInProgress" @click="runGenerateOneMap">{{ generateInProgress ? 'Generating…' : 'Generate' }}</button>
          <button class="btn-topbar" @click="showGenerateModal = false">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Rename Modal -->
    <div v-if="showRenameModal" class="modal-overlay" @click.self="showRenameModal = false">
      <div class="modal-box">
        <h3>Rename Map</h3>
        <input v-model="renameValue" class="modal-input" @keyup.enter="confirmRename" />
        <div class="modal-actions">
          <button class="btn-topbar btn-save" @click="confirmRename">Save</button>
          <button class="btn-topbar" @click="showRenameModal = false">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { TILES, TILE_COLORS, TILE_NAMES } from '../../../components/game/rpg/tiles'

const SAVE_KEY = 'rpg_map_editor_maps'
const TSIZE = 32 // base tile draw size

// ─── Tools ───────────────────────────────────────────────────────────────────
const tools = [
  { id: 'draw',   icon: '✏️',  label: 'Draw' },
  { id: 'erase',  icon: '🧹',  label: 'Erase' },
  { id: 'fill',   icon: '🪣',  label: 'Fill' },
  { id: 'pan',    icon: '✋',  label: 'Pan' },
  { id: 'pick',   icon: '💉',  label: 'Pick Tile' },
]
const currentTool = ref('draw')
const canvasCursor = computed(() => ({
  draw: 'crosshair',
  erase: 'cell',
  fill: 'crosshair',
  pan: isPanning.value ? 'grabbing' : 'grab',
  pick: 'copy',
}[currentTool.value] || 'default'))

// ─── Tile categories: Ground zone (layer = ground only) ─────────────────────────
const groundCategories = [
  { label: 'Ground', tiles: [TILES.GRASS, TILES.GRASS_VARIANT, TILES.PATH, TILES.WATER, TILES.MOUNTAIN, TILES.WATER_LILY, TILES.FLOWER] },
  { label: 'Farm ground', tiles: [TILES.FARM_SOIL] },
]
const groundOnlyTileIds = [TILES.GRASS, TILES.GRASS_VARIANT, TILES.PATH, TILES.WATER, TILES.MOUNTAIN, TILES.FARM_SOIL]

// ─── Tile categories: Object zone (layer = objects only) ───────────────────────
const objectCategories = [
  { label: 'Empty', tiles: [TILES.EMPTY] },
  { label: 'Structures', tiles: [TILES.HOUSE, TILES.SHOP, TILES.STORAGE, TILES.ANVIL, TILES.SUMMON_TREE, TILES.SIGN, TILES.FENCE, TILES.CRYSTAL, TILES.MUSHROOM] },
  { label: 'NPCs / Special', tiles: [TILES.NPC, TILES.BOT, TILES.TELEPORT, TILES.TREE, TILES.BUSH] },
  { label: 'Enemies', tiles: [TILES.CREEP, TILES.BOSS, TILES.SPIDER, TILES.GOBLIN, TILES.SKELETON, TILES.DARK_WIZARD, TILES.ELF, TILES.GOLEM, TILES.DRAGON, TILES.DEMON, TILES.ORC, TILES.WOLF, TILES.BAT, TILES.SERPENT, TILES.UNDEAD_KNIGHT, TILES.SHADOW, TILES.ELEMENTAL] },
  { label: 'Farm / Defense', tiles: [TILES.DEFENSE_SLOT, TILES.DEFENSE_PLANT] },
]

const shortName = (name) => name ? name.substring(0, 6) : '?'
const showTileNames = ref(true)

// ─── Map State ────────────────────────────────────────────────────────────────
const mapList = ref([])
const currentMapId = ref(null)

const USED_GAME_IDS_KEY = 'rpg_map_editor_maps'
const nextGameId = (existingMaps) => {
  const usedIds = existingMaps.map(m => m.gameId || 0)
  let id = 10
  while (usedIds.includes(id)) id++
  return id
}

const createBlankMap = (id, name, width, height, baseTile = TILES.GRASS, gameId) => ({
  id,
  name,
  gameId: gameId || 10,
  startX: Math.floor(width / 2),
  startY: Math.floor(height / 2),
  width,
  height,
  baseTile: baseTile ?? TILES.GRASS,
  layers: {
    ground: new Array(width * height).fill(baseTile),
    objects: new Array(width * height).fill(TILES.EMPTY),
  }
})

// Ground tile IDs for ground layer (randomly placed like enemies)
const GROUND_TILE_IDS = [TILES.GRASS, TILES.GRASS_VARIANT, TILES.PATH, TILES.WATER, TILES.MOUNTAIN, TILES.WATER_LILY, TILES.FLOWER, TILES.FARM_SOIL]
// Enemy tile IDs for object layer (game will spawn these as live entities)
const ENEMY_TILE_IDS = [TILES.CREEP, TILES.BOSS, TILES.SPIDER, TILES.GOBLIN, TILES.SKELETON, TILES.DARK_WIZARD, TILES.ELF, TILES.GOLEM, TILES.DRAGON, TILES.DEMON, TILES.ORC, TILES.WOLF, TILES.BAT, TILES.SERPENT, TILES.UNDEAD_KNIGHT, TILES.SHADOW, TILES.ELEMENTAL]

const showGenerateModal = ref(false)
const generateInProgress = ref(false)
const generateForm = ref({ name: '', size: 500, enemiesPerMap: 300 })

const nextGeneratedMapName = computed(() => {
  const nums = mapList.value.map(m => parseInt((m.name || '').match(/^Arena\s+(\d+)$/i)?.[1] || '0', 10))
  const next = Math.max(0, ...nums) + 1
  return `Arena ${next}`
})

const runGenerateOneMap = () => {
  const size = Math.max(10, Math.min(500, generateForm.value.size || 500))
  const wantEnemies = Math.max(1, Math.min(500, generateForm.value.enemiesPerMap ?? 300))
  const name = (generateForm.value.name || nextGeneratedMapName.value).trim() || nextGeneratedMapName.value
  generateInProgress.value = true
  const gid = nextGameId(mapList.value)
  const id = Date.now()
  const map = createBlankMap(id, name, size, size, TILES.GRASS, gid)
  const total = size * size
  // Generate ground: each cell gets a random ground tile (same idea as enemies)
  for (let i = 0; i < total; i++) {
    map.layers.ground[i] = GROUND_TILE_IDS[Math.floor(Math.random() * GROUND_TILE_IDS.length)]
  }
  // Generate enemies: random positions, random enemy type
  const placed = new Set()
  let added = 0
  while (added < wantEnemies) {
    const idx = Math.floor(Math.random() * total)
    if (placed.has(idx)) continue
    placed.add(idx)
    map.layers.objects[idx] = ENEMY_TILE_IDS[Math.floor(Math.random() * ENEMY_TILE_IDS.length)]
    added++
  }
  mapList.value = [...mapList.value, map]
  currentMapId.value = id
  prevMapSize.value = { w: size, h: size }
  showGenerateModal.value = false
  generateInProgress.value = false
  nextTick(drawCanvas)
  const saveOk = saveToStorage()
  if (saveOk) {
    alert(`Created 1 map: "${name}" ${size}×${size} with ${wantEnemies} enemies (Game ID ${gid}). Click "Apply to Game" to use it.`)
  } else {
    alert(`Map created but could not save to localStorage (quota exceeded). Use smaller size (e.g. 300×300) or Export to JSON file, then clear some maps and try again.`)
  }
}

const currentMap = computed(() => mapList.value.find(m => m.id === currentMapId.value) || null)
const activeLayer = ref('ground')

const prevMapSize = ref({ w: 0, h: 0 })
watch(currentMapId, () => {
  const m = currentMap.value
  if (m?.layers) prevMapSize.value = { w: m.width || 40, h: m.height || 30 }
}, { immediate: true })

// Resize map layers when width/height change (keeps existing tiles that still fit)
const resizeMapIfNeeded = () => {
  const map = currentMap.value
  if (!map || !map.layers) return
  const w = Math.max(10, Math.min(500, map.width || 40))
  const h = Math.max(10, Math.min(500, map.height || 30))
  const { w: oldW, h: oldH } = prevMapSize.value
  if (oldW === w && oldH === h) return
  prevMapSize.value = { w, h }
  const baseTile = map.baseTile ?? TILES.GRASS
  const newGround = []
  const newObjects = []
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x
      if (y < oldH && x < oldW) {
        const oldIdx = y * oldW + x
        newGround[idx] = map.layers.ground[oldIdx] ?? baseTile
        newObjects[idx] = map.layers.objects[oldIdx] ?? TILES.EMPTY
      } else {
        newGround[idx] = baseTile
        newObjects[idx] = TILES.EMPTY
      }
    }
  }
  map.width = w
  map.height = h
  map.layers.ground = newGround
  map.layers.objects = newObjects
  map.startX = Math.min(map.startX ?? 0, w - 1)
  map.startY = Math.min(map.startY ?? 0, h - 1)
  nextTick(drawCanvas)
}

const selectedTile = ref(TILES.GRASS)
const currentLayerData = computed(() => currentMap.value?.layers[activeLayer.value] || [])

// ─── Canvas / Viewport ────────────────────────────────────────────────────────
const canvas = ref(null)
const canvasWrap = ref(null)
const zoom = ref(2)
const panX = ref(0)
const panY = ref(0)
let ctx = null
let isPanning = ref(false)
let panStart = { x: 0, y: 0, px: 0, py: 0 }
const hoverTile = ref(null)

const drawCanvas = () => {
  if (!ctx || !currentMap.value) return
  const map = currentMap.value
  const ts = TSIZE * zoom.value
  const w = map.width * ts
  const h = map.height * ts
  canvas.value.width = w
  canvas.value.height = h

  // Background
  ctx.fillStyle = '#111'
  ctx.fillRect(0, 0, w, h)

  // Ground layer
  for (let i = 0; i < map.layers.ground.length; i++) {
    const tx = (i % map.width) * ts
    const ty = Math.floor(i / map.width) * ts
    ctx.fillStyle = TILE_COLORS[map.layers.ground[i]] || '#000'
    ctx.fillRect(tx, ty, ts, ts)
  }

  // Object layer
  for (let i = 0; i < map.layers.objects.length; i++) {
    const tid = Number(map.layers.objects[i])
    if (!tid || tid === TILES.EMPTY) continue
    const tx = (i % map.width) * ts + ts * 0.1
    const ty = Math.floor(i / map.width) * ts + ts * 0.1
    const sz = ts * 0.8
    ctx.fillStyle = TILE_COLORS[tid] || '#888'
    ctx.fillRect(tx, ty, sz, sz)
    // Label
    if (ts >= 24) {
      ctx.fillStyle = 'rgba(255,255,255,0.9)'
      ctx.font = `bold ${Math.max(8, ts * 0.22)}px monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText((TILE_NAMES[tid] || '?').substring(0, 3), tx + sz / 2, ty + sz / 2)
    }
  }

  // Grid overlay
  if (zoom.value >= 1.5) {
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'
    ctx.lineWidth = 0.5
    for (let x = 0; x <= map.width; x++) {
      ctx.beginPath(); ctx.moveTo(x * ts, 0); ctx.lineTo(x * ts, h); ctx.stroke()
    }
    for (let y = 0; y <= map.height; y++) {
      ctx.beginPath(); ctx.moveTo(0, y * ts); ctx.lineTo(w, y * ts); ctx.stroke()
    }
  }

  // Hover highlight
  if (hoverTile.value) {
    const { x, y } = hoverTile.value
    ctx.fillStyle = 'rgba(255,255,255,0.18)'
    ctx.fillRect(x * ts, y * ts, ts, ts)
    ctx.strokeStyle = '#f6a901'
    ctx.lineWidth = 2
    ctx.strokeRect(x * ts + 1, y * ts + 1, ts - 2, ts - 2)
  }
}

watch([currentMapId, zoom, activeLayer], () => nextTick(drawCanvas))

const getTileCoords = (e) => {
  if (!canvas.value || !currentMap.value || !canvasWrap.value) return null
  const rect = canvas.value.getBoundingClientRect()
  const ts = TSIZE * zoom.value
  // Position in visible canvas (display pixels), then add scroll so we get position in full canvas content
  const dispX = e.clientX - rect.left
  const dispY = e.clientY - rect.top
  const scrollX = canvasWrap.value.scrollLeft || 0
  const scrollY = canvasWrap.value.scrollTop || 0
  // If canvas is CSS-scaled, convert display coords to canvas internal coords
  const scaleX = rect.width > 0 ? canvas.value.width / rect.width : 1
  const scaleY = rect.height > 0 ? canvas.value.height / rect.height : 1
  const canvasX = (dispX + scrollX) * scaleX
  const canvasY = (dispY + scrollY) * scaleY
  const tx = Math.floor(canvasX / ts)
  const ty = Math.floor(canvasY / ts)
  if (tx < 0 || ty < 0 || tx >= currentMap.value.width || ty >= currentMap.value.height) return null
  return { x: tx, y: ty }
}

const applyTool = (tc) => {
  if (!tc || !currentMap.value) return
  const map = currentMap.value
  const layer = map.layers[activeLayer.value]
  const idx = tc.y * map.width + tc.x
  if (currentTool.value === 'draw') {
    layer[idx] = selectedTile.value
    drawCanvas()
  } else if (currentTool.value === 'erase') {
    layer[idx] = activeLayer.value === 'ground' ? TILES.GRASS : TILES.EMPTY
    drawCanvas()
  } else if (currentTool.value === 'fill') {
    floodFill(layer, map.width, map.height, idx, layer[idx], selectedTile.value)
    drawCanvas()
  } else if (currentTool.value === 'pick') {
    selectedTile.value = layer[idx]
    currentTool.value = 'draw'
  }
}

const floodFill = (layer, w, h, startIdx, target, replacement) => {
  if (target === replacement) return
  const stack = [startIdx]
  const visited = new Set()
  while (stack.length) {
    const i = stack.pop()
    if (i < 0 || i >= layer.length || visited.has(i) || layer[i] !== target) continue
    visited.add(i)
    layer[i] = replacement
    const x = i % w, y = Math.floor(i / w)
    if (x > 0)     stack.push(i - 1)
    if (x < w - 1) stack.push(i + 1)
    if (y > 0)     stack.push(i - w)
    if (y < h - 1) stack.push(i + w)
  }
}

let isDrawingTiles = false

const onMouseDown = (e) => {
  if (e.button === 1 || currentTool.value === 'pan') {
    isPanning.value = true
    panStart = { x: e.clientX, y: e.clientY, px: panX.value, py: panY.value }
    return
  }
  if (e.button === 2) {
    // right click = pick
    const tc = getTileCoords(e)
    if (tc && currentMap.value) {
      const v = currentMap.value.layers[activeLayer.value][tc.y * currentMap.value.width + tc.x]
      selectedTile.value = Number(v) || (activeLayer.value === 'ground' ? TILES.GRASS : TILES.EMPTY)
    }
    return
  }
  isDrawingTiles = true
  applyTool(getTileCoords(e))
}
const onMouseMove = (e) => {
  if (isPanning.value) {
    panX.value = panStart.px + (e.clientX - panStart.x)
    panY.value = panStart.py + (e.clientY - panStart.y)
    return
  }
  const tc = getTileCoords(e)
  hoverTile.value = tc
  if (isDrawingTiles && currentTool.value !== 'fill' && currentTool.value !== 'pick') {
    applyTool(tc)
  } else {
    drawCanvas()
  }
}
const onMouseUp = () => { isPanning.value = false; isDrawingTiles = false }
const onMouseLeave = () => { isPanning.value = false; isDrawingTiles = false; hoverTile.value = null; drawCanvas() }
const onWheel = (e) => {
  const delta = e.deltaY < 0 ? 0.5 : -0.5
  zoom.value = Math.max(0.5, Math.min(5, zoom.value + delta))
}

// ─── Map Management ───────────────────────────────────────────────────────────
const showNewMapModal = ref(false)
const newMapForm = ref({ name: 'New Map', width: 40, height: 30, baseTile: TILES.GRASS })

const createNewMap = () => {
  const id = Date.now()
  const gid = nextGameId(mapList.value)
  const m = createBlankMap(id, newMapForm.value.name, newMapForm.value.width, newMapForm.value.height, newMapForm.value.baseTile, gid)
  mapList.value.push(m)
  currentMapId.value = id
  showNewMapModal.value = false
  nextTick(drawCanvas)
}

const switchMap = () => {
  nextTick(drawCanvas)
}

const deleteCurrentMap = () => {
  if (mapList.value.length <= 1) return alert('Cannot delete the last map.')
  if (!confirm(`Delete map "${currentMap.value?.name}"?`)) return
  mapList.value = mapList.value.filter(m => m.id !== currentMapId.value)
  currentMapId.value = mapList.value[0].id
  nextTick(drawCanvas)
}

const showRenameModal = ref(false)
const renameValue = ref('')
const startRename = () => {
  renameValue.value = currentMap.value?.name || ''
  showRenameModal.value = true
}
const confirmRename = () => {
  if (currentMap.value && renameValue.value.trim()) {
    currentMap.value.name = renameValue.value.trim()
  }
  showRenameModal.value = false
}

// ─── Save / Load ──────────────────────────────────────────────────────────────
// Ensure every map has a valid gameId, startX, startY before persisting
const ensureMapFields = (mapArr) => {
  let nextId = 10
  mapArr.forEach(m => {
    if (!m.gameId || m.gameId < 10) {
      while (mapArr.some(x => x !== m && x.gameId === nextId)) nextId++
      m.gameId = nextId++
    }
    if (m.startX === undefined || m.startX === null) m.startX = Math.floor((m.width || 40) / 2)
    if (m.startY === undefined || m.startY === null) m.startY = Math.floor((m.height || 30) / 2)
    if (m.baseTile === undefined || m.baseTile === null) m.baseTile = TILES.GRASS
  })
}

const saveToStorage = () => {
  try {
    ensureMapFields(mapList.value)
    localStorage.setItem(SAVE_KEY, JSON.stringify({ maps: mapList.value, current: currentMapId.value }))
    return true
  } catch (e) {
    console.error('Save failed', e)
    if (e?.name === 'QuotaExceededError' || e?.code === 22) {
      return false
    }
    return false
  }
}

const applyToGame = () => {
  saveToStorage()
  alert(`✅ ${mapList.value.length} map(s) applied to the game!\nReload the game page to see changes.\n\nGame IDs: ${mapList.value.map(m => m.gameId + ' = ' + m.name).join(', ')}`)
}

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return false
    const data = JSON.parse(raw)
    if (data.maps && data.maps.length) {
      mapList.value = data.maps
      currentMapId.value = data.current || data.maps[0].id
      // Ensure fields and persist immediately
      saveToStorage()
      return true
    }
  } catch (e) { console.error('Load failed', e) }
  return false
}

const exportJSON = () => {
  const blob = new Blob([JSON.stringify({ maps: mapList.value }, null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'rpg_maps.json'
  a.click()
}

const importInput = ref(null)
const triggerImport = () => importInput.value?.click()
const importJSON = (e) => {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target.result)
      if (data.maps) {
        mapList.value = data.maps
        currentMapId.value = data.maps[0].id
        nextTick(drawCanvas)
      }
    } catch { alert('Invalid JSON file.') }
  }
  reader.readAsText(file)
  e.target.value = ''
}

// ─── Mount ────────────────────────────────────────────────────────────────────
onMounted(() => {
  const loaded = loadFromStorage()
  if (!loaded) {
    const defaultMap = createBlankMap(Date.now(), 'Map 1', 40, 30, TILES.GRASS, 10)
    mapList.value = [defaultMap]
    currentMapId.value = defaultMap.id
  }
  nextTick(() => {
    ctx = canvas.value?.getContext('2d')
    drawCanvas()
  })
  // Auto-save whenever the map list changes
  watch(mapList, () => saveToStorage(), { deep: true })
})
</script>

<style scoped>
.map-editor-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 600px;
  background: #1a2332;
  color: #d0d4d6;
  font-family: inherit;
  overflow: hidden;
}

/* Top Bar */
.editor-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background: #0f1923;
  border-bottom: 2px solid #253344;
  flex-shrink: 0;
  gap: 10px;
  flex-wrap: wrap;
}
.topbar-left, .topbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.editor-title {
  margin: 0;
  font-size: 16px;
  color: #f6a901;
  white-space: nowrap;
}
.map-select {
  background: #253344;
  border: 1px solid #364a5e;
  color: #d0d4d6;
  padding: 6px 10px;
  font-size: 13px;
  border-radius: 4px;
  max-width: 200px;
}
.btn-topbar {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: opacity 0.2s;
  background: #253344;
  color: #d0d4d6;
}
.btn-topbar:hover { opacity: 0.8; }
.btn-new    { background: #27ae60; color: #fff; }
.btn-generate { background: #8e44ad; color: #fff; }
.btn-save   { background: #f6a901; color: #1a2332; }
.btn-export { background: #2980b9; color: #fff; }
.btn-import { background: #8e44ad; color: #fff; }
.btn-rename { background: #16a085; color: #fff; }
.btn-delete { background: #c0392b; color: #fff; }
.topbar-label { font-size: 12px; color: #8a9196; }
.zoom-slider { width: 80px; }
.zoom-val { font-size: 12px; min-width: 28px; }

/* Body */
.editor-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Sidebar */
.editor-sidebar {
  width: 180px;
  min-width: 180px;
  background: #0f1923;
  border-right: 2px solid #253344;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex-shrink: 0;
}
.sidebar-section {
  padding: 10px;
  border-bottom: 1px solid #253344;
}
.sidebar-title {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #8a9196;
  margin-bottom: 8px;
}

/* Tools */
.tool-row {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
.tool-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #253344;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s;
}
.tool-btn:hover { background: #364a5e; }
.tool-btn.active { background: #f6a901; }

/* Layer */
.layer-row {
  display: flex;
  gap: 4px;
}
.layer-btn {
  flex: 1;
  padding: 5px;
  text-align: center;
  font-size: 11px;
  background: #253344;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}
.layer-btn:hover { background: #364a5e; }
.layer-btn.active { background: #f6a901; color: #1a2332; font-weight: 700; }
.show-names-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  font-size: 12px;
  color: #d0d4d6;
  cursor: pointer;
}
.show-names-row input { accent-color: #f6a901; }

/* Tiles */
.tile-section {
  flex: 1;
}
.tile-category { margin-bottom: 10px; }
.tile-cat-label {
  font-size: 10px;
  color: #6a7480;
  margin-bottom: 4px;
  text-transform: uppercase;
}
.tile-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
}
.tile-swatch {
  width: 30px;
  height: 30px;
  border-radius: 3px;
  cursor: pointer;
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.15s, transform 0.1s;
  overflow: hidden;
}
.tile-swatch:hover { border-color: #d0d4d6; transform: scale(1.1); }
.tile-swatch.active { border-color: #f6a901; transform: scale(1.1); }
.tile-label {
  font-size: 7px;
  color: rgba(255,255,255,0.8);
  text-shadow: 0 0 3px #000;
  text-align: center;
  line-height: 1;
  pointer-events: none;
}

/* Cursor info */
.cursor-info {
  font-size: 11px;
  color: #6a7480;
  line-height: 1.6;
}

/* Canvas */
.canvas-wrap {
  flex: 1;
  overflow: auto;
  background: #0a0f18;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}
canvas {
  display: block;
  image-rendering: pixelated;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.modal-box {
  background: #2d3a4b;
  border: 1px solid #364a5e;
  border-radius: 8px;
  padding: 28px;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.modal-box-wide { min-width: 380px; }
.generate-hint { font-size: 12px; color: #8a9196; margin: 0 0 8px; }
.modal-box h3 { margin: 0; color: #f6a901; }
.form-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-row label { font-size: 12px; color: #8a9196; }
.modal-input {
  background: #1a2332;
  border: 1px solid #364a5e;
  color: #d0d4d6;
  padding: 8px 10px;
  border-radius: 4px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
}
.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

/* Map Settings */
.map-settings {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ms-row {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.ms-row label {
  font-size: 10px;
  color: #6a7480;
  text-transform: uppercase;
}
.ms-input {
  background: #1a2332;
  border: 1px solid #364a5e;
  color: #d0d4d6;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  width: 100%;
  box-sizing: border-box;
}
.ms-input:focus {
  outline: none;
  border-color: #f6a901;
}
</style>
