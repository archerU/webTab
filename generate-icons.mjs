import sharp from 'sharp';
import { writeFileSync } from 'fs';

// Create icon with gradient background and W letter
async function createIcon(size) {
  // Create SVG content
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="glass" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:rgba(255,255,255,0.2);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgba(255,255,255,0.05);stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background with rounded corners -->
      <rect width="${size}" height="${size}" rx="${size * 0.1875}" fill="url(#grad)"/>
      
      <!-- Glass effect overlay -->
      <rect width="${size}" height="${size}" rx="${size * 0.1875}" fill="url(#glass)"/>
      
      <!-- Tab/Window icon (scaled based on size) -->
      <g transform="translate(${size * 0.15625}, ${size * 0.15625}) scale(${size / 128})">
        <!-- Tab shape -->
        <path d="M 8 8 L 48 8 L 48 16 L 68 16 L 68 72 L 8 72 Z" 
              fill="rgba(255,255,255,0.9)" 
              stroke="rgba(255,255,255,0.3)" 
              stroke-width="2"/>
        
        <!-- Inner grid lines -->
        <rect x="12" y="20" width="52" height="4" rx="1" fill="rgba(255,255,255,0.6)"/>
        <rect x="12" y="28" width="40" height="4" rx="1" fill="rgba(255,255,255,0.4)"/>
        <rect x="12" y="36" width="48" height="4" rx="1" fill="rgba(255,255,255,0.4)"/>
        
        <!-- Grid squares -->
        <rect x="12" y="44" width="20" height="20" rx="2" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.5)" stroke-width="1"/>
        <rect x="36" y="44" width="20" height="20" rx="2" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.5)" stroke-width="1"/>
        <rect x="12" y="68" width="20" height="20" rx="2" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.5)" stroke-width="1"/>
        <rect x="36" y="68" width="20" height="20" rx="2" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.5)" stroke-width="1"/>
      </g>
      
      <!-- W letter -->
      <text x="${size / 2}" y="${size * 0.7}" 
            font-family="Arial, sans-serif" 
            font-size="${size * 0.25}" 
            font-weight="bold" 
            fill="rgba(255,255,255,0.95)" 
            text-anchor="middle" 
            dominant-baseline="central">W</text>
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

console.log('Generating Chrome extension icons...\n');

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

