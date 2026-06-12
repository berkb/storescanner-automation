// ─── Video Scripts for Checkpoint: Store Scanner ─────────────────────────────
// Each screen: { type, duration (seconds), ...data }
// Types: hook | content | stat | list-item | cta
// Max 10s per screen. Total 30-60s per video.

export const CTA_DEFAULTS = {
  appName: 'Checkpoint: Store Scanner',
  url: 'apps.shopify.com/checkpoint-store-scanner',
};

export const VIDEOS = [
  // ─── 01: Leftover App Scripts ─────────────────────────────────────────────
  {
    id: 'video-01',
    title: 'Leftover App Scripts',
    music: 'musics/snoozy beats - Climbing Higher.mp3',
    screens: [
      {
        type: 'hook',
        duration: 5,
        text: 'You uninstalled the app.',
        subtext: "But the code? Still there.",
      },
      {
        type: 'content',
        duration: 8,
        headline: 'Ghost scripts are everywhere.',
        body: "Every app you've ever installed leaves traces — scripts, stylesheets, and Liquid snippets that keep loading on every page visit.",
      },
      {
        type: 'stat',
        duration: 7,
        stat: '3–7',
        label: 'ghost scripts per store',
        context: 'on average — slowing down every page load',
      },
      {
        type: 'content',
        duration: 8,
        headline: 'Checkpoint finds them all.',
        body: 'One scan. Every orphaned script flagged with the exact page it lives on — so you can clean up before it costs you.',
        accent: true,
      },
      { type: 'cta', duration: 7 },
    ],
  },

  // ─── 02: Broken Product Images ────────────────────────────────────────────
  {
    id: 'video-02',
    title: 'Broken Product Images',
    music: 'musics/snoozy beats - shopping splash.mp3',
    screens: [
      {
        type: 'hook',
        duration: 5,
        text: 'What if 20% of your product images are broken right now?',
      },
      {
        type: 'content',
        duration: 8,
        headline: 'Empty boxes kill trust instantly.',
        body: 'Deleted files, failed uploads, and broken CDN links leave customers staring at empty image placeholders — and they leave.',
      },
      {
        type: 'stat',
        duration: 7,
        stat: '−30%',
        label: 'conversion rate',
        context: 'for products with missing or broken images',
      },
      {
        type: 'content',
        duration: 8,
        headline: 'Checkpoint checks every image URL.',
        body: 'Across your entire catalog in seconds. No more finding out from an angry customer.',
        accent: true,
      },
      { type: 'cta', duration: 7 },
    ],
  },

  // ─── 03: Store Speed ──────────────────────────────────────────────────────
  {
    id: 'video-03',
    title: 'Store Speed',
    music: 'musics/snoozy beats - Chasing Sunbeams.mp3',
    screens: [
      {
        type: 'hook',
        duration: 5,
        text: 'Your store loads in 6 seconds.',
        subtext: "You've already lost the sale.",
      },
      {
        type: 'content',
        duration: 8,
        headline: "Bloat is invisible — until it isn't.",
        body: 'Unused theme files, redundant scripts, and unoptimized assets quietly stack up. Customers feel it before you notice it.',
      },
      {
        type: 'stat',
        duration: 7,
        stat: '−7%',
        label: 'conversions per extra second',
        context: 'every second of load time has a real cost',
      },
      {
        type: 'content',
        duration: 8,
        headline: "See exactly what's slowing you down.",
        body: "Checkpoint identifies dead scripts, oversized assets, and theme bloat — ranked by impact so you know where to start.",
        accent: true,
      },
      { type: 'cta', duration: 7 },
    ],
  },

  // ─── 04: Missing Meta Descriptions (SEO) ─────────────────────────────────
  {
    id: 'video-04',
    title: 'Missing SEO Metadata',
    music: 'musics/snoozy beats - Skyline Dreams.mp3',
    screens: [
      {
        type: 'hook',
        duration: 5,
        text: 'Google is looking at your store.',
        subtext: 'And finding nothing.',
      },
      {
        type: 'content',
        duration: 8,
        headline: 'Empty fields = invisible products.',
        body: "Missing meta titles and descriptions mean your products don't appear in search — or look terrible and unclickable when they do.",
      },
      {
        type: 'stat',
        duration: 7,
        stat: '+40%',
        label: 'organic traffic',
        context: 'for stores with complete SEO metadata',
      },
      {
        type: 'content',
        duration: 8,
        headline: 'One scan. Full SEO report.',
        body: 'Checkpoint audits every product, collection, and page for missing SEO fields and gives you a prioritized fix list.',
        accent: true,
      },
      { type: 'cta', duration: 7 },
    ],
  },

  // ─── 05: Broken Discount Codes ────────────────────────────────────────────
  {
    id: 'video-05',
    title: 'Broken Discount Codes',
    music: 'musics/snoozy beats - play time.mp3',
    screens: [
      {
        type: 'hook',
        duration: 5,
        text: "Your discount codes aren't working.",
        subtext: 'Customers are leaving quietly.',
      },
      {
        type: 'content',
        duration: 8,
        headline: 'Silent failures at checkout.',
        body: 'Expired, misconfigured, or duplicated codes silently fail the moment a customer tries to use them — and they blame your store.',
      },
      {
        type: 'stat',
        duration: 7,
        stat: '12%',
        label: 'of abandoned carts',
        context: "are caused by discount codes that simply don't work",
      },
      {
        type: 'content',
        duration: 8,
        headline: 'Catch failures before your customers do.',
        body: 'Checkpoint validates every active discount code and surfaces issues with usage limits, expiry dates, and conflicts.',
        accent: true,
      },
      { type: 'cta', duration: 7 },
    ],
  },

  // ─── 06: Duplicate Variants ───────────────────────────────────────────────
  {
    id: 'video-06',
    title: 'Duplicate Variants',
    music: 'musics/snoozy beats - blue moon.mp3',
    screens: [
      {
        type: 'hook',
        duration: 5,
        text: 'Same product. Same size. Listed twice.',
        subtext: 'Customers are confused — and leaving.',
      },
      {
        type: 'content',
        duration: 8,
        headline: 'Bulk imports create duplicate chaos.',
        body: 'Duplicate variants from CSV imports and manual errors cause inventory mismatches, wrong orders, and eroded customer trust.',
      },
      {
        type: 'stat',
        duration: 7,
        stat: '8%',
        label: 'of wrong orders',
        context: 'in Shopify stores are traced back to duplicate variants',
      },
      {
        type: 'content',
        duration: 8,
        headline: 'Find every duplicate SKU instantly.',
        body: 'Checkpoint scans your entire product catalog for duplicate SKUs and variant combinations — with one-click navigation to fix them.',
        accent: true,
      },
      { type: 'cta', duration: 7 },
    ],
  },

  // ─── 07: Missing Alt Texts ────────────────────────────────────────────────
  {
    id: 'video-07',
    title: 'Missing Alt Texts',
    music: 'musics/snoozy beats - ocean chill.mp3',
    screens: [
      {
        type: 'hook',
        duration: 5,
        text: 'Your store is invisible to Google Images.',
        subtext: 'And to visually impaired shoppers.',
      },
      {
        type: 'content',
        duration: 8,
        headline: "Alt text is free SEO — and you're ignoring it.",
        body: "Product images without alt text are invisible to search engines and screen readers. You're leaving traffic and trust on the table.",
      },
      {
        type: 'stat',
        duration: 7,
        stat: '+25%',
        label: 'image search traffic',
        context: 'the average gain from fixing missing alt text across products',
      },
      {
        type: 'content',
        duration: 8,
        headline: "Know exactly what's missing.",
        body: "Checkpoint audits alt text coverage across all your products and highlights every image that's hurting your SEO.",
        accent: true,
      },
      { type: 'cta', duration: 7 },
    ],
  },

  // ─── 08: Unused Metafields ────────────────────────────────────────────────
  {
    id: 'video-08',
    title: 'Unused Metafields',
    music: 'musics/snoozy beats - Dreamy Whispers.mp3',
    screens: [
      {
        type: 'hook',
        duration: 5,
        text: 'Your store is carrying hidden baggage.',
        subtext: "And it's slowing everything down.",
      },
      {
        type: 'content',
        duration: 8,
        headline: 'Old metafields never clean themselves up.',
        body: 'Deprecated app metafields and manual entries pile up over time — adding database weight, cluttering the admin, and doing absolutely nothing.',
      },
      {
        type: 'stat',
        duration: 7,
        stat: '200+',
        label: 'orphaned metafield entries',
        context: "found in the average Shopify store that's been running 2+ years",
      },
      {
        type: 'content',
        duration: 8,
        headline: 'Map every metafield in one scan.',
        body: 'Checkpoint shows you every metafield definition in your store and flags the ones that nothing is actively using.',
        accent: true,
      },
      { type: 'cta', duration: 7 },
    ],
  },

  // ─── 09: Theme Code Debt ──────────────────────────────────────────────────
  {
    id: 'video-09',
    title: 'Theme Code Debt',
    music: 'musics/snoozy beats - Moonlight Chaser.mp3',
    screens: [
      {
        type: 'hook',
        duration: 5,
        text: 'Your theme has 3 years of dead code in it.',
        subtext: 'It shows.',
      },
      {
        type: 'content',
        duration: 8,
        headline: 'Technical debt is a stealth tax.',
        body: "Old sections, commented-out scripts, and unused snippets from past developers make your theme fragile, slow, and expensive to update.",
      },
      {
        type: 'stat',
        duration: 7,
        stat: '2s',
        label: 'added to page load',
        context: 'theme bloat alone can cost you up to 2 extra seconds',
      },
      {
        type: 'content',
        duration: 8,
        headline: 'Surface dead code before it costs you.',
        body: 'Checkpoint analyzes your theme structure and flags unused sections, orphaned snippets, and risky customizations.',
        accent: true,
      },
      { type: 'cta', duration: 7 },
    ],
  },

  // ─── 10: Pre-launch Checklist ─────────────────────────────────────────────
  {
    id: 'video-10',
    title: 'Pre-Launch Checklist',
    music: 'musics/snoozy beats - Sunshine in My Pocket.mp3',
    screens: [
      {
        type: 'hook',
        duration: 5,
        text: '5 things that will break on launch day.',
        subtext: 'Check them now — not after.',
      },
      {
        type: 'list-item',
        duration: 6,
        number: '01',
        headline: 'Missing product images',
        body: 'Broken media files that customers will see on day one.',
      },
      {
        type: 'list-item',
        duration: 6,
        number: '02',
        headline: 'Discount codes that silently fail',
        body: 'Misconfigured codes that reject customers at checkout.',
      },
      {
        type: 'list-item',
        duration: 6,
        number: '03',
        headline: 'Blank SEO fields',
        body: 'Products invisible to Google from the moment you go live.',
      },
      {
        type: 'list-item',
        duration: 6,
        number: '04',
        headline: 'Ghost scripts from old apps',
        body: 'Code still loading from apps you removed months ago.',
      },
      {
        type: 'list-item',
        duration: 6,
        number: '05',
        headline: 'Orphaned metafields',
        body: 'Unused data slowing your storefront on day one.',
      },
      {
        type: 'content',
        duration: 7,
        headline: 'Run one scan. Fix everything before launch.',
        body: 'Checkpoint finds all five — and more — in a single automated store audit.',
        accent: true,
      },
      { type: 'cta', duration: 7 },
    ],
  },
];
