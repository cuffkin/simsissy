# Отражение в зеркале

*Вы смотрите на свое отражение в большом зеркале.*

<div id="appearance-display">
<!-- Внешность будет загружена динамически -->
</div>

<div id="body-stats">
<!-- Статистика тела будет загружена динамически -->
</div>

<div id="appearance-actions">
<!-- Действия будут загружены динамически -->
</div>

---

[Отойти от зеркала](bathroom_location)

<script>
// Загрузка и отображение внешности
async function displayAppearance() {
  // Импорт системы тела
  const BodySystem = (await import('../systems/BodySystem.js')).default;
  const bodySystem = new BodySystem(window.store);
  
  // Генерация описания
  const description = bodySystem.generateAppearanceDescription();
  const femininity = bodySystem.calculateBodyFemininity();
  
  // Выбор изображения
  const imagePath = await selectAppearanceImage();
  
  // Отображение
  const container = document.getElementById('appearance-display');
  container.innerHTML = `
    <div class="mirror-image">
      <img src="${imagePath}" alt="Ваше отражение">
    </div>
    <div class="appearance-description">
      ${description.map(line => `<p>${line}</p>`).join('')}
    </div>
    <div class="femininity-meter">
      <label>Женственность внешности:</label>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${femininity}%"></div>
      </div>
      <span>${Math.floor(femininity)}%</span>
    </div>
  `;
}

// Отображение детальной статистики тела
function displayBodyStats() {
  const body = window.store.body || {};
  const container = document.getElementById('body-stats');
  
  const parts = [
    { 
      name: 'Грудь', 
      value: body.breastSize || 0, 
      max: 6,
      labels: ['Плоская', 'A', 'B', 'C', 'D', 'DD', 'E+']
    },
    { 
      name: 'Член', 
      value: body.penisSize || 3, 
      max: 5,
      labels: ['Микро', 'Крошечный', 'Маленький', 'Средний', 'Большой', 'Огромный']
    },
    { 
      name: 'Задница', 
      value: body.buttSize || 2, 
      max: 5,
      labels: ['Плоская', 'Маленькая', 'Средняя', 'Пузырьком', 'Большая', 'Огромная']
    },
    { 
      name: 'Бедра', 
      value: body.hips || 1, 
      max: 4,
      labels: ['Узкие', 'Средние', 'Широкие', 'Очень широкие', 'Экстремальные']
    },
    { 
      name: 'Губы', 
      value: body.lips || 1, 
      max: 3,
      labels: ['Тонкие', 'Обычные', 'Полные', 'Пухлые']
    },
    { 
      name: 'Волосы', 
      value: body.hairLength || 1, 
      max: 5,
      labels: ['Очень короткие', 'Короткие', 'Средние', 'Длинные', 'Очень длинные', 'Экстремальные']
    }
  ];
  
  container.innerHTML = `
    <h3>Детали внешности:</h3>
    <div class="body-parts-grid">
      ${parts.map(part => `
        <div class="body-part">
          <label>${part.name}:</label>
          <div class="part-value">${part.labels[part.value]}</div>
          <div class="part-meter">
            ${Array.from({length: part.max + 1}, (_, i) => `
              <div class="meter-segment ${i <= part.value ? 'filled' : ''}"></div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
    
    <div class="body-details">
      <p>🏃 Телосложение: ${getBodyType()}</p>
      <p>📏 Рост: ${body.height || 175}см | Вес: ${body.weight || 70}кг</p>
      <p>💪 Мышцы: ${getMuscleLevel()}</p>
      <p>🦱 Волосы на теле: ${getBodyHairLevel()}</p>
    </div>
  `;
}

// Действия у зеркала
function displayActions() {
  const container = document.getElementById('appearance-actions');
  const femininity = window.getStat('femininity');
  const hasCosmetics = window.store.inventory.some(item => item.id === 'makeup_basic');
  
  const actions = [];
  
  // Базовые действия
  actions.push({
    text: 'Причесаться',
    onClick: () => performGrooming('hair')
  });
  
  if (hasCosmetics && femininity >= 15) {
    actions.push({
      text: 'Накраситься',
      onClick: () => performGrooming('makeup')
    });
  }
  
  // Действия для изменения внешности
  if (window.store.body.bodyHair > 0) {
    actions.push({
      text: 'Побриться',
      onClick: () => performGrooming('shave')
    });
  }
  
  container.innerHTML = `
    <h3>Действия:</h3>
    <div class="action-buttons">
      ${actions.map(action => `
        <button onclick="${action.onClick}">${action.text}</button>
      `).join('')}
    </div>
  `;
}

// Выбор изображения внешности
async function selectAppearanceImage() {
  const body = window.store.body || {};
  
  let femininity = 0;
  try {
    const BodySystem = (await import('../systems/BodySystem.js')).default;
    const bodySystem = new BodySystem(window.store);
    femininity = bodySystem.calculateBodyFemininity();
  } catch (error) {
    console.warn('BodySystem не загружен, используем базовое значение:', error);
    femininity = window.getStat('femininity') || 0;
  }
  
  // Определение категории
  let category = 'masculine';
  
  if (body.breastSize >= 3 && body.penisSize <= 2) {
    category = 'shemale';
  } else if (body.penisSize <= 1 && body.buttSize >= 3) {
    category = 'sissy';
  } else if (femininity > 60) {
    category = 'feminine';
  } else if (femininity > 30) {
    category = 'androgynous';
  }
  
  // Модификаторы
  const modifiers = [];
  if (body.breastSize >= 4) modifiers.push('bigboobs');
  if (body.buttSize >= 4) modifiers.push('bigass');
  if (body.penisSize <= 1) modifiers.push('small');
  if (body.penisSize >= 4) modifiers.push('hung');
  
  // Формирование пути
  const basePath = '/assets/gifs/appearance/mirror/';
  const modifier = modifiers.length > 0 ? `_${modifiers[0]}` : '';
  
  return `${basePath}${category}${modifier}.jpg`;
}

// Вспомогательные функции
function getBodyType() {
  const types = ['Худощавое', 'Стройное', 'Обычное', 'Пышное', 'Полное'];
  return types[window.store.body?.bodyType || 2];
}

function getMuscleLevel() {
  const levels = ['Отсутствуют', 'Легкие', 'Умеренные', 'Атлетичные', 'Мускулистые'];
  return levels[window.store.body?.muscle || 1];
}

function getBodyHairLevel() {
  const levels = ['Гладкая кожа', 'Легкая', 'Умеренная', 'Волосатое'];
  return levels[window.store.body?.bodyHair || 2];
}

// Действия по уходу
async function performGrooming(type) {
  switch (type) {
    case 'hair':
      window.addStat('hygiene', 5);
      alert('Вы причесались. Выглядите немного лучше.');
      break;
      
    case 'makeup':
      window.addStat('femininity', 2);
      window.addStat('mood', 5);
      window.tick(30); // 30 минут
      alert('Вы накрасились. Лицо выглядит более женственно.');
      break;
      
    case 'shave':
      const BodySystem = (await import('../systems/BodySystem.js')).default;
      const bodySystem = new BodySystem(window.store);
      bodySystem.modifyBodyPart('bodyHair', -1);
      window.addStat('hygiene', 10);
      window.tick(20); // 20 минут
      alert('Вы побрились. Кожа стала более гладкой.');
      displayAppearance();
      displayBodyStats();
      break;
  }
}

// Стили
const style = document.createElement('style');
style.textContent = `
  .mirror-image {
    width: 100%;
    max-width: 300px;
    margin: 0 auto 20px;
    border: 3px solid var(--border-color);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  }
  
  .mirror-image img {
    width: 100%;
    height: auto;
    display: block;
  }
  
  .appearance-description {
    margin: 20px 0;
    padding: 15px;
    background: rgba(255,255,255,0.05);
    border-radius: 8px;
  }
  
  .appearance-description p {
    margin: 5px 0;
  }
  
  .femininity-meter {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 20px 0;
  }
  
  .progress-bar {
    flex: 1;
    height: 20px;
    background: rgba(255,255,255,0.1);
    border-radius: 10px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
    transition: width 0.5s ease;
  }
  
  .body-parts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin: 20px 0;
  }
  
  .body-part {
    background: rgba(255,255,255,0.05);
    padding: 10px;
    border-radius: 8px;
  }
  
  .body-part label {
    font-weight: bold;
    color: var(--primary-color);
  }
  
  .part-value {
    color: var(--accent-color);
    margin: 5px 0;
  }
  
  .part-meter {
    display: flex;
    gap: 2px;
    margin-top: 5px;
  }
  
  .meter-segment {
    flex: 1;
    height: 8px;
    background: rgba(255,255,255,0.1);
    border-radius: 2px;
    transition: all 0.3s ease;
  }
  
  .meter-segment.filled {
    background: var(--primary-color);
  }
  
  .body-details {
    background: rgba(255,255,255,0.05);
    padding: 15px;
    border-radius: 8px;
    margin-top: 20px;
  }
  
  .body-details p {
    margin: 5px 0;
  }
  
  .action-buttons {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
`;
document.head.appendChild(style);

// Инициализация
displayAppearance();
displayBodyStats();
displayActions();
</script> 