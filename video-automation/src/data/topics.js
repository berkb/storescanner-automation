/**
 * topics.js
 *
 * Checkpoint: Store Scanner için video konu havuzu.
 * Her konu benzersiz bir ID'ye ve Groq'a verilecek bağlama sahip.
 * Kullanılan konular state/used-topics.json'da takip edilir.
 */

export const TOPICS = [
  // ─── App & Script Management ───────────────────────────────────────────────
  { id: 'leftover-scripts',      hook: 'You uninstalled the app. The code stayed.',              context: 'Ghost scripts from removed apps keep loading on every page, slowing the store invisibly.' },
  { id: 'app-script-conflicts',  hook: 'Your apps are fighting each other.',                     context: 'Multiple apps injecting scripts on the same page cause conflicts, errors, and slowdowns.' },
  { id: 'script-load-order',     hook: 'The order your scripts load matters more than you think.', context: 'Wrong script load order breaks functionality and delays page render.' },
  { id: 'zombie-snippets',       hook: 'Dead Liquid snippets are hiding in your theme.',          context: 'Unused Liquid snippets from old customizations add weight without value.' },

  // ─── Product & Catalog ─────────────────────────────────────────────────────
  { id: 'broken-images',         hook: 'What if 20% of your product images are broken?',         context: 'Broken CDN links and deleted files leave empty boxes where products should be.' },
  { id: 'missing-descriptions',  hook: 'Products with no description get no traffic.',           context: 'Empty product descriptions hurt SEO and conversion — customers bounce without context.' },
  { id: 'duplicate-variants',    hook: 'Same size. Listed twice. Customers are confused.',       context: 'Duplicate variants from bulk imports create inventory chaos and wrong orders.' },
  { id: 'orphaned-products',     hook: 'You have products no collection links to.',              context: 'Products not linked to any collection are invisible to browsing customers.' },
  { id: 'missing-alt-text',      hook: 'Your store is invisible to Google Images.',              context: 'Images without alt text are ignored by search engines and screen readers.' },
  { id: 'variant-price-gaps',    hook: 'Some of your variant prices are wrong.',                 context: 'Unintended price discrepancies between variants cause trust issues and disputes.' },
  { id: 'product-tag-mess',      hook: 'Your product tags are out of control.',                  context: 'Inconsistent tags break filtering, navigation, and automated collections.' },

  // ─── SEO ──────────────────────────────────────────────────────────────────
  { id: 'missing-meta',          hook: 'Google is looking at your store and finding nothing.',   context: 'Empty meta titles and descriptions mean zero organic visibility.' },
  { id: 'duplicate-meta',        hook: 'Two pages sharing the same meta title hurt both.',       context: 'Duplicate meta tags confuse Google and dilute your search rankings.' },
  { id: 'broken-canonical',      hook: 'Your canonical tags are pointing to the wrong pages.',   context: 'Wrong canonical URLs split link equity and create crawling confusion.' },
  { id: 'slow-core-web-vitals',  hook: 'Google is penalizing your store in search rankings.',   context: 'Poor Core Web Vitals directly reduce your search visibility on mobile.' },

  // ─── Performance ──────────────────────────────────────────────────────────
  { id: 'store-speed',           hook: 'Your store loads in 6 seconds. You lost the sale.',     context: 'Every extra second of load time costs 7% in conversions.' },
  { id: 'theme-bloat',           hook: 'Your theme has 3 years of dead code in it.',            context: 'Unused sections, snippets, and styles slow down every page.' },
  { id: 'render-blocking',       hook: 'Something is blocking your store from loading.',        context: 'Render-blocking scripts delay the first visible content on every page.' },
  { id: 'image-sizes',           hook: 'Your product images are 10x larger than they need to be.', context: 'Unoptimized images are the #1 cause of slow Shopify stores.' },
  { id: 'unused-css',            hook: 'Your store loads CSS it never uses.',                   context: 'Accumulated unused CSS from themes and apps bloats every page.' },

  // ─── Discounts & Checkout ─────────────────────────────────────────────────
  { id: 'broken-discounts',      hook: "Your discount codes aren't working. Customers are leaving.", context: 'Expired and misconfigured codes silently fail at checkout.' },
  { id: 'discount-conflicts',    hook: 'Your discounts are fighting each other.',               context: 'Overlapping discount rules cause unexpected behavior at checkout.' },
  { id: 'expired-discounts',     hook: 'You have 47 expired discount codes still showing.',     context: 'Old discounts clutter the admin and can be accidentally reactivated.' },
  { id: 'checkout-scripts',      hook: 'Something at checkout is slowing your conversions.',   context: 'Third-party checkout scripts add latency to the most critical page.' },

  // ─── Metafields & Data ────────────────────────────────────────────────────
  { id: 'unused-metafields',     hook: 'Your store is carrying hidden baggage.',               context: 'Orphaned metafields from old apps add weight and clutter without value.' },
  { id: 'metafield-debt',        hook: 'Metafields grow fast. Control slips faster.',          context: 'Inconsistent metafield naming across products creates data chaos.' },
  { id: 'empty-metafields',      hook: 'Half your metafields are empty.',                      context: 'Populated metafields that were never filled leave gaps in your storefront.' },

  // ─── Theme & Code Quality ─────────────────────────────────────────────────
  { id: 'theme-code-debt',       hook: "Your theme has 3 years of dead code. It shows.",       context: 'Accumulated code debt makes themes fragile and expensive to update.' },
  { id: 'broken-theme-sections', hook: 'Some of your theme sections are silently broken.',     context: 'Sections referencing deleted assets or settings throw hidden errors.' },
  { id: 'liquid-errors',         hook: 'Your theme is throwing Liquid errors on every page.',  context: 'Silent Liquid errors degrade performance and break dynamic content.' },
  { id: 'hardcoded-content',     hook: 'Your theme has hardcoded content you forgot about.',   context: 'Hardcoded text and URLs in theme files break during store migrations.' },

  // ─── Launch & QA ──────────────────────────────────────────────────────────
  { id: 'pre-launch-checklist',  hook: '5 things that will break on launch day.',              context: 'Missing images, broken codes, blank SEO fields, ghost scripts, orphaned metafields.' },
  { id: 'post-theme-update',     hook: '3 things to check after every theme update.',          context: 'Theme updates often break custom scripts, metafield usage, and content gaps.' },
  { id: 'app-uninstall-cleanup', hook: 'Before you uninstall that app, do this.',              context: 'Proper app removal requires cleaning leftover code, settings, and data.' },
  { id: 'store-migration-qa',    hook: 'Migrating your store? Here is what breaks silently.',  context: 'Store migrations commonly break product links, redirects, and script references.' },
  { id: 'agency-audit',          hook: 'How agencies audit Shopify stores in 5 minutes.',      context: 'Structured store audits catch issues before they become client problems.' },

  // ─── Customer Experience ──────────────────────────────────────────────────
  { id: 'broken-404s',           hook: 'You have dead links sending customers nowhere.',       context: 'Broken internal links and missing redirects lose traffic and damage trust.' },
  { id: 'missing-redirects',     hook: 'You deleted a product. The traffic is just gone.',    context: 'Missing 301 redirects after product deletion waste hard-earned SEO value.' },
  { id: 'nav-dead-ends',         hook: 'Your navigation sends customers to empty pages.',      context: 'Collection links pointing to empty or hidden collections frustrate shoppers.' },
  { id: 'compare-scans',         hook: 'One scan is useful. Two scans show proof.',            context: 'Before/after scan comparison proves the value of every improvement made.' },
  { id: 'store-health-score',    hook: 'What does a healthy Shopify store actually look like?', context: 'A store health score gives merchants a clear baseline and tracks improvement.' },
];
