/**
 * render.mjs — CLI render script
 *
 * Render a specific video by ID:
 *   node scripts/render.mjs --id=video-01
 *
 * Render all videos:
 *   node scripts/render.mjs --all
 *
 * Render with custom output path:
 *   node scripts/render.mjs --id=video-01 --out=out/my-video.mp4
 */

import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// ─── Parse CLI args ───────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const getArg = (prefix) => {
  const match = args.find(a => a.startsWith(prefix));
  return match ? match.replace(prefix, '') : null;
};

const videoId   = getArg('--id=');
const customOut = getArg('--out=');
const renderAll = args.includes('--all');

if (!videoId && !renderAll) {
  console.error('Usage: node scripts/render.mjs --id=video-01  OR  --all');
  process.exit(1);
}

// ─── Load video data ──────────────────────────────────────────────────────────
const { VIDEOS } = await import('../src/data/videos.js');

const videosToRender = renderAll
  ? VIDEOS
  : VIDEOS.filter(v => v.id === videoId);

if (videosToRender.length === 0) {
  console.error(`No video found with id "${videoId}". Available: ${VIDEOS.map(v => v.id).join(', ')}`);
  process.exit(1);
}

// ─── Bundle once, render all ──────────────────────────────────────────────────
console.log('🎬 Bundling...');
const bundleLocation = await bundle({
  entryPoint: path.join(ROOT, 'src', 'index.jsx'),
  webpackOverride: (config) => config,
});

for (const video of videosToRender) {
  const outputPath = customOut || path.join(ROOT, 'out', `${video.id}.mp4`);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  console.log(`\n🎞  [${video.id}] ${video.title}`);

  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: video.id,
    inputProps: {
      screens: video.screens,
      music: video.music,
    },
  });

  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: 'h264',
    outputLocation: outputPath,
    inputProps: {
      screens: video.screens,
      music: video.music,
    },
    onProgress: ({ progress }) => {
      process.stdout.write(`\r   ${Math.round(progress * 100)}%`);
    },
  });

  console.log(`\n✅ Saved: ${outputPath}`);
}

console.log('\n🎉 All done!');
process.exit(0);
