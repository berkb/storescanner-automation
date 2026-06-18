/**
 * generate-script.mjs
 *
 * Groq API ile bir konu için video script üretir.
 * Çıktı: VideoTemplate'in beklediği screens dizisi + captions
 */

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function generateScript(topic) {
  const prompt = `You are writing content for a 30-45 second vertical video about Store Health: Audit & Scan, a Shopify app that audits stores for hidden issues.

Topic: ${topic.id}
Hook: ${topic.hook}
Context: ${topic.context}

Generate a complete video script. Output ONLY valid JSON, no markdown, no explanation:

{
  "screens": [
    { "type": "hook", "duration": 5, "text": "...", "subtext": "..." },
    { "type": "content", "duration": 8, "headline": "...", "body": "..." },
    { "type": "stat", "duration": 7, "stat": "...", "label": "...", "context": "..." },
    { "type": "content", "duration": 8, "headline": "...", "body": "...", "accent": true },
    { "type": "cta", "duration": 7 }
  ],
  "captions": {
    "youtube": {
      "title": "...",
      "description": "...",
      "tags": ["tag1", "tag2"]
    },
    "tiktok": { "caption": "..." },
    "instagram": { "caption": "..." }
  }
}

Rules:
- hook.text: max 8 words, punchy statement or question
- hook.subtext: optional, max 8 words, adds contrast or consequence
- content.headline: max 8 words
- content.body: max 25 words, plain language
- stat.stat: a number like "73%", "3-7", "$4k", "2s" — make it specific and believable
- stat.label: max 5 words describing what the stat measures
- stat.context: max 12 words explaining significance
- youtube.title: max 90 chars, SEO-friendly, include "Checkpoint" or "Shopify"
- youtube.tags: 10-12 tags as array
- tiktok.caption: 1-2 natural sentences that mention "Store Health: Audit & Scan" and embed the URL https://apps.shopify.com/checkpoint-store-scanner inline (not on its own line), then \n\n, then 5-8 topic-specific hashtags. Example: "After a theme update, use Store Health: Audit & Scan to audit your store. https://apps.shopify.com/checkpoint-store-scanner Check for script errors and content gaps.\n\n#ShopifyApps #ThemeUpdate #Shopify"
- instagram.caption: same style as tiktok but slightly different wording. Embed URL inline the same way.
- youtube.description: same style as tiktok — 1-2 sentences with URL embedded inline, then \n\n, then 5-8 hashtags.
- No emojis. No "Powered by" lines. No separate URL-only lines.
- No quotes around values
- All text in English`;

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({
      model:       'llama-3.3-70b-versatile',
      messages:    [{ role: 'user', content: prompt }],
      max_tokens:  1200,
      temperature: 0.7,
    }),
  });

  const data = await res.json();
  if (data.error) throw new Error(`Groq error: ${data.error.message}`);

  const raw = data.choices[0].message.content.trim();

  // JSON bloğunu çıkar (markdown code block varsa temizle)
  const jsonStr = raw.replace(/^```json?\n?/, '').replace(/\n?```$/, '').trim();

  // String literal içindeki kontrol karakterlerini temizle (Groq bazen literal \n üretiyor)
  function sanitizeJson(str) {
    return str.replace(/"(?:[^"\\]|\\.)*"/g, m =>
      m.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t')
    );
  }

  let script;
  try {
    script = JSON.parse(sanitizeJson(jsonStr));
  } catch (e) {
    // Retry once on JSON parse failure
    const res2 = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        model:       'llama-3.3-70b-versatile',
        messages:    [{ role: 'user', content: prompt }],
        max_tokens:  1200,
        temperature: 0.4,
      }),
    });
    const data2 = await res2.json();
    if (data2.error) throw new Error(`Groq error (retry): ${data2.error.message}`);
    const raw2   = data2.choices[0].message.content.trim();
    const json2  = raw2.replace(/^```json?\n?/, '').replace(/\n?```$/, '').trim();
    try {
      script = JSON.parse(sanitizeJson(json2));
    } catch (e2) {
      throw new Error(`Groq JSON parse hatası: ${e2.message}\nRaw: ${raw2.slice(0, 200)}`);
    }
  }

  // CTA ekranı yoksa ekle
  if (!script.screens.find(s => s.type === 'cta')) {
    script.screens.push({ type: 'cta', duration: 7 });
  }

  return script;
}
