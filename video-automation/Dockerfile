FROM node:20-slim

RUN apt-get update && apt-get install -y \
  chromium \
  fonts-noto-color-emoji \
  fonts-liberation \
  ffmpeg \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 3456

CMD ["node", "scripts/render-server.mjs"]
