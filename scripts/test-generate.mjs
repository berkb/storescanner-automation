/**
 * test-generate.mjs — End-to-end test for carousel-server.
 *
 * Usage:  npm run carousel:test
 * Hits the running carousel-server on port 3457 with sample data.
 */

const PORT = process.env.CAROUSEL_PORT || 3457;
const URL = `http://127.0.0.1:${PORT}/generate-carousel`;

const sample = {
  weekRange: 'Apr 14 — Apr 21, 2026',
  slides: [
    {
      emoji: '📊',
      title: 'Matches in ShopifyQL',
      body: 'ShopifyQL now supports the MATCHES operator for advanced customer-behavior filtering. Useful on high-SKU stores where repeat-purchase cohorts and behavioral segments need to be queried directly without exporting to a warehouse.',
    },
    {
      emoji: '📈',
      title: 'Compare Multiple Metrics On One Chart',
      body: 'Analytics charts can now plot multiple metrics on the same axis. Most relevant for stores running both online and POS where comparing traffic vs in-store sessions side by side reveals attribution gaps.',
    },
    {
      emoji: '🛒',
      title: 'Updates To Local Pickup UX In Checkout',
      body: 'Checkout now surfaces the first available local pickup location more prominently. Handy for merchants with dense pickup networks where the long list previously caused drop-off on mobile.',
    },
    {
      emoji: '⚡',
      title: 'Spot Trends With New Analytics Insights',
      body: 'Automated insights are now available to merchants with 10+ orders per week, surfacing Sessions and Fulfillments trends on the home feed. Cuts the manual reporting cycle for small-to-mid stores.',
    },
  ],
  closing:
    'Three of these touch analytics in the same week, which lines up with Shopify quietly rebuilding the reporting layer over the past quarter. Worth watching how the new insights interact with custom ShopifyQL reports already in production.',
};

console.log('[test] POST', URL);
console.log('[test] payload:', JSON.stringify({ weekRange: sample.weekRange, slides: sample.slides.length, closingChars: sample.closing.length }));

const t0 = Date.now();
const res = await fetch(URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(sample),
});
const elapsed = Date.now() - t0;
const json = await res.json();
console.log(`[test] status=${res.status} elapsed=${elapsed}ms`);
console.log(JSON.stringify(json, null, 2));
