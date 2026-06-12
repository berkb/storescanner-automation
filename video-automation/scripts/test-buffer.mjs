import 'dotenv/config';
import { scheduleToBuffer } from './upload/buffer.mjs';

const results = await scheduleToBuffer({
  videoPath: 'out/video_1773956037615.mp4',
  publishAt: '2026-03-26T14:00:00Z',
  captions: {
    youtube: {
      title: 'You Uninstalled the App. The Code Is Still Loading. | Checkpoint',
      description: `Every Shopify app you install leaves code behind — even after you remove it. Ghost scripts keep loading on every page visit, slowing your store and hurting conversions.\n\nCheckpoint: Store Scanner detects every orphaned script.\n\nhttps://apps.shopify.com/checkpoint-store-scanner\n\n#shopify #shopifytips #ecommerce #pagespeed`,
    },
    tiktok: {
      caption: "You removed the app. The code stayed. 👻\n\nGhost scripts from uninstalled Shopify apps slow your store silently.\n\nCheckpoint finds every one.\n\n#shopify #shopifytips #ecommerce #pagespeed #shopifyapp",
    },
    instagram: {
      caption: "You removed the app. The code stayed. 👻\n\nEvery uninstalled Shopify app leaves ghost scripts behind.\n\nCheckpoint finds them all in one scan.\n\n#shopify #ecommerce #shopifytips #pagespeed #shopifyapp",
    },
  },
});

console.log('\nSonuçlar:');
results.forEach(r => {
  if (r.error) {
    console.log(`  ❌ ${r.platform}: ${r.error}`);
  } else {
    console.log(`  ✅ ${r.platform}: ${r.postId} — ${r.publishAt}`);
  }
});
