/**
 * upload/r2.mjs
 *
 * Cloudflare R2'ye video yükler, public URL döner.
 *
 * Gerekli env vars:
 *   CLOUDFLARE_ACCOUNT_ID
 *   CLOUDFLARE_R2_ACCESS_KEY
 *   CLOUDFLARE_R2_SECRET_KEY
 *   CLOUDFLARE_R2_BUCKET
 *   CLOUDFLARE_R2_PUBLIC_URL
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

function getClient() {
  return new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId:     process.env.CLOUDFLARE_R2_ACCESS_KEY,
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_KEY,
    },
  });
}

export async function uploadToR2(videoPath) {
  const client   = getClient();
  const bucket   = process.env.CLOUDFLARE_R2_BUCKET;
  const baseUrl  = process.env.CLOUDFLARE_R2_PUBLIC_URL.replace(/\/$/, '');

  // Benzersiz dosya adı: video-01-1711234567.mp4
  const ext      = path.extname(videoPath);
  const baseName = path.basename(videoPath, ext);
  const key      = `${baseName}-${Date.now()}${ext}`;

  const fileBuffer = fs.readFileSync(videoPath);

  await client.send(new PutObjectCommand({
    Bucket:      bucket,
    Key:         key,
    Body:        fileBuffer,
    ContentType: 'video/mp4',
  }));

  return { key, url: `${baseUrl}/${key}` };
}

export async function deleteFromR2(key) {
  const client = getClient();
  await client.send(new DeleteObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET,
    Key:    key,
  }));
}
