# Архитектура GUI системы

## Обзор компонентов

### 1. Layout Structure
Игра использует CSS Grid для создания современного интерфейса:

```
┌─────────────────────────────────────────────────────────────┐
│                    Header (game-header)                    │
├─────────────────────┬───────────────────────────────────────┤
│                     │                                       │
│   Stats Sidebar     │        Main Content Area             │
│   (stats-sidebar)   │        (game-main)                   │
│                     │                                       │
│   • Персонаж        │   ┌─────────────────────────────────┐ │
│   • Фетиши          │   │     Game Content                │ │
│   • Экипировка      │   │     (game-content)              │ │
│                     │   │                                 │ │
│                     │   │   Markdown → HTML scenes       │ │
│                     │   └─────────────────────────────────┘ │
└─────────────────────┴───────────────────────────────────────┘
```

### 2. Система статистики

#### Структура StatBar
```html
<div class="stat-item">
  <div class="stat-header">
    <div class="stat-name">💚 Здоровье</div>
    <div class="stat-value">85</div>
  </div>
  <div class="stat-bar">
    <div class="stat-fill" style="width: 85%"></div>
  </div>
  <div class="stat-rank">Высокий</div>
</div>
```

#### Автоматическое обновление
- Система подписок через store.subscribe()
- Реактивность через Proxy в store.js
- Автоматический пересчет рангов и процентов
- **ВСЕ значения статистик округляются до целых чисел**

### 3. Система цветов и тем

#### CSS Variables
```css
:root {
  --primary-color: #c026d3;      /* Основной розовый */
  --secondary-color: #a700b5;    /* Темно-розовый */
  --accent-color: #f472b6;       /* Светло-розовый */
  --background-color: #0f0f23;   /* Темный фон */
  --surface-color: #1a1a2e;      /* Поверхности */
  --text-color: #ffffff;         /* Основной текст */
  --gradient-primary: linear-gradient(135deg, #c026d3 0%, #a700b5 100%);
}
```

#### Анимации
- Hover эффекты с glow shadows
- Shimmer анимация для progress bars
- Smooth transitions (0.3s ease)

### 4. Responsive Design

#### Desktop (> 768px)
```css
grid-template-columns: 300px 1fr;
grid-template-areas: 
  "sidebar header"
  "sidebar main";
```

#### Mobile (≤ 768px)
```css
grid-template-columns: 1fr;
grid-template-areas: 
  "header"
  "sidebar" 
  "main";
```

### 5. Компоненты

#### StatsPanel
- Отображает все статистики персонажа
- Группировка по категориям (Персонаж, Фетиши)
- Автоматический расчет рангов и процентов

#### TimeWidget
- Отображение игрового времени
- Фаза дня (утро/день/вечер/ночь)
- Интеграция с системой времени

#### EquipmentSlots
- Слоты для экипировки
- Drag-and-drop поддержка (планируется)
- Визуальное отображение экипированных предметов

#### DebugLogger
- Визуальная панель отладки (верхний правый угол)
- Перемещается мышкой по экрану
- Скрывается/показывается через настройки
- Команды: `showDebug()`, `hideDebug()`
- Экспорт логов в JSON

## Системы

### InventorySystem
Управление предметами и расходниками:

```javascript
// Проверка наличия предмета
inventorySystem.hasItem('toothpaste', 1);

// Использование расходника
inventorySystem.useConsumable('soap_basic', 0.1);

// Добавление в инвентарь
inventorySystem.addToInventory('makeup_basic', 1);

// Предметы квартиры
inventorySystem.addToApartment('towel_luxury', 2);
```

#### Автоматические предметы для квартир:
- **parents**: Базовые предметы гигиены
- **cheap**: Минимальный набор
- **studio**: Расширенный набор + уход за кожей
- **decent**: Качественные предметы
- **luxury**: Премиум предметы + ванна

### BodySystem
Расчет женственности внешности:

```javascript
// Формула женственности (макс 100%)
femininity = (
  breastSize * 3 +        // 0-18 баллов
  (5 - penisSize) * 3 +   // 0-15 баллов
  buttSize * 2 +          // 0-10 баллов
  hips * 3 +              // 0-12 баллов
  hairLength * 2 +        // 0-10 баллов
  faceShape * 4 +         // 0-12 баллов
  lips * 3 +              // 0-9 баллов
  (3 - bodyHair) * 2 +    // 0-6 баллов
  femininity * 0.2        // 0-20 баллов
) / maxPossible * 100
```

## Поток данных

```
Store (Proxy) → Events → SceneEngine → GUI Updates
     ↑                                      ↓
Game Logic ← Actions ← User Interaction ← UI
```

### Событийная система
1. Пользователь взаимодействует с UI
2. Действие обрабатывается в actions.js
3. Изменения применяются к store
4. Store эмитит события
5. SceneEngine обновляет GUI

## Производительность

### Оптимизации
- Debounced updates для частых изменений
- Lazy loading для больших списков
- CSS анимации вместо JavaScript
- Minimal DOM manipulation

### Мониторинг
- Встроенная система тестирования
- Валидация состояния игры
- Performance profiling через dev tools

## Расширяемость

### Добавление новых статистик
1. Добавить в store.js defaults
2. Добавить в SceneEngine.updateStats()
3. Добавить валидацию в actions.js
4. Добавить стили при необходимости

### Новые UI компоненты
1. Создать CSS классы
2. Добавить HTML структуру
3. Подключить к системе событий
4. Добавить тесты

## Отладка

### Dev Tools
- `debugStats()` - показать все статистики
- `testStats()` - тестовые значения
- `runTests()` - полный набор тестов
- `quickTest()` - быстрая проверка
- `stressTest()` - нагрузочное тестирование
- `showDebug()` - показать дебаг панель
- `hideDebug()` - скрыть дебаг панель

### Консольные команды
```javascript
// Изменение статистик
setStat('femininity', 50);
addStat('energy', -10);

// Работа с временем
tick(60); // +1 час
getTime(); // текущее время
getTimePhase(); // фаза дня

// Сохранение/загрузка
saveGame();
loadGame();
resetGame();

// Дебаг панель
showDebug(); // показать
hideDebug(); // скрыть
```

## Известные исправления

### Проблема с [object Object]
- **Причина**: Неправильная конфигурация marked.Renderer
- **Решение**: Удален кастомный рендерер, используется стандартный

### Целочисленные значения
- **Проблема**: Дробные значения статистик (21.86, 97.510200002)
- **Решение**: Math.round() при всех операциях со статистиками

### Унифицированные кнопки
- **Проблема**: Разные размеры кнопок в навигации
- **Решение**: Общие классы .action-option и .nav-option 