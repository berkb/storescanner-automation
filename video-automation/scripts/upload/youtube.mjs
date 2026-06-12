/**
 * upload/youtube.mjs
 *
 * YouTube Data API v3 — video upload + scheduling
 *
 * Auth: OAuth2 refresh token akışı
 * Gerekli env vars: YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REFRESH_TOKEN
 */

import fs from 'fs';
import path from 'path';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const UPLOAD_URL = 'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status';

async function getAccessToken() {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id:     process.env.YOUTUBE_CLIENT_ID,
      client_secret: process.env.YOUTUBE_CLIENT_SECRET,
      refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
      grant_type:    'refresh_token',
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(`YouTube token error: ${JSON.stringify(data)}`);
  return data.access_token;
}

export async function uploadToYoutube({ videoPath, title, description, tags, publishAt }) {
  const accessToken = await getAccessToken();
  const fileSize    = fs.statSync(videoPath).size;

  // Step 1: Resumable upload session başlat
  const initRes = await fetch(UPLOAD_URL, {
    method: 'POST',
    headers: {
      'Authorization':  `Bearer ${accessToken}`,
      'Content-Type':   'application/json',
      'X-Upload-Content-Type': 'video/mp4',
      'X-Upload-Content-Length': fileSize,
    },
    body: JSON.stringify({
      snippet: {
        title:       title.slice(0, 100),
        description: description || '',
        tags:        tags || [],
        categoryId:  '28', // Science & Technology
      },
      status: {
        privacyStatus:          publishAt ? 'private' : 'public',
        publishAt:              publishAt || undefined,
        selfDeclaredMadeForKids: false,
      },
    }),
  });

  const uploadUri = initRes.headers.get('location');
  if (!uploadUri) throw new Error(`YouTube init failed: ${await initRes.text()}`);

  // Step 2: Video dosyasını yükle
  const fileBuffer = fs.readFileSync(videoPath);
  const uploadRes = await fetch(uploadUri, {
    method: 'PUT',
    headers: {
      'Content-Type':   'video/mp4',
      'Content-Length': fileSize,
    },
    body: fileBuffer,
  });

  if (!uploadRes.ok) throw new Error(`YouTube upload failed: ${await uploadRes.text()}`);

  const result = await uploadRes.json();
  return {
    platform:  'youtube',
    videoId:   result.id,
    url:       `https://youtube.com/watch?v=${result.id}`,
    publishAt: publishAt || 'immediate',
  };
}
