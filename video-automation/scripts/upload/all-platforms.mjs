/**
 * upload/all-platforms.mjs
 *
 * Buffer üzerinden 3 platforma schedule eder.
 * n8n Execute Command node'u bu scripti çağırır.
 *
 * Kullanım:
 *   node scripts/upload/all-platforms.mjs --manifest=out/2026-03-23/manifest.json --index=0
 */

import 'dotenv/config';
import fs from 'fs';
import { scheduleToBuffer } from './buffer.mjs';

const args   = process.argv.slice(2);
const getArg = (prefix) => { const m = args.find(a => a.startsWith(prefix)); return m ? m.replace(prefix, '') : null; };

const manifestPath = getArg('--manifest=');
const indexStr     = getArg('--index=');

if (!manifestPath || indexStr === null) {
  console.error('Usage: --manifest=path --index=N');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const entry    = manifest.entries[parseInt(indexStr, 10)];

if (!entry) {
  console.error(`Entry ${indexStr} manifest'te yok`);
  process.exit(1);
}

if (!fs.existsSync(entry.outputPath)) {
  console.error(`Video bulunamadı: ${entry.outputPath}`);
  process.exit(1);
}

process.stderr.write(`\nYükleniyor: [${entry.index}] ${entry.topicId}\n`);
process.stderr.write(`Yayın zamanı: ${entry.publishAt}\n`);

let results;
try {
  results = await scheduleToBuffer({
    videoPath: entry.outputPath,
    captions:  entry.captions,
    publishAt: entry.publishAt,
  });
} catch (e) {
  process.stderr.write(`Hata: ${e.message}\n`);
  process.stdout.write(JSON.stringify({ topicId: entry.topicId, error: e.message }));
  process.exit(1);
}

const hasError = results.some(r => r.error);
process.stdout.write(JSON.stringify({
  topicId:   entry.topicId,
  publishAt: entry.publishAt,
  results,
  hasError,
}));
