// n8n Code Node — Groq çıktısını parse et, Buffer için schedule hazırla
// Bağlantı: HTTP Request (Groq) → Code → HTTP Request (Buffer)

const content = $input.first().json.choices[0].message.content;
const sections = content.split('\n\n');
const result = [];

const channelMap = {
  'LINKEDIN_1': '69b5e5cc7be9f8b1715894e5',
  'LINKEDIN_2': '69b5e5cc7be9f8b1715894e5',
  'X_1':        '69b5e5e97be9f8b171589523',
  'X_2':        '69b5e5e97be9f8b171589523',
  'X_3':        '69b5e5e97be9f8b171589523'
};

// Pazartesiden başlayarak gün/saat offsetleri (UTC)
const scheduleOffsets = {
  'LINKEDIN_1': { day: 0, hour: 10 },
  'X_1':        { day: 1, hour: 11 },
  'LINKEDIN_2': { day: 2, hour: 10 },
  'X_2':        { day: 3, hour: 11 },
  'X_3':        { day: 4, hour: 10 }
};

// Bu haftanın Pazartesisini bul
const now = new Date();
const dayOfWeek = now.getDay();
const monday = new Date(now);
monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
monday.setHours(0, 0, 0, 0);

for (const section of sections) {
  const trimmed = section.trim();
  if (!trimmed) continue;

  for (const label of Object.keys(channelMap)) {
    if (trimmed.startsWith(label + ':')) {
      const text = trimmed.replace(label + ':', '').trim().replace(/"/g, "'").replace(/\n/g, ' ');
      const channelId = channelMap[label];
      const offset = scheduleOffsets[label];

      const postDate = new Date(monday);
      postDate.setDate(monday.getDate() + offset.day);
      postDate.setHours(offset.hour, 0, 0, 0);

      // Tarih geçmişte kaldıysa bir sonraki haftaya at
      if (postDate < now) postDate.setDate(postDate.getDate() + 7);

      const dueAt = postDate.toISOString();

      const query = `mutation CreatePost { createPost(input: { channelId: "${channelId}" text: "${text}" schedulingType: automatic mode: customScheduled dueAt: "${dueAt}" }) { ... on PostActionSuccess { post { id status dueAt } } ... on RestProxyError { message } } }`;
      const body = JSON.stringify({ query });
      result.push({ json: { label, text, body, channelId, dueAt } });
      break;
    }
  }
}

return result;
