/**
 * ============================================
 * APLICACIÓN PRINCIPAL
 * ============================================
 * 
 * Lógica principal del reproductor de streaming.
 */

class StreamPlayer {
  constructor() {
    this.hls = null;
    this.video = document.getElementById('videoPlayer');
    this.isPlaying = false;
    this.statsInterval = null;
    this.statusInterval = null;
    
    this.init();
  }
  
  /**
   * Inicializa la aplicación
   */
  async init() {
    UI.addLog('🚀 Aplicación inicializada', 'info');
    
    // Verificar conexión con la API
    await this.checkApiConnection();
    
    // Cargar información del servidor
    await this.loadServerInfo();
    
    // Verificar estado inicial (esto ya auto-cargará si está en vivo)
    await this.checkStreamStatus();
    
    // Configurar event listeners
    this.setupEventListeners();
    
    // Iniciar polling de estado (revisará cada 3 segundos)
    this.startStatusPolling();
    
    UI.addLog('✅ Sistema listo - Monitoreando stream automáticamente', 'success');
  }
  
  /**
   * Verifica la conexión con la API
   */
  async checkApiConnection() {
    try {
      UI.addLog('🔍 Verificando conexión con API...', 'info');
      const isConnected = await API.checkConnection();
      
      if (isConnected) {
        UI.addLog('✅ Conectado a la API correctamente', 'success');
        UI.showToast('Conectado al servidor', 'success');
      } else {
        throw new Error('No se pudo conectar');
      }
    } catch (error) {
      UI.addLog('❌ Error de conexión con la API', 'error');
      UI.showToast('Error: No se puede conectar con el servidor. Verifica que esté ejecutándose.', 'error');
      console.error(error);
    }
  }
  
  /**
   * Carga información del servidor
   */
  async loadServerInfo() {
    try {
      const response = await API.getServerInfo();
      
      if (response.success) {
        UI.updateServerInfo(response.data);
        UI.addLog('📋 Información del servidor cargada', 'info');
      }
    } catch (error) {
      UI.addLog('⚠️ No se pudo cargar información del servidor', 'warning');
      console.error(error);
    }
  }
  
  /**
   * Verifica el estado del stream
   */
  async checkStreamStatus() {
    try {
      const response = await API.getStatus();
      
      if (response.success) {
        const { isLive, status, viewers } = response.data;
        
        UI.updateStatus(isLive, status);
        UI.updateViewerCount(viewers);
        
        // Si está en vivo, cargar URL del stream
        if (isLive) {
          await this.loadStreamUrl();
          
          // ✨ AUTO-CARGAR: Si está en vivo y NO se está reproduciendo, cargar automáticamente
          if (!this.isPlaying && this.video.paused) {
            UI.addLog('🎬 Stream en vivo detectado, cargando automáticamente...', 'info');
            this.loadStream();
          }
        } else {
          UI.updateStreamUrlInfo(null);
          
          // Si el stream se detuvo, limpiar el reproductor
          if (this.isPlaying) {
            UI.addLog('📴 Stream detenido', 'warning');
            this.stopStream();
          }
        }
        
        return isLive;
      }
    } catch (error) {
      UI.addLog('⚠️ Error al verificar estado', 'warning');
      console.error(error);
      return false;
    }
  }
  
  /**
   * Carga la URL del stream
   */
  async loadStreamUrl() {
    try {
      const response = await API.getStreamUrl();
      
      if (response.success) {
        UI.updateStreamUrlInfo(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  /**
   * Carga y reproduce el stream
   */
  async loadStream() {
    try {
      UI.addLog('🔍 Verificando disponibilidad del stream...', 'info');
      UI.showLoadingSpinner();
      UI.setButtonsEnabled(false);
      
      // Verificar si hay stream activo
      const isLive = await this.checkStreamStatus();
      
      if (!isLive) {
        UI.hideLoadingSpinner();
        UI.setButtonsEnabled(true);
        UI.showToast('No hay stream activo. Inicia la transmisión desde OBS.', 'warning');
        UI.addLog('⚠️ No hay stream disponible', 'warning');
        return;
      }
      
      // Usar URL del stream desde CONFIG (no del backend)
      const streamUrl = CONFIG.HLS_URL;
      UI.addLog(`📺 URL del stream: ${streamUrl}`, 'info');
      
      // Verificar soporte de HLS
      if (Hls.isSupported()) {
        await this.loadWithHlsJs(streamUrl);
      } else if (this.video.canPlayType('application/vnd.apple.mpegurl')) {
        await this.loadNativeHls(streamUrl);
      } else {
        throw new Error('Tu navegador no soporta reproducción HLS');
      }
      
    } catch (error) {
      UI.hideLoadingSpinner();
      UI.setButtonsEnabled(true);
      UI.addLog(`❌ Error al cargar stream: ${error.message}`, 'error');
      UI.showToast(`Error: ${error.message}`, 'error');
      console.error(error);
    }
  }
  
  /**
   * Carga el stream usando HLS.js
   */
  async loadWithHlsJs(streamUrl) {
    UI.addLog('🎬 Inicializando HLS.js...', 'info');
    
    // Destruir instancia anterior
    if (this.hls) {
      this.hls.destroy();
    }
    
    // Crear nueva instancia
    this.hls = new Hls(CONFIG.HLS_CONFIG);
    
    // Eventos de HLS.js
    this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
      UI.addLog('✅ Stream cargado correctamente', 'success');
      UI.showToast('Stream cargado, reproduciendo...', 'success');
      UI.hideLoadingSpinner();
      UI.hidePlayerOverlay();
      UI.setButtonsEnabled(true);
      
      this.video.play().catch(err => {
        UI.addLog('⚠️ Reproducción automática bloqueada, haz clic en play', 'warning');
      });
      
      this.isPlaying = true;
      this.startStatsPolling();
    });
    
    this.hls.on(Hls.Events.ERROR, (event, data) => {
      console.error('HLS Error:', data);
      
      if (data.fatal) {
        UI.addLog(`❌ Error fatal de HLS: ${data.type}`, 'error');
        
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            UI.addLog('🔄 Error de red, intentando recuperar...', 'warning');
            UI.showToast('Error de conexión, reintentando...', 'warning');
            this.hls.startLoad();
            break;
            
          case Hls.ErrorTypes.MEDIA_ERROR:
            UI.addLog('🔄 Error de medios, intentando recuperar...', 'warning');
            this.hls.recoverMediaError();
            break;
            
          default:
            UI.addLog('💥 Error irrecuperable, recarga la página', 'error');
            UI.showToast('Error irrecuperable en la reproducción', 'error');
            this.hls.destroy();
            UI.hideLoadingSpinner();
            UI.setButtonsEnabled(true);
            break;
        }
      }
    });
    
    // Cargar stream
    this.hls.loadSource(streamUrl);
    this.hls.attachMedia(this.video);
  }
  
  /**
   * Carga el stream usando HLS nativo (Safari)
   */
  async loadNativeHls(streamUrl) {
    UI.addLog('🍎 Usando reproductor HLS nativo (Safari)', 'info');
    
    this.video.src = streamUrl;
    
    this.video.addEventListener('loadedmetadata', () => {
      UI.addLog('✅ Stream cargado correctamente', 'success');
      UI.showToast('Stream cargado, reproduciendo...', 'success');
      UI.hideLoadingSpinner();
      UI.hidePlayerOverlay();
      UI.setButtonsEnabled(true);
      
      this.video.play();
      this.isPlaying = true;
      this.startStatsPolling();
    }, { once: true });
    
    this.video.addEventListener('error', (e) => {
      UI.addLog('❌ Error al cargar el stream', 'error');
      UI.showToast('Error al reproducir el stream', 'error');
      UI.hideLoadingSpinner();
      UI.setButtonsEnabled(true);
    });
  }
  
  /**
   * Detiene el stream
   */
  async stopStream() {
    try {
      UI.addLog('🛑 Deteniendo stream...', 'info');
      
      // Detener reproductor
      if (this.hls) {
        this.hls.destroy();
        this.hls = null;
      }
      
      this.video.pause();
      this.video.src = '';
      this.isPlaying = false;
      
      // Detener polling
      this.stopStatsPolling();
      
      // Resetear UI
      UI.showPlayerOverlay();
      UI.resetStats();
      
      // Llamar a la API para detener
      const response = await API.stopStream();
      
      if (response.success) {
        UI.addLog('✅ Stream detenido correctamente', 'success');
        UI.showToast('Stream detenido', 'info');
      }
      
      await this.checkStreamStatus();
      
    } catch (error) {
      UI.addLog(`⚠️ Error al detener: ${error.message}`, 'warning');
      console.error(error);
    }
  }
  
  /**
   * Actualiza las estadísticas
   */
  async updateStats() {
    try {
      const response = await API.getStats();
      
      if (response.success) {
        UI.updateStats(response.data);
      }
    } catch (error) {
      console.error('Error al actualizar estadísticas:', error);
    }
  }
  
  /**
   * Inicia polling de estadísticas
   */
  startStatsPolling() {
    if (this.statsInterval) {
      clearInterval(this.statsInterval);
    }
    
    this.updateStats(); // Primera actualización inmediata
    
    this.statsInterval = setInterval(() => {
      this.updateStats();
    }, CONFIG.STATS_UPDATE_INTERVAL);
    
    UI.addLog('📊 Actualización automática de estadísticas iniciada', 'info');
  }
  
  /**
   * Detiene polling de estadísticas
   */
  stopStatsPolling() {
    if (this.statsInterval) {
      clearInterval(this.statsInterval);
      this.statsInterval = null;
      UI.addLog('📊 Actualización automática de estadísticas detenida', 'info');
    }
  }
  
  /**
   * Inicia polling de estado
   */
  startStatusPolling() {
    if (this.statusInterval) {
      clearInterval(this.statusInterval);
    }
    
    this.statusInterval = setInterval(() => {
      this.checkStreamStatus();
    }, CONFIG.STATUS_CHECK_INTERVAL);
  }
  
  /**
   * Pantalla completa
   */
  toggleFullscreen() {
    if (!document.fullscreenElement) {
      this.video.requestFullscreen().catch(err => {
        UI.showToast('Error al activar pantalla completa', 'error');
      });
    } else {
      document.exitFullscreen();
    }
  }
  
  /**
   * Configura event listeners
   */
  setupEventListeners() {
    // Botón cargar stream
    document.getElementById('btnLoadStream').addEventListener('click', () => {
      this.loadStream();
    });
    
    document.getElementById('loadStreamBtn').addEventListener('click', () => {
      this.loadStream();
    });
    
    // Botón detener
    document.getElementById('btnStopStream').addEventListener('click', () => {
      this.stopStream();
    });
    
    // Botón actualizar estadísticas
    document.getElementById('btnRefreshStats').addEventListener('click', () => {
      this.updateStats();
      UI.showToast('Estadísticas actualizadas', 'info');
    });
    
    // Botón pantalla completa
    document.getElementById('btnFullscreen').addEventListener('click', () => {
      this.toggleFullscreen();
    });
    
    // Botón limpiar log
    document.getElementById('btnClearLog').addEventListener('click', () => {
      UI.clearLog();
      UI.showToast('Log limpiado', 'info');
    });
    
    // Link a documentación API
    document.getElementById('apiDocsLink').addEventListener('click', (e) => {
      e.preventDefault();
      window.open(CONFIG.API_BASE_URL, '_blank');
    });
    
    // Eventos del video
    this.video.addEventListener('play', () => {
      UI.addLog('▶️ Reproducción iniciada', 'info');
    });
    
    this.video.addEventListener('pause', () => {
      UI.addLog('⏸️ Reproducción pausada', 'info');
    });
    
    this.video.addEventListener('ended', () => {
      UI.addLog('⏹️ Reproducción finalizada', 'info');
    });
    
    // Eventos de navegación
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        const target = link.getAttribute('href');
        document.querySelector(target).scrollIntoView({ behavior: 'smooth' });
      });
    });
  }
}

// ============================================
// INICIALIZACIÓN
// ============================================

let player;

document.addEventListener('DOMContentLoaded', () => {
  console.log('🎥 LiveStream Frontend v1.0');
  console.log('📡 API:', CONFIG.API_BASE_URL);
  console.log('🌐 Media:', CONFIG.MEDIA_BASE_URL);
  
  player = new StreamPlayer();
});

// Manejo de errores globales
window.addEventListener('error', (event) => {
  console.error('Error global:', event.error);
  UI.addLog(`❌ Error: ${event.error?.message || 'Error desconocido'}`, 'error');
});

// Manejo de promesas rechazadas
window.addEventListener('unhandledrejection', (event) => {
  console.error('Promesa rechazada:', event.reason);
  UI.addLog(`❌ Error: ${event.reason?.message || 'Error desconocido'}`, 'error');
});
