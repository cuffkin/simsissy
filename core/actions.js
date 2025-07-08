import store from '../systems/store.js';
import SceneEngine from './SceneEngine.js';

export function handleSpecialLink(href, engine) {
  try {
    if (href.startsWith('set:')) {
      // format: set:stat=value&next=scene
      const q = href.slice(4);
      const params = new URLSearchParams(q);
      
      params.forEach((v, k) => {
        if (k === 'next') return;
        
        // Обработка математических операций
        if (v.startsWith('+') || v.startsWith('-')) {
          const delta = parseInt(v);
          if (!isNaN(delta)) {
            store.addStat(k, delta);
          }
        } else {
          // Обычное присваивание
          const num = Number(v);
          if (!isNaN(num)) {
            store.setStat(k, num);
          } else {
            store.flags[k] = v;
          }
        }
      });
      
      const next = params.get('next');
      if (next) {
        // Добавляем небольшую задержку для отображения изменений
        setTimeout(() => engine.loadScene(next), 100);
      }
      return true;
    }
    
    if (href.startsWith('prompt:')) {
      // format prompt:field&next=scene
      const q = href.slice(7);
      const params = new URLSearchParams(q);
      const field = params.keys().next().value;
      const val = prompt('Введите значение:');
      
      if (val !== null) {
        store.flags[field] = val;
      }
      
      const next = params.get('next');
      if (next) engine.loadScene(next);
      return true;
    }
    
    if (href.startsWith('tick:')) {
      // format tick:minutes&next=scene
      const q = href.slice(5);
      const params = new URLSearchParams(q);
      const minutes = parseInt(params.get('minutes') || '0');
      
      if (minutes > 0) {
        store.tick(minutes);
      }
      
      const next = params.get('next');
      if (next) engine.loadScene(next);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Ошибка при обработке специальной ссылки:', error);
    console.error('Href:', href);
    return false;
  }
}

// Функция для валидации статистик
export function validateStats(stats) {
  const errors = [];
  
  // Проверяем базовые диапазоны
  const ranges = {
    'health': [0, 100],
    'energy': [0, 100],
    'mood': [-100, 100],
    'stress': [0, 100],
    'arousal': [0, 100],
    'hygiene': [0, 100],
    'willpower': [0, 100],
    'femininity': [-100, 100],
    'dignity': [-100, 100],
    'submission': [-100, 100],
    'sissification': [0, 100],
    'bimbofication': [0, 100],
    'analTraining': [0, 100]
  };
  
  for (const [statName, value] of Object.entries(stats)) {
    const [min, max] = ranges[statName];
    if (min !== undefined && max !== undefined) {
      if (value < min || value > max) {
        errors.push(`${statName}: ${value} вне диапазона [${min}, ${max}]`);
      }
    }
  }
  
  return errors;
}

// Функция для проверки игрового состояния
export function validateGameState(gameState) {
  const errors = [];
  
  // Проверяем наличие обязательных полей
  if (!gameState.time) errors.push('Отсутствует время');
  if (!gameState.stats) errors.push('Отсутствует статистика');
  
  // Проверяем статистики
  if (gameState.stats) {
    const statErrors = validateStats(gameState.stats);
    errors.push(...statErrors);
  }
  
  // Проверяем время
  if (gameState.time) {
    if (gameState.time.day < 1) errors.push('Некорректный день');
    if (gameState.time.minutes < 0 || gameState.time.minutes >= 1440) {
      errors.push('Некорректное время в минутах');
    }
  }
  
  return errors;
} 