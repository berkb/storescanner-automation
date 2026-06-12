/**
 * upload/instagram.mjs
 *
 * Meta Graph API — Instagram Reels upload + scheduling
 *
 * Gerekli env vars:
 *   INSTAGRAM_USER_ID       — Instagram Business account ID
 *   INSTAGRAM_ACCESS_TOKEN  — Long-lived Page access token
 *   VIDEO_CDN_BASE_URL      — Videoların public URL'i (S3 bucket / CDN)
 *                             örn: https://your-bucket.s3.amazonaws.com/videos
 *
 * Instagram, dosyayı doğrudan kabul etmez — herkese açık bir URL ister.
 * Videoları önce S3/R2/benzeri bir yere yükleyip URL'ini buraya ver.
 *
 * Eğer S3 yoksa aşağıdaki uploadToS3 mock'unu kendi CDN'inle değiştir.
 */

import fs from 'fs';
import path from 'path';

const GRAPH = 'https://graph.facebook.com/v19.0';

// ─── CDN Upload (S3) ──────────────────────────────────────────────────────────
// S3 entegrasyonu varsa bu fonksiyonu doldurun.
// Yoksa VIDEO_CDN_BASE_URL + dosya adı kullanılır (dosya manuel yüklenmiş kabul edilir).
async function getPublicVideoUrl(videoPath) {
  const baseUrl = process.env.VIDEO_CDN_BASE_URL;
  if (!baseUrl) throw new Error('VIDEO_CDN_BASE_URL env var eksik (Instagram için zorunlu)');

  // Eğer AWS SDK varsa buraya S3 upload eklenebilir:
  // import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
  // ...

  // Şimdilik: dosyanın CDN'e önceden yüklendiği varsayılır
  const filename = path.basename(videoPath);
  return `${baseUrl.replace(/\/$/, '')}/${filename}`;
}

// ─── Instagram Upload ─────────────────────────────────────────────────────────
export async function uploadToInstagram({ videoPath, caption, publishAt }) {
  const userId      = process.env.INSTAGRAM_USER_ID;
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!userId || !accessToken) throw new Error('INSTAGRAM_USER_ID veya INSTAGRAM_ACCESS_TOKEN eksik');

  const videoUrl = await getPublicVideoUrl(videoPath);
  const scheduledTs = publishAt
    ? Math.floor(new Date(publishAt).getTime() / 1000)
    : null;

  // Step 1: Media container oluştur
  const containerParams = new URLSearchParams({
    media_type:  'REELS',
    video_url:   videoUrl,
    caption:     caption.slice(0, 2200),
    share_to_feed: 'true',
    access_token: accessToken,
    ...(scheduledTs ? {
      published:             'false',
      scheduled_publish_time: scheduledTs,
    } : {}),
  });

  const containerRes = await fetch(`${GRAPH}/${userId}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: containerParams,
  });

  const containerData = await containerRes.json();
  if (containerData.error) throw new Error(`Instagram container error: ${JSON.stringify(containerData.error)}`);

  const creationId = containerData.id;

  // Step 2: Container hazır olana kadar bekle (video işleme)
  await waitForContainer(creationId, accessToken);

  // Step 3: Yayınla (veya schedule edildiyse sadece confirm et)
  const publishParams = new URLSearchParams({
    creation_id: creationId,
    access_token: accessToken,
  });

  const publishRes = await fetch(`${GRAPH}/${userId}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: publishParams,
  });

  const publishData = await publishRes.json();
  if (publishData.error) throw new Error(`Instagram publish error: ${JSON.stringify(publishData.error)}`);

  return {
    platform:   'instagram',
    mediaId:    publishData.id || creationId,
    publishAt:  publishAt || 'immediate',
  };
}

// ─── Polling helper ───────────────────────────────────────────────────────────
async function waitForContainer(creationId, accessToken, maxWaitMs = 120000) {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    const res = await fetch(
      `${GRAPH}/${creationId}?fields=status_code&access_token=${accessToken}`
    );
    const data = await res.json();
    if (data.status_code === 'FINISHED') return;
    if (data.status_code === 'ERROR') throw new Error(`Instagram container error: ${JSON.stringify(data)}`);
    await new Promise(r => setTimeout(r, 5000));
  }
  throw new Error('Instagram container timed out');
}
