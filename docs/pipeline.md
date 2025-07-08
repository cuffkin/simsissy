# Контент-пайплайн и JSON-конвенции

## Общие принципы
1. **Файлы JSON** лежат в `data/<тип>/`. Название в `kebab-case`.  
   Примеры: `data/clothes/pink-babydoll.json`, `data/events/public-humiliation.json`.
2. Каждый объект имеет обязательные поля `id`, `name`, `tags`.  
3. Человеко-читаемые строки (для UI) храним прямо в JSON — движок выводит Markdown→HTML.
4. Для изображений используем относительный путь от `assets/`.

## Схемы
### Одежда `/clothes/`
```json
{
  "id": "pink_babydoll",
  "name": "Бэби-долл розовый",
  "slot": "upper",
  "stats": { "femininity": 5 },
  "requirements": {
    "sissification": { "minRank": 2 },
    "dignity": { "max": 50 }
  },
  "tags": ["lingerie", "pink", "nightwear"],
  "image": "img/clothes/pink_babydoll.png"
}
```

### Ивент `/events/`
```json
{
  "id": "public_humiliation",
  "title": "Случай на остановке",
  "weight": 5,
  "when": { "location": "bus_stop", "time": ["evening"] },
  "requirements": {
    "sissification": { "minRank": 3 },
    "submission": { "min": 20 },
    "energy": { "min": 30 }
  },
  "steps": [
    { "text": "Вы нервно переминаетесь в женственном платье…" },
    {
      "choices": [
        { "text": "Спрятаться", "effects": { "dignity": -5, "stress": 10 } },
        { "text": "Насладиться вниманием", "effects": { "arousal": 20, "sissification": 3 } }
      ]
    }
  ],
  "tags": ["humiliation", "public"]
}
```

### Игрушка `/items/`
```json
{
  "id": "vibe_bullet",
  "type": "toy",
  "target": "prostate",
  "arousalPerMinute": 5,
  "requirements": { "analTraining": { "min": 20 } },
  "tags": ["vibrator", "sissygasm"],
  "image": "gif/toys/vibe_bullet.gif"
}
```

## Валидация
- JSON-схемы в `core/schemas/`.  
- Скрипт `npm run validate` использует `ajv` и выводит подробные ошибки.

## Локализация
- Основной язык — русский, но видимые строки можно вынести в `/i18n/ru.json` при масштабировании.

## Добавление нового контента
1. Создай файл в нужной папке.
2. Запусти `npm run validate` — убедись, что ошибок нет.
3. Dev-сервер автоматически перезагрузит пул контента.
4. Проверь сцену через «Debug Overlay» в игре (Ctrl+D).

## Обновление старого контента
- Измени JSON, сохрани.  
- Не удаляй поле `id` — оно ключ.
- При изменении требований увеличивай `version` (семантический).

---
Следи за тегами: они используются для фильтров магазинов, поиска и навигации🎀 