// Система детального логирования для отладки SissyLifeSim

class DebugLogger {
  constructor() {
    this.logs = [];
    this.enabled = true;
    this.maxLogs = 1000;
    this.logLevels = {
      INFO: 'info',
      WARN: 'warn',
      ERROR: 'error',
      DEBUG: 'debug',
      TRACE: 'trace'
    };
    
    // Создаём отладочную панель
    this.createDebugPanel();
    
    // Перехватываем консольные методы
    this.interceptConsole();
  }
  
  createDebugPanel() {
    const panel = document.createElement('div');
    panel.id = 'debug-panel';
    panel.innerHTML = `
      <div class="debug-header">
        <span class="debug-title">🐛 Debug Log</span>
        <div class="debug-controls">
          <button class="debug-btn" onclick="debugLogger.togglePanel()">_</button>
          <button class="debug-btn" onclick="debugLogger.clearLogs()">🗑️</button>
          <button class="debug-btn" onclick="debugLogger.exportLogs()">💾</button>
        </div>
      </div>
      <div class="debug-content" id="debug-content"></div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
      #debug-panel {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 400px;
        max-height: 500px;
        background: rgba(0, 0, 0, 0.9);
        border: 1px solid #444;
        border-radius: 8px;
        color: #fff;
        font-family: monospace;
        font-size: 12px;
        z-index: 10000;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        transition: opacity 0.3s ease;
      }
      
      #debug-panel.hidden {
        opacity: 0;
        pointer-events: none;
      }
      
      #debug-panel.minimized .debug-content {
        display: none;
      }
      
      #debug-panel.minimized {
        max-height: auto;
      }
      
      .debug-header {
        padding: 10px;
        background: rgba(255, 255, 255, 0.1);
        border-bottom: 1px solid #444;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: move;
        user-select: none;
      }
      
      .debug-title {
        font-weight: bold;
      }
      
      .debug-controls {
        display: flex;
        gap: 5px;
      }
      
      .debug-btn {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid #666;
        color: #fff;
        padding: 2px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 11px;
      }
      
      .debug-btn:hover {
        background: rgba(255, 255, 255, 0.2);
      }
      
      .debug-content {
        max-height: 400px;
        overflow-y: auto;
        padding: 10px;
      }
      
      .debug-entry {
        margin-bottom: 8px;
        padding: 5px;
        border-left: 3px solid #666;
        padding-left: 10px;
      }
      
      .debug-entry.INFO { border-left-color: #4CAF50; }
      .debug-entry.WARN { border-left-color: #FF9800; }
      .debug-entry.ERROR { border-left-color: #F44336; }
      .debug-entry.DEBUG { border-left-color: #2196F3; }
      .debug-entry.TRACE { border-left-color: #9C27B0; }
      
      .debug-time {
        color: #888;
        font-size: 10px;
      }
      
      .debug-message {
        margin-top: 2px;
      }
      
      .debug-data {
        margin-top: 2px;
        color: #aaa;
        font-size: 11px;
        white-space: pre-wrap;
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(panel);
    
    // Добавляем функциональность перемещения
    this.makeDraggable(panel);
    
    // Проверяем настройки
    const settings = JSON.parse(localStorage.getItem('gameSettings') || '{}');
    if (settings.debugPanel === false) {
      panel.classList.add('hidden');
    }
    
    this.panel = panel;
    this.updatePanel();
  }
  
  interceptConsole() {
    const originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      debug: console.debug
    };
    
    console.log = (...args) => {
      this.log('INFO', args.join(' '));
      originalConsole.log.apply(console, args);
    };
    
    console.warn = (...args) => {
      this.log('WARN', args.join(' '));
      originalConsole.warn.apply(console, args);
    };
    
    console.error = (...args) => {
      this.log('ERROR', args.join(' '));
      originalConsole.error.apply(console, args);
    };
    
    console.debug = (...args) => {
      this.log('DEBUG', args.join(' '));
      originalConsole.debug.apply(console, args);
    };
  }
  
  log(level, message, data = null) {
    if (!this.enabled) return;
    
    const timestamp = new Date().toISOString();
    const stack = new Error().stack;
    
    const logEntry = {
      timestamp,
      level,
      message,
      data,
      stack
    };
    
    this.logs.push(logEntry);
    
    // Ограничиваем количество логов
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
    
    // Обновляем UI
    this.updateDebugPanel();
  }
  
  updateDebugPanel() {
    const container = document.getElementById('debug-logs-container');
    if (!container) return;
    
    const filters = {
      info: document.getElementById('debug-info')?.checked ?? true,
      warn: document.getElementById('debug-warn')?.checked ?? true,
      error: document.getElementById('debug-error')?.checked ?? true,
      debug: document.getElementById('debug-debug')?.checked ?? true,
      trace: document.getElementById('debug-trace')?.checked ?? false
    };
    
    const filteredLogs = this.logs.filter(log => 
      filters[log.level.toLowerCase()]
    );
    
    container.innerHTML = filteredLogs
      .slice(-100) // Показываем последние 100 записей
      .reverse()
      .map(log => `
        <div class="debug-log-entry ${log.level.toLowerCase()}">
          <div class="debug-timestamp">${log.timestamp}</div>
          <div class="debug-message">[${log.level}] ${this.escapeHtml(log.message)}</div>
          ${log.data ? `<div class="debug-data">${JSON.stringify(log.data, null, 2)}</div>` : ''}
          ${log.level === 'ERROR' ? `<div class="debug-stack">${this.escapeHtml(log.stack)}</div>` : ''}
        </div>
      `)
      .join('');
  }
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  togglePanel() {
    if (this.panel.classList.contains('minimized')) {
      this.panel.classList.remove('minimized');
    } else {
      this.panel.classList.add('minimized');
    }
  }
  
  clearLogs() {
    this.logs = [];
    this.updateDebugPanel();
  }
  
  exportLogs() {
    const data = JSON.stringify(this.logs, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debug-logs-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  
  // Специализированные методы логирования
  logSceneLoad(sceneId) {
    this.log('INFO', `🎬 Loading scene: ${sceneId}`);
  }
  
  logScriptExecution(phase, scriptContent) {
    this.log('DEBUG', `📜 Script execution (${phase})`, {
      phase,
      scriptLength: scriptContent.length,
      preview: scriptContent.substring(0, 100) + '...'
    });
  }
  
  logFunctionRegistration(funcName, success) {
    this.log('DEBUG', `🔧 Function registration: ${funcName} - ${success ? '✅' : '❌'}`);
  }
  
  logMarkdownParsing(markdown, html) {
    this.log('TRACE', `📝 Markdown parsing`, {
      markdownLength: markdown.length,
      htmlLength: html.length,
      markdownPreview: markdown.substring(0, 200) + '...',
      htmlPreview: html.substring(0, 200) + '...'
    });
  }
  
  logDOMUpdate(selector, content) {
    this.log('TRACE', `🖼️ DOM update: ${selector}`, {
      contentLength: content.length,
      preview: content.substring(0, 100) + '...'
    });
  }
  
  logEventHandler(eventType, target, handler) {
    this.log('DEBUG', `🎯 Event handler: ${eventType} on ${target} -> ${handler}`);
  }
  
  checkFunctionAvailability(funcNames) {
    const results = {};
    funcNames.forEach(name => {
      results[name] = typeof window[name] === 'function';
    });
    
    this.log('INFO', '🔍 Function availability check', results);
    return results;
  }

  makeDraggable(element) {
    const header = element.querySelector('.debug-header');
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;
    
    header.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
    
    function dragStart(e) {
      if (e.target.classList.contains('debug-btn')) return;
      
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;
      
      if (e.target === header || header.contains(e.target)) {
        isDragging = true;
      }
    }
    
    function drag(e) {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        
        xOffset = currentX;
        yOffset = currentY;
        
        element.style.transform = `translate(${currentX}px, ${currentY}px)`;
      }
    }
    
    function dragEnd(e) {
      initialX = currentX;
      initialY = currentY;
      isDragging = false;
    }
  }
  
  hidePanel() {
    this.panel.classList.add('hidden');
    // Сохраняем настройку
    const settings = JSON.parse(localStorage.getItem('gameSettings') || '{}');
    settings.debugPanel = false;
    localStorage.setItem('gameSettings', JSON.stringify(settings));
  }
  
  showPanel() {
    this.panel.classList.remove('hidden');
    // Сохраняем настройку
    const settings = JSON.parse(localStorage.getItem('gameSettings') || '{}');
    settings.debugPanel = true;
    localStorage.setItem('gameSettings', JSON.stringify(settings));
  }

  updatePanel() {
    if (!this.panel) return;
    
    const container = document.getElementById('debug-content');
    if (!container) return;
    
    // Показываем последние 50 записей
    const recentLogs = this.logs.slice(-50);
    
    container.innerHTML = recentLogs.map(log => {
      const time = new Date(log.timestamp).toLocaleTimeString();
      const dataStr = log.data ? `\n${JSON.stringify(log.data, null, 2)}` : '';
      
      return `
        <div class="debug-entry ${log.level}">
          <div class="debug-time">${time} [${log.level}]</div>
          <div class="debug-message">${log.message}</div>
          ${dataStr ? `<div class="debug-data">${dataStr}</div>` : ''}
        </div>
      `;
    }).join('');
    
    // Автоскролл вниз
    container.scrollTop = container.scrollHeight;
  }
}

// Создаём глобальный экземпляр
window.debugLogger = new DebugLogger();

export default DebugLogger; 