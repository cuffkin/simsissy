// Система стартовых пресетов персонажа

const PRESETS = {
  nerd: {
    id: 'nerd',
    name: 'Ботаник',
    emoji: '🤓',
    description: 'Умный и образованный, но физически слабый. Быстро обучается новому, но имеет проблемы с социализацией.',
    
    stats: {
      // Базовые статистики
      health: 80,      // Слабое здоровье
      energy: 90,      // Высокая энергия от сидячего образа жизни
      mood: -10,       // Легкая депрессия
      stress: 30,      // Повышенный стресс
      arousal: 0,
      hygiene: 70,     // Не очень следит за собой
      willpower: 60,   // Хорошая сила воли от самоконтроля
      
      // Фетиш статистики
      femininity: -20,  // Традиционно маскулинная роль
      dignity: 80,     // Высокое самоуважение
      submission: 10,  // Низкая склонность к подчинению
      sissification: 0,
      bimbofication: 0,
      analTraining: 0,
      
      // Дополнительные
      money: 800,      // Немного денег от подработок
      intelligence: 90, // Высокий интеллект
      social: 30       // Низкие социальные навыки
    },
    
    inventory: [
      {
        id: 'glasses',
        name: 'Очки',
        icon: '👓',
        slot: 'accessories',
        effects: { intelligence: 5, social: -2 },
        description: 'Толстые очки для близорукости'
      },
      {
        id: 'programming_book',
        name: 'Книга по программированию',
        icon: '📚',
        type: 'item',
        effects: { intelligence: 3 },
        description: 'Толстая книга по C++'
      }
    ],
    
    equipped: {
      accessories: 'glasses'
    },
    
    traits: [
      'fast_learner',    // Быстрое изучение новых навыков
      'social_anxiety',  // Сложности в социальных ситуациях
      'night_owl'        // Больше энергии вечером
    ],
    
    unlocks: [
      'computer_usage',  // Может эффективно пользоваться компьютером
      'study_sessions'   // Может изучать новые предметы
    ]
  },

  rich: {
    id: 'rich',
    name: 'Мажор',
    emoji: '💎',
    description: 'Из богатой семьи, избалованный и привыкший к роскоши. Есть все материальные блага, но слабая сила воли.',
    
    stats: {
      // Базовые статистики  
      health: 100,     // Отличное здоровье
      energy: 60,      // Пониженная энергия от праздного образа жизни
      mood: 20,        // Хорошее настроение
      stress: 40,      // Стресс от высоких ожиданий
      arousal: 0,
      hygiene: 95,     // Отличная гигиена
      willpower: 30,   // Слабая воля из-за избалованности
      
      // Фетиш статистики
      femininity: 0,
      dignity: 60,     // Сниженное достоинство при унижении
      submission: 25,  // Привык к тому что за него решают
      sissification: 0,
      bimbofication: 0,
      analTraining: 0,
      
      // Дополнительные
      money: 5000,     // Много денег
      social: 70,      // Хорошие социальные навыки
      corruption_resistance: -20 // Низкая сопротивляемость коррупции
    },
    
    inventory: [
      {
        id: 'smartphone',
        name: 'Новейший смартфон',
        icon: '📱',
        type: 'item',
        effects: { social: 5, mood: 5 },
        description: 'Последняя модель iPhone'
      },
      {
        id: 'credit_card',
        name: 'Золотая кредитка',
        icon: '💳',
        type: 'item',
        effects: { money: 1000 },
        description: 'Кредитная карта с высоким лимитом'
      },
      {
        id: 'designer_clothes',
        name: 'Дизайнерская одежда',
        icon: '👔',
        slot: 'upper',
        effects: { social: 10, dignity: 5 },
        description: 'Дорогая брендовая рубашка'
      }
    ],
    
    equipped: {
      upper: 'designer_clothes'
    },
    
    traits: [
      'spoiled',         // Избалованность - штрафы при отказе
      'high_maintenance', // Нужен высокий уровень комфорта
      'weak_willed'      // Легче поддается влиянию
    ],
    
    unlocks: [
      'luxury_shopping', // Доступ к дорогим магазинам
      'social_events',   // Доступ к светским мероприятиям
      'personal_apartment' // Собственная квартира
    ],
    
    special: {
      apartment: true,   // Начинает с собственной квартиры
      allowance: 500     // Еженедельные карманные деньги
    }
  },

  crossdresser: {
    id: 'crossdresser',
    name: 'Кроссдрессер',
    emoji: '💃',
    description: 'Уже имеет опыт в кроссдрессинге. Начинает с базовой женской одежды и повышенными фетиш-статистиками.',
    
    stats: {
      // Базовые статистики
      health: 90,
      energy: 80,
      mood: 10,        // Слегка возбужден от предвкушения
      stress: 25,      // Нервничает из-за тайны
      arousal: 20,     // Начальное возбуждение
      hygiene: 85,     // Хорошо следит за собой
      willpower: 40,   // Сниженная воля
      
      // Фетиш статистики
      femininity: 25,  // Уже есть женские черты
      dignity: 70,     // Немного сниженное достоинство
      submission: 15,  // Небольшая склонность к подчинению
      sissification: 20, // Начальная сиссификация
      bimbofication: 0,
      analTraining: 10, // Небольшой опыт
      
      // Дополнительные
      money: 1200,     // Деньги потраченные на одежду
      confidence: 60,  // Уверенность в себе
      secrecy: 80      // Умение скрывать увлечение
    },
    
    inventory: [
      {
        id: 'pink_panties',
        name: 'Розовые трусики',
        icon: '👙',
        slot: 'underwear',
        effects: { femininity: 5, arousal: 3 },
        description: 'Милые кружевные трусики'
      },
      {
        id: 'basic_bra',
        name: 'Простой лифчик',
        icon: '👙',
        slot: 'underwear',
        effects: { femininity: 8, mood: 5 },
        description: 'Белый спортивный лифчик'
      },
      {
        id: 'lipstick',
        name: 'Помада',
        icon: '💄',
        type: 'makeup',
        effects: { femininity: 5, arousal: 2 },
        description: 'Ярко-красная помада'
      },
      {
        id: 'small_dildo',
        name: 'Небольшой дилдо',
        icon: '🍆',
        type: 'toy',
        effects: { arousal: 15, analTraining: 5 },
        description: 'Маленький тренировочный дилдо'
      }
    ],
    
    equipped: {
      underwear: 'pink_panties'
    },
    
    traits: [
      'experienced',     // Знает основы женственности
      'secretive',       // Умеет скрывать свои увлечения
      'fashion_sense'    // Понимает женскую моду
    ],
    
    unlocks: [
      'lingerie_shopping', // Доступ к магазину белья
      'makeup_application', // Может краситься
      'online_communities'  // Доступ к онлайн сообществам
    ]
  },

  athlete: {
    id: 'athlete',
    name: 'Спортсмен',
    emoji: '💪',
    description: 'Физически развитый и уверенный в себе. Высокая сила воли, но может быть более восприимчив к доминированию.',
    
    stats: {
      // Базовые статистики
      health: 100,     // Отличное здоровье
      energy: 95,      // Высокая энергия
      mood: 30,        // Хорошее настроение
      stress: 15,      // Низкий стресс
      arousal: 0,
      hygiene: 90,     // Хорошая гигиена
      willpower: 80,   // Высокая сила воли
      
      // Фетиш статистики
      femininity: -30, // Очень маскулинный
      dignity: 90,     // Высокое достоинство
      submission: 5,   // Очень низкая подчиненность
      sissification: 0,
      bimbofication: 0,
      analTraining: 0,
      
      // Дополнительные
      money: 600,      // Немного денег
      strength: 90,    // Высокая физическая сила
      endurance: 85    // Высокая выносливость
    },
    
    inventory: [
      {
        id: 'protein_shake',
        name: 'Протеиновый коктейль',
        icon: '🥤',
        type: 'consumable',
        effects: { health: 10, energy: 15 },
        description: 'Спортивное питание для мышц'
      },
      {
        id: 'gym_membership',
        name: 'Абонемент в спортзал',
        icon: '🏋️',
        type: 'membership',
        effects: { strength: 5, endurance: 5 },
        description: 'Годовой абонемент в фитнес-клуб'
      }
    ],
    
    traits: [
      'disciplined',     // Дисциплинированность
      'competitive',     // Соревновательный дух
      'body_conscious'   // Следит за телом
    ],
    
    unlocks: [
      'gym_access',      // Доступ к тренировкам
      'sports_events',   // Спортивные мероприятия
      'protein_diet'     // Специальная диета
    ]
  },

  default: {
    id: 'default',
    name: 'Обычный',
    emoji: '😐',
    description: 'Самый обычный человек без особых преимуществ или недостатков. Сбалансированная отправная точка.',
    
    stats: {
      // Все статистики средние
      health: 90,
      energy: 80,
      mood: 0,
      stress: 20,
      arousal: 0,
      hygiene: 80,
      willpower: 50,
      
      femininity: 0,
      dignity: 75,
      submission: 10,
      sissification: 0,
      bimbofication: 0,
      analTraining: 0,
      
      money: 1000
    },
    
    inventory: [],
    equipped: {},
    traits: [],
    unlocks: []
  }
};

class CharacterPresets {
  static getPreset(id) {
    return PRESETS[id] ? JSON.parse(JSON.stringify(PRESETS[id])) : null;
  }
  
  static getAllPresets() {
    return Object.values(PRESETS).map(preset => ({
      id: preset.id,
      name: preset.name,
      emoji: preset.emoji,
      description: preset.description
    }));
  }
  
  static applyPreset(store, presetId) {
    const preset = this.getPreset(presetId);
    if (!preset) {
      console.error(`Preset ${presetId} not found`);
      return false;
    }
    
    // Применяем статистики
    Object.assign(store.stats, preset.stats);
    
    // Добавляем предметы в инвентарь
    preset.inventory.forEach(item => {
      store.addItem(item);
    });
    
    // Экипируем предметы
    Object.entries(preset.equipped).forEach(([slot, itemId]) => {
      const item = preset.inventory.find(i => i.id === itemId);
      if (item) {
        store.equipItem(item, slot);
      }
    });
    
    // Сохраняем информацию о пресете
    store.flags.characterPreset = presetId;
    store.flags.traits = preset.traits || [];
    store.flags.unlocks = preset.unlocks || [];
    
    // Специальные свойства
    if (preset.special) {
      Object.entries(preset.special).forEach(([key, value]) => {
        store.flags[key] = value;
      });
    }
    
    return true;
  }
  
  static getPresetEffects(presetId) {
    const preset = this.getPreset(presetId);
    if (!preset) return null;
    
    const effects = {
      statChanges: {},
      itemsReceived: preset.inventory.length,
      specialFeatures: []
    };
    
    // Подсчитываем изменения статистик относительно дефолта
    const defaultStats = PRESETS.default.stats;
    Object.entries(preset.stats).forEach(([stat, value]) => {
      const defaultValue = defaultStats[stat] || 0;
      if (value !== defaultValue) {
        effects.statChanges[stat] = value - defaultValue;
      }
    });
    
    // Специальные возможности
    if (preset.unlocks && preset.unlocks.length > 0) {
      effects.specialFeatures.push(`Разблокировано: ${preset.unlocks.length} новых возможностей`);
    }
    
    if (preset.special) {
      if (preset.special.apartment) {
        effects.specialFeatures.push('Собственная квартира');
      }
      if (preset.special.allowance) {
        effects.specialFeatures.push(`Карманные деньги: $${preset.special.allowance}/неделя`);
      }
    }
    
    return effects;
  }
}

export default CharacterPresets;
export { PRESETS }; 