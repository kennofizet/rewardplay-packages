/**
 * Eclipse: Shattered Realm - Pixel Art Asset Generator
 * Generates 32x32 pixel art PNGs for all game tiles
 * Run: node generate_assets.js
 */

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const SIZE = 32;
const OUTPUT_DIR = path.join(__dirname, '../public/assets/rpg');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Helper to save canvas as PNG
const saveCanvas = (canvas, name) => {
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(OUTPUT_DIR, `${name}.png`), buffer);
    console.log(`✓ Created ${name}.png`);
};

// --- TERRAIN TILES ---

// Grass - Lush green with texture
const createGrass = () => {
    const c = createCanvas(SIZE, SIZE);
    const ctx = c.getContext('2d');

    // Base green
    ctx.fillStyle = '#4caf50';
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Texture variation
    for (let i = 0; i < 20; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? '#43a047' : '#66bb6a';
        ctx.fillRect(Math.random() * SIZE, Math.random() * SIZE, 2, 2);
    }

    // Grass blades
    ctx.strokeStyle = '#2e7d32';
    for (let i = 0; i < 8; i++) {
        const x = Math.random() * SIZE;
        const y = SIZE - Math.random() * 8;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 2, y - 6);
        ctx.stroke();
    }

    saveCanvas(c, 'grass');
};

// Grass Variant - Darker
const createGrassVariant = () => {
    const c = createCanvas(SIZE, SIZE);
    const ctx = c.getContext('2d');

    ctx.fillStyle = '#388e3c';
    ctx.fillRect(0, 0, SIZE, SIZE);

    for (let i = 0; i < 15; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? '#2e7d32' : '#43a047';
        ctx.fillRect(Math.random() * SIZE, Math.random() * SIZE, 3, 3);
    }

    saveCanvas(c, 'grass_v');
};

// Path - Stone/Dirt
const createPath = () => {
    const c = createCanvas(SIZE, SIZE);
    const ctx = c.getContext('2d');

    ctx.fillStyle = '#a1887f';
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Stone texture
    for (let i = 0; i < 8; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? '#8d6e63' : '#bcaaa4';
        const x = Math.floor(Math.random() * 4) * 8;
        const y = Math.floor(Math.random() * 4) * 8;
        ctx.fillRect(x, y, 7, 7);
    }

    saveCanvas(c, 'path');
};

// Water - Blue with ripples
const createWater = () => {
    const c = createCanvas(SIZE, SIZE);
    const ctx = c.getContext('2d');

    ctx.fillStyle = '#1e88e5';
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Ripples
    ctx.strokeStyle = '#42a5f5';
    ctx.lineWidth = 1;
    for (let y = 4; y < SIZE; y += 8) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(8, y - 2, 16, y + 2, 24, y);
        ctx.bezierCurveTo(28, y - 1, SIZE, y + 1, SIZE, y);
        ctx.stroke();
    }

    // Highlight
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillRect(4, 4, 8, 4);

    saveCanvas(c, 'water');
};

// Mountain - Rocky gray
const createMountain = () => {
    const c = createCanvas(SIZE, SIZE);
    const ctx = c.getContext('2d');

    ctx.fillStyle = '#5d4037';
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Peak shape
    ctx.fillStyle = '#6d4c41';
    ctx.beginPath();
    ctx.moveTo(16, 2);
    ctx.lineTo(30, 30);
    ctx.lineTo(2, 30);
    ctx.closePath();
    ctx.fill();

    // Snow cap
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(16, 2);
    ctx.lineTo(20, 10);
    ctx.lineTo(12, 10);
    ctx.closePath();
    ctx.fill();

    saveCanvas(c, 'mountain');
};

// --- OBJECT TILES ---

// Tree - Full pixel art tree
const createTree = () => {
    const c = createCanvas(SIZE, SIZE);
    const ctx = c.getContext('2d');

    // Trunk
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(12, 18, 8, 14);

    // Leaves - layered circles
    ctx.fillStyle = '#2e7d32';
    ctx.beginPath();
    ctx.arc(16, 12, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#388e3c';
    ctx.beginPath();
    ctx.arc(10, 14, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(22, 14, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#43a047';
    ctx.beginPath();
    ctx.arc(16, 8, 8, 0, Math.PI * 2);
    ctx.fill();

    saveCanvas(c, 'tree');
};

// House - Pixel art building
const createHouse = () => {
    const c = createCanvas(SIZE, SIZE);
    const ctx = c.getContext('2d');

    // Main body
    ctx.fillStyle = '#ffb74d';
    ctx.fillRect(4, 12, 24, 18);

    // Roof
    ctx.fillStyle = '#c62828';
    ctx.beginPath();
    ctx.moveTo(16, 2);
    ctx.lineTo(30, 14);
    ctx.lineTo(2, 14);
    ctx.closePath();
    ctx.fill();

    // Door
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(12, 20, 8, 12);

    // Window
    ctx.fillStyle = '#bbdefb';
    ctx.fillRect(22, 16, 4, 4);
    ctx.fillRect(6, 16, 4, 4);

    saveCanvas(c, 'house');
};

// Shop - Store building
const createShop = () => {
    const c = createCanvas(SIZE, SIZE);
    const ctx = c.getContext('2d');

    // Main body
    ctx.fillStyle = '#7e57c2';
    ctx.fillRect(2, 10, 28, 20);

    // Roof/Awning
    ctx.fillStyle = '#5e35b1';
    ctx.fillRect(0, 8, 32, 4);

    // Sign
    ctx.fillStyle = '#ffd54f';
    ctx.fillRect(8, 4, 16, 6);
    ctx.fillStyle = '#5e35b1';
    ctx.font = 'bold 6px Arial';
    ctx.fillText('SHOP', 10, 9);

    // Door
    ctx.fillStyle = '#4527a0';
    ctx.fillRect(12, 18, 8, 12);

    // Window
    ctx.fillStyle = '#e1f5fe';
    ctx.fillRect(4, 14, 6, 6);
    ctx.fillRect(22, 14, 6, 6);

    saveCanvas(c, 'shop');
};

// Crystal - Glowing gem
const createCrystal = () => {
    const c = createCanvas(SIZE, SIZE);
    const ctx = c.getContext('2d');

    // Glow
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(233, 30, 99, 0.5)');
    grad.addColorStop(1, 'rgba(233, 30, 99, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Crystal shape
    ctx.fillStyle = '#e91e63';
    ctx.beginPath();
    ctx.moveTo(16, 4);
    ctx.lineTo(24, 16);
    ctx.lineTo(20, 28);
    ctx.lineTo(12, 28);
    ctx.lineTo(8, 16);
    ctx.closePath();
    ctx.fill();

    // Highlight
    ctx.fillStyle = '#f48fb1';
    ctx.beginPath();
    ctx.moveTo(16, 6);
    ctx.lineTo(12, 16);
    ctx.lineTo(16, 24);
    ctx.lineTo(16, 6);
    ctx.fill();

    saveCanvas(c, 'crystal');
};

// Flower - Pink flower
const createFlower = () => {
    const c = createCanvas(SIZE, SIZE);
    const ctx = c.getContext('2d');

    // Stem
    ctx.strokeStyle = '#388e3c';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(16, 32);
    ctx.lineTo(16, 18);
    ctx.stroke();

    // Petals
    ctx.fillStyle = '#ec407a';
    for (let i = 0; i < 5; i++) {
        const angle = (i * 72 - 90) * Math.PI / 180;
        const x = 16 + Math.cos(angle) * 8;
        const y = 12 + Math.sin(angle) * 8;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
    }

    // Center
    ctx.fillStyle = '#ffd54f';
    ctx.beginPath();
    ctx.arc(16, 12, 4, 0, Math.PI * 2);
    ctx.fill();

    saveCanvas(c, 'flower');
};

// Bush
const createBush = () => {
    const c = createCanvas(SIZE, SIZE);
    const ctx = c.getContext('2d');

    ctx.fillStyle = '#2e7d32';
    ctx.beginPath();
    ctx.arc(16, 20, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#388e3c';
    ctx.beginPath();
    ctx.arc(10, 22, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(22, 22, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#43a047';
    ctx.beginPath();
    ctx.arc(16, 16, 8, 0, Math.PI * 2);
    ctx.fill();

    saveCanvas(c, 'bush');
};

// Teleport Portal
const createTeleport = () => {
    const c = createCanvas(SIZE, SIZE);
    const ctx = c.getContext('2d');

    // Outer glow
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, '#00bcd4');
    grad.addColorStop(0.5, '#006064');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Swirl
    ctx.strokeStyle = '#4dd0e1';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(16, 16, 10, 0, Math.PI * 1.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(16, 16, 6, Math.PI * 0.5, Math.PI * 2);
    ctx.stroke();

    saveCanvas(c, 'teleport');
};

// Fence
const createFence = () => {
    const c = createCanvas(SIZE, SIZE);
    const ctx = c.getContext('2d');

    ctx.fillStyle = '#8d6e63';

    // Posts
    ctx.fillRect(2, 8, 4, 24);
    ctx.fillRect(14, 8, 4, 24);
    ctx.fillRect(26, 8, 4, 24);

    // Rails
    ctx.fillRect(0, 12, 32, 4);
    ctx.fillRect(0, 22, 32, 4);

    // Post tops
    ctx.fillStyle = '#5d4037';
    ctx.beginPath();
    ctx.moveTo(4, 4);
    ctx.lineTo(6, 8);
    ctx.lineTo(2, 8);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(16, 4);
    ctx.lineTo(18, 8);
    ctx.lineTo(14, 8);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(28, 4);
    ctx.lineTo(30, 8);
    ctx.lineTo(26, 8);
    ctx.fill();

    saveCanvas(c, 'fence');
};

// Sign
const createSign = () => {
    const c = createCanvas(SIZE, SIZE);
    const ctx = c.getContext('2d');

    // Post
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(14, 14, 4, 18);

    // Sign board
    ctx.fillStyle = '#a1887f';
    ctx.fillRect(4, 4, 24, 14);
    ctx.strokeStyle = '#5d4037';
    ctx.lineWidth = 2;
    ctx.strokeRect(4, 4, 24, 14);

    // Text lines
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(8, 8, 16, 2);
    ctx.fillRect(8, 12, 12, 2);

    saveCanvas(c, 'sign');
};

// Mushroom
const createMushroom = () => {
    const c = createCanvas(SIZE, SIZE);
    const ctx = c.getContext('2d');

    // Stem
    ctx.fillStyle = '#fffde7';
    ctx.fillRect(12, 18, 8, 12);

    // Cap
    ctx.fillStyle = '#d32f2f';
    ctx.beginPath();
    ctx.arc(16, 16, 12, Math.PI, 0);
    ctx.fill();

    // Dots
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(12, 12, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(20, 10, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(16, 6, 2, 0, Math.PI * 2);
    ctx.fill();

    saveCanvas(c, 'mushroom');
};

// Water Lily
const createLily = () => {
    const c = createCanvas(SIZE, SIZE);
    const ctx = c.getContext('2d');

    // Pad
    ctx.fillStyle = '#4caf50';
    ctx.beginPath();
    ctx.arc(16, 18, 10, 0, Math.PI * 2);
    ctx.fill();

    // Pad cut
    ctx.fillStyle = '#1e88e5';
    ctx.beginPath();
    ctx.moveTo(16, 18);
    ctx.lineTo(26, 14);
    ctx.lineTo(26, 22);
    ctx.closePath();
    ctx.fill();

    // Flower
    ctx.fillStyle = '#f8bbd0';
    for (let i = 0; i < 5; i++) {
        const angle = (i * 72 - 90) * Math.PI / 180;
        const x = 16 + Math.cos(angle) * 4;
        const y = 16 + Math.sin(angle) * 4;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.fillStyle = '#fff59d';
    ctx.beginPath();
    ctx.arc(16, 16, 2, 0, Math.PI * 2);
    ctx.fill();

    saveCanvas(c, 'lily');
};

// --- CHARACTERS ---

// Player - Knight
const createPlayer = () => {
    const c = createCanvas(SIZE, SIZE);
    const ctx = c.getContext('2d');

    // Body
    ctx.fillStyle = '#1565c0';
    ctx.fillRect(10, 12, 12, 14);

    // Head
    ctx.fillStyle = '#ffcc80';
    ctx.fillRect(12, 4, 8, 8);

    // Helmet
    ctx.fillStyle = '#607d8b';
    ctx.fillRect(11, 2, 10, 6);
    ctx.fillRect(14, 8, 4, 2);

    // Visor
    ctx.fillStyle = '#263238';
    ctx.fillRect(12, 4, 8, 2);

    // Shield
    ctx.fillStyle = '#c5a059';
    ctx.beginPath();
    ctx.moveTo(22, 12);
    ctx.lineTo(28, 14);
    ctx.lineTo(28, 22);
    ctx.lineTo(22, 26);
    ctx.closePath();
    ctx.fill();

    // Sword
    ctx.fillStyle = '#9e9e9e';
    ctx.fillRect(4, 8, 2, 16);
    ctx.fillStyle = '#ffd54f';
    ctx.fillRect(2, 22, 6, 4);

    // Legs
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(10, 26, 4, 6);
    ctx.fillRect(18, 26, 4, 6);

    saveCanvas(c, 'player');
};

// Creep - Enemy monster
const createCreep = () => {
    const c = createCanvas(SIZE, SIZE);
    const ctx = c.getContext('2d');

    // Body
    ctx.fillStyle = '#7b1fa2';
    ctx.beginPath();
    ctx.arc(16, 18, 12, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(11, 14, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(21, 14, 4, 0, Math.PI * 2);
    ctx.fill();

    // Pupils
    ctx.fillStyle = '#f44336';
    ctx.beginPath();
    ctx.arc(12, 14, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(22, 14, 2, 0, Math.PI * 2);
    ctx.fill();

    // Mouth
    ctx.fillStyle = '#4a148c';
    ctx.beginPath();
    ctx.arc(16, 22, 6, 0, Math.PI);
    ctx.fill();

    // Teeth
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(12, 22);
    ctx.lineTo(14, 26);
    ctx.lineTo(16, 22);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(16, 22);
    ctx.lineTo(18, 26);
    ctx.lineTo(20, 22);
    ctx.fill();

    saveCanvas(c, 'creep');
};

// Boss - Big scary monster
const createBoss = () => {
    const c = createCanvas(SIZE, SIZE);
    const ctx = c.getContext('2d');

    // Body
    ctx.fillStyle = '#b71c1c';
    ctx.beginPath();
    ctx.arc(16, 18, 14, 0, Math.PI * 2);
    ctx.fill();

    // Horns
    ctx.fillStyle = '#4e342e';
    ctx.beginPath();
    ctx.moveTo(6, 10);
    ctx.lineTo(2, 0);
    ctx.lineTo(10, 8);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(26, 10);
    ctx.lineTo(30, 0);
    ctx.lineTo(22, 8);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#ffeb3b';
    ctx.beginPath();
    ctx.arc(11, 14, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(21, 14, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(11, 14, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(21, 14, 2, 0, Math.PI * 2);
    ctx.fill();

    // Mouth
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(8, 24);
    ctx.lineTo(12, 22);
    ctx.lineTo(16, 26);
    ctx.lineTo(20, 22);
    ctx.lineTo(24, 24);
    ctx.stroke();

    saveCanvas(c, 'boss');
};

// Bot / NPC
const createBot = () => {
    const c = createCanvas(SIZE, SIZE);
    const ctx = c.getContext('2d');

    // Body - Robed figure
    ctx.fillStyle = '#5c6bc0';
    ctx.beginPath();
    ctx.moveTo(16, 8);
    ctx.lineTo(26, 30);
    ctx.lineTo(6, 30);
    ctx.closePath();
    ctx.fill();

    // Head
    ctx.fillStyle = '#ffcc80';
    ctx.beginPath();
    ctx.arc(16, 10, 6, 0, Math.PI * 2);
    ctx.fill();

    // Hood
    ctx.fillStyle = '#3f51b5';
    ctx.beginPath();
    ctx.arc(16, 8, 8, Math.PI, 0);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(14, 10, 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(18, 10, 1, 0, Math.PI * 2);
    ctx.fill();

    // Question mark (quest giver)
    ctx.fillStyle = '#ffd54f';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('?', 23, 10);

    saveCanvas(c, 'bot');
};

// Fireball projectile
const createFireball = () => {
    const c = createCanvas(SIZE, SIZE);
    const ctx = c.getContext('2d');

    // Glow
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, '#ffeb3b');
    grad.addColorStop(0.4, '#ff9800');
    grad.addColorStop(0.7, '#f44336');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Core
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(16, 16, 4, 0, Math.PI * 2);
    ctx.fill();

    saveCanvas(c, 'fireball');
};

// --- GENERATE ALL ---
console.log('🎨 Generating Eclipse: Shattered Realm Assets...\n');

createGrass();
createGrassVariant();
createPath();
createWater();
createMountain();
createTree();
createHouse();
createShop();
createCrystal();
createFlower();
createBush();
createTeleport();
createFence();
createSign();
createMushroom();
createLily();
createPlayer();
createCreep();
createBoss();
createBot();
createFireball();

console.log('\n✨ All assets generated successfully!');
console.log(`📁 Output: ${OUTPUT_DIR}`);
