# Матрица выбора GIF на основе параметров тела

## 📊 Категории персонажей

### Основные категории
1. **masculine** - Мужественный (femininity < 20)
2. **androgynous** - Андрогинный (femininity 20-60)
3. **feminine** - Женственный (femininity 60-80)
4. **shemale** - Транс-женщина (грудь C+ и маленький член)
5. **sissy** - Сисси (маленький член + большая задница)
6. **curvy** - Пышный (bodyType >= 3)

### Модификаторы
- **_bigboobs** - Большая грудь (D+)
- **_bigass** - Большая задница (размер 4+)
- **_small** - Маленький член (micro/tiny)
- **_hung** - Большой член (large/huge)
- **_smooth** - Гладкая кожа (без волос)
- **_hairy** - Волосатое тело

## 🎬 Структура папок с GIF

```
assets/gifs/
├── masturbation/
│   ├── hand/
│   │   ├── masculine.gif
│   │   ├── masculine_hung.gif
│   │   ├── androgynous.gif
│   │   ├── feminine.gif
│   │   ├── feminine_small.gif
│   │   ├── shemale.gif
│   │   ├── shemale_bigboobs.gif
│   │   └── sissy_small.gif
│   ├── dildo/
│   │   ├── small/
│   │   │   ├── masculine.gif
│   │   │   ├── androgynous.gif
│   │   │   ├── feminine.gif
│   │   │   ├── shemale.gif
│   │   │   ├── sissy.gif
│   │   │   └── curvy_bigass.gif
│   │   ├── medium/
│   │   │   └── [аналогичные файлы]
│   │   └── large/
│   │       └── [аналогичные файлы]
│   └── vibrator/
│       └── [категории как выше]
├── sex/
│   ├── oral_give/
│   │   ├── masculine.gif
│   │   ├── feminine.gif
│   │   ├── shemale_bigboobs.gif
│   │   └── sissy.gif
│   ├── anal_receive/
│   │   └── [категории + модификаторы _bigass]
│   └── anal_give/
│       └── [только для персонажей с членом]
├── appearance/
│   ├── mirror/
│   │   ├── masculine.jpg
│   │   ├── masculine_hung.jpg
│   │   ├── androgynous.jpg
│   │   ├── feminine.jpg
│   │   ├── feminine_bigboobs.jpg
│   │   ├── shemale.jpg
│   │   ├── shemale_bigboobs_bigass.jpg
│   │   └── sissy_small.jpg
│   └── body/
│       ├── breast/
│       │   ├── flat.jpg
│       │   ├── a_cup.jpg
│       │   ├── b_cup.jpg
│       │   ├── c_cup.jpg
│       │   ├── d_cup.jpg
│       │   ├── dd_cup.jpg
│       │   └── e_plus.jpg
│       ├── butt/
│       │   ├── flat.jpg
│       │   ├── small.jpg
│       │   ├── average.jpg
│       │   ├── bubble.jpg
│       │   ├── large.jpg
│       │   └── huge.jpg
│       └── penis/
│           ├── micro.jpg
│           ├── tiny.jpg
│           ├── small.jpg
│           ├── average.jpg
│           ├── large.jpg
│           └── huge.jpg
└── reactions/
    ├── arousal/
    │   ├── masculine_aroused.gif
    │   ├── feminine_aroused.gif
    │   ├── shemale_aroused.gif
    │   └── sissy_cage_aroused.gif
    └── orgasm/
        ├── masculine_orgasm.gif
        ├── feminine_orgasm.gif
        ├── shemale_orgasm.gif
        ├── sissy_sissygasm.gif
        └── sissy_cage_leak.gif
```

## 🎯 Логика выбора GIF

### Пример функции выбора
```javascript
function selectBodyGif(action, method, store) {
  const body = store.body;
  const femininity = calculateBodyFemininity(body);
  
  // Определение основной категории
  let category = 'masculine';
  
  if (body.breastSize >= 3 && body.penisSize <= 2) {
    category = 'shemale';
  } else if (body.penisSize <= 1 && body.buttSize >= 3) {
    category = 'sissy';
  } else if (body.bodyType >= 3) {
    category = 'curvy';
  } else if (femininity > 60) {
    category = 'feminine';
  } else if (femininity > 30) {
    category = 'androgynous';
  }
  
  // Добавление модификаторов
  const modifiers = [];
  
  if (body.breastSize >= 4) modifiers.push('bigboobs');
  if (body.buttSize >= 4) modifiers.push('bigass');
  if (body.penisSize <= 1) modifiers.push('small');
  if (body.penisSize >= 4) modifiers.push('hung');
  if (body.bodyHair === 0) modifiers.push('smooth');
  if (body.bodyHair === 3) modifiers.push('hairy');
  
  // Попытка найти наиболее специфичный GIF
  const basePath = `/assets/gifs/${action}/${method}/`;
  
  // Пробуем с модификаторами
  for (const modifier of modifiers) {
    const path = `${basePath}${category}_${modifier}.gif`;
    if (fileExists(path)) return path;
  }
  
  // Возвращаем базовую категорию
  return `${basePath}${category}.gif`;
}
```

## 📋 Полный список необходимых GIF

### Мастурбация (30+ GIF)
- По 6-8 вариантов для каждого метода (рука, дилдо, вибратор)
- Учитывать размеры тела и уровень феминизации

### Секс-сцены (40+ GIF)
- Оральный секс (давать/получать)
- Анальный секс (получать/давать)
- Вариации для разных типов тел

### Статичные изображения тела (25+ изображений)
- 7 размеров груди
- 6 размеров задницы
- 6 размеров члена
- Полное тело для каждой категории

### Реакции (20+ GIF)
- Возбуждение для каждого типа
- Оргазмы и сиссигазмы
- Фрустрация в поясе

## 🎨 Рекомендации по созданию контента

1. **Консистентность стиля** - все GIF должны быть в похожем стиле
2. **Плавные переходы** - при смене категории тела переход должен быть логичным
3. **Разнообразие** - избегать повторения одних и тех же кадров
4. **Учет деталей** - показывать изменения тела (грудь, бедра и т.д.)
5. **Эмоциональность** - разные выражения для разных уровней феминизации

## 🔧 Технические требования

- **Размер**: 400x300px (основной), 300x400px (портрет)
- **Формат**: GIF для анимаций, JPG для статики
- **Вес**: до 2MB для GIF, до 500KB для JPG
- **FPS**: 15-24 для плавной анимации
- **Цикличность**: бесшовные циклы 2-5 секунд

## 📊 Приоритеты создания

### Высокий приоритет
1. Базовые категории для мастурбации (masculine, feminine, sissy)
2. Статичные изображения частей тела
3. Основные реакции оргазма

### Средний приоритет
1. Модификаторы (_bigboobs, _small и т.д.)
2. Секс-сцены
3. Промежуточные категории (androgynous, shemale)

### Низкий приоритет
1. Редкие комбинации (hairy + feminine и т.д.)
2. Специфичные позы
3. Альтернативные варианты 