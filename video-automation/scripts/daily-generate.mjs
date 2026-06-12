/**
 * daily-generate.mjs
 *
 * Her Pazartesi 08:00'de çalışır:
 * 1. 100 ipucundan 7 kullanılmamışını seçer
 * 2. TipTemplate ile render eder → out/YYYY-MM-DD/ klasörüne kaydeder
 * 3. manifest.json üretir (publish-daily.mjs için)
 *    Her video Pzt-Paz 11:00 UTC'de yayınlanmak üzere schedule edilir.
 *
 * Kullanım:
 *   node scripts/daily-generate.mjs
 *   node scripts/daily-generate.mjs --dry-run
 */

import 'dotenv/config';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { TIPS } from '../src/data/tips.js';

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const ROOT       = path.join(__dirname, '..');
const STATE_FILE = path.join(ROOT, 'state', 'used-tips.json');
const isDryRun   = process.argv.includes('--dry-run');

// ─── State yükle ──────────────────────────────────────────────────────────────
let state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));

// ─── 7 kullanılmamış tip seç ─────────────────────────────────────────────────
const allIds = TIPS.map(t => t.id);
if (allIds.every(id => state.used.includes(id))) {
  state.used = [];
}
const available = TIPS.filter(t => !state.used.includes(t.id));
const selected  = available.slice(0, 1);

if (selected.length === 0) {
  process.stderr.write('❌ Kullanılabilir tip bulunamadı.\n');
  process.exit(1);
}

// ─── Publish tarihi: bugün 11:00 UTC ─────────────────────────────────────────
function getPublishDates() {
  const today = new Date();
  today.setUTCHours(11, 0, 0, 0);
  return [today.toISOString()];
}

const publishDates = getPublishDates();
const weekLabel    = new Date().toISOString().slice(0, 10);
const OUT_DIR      = path.join(ROOT, 'out', weekLabel);
fs.mkdirSync(OUT_DIR, { recursive: true });

// ─── Müzik seç ────────────────────────────────────────────────────────────────
const MUSIC_DIR  = path.join(ROOT, 'public', 'musics');
const musicFiles = fs.readdirSync(MUSIC_DIR).filter(f => f.endsWith('.mp3')).map(f => `musics/${f}`);
const pickMusic  = (id) => musicFiles[id % musicFiles.length];

process.stderr.write(`\n📅 Hafta: ${weekLabel}\n`);
process.stderr.write(`📋 Seçilen tipler:\n`);
selected.forEach((t, i) => {
  process.stderr.write(`   ${publishDates[i].slice(0, 10)} → #${String(t.id).padStart(3,'0')} ${t.hook}\n`);
});
process.stderr.write('\n');

// ─── Bundle ───────────────────────────────────────────────────────────────────
let bundleLocation;
if (!isDryRun) {
  process.stderr.write('🎬 Bundling...\n');
  bundleLocation = await bundle({
    entryPoint: path.join(ROOT, 'src', 'index.jsx'),
    webpackOverride: (config) => config,
  });
}

// ─── Her tip için render ──────────────────────────────────────────────────────
const entries = [];

for (let i = 0; i < selected.length; i++) {
  const tip        = selected[i];
  const publishAt  = publishDates[i];
  const music      = pickMusic(tip.id);
  const outputPath = path.join(OUT_DIR, `tip-${String(tip.id).padStart(3, '0')}.mp4`);

  process.stderr.write(`\n[${i + 1}/7] #${String(tip.id).padStart(3,'0')} ${tip.hook}\n`);

  if (!isDryRun) {
    const inputProps = { tip, music };
    const composition = await selectComposition({
      serveUrl:   bundleLocation,
      id:         'DynamicTip',
      inputProps,
    });

    process.stderr.write('  🎞  Render ediliyor...\n');
    await renderMedia({
      composition,
      serveUrl:       bundleLocation,
      codec:          'h264',
      outputLocation: outputPath,
      inputProps,
      onProgress: ({ progress }) => {
        process.stderr.write(`\r  ${Math.round(progress * 100)}%`);
      },
    });
    process.stderr.write(`\n  ✅ ${path.basename(outputPath)}\n`);
  }

  const caption = `${tip.hook}\n\n${tip.body}\n\n#Shopify #ShopifyTips #Ecommerce #ShopifyStore`;
  entries.push({
    index:      i + 1,
    tipId:      tip.id,
    category:   tip.category,
    hook:       tip.hook,
    outputPath,
    publishAt,
    music,
    captions: {
      instagram: { caption },
      tiktok:    { caption: caption.slice(0, 150) },
      youtube:   {
        title:       `Shopify Tip #${String(tip.id).padStart(3, '0')}: ${tip.hook}`,
        description: `${tip.body}\n\n${caption}`,
      },
    },
  });
}

// ─── Manifest kaydet ──────────────────────────────────────────────────────────
const manifestPath = path.join(OUT_DIR, 'tip-manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify({
  generatedAt: new Date().toISOString(),
  weekOf:      weekLabel,
  isDryRun,
  entries,
}, null, 2));

// ─── State güncelle ───────────────────────────────────────────────────────────
if (!isDryRun) {
  state.used.push(...selected.map(t => t.id));
  state.lastGeneratedAt = new Date().toISOString();
  state.lastDate = weekLabel;
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

// ─── 30 günden eski klasörleri temizle ───────────────────────────────────────
const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
try {
  fs.readdirSync(path.join(ROOT, 'out'))
    .filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d))
    .filter(d => new Date(d).getTime() < cutoff)
    .forEach(d => {
      fs.rmSync(path.join(ROOT, 'out', d), { recursive: true, force: true });
    });
} catch (e) {}

process.stderr.write(`\n✅ Tamamlandı: ${entries.length} tip — ${weekLabel}\n`);
process.stdout.write(JSON.stringify({ manifestPath, weekOf: weekLabel, count: entries.length }) + '\n');
