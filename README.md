# 🎥 Live Stream Frontend

Frontend web moderno para visualizar transmisiones en vivo desde el servidor de streaming RTMP/HLS. Interfaz elegante y responsive que consume la API REST del backend.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![HTML5](https://img.shields.io/badge/HTML5-orange)
![CSS3](https://img.shields.io/badge/CSS3-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-yellow)

## ✨ Características

- ✅ **Reproductor HLS** - Reproduce streams usando HLS.js
- ✅ **Estadísticas en tiempo real** - Bitrate, resolución, FPS, viewers
- ✅ **Diseño responsive** - Funciona en desktop, tablet y móvil
- ✅ **Actualizaciones automáticas** - Polling de estado y estadísticas
- ✅ **Notificaciones toast** - Feedback visual de acciones
- ✅ **Log de actividad** - Registro de eventos en tiempo real
- ✅ **Interfaz moderna** - Diseño elegante con gradientes y animaciones
- ✅ **Pantalla completa** - Modo fullscreen para el reproductor
- ✅ **Sin dependencias de build** - HTML/CSS/JS puro, sin compilación

## 📂 Estructura del Proyecto

```
live-stream-frontend/
├── index.html              # Página principal
├── css/
│   └── styles.css          # Estilos globales
├── js/
│   ├── config.js           # Configuración de la aplicación
│   ├── api.js              # Módulo de comunicación con API
│   ├── ui.js               # Módulo de interfaz de usuario
│   └── app.js              # Lógica principal del reproductor
├── assets/                 # Imágenes y recursos (opcional)
└── README.md               # Documentación
```

## 🚀 Instalación y Configuración

### Requisitos Previos

1. **Servidor Backend** - El backend de streaming debe estar ejecutándose
2. **Navegador moderno** - Chrome, Firefox, Safari, Edge (últimas versiones)
3. **Servidor web** - Para servir los archivos estáticos

### Opción 1: Servidor local simple (Python)

```bash
# Navegar a la carpeta del proyecto
cd live-stream-frontend

# Python 3
python -m http.server 8080

# O Python 2
python -m SimpleHTTPServer 8080
```

Abre tu navegador en: `http://localhost:8080`

### Opción 2: Node.js con http-server

```bash
# Instalar http-server globalmente
npm install -g http-server

# Iniciar servidor
http-server -p 8080 -c-1

# O con live-reload
npx live-server --port=8080
```

Abre tu navegador en: `http://localhost:8080`

### Opción 3: PHP

```bash
cd live-stream-frontend
php -S localhost:8080
```

### Opción 4: Visual Studio Code (Live Server)

1. Instala la extensión **Live Server**
2. Click derecho en `index.html`
3. Selecciona "Open with Live Server"

## ⚙️ Configuración

Edita el archivo `js/config.js` para ajustar la configuración:

```javascript
const CONFIG = {
  // URL del servidor API (backend)
  API_BASE_URL: 'http://localhost:3000',
  
  // URL del servidor de medios (HLS)
  MEDIA_BASE_URL: 'http://localhost:8000',
  
  // Stream key
  STREAM_KEY: 'live',
  
  // Intervalo de actualización (milisegundos)
  STATS_UPDATE_INTERVAL: 5000,    // 5 segundos
  STATUS_CHECK_INTERVAL: 3000,    // 3 segundos
  
  // Duración de notificaciones
  TOAST_DURATION: 4000,           // 4 segundos
  
  // Modo debug
  DEBUG_MODE: true
};
```

### Configuración para Producción

Si vas a desplegar en producción, cambia las URLs:

```javascript
const CONFIG = {
  API_BASE_URL: 'https://tu-dominio.com',
  MEDIA_BASE_URL: 'https://tu-dominio.com:8000',
  STREAM_KEY: 'live',
  DEBUG_MODE: false  // Desactivar logs de debug
};
```

## 📖 Uso

### 1. Iniciar el Backend

Primero, asegúrate de que el servidor backend esté ejecutándose:

```bash
cd ../live-stream
npm start
```

### 2. Configurar OBS Studio

- **Servidor:** `rtmp://localhost:1935/live`
- **Stream Key:** `live`

### 3. Iniciar la Transmisión en OBS

Haz clic en **"Iniciar transmisión"** en OBS Studio.

### 4. Abrir el Frontend

Navega a `http://localhost:8080` en tu navegador.

### 5. Cargar el Stream

Haz clic en el botón **"Cargar Stream"** para comenzar a ver la transmisión.

## 🎛️ Funcionalidades

### Reproductor de Video

- **Cargar Stream** - Carga y reproduce el stream en vivo
- **Detener** - Detiene la reproducción
- **Actualizar** - Actualiza las estadísticas manualmente
- **Pantalla Completa** - Modo fullscreen

### Estadísticas en Tiempo Real

El frontend muestra:

- 📊 **Bitrate** - Velocidad de transmisión (Kbps)
- 🖥️ **Resolución** - Dimensiones del video
- 🎬 **FPS** - Cuadros por segundo
- 💻 **Codec** - Codec de video utilizado
- ⏱️ **Uptime** - Tiempo en vivo
- 👥 **Espectadores** - Número de viewers conectados

### Indicadores de Estado

- 🔴 **EN VIVO** - Stream activo
- ⚫ **OFFLINE** - Sin transmisión

### Log de Actividad

Registro en tiempo real de:
- Eventos de conexión
- Carga de streams
- Errores y advertencias
- Estadísticas actualizadas

## 🔧 Personalización

### Cambiar Colores

Edita las variables CSS en `css/styles.css`:

```css
:root {
  --primary-color: #667eea;      /* Color principal */
  --secondary-color: #764ba2;    /* Color secundario */
  --success-color: #48bb78;      /* Verde */
  --danger-color: #f56565;       /* Rojo */
  --info-color: #4299e1;         /* Azul */
}
```

### Cambiar Logo

Edita el HTML en `index.html`:

```html
<div class="logo">
  <i class="fas fa-video"></i>  <!-- Cambia el icono -->
  <span>TuNombre</span>          <!-- Cambia el texto -->
</div>
```

### Añadir Funcionalidades

Los módulos están separados para facilitar la extensión:

- **config.js** - Configuración global
- **api.js** - Comunicación con backend
- **ui.js** - Actualización de interfaz
- **app.js** - Lógica principal

## 📱 Responsive

El frontend es completamente responsive y funciona en:

- 🖥️ **Desktop** - 1920x1080+
- 💻 **Laptop** - 1366x768+
- 📱 **Tablet** - 768x1024
- 📱 **Mobile** - 375x667+

## 🌐 Navegadores Soportados

| Navegador | Versión Mínima | HLS Support |
|-----------|----------------|-------------|
| Chrome    | 90+            | HLS.js      |
| Firefox   | 88+            | HLS.js      |
| Safari    | 14+            | Nativo      |
| Edge      | 90+            | HLS.js      |
| Opera     | 76+            | HLS.js      |

## 🐛 Solución de Problemas

### El stream no carga

1. Verifica que el backend esté ejecutándose
2. Comprueba la consola del navegador (F12) para ver errores
3. Asegúrate de que las URLs en `config.js` sean correctas
4. Verifica que OBS esté transmitiendo

### Error de CORS

Si ves errores de CORS en la consola:

1. Verifica que el backend tenga CORS habilitado
2. Comprueba que las URLs coincidan exactamente
3. Si usas HTTPS, todos los endpoints deben ser HTTPS

### No se actualizan las estadísticas

1. Abre la consola del navegador (F12)
2. Verifica que las peticiones a `/api/stream/stats` sean exitosas
3. Comprueba que el intervalo de actualización esté configurado

### Video en negro

1. Espera unos segundos (el stream puede estar buffering)
2. Verifica que OBS esté transmitiendo correctamente
3. Comprueba la URL HLS en la consola
4. Intenta recargar el stream

## 🚀 Despliegue en Producción

### Opción 1: Netlify

1. Sube el proyecto a GitHub
2. Conecta el repositorio a Netlify
3. Configura las variables de entorno
4. Despliega

### Opción 2: Vercel

```bash
npm install -g vercel
cd live-stream-frontend
vercel
```

### Opción 3: Nginx

```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    
    root /var/www/live-stream-frontend;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Proxy para API
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Opción 4: Apache

```apache
<VirtualHost *:80>
    ServerName tu-dominio.com
    DocumentRoot /var/www/live-stream-frontend
    
    <Directory /var/www/live-stream-frontend>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    # Proxy para API
    ProxyPass /api/ http://localhost:3000/api/
    ProxyPassReverse /api/ http://localhost:3000/api/
</VirtualHost>
```

## 📊 API Endpoints Utilizados

El frontend consume estos endpoints del backend:

- `GET /api/stream/status` - Estado del stream
- `GET /api/stream/url` - URL del manifest HLS
- `GET /api/stream/stats` - Estadísticas en tiempo real
- `POST /api/stream/stop` - Detener stream
- `GET /api/info` - Información del servidor

## 🔐 Seguridad

### Recomendaciones

1. **No expongas el backend directamente** - Usa un proxy reverso
2. **Usa HTTPS en producción** - Encripta las comunicaciones
3. **Valida stream keys** - Implementa autenticación
4. **Limita CORS** - Especifica dominios permitidos
5. **Monitorea el uso** - Implementa rate limiting

## 📄 Licencia

MIT License

## 👤 Autor

Tu nombre aquí

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/mejora`)
3. Commit tus cambios (`git commit -m 'Añadir mejora'`)
4. Push a la rama (`git push origin feature/mejora`)
5. Abre un Pull Request

## 📞 Soporte

Si tienes problemas:

1. Revisa la sección de **Solución de Problemas**
2. Consulta los logs del navegador (F12)
3. Verifica que el backend esté funcionando
4. Abre un issue en GitHub

## 🎯 Roadmap

- [ ] Chat en vivo
- [ ] Control de calidad (cambiar resolución)
- [ ] Grabación de streams
- [ ] Múltiples streams simultáneos
- [ ] Autenticación de usuarios
- [ ] Dashboard de analytics
- [ ] Modo oscuro/claro

---

**¡Disfruta transmitiendo! 🎥📡**
