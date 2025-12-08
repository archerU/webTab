import archiver from 'archiver';
import { createWriteStream, existsSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

const distDir = join(__dirname, 'dist');
const zipPath = join(__dirname, 'webTab-extension.zip');

// Check if dist directory exists
if (!existsSync(distDir)) {
  console.error('❌ Error: dist directory does not exist. Please run "npm run build" first.');
  process.exit(1);
}

// Remove old zip file if exists
if (existsSync(zipPath)) {
  const fs = await import('fs/promises');
  await fs.unlink(zipPath);
  console.log('🗑️  Removed old zip file');
}

// Create zip file
const output = createWriteStream(zipPath);
const archive = archiver('zip', {
  zlib: { level: 9 } // Maximum compression
});

output.on('close', () => {
  const sizeInMB = (archive.pointer() / 1024 / 1024).toFixed(2);
  console.log(`✅ Package created: webTab-extension.zip (${sizeInMB} MB)`);
  console.log(`📦 Ready to upload to Chrome Web Store Developer Dashboard`);
});

archive.on('error', (err) => {
  console.error('❌ Error creating zip file:', err);
  process.exit(1);
});

archive.pipe(output);

// Add all files from dist directory
archive.directory(distDir, false);

// Finalize the archive
await archive.finalize();

