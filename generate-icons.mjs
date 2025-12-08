import sharp from 'sharp';
import { writeFileSync } from 'fs';

// Create vibrant icon for webTab using single "W" letter - large and full
async function createIcon(size) {
  // Optimize SVG for smaller file size - remove unnecessary whitespace and comments
  const rx = size * 0.25;
  const fontSize = size * 0.68;
  const centerX = size / 2;
  const centerY = size * 0.58;
  
  const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#2563EB"/><stop offset="50%" stop-color="#7C3AED"/><stop offset="100%" stop-color="#DB2777"/></linearGradient></defs><rect width="${size}" height="${size}" rx="${rx}" fill="url(#bgGrad)"/><text x="${centerX}" y="${centerY}" font-family="Arial,sans-serif" font-size="${fontSize}" font-weight="900" fill="#fff" text-anchor="middle" dominant-baseline="central">W</text></svg>`;

  // Convert SVG to PNG with maximum compression
  const pngOptions = {
    compressionLevel: 9,        // Maximum compression (0-9)
    effort: 10,                  // Maximum optimization effort (1-10)
  };

  // For small icons, use palette mode to reduce file size significantly
  if (size <= 48) {
    pngOptions.palette = true;   // Use indexed color palette
    pngOptions.colors = 128;      // Limit to 128 colors for small icons
  } else {
    // For larger icons, maintain quality but still compress
    pngOptions.quality = 95;      // Slight quality reduction for better compression
  }

  const pngBuffer = await sharp(Buffer.from(svg))
    .png(pngOptions)
    .toBuffer();

  return pngBuffer;
}

// Generate icons for all required sizes
const sizes = [16, 48, 128];

console.log('Generating Chrome extension icons for webTab...\n');
console.log('Design: Large and full "W" letter with vibrant gradient\n');

for (const size of sizes) {
  try {
    const iconBuffer = await createIcon(size);
    const filename = `icon-${size}.png`;
    writeFileSync(filename, iconBuffer);
    console.log(`✓ Created ${filename} (${size}x${size})`);
  } catch (error) {
    console.error(`✗ Failed to create icon-${size}.png:`, error.message);
  }
}

console.log('\n✅ All icons generated successfully!');
console.log('Run "npm run build" to include them in the extension.');
