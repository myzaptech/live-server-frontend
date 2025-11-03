/**
 * ============================================
 * CONFIGURACIÓN DE PRODUCCIÓN
 * ============================================
 * 
 * Archivo de configuración para el servidor de producción.
 * Cambia estos valores según tu droplet de DigitalOcean.
 */

const CONFIG = {
  // URL base de la API del servidor
  // Cambia esto por tu dominio o IP del droplet
  API_BASE_URL: 'https://myzaptech.site',  // Con HTTPS ya que tienes SSL configurado
  
  // URL base del servidor de medios (HLS)
  // Si usas Nginx, usa la misma URL que la API
  MEDIA_BASE_URL: 'https://myzaptech.site',
  
  // Stream key por defecto
  STREAM_KEY: 'live',
  
  // Intervalo de actualización de estadísticas (milisegundos)
  STATS_UPDATE_INTERVAL: 5000, // 5 segundos
  
  // Intervalo de verificación de estado (milisegundos)
  STATUS_CHECK_INTERVAL: 3000, // 3 segundos
  
  // Configuración de HLS.js
  HLS_CONFIG: {
    debug: false,
    enableWorker: true,
    lowLatencyMode: true,
    backBufferLength: 90,
    maxBufferLength: 30,
    maxMaxBufferLength: 600,
    maxBufferSize: 60 * 1000 * 1000, // 60 MB
    maxBufferHole: 0.5
  },
  
  // Timeout para peticiones HTTP (milisegundos)
  REQUEST_TIMEOUT: 10000, // 10 segundos
  
  // Tiempo de vida de las notificaciones toast (milisegundos)
  TOAST_DURATION: 4000, // 4 segundos
  
  // Máximo número de entradas en el log
  MAX_LOG_ENTRIES: 50,
  
  // Habilitar modo debug (desactivar en producción)
  DEBUG_MODE: false
};

// No modificar - construir URLs completas
CONFIG.ENDPOINTS = {
  STATUS: `${CONFIG.API_BASE_URL}/api/stream/status`,
  URL: `${CONFIG.API_BASE_URL}/api/stream/url`,
  STATS: `${CONFIG.API_BASE_URL}/api/stream/stats`,
  START: `${CONFIG.API_BASE_URL}/api/stream/start`,
  STOP: `${CONFIG.API_BASE_URL}/api/stream/stop`,
  INFO: `${CONFIG.API_BASE_URL}/api/info`
};

CONFIG.HLS_URL = `${CONFIG.MEDIA_BASE_URL}/live/${CONFIG.STREAM_KEY}/index.m3u8`;

// Logging para debug
if (CONFIG.DEBUG_MODE) {
  console.log('📋 Configuración cargada:', CONFIG);
}
