// n8n Code Node — Groq çıktısını parse et, 7 gün için schedule hazırla
// Bağlantı: HTTP Request (Groq) → Bu Node → HTTP Request (Buffer)

const content = $input.first().json.choices[0].message.content;
const sections = content.split('\n');
const result = [];

// Kişisel kanal ID'leri
const X_CHANNEL = '69b5e5e97be9f8b171589523';
const LINKEDIN_CHANNEL = '69bbb1fe7be9f8b1717042b1';

// Bu haftanın Pazartesisini bul
const now = new Date();
const dayOfWeek = now.getDay();
const monday = new Date(now);
monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
monday.setHours(0, 0, 0, 0);

for (const line of sections) {
  const trimmed = line.trim();
  if (!trimmed) continue;

  const match = trimmed.match(/^DAY_(\d+):\s*(.+)$/);
  if (!match) continue;

  const dayIndex = parseInt(match[1]) - 1; // 0-6
  const text = match[2].trim().replace(/"/g, "'");

  // Her gün sabah 09:00 UTC
  const postDate = new Date(monday);
  postDate.setDate(monday.getDate() + dayIndex);
  postDate.setHours(9, 0, 0, 0);

  // Tarih geçmişte kaldıysa bir sonraki haftaya at
  if (postDate < now) postDate.setDate(postDate.getDate() + 7);

  const dueAt = postDate.toISOString();

  // X ve LinkedIn'e aynı içerik
  for (const channelId of [X_CHANNEL, LINKEDIN_CHANNEL]) {
    const query = `mutation CreatePost { createPost(input: { channelId: "${channelId}" text: "${text}" schedulingType: automatic mode: customScheduled dueAt: "${dueAt}" }) { ... on PostActionSuccess { post { id status dueAt } } ... on RestProxyError { message } } }`;
    const body = JSON.stringify({ query });
    result.push({ json: { day: dayIndex + 1, text, body, channelId, dueAt } });
  }
}

return result;
