// n8n Code Node — Shopify changelog'dan günlük post üretici
// Bağlantı: HTTP Request (changelog RSS) → Bu Node → HTTP Request (Groq)

const items = $input.all();

// RSS'ten gelen son 7 entry'yi al
const entries = items.slice(0, 7).map((item, i) => {
  const title = item.json.title || item.json['title'] || '';
  const summary = item.json.summary || item.json.content || item.json.description || '';
  return `${i + 1}. ${title}: ${summary.replace(/<[^>]*>/g, '').substring(0, 200)}`;
}).join('\n');

const prompt = `You are a Shopify ecosystem expert sharing insights on your personal social media.
Audience: Shopify merchants, developers, and agencies.
Tone: Conversational, knowledgeable, no hype. No emojis. No em dashes. First person voice.

Here are the latest Shopify platform updates:
${entries}

Generate 7 short social media posts (one for each update above).
Each post must:
- Be written from a personal expert perspective (not a company account)
- Explain why this update matters to merchants or developers
- Be under 280 characters for X compatibility
- Have one subtle CTA (follow for more updates, comment your thoughts, etc.)
- NOT mention any specific app or product

Output EXACTLY in this format:
DAY_1: [post text]
DAY_2: [post text]
DAY_3: [post text]
DAY_4: [post text]
DAY_5: [post text]
DAY_6: [post text]
DAY_7: [post text]`;

const groqBody = JSON.stringify({
  model: "llama-3.3-70b-versatile",
  messages: [{ role: "user", content: prompt }],
  max_tokens: 2000
});

return [{ json: { prompt, groqBody } }];
