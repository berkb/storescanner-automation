/**
 * publish-daily.mjs
 *
 * daily-generate.mjs çıktısındaki tip-manifest.json'u okuyup
 * 7 videoyu R2'ye yükler + Buffer'a schedule eder (Pzt-Paz 11:00 UTC).
 *
 * Kullanım:
 *   node scripts/publish-daily.mjs
 *   node scripts/publish-daily.mjs --manifest=out/2026-04-07/tip-manifest.json
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { scheduleToBuffer } from './upload/buffer.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.join(__dirname, '..');

// ─── Manifest bul ─────────────────────────────────────────────────────────────
const args        = process.argv.slice(2);
const argManifest = args.find(a => a.startsWith('--manifest='))?.replace('--manifest=', '');

let manifestPath;
if (argManifest) {
  manifestPath = path.resolve(argManifest);
} else {
  const outDir = path.join(ROOT, 'out');
  const dates  = fs.readdirSync(outDir)
    .filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d))
    .sort()
    .reverse();
  for (const d of dates) {
    const candidate = path.join(outDir, d, 'tip-manifest.json');
    if (fs.existsSync(candidate)) { manifestPath = candidate; break; }
  }
}

if (!manifestPath || !fs.existsSync(manifestPath)) {
  process.stderr.write('❌ tip-manifest.json bulunamadı.\n');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
process.stderr.write(`\n📋 Manifest: ${manifestPath}\n`);
process.stderr.write(`📅 Hafta: ${manifest.weekOf} — ${manifest.entries.length} tip\n\n`);

// ─── Her tip için schedule et ─────────────────────────────────────────────────
const summary = [];

for (const entry of manifest.entries) {
  process.stderr.write(`[${entry.index}/7] #${String(entry.tipId).padStart(3,'0')} ${entry.hook}\n`);
  process.stderr.write(`  Yayın: ${entry.publishAt}\n`);

  if (!fs.existsSync(entry.outputPath)) {
    process.stderr.write(`  ❌ Video dosyası yok: ${entry.outputPath}\n`);
    summary.push({ index: entry.index, tipId: entry.tipId, error: 'Video dosyası bulunamadı' });
    continue;
  }

  if (process.env.SKIP_UPLOAD === 'true') {
    process.stderr.write(`  ⏭  SKIP_UPLOAD=true, atlandı\n`);
    summary.push({ index: entry.index, tipId: entry.tipId, skipped: true });
    continue;
  }

  try {
    const results  = await scheduleToBuffer({
      videoPath: entry.outputPath,
      captions:  entry.captions,
      publishAt: entry.publishAt,
    });
    const hasError = results.some(r => r.error);
    summary.push({ index: entry.index, tipId: entry.tipId, results, hasError });
    process.stderr.write(hasError ? `  ❌ Bazı platformlarda hata\n` : `  ✅ 3 platforma schedule edildi\n`);
  } catch (e) {
    process.stderr.write(`  ❌ ${e.message}\n`);
    summary.push({ index: entry.index, tipId: entry.tipId, error: e.message });
  }
}

// ─── Özet ─────────────────────────────────────────────────────────────────────
const ok      = summary.filter(s => !s.error && !s.skipped && !s.hasError).length;
const failed  = summary.filter(s => s.error || s.hasError).length;
const skipped = summary.filter(s => s.skipped).length;
process.stderr.write(`\n✅ Başarılı: ${ok}  ❌ Hatalı: ${failed}  ⏭ Atlanan: ${skipped}\n`);

process.stdout.write(JSON.stringify({ weekOf: manifest.weekOf, summary }, null, 2) + '\n');
