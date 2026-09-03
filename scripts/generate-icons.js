const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Ensure frontend/icons directory exists
const iconsDir = path.join(__dirname, '../frontend/icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

// CRC32 table & function
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
        c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[n] = c;
}

function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
        crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
    const lenBuf = Buffer.alloc(4);
    lenBuf.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const crcVal = crc32(Buffer.concat([typeBuf, data]));
    crcBuf.writeUInt32BE(crcVal, 0);
    return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function generatePNG(width, height, pixelFn) {
    const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    
    // IHDR
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(width, 0);
    ihdr.writeUInt32BE(height, 4);
    ihdr[8] = 8;  // bit depth
    ihdr[9] = 6;  // RGBA
    ihdr[10] = 0; // compression
    ihdr[11] = 0; // filter
    ihdr[12] = 0; // interlace
    const ihdrChunk = createChunk('IHDR', ihdr);

    // IDAT
    const rawData = Buffer.alloc(height * (width * 4 + 1));
    let offset = 0;
    for (let y = 0; y < height; y++) {
        rawData[offset++] = 0; // no filter byte
        for (let x = 0; x < width; x++) {
            const rgba = pixelFn(x, y, width, height);
            rawData[offset++] = rgba[0]; // R
            rawData[offset++] = rgba[1]; // G
            rawData[offset++] = rgba[2]; // B
            rawData[offset++] = rgba[3]; // A
        }
    }
    const compressed = zlib.deflateSync(rawData);
    const idatChunk = createChunk('IDAT', compressed);

    // IEND
    const iendChunk = createChunk('IEND', Buffer.alloc(0));

    return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Icon Pixel Drawing Logic for SKILLNEX (Gradient indigo-cyan background with glowing 'S' / geometric brain emblem)
function drawSkillnexIcon(x, y, w, h, isMaskable = false, isBadge = false) {
    const cx = w / 2;
    const cy = h / 2;
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (isBadge) {
        // Monochrome notification badge (white symbol on transparent background)
        const radius = w * 0.4;
        if (dist <= radius) {
            // Draw sleek 'S' inner badge shape
            const normX = dx / radius;
            const normY = dy / radius;
            const inRing = (dist > radius * 0.5 && dist <= radius);
            const isLeftArc = normX < 0 && normY < 0;
            const isRightArc = normX > 0 && normY > 0;
            const isCenterBar = Math.abs(normY + normX * 0.5) < 0.25;
            if (inRing || isCenterBar) {
                return [255, 255, 255, 255];
            }
        }
        return [0, 0, 0, 0];
    }

    const margin = isMaskable ? 0 : w * 0.05;
    const cornerRadius = isMaskable ? 0 : w * 0.22;
    
    // Check rounded rectangle bounds for standard icon
    if (!isMaskable) {
        const rx = Math.max(0, Math.abs(dx) - (w / 2 - cornerRadius - margin));
        const ry = Math.max(0, Math.abs(dy) - (h / 2 - cornerRadius - margin));
        if (rx * rx + ry * ry > cornerRadius * cornerRadius) {
            return [0, 0, 0, 0]; // Transparent background outside corners
        }
    }

    // Radial + linear gradient from #4f46e5 (Indigo) to #06b6d4 (Cyan) with deep slate core
    const t = (x + y) / (w + h);
    let r = Math.round(15 + t * (79 - 15));
    let g = Math.round(23 + t * (70 - 23));
    let b = Math.round(42 + t * (229 - 42));

    // Vibrant overlay gradient
    const tGrad = (y / h);
    r = Math.round(r * 0.3 + (99 * (1 - tGrad) + 6 * tGrad) * 0.7);
    g = Math.round(g * 0.3 + (102 * (1 - tGrad) + 182 * tGrad) * 0.7);
    b = Math.round(b * 0.3 + (241 * (1 - tGrad) + 212 * tGrad) * 0.7);

    // Glowing core circle
    const glowRadius = w * 0.38;
    if (dist < glowRadius) {
        const glowFactor = 1 - (dist / glowRadius);
        r = Math.min(255, Math.round(r + glowFactor * 60));
        g = Math.min(255, Math.round(g + glowFactor * 90));
        b = Math.min(255, Math.round(b + glowFactor * 120));
    }

    // Outer Orbit Ring
    const ringInner = w * 0.28;
    const ringOuter = w * 0.33;
    const angle = Math.atan2(dy, dx);
    const ringMask = (dist >= ringInner && dist <= ringOuter);

    // Draw Emblem (NEX Node + Orbit Dots)
    if (ringMask) {
        const alpha = Math.sin(angle * 3) * 0.5 + 0.5;
        r = Math.min(255, Math.round(r + alpha * 100));
        g = Math.min(255, Math.round(g + alpha * 200));
        b = 255;
    }

    // Center Emblem: Diamond / Brain Node shape
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const diamondSize = w * 0.16;
    if (absX + absY <= diamondSize) {
        r = 255;
        g = 255;
        b = 255;
    }

    // 4 Satellite Orbital Nodes
    const nodeDist = w * 0.305;
    const nodeRadius = w * 0.035;
    const nodes = [
        [cx + nodeDist * Math.cos(0), cy + nodeDist * Math.sin(0)],
        [cx + nodeDist * Math.cos(Math.PI / 2), cy + nodeDist * Math.sin(Math.PI / 2)],
        [cx + nodeDist * Math.cos(Math.PI), cy + nodeDist * Math.sin(Math.PI)],
        [cx + nodeDist * Math.cos(3 * Math.PI / 2), cy + nodeDist * Math.sin(3 * Math.PI / 2)]
    ];

    for (const [nx, ny] of nodes) {
        const ndx = x - nx;
        const ndy = y - ny;
        if (ndx * ndx + ndy * ndy <= nodeRadius * nodeRadius) {
            r = 56;
            g = 189;
            b = 248; // Sky blue node
            break;
        }
    }

    return [r, g, b, 255];
}

// Generate all icons
console.log("🎨 Generating SKILLNEX PWA icons...");

const iconsToGenerate = [
    { name: 'icon-192.png', width: 192, height: 192, fn: (x, y, w, h) => drawSkillnexIcon(x, y, w, h, false, false) },
    { name: 'icon-512.png', width: 512, height: 512, fn: (x, y, w, h) => drawSkillnexIcon(x, y, w, h, false, false) },
    { name: 'icon-maskable-192.png', width: 192, height: 192, fn: (x, y, w, h) => drawSkillnexIcon(x, y, w, h, true, false) },
    { name: 'icon-maskable-512.png', width: 512, height: 512, fn: (x, y, w, h) => drawSkillnexIcon(x, y, w, h, true, false) },
    { name: 'apple-touch-icon.png', width: 180, height: 180, fn: (x, y, w, h) => drawSkillnexIcon(x, y, w, h, true, false) },
    { name: 'badge-96.png', width: 96, height: 96, fn: (x, y, w, h) => drawSkillnexIcon(x, y, w, h, false, true) },
    { name: 'favicon.png', width: 64, height: 64, fn: (x, y, w, h) => drawSkillnexIcon(x, y, w, h, false, false) }
];

for (const icon of iconsToGenerate) {
    const filePath = path.join(iconsDir, icon.name);
    const buf = generatePNG(icon.width, icon.height, icon.fn);
    fs.writeFileSync(filePath, buf);
    console.log(`  ✓ Generated ${icon.name} (${icon.width}x${icon.height})`);
}

// Also write SVG version for scalable display
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4f46e5" />
      <stop offset="50%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#6366f1" stop-opacity="0" />
    </radialGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#4f46e5" flood-opacity="0.5"/>
    </filter>
  </defs>
  
  <!-- Background Card -->
  <rect x="32" y="32" width="448" height="448" rx="96" fill="url(#bgGrad)" filter="url(#shadow)" />
  
  <!-- Glowing Core -->
  <circle cx="256" cy="256" r="160" fill="url(#glow)" />
  
  <!-- Outer Orbit Ring -->
  <circle cx="256" cy="256" r="140" fill="none" stroke="#ffffff" stroke-opacity="0.3" stroke-width="6" stroke-dasharray="16 12" />
  
  <!-- Inner Orbit Ring -->
  <circle cx="256" cy="256" r="90" fill="none" stroke="#38bdf8" stroke-width="8" />
  
  <!-- Central Diamond Core -->
  <polygon points="256,186 326,256 256,326 186,256" fill="#ffffff" />
  <polygon points="256,216 296,256 256,296 216,256" fill="#6366f1" />
  
  <!-- Orbital Nodes -->
  <circle cx="256" cy="116" r="14" fill="#38bdf8" />
  <circle cx="396" cy="256" r="14" fill="#a855f7" />
  <circle cx="256" cy="396" r="14" fill="#34d399" />
  <circle cx="116" cy="256" r="14" fill="#fbbf24" />
</svg>`;

fs.writeFileSync(path.join(iconsDir, 'icon.svg'), svgContent);
console.log("  ✓ Generated icon.svg");
console.log("🎉 All icons created successfully!");
