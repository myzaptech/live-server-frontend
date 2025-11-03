/**
 * ============================================
 * MÓDULO DE API
 * ============================================
 * 
 * Maneja todas las peticiones HTTP a la API del servidor.
 */

const API = {
  /**
   * Realiza una petición HTTP con manejo de errores
   */
  async request(url, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });
      
      clearTimeout(timeout);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (CONFIG.DEBUG_MODE) {
        console.log('📡 API Response:', url, data);
      }
      
      return data;
      
    } catch (error) {
      clearTimeout(timeout);
      
      if (error.name === 'AbortError') {
        throw new Error('Tiempo de espera agotado');
      }
      
      console.error('❌ API Error:', error);
      throw error;
    }
  },
  
  /**
   * GET /api/stream/status
   * Obtiene el estado actual del stream
   */
  async getStatus() {
    return await this.request(CONFIG.ENDPOINTS.STATUS);
  },
  
  /**
   * GET /api/stream/url
   * Obtiene la URL del manifest HLS
   */
  async getStreamUrl() {
    return await this.request(CONFIG.ENDPOINTS.URL);
  },
  
  /**
   * GET /api/stream/stats
   * Obtiene estadísticas del stream
   */
  async getStats() {
    return await this.request(CONFIG.ENDPOINTS.STATS);
  },
  
  /**
   * POST /api/stream/start
   * Obtiene información para iniciar el stream
   */
  async startStream() {
    return await this.request(CONFIG.ENDPOINTS.START, {
      method: 'POST'
    });
  },
  
  /**
   * POST /api/stream/stop
   * Detiene el stream actual
   */
  async stopStream() {
    return await this.request(CONFIG.ENDPOINTS.STOP, {
      method: 'POST'
    });
  },
  
  /**
   * GET /api/info
   * Obtiene información general del servidor
   */
  async getServerInfo() {
    return await this.request(CONFIG.ENDPOINTS.INFO);
  },
  
  /**
   * Verifica si la API está disponible
   */
  async checkConnection() {
    try {
      await this.getServerInfo();
      return true;
    } catch (error) {
      return false;
    }
  },
  
  /**
   * Realiza múltiples reintentos de una petición
   */
  async requestWithRetry(requestFn, maxRetries = 3, delay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await requestFn();
      } catch (error) {
        if (i === maxRetries - 1) {
          throw error;
        }
        
        console.log(`⏳ Reintento ${i + 1}/${maxRetries}...`);
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
};

// Log de inicialización
if (CONFIG.DEBUG_MODE) {
  console.log('✅ Módulo API inicializado');
  console.log('📡 API Base URL:', CONFIG.API_BASE_URL);
}
