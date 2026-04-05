// proxy.conf.js
const { env } = require('process');

// Определяем target с приоритетом: HTTPS порт → ASPNETCORE_URLS → дефолт
const target = env.ASPNETCORE_HTTPS_PORT 
  ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` 
  : env.ASPNETCORE_URLS 
    ? env.ASPNETCORE_URLS.split(';')[0].replace(/^https?:\/\//, 'http://') 
    : 'http://localhost:5292';

const PROXY_CONFIG = [
  {
    context: [
      '/api',
      '/uploads'
    ],
    target,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug' // опционально: для отладки
  }
];

module.exports = PROXY_CONFIG;
