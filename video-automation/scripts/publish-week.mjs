/**
 * publish-week.mjs
 *
 * weekly-generate.mjs çıktısındaki manifest'i okuyup
 * her video için R2'ye yükler + Buffer'a schedule eder.
 *
 * Kullanım:
 *   node scripts/publish-week.mjs --manifest=out/2026-03-25/manifest.json
 *   node scripts/publish-week.mjs               (en son manifest'i otomatik bulur)
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { scheduleToBuffer } from './upload/buffer.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// ─── Manifest bul ────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const argManifest = args.find(a => a.startsWith('--manifest='))?.replace('--manifest=', '');

let manifestPath;
if (argManifest) {
  manifestPath = path.resolve(argManifest);
} else {
  // En son out/YYYY-MM-DD/manifest.json'u bul
  const outDir = path.join(ROOT, 'out');
  const weeks = fs.readdirSync(outDir)
    .filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d))
    .sort()
    .reverse();
  if (!weeks.length) {
    console.error('out/ klasöründe manifest bulunamadı. Önce npm run weekly çalıştır.');
    process.exit(1);
  }
  manifestPath = path.join(outDir, weeks[0], 'manifest.json');
}

if (!fs.existsSync(manifestPath)) {
  console.error(`Manifest bulunamadı: ${manifestPath}`);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
process.stderr.write(`\n📋 Manifest: ${manifestPath}\n`);
process.stderr.write(`📅 Hafta: ${manifest.weekOf} — ${manifest.entries.length} video\n\n`);

// ─── Her video için schedule et ──────────────────────────────────────────────
const summary = [];

for (const entry of manifest.entries) {
  process.stderr.write(`[${entry.index}/${manifest.entries.length}] ${entry.topicId}\n`);
  process.stderr.write(`  Yayın: ${entry.publishAt}\n`);

  if (!fs.existsSync(entry.outputPath)) {
    process.stderr.write(`  ❌ Video dosyası yok: ${entry.outputPath}\n`);
    summary.push({ index: entry.index, topicId: entry.topicId, error: 'Video dosyası bulunamadı' });
    continue;
  }

  if (process.env.SKIP_UPLOAD === 'true') {
    process.stderr.write(`  ⏭  SKIP_UPLOAD=true, atlandı\n`);
    summary.push({ index: entry.index, topicId: entry.topicId, skipped: true });
    continue;
  }

  try {
    const results = await scheduleToBuffer({
      videoPath: entry.outputPath,
      captions:  entry.captions,
      publishAt: entry.publishAt,
    });
    const hasError = results.some(r => r.error);
    summary.push({ index: entry.index, topicId: entry.topicId, results, hasError });
    if (!hasError) {
      process.stderr.write(`  ✅ 3 platforma schedule edildi\n`);
    }
  } catch (e) {
    process.stderr.write(`  ❌ ${e.message}\n`);
    summary.push({ index: entry.index, topicId: entry.topicId, error: e.message });
  }
}

// ─── Özet ─────────────────────────────────────────────────────────────────────
process.stderr.write('\n─────────────────────────────────\n');
const ok      = summary.filter(s => !s.error && !s.skipped && !s.hasError).length;
const failed  = summary.filter(s => s.error || s.hasError).length;
const skipped = summary.filter(s => s.skipped).length;
process.stderr.write(`✅ Başarılı: ${ok}  ❌ Hatalı: ${failed}  ⏭ Atlanan: ${skipped}\n`);

process.stdout.write(JSON.stringify({ weekOf: manifest.weekOf, summary }) + '\n');
