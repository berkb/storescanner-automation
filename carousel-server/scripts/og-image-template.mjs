const CATEGORY_COLORS = {
  app:              { bg: '#B9FF66', text: '#191A23', label: 'Checkpoint App' },
  'shopify-updates': { bg: '#60a5fa', text: '#ffffff', label: 'Shopify Updates' },
  'shopify-tips':    { bg: '#38d6c6', text: '#191A23', label: 'Shopify Tips'    },
};

export function buildOgImageHtml({ title, description, category = 'app' }) {
  const cat = CATEGORY_COLORS[category] || CATEGORY_COLORS['app'];

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    width: 1200px;
    height: 630px;
    overflow: hidden;
    background: #191A23;
    font-family: Inter, ui-sans-serif, system-ui, sans-serif;
    position: relative;
  }

  /* Background glow */
  .glow {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      radial-gradient(600px 400px at 90% -10%, rgba(185,255,102,.18), transparent 60%),
      radial-gradient(500px 350px at 0% 100%, rgba(96,165,250,.14), transparent 60%);
  }

  .content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    padding: 56px 72px;
  }

  /* Top row */
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: ${cat.bg};
    color: ${cat.text};
    font-size: 18px;
    font-weight: 600;
    padding: 8px 18px;
    border-radius: 100px;
  }

  .badge-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${cat.text};
    opacity: 0.5;
  }

  .logo {
    font-size: 18px;
    font-weight: 700;
    color: rgba(255,255,255,0.5);
    letter-spacing: -0.3px;
  }

  /* Middle — title */
  .middle {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 32px 0 16px;
  }

  .title {
    font-size: 58px;
    font-weight: 800;
    color: #ffffff;
    line-height: 1.1;
    letter-spacing: -1.5px;
    max-width: 900px;
  }

  /* Bottom row */
  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .description {
    font-size: 22px;
    font-weight: 400;
    color: rgba(255,255,255,0.55);
    line-height: 1.5;
    max-width: 820px;
  }

  .domain {
    font-size: 17px;
    font-weight: 500;
    color: rgba(255,255,255,0.3);
    white-space: nowrap;
    margin-left: 32px;
  }
</style>
</head>
<body>
  <div class="glow"></div>
  <div class="content">
    <div class="top">
      <div class="badge">
        <span class="badge-dot"></span>
        ${cat.label}
      </div>
      <div class="logo">Store Scanner</div>
    </div>

    <div class="middle">
      <h1 class="title">${title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')}</h1>
    </div>

    <div class="bottom">
      <p class="description">${description.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')}</p>
      <span class="domain">storehealth.app</span>
    </div>
  </div>
</body>
</html>`;
}
