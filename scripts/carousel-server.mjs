/**
 * carousel-server.mjs — Local HTTP server for n8n to generate LinkedIn carousel PDFs
 *
 * Start:  node scripts/carousel-server.mjs
 * Port:   3457
 *
 * POST /generate-carousel
 *   body: {
 *     weekRange: "Apr 14 — Apr 21, 2026",
 *     slides: [{ emoji, title, body }, ...],
 *     closing: "Senior take paragraph"
 *   }
 *   → 200 { pdfUrl, thumbnailUrl, title, pageCount, sizeKB }
 */

import http from 'http';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import { buildCarouselHtml, CAROUSEL_PAGE_SIZE } from './carousel-template.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
dotenv.config({ path: path.join(ROOT, '.env') });

const PORT = Number(process.env.CAROUSEL_PORT || 3457);

const R2_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const R2_ACCESS_KEY = process.env.CLOUDFLARE_R2_ACCESS_KEY;
const R2_SECRET_KEY = process.env.CLOUDFLARE_R2_SECRET_KEY;
const R2_BUCKET = process.env.CLOUDFLARE_R2_BUCKET || 'checkpoint-videos';
const R2_PUBLIC_URL = (process.env.CLOUDFLARE_R2_PUBLIC_URL || '').replace(/\/$/, '');
const R2_PREFIX = process.env.CAROUSEL_R2_PREFIX || 'linkedin-carousels';

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY || !R2_SECRET_KEY || !R2_PUBLIC_URL) {
  console.error('[carousel-server] Missing R2 env vars. Aborting.');
  process.exit(1);
}

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY,
    secretAccessKey: R2_SECRET_KEY,
  },
});

let browserPromise = null;
async function getBrowser() {
  if (!browserPromise) {
    browserPromise = puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
    });
  }
  const b = await browserPromise;
  if (!b.connected) {
    browserPromise = null;
    return getBrowser();
  }
  return b;
}

async function renderPdf(html) {
  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    await page.setViewport({ width: CAROUSEL_PAGE_SIZE.width, height: CAROUSEL_PAGE_SIZE.height, deviceScaleFactor: 2 });
    await page.emulateMediaType('screen');
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 60000 });
    const fonts = await page.evaluate(() => document.fonts && document.fonts.ready);
    if (fonts) await page.evaluate(() => document.fonts.ready);

    const pdfBuffer = await page.pdf({
      width: `${CAROUSEL_PAGE_SIZE.width}px`,
      height: `${CAROUSEL_PAGE_SIZE.height}px`,
      printBackground: true,
      preferCSSPageSize: false,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    return pdfBuffer;
  } finally {
    await page.close();
  }
}

async function renderThumbnail(html) {
  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    await page.setViewport({ width: CAROUSEL_PAGE_SIZE.width, height: CAROUSEL_PAGE_SIZE.height, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 60000 });
    if (await page.evaluate(() => !!document.fonts)) {
      await page.evaluate(() => document.fonts.ready);
    }
    const buf = await page.screenshot({
      type: 'png',
      clip: { x: 0, y: 0, width: CAROUSEL_PAGE_SIZE.width, height: CAROUSEL_PAGE_SIZE.height },
    });
    return buf;
  } finally {
    await page.close();
  }
}

async function uploadToR2({ key, body, contentType }) {
  await s3.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );
  return `${R2_PUBLIC_URL}/${key}`;
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', c => (body += c));
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/health') {
    return sendJson(res, 200, { ok: true, port: PORT });
  }

  if (req.method !== 'POST' || req.url !== '/generate-carousel') {
    return sendJson(res, 404, { error: 'POST /generate-carousel only' });
  }

  let payload;
  try {
    payload = await readJson(req);
  } catch (e) {
    return sendJson(res, 400, { error: 'Invalid JSON body', detail: String(e) });
  }

  const { weekRange, slides, closing } = payload || {};
  if (!Array.isArray(slides) || slides.length === 0) {
    return sendJson(res, 400, { error: 'slides[] required and non-empty' });
  }
  if (!closing || typeof closing !== 'string') {
    return sendJson(res, 400, { error: 'closing string required' });
  }
  if (!weekRange || typeof weekRange !== 'string') {
    return sendJson(res, 400, { error: 'weekRange string required' });
  }

  const startedAt = Date.now();
  console.log(
    `[carousel-server] Generating: weekRange="${weekRange}" slides=${slides.length} closingChars=${closing.length}`
  );

  try {
    const html = buildCarouselHtml({ weekRange, slides, closing });

    const [pdfBuffer, thumbBuffer] = await Promise.all([renderPdf(html), renderThumbnail(html)]);

    const slug = weekRange
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60);
    const hash = crypto.randomBytes(4).toString('hex');
    const baseKey = `${R2_PREFIX}/shopify-changelog-${slug}-${hash}`;

    const [pdfUrl, thumbnailUrl] = await Promise.all([
      uploadToR2({
        key: `${baseKey}.pdf`,
        body: pdfBuffer,
        contentType: 'application/pdf',
      }),
      uploadToR2({
        key: `${baseKey}-cover.png`,
        body: thumbBuffer,
        contentType: 'image/png',
      }),
    ]);

    const elapsed = Date.now() - startedAt;
    const sizeKB = Math.round(pdfBuffer.length / 1024);
    console.log(
      `[carousel-server] Done in ${elapsed}ms — pdf ${sizeKB}KB → ${pdfUrl}`
    );

    return sendJson(res, 200, {
      pdfUrl,
      thumbnailUrl,
      title: `Shopify Weekly Changelog — ${weekRange}`,
      pageCount: slides.length + 3,
      sizeKB,
      elapsedMs: elapsed,
    });
  } catch (err) {
    console.error('[carousel-server] Render failed:', err);
    return sendJson(res, 500, { error: 'Render failed', detail: String(err && err.message || err) });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[carousel-server] Listening on http://127.0.0.1:${PORT}`);
  console.log(`[carousel-server] R2 bucket: ${R2_BUCKET} prefix: ${R2_PREFIX}`);
  console.log(`[carousel-server] Public URL base: ${R2_PUBLIC_URL}`);
});

const shutdown = async () => {
  console.log('[carousel-server] Shutting down...');
  if (browserPromise) {
    const b = await browserPromise.catch(() => null);
    if (b) await b.close().catch(() => {});
  }
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
