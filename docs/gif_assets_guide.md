# Руководство по GIF ассетам

## 📐 Стандарты размеров

### Основной размер: 400x300px
- **Соотношение**: 4:3
- **Максимальный вес**: 2MB
- **Оптимальный вес**: 500KB-1MB
- **FPS**: 15-24
- **Длительность**: 2-5 секунд (зацикленные)

### Альтернативные размеры
- **Портретные сцены**: 300x400px (3:4)
- **Широкие сцены**: 480x270px (16:9)
- **Миниатюры**: 200x150px

## 🎨 Стилистика

### Цветовая палитра
- Приглушенные тона
- Розовые/фиолетовые акценты где уместно
- Избегать слишком ярких цветов
- Единообразное освещение

### Качество
- Минимум артефактов сжатия
- Плавные переходы
- Четкость важных деталей
- Избегать слишком темных/светлых кадров

## 📁 Структура папок

```
assets/
└── gifs/
    ├── masturbation/
    │   ├── hand/
    │   │   ├── masculine/      # Мужественный персонаж
    │   │   ├── androgynous/    # Андрогинный
    │   │   └── feminine/       # Женственный
    │   ├── dildo/
    │   │   ├── small/
    │   │   ├── medium/
    │   │   └── large/
    │   ├── vibrator/
    │   │   ├── normal/
    │   │   └── on_cage/        # На поясе верности
    │   └── chastity/
    │       ├── plastic/
    │       ├── metal/
    │       └── sissy/
    ├── activities/
    │   ├── shower/
    │   ├── dressing/
    │   └── sleeping/
    └── reactions/
        ├── arousal/
        ├── orgasm/
        └── frustration/
```

## 📋 Необходимые GIF-ассеты

### Мастурбация руками (без пояса)
1. `hand_masculine_normal.gif` - обычная мужская
2. `hand_androgynous_gentle.gif` - более нежная
3. `hand_feminine_delicate.gif` - женственные движения

### Использование дилдо
По 3 варианта для каждого размера:
1. `dildo_small_beginner.gif` - неопытные движения
2. `dildo_small_experienced.gif` - уверенные движения
3. `dildo_small_sissy.gif` - покорные движения

Аналогично для medium и large.

### Вибратор
1. `vibrator_body_use.gif` - использование на теле
2. `vibrator_cage_tease.gif` - на поясе верности
3. `vibrator_intense.gif` - интенсивное использование

### Пояс верности
1. `chastity_plastic_bulge.gif` - возбуждение в пластике
2. `chastity_metal_frustrated.gif` - фрустрация в металле
3. `chastity_sissy_leak.gif` - подтекание в сисси-клетке

### Реакции оргазма
1. `orgasm_normal_relief.gif` - обычный оргазм
2. `orgasm_sissygasm_intense.gif` - сиссигазм
3. `orgasm_ruined_frustration.gif` - испорченный оргазм
4. `orgasm_cage_leak.gif` - оргазм в клетке

### Реакции возбуждения
1. `arousal_low_fidget.gif` - легкое беспокойство
2. `arousal_high_desperate.gif` - отчаянная нужда
3. `arousal_max_mindbreak.gif` - потеря контроля

## 🔧 Технические детали

### CSS для адаптивного отображения
```css
.gif-container {
  width: 100%;
  max-width: 400px;
  margin: 20px auto;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

.gif-container img {
  width: 100%;
  height: auto;
  display: block;
}

/* Для разных размеров */
.gif-portrait { max-width: 300px; }
.gif-wide { max-width: 480px; }
.gif-thumb { max-width: 200px; }

/* Эффект загрузки */
.gif-loading {
  background: linear-gradient(90deg, #1a1a2e 0%, #252545 50%, #1a1a2e 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

### JavaScript загрузчик
```javascript
class GifLoader {
  constructor() {
    this.cache = new Map();
    this.preloadQueue = [];
  }

  async loadGif(path, options = {}) {
    // Проверка кэша
    if (this.cache.has(path)) {
      return this.cache.get(path);
    }

    // Создание элемента
    const img = new Image();
    img.className = options.className || 'scene-gif';
    
    // Загрузка
    return new Promise((resolve, reject) => {
      img.onload = () => {
        this.cache.set(path, img);
        resolve(img);
      };
      img.onerror = () => reject(new Error(`Failed to load: ${path}`));
      img.src = path;
    });
  }

  preload(paths) {
    paths.forEach(path => {
      if (!this.cache.has(path)) {
        this.loadGif(path);
      }
    });
  }
}
```

## 📊 Матрица выбора GIF

### Для мастурбации
```javascript
function selectMasturbationGif(method, character) {
  const femininity = character.stats.femininity;
  const experience = character.stats.analTraining;
  const isChastity = character.equipped.chastity !== null;
  
  let category = 'masculine';
  if (femininity > 60) category = 'feminine';
  else if (femininity > 30) category = 'androgynous';
  
  let experienceLevel = 'beginner';
  if (experience > 60) experienceLevel = 'expert';
  else if (experience > 30) experienceLevel = 'experienced';
  
  if (isChastity && method === 'vibrator') {
    return `vibrator_cage_${character.equipped.chastity.material}.gif`;
  }
  
  return `${method}_${category}_${experienceLevel}.gif`;
}
```

## 🎬 Рекомендации по созданию

1. **Плавные циклы** - начало и конец должны совпадать
2. **Фокус на действии** - избегать лишних деталей
3. **Консистентность** - единый стиль для всех GIF
4. **Оптимизация** - использовать инструменты сжатия
5. **Тестирование** - проверка на разных устройствах

## 🚀 Оптимизация производительности

### Ленивая загрузка
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const gif = entry.target;
      gif.src = gif.dataset.src;
      observer.unobserve(gif);
    }
  });
});

document.querySelectorAll('.lazy-gif').forEach(gif => {
  observer.observe(gif);
});
```

### Предзагрузка для сцен
```javascript
// При входе в спальню предзагружаем GIF мастурбации
scene.onEnter = () => {
  gifLoader.preload([
    'hand_masculine_normal.gif',
    'dildo_small_beginner.gif',
    'vibrator_body_use.gif'
  ]);
};
```

## 📝 Checklist для добавления нового GIF

- [ ] Размер соответствует стандарту (400x300 или альтернативный)
- [ ] Вес файла оптимизирован (<2MB, идеально <1MB)
- [ ] Зацикленная анимация без рывков
- [ ] Имя файла следует конвенции
- [ ] Добавлен в соответствующую папку
- [ ] Протестирован на мобильных устройствах
- [ ] Добавлен в систему предзагрузки если нужно 