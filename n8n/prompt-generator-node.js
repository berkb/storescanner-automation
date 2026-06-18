// n8n Code Node — Haftalık dinamik prompt üretici
// Bağlantı: Schedule Trigger → Bu Node → HTTP Request (Groq)

const now = new Date();
const weekNumber = Math.ceil((((now - new Date(now.getFullYear(), 0, 1)) / 86400000) + 1) / 7);

const themes = [
  {
    angle: "unused scripts and performance impact after app changes",
    example: "A store had 4 unused third-party scripts slowing checkout. Checkpoint detected them in one scan.",
    question: "How do I know if uninstalled apps left scripts behind?"
  },
  {
    angle: "agency post-launch QA workflow and client handoff quality",
    example: "An agency used Checkpoint after every theme deployment to catch leftover code before client sign-off.",
    question: "What should agencies check after a Shopify theme launch?"
  },
  {
    angle: "theme cleanup and leftover fragments from old apps",
    example: "A merchant found 6 theme fragments from apps uninstalled 6 months ago. All flagged by Checkpoint.",
    question: "Do unused theme sections affect store speed?"
  },
  {
    angle: "product and discount health gaps affecting conversion",
    example: "Checkpoint found 12 products with missing descriptions and 3 broken discount codes in one scan.",
    question: "What product data issues most affect conversion rates?"
  }
];

const theme = themes[weekNumber % themes.length];

const prompt = `You are a growth strategist for a Shopify app called Store Health: Audit & Scan. Audience: Shopify merchants and agencies. Tone: clear, direct, no hype. No emojis. No em dashes.

This week's focus angle: ${theme.angle}
Real example to reference: ${theme.example}
Common merchant question this week: ${theme.question}

Output EXACTLY in this format with these labels, nothing else:

LINKEDIN_1: [post text]

LINKEDIN_2: [post text]

X_1: [post text]

X_2: [post text]

X_3: [post text]

REDDIT: [value-first post with title, not salesy]

OUTREACH_DM: [warm short agency DM]

FAQ: [2-4 sentence answer to the merchant question above]

Rules: each post must have one CTA, max 4 hashtags where relevant, use the real example above as reference in at least one post.`;

const groqBody = JSON.stringify({
  model: "llama-3.3-70b-versatile",
  messages: [{ role: "user", content: prompt }],
  max_tokens: 2000
});

return [{ json: { prompt, groqBody, weekNumber, theme: theme.angle } }];
