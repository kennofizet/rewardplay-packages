<template>
  <div class="map-editor">
    <div class="editor-sidebar">
      <h3>Tools</h3>
      <div class="tile-selector">
        <div 
          v-for="(name, id) in tileNames" 
          :key="id"
          class="tile-option"
          :class="{ active: selectedTile == id }"
          @click="selectedTile = parseInt(id)"
        >
          <div class="tile-preview" :style="{ backgroundColor: tileColors[id] }"></div>
          <span>{{ name }}</span>
        </div>
      </div>
      
      <div class="editor-actions">
        <button @click="saveMap" class="btn-save">Save Map</button>
        <button @click="loadMap" class="btn-load">Load Map</button>
        <button @click="clearMap" class="btn-clear">Clear</button>
      </div>
    </div>
    
    <div class="editor-canvas-container">
      <canvas 
        ref="canvas"
        @mousedown="startDrawing"
        @mousemove="draw"
        @mouseup="stopDrawing"
        @mouseleave="stopDrawing"
      ></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { TILE_SIZE, TILES, TILE_COLORS, TILE_NAMES } from './tiles'

const tileColors = TILE_COLORS
const tileNames = TILE_NAMES

const selectedTile = ref(TILES.GRASS)
const canvas = ref(null)
const isDrawing = ref(false)

// Map Data
const mapWidth = 30
const mapHeight = 20
const mapTiles = ref(new Array(mapWidth * mapHeight).fill(TILES.EMPTY))

let ctx = null

onMounted(() => {
  if (canvas.value) {
    canvas.value.width = mapWidth * TILE_SIZE
    canvas.value.height = mapHeight * TILE_SIZE
    ctx = canvas.value.getContext('2d')
    render()
  }
})

const render = () => {
  if (!ctx) return
  
  // Clear
  ctx.fillStyle = '#111'
  ctx.fillRect(0, 0, canvas.value.width, canvas.value.height)

  // Draw Tiles
  for (let i = 0; i < mapTiles.value.length; i++) {
    const x = (i % mapWidth) * TILE_SIZE
    const y = Math.floor(i / mapWidth) * TILE_SIZE
    
    const tileId = mapTiles.value[i]
    ctx.fillStyle = tileColors[tileId] || '#000'
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE)
    
    // Grid
    ctx.strokeStyle = '#333'
    ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE)
  }
}

const getTileIndex = (event) => {
  const rect = canvas.value.getBoundingClientRect()
  const x = Math.floor((event.clientX - rect.left) / TILE_SIZE)
  const y = Math.floor((event.clientY - rect.top) / TILE_SIZE)
  
  if (x >= 0 && x < mapWidth && y >= 0 && y < mapHeight) {
    return y * mapWidth + x
  }
  return -1
}

const startDrawing = (event) => {
  isDrawing.value = true
  placeTile(event)
}

const draw = (event) => {
  if (isDrawing.value) {
    placeTile(event)
  }
}

const stopDrawing = () => {
  isDrawing.value = false
}

const placeTile = (event) => {
  const index = getTileIndex(event)
  if (index !== -1) {
    mapTiles.value[index] = selectedTile.value
    render()
  }
}

const saveMap = () => {
  const mapData = {
    width: mapWidth,
    height: mapHeight,
    tiles: mapTiles.value
  }
  localStorage.setItem('rpg_map_data', JSON.stringify(mapData))
  alert('Map saved to LocalStorage!')
}

const loadMap = () => {
  const saved = localStorage.getItem('rpg_map_data')
  if (saved) {
    try {
      const data = JSON.parse(saved)
      if (data.tiles && data.tiles.length === mapWidth * mapHeight) {
        mapTiles.value = data.tiles
        render()
        alert('Map loaded!')
      } else {
        alert('Saved map size mismatch.')
      }
    } catch (e) {
      console.error(e)
    }
  } else {
    alert('No saved map found.')
  }
}

const clearMap = () => {
  if (confirm('Are you sure you want to clear the map?')) {
    mapTiles.value = new Array(mapWidth * mapHeight).fill(TILES.EMPTY)
    render()
  }
}
</script>

<style scoped>
.map-editor {
  display: flex;
  height: 100%;
  padding: 20px;
  gap: 20px;
  color: #fff;
}

.editor-sidebar {
  width: 250px;
  background: rgba(0,0,0,0.5);
  padding: 15px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}

.tile-selector {
  flex: 1;
  overflow-y: auto;
  margin: 15px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tile-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s;
}

.tile-option:hover {
  background: rgba(255,255,255,0.1);
}

.tile-option.active {
  background: rgba(33, 150, 243, 0.3);
  border: 1px solid #2196f3;
}

.tile-preview {
  width: 24px;
  height: 24px;
  border: 1px solid rgba(255,255,255,0.2);
}

.editor-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.editor-actions button {
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: opacity 0.2s;
}

.editor-actions button:hover {
  opacity: 0.9;
}

.btn-save { background: #4caf50; color: white; }
.btn-load { background: #2196f3; color: white; }
.btn-clear { background: #f44336; color: white; }

.editor-canvas-container {
  flex: 1;
  background: #1a1a1a;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  overflow: auto;
}

canvas {
  background: #000;
  box-shadow: 0 0 20px rgba(0,0,0,0.5);
}
</style>
