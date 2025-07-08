# ДЕТАЛЬНЫЙ ROADMAP «Sissy Life Sim»

Формат: `Фаза → Эпик → Конкретная задача (owner)`

## Фаза 0 — инициализация репо
1. Инфраструктура
   • `npm init -y`  (AI)  
   • Установка Vite + Tailwind + ESLint + Prettier (AI)
2. Структура каталогов  
   • `core/`, `systems/`, `data/`, `ui/`, `assets/`, `docs/` (AI)
3. Базовый Vite-шаблон  
   • `index.html`, `main.js`, `style.css` (AI)
4. Tailwind конфиг  
   • `tailwind.config.cjs` с базовой цветовой схемой (AI)
5. GitHub Actions  
   • `node.yml` для lint/test (AI)

## Фаза 1 — движок сцен
1. Модуль `core/SceneEngine.js`  
   • Рендер Markdown → HTML (marked)  
   • Переходы между сценами (stack)
2. Система времени  
   • `tick(minutes)` — продвигает часы; хранится в `store.time`
3. Маршрутизация  
   • `#/?scene=<id>` перелив через history API
4. Кнопка «Далее» / выборы  
   • HTML-шаблон кнопок + CSS

## Фаза 2 — глобальный Store
1. `systems/store.js` на Proxy  
   • `stats`, `inventory`, `flags`, `time`
2. Реактивность  
   • EventEmitter для подписок UI
3. Сохранение  
   • `saveGame()`/`loadGame()` в localStorage

## Фаза 3 — статы & ранги
1. `systems/stats.js`  
   • Конфиг статов из docs/attributes.md  
   • `getRank(id)` + авто-кеш
2. UI-панель статов  
   • Компонент Tailwind: иконка + число + ранг-тултип

## Фаза 4 — загрузчик JSON-контента
1. `core/ContentLoader.js`  
   • Читает `data/**.json`  
   • Валидация через ajv схем  
   • Кэширование по тегам
2. Горячая перезагрузка контента в dev-режиме

## Фаза 5 — система предметов
1. Инвентарь  
   • `inventory[]` в store  
   • Слоты `upper`, `lower`, `toy` …
2. Экипировка  
   • `equip(itemID)` применяет эффект из `stats`
3. UI инвентаря  
   • Grid Tailwind + drag-to-equip

## Фаза 6 — генератор ивентов
1. `systems/eventEngine.js`  
   • Фильтр `requirements` → пул
2. Таймер «рандом-ивент»  
   • Каждые N игровых минут
3. Шаблон JSON-ивента (steps/choices)

## Фаза 7 — core-контент v0.1
1. Локации: Дом, Магазин белья, Клиника, Клуб  
2. 1 NPC: «Катя (доминант)»  
3. 5 вещей одежды, 2 игрушки  
4. 5 ивентов  
5. 2 простых BDSM-контракта

## Фаза 8 — расширенный контент & баланс
1. +3 NPC  
2. Экономика (работа/деньги)  
3. Цены + баланс статов  
4. Ачивки

## Фаза 9 — тесты и UX
1. Vitest unit-тесты движка  
2. Playwright сценарии (основной флоу)  
3. Адаптивность мобильная  
4. Улучшение accessibility (Tab-навигация)

## Фаза 10 — предпродакшн билд
1. Минификация, purgeCSS  
2. GitHub Pages deploy

---
Принцип работы: завершаем фазу ➜ PR в `main` ➜ следующий этап.

## Ближайшие шаги (Фаза 0)
- [ ] npm init + Vite + Tailwind  
- [ ] базовые каталоги  
- [ ] стартовая страница + hot-reload  
- [ ] commit: `chore(init): project scaffold` 