/**
 * carousel-template.mjs
 * Generates branded HTML for Store Health LinkedIn carousel PDF.
 *
 * Brand:
 *   Accent  #B9FF66 (lime)
 *   Ink     #191A23 (dark)
 *   Paper   #F3F3F3 (light)
 *   Font    Inter (Google Fonts)
 *
 * Page size: 1080 x 1350 px (LinkedIn portrait carousel)
 */

const PAGE_W = 1080;
const PAGE_H = 1350;

function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function brandBlock({ dark = false } = {}) {
  const labelColor = dark ? 'rgba(243,243,243,.55)' : 'rgba(25,26,35,.50)';
  return `
    <div class="brand-block">
      <span class="brand-label" style="color:${labelColor};">Powered by</span>
      <div class="brand-row">
        <div class="brand-dot"></div>
        <span class="brand-name">Checkpoint: Store Scanner</span>
      </div>
    </div>
  `;
}

function pageWrap(inner, opts = {}) {
  const bg = opts.dark ? '#191A23' : '#F3F3F3';
  const fg = opts.dark ? '#F3F3F3' : '#191A23';
  return `
  <section class="page" style="background:${bg};color:${fg};">
    ${inner}
  </section>`;
}

function coverPage({ totalUpdates }) {
  return pageWrap(
    `
    <div class="cover">
      <div class="cover-top">
        ${brandBlock({ dark: true })}
      </div>
      <div class="cover-mid">
        <h1 class="cover-title">
          Shopify <span class="hl">Weekly</span><br/>
          Changelog
        </h1>
        <p class="cover-sub">${totalUpdates} update${totalUpdates === 1 ? '' : 's'} from the past 7 days.</p>
      </div>
      <div class="cover-bottom">
        <div class="swipe-hint">
          <span>Swipe</span>
          <svg width="38" height="14" viewBox="0 0 38 14" fill="none">
            <path d="M1 7H35M35 7L29 1M35 7L29 13" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  `,
    { dark: true }
  );
}

const ORDINAL_WORDS = [
  'First',
  'Second',
  'Third',
  'Fourth',
  'Fifth',
  'Sixth',
  'Seventh',
  'Eighth',
  'Ninth',
  'Tenth',
  'Eleventh',
  'Twelfth',
];

function ordinalLabel(index) {
  const word = ORDINAL_WORDS[index - 1];
  if (word) return `${word} update`;
  const n = index;
  const suffix = n % 100 >= 11 && n % 100 <= 13
    ? 'th'
    : ['th', 'st', 'nd', 'rd'][n % 10] || 'th';
  return `${n}${suffix} update`;
}

function slidePage({ index, total, emoji, title, body }) {
  return pageWrap(`
    <div class="slide">
      <header class="slide-head">
        <span class="slide-counter">${escapeHtml(ordinalLabel(index))}</span>
        <span class="slide-brand">Weekly Shopify Changelog</span>
      </header>
      <div class="slide-body">
        <div class="slide-emoji">${emoji || '📦'}</div>
        <h2 class="slide-title">${escapeHtml(title)}</h2>
        <p class="slide-text">${escapeHtml(body)}</p>
      </div>
      <footer class="slide-foot">
        <div class="lime-bar"></div>
      </footer>
    </div>
  `);
}

function closingPage({ closing }) {
  return pageWrap(
    `
    <div class="closing">
      <header class="slide-head">
        <span class="slide-counter pill">The take</span>
        <span class="slide-brand">Weekly Shopify Changelog</span>
      </header>
      <div class="closing-body">
        <div class="quote-mark">"</div>
        <p class="closing-text">${escapeHtml(closing)}</p>
      </div>
      <footer class="slide-foot">
        <div class="lime-bar"></div>
      </footer>
    </div>
  `
  );
}

function outroPage() {
  return pageWrap(
    `
    <div class="outro">
      <div class="outro-top">
        ${brandBlock({ dark: true })}
      </div>
      <div class="outro-mid">
        <h2 class="outro-title">
          Found this useful?<br/>
          <span class="hl">Follow for weekly Shopify recaps.</span>
        </h2>
        <ul class="outro-list">
          <li>Every Monday, every changelog item</li>
          <li>No fluff, no hype, no recycled press releases</li>
          <li>Built for store builders and Shopify partners</li>
        </ul>
      </div>
      <div class="outro-bottom">
        <span class="outro-link">storehealth.app</span>
        <span class="outro-link muted">changelog.shopify.com</span>
      </div>
    </div>
  `,
    { dark: true }
  );
}

export function buildCarouselHtml({ weekRange, slides, closing }) {
  const totalSlides = slides.length;
  const pages = [
    coverPage({ weekRange, totalUpdates: totalSlides }),
    ...slides.map((s, i) =>
      slidePage({
        index: i + 1,
        total: totalSlides,
        emoji: s.emoji,
        title: s.title,
        body: s.body,
      })
    ),
    closingPage({ closing }),
    outroPage(),
  ];

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Shopify Weekly Changelog — ${escapeHtml(weekRange)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
  *,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background:#F3F3F3; }
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    color:#191A23;
  }

  .page {
    width: ${PAGE_W}px;
    height: ${PAGE_H}px;
    page-break-after: always;
    page-break-inside: avoid;
    position: relative;
    overflow: hidden;
    padding: 80px 80px;
    display: flex;
    flex-direction: column;
  }
  .page:last-child { page-break-after: auto; }

  .hl {
    color:#B9FF66;
  }

  .brand-block {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .brand-label {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }
  .brand-row {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .brand-dot {
    width: 18px;
    height: 18px;
    background: #B9FF66;
    border-radius: 50%;
    box-shadow: 0 0 0 4px rgba(185,255,102,.18);
  }
  .brand-name {
    font-weight: 700;
    font-size: 22px;
    letter-spacing: -0.01em;
  }

  /* COVER */
  .cover { display: flex; flex-direction: column; height: 100%; }
  .cover-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .cover-week {
    font-size: 18px;
    color: rgba(243,243,243,.65);
    font-weight: 500;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }
  .cover-mid {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 40px;
  }
  .cover-title {
    font-size: 132px;
    line-height: 0.95;
    font-weight: 900;
    letter-spacing: -0.04em;
  }
  .cover-sub {
    margin-top: 36px;
    font-size: 28px;
    line-height: 1.35;
    color: rgba(243,243,243,.78);
    max-width: 720px;
    font-weight: 400;
  }
  .cover-bottom {
    display: flex;
    justify-content: flex-end;
  }
  .swipe-hint {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    background: rgba(185,255,102,.14);
    color: #B9FF66;
    padding: 14px 22px;
    border-radius: 999px;
    font-weight: 600;
    font-size: 18px;
    letter-spacing: 0.02em;
  }

  /* SLIDE */
  .slide { display: flex; flex-direction: column; height: 100%; }
  .slide-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 32px;
    border-bottom: 1.5px solid rgba(25,26,35,.10);
  }
  .slide-counter {
    font-weight: 700;
    font-size: 18px;
    letter-spacing: 0.04em;
    color: rgba(25,26,35,.60);
  }
  .slide-counter.pill {
    background: #191A23;
    color: #B9FF66;
    padding: 8px 16px;
    border-radius: 999px;
    text-transform: uppercase;
    font-size: 14px;
    letter-spacing: 0.08em;
  }
  .slide-brand {
    font-size: 16px;
    color: rgba(25,26,35,.45);
    font-weight: 500;
  }
  .slide-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: -40px;
  }
  .slide-emoji {
    font-size: 92px;
    line-height: 1;
    margin-bottom: 36px;
  }
  .slide-title {
    font-size: 64px;
    line-height: 1.05;
    font-weight: 800;
    letter-spacing: -0.03em;
    margin-bottom: 32px;
    max-width: 880px;
  }
  .slide-text {
    font-size: 28px;
    line-height: 1.45;
    color: rgba(25,26,35,.78);
    font-weight: 400;
    max-width: 880px;
  }
  .slide-foot { display: flex; align-items: flex-end; }
  .lime-bar {
    width: 96px;
    height: 10px;
    background: #B9FF66;
    border-radius: 6px;
  }

  /* CLOSING */
  .closing { display: flex; flex-direction: column; height: 100%; }
  .closing-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: -40px;
  }
  .quote-mark {
    font-family: Georgia, serif;
    font-size: 200px;
    line-height: 0.7;
    color: #B9FF66;
    margin-bottom: 24px;
  }
  .closing-text {
    font-size: 42px;
    line-height: 1.25;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: #191A23;
    max-width: 880px;
  }

  /* OUTRO */
  .outro { display: flex; flex-direction: column; height: 100%; color: #F3F3F3; }
  .outro-top { display: flex; justify-content: space-between; }
  .outro-mid {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 40px;
  }
  .outro-title {
    font-size: 88px;
    line-height: 1.0;
    font-weight: 900;
    letter-spacing: -0.035em;
  }
  .outro-list {
    list-style: none;
    margin-top: 48px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .outro-list li {
    font-size: 24px;
    line-height: 1.3;
    color: rgba(243,243,243,.78);
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 18px;
  }
  .outro-list li::before {
    content: '';
    flex-shrink: 0;
    width: 12px;
    height: 12px;
    background: #B9FF66;
    border-radius: 50%;
  }
  .outro-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .outro-link {
    font-weight: 700;
    font-size: 22px;
    letter-spacing: -0.01em;
    color: #B9FF66;
  }
  .outro-link.muted {
    color: rgba(243,243,243,.40);
    font-weight: 500;
  }
</style>
</head>
<body>
${pages.join('\n')}
</body>
</html>`;
}

export const CAROUSEL_PAGE_SIZE = { width: PAGE_W, height: PAGE_H };
