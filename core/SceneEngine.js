import { marked } from 'marked';
import store from '../systems/store.js';
import { handleSpecialLink } from './actions.js';
import DebugLogger from './DebugLogger.js';

// Настройка marked для правильной обработки HTML
marked.setOptions({
  sanitize: false,     // Не экранировать HTML
  gfm: true,           // GitHub Flavored Markdown
  breaks: true,        // Переносы строк как <br>
  headerIds: false,    // Отключаем автогенерацию ID для заголовков
  mangle: false        // Не искажать email адреса
});

// Автоматическая загрузка всех .md сцен в папке src/scenes/
const sceneModules = import.meta.glob('../src/scenes/*.md', { query: '?raw', import: 'default', eager: true });

const scenes = {};
for (const path in sceneModules) {
  const id = path.split('/').pop().replace('.md', '');
  scenes[id] = sceneModules[path];
}

class SceneEngine {
  constructor(rootSelector = '#game-content') {
    this.root = document.querySelector(rootSelector);
    this.stack = [];
    this.initializeUI();
    this.setupStoreSubscriptions();
  }

  initializeUI() {
    this.updateStats();
    this.updateTime();
    this.setupEquipmentSlots();
  }

  setupStoreSubscriptions() {
    store.subscribe((change) => {
      const { property } = change;
      if (property === 'time') {
        this.updateTime();
      } else if (property === 'stats' || (typeof property === 'string' && property.startsWith('stats.'))) {
        this.updateStats();
      }
    });
  }

  updateStats() {
    const characterStats = [
      { id: 'health', name: 'Здоровье', icon: '💚', max: 100 },
      { id: 'energy', name: 'Энергия', icon: '⚡', max: 100 },
      { id: 'mood', name: 'Настроение', icon: '😊', max: 100, min: -100 },
      { id: 'stress', name: 'Стресс', icon: '😰', max: 100 },
      { id: 'arousal', name: 'Возбуждение', icon: '🔥', max: 100 },
      { id: 'hygiene', name: 'Гигиена', icon: '🛁', max: 100 },
      { id: 'willpower', name: 'Воля', icon: '💪', max: 100 }
    ];

    const fetishStats = [
      { id: 'femininity', name: 'Женственность', icon: '👗', max: 100, min: -100 },
      { id: 'dignity', name: 'Достоинство', icon: '👑', max: 100, min: -100 },
      { id: 'submission', name: 'Подчинённость', icon: '🔗', max: 100, min: -100 },
      { id: 'sissification', name: 'Сиссификация', icon: '💄', max: 100 },
      { id: 'bimbofication', name: 'Бимбо-индекс', icon: '💋', max: 100 },
      { id: 'analTraining', name: 'Анал-тренинг', icon: '🍑', max: 100 }
    ];

    this.renderStatsSection('character-stats', characterStats);
    this.renderStatsSection('fetish-stats', fetishStats);
  }

  renderStatsSection(containerId, stats) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = stats.map(stat => {
      const value = Math.round(store.stats[stat.id] || 0); // Округляем до целого
      const min = stat.min || 0;
      const max = stat.max || 100;
      const range = max - min;
      const percentage = ((value - min) / range) * 100;
      const rank = this.getStatRank(value, min, max);

      return `
        <div class="stat-item">
          <div class="stat-header">
            <div class="stat-name">${stat.icon} ${stat.name}</div>
            <div class="stat-value">${value}</div>
          </div>
          <div class="stat-bar">
            <div class="stat-fill" style="width: ${Math.max(0, Math.min(100, percentage))}%"></div>
          </div>
          <div class="stat-rank">${rank}</div>
        </div>
      `;
    }).join('');
  }

  getStatRank(value, min = 0, max = 100) {
    const range = max - min;
    const normalizedValue = (value - min) / range;
    
    if (normalizedValue <= 0.2) return 'Очень низкий';
    if (normalizedValue <= 0.4) return 'Низкий';
    if (normalizedValue <= 0.6) return 'Средний';
    if (normalizedValue <= 0.8) return 'Высокий';
    return 'Очень высокий';
  }

  updateTime() {
    const dayElement = document.getElementById('current-day');
    const timeElement = document.getElementById('current-time');
    
    if (dayElement) {
      dayElement.textContent = store.time.day;
    }
    
    if (timeElement) {
      const hours = Math.floor(store.time.minutes / 60);
      const mins = store.time.minutes % 60;
      timeElement.textContent = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }
  }

  setupEquipmentSlots() {
    const slots = [
      { id: 'hair', name: 'Волосы', icon: '💇' },
      { id: 'upper', name: 'Верх', icon: '👚' },
      { id: 'lower', name: 'Низ', icon: '👖' },
      { id: 'underwear', name: 'Бельё', icon: '👙' },
      { id: 'shoes', name: 'Обувь', icon: '👠' },
      { id: 'accessories', name: 'Аксессуары', icon: '💍' }
    ];

    const container = document.getElementById('equipment-slots');
    if (!container) return;

    container.innerHTML = `
      <div class="inventory-grid">
        ${slots.map(slot => `
          <div class="inventory-slot empty" data-slot="${slot.id}" title="${slot.name}">
            <div>${slot.icon}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderMarkdown(md) {
    window.debugLogger?.log('DEBUG', `🔍 renderMarkdown called, input length: ${md.length}`);
    
    // Проверяем, есть ли HTML в исходном markdown
    const hasHtml = /<[^>]+>/.test(md);
    window.debugLogger?.log('DEBUG', `Input contains HTML: ${hasHtml}`);
    
    // Пробуем парсить
    let html = marked.parse(md);
    
    // Проверяем результат
    window.debugLogger?.log('DEBUG', `Parsed HTML length: ${html.length}`);
    window.debugLogger?.log('TRACE', `First 500 chars of parsed HTML: ${html.substring(0, 500)}`);
    
    // Проверяем, были ли экранированы HTML теги
    const escapedTags = /&lt;|&gt;|&quot;|&#39;|&amp;/.test(html);
    if (escapedTags) {
      window.debugLogger?.log('WARN', '⚠️ HTML tags were escaped by marked!');
      
      // Пытаемся исправить экранирование
      html = html
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, '&');
        
      window.debugLogger?.log('DEBUG', 'Unescaped HTML manually');
    }
    
    return html;
  }

  loadScene(id) {
    window.debugLogger?.logSceneLoad(id);
    
    const md = scenes[id];
    if (!md) {
      window.debugLogger?.log('ERROR', `Scene not found: ${id}`);
      this.root.innerHTML = `<p class="text-red-600">Сцена «${id}» не найдена.</p>`;
      return;
    }
    
    window.debugLogger?.log('DEBUG', `Scene markdown loaded, length: ${md.length}`);
    
    // КРИТИЧЕСКИ ВАЖНО: Сначала выполняем скрипты ДО рендера HTML
    this.executeScriptsBeforeRender(md);
    
    // Проверяем доступность функций перед рендером
    const requiredFunctions = this.extractRequiredFunctions(md);
    window.debugLogger?.checkFunctionAvailability(requiredFunctions);
    
    const html = this.renderMarkdown(md);
    window.debugLogger?.logMarkdownParsing(md, html);
    
    this.root.innerHTML = html;
    window.debugLogger?.logDOMUpdate('#game-content', html);
    
    // Логируем все onclick атрибуты
    this.logOnclickHandlers();
    
    // перехватываем ссылки вида [Текст](target)
    this.root.querySelectorAll('a').forEach((a) => {
      const href = a.getAttribute('href');
      if (href && !href.startsWith('http')) {
        a.addEventListener('click', (e) => {
          e.preventDefault();
          window.debugLogger?.logEventHandler('click', 'link', href);
          if (!handleSpecialLink(href, this)) {
            this.pushScene(href);
          }
        });
      }
    });
    
    // Обновляем URL (?scene=id)
    const url = new URL(window.location);
    url.searchParams.set('scene', id);
    history.pushState({}, '', url);

    // Выполняем инициализацию сцены после рендера
    this.executePostRenderScripts(this.root);
  }

  pushScene(id) {
    const current = new URL(window.location).searchParams.get('scene');
    if (current) this.stack.push(current);
    this.loadScene(id);
  }

  popScene() {
    const prev = this.stack.pop();
    if (prev) this.loadScene(prev);
  }

  executeScriptsBeforeRender(markdownContent) {
    // Извлекаем все script блоки из markdown
    const scriptRegex = /<script>([\s\S]*?)<\/script>/g;
    let match;
    let scriptCount = 0;
    
    while ((match = scriptRegex.exec(markdownContent)) !== null) {
      const scriptContent = match[1];
      scriptCount++;
      
      window.debugLogger?.logScriptExecution('pre-render', scriptContent);
      
      try {
        // Пробуем несколько способов выполнения
        
        // Способ 1: Function constructor
        window.debugLogger?.log('DEBUG', `Trying Function constructor for script ${scriptCount}`);
        const func = new Function(scriptContent);
        func.call(window);
        
        // Способ 2: eval в глобальном контексте (fallback)
        window.debugLogger?.log('DEBUG', `Trying global eval for script ${scriptCount}`);
        (1, eval)(scriptContent);
        
        window.debugLogger?.log('INFO', `✅ Pre-render script ${scriptCount} executed successfully`);
        
        // Проверяем, какие функции были добавлены
        this.checkNewFunctions();
        
      } catch (error) {
        window.debugLogger?.log('ERROR', `❌ Pre-render script ${scriptCount} failed: ${error.message}`, {
          error: error.toString(),
          script: scriptContent.substring(0, 200)
        });
      }
    }
    
    window.debugLogger?.log('INFO', `Total scripts found and processed: ${scriptCount}`);
  }

  executePostRenderScripts(container) {
    if (!container) return;
    
    window.debugLogger?.log('DEBUG', 'Starting post-render scripts execution');
    
    // Вызываем функции инициализации сцены, если они есть
    const sceneFunctions = ['loadBathroom', 'loadHallway', 'loadKitchen', 'loadRoom'];
    
    sceneFunctions.forEach(funcName => {
      const funcExists = typeof window[funcName] === 'function';
      window.debugLogger?.logFunctionRegistration(funcName, funcExists);
      
      if (funcExists) {
        try {
          window[funcName]();
          window.debugLogger?.log('INFO', `✅ Scene init function ${funcName} executed`);
        } catch (error) {
          window.debugLogger?.log('ERROR', `❌ Scene init function ${funcName} failed: ${error.message}`);
        }
      }
    });
  }
  
  // Новые вспомогательные методы для отладки
  extractRequiredFunctions(markdown) {
    const onclickRegex = /onclick="([^"(]+)\(/g;
    const functions = new Set();
    let match;
    
    while ((match = onclickRegex.exec(markdown)) !== null) {
      functions.add(match[1]);
    }
    
    return Array.from(functions);
  }
  
  logOnclickHandlers() {
    const elements = this.root.querySelectorAll('[onclick]');
    window.debugLogger?.log('INFO', `Found ${elements.length} elements with onclick handlers`);
    
    elements.forEach((el, index) => {
      const onclick = el.getAttribute('onclick');
      const funcName = onclick.match(/^([^(]+)\(/)?.[1];
      const funcExists = funcName && typeof window[funcName] === 'function';
      
      window.debugLogger?.logEventHandler(
        'onclick',
        `${el.tagName}[${index}]`,
        `${onclick} (${funcExists ? '✅ exists' : '❌ missing'})`
      );
    });
  }
  
  checkNewFunctions() {
    // Список функций, которые должны быть доступны
    const expectedFunctions = [
      'goToMirror', 'takeShower', 'brushTeeth', 'useToilet', 'doSkincare', 'shaveBody',
      'goToRoom', 'selectPreset', 'confirmName', 'setPronoun', 'startGame',
      'loadBathroom', 'loadHallway', 'loadSpecialBathroomActions'
    ];
    
    const results = {};
    expectedFunctions.forEach(func => {
      results[func] = typeof window[func] === 'function';
    });
    
    const missing = Object.entries(results)
      .filter(([_, exists]) => !exists)
      .map(([name]) => name);
    
    if (missing.length > 0) {
      window.debugLogger?.log('WARN', `⚠️ Missing expected functions: ${missing.join(', ')}`);
    }
  }
}

export default SceneEngine; 