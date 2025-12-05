import sharp from 'sharp';
import { writeFileSync } from 'fs';

// Create vibrant icon for webTab using single "W" letter - large and full
async function createIcon(size) {
  // Create SVG content with vibrant design
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Vibrant gradient background - bright blue to purple to pink -->
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#2563EB;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#7C3AED;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#DB2777;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background with rounded corners -->
      <rect width="${size}" height="${size}" rx="${size * 0.25}" fill="url(#bgGrad)"/>
      
      <!-- Large "W" letter - full and bold, minimal whitespace -->
      <text 
        x="${size / 2}" 
        y="${size * 0.58}" 
        font-family="Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" 
        font-size="${size * 0.68}" 
        font-weight="900" 
        fill="rgba(255,255,255,1)" 
        text-anchor="middle" 
        dominant-baseline="central"
        letter-spacing="0">W</text>
    </svg>
  `;

  // Convert SVG to PNG
  const pngBuffer = await sharp(Buffer.from(svg))
    .png()
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
