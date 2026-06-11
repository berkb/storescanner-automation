# n8n Workflow — Shopify Changelog Personal Posts

## Çalışma Zamanı
Her Pazartesi sabah 08:00 (Checkpoint workflow'undan 1 saat önce)

## Workflow Akışı

```
Schedule Trigger (Pazartesi 08:00)
  └── HTTP Request — Shopify Changelog RSS
        └── Code Node — prompt üret (prompt-generator-node.js)
              └── HTTP Request — Groq API
                    └── Code Node — parse + schedule (code-node.js)
                          └── HTTP Request — Buffer GraphQL API
```

## RSS Feed
- URL: https://changelog.shopify.com/feed.xml

## Yayın Takvimi
Her gün 09:00 UTC — Pazartesi'den Pazar'a 1 post/gün
Hem X hem LinkedIn'e aynı içerik gider.

## Kişisel Kanal ID'leri
- X (personal):        69b5e5e97be9f8b171589523
- LinkedIn (personal): 69bbb1fe7be9f8b1717042b1

## İçerik Stili
- Kişisel bakış açısı (first person)
- Shopify güncellemesinin merchant/developer için önemi
- 280 karakter altı (X uyumlu)
- Ürün mention yok
