// Система параметров тела и внешности

class BodySystem {
  constructor(store) {
    this.store = store;
    
    // Инициализация параметров тела если их нет
    if (!this.store.body) {
      this.store.body = this.getDefaultBody();
    }
  }

  // Дефолтные параметры тела
  getDefaultBody() {
    return {
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
    };
  }

  // Получить описание размера груди
  getBreastDescription() {
    const sizes = ['плоская грудь', 'A чашка', 'B чашка', 'C чашка', 'D чашка', 'DD чашка', 'E+ чашка'];
    return sizes[this.store.body.breastSize] || 'неизвестный размер';
  }

  // Получить описание размера члена
  getPenisDescription() {
    const sizes = ['микро', 'крошечный', 'маленький', 'средний', 'большой', 'огромный'];
    return sizes[this.store.body.penisSize] || 'неизвестный размер';
  }

  // Получить описание задницы
  getButtDescription() {
    const sizes = ['плоская', 'маленькая', 'обычная', 'пузырьком', 'большая', 'огромная'];
    return sizes[this.store.body.buttSize] || 'неизвестный размер';
  }

  // Изменить параметр тела
  modifyBodyPart(part, change) {
    if (this.store.body[part] === undefined) {
      console.error(`Unknown body part: ${part}`);
      return false;
    }
    
    const oldValue = this.store.body[part];
    const newValue = Math.max(0, oldValue + change);
    
    // Ограничения для разных частей
    const limits = {
      breastSize: 6,
      penisSize: 5,
      buttSize: 5,
      hips: 4,
      hairLength: 5,
      faceShape: 3,
      lips: 3,
      bodyType: 4,
      muscle: 4,
      bodyHair: 3
    };
    
    if (limits[part] !== undefined) {
      this.store.body[part] = Math.min(newValue, limits[part]);
    } else {
      this.store.body[part] = newValue;
    }
    
    return true;
  }

  // Расчет женственности на основе тела
  calculateBodyFemininity() {
    let femininity = 0;
    let maxPossible = 0;
    
    // Грудь (0-6) - максимум 18 баллов
    femininity += this.store.body.breastSize * 3;
    maxPossible += 6 * 3;
    
    // Размер члена (0-5, меньше = женственнее) - максимум 15 баллов
    femininity += (5 - this.store.body.penisSize) * 3;
    maxPossible += 5 * 3;
    
    // Задница (0-5) - максимум 10 баллов
    femininity += this.store.body.buttSize * 2;
    maxPossible += 5 * 2;
    
    // Бедра (0-4) - максимум 12 баллов
    femininity += this.store.body.hips * 3;
    maxPossible += 4 * 3;
    
    // Волосы (0-5) - максимум 10 баллов
    femininity += this.store.body.hairLength * 2;
    maxPossible += 5 * 2;
    
    // Лицо (0-3) - максимум 12 баллов
    femininity += this.store.body.faceShape * 4;
    maxPossible += 3 * 4;
    
    // Губы (0-3) - максимум 9 баллов
    femininity += this.store.body.lips * 3;
    maxPossible += 3 * 3;
    
    // Телосложение (0-4) - максимум 8 баллов
    if (this.store.body.bodyType >= 3) { // curvy или thick
      femininity += 8;
    } else if (this.store.body.bodyType >= 2) {
      femininity += 4;
    }
    maxPossible += 8;
    
    // Мышцы (0-4, меньше = женственнее) - максимум 8 баллов
    femininity += (4 - this.store.body.muscle) * 2;
    maxPossible += 4 * 2;
    
    // Волосы на теле (0-3, меньше = женственнее) - максимум 9 баллов
    femininity += (3 - this.store.body.bodyHair) * 3;
    maxPossible += 3 * 3;
    
    // Преобразуем в проценты
    return Math.round((femininity / maxPossible) * 100);
  }

  // Выбор GIF на основе параметров тела
  selectBodyBasedGif(action, method) {
    const body = this.store.body;
    let category = 'default';
    
    // Определение категории тела
    if (body.breastSize >= 3 && body.penisSize <= 2) {
      category = 'shemale';
    } else if (body.penisSize <= 1 && body.buttSize >= 3) {
      category = 'sissy';
    } else if (body.bodyType >= 3) {
      category = 'curvy';
    } else if (this.calculateBodyFemininity() > 60) {
      category = 'feminine';
    } else if (this.calculateBodyFemininity() > 30) {
      category = 'androgynous';
    } else {
      category = 'masculine';
    }
    
    // Дополнительные модификаторы
    const modifiers = [];
    
    if (body.breastSize >= 4) modifiers.push('bigboobs');
    if (body.buttSize >= 4) modifiers.push('bigass');
    if (body.penisSize <= 1) modifiers.push('small');
    if (body.penisSize >= 4) modifiers.push('hung');
    
    // Формирование пути к GIF
    const basePath = `/assets/gifs/${action}/${method}/`;
    const modifier = modifiers.length > 0 ? `_${modifiers[0]}` : '';
    
    return `${basePath}${category}${modifier}.gif`;
  }

  // Генерация описания внешности
  generateAppearanceDescription() {
    const body = this.store.body;
    const femininity = this.calculateBodyFemininity();
    
    let description = [];
    
    // Общее телосложение
    const bodyTypes = ['худощавое', 'стройное', 'обычное', 'пышное', 'полное'];
    description.push(`У вас ${bodyTypes[body.bodyType]} телосложение`);
    
    // Рост и вес
    description.push(`Рост ${body.height}см, вес ${body.weight}кг`);
    
    // Волосы
    const hairLengths = ['очень короткие', 'короткие', 'средние', 'длинные', 'очень длинные', 'экстремально длинные'];
    description.push(`${hairLengths[body.hairLength]} ${body.hairColor} волосы`);
    
    // Лицо
    const faceShapes = ['мужественное', 'андрогинное', 'мягкое', 'женственное'];
    const lipSizes = ['тонкие', 'обычные', 'полные', 'пухлые'];
    description.push(`${faceShapes[body.faceShape]} лицо с ${lipSizes[body.lips]} губами`);
    
    // Грудь
    if (body.breastSize > 0) {
      description.push(`Грудь размера ${this.getBreastDescription()}`);
    }
    
    // Бедра и задница
    const hipSizes = ['узкие', 'обычные', 'широкие', 'очень широкие', 'экстремально широкие'];
    description.push(`${hipSizes[body.hips]} бедра и ${this.getButtDescription()} задница`);
    
    // Интимные части
    if (body.penisSize <= 2) {
      description.push(`${this.getPenisDescription()} член`);
    }
    
    // Волосы на теле
    const bodyHairLevels = ['гладкая кожа', 'легкая растительность', 'умеренная растительность', 'волосатое тело'];
    description.push(bodyHairLevels[body.bodyHair]);
    
    // Общая оценка
    if (femininity >= 80) {
      description.push('**Вы выглядите очень женственно**');
    } else if (femininity >= 60) {
      description.push('**Вы выглядите довольно женственно**');
    } else if (femininity >= 40) {
      description.push('**Вы выглядите андрогинно**');
    } else if (femininity >= 20) {
      description.push('**Вы выглядите в основном мужественно с женственными чертами**');
    } else {
      description.push('**Вы выглядите мужественно**');
    }
    
    return description;
  }

  // Эффекты от гормонов
  applyHormoneEffects(hormoneType, days) {
    const effects = {
      estrogen: {
        breastSize: 0.01 * days,
        penisSize: -0.005 * days,
        buttSize: 0.008 * days,
        hips: 0.006 * days,
        faceShape: 0.004 * days,
        lips: 0.003 * days,
        bodyHair: -0.01 * days,
        muscle: -0.008 * days
      },
      antiandrogen: {
        penisSize: -0.003 * days,
        bodyHair: -0.008 * days,
        muscle: -0.005 * days
      },
      testosterone: {
        penisSize: 0.002 * days,
        muscle: 0.01 * days,
        bodyHair: 0.01 * days,
        faceShape: -0.003 * days
      }
    };
    
    const hormoneEffects = effects[hormoneType];
    if (!hormoneEffects) return;
    
    // Применение эффектов
    for (const [part, change] of Object.entries(hormoneEffects)) {
      const currentValue = this.store.body[part];
      const newValue = currentValue + change;
      
      // Плавное изменение с учетом дробных значений
      if (Math.floor(newValue) !== Math.floor(currentValue)) {
        this.modifyBodyPart(part, Math.floor(newValue) - Math.floor(currentValue));
      }
    }
  }
}

export default BodySystem; 