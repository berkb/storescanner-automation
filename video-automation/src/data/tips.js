/**
 * tips.js
 *
 * "Did you know?" series — Shopify tips pool.
 * One tip is pulled each day and rendered into a video.
 */

export const TIPS = [
  // ─── Admin Shortcuts ──────────────────────────────────────────────────────
  { id: 1,  category: 'admin',       hook: 'Press "/" in Shopify admin to instantly search.',          body: 'Hitting "/" focuses the search bar without touching your mouse. Faster navigation, zero clicks wasted.' },
  { id: 2,  category: 'admin',       hook: 'You can bulk print packing slips in one click.',           body: 'Select multiple orders in the order list and hit "Print packing slips" — all exported as a single PDF.' },
  { id: 3,  category: 'admin',       hook: 'Preview a product before saving it.',                      body: 'The "Preview" button shows your draft product on the live theme. See exactly what goes live before publishing.' },
  { id: 4,  category: 'admin',       hook: 'You can customize which columns appear in your lists.',    body: 'The "Columns" button on product, order, and customer lists lets you show only what you actually need.' },
  { id: 5,  category: 'admin',       hook: 'Editing multiple products in separate tabs works fine.',   body: 'Open different products in different browser tabs and edit them simultaneously — Shopify handles it without conflicts.' },

  // ─── Product & Catalog ────────────────────────────────────────────────────
  { id: 6,  category: 'product',     hook: 'You can set your own product URL slug.',                   body: 'Edit the URL handle under "Search engine listing" on any product page. Short, keyword-rich slugs help SEO significantly.' },
  { id: 7,  category: 'product',     hook: 'Reuse the same image across multiple products.',           body: 'Copy the CDN URL of any uploaded image and paste it on a different product. No re-uploading needed.' },
  { id: 8,  category: 'product',     hook: 'Bulk update products via CSV export and re-import.',       body: 'Export your catalog, make changes in a spreadsheet, re-import. Fastest way to update prices or descriptions at scale.' },
  { id: 9,  category: 'product',     hook: 'Each variant can have its own shipping weight.',           body: 'If size or material affects shipping cost, set a different weight per variant. Inaccurate weights mean wrong shipping rates.' },
  { id: 10, category: 'product',     hook: 'You can add video to product media, not just images.',    body: 'Paste a YouTube or Vimeo link, or upload an MP4 directly to product media. Most modern themes support it natively.' },
  { id: 11, category: 'product',     hook: 'Special characters in product titles hurt SEO.',           body: 'Symbols like ™, ®, or emojis in titles make it harder for search engines to index your products correctly.' },
  { id: 12, category: 'product',     hook: 'Manual collection sorting breaks above 50 products.',     body: 'Drag-and-drop reordering works well for small collections. Beyond 50 items, pagination makes it unreliable.' },

  // ─── SEO ──────────────────────────────────────────────────────────────────
  { id: 13, category: 'seo',         hook: 'Shopify auto-generates your sitemap.',                     body: 'Visit yourdomain.com/sitemap.xml to see it. Just submit that URL to Google Search Console — nothing else needed.' },
  { id: 14, category: 'seo',         hook: 'Collection descriptions outperform product descriptions for SEO.', body: 'Google treats collections like category pages. A well-written, keyword-rich description drives more organic traffic than individual products.' },
  { id: 15, category: 'seo',         hook: 'You can add 301 redirects directly in Shopify.',          body: 'Go to Online Store → Navigation → URL Redirects. Redirect deleted product or page URLs to avoid losing traffic.' },
  { id: 16, category: 'seo',         hook: 'Your image file names affect Google Images rankings.',    body: '"red-leather-wallet.jpg" ranks far better than "IMG_4821.jpg". Rename before uploading — you can\'t rename after.' },
  { id: 17, category: 'seo',         hook: 'Shopify\'s built-in blog is fully SEO-capable.',          body: 'Blog posts on your store are indexed like any web page. Writing about your products is one of the cheapest traffic sources available.' },
  { id: 18, category: 'seo',         hook: 'Shopify adds canonical tags automatically.',              body: 'Every page gets a canonical tag. On variant URLs, it points to the main product — this is correct behavior, not a bug.' },

  // ─── Performance ──────────────────────────────────────────────────────────
  { id: 19, category: 'performance', hook: 'Shopify converts your images to WebP automatically.',     body: 'You upload a JPEG, customers receive WebP. The CDN handles conversion for modern browsers with zero effort on your end.' },
  { id: 20, category: 'performance', hook: 'Resize images on the fly with a URL parameter.',         body: 'Append ?width=400 to any Shopify CDN image URL to get a resized version. No oversized images loading unnecessarily.' },
  { id: 21, category: 'performance', hook: 'Uninstalling an app doesn\'t remove its code.',          body: 'Shopify doesn\'t clean up theme files when an app is removed. Every uninstalled app leaves behind scripts that still load on every page.' },
  { id: 22, category: 'performance', hook: 'Unused CSS in your theme slows every page load.',        body: 'Years of app installs and theme tweaks accumulate dead CSS. Use Chrome DevTools Coverage tab to see how much is never used.' },
  { id: 23, category: 'performance', hook: 'Shopify\'s CDN runs on 200+ locations worldwide.',       body: 'Images uploaded to Shopify are served via Cloudflare\'s global CDN. Self-hosting your assets is almost always slower.' },

  // ─── Discounts ────────────────────────────────────────────────────────────
  { id: 24, category: 'discount',    hook: 'Limit a discount code to specific customers only.',      body: 'Under "Customer eligibility" when creating a discount, restrict it to specific segments or individual accounts.' },
  { id: 25, category: 'discount',    hook: 'Automatic discounts apply without a code.',              body: 'Automatic discounts trigger the moment the customer adds qualifying items to the cart. No code entry, higher conversion.' },
  { id: 26, category: 'discount',    hook: 'You can cap how many times a discount code is used.',    body: 'Set a total usage limit and a per-customer limit on any discount. "One use per customer" is easy to enforce natively.' },
  { id: 27, category: 'discount',    hook: 'Buy X Get Y discounts are built into Shopify.',          body: 'No app needed for "buy 2 get 1 free" or "spend $50 get 20% off" campaigns. It\'s all in the native discount builder.' },
  { id: 28, category: 'discount',    hook: 'You can import hundreds of unique discount codes via CSV.', body: 'Use the Import option in Discounts to upload a spreadsheet of unique codes at once. Essential for influencer campaigns.' },

  // ─── Checkout ─────────────────────────────────────────────────────────────
  { id: 29, category: 'checkout',    hook: 'Add an order notes field to checkout.',                  body: 'Enable "Order notes" in Settings → Checkout so customers can leave special instructions. No app required.' },
  { id: 30, category: 'checkout',    hook: 'Customize checkout branding on every plan.',             body: 'Settings → Checkout → Branding lets you add your logo, brand colors, and font. Available on all plans, not just Plus.' },
  { id: 31, category: 'checkout',    hook: 'Abandoned cart emails are built in.',                    body: 'Enable them under Settings → Checkout. Shopify sends recovery emails automatically — no third-party app needed.' },
  { id: 32, category: 'checkout',    hook: 'Place test orders without charging a real card.',        body: 'Activate Bogus Gateway and use card number 4111 1111 1111 1111 to simulate a full purchase flow.' },
  { id: 33, category: 'checkout',    hook: 'Show a free shipping progress bar in the cart.',        body: 'Most themes support a "X more for free shipping" bar natively. It reliably increases average order value.' },

  // ─── Customers ────────────────────────────────────────────────────────────
  { id: 34, category: 'customer',    hook: 'Customer tags enable automatic segmentation.',           body: 'Tag customers and use those tags to filter reports, apply discounts, or target email campaigns.' },
  { id: 35, category: 'customer',    hook: 'Customer notes are never visible to the customer.',      body: 'The Notes field on a customer profile is internal only. Use it like a lightweight CRM note.' },
  { id: 36, category: 'customer',    hook: 'Wholesale pricing is possible without Shopify Plus.',   body: 'Customer tags combined with Liquid conditionals can display different prices for B2B accounts on any plan.' },
  { id: 37, category: 'customer',    hook: 'Forcing account creation kills conversions.',            body: 'Stores without guest checkout abandon 35% more carts on average. Always offer the guest option.' },
  { id: 38, category: 'customer',    hook: 'Every notification email is fully customizable.',        body: 'Edit the HTML of order confirmations, shipping updates, and more under Settings → Notifications.' },

  // ─── Analytics ────────────────────────────────────────────────────────────
  { id: 39, category: 'analytics',   hook: 'Shopify\'s built-in reports are more powerful than most apps.', body: 'Analytics → Reports includes cohort analysis, customer lifetime value, and attribution reports. Most stores never open it.' },
  { id: 40, category: 'analytics',   hook: 'Live View shows real-time visitors on your store.',     body: 'Analytics → Live View displays current visitors, their location, and which page they\'re on — updated in real time.' },
  { id: 41, category: 'analytics',   hook: 'UTM parameters are tracked automatically by Shopify.',  body: 'Shopify reads UTM tags from any URL and attributes the resulting orders to the right campaign in your reports.' },
  { id: 42, category: 'analytics',   hook: 'Enter product costs to unlock profit reporting.',        body: 'Add "Cost per item" to your variants and Shopify calculates gross profit per order automatically.' },

  // ─── Theme & Liquid ───────────────────────────────────────────────────────
  { id: 43, category: 'theme',       hook: 'Assign long Liquid object chains to a variable.',        body: 'Use {% assign %} to shorten repetitive dot-notation chains. Cleaner code and slightly faster rendering.' },
  { id: 44, category: 'theme',       hook: 'Always duplicate your theme before making changes.',     body: 'Online Store → Themes → "..." → Duplicate. You get a full backup. Rolling back is one click.' },
  { id: 45, category: 'theme',       hook: 'Create multiple templates for the same page type.',      body: 'Duplicate product or collection templates to give specific items a completely different layout without touching the original.' },
  { id: 46, category: 'theme',       hook: 'Metafield values are accessible directly in Liquid.',   body: 'Use product.metafields.namespace.key in your theme files. Custom fields without an app — built into every plan.' },
  { id: 47, category: 'theme',       hook: 'Version-control your theme with Git.',                   body: 'Shopify CLI connects your theme to a local git repo. Every change is tracked and reversible.' },
  { id: 48, category: 'theme',       hook: 'Sections can include other sections in Shopify 2.0.',   body: '"Sections within sections" landed with Online Store 2.0. More modular, more reusable layouts with less code duplication.' },

  // ─── Metafields ───────────────────────────────────────────────────────────
  { id: 49, category: 'metafields',  hook: 'Choosing the right metafield type matters.',             body: 'Using Integer or JSON types instead of plain text adds validation, makes Liquid logic easier, and prevents bad data.' },
  { id: 50, category: 'metafields',  hook: 'Connect metafields in the theme editor — no code needed.', body: 'In themes like Dawn, click "Connect dynamic source" to link a metafield to a section block without writing any Liquid.' },
  { id: 51, category: 'metafields',  hook: 'Bulk-edit metafields across multiple products.',         body: 'Select products in the admin list and edit their metafield values in one operation. No third-party bulk editor needed.' },
  { id: 52, category: 'metafields',  hook: 'Collection metafields are great for bottom-of-page SEO text.', body: 'Add a long-form description metafield to collections and render it below the product grid. Clean layout, better SEO.' },

  // ─── Shipping ─────────────────────────────────────────────────────────────
  { id: 53, category: 'shipping',    hook: 'Print shipping labels directly from Shopify.',           body: 'Buy and print a shipping label from the order page with Shopify Shipping. No separate carrier account needed.' },
  { id: 54, category: 'shipping',    hook: 'Missing product weight breaks shipping rate calculation.', body: 'Weight-based shipping rules return wrong rates when variant weights are blank. Audit your catalog before going live.' },
  { id: 55, category: 'shipping',    hook: 'Create separate shipping profiles per product.',         body: 'Oversized or fragile items can have their own shipping rules. Not every product needs to follow the same rates.' },
  { id: 56, category: 'shipping',    hook: 'Block shipping to specific countries.',                  body: 'Settings → Shipping lets you exclude any country or region. Useful for high-risk markets or export-restricted goods.' },
  { id: 57, category: 'shipping',    hook: 'Local delivery and pickup are built into Shopify.',      body: 'No app needed. Settings → Shipping → Local delivery and Local pickup handle both scenarios natively.' },

  // ─── Inventory ────────────────────────────────────────────────────────────
  { id: 58, category: 'inventory',   hook: 'View the full history of every inventory change.',       body: 'Click "View inventory history" on any variant to see exactly when and why stock levels changed.' },
  { id: 59, category: 'inventory',   hook: 'Allow sales when stock hits zero.',                      body: 'Enable "Continue selling when out of stock" to keep accepting orders. Useful for backorder and pre-order models.' },
  { id: 60, category: 'inventory',   hook: 'Shopify has no native low-stock alert.',                 body: 'There is no built-in notification when inventory gets low. You need Shopify Flow or a third-party app for that.' },
  { id: 61, category: 'inventory',   hook: 'Track stock separately across multiple locations.',      body: 'Add warehouses, stores, or fulfillment centers in Settings → Locations. Each gets its own inventory count.' },

  // ─── Shopify Flow ─────────────────────────────────────────────────────────
  { id: 62, category: 'flow',        hook: 'Shopify Flow is free and extremely powerful.',           body: 'Order tagging, low-stock alerts, fraud flagging — dozens of automations with zero code. Most merchants ignore it entirely.' },
  { id: 63, category: 'flow',        hook: 'Auto-segment customers based on purchase behavior.',     body: 'Tag customers after their first order, then trigger a different discount or email sequence on their second purchase.' },
  { id: 64, category: 'flow',        hook: 'Flag high-risk orders automatically.',                   body: 'Flow can tag orders from new accounts or over a certain value for manual review before fulfillment.' },
  { id: 65, category: 'flow',        hook: 'Flow has dozens of ready-made templates.',               body: 'Don\'t build from scratch. The Flow template library covers most common use cases — just copy and customize.' },

  // ─── Orders ───────────────────────────────────────────────────────────────
  { id: 66, category: 'orders',      hook: 'Send a custom invoice via Draft Orders.',                body: 'Orders → Create order lets you build a custom cart with negotiated prices and send the customer a direct payment link.' },
  { id: 67, category: 'orders',      hook: 'Enter phone and WhatsApp orders manually.',              body: 'Use Draft Orders to create and fulfill orders taken outside your storefront. Everything stays in one place.' },
  { id: 68, category: 'orders',      hook: 'Tag orders to build filterable queues.',                 body: 'Tags like "priority", "gift", or "wholesale" let you filter and action orders in bulk without a separate tool.' },
  { id: 69, category: 'orders',      hook: 'Staff notes on orders are never shown to customers.',   body: '"Staff notes" on the order detail page are internal only. Completely separate from the customer-facing order note.' },

  // ─── Gift Cards ───────────────────────────────────────────────────────────
  { id: 70, category: 'giftcard',    hook: 'Gift cards are created like products in Shopify.',       body: 'Go to Products → Gift cards to create digital or physical gift cards. No app required, works on all plans.' },
  { id: 71, category: 'giftcard',    hook: 'You can manually adjust a gift card balance.',           body: 'Open any customer profile to issue a new gift card or edit an existing balance directly from the admin.' },

  // ─── Shopify Markets ──────────────────────────────────────────────────────
  { id: 72, category: 'markets',     hook: 'Show different prices to different countries.',          body: 'Shopify Markets lets you set country-specific pricing, currency, and language — all from one store.' },
  { id: 73, category: 'markets',     hook: 'Shopify converts currency automatically at checkout.',   body: 'With Markets active, Shopify detects the customer\'s currency and converts prices at checkout in real time.' },
  { id: 74, category: 'markets',     hook: 'Hide specific products in certain markets.',             body: 'Product visibility can be controlled per market. Products unavailable in a region simply don\'t appear there.' },

  // ─── Shopify POS ──────────────────────────────────────────────────────────
  { id: 75, category: 'pos',         hook: 'Shopify POS merges online and physical inventory.',      body: 'Every in-store sale updates the same inventory as your online store. No more manual syncing or dual spreadsheets.' },
  { id: 76, category: 'pos',         hook: 'Use your phone camera as a barcode scanner in POS.',    body: 'The Shopify POS app turns your camera into a barcode reader. No extra hardware needed to get started.' },

  // ─── Developer ────────────────────────────────────────────────────────────
  { id: 77, category: 'dev',         hook: 'Shopify\'s GraphQL API is significantly faster than REST.', body: 'One GraphQL request replaces what used to take five REST calls. Less latency, less rate-limit pressure.' },
  { id: 78, category: 'dev',         hook: 'Develop themes locally with Shopify CLI.',               body: 'Run shopify theme dev and changes sync to your store instantly. No more uploading files through the admin editor.' },
  { id: 79, category: 'dev',         hook: 'Webhooks let you connect Shopify to any external system.', body: 'Subscribe to order, inventory, or customer events and push data to your ERP, CRM, or custom backend in real time.' },
  { id: 80, category: 'dev',         hook: 'Shopify Functions bring checkout customization to all plans.', body: 'Custom discount logic, payment filtering, and shipping rules via Functions — features that used to require Plus.' },
  { id: 81, category: 'dev',         hook: 'Catch theme errors before going live with Theme Check.', body: 'Shopify CLI runs Theme Check against your theme files and flags Liquid errors, deprecated filters, and performance issues.' },

  // ─── Security ─────────────────────────────────────────────────────────────
  { id: 82, category: 'security',    hook: 'Enable two-factor authentication on your Shopify account.', body: 'Settings → Users → Security. 2FA is the single most effective protection against account takeover.' },
  { id: 83, category: 'security',    hook: 'Don\'t give staff full admin access by default.',        body: 'Assign only the permissions each role needs. A fulfillment team member doesn\'t need access to payment settings.' },
  { id: 84, category: 'security',    hook: 'Audit app permissions regularly.',                       body: 'Settings → Apps shows exactly what data each app can access. Remove any app you\'re no longer using.' },
  { id: 85, category: 'security',    hook: 'Shopify includes built-in fraud analysis on every order.', body: 'Each order gets an automatic fraud risk score. Review high-risk orders before fulfilling — it\'s already there, just use it.' },

  // ─── Email Marketing ──────────────────────────────────────────────────────
  { id: 86, category: 'email',       hook: 'Send campaigns with Shopify Email — no app needed.',    body: 'Shopify Email is free up to 10,000 emails per month. For basic campaigns, you may not need Klaviyo at all.' },
  { id: 87, category: 'email',       hook: 'Export your email list directly from Shopify.',         body: 'Customers → Export gives you a CSV of all subscribed contacts. Import it into any email platform in seconds.' },
  { id: 88, category: 'email',       hook: 'Double opt-in produces a cleaner, higher-converting list.', body: 'Stores using double opt-in see 90% fewer spam complaints. The list is smaller but every subscriber actually wants to hear from you.' },

  // ─── Conversion ───────────────────────────────────────────────────────────
  { id: 89, category: 'conversion',  hook: '"Only 3 left" warnings increase conversions.',          body: 'Show a low-stock message when variant inventory drops below 5. Creates urgency without being dishonest.' },
  { id: 90, category: 'conversion',  hook: 'A Q&A section on product pages helps SEO and trust.',  body: 'Answering customer questions on the product page ranks for long-tail search queries and reduces pre-purchase hesitation.' },
  { id: 91, category: 'conversion',  hook: 'A return policy page lifts conversion rates.',         body: 'Stores with a visible "30-day return" policy convert 19% better on average. Confidence removes the final hesitation.' },
  { id: 92, category: 'conversion',  hook: 'A checkout progress bar reduces abandonment.',         body: 'When customers know they\'re on step 2 of 3, they\'re more likely to finish. Most themes support this natively.' },

  // ─── General ──────────────────────────────────────────────────────────────
  { id: 93, category: 'general',     hook: 'Password-protect your store during development.',       body: 'Online Store → Preferences → Password protection keeps your store private until you\'re ready to launch.' },
  { id: 94, category: 'general',     hook: 'Test mode can accidentally capture real payments.',     body: 'If a live payment method is active alongside Bogus Gateway, real charges can go through. Always disable test mode after testing.' },
  { id: 95, category: 'general',     hook: 'Add a custom message to your maintenance page.',        body: 'When password protection is on, you can edit the page message. "Back soon" is better than a blank login screen.' },
  { id: 96, category: 'general',     hook: 'Shopify has a public status page.',                    body: 'status.shopify.com shows the real-time health of every Shopify service. Check here first before opening a support ticket.' },
  { id: 97, category: 'general',     hook: 'Downgrading your plan disables certain features.',      body: 'Before downgrading, check which reports, staff accounts, and integrations will be turned off. Some changes are hard to reverse.' },
  { id: 98, category: 'general',     hook: 'A Shopify Partner account is free.',                   body: 'Partners get unlimited development stores to build and test on. Essential if you\'re setting up stores for clients.' },
  { id: 99, category: 'general',     hook: 'Annual billing saves 25% compared to monthly.',        body: 'If you\'re committed to Shopify long-term, annual billing is straightforward savings. Evaluate after your free trial ends.' },
  { id: 100, category: 'general',    hook: 'Almost every Shopify problem has been solved on the community forum.', body: 'community.shopify.com has years of answered threads. Search there before spending time on a support ticket.' },
];
