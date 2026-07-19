import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const publicDir = join(root, 'public');

const svgBuffer = readFileSync(join(publicDir, 'favicon.svg'));

async function generateIcons() {
  try {
    // 192x192 for android and modern browsers
    await sharp(svgBuffer)
      .resize(192, 192)
      .toFile(join(publicDir, 'favicon-192x192.png'));
      
    // 512x512 for manifest
    await sharp(svgBuffer)
      .resize(512, 512)
      .toFile(join(publicDir, 'favicon-512x512.png'));
      
    // 180x180 for Apple touch icon
    await sharp(svgBuffer)
      .resize(180, 180)
      .toFile(join(publicDir, 'apple-touch-icon.png'));

    // 48x48 for Google Search snippet fallback
    await sharp(svgBuffer)
      .resize(48, 48)
      .toFile(join(publicDir, 'favicon-48x48.png'));

    console.log('Successfully generated raster favicons from SVG.');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();
