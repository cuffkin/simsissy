import './style.css';
import SceneEngine from '../core/SceneEngine.js';
import UIManager from '../core/UIManager.js';
import CharacterPresets from '../systems/CharacterPresets.js';
import store from '../systems/store.js';
import testRunner from '../core/testing.js';
import DebugLogger from '../core/DebugLogger.js';

// Инициализация отладки
window.debugLogger?.log('INFO', '🚀 Starting SissyLifeSim...');
window.debugLogger?.log('DEBUG', 'Initializing core systems');

// КРИТИЧЕСКИ ВАЖНО: Регистрируем все функции ДО создания движка
window.debugLogger?.log('DEBUG', 'Registering global functions...');

// Expose dev functions first
window.store = store;
window.saveGame = () => store.saveGame();
window.loadGame = () => {
  if (store.loadGame()) {
    window.gameEngine.loadScene('start');
  }
};

// Character Preset Functions
window.applyCharacterPreset = (presetId) => {
  const success = CharacterPresets.applyPreset(store, presetId);
  if (success) {
    console.log(`Applied preset: ${presetId}`);
    return true;
  }
  return false;
};

window.getCharacterPresets = () => CharacterPresets.getAllPresets();
window.getPresetEffects = (presetId) => CharacterPresets.getPresetEffects(presetId);

// Обновленные функции для работы со статистиками
window.setStat = (statName, value) => store.setStat(statName, value);
window.addStat = (statName, delta) => store.addStat(statName, delta);
window.getStat = (statName) => store.stats[statName];
window.getStatRank = (statName) => store.getStatRank(statName);

// Функции для работы с флагами
window.setFlag = (key, value) => {
  store.setFlag(key, value);
};
window.getFlag = (key) => store.getFlag(key);

// Функции для работы с временем
window.tick = (minutes) => store.tick(minutes);
window.getTime = () => store.getTimeString();
window.getTimePhase = () => store.getTimePhase();

// Функции для работы с предметами
window.addItem = (item) => store.addItem(item);
window.removeItem = (itemId) => store.removeItem(itemId);
window.equipItem = (item, slot) => store.equipItem(item, slot);
window.unequipItem = (slot) => store.unequipItem(slot);

// Вспомогательные функции для сцен
window.nextStep = (id) => {
  const element = document.getElementById(id);
  if (element && element.style) {
    element.style.display = 'block';
  }
};

// Логируем зарегистрированные функции
window.debugLogger?.log('DEBUG', 'Basic functions registered, creating engines...');

// СРАЗУ создаём движок ПОСЛЕ регистрации основных функций
const engine = new SceneEngine('#game-content');
const uiManager = new UIManager();

// Логируем создание движка
window.debugLogger?.log('DEBUG', 'SceneEngine and UIManager created');

function bootstrap() {
  const params = new URL(window.location).searchParams;
  const firstScene = params.get('scene') || 'intro';
  
  window.debugLogger?.log('INFO', `Bootstrap: Loading initial scene '${firstScene}'`);
  
  // Проверяем доступность критических функций при старте
  window.debugLogger?.checkFunctionAvailability([
    'goToMirror', 'takeShower', 'brushTeeth', 'useToilet',
    'goToRoom', 'selectPreset', 'confirmName', 'setPronoun'
  ]);
  
  engine.loadScene(firstScene);
}

// Expose the engine globally for UIManager
window.gameEngine = engine;

bootstrap();

if (import.meta.hot) {
  import.meta.hot.accept(['../core/SceneEngine.js'], () => {
    console.log('🔁 SceneEngine hot updated');
    bootstrap();
  });
}

console.log('Sissy Life Sim загружен');

// ================== ОТЛАДОЧНЫЕ ФУНКЦИИ ==================

// Функция для полной диагностики проблемы с HTML
window.debugHTMLProblem = () => {
  window.debugLogger?.log('INFO', '🔍 Starting HTML rendering diagnostics...');
  
  // 1. Проверяем доступность функций
  const functions = [
    'goToMirror', 'takeShower', 'brushTeeth', 'useToilet', 'doSkincare', 'shaveBody',
    'goToRoom', 'selectPreset', 'confirmName', 'setPronoun', 'startGame',
    'loadBathroom', 'loadHallway', 'loadSpecialBathroomActions',
    'applyMakeup', 'takeBath', 'useHairRemovalCream', 'doManicure'
  ];
  
  window.debugLogger?.log('INFO', '📋 Checking function availability:');
  functions.forEach(func => {
    const exists = typeof window[func] === 'function';
    window.debugLogger?.log(exists ? 'INFO' : 'ERROR', `  ${func}: ${exists ? '✅' : '❌'}`);
  });
  
  // 2. Проверяем текущий контент
  const content = document.getElementById('game-content');
  if (content) {
    const html = content.innerHTML;
    window.debugLogger?.log('INFO', `📄 Current content length: ${html.length}`);
    
    // Проверяем наличие экранированных тегов
    const hasEscaped = /&lt;|&gt;|&quot;/.test(html);
    window.debugLogger?.log(hasEscaped ? 'ERROR' : 'INFO', 
      `Escaped HTML tags found: ${hasEscaped ? '❌ YES' : '✅ NO'}`);
    
    // Проверяем onclick атрибуты
    const onclicks = content.querySelectorAll('[onclick]');
    window.debugLogger?.log('INFO', `Found ${onclicks.length} elements with onclick`);
    
    // Проверяем первые несколько
    Array.from(onclicks).slice(0, 5).forEach((el, i) => {
      const onclick = el.getAttribute('onclick');
      const funcName = onclick.match(/^([^(]+)\(/)?.[1];
      const funcExists = funcName && typeof window[funcName] === 'function';
      
      window.debugLogger?.log(funcExists ? 'INFO' : 'ERROR',
        `  [${i}] ${onclick} -> ${funcExists ? '✅' : '❌'}`);
    });
  }
  
  // 3. Тестируем рендеринг простого HTML через marked
  window.debugLogger?.log('INFO', '🧪 Testing marked rendering:');
  
  const testMd = `# Test
<div class="test">
  <button onclick="alert('test')">Click me</button>
</div>`;
  
  const testHtml = window.gameEngine.renderMarkdown(testMd);
  window.debugLogger?.log('INFO', 'Test markdown rendered to:', { html: testHtml });
  
  // 4. Экспортируем логи
  window.debugLogger?.log('INFO', '✅ Diagnostics complete. Check the debug panel!');
};

// Функция для принудительной перезагрузки сцены с логированием
window.reloadSceneWithDebug = (sceneId) => {
  window.debugLogger?.clearLogs();
  window.debugLogger?.log('INFO', `🔄 Force reloading scene: ${sceneId}`);
  window.gameEngine.loadScene(sceneId);
};

// Быстрая проверка исправлений
window.quickCheck = () => {
  window.debugLogger?.log('INFO', '🔍 Quick Check: Testing fixes...');
  
  // 1. Проверяем ссылки
  const content = document.getElementById('game-content');
  if (content) {
    const hasObjectText = content.innerHTML.includes('[object Object]');
    window.debugLogger?.log(hasObjectText ? 'ERROR' : 'INFO', 
      `Links rendering: ${hasObjectText ? '❌ BROKEN' : '✅ OK'}`);
  }
  
  // 2. Проверяем функции
  const criticalFuncs = ['selectPreset', 'goToMirror', 'takeShower'];
  criticalFuncs.forEach(func => {
    const exists = typeof window[func] === 'function';
    window.debugLogger?.log(exists ? 'INFO' : 'ERROR', 
      `${func}: ${exists ? '✅' : '❌'}`);
  });
  
  // 3. Пробуем загрузить проблемную сцену
  window.debugLogger?.log('INFO', 'Testing character creation scene...');
  window.gameEngine.loadScene('character_creation');
};

// Expose additional dev functions
window.uiManager = uiManager;

// ================== ГЛОБАЛЬНЫЕ ФУНКЦИИ ДЛЯ СЦЕН ==================

// Глобальные функции для создания персонажа
window.selectPreset = (presetId) => {
  const PRESETS = {
    nerd: { name: 'Ботаник', emoji: '🤓' },
    rich: { name: 'Мажор', emoji: '💎' }, 
    crossdresser: { name: 'Кроссдрессер', emoji: '💃' },
    athlete: { name: 'Спортсмен', emoji: '💪' },
    default: { name: 'Обычный', emoji: '😐' }
  };

  window.selectedPreset = presetId;
  const preset = PRESETS[presetId];
  
  const presetDetails = document.getElementById('preset-details');
  const presetInfo = document.getElementById('preset-info');
  
  if (presetDetails && presetInfo) {
    presetDetails.style.display = 'block';
    presetInfo.innerHTML = `
      <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <h3>${preset.emoji} Выбран: ${preset.name}</h3>
        <p>Отличный выбор! Теперь давайте завершим создание персонажа.</p>
      </div>
    `;
    
    // Применяем пресет через глобальную функцию
    if (window.applyCharacterPreset) {
      window.applyCharacterPreset(presetId);
    }
    
    // Прокручиваем к следующему шагу
    const stepName = document.getElementById('step-name');
    if (stepName) {
      stepName.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

window.confirmName = () => {
  const nameInput = document.getElementById('charName');
  if (!nameInput) return;
  
  const name = nameInput.value.trim();
  if (!name) {
    alert('Пожалуйста, введите имя');
    return;
  }
  
  window.setFlag('name', name);
  
  const stepName = document.getElementById('step-name');
  const stepPronoun = document.getElementById('step-pronoun');
  
  if (stepName && stepPronoun) {
    stepName.style.display = 'none';
    stepPronoun.style.display = 'block';
    stepPronoun.scrollIntoView({ behavior: 'smooth' });
  }
};

window.setPronoun = (pronoun) => {
  window.setFlag('pronoun', pronoun);
  
  const stepPronoun = document.getElementById('step-pronoun');
  const finishDiv = document.getElementById('finish');
  const characterSummary = document.getElementById('character-summary');
  
  if (stepPronoun) stepPronoun.style.display = 'none';
  
  // Создаем итоговую информацию
  const name = window.getFlag('name');
  const PRESETS = {
    nerd: { name: 'Ботаник', emoji: '🤓' },
    rich: { name: 'Мажор', emoji: '💎' }, 
    crossdresser: { name: 'Кроссдрессер', emoji: '💃' },
    athlete: { name: 'Спортсмен', emoji: '💪' },
    default: { name: 'Обычный', emoji: '😐' }
  };
  
  const preset = PRESETS[window.selectedPreset];
  
  if (characterSummary) {
    characterSummary.innerHTML = `
      <div style="background: rgba(16, 185, 129, 0.1); padding: 20px; border-radius: 8px; border: 1px solid #10b981;">
        <h3>✅ Ваш персонаж готов:</h3>
        <p><strong>Имя:</strong> ${name}</p>
        <p><strong>Профиль:</strong> ${preset.emoji} ${preset.name}</p>
        <p><strong>Местоимения:</strong> ${pronoun}</p>
      </div>
    `;
  }
  
  if (finishDiv) {
    finishDiv.style.display = 'block';
    finishDiv.scrollIntoView({ behavior: 'smooth' });
  }
};

window.startGame = () => {
  // Сохраняем игру и переходим к началу
  window.saveGame();
  window.location.search = '?scene=start';
};

// Навигационные функции для коридора
window.goToRoom = (roomId) => {
  // Добавляем небольшую задержку для эффекта перехода
  if (event && event.target) {
    const navOption = event.target.closest('.nav-option');
    if (navOption) {
      navOption.style.transform = 'scale(0.95)';
      setTimeout(() => {
        if (window.gameEngine) {
          window.gameEngine.loadScene(roomId);
        } else {
          window.location.search = `?scene=${roomId}`;
        }
      }, 150);
      return;
    }
  }
  
  // Fallback без анимации
  if (window.gameEngine) {
    window.gameEngine.loadScene(roomId);
  } else {
    window.location.search = `?scene=${roomId}`;
  }
};

// ================== ФУНКЦИИ ДЛЯ ВАННОЙ КОМНАТЫ ==================

// Загрузка ванной комнаты
window.loadBathroom = async function() {
  try {
    // Импорт системы квартир
    const ApartmentSystem = (await import('../systems/ApartmentSystem.js')).default;
    const apartmentSystem = new ApartmentSystem(window.store);
    
    // Получение изображения ванной для текущей квартиры
    const bathroomImage = apartmentSystem.getRoomImage('bathroom');
    
    // Отображение изображения
    const imageContainer = document.getElementById('bathroom-image-container');
    if (imageContainer) {
      imageContainer.innerHTML = `
        <div class="location-image">
          <img src="${bathroomImage}" alt="Ванная комната" onerror="this.src='/assets/images/placeholder_bathroom.jpg'">
        </div>
      `;
    }
    
    // Загрузка специальных действий
    window.loadSpecialBathroomActions();
    
  } catch (error) {
    console.error('Ошибка загрузки ванной:', error);
    
    // Fallback отображение
    const imageContainer = document.getElementById('bathroom-image-container');
    if (imageContainer) {
      imageContainer.innerHTML = `
        <div class="location-image">
          <img src="/assets/images/placeholder_bathroom.jpg" alt="Ванная комната">
        </div>
      `;
    }
  }
};

// Загрузка специальных действий
window.loadSpecialBathroomActions = function() {
  const specialContainer = document.getElementById('bathroom-special-actions');
  if (!specialContainer) return;
  
  const actions = [];
  
  // Проверяем наличие различных предметов в инвентаре
  const inventory = window.store.inventory || [];
  const femininity = window.getStat('femininity') || 0;
  
  // Макияж
  if (inventory.some(item => item.id === 'makeup_basic') && femininity >= 10) {
    actions.push({
      text: '💄 Накраситься',
      onclick: 'applyMakeup()',
      description: 'Нанести макияж'
    });
  }
  
  // Ванна (только для роскошных квартир)
  const apartmentType = window.store.flags.apartmentType || 'parents';
  if (apartmentType === 'luxury') {
    actions.push({
      text: '🛁 Принять ванну',
      onclick: 'takeBath()',
      description: 'Расслабиться в джакузи'
    });
  }
  
  // Депиляция (если есть соответствующие средства)
  if (inventory.some(item => item.id === 'hair_removal_cream')) {
    actions.push({
      text: '🧴 Депиляция кремом',
      onclick: 'useHairRemovalCream()',
      description: 'Удалить волосы кремом'
    });
  }
  
  // Маникюр
  if (inventory.some(item => item.id === 'nail_polish') && femininity >= 20) {
    actions.push({
      text: '💅 Сделать маникюр',
      onclick: 'doManicure()',
      description: 'Покрасить ногти'
    });
  }
  
  if (actions.length > 0) {
    specialContainer.innerHTML = `
      <h4>Дополнительные действия:</h4>
      <div class="special-actions">
        ${actions.map(action => `
          <button class="special-action-btn" onclick="${action.onclick}" title="${action.description}">
            ${action.text}
          </button>
        `).join('')}
      </div>
    `;
  }
};

// Основные действия в ванной
window.goToMirror = function() {
  window.gameEngine.loadScene('mirror');
};

window.takeShower = function() {
  const hygiene = window.getStat('hygiene') || 0;
  
  if (hygiene >= 90) {
    alert('🚿 Вы уже достаточно чисты. Не стоит тратить воду понапрасну.');
    return;
  }
  
  window.addStat('hygiene', 25);
  window.addStat('mood', 5);
  window.addStat('energy', 5);
  window.tick(20);
  
  // Проверяем женственность для разных описаний
  const femininity = window.getStat('femininity') || 0;
  
  if (femininity >= 30) {
    alert('🚿 Вы нежно намылили своё тело ароматным гелем. Кожа стала мягкой и гладкой. Вы чувствуете себя свежо и женственно.');
    window.addStat('femininity', 1);
  } else {
    alert('🚿 Вы быстро помылись под горячей водой. Чувствуете себя чище и бодрее.');
  }
  
  window.loadSpecialBathroomActions(); // Обновляем доступные действия
};

window.brushTeeth = function() {
  window.addStat('hygiene', 10);
  window.addStat('mood', 2);
  window.tick(5);
  
  alert('🦷 Вы тщательно почистили зубы. Дыхание стало свежим, а улыбка - ослепительной!');
};

window.useToilet = function() {
  window.tick(3);
  
  const messages = [
    '🚽 Вы справили нужду. Чувствуете облегчение.',
    '🚽 Время, проведённое в размышлениях... Дела сделаны.',
    '🚽 Несколько минут наедине с собой.'
  ];
  
  alert(messages[Math.floor(Math.random() * messages.length)]);
};

window.doSkincare = function() {
  const femininity = window.getStat('femininity') || 0;
  
  window.addStat('hygiene', 15);
  window.addStat('mood', 8);
  window.addStat('femininity', 2);
  window.tick(15);
  
  if (femininity >= 40) {
    alert('🧴 Вы тщательно очистили кожу, нанесли тоник и увлажняющий крем. Кожа выглядит сияющей и ухоженной!');
  } else {
    alert('🧴 Вы умылись и использовали немного крема. Кожа стала более мягкой.');
  }
  
  window.loadSpecialBathroomActions();
};

window.shaveBody = function() {
  const bodyHair = window.store.body?.bodyHair || 2;
  
  if (bodyHair <= 0) {
    alert('🪒 Ваше тело уже идеально гладкое. Бриться пока не нужно.');
    return;
  }
  
  window.addStat('hygiene', 10);
  window.addStat('femininity', 3);
  window.addStat('mood', 5);
  window.tick(25);
  
  // Уменьшаем волосы на теле
  if (window.store.body) {
    window.store.body.bodyHair = Math.max(0, bodyHair - 1);
  }
  
  alert('🪒 Вы тщательно побрились, удалив нежелательные волосы. Кожа стала гладкой и нежной на ощупь.');
  
  window.loadSpecialBathroomActions();
};

// Специальные действия
window.applyMakeup = function() {
  window.addStat('femininity', 5);
  window.addStat('mood', 10);
  window.addStat('arousal', 3);
  window.tick(20);
  
  alert('💄 Вы аккуратно нанесли макияж, подчеркнув свои черты. В зеркале отражается более женственное лицо.');
};

window.takeBath = function() {
  window.addStat('hygiene', 30);
  window.addStat('mood', 15);
  window.addStat('stress', -10);
  window.addStat('energy', 10);
  window.tick(45);
  
  alert('🛁 Вы расслабились в ароматной ванне с пеной. Тёплая вода смыла усталость и стресс.');
};

window.useHairRemovalCream = function() {
  const bodyHair = window.store.body?.bodyHair || 2;
  
  if (bodyHair <= 0) {
    alert('🧴 Ваше тело уже идеально гладкое.');
    return;
  }
  
  window.addStat('femininity', 4);
  window.addStat('hygiene', 5);
  window.addStat('mood', 8);
  window.tick(30);
  
  // Эффективнее обычного бритья
  if (window.store.body) {
    window.store.body.bodyHair = Math.max(0, bodyHair - 2);
  }
  
  alert('🧴 Крем для депиляции сделал кожу невероятно гладкой и мягкой. Результат продержится дольше обычного.');
  
  window.loadSpecialBathroomActions();
};

window.doManicure = function() {
  window.addStat('femininity', 6);
  window.addStat('mood', 12);
  window.addStat('hygiene', 8);
  window.tick(40);
  
  alert('💅 Вы сделали себе красивый маникюр. Ногти выглядят изящно и женственно.');
};

// ================== ФУНКЦИИ ДЛЯ КОРИДОРА ==================

// Загрузка коридора
window.loadHallway = async function() {
  try {
    // Импорт системы квартир
    const ApartmentSystem = (await import('../systems/ApartmentSystem.js')).default;
    const apartmentSystem = new ApartmentSystem(window.store);
    
    // Получение информации о текущей квартире
    const apartment = apartmentSystem.getCurrentApartmentType();
    const description = apartmentSystem.getApartmentDescription();
    const hallwayImage = apartmentSystem.getRoomImage('hallway');
    
    // Отображение изображения
    const imageContainer = document.getElementById('hallway-image-container');
    if (imageContainer) {
      imageContainer.innerHTML = `
        <div class="location-image">
          <img src="${hallwayImage}" alt="Коридор" onerror="this.src='/assets/images/placeholder_hallway.jpg'">
          <div class="image-overlay">
            <h2>${apartment.name}</h2>
          </div>
        </div>
      `;
    }
    
    // Отображение описания
    const descContainer = document.getElementById('hallway-description');
    if (descContainer) {
      descContainer.innerHTML = `
        <div class="apartment-info">
          <p class="apartment-desc">${description.description}</p>
          <div class="apartment-features">
            <h4>Особенности:</h4>
            <ul>
              ${description.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
          </div>
        </div>
      `;
    }
    
    // Загрузка специальных действий для квартиры
    window.loadApartmentActions(apartment);
    
  } catch (error) {
    console.error('Ошибка загрузки коридора:', error);
    
    // Fallback отображение
    const imageContainer = document.getElementById('hallway-image-container');
    if (imageContainer) {
      imageContainer.innerHTML = `
        <div class="location-image">
          <img src="/assets/images/placeholder_hallway.jpg" alt="Коридор">
          <div class="image-overlay">
            <h2>Коридор</h2>
          </div>
        </div>
      `;
    }
    
    const descContainer = document.getElementById('hallway-description');
    if (descContainer) {
      descContainer.innerHTML = `
        <div class="apartment-info">
          <p>Вы находитесь в коридоре. Отсюда можно попасть в разные комнаты.</p>
        </div>
      `;
    }
  }
};

// Загрузка действий для конкретного типа квартиры
window.loadApartmentActions = function(apartment) {
  const actionsContainer = document.getElementById('hallway-actions');
  if (!actionsContainer) return;
  
  const actions = [];
  
  switch (apartment.id) {
    case 'luxury':
      actions.push({
        text: '🏠 Вызвать консьержа',
        onclick: 'callConcierge()',
        description: 'Обратиться к консьержу за помощью'
      });
      actions.push({
        text: '📺 Включить умный дом',
        onclick: 'activateSmartHome()',
        description: 'Управление освещением и климатом'
      });
      break;
      
    case 'cheap':
      actions.push({
        text: '🔧 Проверить что сломалось',
        onclick: 'checkBrokenStuff()',
        description: 'В дешевой квартире всегда что-то ломается'
      });
      break;
      
    case 'parents':
      actions.push({
        text: '👨‍👩‍👧‍👦 Поговорить с родителями',
        onclick: 'talkToParents()',
        description: 'Пообщаться с семьей'
      });
      break;
      
    case 'studio':
      actions.push({
        text: '🎨 Заняться творчеством',
        onclick: 'doCreativeWork()',
        description: 'Использовать вдохновляющую атмосферу'
      });
      break;
  }
  
  if (actions.length > 0) {
    actionsContainer.innerHTML = `
      <h4>Специальные действия:</h4>
      <div class="special-actions">
        ${actions.map(action => `
          <button class="special-action-btn" onclick="${action.onclick}" title="${action.description}">
            ${action.text}
          </button>
        `).join('')}
      </div>
    `;
  }
};

// Специальные действия для разных типов квартир
window.callConcierge = function() {
  window.addStat('mood', 5);
  window.addStat('dignity', 2);
  window.tick(10);
  
  alert('🏠 Консьерж приветливо поинтересовался вашими потребностями. Приятно жить в роскоши!');
};

window.activateSmartHome = function() {
  window.addStat('mood', 3);
  window.addStat('energy', 5);
  window.tick(5);
  
  alert('📺 Умный дом настроил идеальное освещение и температуру. Технологии делают жизнь лучше!');
};

window.checkBrokenStuff = function() {
  const problems = [
    'Протекает кран',
    'Не работает лампочка',
    'Скрипит дверь',
    'Отклеились обои',
    'Шумят трубы'
  ];
  
  const problem = problems[Math.floor(Math.random() * problems.length)];
  
  window.addStat('mood', -3);
  window.addStat('stress', 5);
  window.tick(8);
  
  alert(`🔧 ${problem}. Ещё одна проблема в этой дешёвой квартире...`);
};

window.talkToParents = function() {
  const femininity = window.getStat('femininity') || 0;
  
  window.addStat('mood', 3);
  window.addStat('social', 2);
  window.tick(15);
  
  if (femininity >= 30) {
    window.addStat('stress', 5);
    alert('👨‍👩‍👧‍👦 Родители обратили внимание на изменения в вашей внешности. Вы чувствуете некоторое напряжение.');
  } else {
    alert('👨‍👩‍👧‍👦 Приятный разговор с родителями. Семейное тепло всегда поднимает настроение.');
  }
};

window.doCreativeWork = function() {
  window.addStat('mood', 8);
  window.addStat('energy', -10);
  window.addStat('stress', -5);
  window.tick(45);
  
  alert('🎨 Вы погрузились в творческий процесс. Студийная атмосфера вдохновляет на новые идеи!');
};

// Финальная проверка всех зарегистрированных функций
window.debugLogger?.log('DEBUG', 'All scene functions registered. Final check:');
window.debugLogger?.checkFunctionAvailability([
  'selectPreset', 'confirmName', 'setPronoun', 'startGame',
  'goToRoom', 'goToMirror', 'takeShower', 'brushTeeth', 'useToilet',
  'loadBathroom', 'loadHallway', 'applyMakeup', 'takeBath'
]);

// Debug функции
window.debugStats = () => {
  console.table(store.stats);
};

window.debugFlags = () => {
  console.table(store.flags);
};

window.debugTime = () => {
  console.log(`День ${store.time.day}, ${store.getTimeString()}, фаза: ${store.getTimePhase()}`);
};

window.resetGame = () => {
  localStorage.removeItem('sls-save');
  localStorage.removeItem('sls-settings');
  location.reload();
};

// Тестовые функции для разработки
window.testStats = () => {
  console.log('Тестирование статистик...');
  store.addStat('femininity', 25);
  store.addStat('sissification', 15);
  store.addStat('submission', 10);
  store.addStat('arousal', 30);
  store.addStat('stress', 20);
  store.addStat('mood', -10);
  console.log('Статистики обновлены');
};

window.testTime = () => {
  console.log('Тестирование времени...');
  store.tick(120); // +2 часа
  console.log(`Новое время: ${store.getTimeString()}`);
};

// Функция для добавления тестовых предметов
window.testItems = () => {
  console.log('Добавление тестовых предметов...');
  
  const testItems = [
    {
      id: 'pink_panties',
      name: 'Розовые трусики',
      icon: '👙',
      slot: 'underwear',
      effects: { femininity: 5, arousal: 2 },
      description: 'Милые розовые трусики из шелка'
    },
    {
      id: 'red_dress',
      name: 'Красное платье',
      icon: '👗',
      slot: 'upper',
      effects: { femininity: 10, dignity: -3 },
      description: 'Элегантное красное платье'
    },
    {
      id: 'high_heels',
      name: 'Туфли на каблуках',
      icon: '👠',
      slot: 'shoes',
      effects: { femininity: 8, energy: -5 },
      description: 'Красивые туфли на высоком каблуке'
    }
  ];
  
  testItems.forEach(item => store.addItem(item));
  console.log('Тестовые предметы добавлены');
};

// Функция для тестирования UI
window.testUI = () => {
  console.log('Тестирование UI...');
  
  // Добавляем предметы
  window.testItems();
  
  // Изменяем статистики
  window.testStats();
  
  // Показываем уведомление
  uiManager.showNotification('UI тестирование завершено!', 'success');
  
  console.log('UI тестирование завершено');
};

// Функция для тестирования пресетов
window.testPresets = () => {
  console.log('Тестирование пресетов...');
  
  const presets = CharacterPresets.getAllPresets();
  console.log('Доступные пресеты:', presets);
  
  // Тестируем каждый пресет
  presets.forEach(preset => {
    const effects = CharacterPresets.getPresetEffects(preset.id);
    console.log(`Эффекты пресета ${preset.name}:`, effects);
  });
  
  // Применяем тестовый пресет
  window.applyCharacterPreset('crossdresser');
  console.log('Применен пресет кроссдрессера');
  
  uiManager.showNotification('Пресеты протестированы!', 'success');
};

  console.log('🎮 Dev функции доступны в window: saveGame, loadGame, setStat, addStat, getStat, testStats, testTime, testItems, testUI, testPresets, debugStats, resetGame, runTests, quickTest, stressTest, testSetCommands, testNewGameSystem, testMissingScenes, testSubscriptionSystem, testCharacterCreationFlow, testLocationSystem, testLocationNavigation, testBathroomActions');
  console.log('🐛 Debug функции: debugHTMLProblem(), reloadSceneWithDebug(sceneId), debugLogger.exportLogs(), quickCheck()');
  console.log('🚀 Выполните quickCheck() в консоли для проверки исправлений!');
  
  // Автоматически показываем отладочную панель при загрузке
  setTimeout(() => {
    if (window.debugLogger && document.getElementById('debug-panel')) {
      window.debugLogger.log('INFO', '✅ Debug panel initialized and ready');
      window.debugLogger.log('INFO', '🔧 CRITICAL FIXES APPLIED - run quickCheck() to verify');
    }
  }, 100); 

// Команды для управления дебаг панелью
window.showDebug = () => {
  if (window.debugLogger) {
    window.debugLogger.showPanel();
    console.log('✅ Дебаг панель включена');
  }
};

window.hideDebug = () => {
  if (window.debugLogger) {
    window.debugLogger.hidePanel();
    console.log('✅ Дебаг панель отключена');
  }
};

// Экспортируем функции для использования в других модулях 