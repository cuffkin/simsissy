# Дома

*Ваша маленькая квартира. {{isFirstDay ? "Новое начало в новом месте. Столько возможностей впереди!" : "Привычная обстановка, привычная рутина."}*

<div class="time-display">
🕐 **Время**: {{timeString}}  
📅 **День**: {{day}}
</div>

## Что вы хотите сделать?

<div id="routine-actions">
<!-- Действия будут загружены динамически -->
</div>

<script>
// Проверка дня и состояния
function loadRoutineActions() {
  const day = window.store.time.day;
  const isFirstDay = day === 1;
  const arousal = window.getStat('arousal');
  const energy = window.getStat('energy');
  const hygiene = window.getStat('hygiene');
  
  const container = document.getElementById('routine-actions');
  
  if (isFirstDay) {
    // Первый день - полный выбор
    container.innerHTML = `
      <h3>🛏️ Спальня</h3>
      <ul>
        <li><a href="?scene=bedroom">Пойти в спальню</a> - Отдохнуть, переодеться или... другое</li>
        <li><a href="?scene=wardrobe">Открыть шкаф</a> - Выбрать одежду</li>
        <li><a href="?scene=sleep">Лечь спать</a> - Восстановить силы</li>
      </ul>
      
      <h3>🚿 Ванная</h3>
      <ul>
        <li><a href="?scene=bathroom_location">Пойти в ванную</a> - Принять душ, привести себя в порядок</li>
        <li><a href="?scene=mirror">Посмотреть в зеркало</a> - Оценить свою внешность</li>
      </ul>
      
      <h3>🍳 Кухня</h3>
      <ul>
        <li><a href="?scene=kitchen">Пойти на кухню</a> - Приготовить еду, перекусить</li>
        <li><a href="?scene=fridge">Проверить холодильник</a> - Что есть из продуктов?</li>
      </ul>
      
      <h3>💻 Гостиная</h3>
      <ul>
        <li><a href="?scene=computer">Сесть за компьютер</a> - Интернет, работа, развлечения</li>
        <li><a href="?scene=tv">Смотреть ТВ</a> - Расслабиться перед экраном</li>
        <li><a href="?scene=read">Почитать</a> - Книги и журналы</li>
      </ul>
      
      <h3>🚪 Выход</h3>
      <ul>
        <li><a href="?scene=street">Выйти на улицу</a> - Исследовать город</li>
      </ul>
    `;
  } else {
    // После первого дня - сокращенный выбор
    let actions = [];
    
    // Базовые действия всегда доступны
    actions.push(`<li><a href="?scene=bedroom">Спальня</a> ${arousal > 70 ? '- <span class="hint">Нужно снять напряжение...</span>' : ''}</li>`);
    actions.push(`<li><a href="?scene=bathroom_location">Ванная</a> ${hygiene < 30 ? '- <span class="hint">Пора помыться</span>' : ''}</li>`);
    
    // Условные действия
    if (energy < 30) {
      actions.push(`<li><a href="?scene=kitchen_quick">Быстро перекусить</a> - <span class="hint">Вы голодны</span></li>`);
    }
    
    if (energy > 50 && arousal < 80) {
      actions.push(`<li><a href="?scene=computer_quick">Проверить почту</a></li>`);
    }
    
    actions.push(`<li><a href="?scene=street">Выйти из дома</a></li>`);
    
    // Особые события при высоком возбуждении
    if (arousal >= 90) {
      container.innerHTML = `
        <p class="warning">Вы слишком возбуждены, чтобы нормально функционировать!</p>
        <ul>
          <li><a href="?scene=bedroom_masturbation">Срочно в спальню!</a></li>
          <li><a href="?scene=cold_shower">Холодный душ</a> - Попытаться остыть</li>
        </ul>
      `;
      return;
    }
    
    container.innerHTML = `
      <h3>Быстрые действия:</h3>
      <ul>
        ${actions.join('')}
      </ul>
      
      <p class="hint"><em>День ${day}. Рутина затягивает. Большинство действий выполняются автоматически.</em></p>
    `;
  }
}

// Проверка блокировок от возбуждения
async function checkArousalBlocks() {
  if (window.store.stats.arousal >= 80) {
    const ArousalSystem = (await import('/systems/ArousalSystem.js')).default;
    const arousalSystem = new ArousalSystem(window.store);
    const blocks = arousalSystem.checkArousalBlocks();
    
    if (blocks.length > 0) {
      const blockMessages = blocks.map(b => `<li>${b.reason}</li>`).join('');
      document.getElementById('routine-actions').innerHTML += `
        <div class="arousal-blocks">
          <h4>⚠️ Заблокировано из-за возбуждения:</h4>
          <ul>${blockMessages}</ul>
        </div>
      `;
    }
  }
}

// Стили
const style = document.createElement('style');
style.textContent = `
  .time-display {
    background: rgba(255,255,255,0.1);
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  
  .hint {
    color: var(--accent-color);
    font-style: italic;
    font-size: 0.9rem;
  }
  
  .warning {
    color: var(--error-color);
    font-weight: bold;
    padding: 10px;
    background: rgba(239, 68, 68, 0.1);
    border-radius: 8px;
    margin-bottom: 15px;
  }
  
  .arousal-blocks {
    margin-top: 20px;
    padding: 15px;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid var(--error-color);
    border-radius: 8px;
  }
  
  .arousal-blocks h4 {
    color: var(--error-color);
    margin: 0 0 10px 0;
  }
  
  #routine-actions h3 {
    color: var(--primary-color);
    margin-top: 20px;
    margin-bottom: 10px;
  }
  
  #routine-actions ul {
    list-style: none;
    padding: 0;
  }
  
  #routine-actions li {
    margin: 8px 0;
    padding: 8px;
    background: rgba(255,255,255,0.02);
    border-radius: 4px;
    transition: all 0.3s ease;
  }
  
  #routine-actions li:hover {
    background: rgba(255,255,255,0.05);
    padding-left: 12px;
  }
`;
document.head.appendChild(style);

// Инициализация
loadRoutineActions();
checkArousalBlocks();
</script> 