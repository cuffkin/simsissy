# Личное время в спальне

*Дверь заперта. Вы наконец одни и можете позаботиться о своих... потребностях.*

<div class="arousal-display">
💗 **Возбуждение**: <span id="arousal-level">{{arousal}}</span>/100
</div>

<div id="scene-content">
<!-- Контент будет загружен динамически -->
</div>

<div id="action-buttons">
<!-- Кнопки действий будут загружены динамически -->
</div>

---

[Передумать и встать](bedroom)

<script>
// Проверка состояния персонажа
function checkCharacterState() {
  const arousal = window.getStat('arousal');
  const isChastity = window.store.equipped.chastity !== null;
  const femininity = window.getStat('femininity');
  const dignity = window.getStat('dignity');
  
  // Обновление отображения возбуждения
  document.getElementById('arousal-level').textContent = Math.floor(arousal);
  
  // Определение доступных действий
  const actions = [];
  
  if (!isChastity) {
    // Без пояса верности
    if (dignity > 50) {
      actions.push({
        id: 'hand_quick',
        text: 'Быстро кончить рукой',
        description: 'Просто снять напряжение как обычно',
        onClick: () => attemptMasturbation('hand', 'quick')
      });
    } else {
      actions.push({
        id: 'hand_normal',
        text: 'Подрочить',
        description: 'Удовлетворить себя рукой',
        onClick: () => attemptMasturbation('hand', 'normal')
      });
      
      if (femininity > 30) {
        actions.push({
          id: 'hand_gentle',
          text: 'Нежно поласкать себя',
          description: 'Более женственный подход',
          onClick: () => attemptMasturbation('hand', 'gentle')
        });
      }
    }
  } else {
    // В поясе верности
    actions.push({
      id: 'cage_frustrated',
      text: 'Попытаться трогать клетку',
      description: 'Бесполезно, но вы отчаянно пытаетесь',
      onClick: () => showCageScene('frustrated')
    });
  }
  
  // Проверка наличия игрушек
  const toys = window.store.inventory.filter(item => 
    item.type === 'toy' || item.type === 'vibrator'
  );
  
  toys.forEach(toy => {
    if (toy.id.includes('dildo')) {
      actions.push({
        id: `use_${toy.id}`,
        text: `Использовать ${toy.name}`,
        description: 'Попробовать анальную стимуляцию',
        onClick: () => attemptMasturbation('dildo', toy.id)
      });
    } else if (toy.id.includes('vibrator')) {
      if (isChastity) {
        actions.push({
          id: `vibrator_cage_${toy.id}`,
          text: `Вибратор на клетку`,
          description: 'Единственный способ получить разрядку в поясе',
          onClick: () => attemptMasturbation('vibrator_cage', toy.id)
        });
      } else {
        actions.push({
          id: `use_${toy.id}`,
          text: `Использовать ${toy.name}`,
          description: 'Мощная вибрация для быстрого результата',
          onClick: () => attemptMasturbation('vibrator', toy.id)
        });
      }
    }
  });
  
  // Отображение действий
  displayActions(actions);
  
  // Отображение начальной сцены
  displayInitialScene(isChastity, arousal);
}

function displayInitialScene(isChastity, arousal) {
  const content = document.getElementById('scene-content');
  
  if (arousal < 30) {
    content.innerHTML = `
      <p><em>Вы не особо возбуждены, но может стоит снять небольшое напряжение?</em></p>
    `;
  } else if (arousal < 70) {
    if (isChastity) {
      content.innerHTML = `
        <p><em>Пояс верности плотно сжимает вас. Возбуждение нарастает, но вы не можете дотронуться до себя напрямую.</em></p>
      `;
    } else {
      content.innerHTML = `
        <p><em>Вы чувствуете приятное возбуждение. Самое время позаботиться о себе.</em></p>
      `;
    }
  } else {
    if (isChastity) {
      content.innerHTML = `
        <p><em>Вы отчаянно возбуждены! Клетка кажется невыносимо тесной. Нужно срочно что-то делать!</em></p>
      `;
    } else {
      content.innerHTML = `
        <p><em>Возбуждение почти невыносимо! Вы едва можете думать о чем-то другом.</em></p>
      `;
    }
  }
}

function displayActions(actions) {
  const container = document.getElementById('action-buttons');
  container.innerHTML = actions.map(action => `
    <button class="action-btn" onclick="${action.onClick}">
      <strong>${action.text}</strong><br>
      <small>${action.description}</small>
    </button>
  `).join('');
}

async function attemptMasturbation(method, variant) {
  // Импорт систем
  const ArousalSystem = (await import('/systems/ArousalSystem.js')).default;
  const BodySystem = (await import('../systems/BodySystem.js')).default;
  
  const arousalSystem = new ArousalSystem(window.store);
  const bodySystem = new BodySystem(window.store);
  
  // Попытка оргазма
  const result = arousalSystem.attemptOrgasm(method);
  
  // Выбор GIF на основе параметров тела
  const gifPath = selectMasturbationGif(method, variant, bodySystem);
  
  // Отображение результата
  displayMasturbationScene(method, variant, result, gifPath);
}

function selectMasturbationGif(method, variant, bodySystem) {
  // Определение основного действия
  let action = 'masturbation';
  let subMethod = method;
  
  // Корректировка для специальных случаев
  if (method === 'vibrator_cage') {
    subMethod = 'vibrator/on_cage';
  } else if (variant && variant.includes('dildo')) {
    // Определение размера дилдо
    if (variant.includes('small')) {
      subMethod = 'dildo/small';
    } else if (variant.includes('large')) {
      subMethod = 'dildo/large';
    } else {
      subMethod = 'dildo/medium';
    }
  }
  
  // Использование системы выбора GIF на основе тела
  return bodySystem.selectBodyBasedGif(action, subMethod);
}

function displayMasturbationScene(method, variant, result, gifPath) {
  const content = document.getElementById('scene-content');
  const actions = document.getElementById('action-buttons');
  
  let sceneText = '';
  
  if (result.success) {
    // Успешный оргазм
    switch (result.type) {
      case 'normal':
        sceneText = `
          <p><em>Вы быстро доводите себя до разрядки. Обычный оргазм приносит облегчение.</em></p>
          <p class="success">Напряжение спало. Вы чувствуете приятную усталость.</p>
        `;
        break;
        
      case 'sissygasm':
        sceneText = `
          <p><em>Волна удовольствия накатывает изнутри. Ваше тело дрожит от необычных ощущений.</em></p>
          <p class="success">Сиссигазм! Это было невероятно интенсивно!</p>
          <p><small>Sissification +3, Femininity +2, Anal Training +2</small></p>
        `;
        break;
        
      case 'vibrator_cage':
        sceneText = `
          <p><em>Вибратор жужжит на клетке. Ощущения странные, но постепенно нарастает необычное удовольствие.</em></p>
          <p class="success">Вы кончаете прямо в клетке! Унизительно, но так приятно...</p>
          <p><small>Submission +8, Sissification +5</small></p>
        `;
        break;
    }
  } else {
    // Неудача
    if (result.reason === 'chastity_blocks_hand') {
      sceneText = `
        <p class="error">${result.message}</p>
        <p><em>Вы трогаете холодный материал клетки, но это только усиливает фрустрацию.</em></p>
      `;
    } else if (result.reason === 'failed_attempt') {
      sceneText = `
        <p><em>${result.message}</em></p>
        <p>Шанс был ${Math.floor(result.chance)}%, выпало ${Math.floor(result.roll)}</p>
        <p class="warning">Arousal +10, Stress +5</p>
      `;
    }
  }
  
  // Добавление GIF
  sceneText = `
    <div class="gif-container">
      <img src="${gifPath}" alt="Scene" onerror="this.src='/assets/gifs/placeholder.gif'">
    </div>
    ${sceneText}
  `;
  
  content.innerHTML = sceneText;
  
  // Кнопки после сцены
  if (result.success) {
    actions.innerHTML = `
      <button onclick="window.location.search='?scene=bedroom'">Отдохнуть</button>
    `;
  } else {
    actions.innerHTML = `
      <button onclick="checkCharacterState()">Попробовать еще раз</button>
      <button onclick="window.location.search='?scene=bedroom'">Сдаться</button>
    `;
  }
}

function showCageScene(type) {
  const content = document.getElementById('scene-content');
  const actions = document.getElementById('action-buttons');
  
  // Выбор GIF на основе материала клетки
  const chastity = window.store.equipped.chastity;
  const material = chastity?.material || 'metal';
  const gifPath = `/assets/gifs/masturbation/chastity/${material}_frustrated.gif`;
  
  content.innerHTML = `
    <div class="gif-container">
      <img src="${gifPath}" alt="Cage frustration" onerror="this.src='/assets/gifs/placeholder.gif'">
    </div>
    <p><em>Вы безуспешно пытаетесь получить хоть какое-то удовольствие через клетку. Это только усиливает возбуждение.</em></p>
    <p class="warning">Arousal +15, Stress +10</p>
  `;
  
  window.addStat('arousal', 15);
  window.addStat('stress', 10);
  
  actions.innerHTML = `
    <button onclick="checkCharacterState()">Попробовать что-то другое</button>
    <button onclick="window.location.search='?scene=bedroom'">Сдаться</button>
  `;
}

// Стили для сцены
const style = document.createElement('style');
style.textContent = `
  .arousal-display {
    background: linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(168, 85, 247, 0.1));
    border: 1px solid var(--primary-color);
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 20px;
    text-align: center;
    font-size: 1.2rem;
  }
  
  .action-btn {
    display: block;
    width: 100%;
    padding: 15px;
    margin: 10px 0;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    text-align: left;
    transition: all 0.3s ease;
  }
  
  .action-btn:hover {
    border-color: var(--primary-color);
    background: rgba(236, 72, 153, 0.1);
  }
  
  .action-btn strong {
    color: var(--accent-color);
  }
  
  .action-btn small {
    color: var(--text-secondary);
  }
  
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
  
  .success {
    color: var(--success-color);
    font-weight: bold;
  }
  
  .warning {
    color: var(--warning-color);
  }
  
  .error {
    color: var(--error-color);
  }
`;
document.head.appendChild(style);

// Инициализация
checkCharacterState();
</script> 