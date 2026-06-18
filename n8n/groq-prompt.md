# Groq Prompt — Haftalık İçerik Paketi

## HTTP Request Ayarları
- Method: POST
- URL: https://api.groq.com/openai/v1/chat/completions
- Header: Authorization: Bearer GROQ_API_KEY
- Header: Content-Type: application/json

## JSON Body

```json
{
  "model": "llama-3.3-70b-versatile",
  "messages": [
    {
      "role": "user",
      "content": "You are a growth strategist for a Shopify app called Store Health: Audit & Scan. Audience: Shopify merchants and agencies. Tone: clear, direct, no hype. No emojis. No em dashes. Output EXACTLY in this format with these labels: LINKEDIN_1: [post text] LINKEDIN_2: [post text] X_1: [post text] X_2: [post text] X_3: [post text] REDDIT: [value-first post, not salesy, with title] OUTREACH_DM: [warm short agency DM] FAQ: [2-4 sentence answer to a common question] Each post must have one CTA. Max 4 hashtags where relevant. App: Checkpoint Store Scanner detects hidden Shopify store health issues after theme/app changes. Scans for unused scripts, theme leftovers, performance issues, product/discount gaps, prioritizes fixes by impact."
    }
  ],
  "max_tokens": 2000
}
```

## İçerik Çeşitliliği İçin Haftalık Eklenecekler
Her hafta prompt'un sonuna şunları ekle:
- Bu haftaki ürün değişikliği/güncelleme (1-2 cümle)
- Gerçek bir scan sonucu (örn: "3 unused scripts, 2 theme leftovers found")
- Bir merchant sorusu veya itirazı
