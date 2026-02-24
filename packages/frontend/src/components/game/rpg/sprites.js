import { TILE_SIZE, TILES } from './tiles';

// ============================================
// PIXEL ART SPRITE GENERATOR (No Dependencies)
// ============================================
const SIZE = TILE_SIZE;

// Helper to create canvas and return image
const makeSprite = (drawFn) => {
    const c = document.createElement('canvas');
    c.width = SIZE; c.height = SIZE;
    const ctx = c.getContext('2d');
    drawFn(ctx);
    const img = new Image();
    img.src = c.toDataURL();
    return img;
};

// Helper to create walk animation frames (4 frames)
// drawBodyFn(ctx, frame) — frame 0=idle, 1=walk-left, 2=walk-mid, 3=walk-right
const makeWalkFrames = (drawBodyFn) => {
    const frames = [];
    for (let f = 0; f < 4; f++) {
        frames.push(makeSprite(ctx => drawBodyFn(ctx, f)));
    }
    return frames;
};

// --- TERRAIN SPRITES ---
const createGrass = () => makeSprite(ctx => {
    ctx.fillStyle = '#4caf50';
    ctx.fillRect(0, 0, SIZE, SIZE);
    for (let i = 0; i < 15; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? '#43a047' : '#66bb6a';
        ctx.fillRect(Math.random() * SIZE, Math.random() * SIZE, 3, 3);
    }
    ctx.strokeStyle = '#2e7d32';
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
        const x = 4 + Math.random() * 24;
        ctx.beginPath();
        ctx.moveTo(x, SIZE);
        ctx.lineTo(x - 2, SIZE - 8 - Math.random() * 4);
        ctx.stroke();
    }
});

const createGrassVariant = () => makeSprite(ctx => {
    ctx.fillStyle = '#388e3c';
    ctx.fillRect(0, 0, SIZE, SIZE);
    for (let i = 0; i < 12; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? '#2e7d32' : '#43a047';
        ctx.fillRect(Math.random() * SIZE, Math.random() * SIZE, 4, 4);
    }
});

const createPath = () => makeSprite(ctx => {
    ctx.fillStyle = '#a1887f';
    ctx.fillRect(0, 0, SIZE, SIZE);
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            ctx.fillStyle = Math.random() > 0.5 ? '#8d6e63' : '#bcaaa4';
            ctx.fillRect(x * 8 + 1, y * 8 + 1, 6, 6);
        }
    }
});

const createWater = () => makeSprite(ctx => {
    ctx.fillStyle = '#1e88e5';
    ctx.fillRect(0, 0, SIZE, SIZE);
    ctx.strokeStyle = '#42a5f5';
    ctx.lineWidth = 1;
    for (let y = 6; y < SIZE; y += 8) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(8, y - 3, 16, y + 3, 24, y);
        ctx.bezierCurveTo(28, y - 2, SIZE, y + 2, SIZE, y);
        ctx.stroke();
    }
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(4, 4, 6, 3);
});

const createMountain = () => makeSprite(ctx => {
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(0, 0, SIZE, SIZE);
    ctx.fillStyle = '#6d4c41';
    ctx.beginPath();
    ctx.moveTo(16, 2); ctx.lineTo(30, 30); ctx.lineTo(2, 30);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#eceff1';
    ctx.beginPath();
    ctx.moveTo(16, 2); ctx.lineTo(20, 10); ctx.lineTo(12, 10);
    ctx.closePath(); ctx.fill();
});

// --- OBJECT SPRITES ---
const createTree = () => makeSprite(ctx => {
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(12, 18, 8, 14);
    ctx.fillStyle = '#1b5e20';
    ctx.beginPath(); ctx.arc(16, 14, 12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#2e7d32';
    ctx.beginPath(); ctx.arc(10, 16, 7, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(22, 16, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#388e3c';
    ctx.beginPath(); ctx.arc(16, 10, 7, 0, Math.PI * 2); ctx.fill();
});

const createHouse = () => makeSprite(ctx => {
    ctx.fillStyle = '#ffb74d';
    ctx.fillRect(4, 12, 24, 18);
    ctx.fillStyle = '#c62828';
    ctx.beginPath(); ctx.moveTo(16, 2); ctx.lineTo(30, 14); ctx.lineTo(2, 14); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(12, 20, 8, 10);
    ctx.fillStyle = '#ffd54f';
    ctx.fillRect(18, 24, 1, 2);
    ctx.fillStyle = '#bbdefb';
    ctx.fillRect(6, 16, 4, 4);
    ctx.fillRect(22, 16, 4, 4);
});

const createShop = () => makeSprite(ctx => {
    ctx.fillStyle = '#7e57c2';
    ctx.fillRect(2, 10, 28, 20);
    ctx.fillStyle = '#5e35b1';
    ctx.fillRect(0, 8, SIZE, 5);
    ctx.fillStyle = '#4527a0';
    for (let x = 0; x < SIZE; x += 8) ctx.fillRect(x, 8, 4, 5);
    ctx.fillStyle = '#ffd54f';
    ctx.fillRect(8, 2, 16, 6);
    ctx.fillStyle = '#4527a0';
    ctx.font = 'bold 5px sans-serif';
    ctx.fillText('SHOP', 11, 7);
    ctx.fillStyle = '#311b92';
    ctx.fillRect(12, 18, 8, 12);
});

const createCrystal = () => makeSprite(ctx => {
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(233, 30, 99, 0.6)');
    grad.addColorStop(1, 'rgba(233, 30, 99, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, SIZE, SIZE);
    ctx.fillStyle = '#e91e63';
    ctx.beginPath();
    ctx.moveTo(16, 4); ctx.lineTo(24, 16); ctx.lineTo(20, 28); ctx.lineTo(12, 28); ctx.lineTo(8, 16);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#f48fb1';
    ctx.beginPath();
    ctx.moveTo(16, 6); ctx.lineTo(12, 16); ctx.lineTo(16, 26);
    ctx.closePath(); ctx.fill();
});

const createFlower = () => makeSprite(ctx => {
    ctx.strokeStyle = '#388e3c';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(16, 32); ctx.lineTo(16, 18); ctx.stroke();
    ctx.fillStyle = '#ec407a';
    for (let i = 0; i < 5; i++) {
        const angle = (i * 360 / 5 - 90) * Math.PI / 180;
        ctx.beginPath();
        ctx.arc(16 + Math.cos(angle) * 6, 12 + Math.sin(angle) * 6, 4, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.fillStyle = '#ffd54f';
    ctx.beginPath(); ctx.arc(16, 12, 3, 0, Math.PI * 2); ctx.fill();
});

const createBush = () => makeSprite(ctx => {
    ctx.fillStyle = '#2e7d32';
    ctx.beginPath(); ctx.arc(16, 22, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#388e3c';
    ctx.beginPath(); ctx.arc(10, 24, 6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(22, 24, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#43a047';
    ctx.beginPath(); ctx.arc(16, 18, 6, 0, Math.PI * 2); ctx.fill();
});

const createTeleport = () => makeSprite(ctx => {
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, '#4dd0e1');
    grad.addColorStop(0.6, '#00838f');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, SIZE, SIZE);
    ctx.strokeStyle = '#80deea';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(16, 16, 10, 0, Math.PI * 1.5); ctx.stroke();
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(16, 16, 5, Math.PI * 0.5, Math.PI * 2); ctx.stroke();
});

const createFence = () => makeSprite(ctx => {
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(2, 8, 4, 24);
    ctx.fillRect(14, 8, 4, 24);
    ctx.fillRect(26, 8, 4, 24);
    ctx.fillRect(0, 12, SIZE, 3);
    ctx.fillRect(0, 22, SIZE, 3);
    ctx.fillStyle = '#5d4037';
    [[4, 8], [16, 8], [28, 8]].forEach(([x, y]) => {
        ctx.beginPath(); ctx.moveTo(x, y - 4); ctx.lineTo(x + 3, y); ctx.lineTo(x - 3, y); ctx.fill();
    });
});

const createSign = () => makeSprite(ctx => {
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(14, 14, 4, 18);
    ctx.fillStyle = '#bcaaa4';
    ctx.fillRect(4, 4, 24, 12);
    ctx.strokeStyle = '#5d4037';
    ctx.lineWidth = 1;
    ctx.strokeRect(4, 4, 24, 12);
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(7, 8, 14, 2);
    ctx.fillRect(7, 12, 10, 2);
});

const createMushroom = () => makeSprite(ctx => {
    ctx.fillStyle = '#fffde7';
    ctx.fillRect(12, 18, 8, 12);
    ctx.fillStyle = '#d32f2f';
    ctx.beginPath(); ctx.arc(16, 16, 10, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(12, 12, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(20, 10, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(16, 7, 2, 0, Math.PI * 2); ctx.fill();
});

const createLily = () => makeSprite(ctx => {
    ctx.fillStyle = '#4caf50';
    ctx.beginPath(); ctx.arc(16, 20, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1e88e5';
    ctx.beginPath(); ctx.moveTo(16, 20); ctx.lineTo(26, 15); ctx.lineTo(26, 25); ctx.fill();
    ctx.fillStyle = '#f8bbd0';
    for (let i = 0; i < 5; i++) {
        const a = (i * 72 - 90) * Math.PI / 180;
        ctx.beginPath(); ctx.arc(16 + Math.cos(a) * 4, 18 + Math.sin(a) * 4, 3, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = '#fff59d';
    ctx.beginPath(); ctx.arc(16, 18, 2, 0, Math.PI * 2); ctx.fill();
});

// --- FARM & DEFENSE SPRITES ---
const createFarmSoil = () => makeSprite(ctx => {
    ctx.fillStyle = '#8d6534';
    ctx.fillRect(0, 0, SIZE, SIZE);
    // Tilled rows
    ctx.fillStyle = '#6d4c1a';
    for (let i = 0; i < 6; i++) {
        ctx.fillRect(2, 3 + i * 5, SIZE - 4, 2);
    }
    ctx.fillStyle = '#a0783c';
    for (let i = 0; i < 6; i++) {
        ctx.fillRect(2, 5 + i * 5, SIZE - 4, 1);
    }
});

const createDefenseSlot = () => makeSprite(ctx => {
    ctx.fillStyle = '#5d8a3c';
    ctx.fillRect(0, 0, SIZE, SIZE);
    ctx.fillStyle = '#4a7030';
    ctx.fillRect(1, 1, SIZE - 2, SIZE - 2);
    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(2, 2, SIZE - 4, SIZE - 4);
    // Plus sign in center
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillRect(13, 8, 6, 16);
    ctx.fillRect(8, 13, 16, 6);
});

// Defense Plants
const createPeashooter = () => makeSprite(ctx => {
    ctx.fillStyle = '#4caf50';
    ctx.beginPath(); ctx.arc(16, 20, 8, 0, Math.PI * 2); ctx.fill(); // body
    ctx.fillStyle = '#2e7d32';
    ctx.fillRect(14, 24, 4, 8); // stem
    ctx.fillStyle = '#66bb6a';
    ctx.beginPath(); ctx.arc(16, 18, 4, 0, Math.PI * 2); ctx.fill(); // head
    ctx.fillStyle = '#1b5e20';
    ctx.beginPath(); ctx.arc(22, 17, 5, -0.5, 0.5); ctx.lineTo(20, 17); ctx.fill(); // mouth
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(15, 14, 3, 0, Math.PI * 2); ctx.fill(); // eye
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(16, 14, 1.5, 0, Math.PI * 2); ctx.fill();
});

const createSunflower = () => makeSprite(ctx => {
    // Petals
    ctx.fillStyle = '#fdd835';
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 5) {
        ctx.beginPath();
        ctx.ellipse(16 + Math.cos(a) * 7, 16 + Math.sin(a) * 7, 4, 3, a, 0, Math.PI * 2);
        ctx.fill();
    }
    // Center
    ctx.fillStyle = '#5d4037';
    ctx.beginPath(); ctx.arc(16, 16, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#8d6e63';
    ctx.beginPath(); ctx.arc(16, 16, 3, 0, Math.PI * 2); ctx.fill();
    // Stem
    ctx.fillStyle = '#2e7d32';
    ctx.fillRect(15, 22, 2, 10);
    // Eyes
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(14, 15, 1, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(18, 15, 1, 0, Math.PI * 2); ctx.fill();
});

const createWallnut = () => makeSprite(ctx => {
    ctx.fillStyle = '#8d6e63';
    ctx.beginPath(); ctx.arc(16, 18, 12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#a1887f';
    ctx.beginPath(); ctx.arc(16, 16, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#6d4c41';
    ctx.beginPath(); ctx.arc(16, 16, 8, 0, Math.PI, true); ctx.fill();
    // Face
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(12, 16, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(20, 16, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(16, 22, 3, 0, Math.PI); ctx.stroke();
});

const createSnowPea = () => makeSprite(ctx => {
    ctx.fillStyle = '#4fc3f7';
    ctx.beginPath(); ctx.arc(16, 20, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#0288d1';
    ctx.fillRect(14, 24, 4, 8);
    ctx.fillStyle = '#81d4fa';
    ctx.beginPath(); ctx.arc(16, 18, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#01579b';
    ctx.beginPath(); ctx.arc(22, 17, 5, -0.5, 0.5); ctx.lineTo(20, 17); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(15, 14, 3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#01579b';
    ctx.beginPath(); ctx.arc(16, 14, 1.5, 0, Math.PI * 2); ctx.fill();
    // Ice crystals
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillRect(24, 14, 2, 2); ctx.fillRect(26, 17, 2, 2);
});

const createCherryBomb = () => makeSprite(ctx => {
    // Two cherries
    ctx.fillStyle = '#d32f2f';
    ctx.beginPath(); ctx.arc(11, 20, 8, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(21, 20, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#b71c1c';
    ctx.beginPath(); ctx.arc(11, 22, 5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(21, 22, 5, 0, Math.PI * 2); ctx.fill();
    // Stems
    ctx.strokeStyle = '#2e7d32'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(11, 12); ctx.quadraticCurveTo(16, 4, 16, 4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(21, 12); ctx.quadraticCurveTo(16, 4, 16, 4); ctx.stroke();
    // Angry face
    ctx.fillStyle = '#000';
    ctx.fillRect(8, 18, 3, 2); ctx.fillRect(18, 18, 3, 2);
});

const createRepeaterSprite = () => makeSprite(ctx => {
    ctx.fillStyle = '#2e7d32';
    ctx.beginPath(); ctx.arc(16, 20, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1b5e20';
    ctx.fillRect(14, 24, 4, 8);
    ctx.fillStyle = '#43a047';
    ctx.beginPath(); ctx.arc(16, 18, 4, 0, Math.PI * 2); ctx.fill();
    // Double barrel
    ctx.fillStyle = '#1b5e20';
    ctx.fillRect(20, 14, 8, 3);
    ctx.fillRect(20, 19, 8, 3);
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(15, 14, 3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(16, 14, 1.5, 0, Math.PI * 2); ctx.fill();
});

const createChomper = () => makeSprite(ctx => {
    ctx.fillStyle = '#7b1fa2';
    ctx.beginPath(); ctx.arc(16, 20, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#4a148c';
    ctx.fillRect(14, 26, 4, 6);
    // Open mouth
    ctx.fillStyle = '#ab47bc';
    ctx.beginPath(); ctx.arc(16, 14, 9, -0.8, 0.8); ctx.lineTo(16, 14); ctx.fill();
    ctx.fillStyle = '#e91e63';
    ctx.beginPath(); ctx.arc(16, 14, 6, 0, Math.PI * 2); ctx.fill(); // inside mouth
    // Teeth
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 5; i++) {
        ctx.fillRect(10 + i * 3, 10, 2, 3);
        ctx.fillRect(10 + i * 3, 18, 2, 3);
    }
});

const createTorchwood = () => makeSprite(ctx => {
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(12, 8, 8, 24); // trunk
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(10, 14, 12, 8);
    // Fire on top
    const fire = ctx.createRadialGradient(16, 6, 0, 16, 6, 8);
    fire.addColorStop(0, '#fff');
    fire.addColorStop(0.3, '#ffeb3b');
    fire.addColorStop(0.6, '#ff9800');
    fire.addColorStop(1, '#f44336');
    ctx.fillStyle = fire;
    ctx.beginPath(); ctx.arc(16, 6, 8, 0, Math.PI * 2); ctx.fill();
    // Face
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(13, 18, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(19, 18, 2, 0, Math.PI * 2); ctx.fill();
});

// Zombie sprites
const createZombieBasic = () => makeSprite(ctx => {
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath(); ctx.ellipse(16, 30, 8, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#6d8a4e'; // green-ish skin
    ctx.fillRect(12, 12, 8, 12); // body
    ctx.fillRect(11, 22, 4, 8); ctx.fillRect(17, 22, 4, 8); // legs
    ctx.fillRect(12, 4, 8, 9); // head
    ctx.fillStyle = '#5a7340';
    ctx.fillRect(10, 14, 3, 8); ctx.fillRect(19, 14, 3, 8); // arms
    ctx.fillStyle = '#fff';
    ctx.fillRect(13, 7, 2, 2); ctx.fillRect(17, 7, 2, 2); // eyes
    ctx.fillStyle = '#000';
    ctx.fillRect(14, 7, 1, 2); ctx.fillRect(18, 7, 1, 2);
    ctx.fillStyle = '#4a6833';
    ctx.fillRect(13, 11, 6, 2); // mouth
});

const createZombieCone = () => makeSprite(ctx => {
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath(); ctx.ellipse(16, 30, 8, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#6d8a4e';
    ctx.fillRect(12, 12, 8, 12); ctx.fillRect(11, 22, 4, 8); ctx.fillRect(17, 22, 4, 8);
    ctx.fillRect(12, 4, 8, 9);
    ctx.fillStyle = '#5a7340';
    ctx.fillRect(10, 14, 3, 8); ctx.fillRect(19, 14, 3, 8);
    // Cone hat
    ctx.fillStyle = '#ff9800';
    ctx.beginPath(); ctx.moveTo(16, -2); ctx.lineTo(22, 8); ctx.lineTo(10, 8); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#e65100';
    ctx.fillRect(10, 6, 12, 3);
    ctx.fillStyle = '#fff';
    ctx.fillRect(13, 7, 2, 2); ctx.fillRect(17, 7, 2, 2);
});

const createZombieBucket = () => makeSprite(ctx => {
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath(); ctx.ellipse(16, 30, 8, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#6d8a4e';
    ctx.fillRect(12, 12, 8, 12); ctx.fillRect(11, 22, 4, 8); ctx.fillRect(17, 22, 4, 8);
    ctx.fillRect(12, 7, 8, 6);
    ctx.fillStyle = '#5a7340';
    ctx.fillRect(10, 14, 3, 8); ctx.fillRect(19, 14, 3, 8);
    // Bucket
    ctx.fillStyle = '#757575';
    ctx.fillRect(10, 0, 12, 10);
    ctx.fillStyle = '#616161';
    ctx.fillRect(9, 0, 14, 3);
    ctx.fillStyle = '#9e9e9e';
    ctx.fillRect(12, 2, 8, 2);
});

const createZombieFlag = () => makeSprite(ctx => {
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath(); ctx.ellipse(16, 30, 8, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#6d8a4e';
    ctx.fillRect(12, 12, 8, 12); ctx.fillRect(11, 22, 4, 8); ctx.fillRect(17, 22, 4, 8);
    ctx.fillRect(12, 4, 8, 9);
    ctx.fillStyle = '#5a7340';
    ctx.fillRect(10, 14, 3, 8); ctx.fillRect(19, 12, 3, 10);
    // Flag pole + flag
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(22, 0, 2, 20);
    ctx.fillStyle = '#f44336';
    ctx.fillRect(24, 0, 8, 6);
    ctx.fillStyle = '#fff';
    ctx.fillRect(26, 2, 4, 2);
});

const createZombiePole = () => makeSprite(ctx => {
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath(); ctx.ellipse(16, 30, 8, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#6d8a4e';
    ctx.fillRect(12, 10, 8, 14); ctx.fillRect(11, 22, 4, 8); ctx.fillRect(17, 22, 4, 8);
    ctx.fillRect(12, 3, 8, 8);
    ctx.fillStyle = '#3f51b5';
    ctx.fillRect(11, 10, 10, 4); // uniform
    // Pole
    ctx.fillStyle = '#bdbdbd';
    ctx.fillRect(4, 2, 2, 24);
    ctx.fillStyle = '#fff';
    ctx.fillRect(13, 6, 2, 2); ctx.fillRect(17, 6, 2, 2);
});

const createZombieFootball = () => makeSprite(ctx => {
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath(); ctx.ellipse(16, 30, 9, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#6d8a4e';
    ctx.fillRect(10, 10, 12, 14); ctx.fillRect(10, 22, 5, 8); ctx.fillRect(17, 22, 5, 8);
    ctx.fillRect(12, 4, 8, 7);
    // Helmet
    ctx.fillStyle = '#1a237e';
    ctx.fillRect(10, 0, 12, 8);
    ctx.fillStyle = '#283593';
    ctx.fillRect(12, 2, 8, 2);
    ctx.fillStyle = '#ffd54f';
    ctx.fillRect(13, 6, 3, 2); ctx.fillRect(18, 6, 3, 2);
    // Shoulder pads
    ctx.fillStyle = '#1a237e';
    ctx.fillRect(6, 10, 6, 6); ctx.fillRect(20, 10, 6, 6);
});

const createZombieScreen = () => makeSprite(ctx => {
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath(); ctx.ellipse(16, 30, 8, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#6d8a4e';
    ctx.fillRect(12, 12, 8, 12); ctx.fillRect(11, 22, 4, 8); ctx.fillRect(17, 22, 4, 8);
    ctx.fillRect(12, 4, 8, 9);
    // Screen door shield
    ctx.strokeStyle = '#795548'; ctx.lineWidth = 2;
    ctx.strokeRect(3, 4, 10, 22);
    ctx.fillStyle = 'rgba(121,85,72,0.3)';
    ctx.fillRect(3, 4, 10, 22);
    // Grid pattern on door
    ctx.strokeStyle = '#5d4037'; ctx.lineWidth = 1;
    for (let y = 7; y < 26; y += 4) ctx.strokeRect(4, y, 8, 4);
    ctx.fillStyle = '#fff';
    ctx.fillRect(17, 7, 2, 2);
});

const createZombieGarg = () => makeSprite(ctx => {
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath(); ctx.ellipse(16, 31, 12, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#4a0e0e';
    ctx.fillRect(8, 6, 16, 18); // massive body
    ctx.fillRect(7, 22, 6, 10); ctx.fillRect(19, 22, 6, 10); // thick legs
    ctx.fillRect(10, 0, 12, 8); // head
    ctx.fillStyle = '#3d0909';
    ctx.fillRect(4, 10, 6, 14); ctx.fillRect(22, 10, 6, 14); // big arms
    // Telephone pole weapon
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(26, 0, 3, 26);
    ctx.fillStyle = '#ff1744';
    ctx.fillRect(13, 3, 3, 2); ctx.fillRect(17, 3, 3, 2);
});

const createZombieImp = () => makeSprite(ctx => {
    ctx.fillStyle = '#9ccc65';
    ctx.fillRect(13, 16, 6, 8); // tiny body
    ctx.fillRect(12, 22, 4, 6); ctx.fillRect(16, 22, 4, 6); // legs
    ctx.fillRect(13, 10, 6, 7); // head
    ctx.fillStyle = '#7cb342';
    ctx.fillRect(10, 18, 3, 6); ctx.fillRect(19, 18, 3, 6); // arms
    ctx.fillStyle = '#fff';
    ctx.fillRect(14, 12, 2, 2); ctx.fillRect(17, 12, 2, 2);
    ctx.fillStyle = '#000';
    ctx.fillRect(15, 13, 1, 1); ctx.fillRect(18, 13, 1, 1);
});

// Projectile sprites
const createPeaProjectile = () => makeSprite(ctx => {
    ctx.fillStyle = '#4caf50';
    ctx.beginPath(); ctx.arc(16, 16, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#81c784';
    ctx.beginPath(); ctx.arc(15, 15, 2, 0, Math.PI * 2); ctx.fill();
});

const createSnowPeaProjectile = () => makeSprite(ctx => {
    ctx.fillStyle = '#4fc3f7';
    ctx.beginPath(); ctx.arc(16, 16, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#e1f5fe';
    ctx.beginPath(); ctx.arc(15, 15, 2, 0, Math.PI * 2); ctx.fill();
});

const createFirePeaProjectile = () => makeSprite(ctx => {
    const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 5);
    g.addColorStop(0, '#fff');
    g.addColorStop(0.4, '#ff9800');
    g.addColorStop(1, '#f44336');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(16, 16, 5, 0, Math.PI * 2); ctx.fill();
});

// --- CHARACTER SPRITES (Walk-Frame Animated) ---

// Helper: draw legs with walk animation for humanoid characters
// frame: 0=idle, 1=left-fwd, 2=mid, 3=right-fwd
const drawLegs = (ctx, frame, mainColor, bootColor, leftX = 11, rightX = 17, y = 24, legW = 4, legH = 7) => {
    const offsets = [
        { lx: 0, ly: 0, rx: 0, ry: 0 },    // idle
        { lx: -2, ly: -1, rx: 2, ry: 1 },   // left forward
        { lx: 0, ly: 0, rx: 0, ry: 0 },      // mid (passing)
        { lx: 2, ly: 1, rx: -2, ry: -1 },    // right forward
    ][frame];
    // Left leg
    ctx.fillStyle = mainColor;
    ctx.fillRect(leftX + offsets.lx, y + offsets.ly, legW, legH - offsets.ly);
    // Right leg
    ctx.fillRect(rightX + offsets.rx, y + offsets.ry, legW, legH - offsets.ry);
    // Boots
    if (bootColor) {
        ctx.fillStyle = bootColor;
        ctx.fillRect(leftX + offsets.lx, y + legH - 3 + Math.max(0, offsets.ly), legW, 3 - Math.max(0, offsets.ly));
        ctx.fillRect(rightX + offsets.rx, y + legH - 3 + Math.max(0, offsets.ry), legW, 3 - Math.max(0, offsets.ry));
    }
};

// Body bob offset per frame (slight vertical movement)
const bodyBob = (frame) => [0, -1, 0, -1][frame];

// --- DEFAULT PLAYER ---
const createPlayerFrames = () => makeWalkFrames((ctx, frame) => {
    const bob = bodyBob(frame);
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath(); ctx.ellipse(16, 30, 10, 3, 0, 0, Math.PI * 2); ctx.fill();
    // Cape (sways with walk)
    const capeOffset = frame === 1 ? 1 : frame === 3 ? -1 : 0;
    ctx.fillStyle = '#1a237e';
    ctx.beginPath(); ctx.moveTo(12, 12 + bob); ctx.lineTo(8 + capeOffset, 30); ctx.lineTo(24 + capeOffset, 30); ctx.lineTo(20, 12 + bob); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#0d1466';
    ctx.beginPath(); ctx.moveTo(14, 14 + bob); ctx.lineTo(10 + capeOffset, 28); ctx.lineTo(22 + capeOffset, 28); ctx.lineTo(18, 14 + bob); ctx.closePath(); ctx.fill();
    // Legs
    drawLegs(ctx, frame, '#455a64', '#546e7a');
    // Body armor
    ctx.fillStyle = '#37474f';
    ctx.fillRect(10, 10 + bob, 12, 14);
    ctx.fillStyle = '#546e7a';
    ctx.fillRect(12, 12 + bob, 8, 10);
    ctx.fillStyle = '#78909c';
    ctx.fillRect(14, 13 + bob, 4, 2);
    // Pauldrons
    ctx.fillStyle = '#607d8b';
    ctx.fillRect(7, 9 + bob, 6, 5); ctx.fillRect(19, 9 + bob, 6, 5);
    ctx.fillStyle = '#78909c';
    ctx.fillRect(8, 10 + bob, 4, 2); ctx.fillRect(20, 10 + bob, 4, 2);
    // Head
    ctx.fillStyle = '#ffcc80';
    ctx.fillRect(12, 3 + bob, 8, 7);
    // Helmet
    ctx.fillStyle = '#546e7a';
    ctx.fillRect(11, 1 + bob, 10, 5);
    ctx.fillStyle = '#455a64';
    ctx.fillRect(11, 0 + bob, 10, 3);
    ctx.fillStyle = '#4fc3f7';
    ctx.fillRect(13, 4 + bob, 3, 2); ctx.fillRect(17, 4 + bob, 3, 2);
    // Arms swing
    const armSwing = frame === 1 ? -2 : frame === 3 ? 2 : 0;
    // Sword (right hand)
    ctx.fillStyle = '#b0bec5';
    ctx.fillRect(26, 2 + bob + armSwing, 2, 18);
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(26, 2 + bob + armSwing, 2, 2);
    ctx.fillStyle = '#c5a059';
    ctx.fillRect(24, 18 + bob + armSwing, 6, 2);
    // Shield (left arm)
    ctx.fillStyle = '#1565c0';
    ctx.fillRect(3, 10 + bob - armSwing, 7, 12);
    ctx.fillStyle = '#1976d2';
    ctx.fillRect(4, 11 + bob - armSwing, 5, 10);
    ctx.fillStyle = '#c5a059';
    ctx.fillRect(5, 14 + bob - armSwing, 3, 4);
    ctx.strokeStyle = '#0d47a1'; ctx.lineWidth = 1;
    ctx.strokeRect(3, 10 + bob - armSwing, 7, 12);
});

// --- DARK KNIGHT ---
const createDarkKnightFrames = () => makeWalkFrames((ctx, frame) => {
    const bob = bodyBob(frame);
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath(); ctx.ellipse(16, 30, 10, 3, 0, 0, Math.PI * 2); ctx.fill();
    // Cape sway
    const capeOffset = frame === 1 ? 2 : frame === 3 ? -2 : 0;
    ctx.fillStyle = '#4a0000';
    ctx.beginPath(); ctx.moveTo(12, 12 + bob); ctx.lineTo(6 + capeOffset, 31); ctx.lineTo(26 + capeOffset, 31); ctx.lineTo(20, 12 + bob); ctx.closePath(); ctx.fill();
    // Legs
    drawLegs(ctx, frame, '#5d1010', '#8b1a1a');
    // Heavy plate body
    ctx.fillStyle = '#7b1a1a';
    ctx.fillRect(10, 10 + bob, 12, 14);
    ctx.fillStyle = '#8b2020';
    ctx.fillRect(12, 12 + bob, 8, 10);
    ctx.fillStyle = '#c62828';
    ctx.fillRect(14, 14 + bob, 4, 3);
    // Spiked pauldrons
    ctx.fillStyle = '#8b1a1a';
    ctx.fillRect(6, 8 + bob, 7, 6); ctx.fillRect(19, 8 + bob, 7, 6);
    ctx.fillStyle = '#b0bec5';
    ctx.beginPath(); ctx.moveTo(8, 8 + bob); ctx.lineTo(9, 3 + bob); ctx.lineTo(11, 8 + bob); ctx.fill();
    ctx.beginPath(); ctx.moveTo(21, 8 + bob); ctx.lineTo(22, 3 + bob); ctx.lineTo(24, 8 + bob); ctx.fill();
    // Head
    ctx.fillStyle = '#ffcc80';
    ctx.fillRect(12, 3 + bob, 8, 7);
    // Helmet
    ctx.fillStyle = '#4a0000';
    ctx.fillRect(11, 0 + bob, 10, 6);
    ctx.fillStyle = '#ff1744';
    ctx.fillRect(13, 4 + bob, 3, 2); ctx.fillRect(17, 4 + bob, 3, 2);
    ctx.fillStyle = '#c62828';
    ctx.fillRect(14, -1 + bob, 4, 3);
    // Arm swing
    const armSwing = frame === 1 ? -2 : frame === 3 ? 2 : 0;
    // Great Sword
    ctx.fillStyle = '#b0bec5';
    ctx.fillRect(27, 0 + bob + armSwing, 3, 22);
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(27, 0 + bob + armSwing, 3, 3);
    ctx.fillStyle = '#c5a059';
    ctx.fillRect(25, 20 + bob + armSwing, 7, 3);
    ctx.fillStyle = 'rgba(255,23,68,0.2)';
    ctx.fillRect(26, 0 + bob + armSwing, 5, 22);
});

// --- DARK WIZARD ---
const createDarkWizardFrames = () => makeWalkFrames((ctx, frame) => {
    const bob = bodyBob(frame);
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath(); ctx.ellipse(16, 30, 10, 3, 0, 0, Math.PI * 2); ctx.fill();
    // Aura
    const aura = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    aura.addColorStop(0, 'rgba(156, 39, 176, 0.12)');
    aura.addColorStop(1, 'rgba(156, 39, 176, 0)');
    ctx.fillStyle = aura;
    ctx.fillRect(0, 0, SIZE, SIZE);
    // Robe sway
    const robeOffset = frame === 1 ? 1 : frame === 3 ? -1 : 0;
    ctx.fillStyle = '#4a148c';
    ctx.beginPath();
    ctx.moveTo(10, 12 + bob); ctx.lineTo(5 + robeOffset, 31); ctx.lineTo(27 + robeOffset, 31); ctx.lineTo(22, 12 + bob);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#311b92';
    ctx.beginPath();
    ctx.moveTo(12, 14 + bob); ctx.lineTo(8 + robeOffset, 29); ctx.lineTo(24 + robeOffset, 29); ctx.lineTo(20, 14 + bob);
    ctx.closePath(); ctx.fill();
    // Belt
    ctx.fillStyle = '#c5a059';
    ctx.fillRect(12, 18 + bob, 8, 2);
    // Body
    ctx.fillStyle = '#6a1b9a';
    ctx.fillRect(11, 10 + bob, 10, 10);
    // Head
    ctx.fillStyle = '#ffcc80';
    ctx.fillRect(12, 4 + bob, 8, 7);
    // Wizard hat
    ctx.fillStyle = '#4a148c';
    ctx.beginPath();
    ctx.moveTo(16, -3 + bob); ctx.lineTo(24, 7 + bob); ctx.lineTo(8, 7 + bob);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#6a1b9a';
    ctx.fillRect(7, 5 + bob, 18, 3);
    ctx.fillStyle = '#c5a059';
    ctx.fillRect(8, 6 + bob, 16, 1);
    // Eyes
    ctx.fillStyle = '#e040fb';
    ctx.fillRect(13, 7 + bob, 2, 2); ctx.fillRect(17, 7 + bob, 2, 2);
    // Staff (arm swing)
    const armSwing = frame === 1 ? -1 : frame === 3 ? 1 : 0;
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(26, 3 + bob + armSwing, 2, 28);
    // Staff orb
    const orb = ctx.createRadialGradient(27, 3 + bob + armSwing, 0, 27, 3 + bob + armSwing, 5);
    orb.addColorStop(0, '#e1bee7');
    orb.addColorStop(0.4, '#ce93d8');
    orb.addColorStop(0.7, '#ab47bc');
    orb.addColorStop(1, '#6a1b9a');
    ctx.fillStyle = orb;
    ctx.beginPath(); ctx.arc(27, 3 + bob + armSwing, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(224,64,251,0.3)';
    ctx.beginPath(); ctx.arc(27, 3 + bob + armSwing, 7, 0, Math.PI * 2); ctx.fill();
});

// --- FAIRY ELF ---
const createFairyElfFrames = () => makeWalkFrames((ctx, frame) => {
    const bob = bodyBob(frame);
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath(); ctx.ellipse(16, 30, 8, 3, 0, 0, Math.PI * 2); ctx.fill();
    // Nature aura
    ctx.fillStyle = 'rgba(76,175,80,0.08)';
    ctx.beginPath(); ctx.arc(16, 16, 14, 0, Math.PI * 2); ctx.fill();
    // Legs (slender)
    drawLegs(ctx, frame, '#2e7d32', '#1b5e20', 12, 17, 24, 3, 7);
    // Tunic
    ctx.fillStyle = '#43a047';
    ctx.fillRect(11, 10 + bob, 10, 14);
    ctx.fillStyle = '#66bb6a';
    ctx.fillRect(12, 12 + bob, 8, 8);
    // Belt
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(11, 20 + bob, 10, 2);
    ctx.fillStyle = '#c5a059';
    ctx.fillRect(14, 20 + bob, 4, 2);
    // Head
    ctx.fillStyle = '#ffcc80';
    ctx.fillRect(12, 3 + bob, 8, 8);
    // Long hair
    ctx.fillStyle = '#ffeb3b';
    ctx.fillRect(11, 2 + bob, 10, 4);
    // Hair sway
    const hairSway = frame === 1 ? 1 : frame === 3 ? -1 : 0;
    ctx.fillRect(10, 4 + bob, 3, 8 + hairSway);
    ctx.fillRect(19, 4 + bob, 3, 8 - hairSway);
    // Pointed ears
    ctx.fillStyle = '#ffcc80';
    ctx.beginPath(); ctx.moveTo(10, 5 + bob); ctx.lineTo(5, 2 + bob); ctx.lineTo(10, 7 + bob); ctx.fill();
    ctx.beginPath(); ctx.moveTo(22, 5 + bob); ctx.lineTo(27, 2 + bob); ctx.lineTo(22, 7 + bob); ctx.fill();
    // Eyes
    ctx.fillStyle = '#4caf50';
    ctx.fillRect(13, 7 + bob, 2, 2); ctx.fillRect(17, 7 + bob, 2, 2);
    // Arm swing
    const armSwing = frame === 1 ? -2 : frame === 3 ? 2 : 0;
    // Bow
    ctx.strokeStyle = '#5d4037'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(4, 6 + bob - armSwing); ctx.quadraticCurveTo(2, 16 + bob, 4, 26 + bob + armSwing);
    ctx.stroke();
    ctx.strokeStyle = '#e0e0e0'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(4, 6 + bob - armSwing); ctx.lineTo(4, 26 + bob + armSwing); ctx.stroke();
    // Arrow
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(25, 6 + bob + armSwing, 1, 16);
    ctx.fillStyle = '#b0bec5';
    ctx.beginPath(); ctx.moveTo(25, 4 + bob + armSwing); ctx.lineTo(26, 6 + bob + armSwing); ctx.lineTo(24, 6 + bob + armSwing); ctx.fill();
    // Quiver
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(20, 8 + bob, 3, 10);
});

// --- DARK LORD ---
const createDarkLordFrames = () => makeWalkFrames((ctx, frame) => {
    const bob = bodyBob(frame);
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath(); ctx.ellipse(16, 30, 10, 3, 0, 0, Math.PI * 2); ctx.fill();
    // Power aura
    const aura = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    aura.addColorStop(0, 'rgba(255,215,0,0.15)');
    aura.addColorStop(1, 'rgba(255,215,0,0)');
    ctx.fillStyle = aura;
    ctx.fillRect(0, 0, SIZE, SIZE);
    // Royal cape sway
    const capeOffset = frame === 1 ? 2 : frame === 3 ? -2 : 0;
    ctx.fillStyle = '#4a148c';
    ctx.beginPath(); ctx.moveTo(10, 10 + bob); ctx.lineTo(3 + capeOffset, 31); ctx.lineTo(29 + capeOffset, 31); ctx.lineTo(22, 10 + bob); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#b71c1c';
    ctx.beginPath(); ctx.moveTo(12, 12 + bob); ctx.lineTo(6 + capeOffset, 29); ctx.lineTo(26 + capeOffset, 29); ctx.lineTo(20, 12 + bob); ctx.closePath(); ctx.fill();
    // Legs
    drawLegs(ctx, frame, '#212121', '#c5a059');
    // Dark plate
    ctx.fillStyle = '#212121';
    ctx.fillRect(10, 10 + bob, 12, 14);
    ctx.fillStyle = '#424242';
    ctx.fillRect(12, 12 + bob, 8, 10);
    // Chest emblem
    ctx.fillStyle = '#c5a059';
    ctx.beginPath();
    ctx.moveTo(16, 13 + bob); ctx.lineTo(19, 17 + bob); ctx.lineTo(16, 21 + bob); ctx.lineTo(13, 17 + bob);
    ctx.closePath(); ctx.fill();
    // Pauldrons
    ctx.fillStyle = '#424242';
    ctx.fillRect(6, 8 + bob, 7, 5); ctx.fillRect(19, 8 + bob, 7, 5);
    ctx.fillStyle = '#c5a059';
    ctx.fillRect(7, 9 + bob, 5, 2); ctx.fillRect(20, 9 + bob, 5, 2);
    // Head
    ctx.fillStyle = '#ffcc80';
    ctx.fillRect(12, 3 + bob, 8, 7);
    // Crown
    ctx.fillStyle = '#c5a059';
    ctx.fillRect(10, 0 + bob, 12, 4);
    ctx.fillStyle = '#ffd54f';
    ctx.beginPath();
    ctx.moveTo(10, 0 + bob); ctx.lineTo(12, -3 + bob); ctx.lineTo(14, 0 + bob);
    ctx.moveTo(14, 0 + bob); ctx.lineTo(16, -4 + bob); ctx.lineTo(18, 0 + bob);
    ctx.moveTo(18, 0 + bob); ctx.lineTo(20, -3 + bob); ctx.lineTo(22, 0 + bob);
    ctx.fill();
    ctx.fillStyle = '#e91e63';
    ctx.beginPath(); ctx.arc(16, 1 + bob, 2, 0, Math.PI * 2); ctx.fill();
    // Eyes
    ctx.fillStyle = '#ffd54f';
    ctx.fillRect(13, 6 + bob, 2, 2); ctx.fillRect(17, 6 + bob, 2, 2);
    // Arm swing
    const armSwing = frame === 1 ? -1 : frame === 3 ? 1 : 0;
    // Scepter
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(26, 4 + bob + armSwing, 2, 20);
    ctx.fillStyle = '#c5a059';
    ctx.fillRect(24, 2 + bob + armSwing, 6, 4);
    const orb = ctx.createRadialGradient(27, 2 + bob + armSwing, 0, 27, 2 + bob + armSwing, 4);
    orb.addColorStop(0, '#fff');
    orb.addColorStop(0.4, '#ffd54f');
    orb.addColorStop(1, '#c5a059');
    ctx.fillStyle = orb;
    ctx.beginPath(); ctx.arc(27, 2 + bob + armSwing, 4, 0, Math.PI * 2); ctx.fill();
    // Steed shadow
    ctx.fillStyle = 'rgba(100,0,200,0.15)';
    ctx.beginPath(); ctx.ellipse(16, 28, 12, 4, 0, 0, Math.PI * 2); ctx.fill();
});

// --- MAGIC GLADIATOR ---
const createMagicGladiatorFrames = () => makeWalkFrames((ctx, frame) => {
    const bob = bodyBob(frame);
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath(); ctx.ellipse(16, 30, 10, 3, 0, 0, Math.PI * 2); ctx.fill();
    // Energy aura
    const aura = ctx.createRadialGradient(16, 16, 0, 16, 16, 15);
    aura.addColorStop(0, 'rgba(33,150,243,0.15)');
    aura.addColorStop(0.5, 'rgba(156,39,176,0.08)');
    aura.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = aura;
    ctx.fillRect(0, 0, SIZE, SIZE);
    // Legs
    drawLegs(ctx, frame, '#283593', '#3949ab');
    // Light armor body
    ctx.fillStyle = '#1a237e';
    ctx.fillRect(10, 10 + bob, 12, 14);
    ctx.fillStyle = '#283593';
    ctx.fillRect(12, 12 + bob, 8, 10);
    // Energy core
    const core = ctx.createRadialGradient(16, 16 + bob, 0, 16, 16 + bob, 4);
    core.addColorStop(0, '#e040fb');
    core.addColorStop(0.5, '#7c4dff');
    core.addColorStop(1, '#304ffe');
    ctx.fillStyle = core;
    ctx.beginPath(); ctx.arc(16, 16 + bob, 3, 0, Math.PI * 2); ctx.fill();
    // Pauldrons
    ctx.fillStyle = '#3949ab';
    ctx.fillRect(7, 9 + bob, 5, 4); ctx.fillRect(20, 9 + bob, 5, 4);
    ctx.fillStyle = '#5c6bc0';
    ctx.fillRect(8, 10 + bob, 3, 2); ctx.fillRect(21, 10 + bob, 3, 2);
    // Head
    ctx.fillStyle = '#ffcc80';
    ctx.fillRect(12, 3 + bob, 8, 7);
    // Headband
    ctx.fillStyle = '#c5a059';
    ctx.fillRect(11, 3 + bob, 10, 2);
    ctx.fillStyle = '#7c4dff';
    ctx.fillRect(14, 2 + bob, 4, 2);
    // Eyes
    ctx.fillStyle = '#2196f3';
    ctx.fillRect(13, 6 + bob, 2, 2);
    ctx.fillStyle = '#ab47bc';
    ctx.fillRect(17, 6 + bob, 2, 2);
    // Arm swing
    const armSwing = frame === 1 ? -2 : frame === 3 ? 2 : 0;
    // Sword (right)
    ctx.fillStyle = '#b0bec5';
    ctx.fillRect(26, 4 + bob + armSwing, 2, 16);
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(26, 4 + bob + armSwing, 2, 2);
    ctx.fillStyle = '#c5a059';
    ctx.fillRect(24, 18 + bob + armSwing, 6, 2);
    ctx.fillStyle = 'rgba(124,77,255,0.3)';
    ctx.fillRect(25, 4 + bob + armSwing, 4, 16);
    // Magic orb (left)
    const leftOrb = ctx.createRadialGradient(5, 16 + bob - armSwing, 0, 5, 16 + bob - armSwing, 4);
    leftOrb.addColorStop(0, '#64b5f6');
    leftOrb.addColorStop(0.5, '#1e88e5');
    leftOrb.addColorStop(1, '#0d47a1');
    ctx.fillStyle = leftOrb;
    ctx.beginPath(); ctx.arc(5, 16 + bob - armSwing, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(100,181,246,0.3)';
    ctx.beginPath(); ctx.arc(5, 16 + bob - armSwing, 6, 0, Math.PI * 2); ctx.fill();
});

const createCreep = () => makeSprite(ctx => {
    ctx.fillStyle = '#7b1fa2';
    ctx.beginPath(); ctx.arc(16, 18, 11, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(11, 14, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(21, 14, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f44336';
    ctx.beginPath(); ctx.arc(12, 14, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(22, 14, 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#4a148c';
    ctx.beginPath(); ctx.arc(16, 22, 5, 0, Math.PI); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.moveTo(13, 22); ctx.lineTo(15, 26); ctx.lineTo(17, 22); ctx.fill();
    ctx.beginPath(); ctx.moveTo(15, 22); ctx.lineTo(17, 26); ctx.lineTo(19, 22); ctx.fill();
});

const createBoss = () => makeSprite(ctx => {
    ctx.fillStyle = '#b71c1c';
    ctx.beginPath(); ctx.arc(16, 18, 13, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#4e342e';
    ctx.beginPath(); ctx.moveTo(6, 10); ctx.lineTo(2, 0); ctx.lineTo(10, 8); ctx.fill();
    ctx.beginPath(); ctx.moveTo(26, 10); ctx.lineTo(30, 0); ctx.lineTo(22, 8); ctx.fill();
    ctx.fillStyle = '#ffeb3b';
    ctx.beginPath(); ctx.arc(11, 14, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(21, 14, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(11, 14, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(21, 14, 2, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(8, 24); ctx.lineTo(12, 22); ctx.lineTo(16, 26); ctx.lineTo(20, 22); ctx.lineTo(24, 24);
    ctx.stroke();
});

const createBot = () => makeSprite(ctx => {
    ctx.fillStyle = '#5c6bc0';
    ctx.beginPath(); ctx.moveTo(16, 10); ctx.lineTo(26, 30); ctx.lineTo(6, 30); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffcc80';
    ctx.beginPath(); ctx.arc(16, 10, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#3f51b5';
    ctx.beginPath(); ctx.arc(16, 8, 7, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(14, 10, 1, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(18, 10, 1, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffd54f';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('!', 24, 10);
});

const createFireball = () => makeSprite(ctx => {
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 14);
    grad.addColorStop(0, '#fff');
    grad.addColorStop(0.3, '#ffeb3b');
    grad.addColorStop(0.6, '#ff9800');
    grad.addColorStop(1, '#f44336');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(16, 16, 12, 0, Math.PI * 2); ctx.fill();
});

// --- ENEMY SPRITES ---
const createSpider = () => makeSprite(ctx => {
    ctx.fillStyle = '#4a2810';
    ctx.beginPath(); ctx.ellipse(16, 18, 8, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#3e2723';
    ctx.beginPath(); ctx.arc(16, 12, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f44336';
    ctx.beginPath(); ctx.arc(14, 11, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(18, 11, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#3e2723'; ctx.lineWidth = 1.5;
    for (let i = 0; i < 4; i++) {
        const a = (i * 30 + 15) * Math.PI / 180;
        ctx.beginPath(); ctx.moveTo(16 - 7, 16); ctx.lineTo(16 - 14 * Math.cos(a), 16 - 10 * Math.sin(a)); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(16 + 7, 16); ctx.lineTo(16 + 14 * Math.cos(a), 16 - 10 * Math.sin(a)); ctx.stroke();
    }
});

const createGoblin = () => makeSprite(ctx => {
    ctx.fillStyle = '#558b2f';
    ctx.fillRect(11, 12, 10, 12);
    ctx.fillStyle = '#689f38';
    ctx.fillRect(12, 4, 8, 8);
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(14, 7, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(18, 7, 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(14, 7, 1, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(18, 7, 1, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#689f38';
    ctx.beginPath(); ctx.moveTo(10, 5); ctx.lineTo(6, 1); ctx.lineTo(12, 5); ctx.fill();
    ctx.beginPath(); ctx.moveTo(22, 5); ctx.lineTo(26, 1); ctx.lineTo(20, 5); ctx.fill();
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(22, 14, 6, 2);
    ctx.fillStyle = '#4a332a';
    ctx.fillRect(11, 24, 4, 8); ctx.fillRect(17, 24, 4, 8);
});

const createSkeleton = () => makeSprite(ctx => {
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(12, 12, 8, 10);
    ctx.fillStyle = '#eeeeee';
    ctx.fillRect(13, 4, 6, 7);
    ctx.fillStyle = '#000';
    ctx.fillRect(14, 5, 2, 2); ctx.fillRect(17, 5, 2, 2);
    ctx.fillRect(15, 9, 3, 1);
    ctx.strokeStyle = '#bdbdbd'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(12, 14); ctx.lineTo(6, 20); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(20, 14); ctx.lineTo(26, 20); ctx.stroke();
    ctx.fillStyle = '#bdbdbd';
    ctx.fillRect(13, 22, 3, 8); ctx.fillRect(17, 22, 3, 8);
    ctx.fillStyle = '#757575';
    ctx.fillRect(26, 10, 2, 14);
});

const createDarkWizard = () => makeSprite(ctx => {
    ctx.fillStyle = '#6a1b9a';
    ctx.beginPath(); ctx.moveTo(16, 0); ctx.lineTo(8, 12); ctx.lineTo(24, 12); ctx.fill();
    ctx.fillStyle = '#4a148c';
    ctx.fillRect(10, 12, 12, 14);
    ctx.fillStyle = '#ffcc80';
    ctx.fillRect(13, 6, 6, 6);
    ctx.fillStyle = '#ce93d8';
    ctx.beginPath(); ctx.arc(14, 8, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(18, 8, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#4a148c';
    ctx.fillRect(12, 24, 4, 8); ctx.fillRect(16, 24, 4, 8);
    ctx.fillStyle = '#e040fb';
    ctx.beginPath(); ctx.arc(6, 22, 3, 0, Math.PI * 2); ctx.fill();
});

const createElf = () => makeSprite(ctx => {
    ctx.fillStyle = '#66bb6a';
    ctx.fillRect(11, 12, 10, 12);
    ctx.fillStyle = '#ffcc80';
    ctx.fillRect(13, 4, 6, 7);
    ctx.fillStyle = '#81c784';
    ctx.beginPath(); ctx.moveTo(10, 6); ctx.lineTo(6, 3); ctx.lineTo(12, 6); ctx.fill();
    ctx.beginPath(); ctx.moveTo(22, 6); ctx.lineTo(26, 3); ctx.lineTo(20, 6); ctx.fill();
    ctx.fillStyle = '#1b5e20';
    ctx.beginPath(); ctx.arc(15, 7, 1, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(17, 7, 1, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(22, 8, 2, 18);
    ctx.fillStyle = '#66bb6a';
    ctx.fillRect(12, 24, 4, 8); ctx.fillRect(16, 24, 4, 8);
});

const createGolem = () => makeSprite(ctx => {
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(8, 8, 16, 18);
    ctx.fillStyle = '#795548';
    ctx.fillRect(10, 4, 12, 8);
    ctx.fillStyle = '#ffeb3b';
    ctx.beginPath(); ctx.arc(13, 7, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(19, 7, 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#4e342e';
    ctx.fillRect(4, 10, 5, 12); ctx.fillRect(23, 10, 5, 12);
    ctx.fillStyle = '#6d4c41';
    ctx.fillRect(10, 26, 6, 6); ctx.fillRect(16, 26, 6, 6);
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(10, 10, 3, 2); ctx.fillRect(19, 10, 3, 2);
});

const createDragon = () => makeSprite(ctx => {
    ctx.fillStyle = '#b71c1c';
    ctx.fillRect(10, 12, 12, 14);
    ctx.fillStyle = '#c62828';
    ctx.fillRect(12, 4, 8, 8);
    ctx.fillStyle = '#ffeb3b';
    ctx.beginPath(); ctx.arc(14, 7, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(18, 7, 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#e53935';
    ctx.beginPath(); ctx.moveTo(10, 5); ctx.lineTo(4, 0); ctx.lineTo(12, 6); ctx.fill();
    ctx.beginPath(); ctx.moveTo(22, 5); ctx.lineTo(28, 0); ctx.lineTo(20, 6); ctx.fill();
    ctx.fillStyle = '#d32f2f';
    ctx.beginPath(); ctx.moveTo(6, 14); ctx.lineTo(0, 8); ctx.lineTo(0, 20); ctx.fill();
    ctx.beginPath(); ctx.moveTo(26, 14); ctx.lineTo(32, 8); ctx.lineTo(32, 20); ctx.fill();
    ctx.fillStyle = '#ff8a65';
    ctx.fillRect(14, 14, 4, 6);
    ctx.fillStyle = '#8e0000';
    ctx.fillRect(12, 26, 4, 6); ctx.fillRect(16, 26, 4, 6);
});

const createDemon = () => makeSprite(ctx => {
    ctx.fillStyle = '#880e4f';
    ctx.fillRect(10, 10, 12, 16);
    ctx.fillStyle = '#ad1457';
    ctx.fillRect(12, 4, 8, 8);
    ctx.fillStyle = '#c62828';
    ctx.beginPath(); ctx.moveTo(12, 4); ctx.lineTo(8, -2); ctx.lineTo(14, 4); ctx.fill();
    ctx.beginPath(); ctx.moveTo(20, 4); ctx.lineTo(24, -2); ctx.lineTo(18, 4); ctx.fill();
    ctx.fillStyle = '#ff1744';
    ctx.beginPath(); ctx.arc(14, 7, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(18, 7, 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#880e4f';
    ctx.fillRect(4, 12, 6, 4); ctx.fillRect(22, 12, 6, 4);
    ctx.fillStyle = '#4a0e2e';
    ctx.fillRect(12, 26, 4, 6); ctx.fillRect(16, 26, 4, 6);
    ctx.fillStyle = 'rgba(255,23,68,0.15)';
    ctx.beginPath(); ctx.arc(16, 16, 14, 0, Math.PI * 2); ctx.fill();
});

const createOrc = () => makeSprite(ctx => {
    ctx.fillStyle = '#33691e';
    ctx.fillRect(9, 10, 14, 14);
    ctx.fillStyle = '#558b2f';
    ctx.fillRect(11, 2, 10, 9);
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(14, 6, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(18, 6, 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(14, 6, 1, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(18, 6, 1, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.moveTo(13, 10); ctx.lineTo(14, 8); ctx.lineTo(15, 10); ctx.fill();
    ctx.beginPath(); ctx.moveTo(17, 10); ctx.lineTo(18, 8); ctx.lineTo(19, 10); ctx.fill();
    ctx.fillStyle = '#795548';
    ctx.fillRect(4, 8, 6, 3); ctx.fillRect(23, 12, 5, 10);
    ctx.fillStyle = '#33691e';
    ctx.fillRect(11, 24, 5, 8); ctx.fillRect(16, 24, 5, 8);
});

const createWolf = () => makeSprite(ctx => {
    ctx.fillStyle = '#616161';
    ctx.beginPath(); ctx.ellipse(16, 20, 10, 7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#757575';
    ctx.fillRect(10, 10, 10, 8);
    ctx.fillStyle = '#424242';
    ctx.beginPath(); ctx.moveTo(10, 10); ctx.lineTo(6, 4); ctx.lineTo(12, 10); ctx.fill();
    ctx.beginPath(); ctx.moveTo(20, 10); ctx.lineTo(24, 4); ctx.lineTo(18, 10); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(13, 13, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(17, 13, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(12, 16, 6, 2);
    ctx.fillStyle = '#616161';
    ctx.fillRect(10, 26, 3, 6); ctx.fillRect(19, 26, 3, 6);
});

const createBat = () => makeSprite(ctx => {
    ctx.fillStyle = '#311b92';
    ctx.beginPath(); ctx.arc(16, 16, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#4527a0';
    ctx.beginPath(); ctx.moveTo(11, 14); ctx.lineTo(0, 6); ctx.lineTo(4, 18); ctx.lineTo(11, 18); ctx.fill();
    ctx.beginPath(); ctx.moveTo(21, 14); ctx.lineTo(32, 6); ctx.lineTo(28, 18); ctx.lineTo(21, 18); ctx.fill();
    ctx.fillStyle = '#ff1744';
    ctx.beginPath(); ctx.arc(14, 14, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(18, 14, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.moveTo(14, 18); ctx.lineTo(15, 21); ctx.lineTo(16, 18); ctx.fill();
    ctx.beginPath(); ctx.moveTo(16, 18); ctx.lineTo(17, 21); ctx.lineTo(18, 18); ctx.fill();
});

const createSerpent = () => makeSprite(ctx => {
    ctx.fillStyle = '#1b5e20';
    ctx.beginPath();
    ctx.moveTo(8, 28); ctx.bezierCurveTo(4, 20, 12, 12, 16, 8);
    ctx.bezierCurveTo(20, 4, 28, 8, 24, 16);
    ctx.bezierCurveTo(20, 24, 12, 20, 8, 28);
    ctx.fill();
    ctx.fillStyle = '#2e7d32';
    ctx.beginPath(); ctx.arc(16, 8, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffeb3b';
    ctx.beginPath(); ctx.arc(14, 7, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(18, 7, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f44336';
    ctx.beginPath(); ctx.moveTo(16, 12); ctx.lineTo(14, 16); ctx.lineTo(18, 16); ctx.fill();
});

const createUndeadKnight = () => makeSprite(ctx => {
    ctx.fillStyle = '#37474f';
    ctx.fillRect(10, 10, 12, 14);
    ctx.fillStyle = '#455a64';
    ctx.fillRect(12, 2, 8, 9);
    ctx.fillStyle = '#90a4ae';
    ctx.fillRect(13, 3, 6, 7);
    ctx.fillStyle = '#f44336';
    ctx.beginPath(); ctx.arc(15, 6, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(18, 6, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#546e7a';
    ctx.fillRect(6, 10, 5, 10);
    ctx.fillRect(22, 12, 6, 3);
    ctx.fillStyle = '#37474f';
    ctx.fillRect(12, 24, 4, 8); ctx.fillRect(16, 24, 4, 8);
    ctx.fillStyle = '#78909c';
    ctx.fillRect(28, 6, 2, 16);
    ctx.fillStyle = '#90a4ae';
    ctx.fillRect(26, 4, 6, 3);
});

const createShadow = () => makeSprite(ctx => {
    ctx.fillStyle = 'rgba(33,33,33,0.8)';
    ctx.beginPath(); ctx.arc(16, 16, 12, 0, Math.PI * 2); ctx.fill();
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 12);
    grad.addColorStop(0, 'rgba(100,100,100,0.6)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(16, 16, 12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#e040fb';
    ctx.beginPath(); ctx.arc(13, 14, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(19, 14, 2, 0, Math.PI * 2); ctx.fill();
});

const createElemental = () => makeSprite(ctx => {
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 14);
    grad.addColorStop(0, '#fff');
    grad.addColorStop(0.3, '#4fc3f7');
    grad.addColorStop(0.6, '#0288d1');
    grad.addColorStop(1, '#01579b');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(16, 16, 12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(13, 13, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(19, 13, 2, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#4fc3f7'; ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
        const a = (i * 60) * Math.PI / 180;
        ctx.beginPath();
        ctx.moveTo(16 + Math.cos(a) * 10, 16 + Math.sin(a) * 10);
        ctx.lineTo(16 + Math.cos(a) * 16, 16 + Math.sin(a) * 16);
        ctx.stroke();
    }
});


// VANGUARD - Heavy plate armor with tower shield
const createVanguard = () => makeSprite(ctx => {
    // Tower shield (left side)
    ctx.fillStyle = '#4488cc';
    ctx.fillRect(3, 8, 10, 20);
    ctx.fillStyle = '#336699';
    ctx.fillRect(5, 10, 6, 16);
    ctx.fillStyle = '#aaddff';
    ctx.fillRect(6, 14, 4, 4); // shield emblem
    ctx.strokeStyle = '#224466';
    ctx.lineWidth = 1;
    ctx.strokeRect(3, 8, 10, 20);
    // Heavy plate body
    ctx.fillStyle = '#607d8b';
    ctx.fillRect(12, 10, 14, 16);
    // Pauldrons
    ctx.fillStyle = '#78909c';
    ctx.fillRect(10, 8, 6, 5);
    ctx.fillRect(22, 8, 6, 5);
    // Head (helmet visor)
    ctx.fillStyle = '#ffcc80';
    ctx.fillRect(14, 2, 8, 6);
    ctx.fillStyle = '#546e7a';
    ctx.fillRect(12, 0, 12, 5);
    ctx.fillStyle = '#37474f';
    ctx.fillRect(14, 3, 8, 2);
    // Legs
    ctx.fillStyle = '#455a64';
    ctx.fillRect(14, 26, 4, 6);
    ctx.fillRect(20, 26, 4, 6);
    // Sword (right hand)
    ctx.fillStyle = '#b0bec5';
    ctx.fillRect(27, 4, 2, 16);
    ctx.fillStyle = '#ffd54f';
    ctx.fillRect(26, 18, 4, 3);
});

// NIGHTREAVER - Hooded assassin in dark cloak
const createNightreaver = () => makeSprite(ctx => {
    // Dark cloak body
    ctx.fillStyle = '#2d1b4e';
    ctx.beginPath();
    ctx.moveTo(16, 8); ctx.lineTo(28, 30); ctx.lineTo(4, 30);
    ctx.closePath(); ctx.fill();
    // Inner cloak
    ctx.fillStyle = '#1a0e33';
    ctx.beginPath();
    ctx.moveTo(16, 12); ctx.lineTo(24, 28); ctx.lineTo(8, 28);
    ctx.closePath(); ctx.fill();
    // Hood
    ctx.fillStyle = '#2d1b4e';
    ctx.beginPath(); ctx.arc(16, 8, 8, Math.PI, 0); ctx.fill();
    ctx.fillRect(8, 4, 16, 8);
    // Face shadow (only eyes visible)
    ctx.fillStyle = '#0a0618';
    ctx.beginPath(); ctx.arc(16, 8, 5, 0, Math.PI * 2); ctx.fill();
    // Glowing eyes
    ctx.fillStyle = '#aa44ff';
    ctx.fillRect(12, 7, 3, 2);
    ctx.fillRect(17, 7, 3, 2);
    // Daggers
    ctx.fillStyle = '#b0bec5';
    ctx.fillRect(4, 16, 2, 10);
    ctx.fillRect(26, 16, 2, 10);
    ctx.fillStyle = '#7c4dff';
    ctx.fillRect(3, 25, 4, 2); // poison glow left
    ctx.fillRect(25, 25, 4, 2); // poison glow right
    // Shadowy aura
    const aura = ctx.createRadialGradient(16, 18, 5, 16, 18, 16);
    aura.addColorStop(0, 'rgba(45, 27, 78, 0)');
    aura.addColorStop(1, 'rgba(45, 27, 78, 0.15)');
    ctx.fillStyle = aura;
    ctx.fillRect(0, 0, SIZE, SIZE);
});

// ARCANIST - Robed mage with arcane glow
const createArcanist = () => makeSprite(ctx => {
    // Arcane glow aura
    const aura = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    aura.addColorStop(0, 'rgba(170, 136, 255, 0.15)');
    aura.addColorStop(1, 'rgba(170, 136, 255, 0)');
    ctx.fillStyle = aura;
    ctx.fillRect(0, 0, SIZE, SIZE);
    // Robe body
    ctx.fillStyle = '#1a237e';
    ctx.beginPath();
    ctx.moveTo(10, 12); ctx.lineTo(6, 30); ctx.lineTo(26, 30); ctx.lineTo(22, 12);
    ctx.closePath(); ctx.fill();
    // Robe sash
    ctx.fillStyle = '#c5a059';
    ctx.fillRect(14, 12, 4, 18);
    // Head
    ctx.fillStyle = '#ffcc80';
    ctx.fillRect(12, 4, 8, 7);
    // Wizard hat
    ctx.fillStyle = '#0d1466';
    ctx.beginPath();
    ctx.moveTo(16, -2); ctx.lineTo(24, 6); ctx.lineTo(8, 6);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#c5a059';
    ctx.fillRect(7, 5, 18, 2); // hat brim band
    // Eyes
    ctx.fillStyle = '#4fc3f7';
    ctx.fillRect(13, 7, 2, 2);
    ctx.fillRect(17, 7, 2, 2);
    // Staff
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(26, 2, 2, 28);
    // Staff orb
    const orbGrad = ctx.createRadialGradient(27, 2, 0, 27, 2, 4);
    orbGrad.addColorStop(0, '#e1bee7');
    orbGrad.addColorStop(0.5, '#aa88ff');
    orbGrad.addColorStop(1, '#4a148c');
    ctx.fillStyle = orbGrad;
    ctx.beginPath(); ctx.arc(27, 2, 4, 0, Math.PI * 2); ctx.fill();
});

// SOUL ENGINEER - Tech-armored with glowing constructs
const createSoulEngineer = () => makeSprite(ctx => {
    // Tech body armor
    ctx.fillStyle = '#37474f';
    ctx.fillRect(10, 10, 12, 14);
    // Chest plate with soul core
    ctx.fillStyle = '#546e7a';
    ctx.fillRect(12, 12, 8, 10);
    const coreGrad = ctx.createRadialGradient(16, 16, 0, 16, 16, 4);
    coreGrad.addColorStop(0, '#ff8844');
    coreGrad.addColorStop(0.5, '#ff6600');
    coreGrad.addColorStop(1, '#cc4400');
    ctx.fillStyle = coreGrad;
    ctx.beginPath(); ctx.arc(16, 16, 3, 0, Math.PI * 2); ctx.fill();
    // Head (goggles)
    ctx.fillStyle = '#ffcc80';
    ctx.fillRect(12, 2, 8, 8);
    ctx.fillStyle = '#455a64';
    ctx.fillRect(10, 4, 12, 4);
    // Goggle lenses
    ctx.fillStyle = '#4fc3f7';
    ctx.fillRect(11, 5, 4, 2);
    ctx.fillStyle = '#ff8844';
    ctx.fillRect(17, 5, 4, 2);
    // Tech pauldron
    ctx.fillStyle = '#78909c';
    ctx.fillRect(6, 9, 5, 4);
    ctx.fillStyle = '#ffab40';
    ctx.fillRect(7, 10, 3, 2);
    // Arm cannon (right)
    ctx.fillStyle = '#546e7a';
    ctx.fillRect(22, 12, 6, 4);
    ctx.fillStyle = '#ff6600';
    ctx.fillRect(27, 13, 3, 2); // barrel glow
    // Tool belt
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(10, 22, 12, 3);
    ctx.fillStyle = '#ffcc44';
    ctx.fillRect(12, 22, 2, 2);
    ctx.fillStyle = '#66bb6a';
    ctx.fillRect(16, 22, 2, 2);
    ctx.fillStyle = '#42a5f5';
    ctx.fillRect(20, 22, 2, 2);
    // Legs
    ctx.fillStyle = '#37474f';
    ctx.fillRect(12, 24, 4, 8);
    ctx.fillRect(18, 24, 4, 8);
    // Tech glow effect
    ctx.fillStyle = 'rgba(255, 136, 68, 0.1)';
    ctx.beginPath(); ctx.arc(16, 16, 14, 0, Math.PI * 2); ctx.fill();
});

export { SIZE, makeSprite };

// Sprite cache - generated once at runtime (placed after all creators)
export const SPRITE_GENERATORS = {
    [TILES.GRASS]: createGrass,
    [TILES.GRASS_VARIANT]: createGrassVariant,
    [TILES.PATH]: createPath,
    [TILES.WATER]: createWater,
    [TILES.MOUNTAIN]: createMountain,
    [TILES.TREE]: createTree,
    [TILES.HOUSE]: createHouse,
    [TILES.SHOP]: createShop,
    [TILES.CRYSTAL]: createCrystal,
    [TILES.FLOWER]: createFlower,
    [TILES.BUSH]: createBush,
    [TILES.TELEPORT]: createTeleport,
    [TILES.FENCE]: createFence,
    [TILES.SIGN]: createSign,
    [TILES.MUSHROOM]: createMushroom,
    [TILES.WATER_LILY]: createLily,
    [TILES.BOT]: createBot,
    [TILES.CREEP]: createCreep,
    [TILES.BOSS]: createBoss,
    // Enemy types (by tile ID)
    [TILES.SPIDER]: createSpider,
    [TILES.GOBLIN]: createGoblin,
    [TILES.SKELETON]: createSkeleton,
    [TILES.DARK_WIZARD]: createDarkWizard,
    [TILES.ELF]: createElf,
    [TILES.GOLEM]: createGolem,
    [TILES.DRAGON]: createDragon,
    [TILES.DEMON]: createDemon,
    [TILES.ORC]: createOrc,
    [TILES.WOLF]: createWolf,
    [TILES.BAT]: createBat,
    [TILES.SERPENT]: createSerpent,
    [TILES.UNDEAD_KNIGHT]: createUndeadKnight,
    [TILES.SHADOW]: createShadow,
    [TILES.ELEMENTAL]: createElemental,
    // Enemy types (by visual name for entity rendering)
    'spider': createSpider,
    'goblin': createGoblin,
    'skeleton': createSkeleton,
    'dark_wizard': createDarkWizard,
    'elf': createElf,
    'golem': createGolem,
    'dragon': createDragon,
    'demon': createDemon,
    'orc': createOrc,
    'wolf': createWolf,
    'bat': createBat,
    'serpent': createSerpent,
    'undead_knight': createUndeadKnight,
    'shadow': createShadow,
    'elemental': createElemental,
    'player': () => createPlayerFrames()[0],
    'fireball': createFireball,
    // Eclipse class sprites
    'vanguard': createVanguard,
    'nightreaver': createNightreaver,
    'arcanist': createArcanist,
    'soul_engineer': createSoulEngineer,
    // MU Online class sprites
    'dark_knight': () => createDarkKnightFrames()[0],
    'dark_wizard': () => createDarkWizardFrames()[0],
    'fairy_elf': () => createFairyElfFrames()[0],
    'dark_lord': () => createDarkLordFrames()[0],
    'magic_gladiator': () => createMagicGladiatorFrames()[0],
    // Farm & Defense sprites
    'farm_soil': createFarmSoil,
    'defense_slot': createDefenseSlot,
    'peashooter': createPeashooter,
    'sunflower': createSunflower,
    'wallnut': createWallnut,
    'snow_pea': createSnowPea,
    'cherry_bomb': createCherryBomb,
    'repeater': createRepeaterSprite,
    'chomper': createChomper,
    'torchwood': createTorchwood,
    // Zombie sprites
    'zombie_basic': createZombieBasic,
    'zombie_cone': createZombieCone,
    'zombie_bucket': createZombieBucket,
    'zombie_flag': createZombieFlag,
    'zombie_pole': createZombiePole,
    'zombie_football': createZombieFootball,
    'zombie_screen': createZombieScreen,
    'zombie_garg': createZombieGarg,
    'zombie_imp': createZombieImp,
    // Projectiles
    'pea_projectile': createPeaProjectile,
    'snow_pea_projectile': createSnowPeaProjectile,
    'fire_pea_projectile': createFirePeaProjectile,
};

// Walk animation frame generators (returns array of 4 frames)
export const WALK_FRAME_GENERATORS = {
    'player': createPlayerFrames,
    'dark_knight': createDarkKnightFrames,
    'dark_wizard': createDarkWizardFrames,
    'fairy_elf': createFairyElfFrames,
    'dark_lord': createDarkLordFrames,
    'magic_gladiator': createMagicGladiatorFrames,
};
