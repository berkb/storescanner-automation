FROM node:20-slim

RUN apt-get update && apt-get install -y \
  chromium \
  fonts-noto-color-emoji \
  fonts-liberation \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

COPY scripts/ ./scripts/

EXPOSE 3457

CMD ["node", "scripts/carousel-server.mjs"]
