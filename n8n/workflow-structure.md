# n8n Workflow — Checkpoint Weekly Content Engine

## Çalışma Zamanı
Her Pazartesi sabah 09:00

## Workflow Akışı

```
Schedule Trigger (Pazartesi 09:00)
  └── HTTP Request — Groq API (içerik üret)
        ├── Send Email — Gmail SMTP (tüm içerik maili)
        └── Code Node — postları parse et + schedule hesapla
              └── HTTP Request — Buffer GraphQL API (postları kuyruğa ekle)
```

## Yayın Takvimi
| Label       | Platform  | Gün        | Saat (UTC) |
|-------------|-----------|------------|------------|
| LINKEDIN_1  | LinkedIn  | Pazartesi  | 10:00      |
| X_1         | X         | Salı       | 11:00      |
| LINKEDIN_2  | LinkedIn  | Çarşamba   | 10:00      |
| X_2         | X         | Perşembe   | 11:00      |
| X_3         | X         | Cuma       | 10:00      |

## Buffer Channel ID'leri
- LinkedIn: 69b5e5cc7be9f8b1715894e5
- X:        69b5e5e97be9f8b171589523

## Buffer GraphQL Endpoint
- URL: https://api.buffer.com
- Auth: Authorization: Bearer BUFFER_API_KEY

## Groq Model
- llama-3.3-70b-versatile
- max_tokens: 2000

## Email (SMTP)
- Host: smtp.gmail.com
- Port: 465
- SSL: true

## n8n Başlatma
```bash
pm2 start n8n   # arka planda çalıştır
pm2 save        # Mac restart sonrası da çalışsın
```
