module.exports = {
  apps: [
    {
      name: 'n8n',
      script: '/Users/berkbelcioglu/.nvm/versions/node/v20.19.2/bin/n8n',
      args: 'start',
      env: {
        NODES_EXCLUDE: '[]',
        EXECUTIONS_TIMEOUT: '14400',
      },
    },
    {
      name: 'render-server',
      script: 'scripts/render-server.mjs',
      cwd: __dirname,
      interpreter: '/Users/berkbelcioglu/.nvm/versions/node/v20.19.2/bin/node',
      max_memory_restart: '2G',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'carousel-server',
      script: 'scripts/carousel-server.mjs',
      cwd: '/Users/berkbelcioglu/GhostThemeAppScanner/marketing-automation',
      interpreter: '/Users/berkbelcioglu/.nvm/versions/node/v20.19.2/bin/node',
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PUPPETEER_CACHE_DIR: '/Users/berkbelcioglu/.cache/puppeteer',
      },
    },
  ],
};
