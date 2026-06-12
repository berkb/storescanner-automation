/**
 * weekly-generate.mjs
 *
 * Her Pazar çalışır:
 * 1. 40 konuluk havuzdan 7 kullanılmamış konu seçer
 * 2. Her konu için Groq ile yeni script üretir
 * 3. Videoları render eder → out/YYYY-MM-DD/ klasörüne kaydeder
 * 4. manifest.json üretir (n8n için)
 *
 * Kullanım:
 *   node scripts/weekly-generate.mjs
 *   node scripts/weekly-generate.mjs --dry-run   (render etmez)
 */

import 'dotenv/config';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { TOPICS } from '../src/data/topics.js';
import { generateScript } from './generate-script.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT       = path.join(__dirname, '..');
const STATE_FILE = path.join(ROOT, 'state', 'used-topics.json');
const isDryRun   = process.argv.includes('--dry-run');

// ─── State yükle ──────────────────────────────────────────────────────────────
let state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));

// ─── 7 kullanılmamış konu seç ────────────────────────────────────────────────
const allIds   = TOPICS.map(t => t.id);
if (allIds.every(id => state.used.includes(id))) {
  state.used = []; // Tümü kullanıldıysa sıfırla
}
const available = TOPICS.filter(t => !state.used.includes(t.id));
const selected  = available.sort(() => Math.random() - 0.5).slice(0, 1);

// ─── Available media files ────────────────────────────────────────────────────
const MUSIC_DIR = path.join(ROOT, 'public', 'musics');
const SFX_DIR   = path.join(ROOT, 'public', 'sfx');

const musicFiles  = fs.readdirSync(MUSIC_DIR).filter(f => f.endsWith('.mp3')).map(f => `musics/${f}`);
const whooshFiles = fs.readdirSync(SFX_DIR).filter(f => f.includes('whoosh') && f.endsWith('.mp3')).map(f => `sfx/${f}`);
const chimeFile   = fs.readdirSync(SFX_DIR).find(f => f.includes('chime') || f.includes('bell'));
const defaultChime = chimeFile ? `sfx/${chimeFile}` : 'sfx/universfield-clear-bell-chime-487898.mp3';

const pickRandom = arr => arr[Math.floor(Math.random() * arr.length)];

// ─── Publish tarihi: bugün 16:00 UTC, geçmişse yarın 16:00 UTC ───────────────
function getPublishDates() {
  const target = new Date();
  target.setUTCHours(16, 0, 0, 0);
  if (target <= new Date()) target.setUTCDate(target.getUTCDate() + 1);
  return [target.toISOString()];
}

const publishDates = getPublishDates();
const weekLabel    = new Date().toISOString().slice(0, 10);
const OUT_DIR      = path.join(ROOT, 'out', weekLabel);
fs.mkdirSync(OUT_DIR, { recursive: true });

// ─── Her konu için Groq ile script üret + render ──────────────────────────────
const entries = [];

process.stderr.write(`\n📅 Hafta: ${weekLabel}\n`);
process.stderr.write(`📋 Seçilen konular:\n`);
selected.forEach((t, i) => {
  const day = new Date(publishDates[i]).toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' });
  process.stderr.write(`   ${day} → ${t.id}\n`);
});
process.stderr.write('\n');

let bundleLocation;
if (!isDryRun) {
  process.stderr.write('🎬 Bundling...\n');
  bundleLocation = await bundle({
    entryPoint: path.join(ROOT, 'src', 'index.jsx'),
    webpackOverride: (config) => config,
  });
}

for (let i = 0; i < selected.length; i++) {
  const topic      = selected[i];
  const publishAt  = publishDates[i];
  const music      = pickRandom(musicFiles);
  const sfxWhoosh  = pickRandom(whooshFiles);
  const outputPath = path.join(OUT_DIR, `${weekLabel}-video-${String(i + 1).padStart(2, '0')}.mp4`);

  process.stderr.write(`\n[${i + 1}/7] ${topic.id}\n`);

  // Groq ile script üret
  process.stderr.write(`  ✍️  Script üretiliyor...\n`);
  let script;
  try {
    script = await generateScript(topic);
  } catch (e) {
    process.stderr.write(`  ❌ Script hatası: ${e.message}\n`);
    continue;
  }

  const entry = {
    index:      i + 1,
    topicId:    topic.id,
    outputPath,
    publishAt,
    music,
    sfxWhoosh,
    sfxChime:   defaultChime,
    screens:    script.screens,
    captions:   script.captions,
  };

  // Render et
  if (!isDryRun) {
    process.stderr.write(`  🎞  Render ediliyor...\n`);
    process.stderr.write(`  Müzik: ${music}\n`);

    const inputProps = {
      screens:   script.screens,
      music,
      sfxWhoosh,
      sfxChime:  defaultChime,
    };

    const composition = await selectComposition({
      serveUrl:   bundleLocation,
      id:         'DynamicVideo',
      inputProps,
    });

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
    process.stderr.write(`\n  ✅ Kaydedildi: ${path.basename(outputPath)}\n`);
  }

  entries.push({ ...entry, screens: undefined }); // screens manifest'e gitmez
}

// ─── Manifest kaydet ──────────────────────────────────────────────────────────
const manifestPath = path.join(OUT_DIR, 'manifest.json');
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
  state.weekOf = weekLabel;
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

// ─── 30 günden eski klasörleri temizle ────────────────────────────────────────
const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
try {
  fs.readdirSync(path.join(ROOT, 'out'))
    .filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d))
    .filter(d => new Date(d).getTime() < cutoff)
    .forEach(d => {
      fs.rmSync(path.join(ROOT, 'out', d), { recursive: true, force: true });
      process.stderr.write(`🗑  Silindi: out/${d}\n`);
    });
} catch (e) {}

process.stderr.write(`\n✅ Tamamlandı: ${entries.length} video — ${weekLabel}\n`);
process.stdout.write(JSON.stringify({ manifestPath, weekOf: weekLabel, count: entries.length }) + '\n');
