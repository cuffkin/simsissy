const listeners = new Set();

function emit(path, value) {
  listeners.forEach((cb) => cb(path, value));
}

// Глобальное хранилище состояния игры с реактивностью

// Дефолтное состояние
const defaultState = {
  // Базовые статистики
  stats: {
    // Основные
    health: 100,
    energy: 100,
    mood: 50,
    stress: 20,
    arousal: 0,
    hygiene: 80,
    willpower: 50,
    
    // Фетиш статистики
    femininity: 0,
    dignity: 50,
    submission: 0,
    sissification: 0,
    bimbofication: 0,
    analTraining: 0,
    
    // Экономика
    money: 100,
    
    // Социальные
    reputation: 0,
    social: 0,
  },
  
  // Параметры тела
  body: {
    // Размер груди (0-6: flat, A, B, C, D, DD, E+)
    breastSize: 0,
    
    // Размер члена (0-5: micro, tiny, small, average, large, huge)
    penisSize: 3, // average
    
    // Размер задницы (0-5: flat, small, average, bubble, large, huge)
    buttSize: 2, // average
    
    // Ширина бедер (0-4: narrow, average, wide, very wide, extreme)
    hips: 1, // average
    
    // Длина волос (0-5: buzz, short, medium, long, very long, extreme)
    hairLength: 1, // short
    
    // Цвет волос
    hairColor: 'brown',
    
    // Стиль волос
    hairStyle: 'messy',
    
    // Форма лица (0-3: masculine, androgynous, soft, feminine)
    faceShape: 0, // masculine
    
    // Губы (0-3: thin, average, full, plump)
    lips: 1, // average
    
    // Телосложение (0-4: skinny, slim, average, curvy, thick)
    bodyType: 2, // average
    
    // Рост (см)
    height: 175,
    
    // Вес (кг)
    weight: 70,
    
    // Мышечная масса (0-4: none, light, moderate, athletic, muscular)
    muscle: 1, // light
    
    // Волосы на теле (0-3: smooth, light, moderate, hairy)
    bodyHair: 2, // moderate
    
    // Особые черты
    features: {
      tattoos: [],
      piercings: [],
      scars: []
    }
  },
  
  // Ранги (для разблокировки контента)
  ranks: {
    femininity: 0,
    submission: 0,
    sissification: 0,
    bimbofication: 0,
    analTraining: 0,
  },
  
  // Время
  time: {
    day: 1,
    minutes: 480, // 8:00 утра
  },
  
  // Экипировка
  equipped: {
    hair: null,
    upper: null,
    lower: null,
    underwear: null,
    shoes: null,
    accessories: null,
    chastity: null,
  },
  
  // Инвентарь
  inventory: [],
  
  // Флаги состояния
  flags: {
    isFirstDay: true,
    hasVisitedStore: false,
    lastOrgasmTime: 0,
    lastOrgasmType: null,
    currentScene: 'start',
  },
  
  // Настройки
  settings: {
    fontSize: 'medium',
    fontFamily: 'system',
    theme: 'dark',
    autoSave: true,
    confirmChoices: true,
    showStatChanges: true,
    soundEnabled: false,
  }
};

// Создание реактивного хранилища
function createStore() {
  // Загрузка сохраненного состояния или использование дефолтного
  const savedState = loadFromStorage();
  const initialState = savedState || defaultState;
  
  // Список колбеков для подписчиков
  const subscribers = [];
  
  // Создание прокси для реактивности
  const store = new Proxy(initialState, {
    set(target, property, value) {
      const oldValue = target[property];
      target[property] = value;
      
      // Уведомление подписчиков об изменении
      subscribers.forEach(callback => {
        try {
          callback({ property, oldValue, newValue: value });
        } catch (error) {
          console.error('Ошибка в подписчике store:', error);
        }
      });
      
      // Автосохранение при изменениях
      if (store.settings?.autoSave) {
        saveToStorage(store);
      }
      
      return true;
    },
    
    get(target, property) {
      const value = target[property];
      
      // Возвращаем прокси для вложенных объектов (но без рекурсивного прокси для избежания проблем)
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        return value; // Возвращаем объект как есть, без дополнительного прокси
      }
      
      return value;
    }
  });
  
  // Методы для работы с подписками
  store.subscribe = (callback) => {
    subscribers.push(callback);
    return () => {
      const index = subscribers.indexOf(callback);
      if (index > -1) subscribers.splice(index, 1);
    };
  };
  
  // Вспомогательные методы
  store.getStat = (stat) => store.stats[stat] || 0;
  
  store.setStat = (stat, value) => {
    if (store.stats[stat] !== undefined) {
      const oldValue = store.stats[stat];
      // Округляем до целого числа
      const newValue = Math.round(Math.max(-100, Math.min(100, value)));
      store.stats[stat] = newValue;
      updateRanks(store, stat);
      
      // Уведомляем подписчиков о изменении статистики
      subscribers.forEach(callback => {
        try {
          callback({ property: `stats.${stat}`, oldValue, newValue });
        } catch (error) {
          console.error('Ошибка в подписчике setStat:', error);
        }
      });
    }
  };
  
  store.addStat = (stat, amount) => {
    store.setStat(stat, store.getStat(stat) + amount);
  };

  store.setFlag = (flag, value) => {
    const oldValue = store.flags[flag];
    store.flags[flag] = value;
    
    // Уведомляем подписчиков о изменении флага
    subscribers.forEach(callback => {
      try {
        callback({ property: `flags.${flag}`, oldValue, newValue: value });
      } catch (error) {
        console.error('Ошибка в подписчике setFlag:', error);
      }
    });
  };

  store.getFlag = (flag) => store.flags[flag];

  store.getRank = (stat) => store.ranks[stat] || 0;
  
  store.getStatRank = (statName) => {
    const value = store.stats[statName] || 0;
    const min = (statName === 'mood' || statName === 'dignity' || statName === 'femininity' || statName === 'submission') ? -100 : 0;
    const max = 100;
    const range = max - min;
    const normalizedValue = (value - min) / range;
    
    if (normalizedValue <= 0.2) return 0;
    if (normalizedValue <= 0.4) return 1;
    if (normalizedValue <= 0.6) return 2;
    if (normalizedValue <= 0.8) return 3;
    return 4;
  };
  
  store.addItem = (item) => {
    store.inventory.push(item);
  };
  
  store.removeItem = (itemId) => {
    const index = store.inventory.findIndex(item => item.id === itemId);
    if (index > -1) store.inventory.splice(index, 1);
  };
  
  store.hasItem = (itemId) => {
    return store.inventory.some(item => item.id === itemId);
  };
  
  store.equipItem = (item) => {
    if (item.slot && store.equipped[item.slot] !== undefined) {
      // Снять текущий предмет
      if (store.equipped[item.slot]) {
        store.inventory.push(store.equipped[item.slot]);
      }
      
      // Надеть новый
      store.equipped[item.slot] = item;
      
      // Удалить из инвентаря
      store.removeItem(item.id);
      
      // Применить эффекты
      if (item.effects) {
        Object.entries(item.effects).forEach(([stat, value]) => {
          store.addStat(stat, value);
        });
      }
    }
  };
  
  store.unequipItem = (slot) => {
    const item = store.equipped[slot];
    if (item) {
      // Убрать эффекты
      if (item.effects) {
        Object.entries(item.effects).forEach(([stat, value]) => {
          store.addStat(stat, -value);
        });
      }
      
      // Вернуть в инвентарь
      store.inventory.push(item);
      store.equipped[slot] = null;
    }
  };
  
  // Время
  store.tick = (minutes) => {
    store.time.minutes += minutes;
    
    // Обработка перехода дня
    while (store.time.minutes >= 1440) {
      store.time.minutes -= 1440;
      store.time.day += 1;
      store.flags.isFirstDay = false;
      
      // Ежедневные изменения
      applyDailyChanges(store);
    }
    
    // Пассивные изменения
    applyPassiveChanges(store, minutes);
  };

  // Сохранение игры
  store.saveGame = () => {
    try {
      // Извлекаем только данные состояния (без методов)
      const saveData = {
        stats: store.stats,
        body: store.body,
        ranks: store.ranks,
        time: store.time,
        equipped: store.equipped,
        inventory: store.inventory,
        flags: store.flags,
        settings: store.settings
      };
      
      localStorage.setItem('sls-save', JSON.stringify(saveData));
      return true;
    } catch (error) {
      console.error('Ошибка сохранения игры:', error);
      return false;
    }
  };

  // Загрузка игры
  store.loadGame = () => {
    try {
      const saved = localStorage.getItem('sls-save');
      if (saved) {
        const data = JSON.parse(saved);
        
        // Обновляем состояние
        Object.assign(store.stats, data.stats || {});
        Object.assign(store.body, data.body || {});
        Object.assign(store.ranks, data.ranks || {});
        Object.assign(store.time, data.time || {});
        Object.assign(store.equipped, data.equipped || {});
        Object.assign(store.flags, data.flags || {});
        Object.assign(store.settings, data.settings || {});
        
        // Заменяем инвентарь полностью
        store.inventory.splice(0, store.inventory.length, ...(data.inventory || []));
        
        return true;
      }
    } catch (error) {
      console.error('Ошибка загрузки игры:', error);
    }
    return false;
  };

  // Сброс игры к начальным значениям
  store.resetToDefaults = () => {
    try {
      // Создаем новую копию defaultState
      const newState = JSON.parse(JSON.stringify(defaultState));
      
      // Обновляем все свойства
      Object.assign(store.stats, newState.stats);
      Object.assign(store.body, newState.body);
      Object.assign(store.ranks, newState.ranks);
      Object.assign(store.time, newState.time);
      Object.assign(store.equipped, newState.equipped);
      Object.assign(store.flags, newState.flags);
      Object.assign(store.settings, newState.settings);
      
      // Очищаем инвентарь
      store.inventory.splice(0, store.inventory.length);
      
      console.log('Игра сброшена к начальным значениям');
      return true;
    } catch (error) {
      console.error('Ошибка сброса игры:', error);
      return false;
    }
  };
  
  store.getTimeString = () => {
    const hours = Math.floor(store.time.minutes / 60);
    const mins = store.time.minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };
  
  store.getDayPhase = () => {
    const hours = Math.floor(store.time.minutes / 60);
    if (hours >= 6 && hours < 12) return 'morning';
    if (hours >= 12 && hours < 18) return 'afternoon';
    if (hours >= 18 && hours < 24) return 'evening';
    return 'night';
  };
  
  return store;
}

// Обновление рангов на основе статистик
function updateRanks(store, stat) {
  const rankStats = ['femininity', 'submission', 'sissification', 'bimbofication', 'analTraining'];
  
  if (rankStats.includes(stat)) {
    const value = store.stats[stat];
    let rank = 0;
    
    if (value >= 80) rank = 4;
    else if (value >= 60) rank = 3;
    else if (value >= 40) rank = 2;
    else if (value >= 20) rank = 1;
    
    store.ranks[stat] = rank;
  }
}

// Ежедневные изменения
function applyDailyChanges(store) {
  // Базовое восстановление
  store.addStat('energy', 50);
  store.addStat('health', 10);
  store.addStat('stress', -10);
  
  // Снижение гигиены
  store.addStat('hygiene', -20);
  
  // Эффекты от гормонов если есть
  const hormones = store.inventory.filter(item => item.id?.includes('hormone_'));
  hormones.forEach(hormone => {
    if (hormone.uses > 0) {
      // Применить эффект гормона
      applyHormoneEffect(store, hormone);
      hormone.uses--;
      
      if (hormone.uses <= 0) {
        store.removeItem(hormone.id);
      }
    }
  });
}

// Применение эффектов гормонов
async function applyHormoneEffect(store, hormone) {
  const BodySystem = (await import('/systems/BodySystem.js')).default;
  const bodySystem = new BodySystem(store);
  
  const hormoneType = hormone.effects?.hormone;
  if (hormoneType) {
    bodySystem.applyHormoneEffects(hormoneType, 1); // 1 день
  }
}

// Пассивные изменения со временем
async function applyPassiveChanges(store, minutes) {
  // Снижение энергии
  store.addStat('energy', -minutes * 0.05);
  
  // Повышение стресса
  store.addStat('stress', minutes * 0.02);
  
  // Снижение гигиены
  store.addStat('hygiene', -minutes * 0.03);
  
  // Пассивное накопление возбуждения
  try {
    const ArousalSystem = (await import('/systems/ArousalSystem.js')).default;
    const arousalSystem = new ArousalSystem(store);
    arousalSystem.passiveArousalGain(minutes);
  } catch (error) {
    // Если система еще не загружена, просто базовое накопление
    store.addStat('arousal', minutes * 0.01);
  }
}

// Сохранение в localStorage
function saveToStorage(state) {
  try {
    localStorage.setItem('sissyLifeSimSave', JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save game:', error);
  }
}

// Загрузка из localStorage
function loadFromStorage() {
  try {
    const saved = localStorage.getItem('sissyLifeSimSave');
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to load save:', error);
    return null;
  }
}

// Создание глобального экземпляра
const store = createStore();

// Экспорт для использования в других модулях
export default store;

// Также делаем доступным глобально для отладки
window.store = store;
window.getStat = store.getStat;
window.setStat = store.setStat;
window.addStat = store.addStat;
window.tick = store.tick;
window.addItem = store.addItem; 