/**
 * ============================================
 * MÓDULO DE UI
 * ============================================
 * 
 * Maneja las actualizaciones de la interfaz de usuario.
 */

const UI = {
  /**
   * Muestra una notificación toast
   */
  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = this.getToastIcon(type);
    
    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-message">${message}</div>
      <button class="toast-close" onclick="this.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    container.appendChild(toast);
    
    // Auto-remover después del tiempo configurado
    setTimeout(() => {
      toast.remove();
    }, CONFIG.TOAST_DURATION);
  },
  
  /**
   * Obtiene el icono según el tipo de toast
   */
  getToastIcon(type) {
    const icons = {
      success: '<i class="fas fa-check-circle"></i>',
      error: '<i class="fas fa-exclamation-circle"></i>',
      warning: '<i class="fas fa-exclamation-triangle"></i>',
      info: '<i class="fas fa-info-circle"></i>'
    };
    return icons[type] || icons.info;
  },
  
  /**
   * Añade una entrada al log
   */
  addLog(message, type = 'info') {
    const container = document.getElementById('logContainer');
    const timestamp = new Date().toLocaleTimeString();
    
    const entry = document.createElement('div');
    entry.className = `log-entry log-${type}`;
    entry.innerHTML = `
      <span class="log-timestamp">[${timestamp}]</span>
      <span>${message}</span>
    `;
    
    container.insertBefore(entry, container.firstChild);
    
    // Limitar número de entradas
    while (container.children.length > CONFIG.MAX_LOG_ENTRIES) {
      container.removeChild(container.lastChild);
    }
  },
  
  /**
   * Actualiza el indicador de estado
   */
  updateStatus(isLive, status = 'offline') {
    const indicator = document.getElementById('statusIndicator');
    const dot = indicator.querySelector('.status-dot');
    const text = indicator.querySelector('.status-text');
    
    if (isLive) {
      dot.classList.add('live');
      dot.classList.remove('offline');
      text.textContent = '🔴 EN VIVO';
      text.style.color = '#f56565';
    } else {
      dot.classList.add('offline');
      dot.classList.remove('live');
      text.textContent = '⚫ OFFLINE';
      text.style.color = '#a0aec0';
    }
  },
  
  /**
   * Actualiza el contador de espectadores
   */
  updateViewerCount(count) {
    const viewerCount = document.getElementById('viewerCount');
    viewerCount.querySelector('span').textContent = `${count} espectador${count !== 1 ? 'es' : ''}`;
  },
  
  /**
   * Actualiza las estadísticas
   */
  updateStats(stats) {
    document.getElementById('statBitrate').textContent = `${stats.bitrate || 0} Kbps`;
    document.getElementById('statResolution').textContent = stats.resolution || '--x--';
    document.getElementById('statFps').textContent = stats.fps || '--';
    document.getElementById('statCodec').textContent = stats.codec || '--';
    document.getElementById('statViewers').textContent = stats.viewers || 0;
    
    // Actualizar uptime
    if (stats.uptime) {
      document.getElementById('statUptime').textContent = this.formatUptime(stats.uptime);
    }
  },
  
  /**
   * Formatea el tiempo de actividad
   */
  formatUptime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  },
  
  /**
   * Actualiza la información del servidor
   */
  updateServerInfo(info) {
    const serverInfo = document.getElementById('serverInfo');
    serverInfo.innerHTML = `
      <p><strong>Nombre:</strong> ${info.name}</p>
      <p><strong>Versión:</strong> ${info.version}</p>
      <p><strong>Puerto RTMP:</strong> ${info.rtmpPort}</p>
      <p><strong>Puerto HTTP:</strong> ${info.httpPort}</p>
      <p><strong>Puerto API:</strong> ${info.apiPort}</p>
      <p><strong>Stream Key:</strong> ${info.streamKey}</p>
    `;
  },
  
  /**
   * Actualiza la información de la URL del stream
   */
  updateStreamUrlInfo(urlData) {
    const streamUrlInfo = document.getElementById('streamUrlInfo');
    
    if (urlData) {
      streamUrlInfo.innerHTML = `
        <p><strong>URL HLS:</strong></p>
        <div class="url-display">${urlData.hlsUrl}</div>
        <p style="margin-top: 12px;"><strong>Stream Key:</strong> ${urlData.streamKey}</p>
      `;
    } else {
      streamUrlInfo.innerHTML = `
        <p class="loading-text">No hay stream activo en este momento</p>
      `;
    }
  },
  
  /**
   * Muestra el overlay del reproductor
   */
  showPlayerOverlay() {
    const overlay = document.getElementById('playerOverlay');
    overlay.classList.remove('hidden');
  },
  
  /**
   * Oculta el overlay del reproductor
   */
  hidePlayerOverlay() {
    const overlay = document.getElementById('playerOverlay');
    overlay.classList.add('hidden');
  },
  
  /**
   * Muestra el spinner de carga
   */
  showLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    spinner.classList.add('active');
  },
  
  /**
   * Oculta el spinner de carga
   */
  hideLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    spinner.classList.remove('active');
  },
  
  /**
   * Habilita/deshabilita botones
   */
  setButtonsEnabled(enabled) {
    const buttons = document.querySelectorAll('.player-controls .btn');
    buttons.forEach(btn => {
      btn.disabled = !enabled;
    });
  },
  
  /**
   * Limpia el log
   */
  clearLog() {
    const container = document.getElementById('logContainer');
    container.innerHTML = '';
  },
  
  /**
   * Resetea las estadísticas
   */
  resetStats() {
    document.getElementById('statBitrate').textContent = '-- Kbps';
    document.getElementById('statResolution').textContent = '--x--';
    document.getElementById('statFps').textContent = '--';
    document.getElementById('statCodec').textContent = '--';
    document.getElementById('statUptime').textContent = '--:--:--';
    document.getElementById('statViewers').textContent = '0';
  }
};

// Log de inicialización
if (CONFIG.DEBUG_MODE) {
  console.log('✅ Módulo UI inicializado');
}
