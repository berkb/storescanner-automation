/**
 * upload/tiktok.mjs
 *
 * TikTok Content Posting API v2 — video upload + scheduling
 *
 * Gerekli env vars: TIKTOK_ACCESS_TOKEN
 * TikTok Developer Portal: https://developers.tiktok.com/
 *
 * Not: scheduled_publish_time en az 20 dakika, en fazla 10 gün sonrası olabilir.
 */

import fs from 'fs';

const INIT_URL   = 'https://open.tiktokapis.com/v2/post/publish/video/init/';
const STATUS_URL = 'https://open.tiktokapis.com/v2/post/publish/status/fetch/';

export async function uploadToTiktok({ videoPath, caption, publishAt }) {
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
  if (!accessToken) throw new Error('TIKTOK_ACCESS_TOKEN eksik');

  const fileSize  = fs.statSync(videoPath).size;
  const chunkSize = fileSize; // tek parça yükleme

  const scheduledTs = publishAt
    ? Math.floor(new Date(publishAt).getTime() / 1000)
    : null;

  // Step 1: Upload init
  const initRes = await fetch(INIT_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type':  'application/json; charset=UTF-8',
    },
    body: JSON.stringify({
      post_info: {
        title:                caption.slice(0, 2200),
        privacy_level:        'PUBLIC_TO_EVERYONE',
        disable_duet:         false,
        disable_comment:      false,
        disable_stitch:       false,
        ...(scheduledTs ? { scheduled_publish_time: scheduledTs } : {}),
      },
      source_info: {
        source:            'FILE_UPLOAD',
        video_size:        fileSize,
        chunk_size:        chunkSize,
        total_chunk_count: 1,
      },
    }),
  });

  const initData = await initRes.json();
  if (initData.error?.code !== 'ok' && initData.error?.code !== undefined) {
    throw new Error(`TikTok init error: ${JSON.stringify(initData.error)}`);
  }

  const { publish_id, upload_url } = initData.data;

  // Step 2: Video yükle
  const fileBuffer = fs.readFileSync(videoPath);
  const uploadRes = await fetch(upload_url, {
    method: 'PUT',
    headers: {
      'Content-Type':   'video/mp4',
      'Content-Length': fileSize,
      'Content-Range':  `bytes 0-${fileSize - 1}/${fileSize}`,
    },
    body: fileBuffer,
  });

  if (!uploadRes.ok) throw new Error(`TikTok upload failed: ${await uploadRes.text()}`);

  // Step 3: Durum kontrol
  const statusRes = await fetch(STATUS_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type':  'application/json; charset=UTF-8',
    },
    body: JSON.stringify({ publish_id }),
  });

  const statusData = await statusRes.json();

  return {
    platform:  'tiktok',
    publishId: publish_id,
    status:    statusData.data?.status || 'submitted',
    publishAt: publishAt || 'immediate',
  };
}
