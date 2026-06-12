/**
 * upload/buffer.mjs
 *
 * Buffer GraphQL API — video schedule
 *
 * Gerekli env vars:
 *   BUFFER_ACCESS_TOKEN
 *   BUFFER_ORG_ID
 *   BUFFER_CHANNEL_INSTAGRAM
 *   BUFFER_CHANNEL_YOUTUBE
 *   BUFFER_CHANNEL_TIKTOK
 */

import fs from 'fs';
import { uploadToR2, deleteFromR2 } from './r2.mjs';

const GQL = 'https://api.buffer.com/graphql';

async function gql(query, variables = {}) {
  const res = await fetch(GQL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.BUFFER_ACCESS_TOKEN}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });
  const data = await res.json();
  if (data.errors) throw new Error(data.errors.map(e => e.message).join(', '));
  return data.data;
}

// ─── Channel listesi ──────────────────────────────────────────────────────────
export async function getChannels() {
  const data = await gql(`
    query GetChannels {
      channels(input: { organizationId: "${process.env.BUFFER_ORG_ID}" }) {
        id name service serviceId
      }
    }
  `);
  return data.channels;
}

// ─── Video dosyasını R2'ye yükle, URL döner ──────────────────────────────────
async function getVideoUrl(videoPath) {
  process.stderr.write(`  R2: video yükleniyor...\n`);
  const { key, url } = await uploadToR2(videoPath);
  process.stderr.write(`  R2: ${url}\n`);
  return { key, url };
}

// ─── Tek channel'a post schedule et ─────────────────────────────────────────
async function createPost({ channelId, text, videoUrl, publishAt, metadata }) {
  const data = await gql(`
    mutation CreatePost($input: CreatePostInput!) {
      createPost(input: $input) {
        ... on PostActionSuccess {
          post { id status dueAt }
        }
        ... on MutationError {
          message
        }
      }
    }
  `, {
    input: {
      channelId,
      text:           text.slice(0, 2200),
      assets:         { videos: [{ url: videoUrl }] },
      schedulingType: 'automatic',
      mode:           'customScheduled',
      dueAt:          publishAt,
      ...(metadata ? { metadata } : {}),
    },
  });

  const result = data.createPost;
  if (result?.message) throw new Error(`Post error: ${result.message}`);
  return result?.post;
}

// ─── Ana fonksiyon: 3 platforma schedule et ──────────────────────────────────
export async function scheduleToBuffer({ videoPath, captions, publishAt }) {
  const channels = {
    instagram: process.env.BUFFER_CHANNEL_INSTAGRAM,
    youtube:   process.env.BUFFER_CHANNEL_YOUTUBE,
    tiktok:    process.env.BUFFER_CHANNEL_TIKTOK,
  };

  // Video önce R2'ye yükle, URL al
  const { key: r2Key, url: videoUrl } = await getVideoUrl(videoPath);

  const results = [];

  const platformConfig = {
    instagram: {
      text:     captions.instagram?.caption || '',
      metadata: { instagram: { type: 'reel', shouldShareToFeed: true } },
    },
    youtube: {
      text:     captions.youtube?.description || '',
      metadata: {
        youtube: {
          title:      (captions.youtube?.title || '').slice(0, 100),
          categoryId: '28', // Science & Technology
          privacy:    'public',
        },
      },
    },
    tiktok: {
      text:     (captions.tiktok?.caption || '').slice(0, 150),
      metadata: {},
    },
  };

  for (const [platform, channelId] of Object.entries(channels)) {
    if (!channelId) continue;
    const config = platformConfig[platform] || {};

    try {
      const post = await createPost({
        channelId,
        text:      config.text,
        videoUrl,
        publishAt,
        metadata:  config.metadata,
      });
      results.push({ platform, postId: post?.id, status: post?.status, publishAt: post?.dueAt, r2Key });
      process.stderr.write(`  ✅ Buffer [${platform}]: ${post?.id}\n`);
    } catch (e) {
      results.push({ platform, error: e.message });
      process.stderr.write(`  ❌ Buffer [${platform}]: ${e.message}\n`);
    }
  }

  return results;
}
