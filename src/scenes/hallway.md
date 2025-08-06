# Коридор

<div id="hallway-container">
  <div id="hallway-image-container">
    <!-- Изображение будет загружено динамически -->
  </div>
  
  <div id="hallway-description">
    <!-- Описание будет загружено динамически -->
  </div>
  
  <div id="hallway-navigation">
    <h3>Куда пойти?</h3>
    <div class="navigation-grid">
      <div class="nav-option" onclick="goToRoom('room')">
        <span class="nav-icon">🛏️</span>
        <span class="nav-text">Спальня</span>
      </div>
      
      <div class="nav-option" onclick="goToRoom('bathroom_location')">
        <span class="nav-icon">🛁</span>
        <span class="nav-text">Ванная</span>
      </div>
      
      <div class="nav-option" onclick="goToRoom('kitchen')">
        <span class="nav-icon">🍳</span>
        <span class="nav-text">Кухня</span>
      </div>
      
      <div class="nav-option" onclick="goToRoom('street')">
        <span class="nav-icon">🚪</span>
        <span class="nav-text">Выйти на улицу</span>
      </div>
    </div>
  </div>
  
  <div id="hallway-actions">
    <!-- Дополнительные действия в зависимости от типа квартиры -->
          <button onclick="window.uiManager.showWardrobeModal()" class="special-action-btn">Открыть гардероб</button>
  </div>
</div>

<script>
// Загрузка и отображение коридора
async function loadHallway() {
  try {
    // Импорт системы квартир
    const ApartmentSystem = (await import('../systems/ApartmentSystem.js')).default;
    const apartmentSystem = new ApartmentSystem(window.store);
    
    // Получение информации о текущей квартире
    const apartment = apartmentSystem.getCurrentApartmentType();
    const description = apartmentSystem.getApartmentDescription();
    const hallwayImage = apartmentSystem.getRoomImage('hallway');
    
    // Отображение изображения
    const imageContainer = document.getElementById('hallway-image-container');
    imageContainer.innerHTML = `
      <div class="location-image">
        <img src="${hallwayImage}" alt="Коридор" onerror="this.src='/assets/images/placeholder_hallway.jpg'">
        <div class="image-overlay">
          <h2>${apartment.name}</h2>
        </div>
      </div>
    `;
    
    // Отображение описания
    const descContainer = document.getElementById('hallway-description');
    descContainer.innerHTML = `
      <div class="apartment-info">
        <p class="apartment-desc">${description.description}</p>
        <div class="apartment-features">
          <h4>Особенности:</h4>
          <ul>
            ${description.features.map(feature => `<li>${feature}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
    
    // Загрузка специальных действий для квартиры
    loadApartmentActions(apartment);
    
  } catch (error) {
    console.error('Ошибка загрузки коридора:', error);
    
    // Fallback отображение
    document.getElementById('hallway-image-container').innerHTML = `
      <div class="location-image">
        <img src="/assets/images/placeholder_hallway.jpg" alt="Коридор">
        <div class="image-overlay">
          <h2>Коридор</h2>
        </div>
      </div>
    `;
    
    document.getElementById('hallway-description').innerHTML = `
      <div class="apartment-info">
        <p>Вы находитесь в коридоре. Отсюда можно попасть в разные комнаты.</p>
      </div>
    `;
  }
}

// Загрузка действий для конкретного типа квартиры
function loadApartmentActions(apartment) {
  const actionsContainer = document.getElementById('hallway-actions');
  const actions = [];
  
  switch (apartment.id) {
    case 'luxury':
      actions.push({
        text: '🏠 Вызвать консьержа',
        onclick: 'callConcierge()',
        description: 'Обратиться к консьержу за помощью'
      });
      actions.push({
        text: '📺 Включить умный дом',
        onclick: 'activateSmartHome()',
        description: 'Управление освещением и климатом'
      });
      break;
      
    case 'cheap':
      actions.push({
        text: '🔧 Проверить что сломалось',
        onclick: 'checkBrokenStuff()',
        description: 'В дешевой квартире всегда что-то ломается'
      });
      break;
      
    case 'parents':
      actions.push({
        text: '👨‍👩‍👧‍👦 Поговорить с родителями',
        onclick: 'talkToParents()',
        description: 'Пообщаться с семьей'
      });
      break;
      
    case 'studio':
      actions.push({
        text: '🎨 Заняться творчеством',
        onclick: 'doCreativeWork()',
        description: 'Использовать вдохновляющую атмосферу'
      });
      break;
  }
  
  if (actions.length > 0) {
    actionsContainer.innerHTML = `
      <h4>Специальные действия:</h4>
      <div class="special-actions">
        ${actions.map(action => `
          <button class="special-action-btn" onclick="${action.onclick}" title="${action.description}">
            ${action.text}
          </button>
        `).join('')}
      </div>
    `;
  }
}

// Навигация по комнатам
function goToRoom(roomId) {
  // Добавляем небольшую задержку для эффекта перехода
  const navOption = event.target.closest('.nav-option');
  if (navOption) {
    navOption.style.transform = 'scale(0.95)';
    setTimeout(() => {
      window.gameEngine.loadScene(roomId);
    }, 150);
  } else {
    window.gameEngine.loadScene(roomId);
  }
}

// Специальные действия для разных типов квартир
function callConcierge() {
  window.addStat('mood', 5);
  window.addStat('dignity', 2);
  window.tick(10);
  
  alert('🏠 Консьерж приветливо поинтересовался вашими потребностями. Приятно жить в роскоши!');
}

function activateSmartHome() {
  window.addStat('mood', 3);
  window.addStat('energy', 5);
  window.tick(5);
  
  alert('📺 Умный дом настроил идеальное освещение и температуру. Технологии делают жизнь лучше!');
}

function checkBrokenStuff() {
  const problems = [
    'Протекает кран',
    'Не работает лампочка',
    'Скрипит дверь',
    'Отклеились обои',
    'Шумят трубы'
  ];
  
  const problem = problems[Math.floor(Math.random() * problems.length)];
  window.addStat('stress', 3);
  window.addStat('mood', -2);
  window.tick(15);
  
  alert(`🔧 Как и ожидалось: ${problem}. Жизнь в дешевой квартире полна сюрпризов...`);
}

function talkToParents() {
  const conversations = [
    { text: 'Мама спрашивает, когда вы найдете работу', effects: { stress: 5, dignity: -2 } },
    { text: 'Папа рассказывает старые истории', effects: { mood: 3, nostalgia: 5 } },
    { text: 'Родители беспокоятся о вашем будущем', effects: { stress: 3, love: 2 } },
    { text: 'Семейный ужин поднимает настроение', effects: { mood: 5, health: 3 } }
  ];
  
  const conversation = conversations[Math.floor(Math.random() * conversations.length)];
  
  Object.entries(conversation.effects).forEach(([stat, value]) => {
    window.addStat(stat, value);
  });
  
  window.tick(30);
  alert(`👨‍👩‍👧‍👦 ${conversation.text}`);
}

function doCreativeWork() {
  window.addStat('mood', 8);
  window.addStat('energy', -10);
  window.addStat('creativity', 10);
  window.tick(60);
  
  alert('🎨 Вдохновляющая атмосфера студии пробудила в вас творческий порыв!');
}

// Стили для коридора
const style = document.createElement('style');
style.textContent = `
  #hallway-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .location-image {
    position: relative;
    width: 100%;
    max-width: 600px;
    margin: 0 auto 30px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  }
  
  .location-image img {
    width: 100%;
    height: 300px;
    object-fit: cover;
    display: block;
  }
  
  .image-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0,0,0,0.8));
    padding: 30px 20px 20px;
    color: white;
  }
  
  .image-overlay h2 {
    margin: 0;
    font-size: 1.8em;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
  }
  
  .apartment-info {
    background: rgba(255,255,255,0.05);
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 30px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.1);
  }
  
  .apartment-desc {
    font-size: 1.1em;
    margin-bottom: 15px;
    color: var(--text-primary);
  }
  
  .apartment-features h4 {
    margin: 0 0 10px 0;
    color: var(--primary-color);
  }
  
  .apartment-features ul {
    margin: 0;
    padding-left: 20px;
  }
  
  .apartment-features li {
    margin: 5px 0;
    color: var(--text-secondary);
  }
  
  .navigation-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 15px;
    margin-top: 15px;
  }
  
  .nav-option {
    background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
    border: none;
    border-radius: 12px;
    padding: 20px 10px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    color: white;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  }
  
  .nav-option:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
  }
  
  .nav-option:active {
    transform: scale(0.95);
  }
  
  .nav-icon {
    font-size: 2em;
    margin-bottom: 5px;
  }
  
  .nav-text {
    font-weight: 600;
    font-size: 0.9em;
  }
  
  .special-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 10px;
  }
  
  .special-action-btn {
    background: rgba(255,255,255,0.1);
    border: 1px solid var(--primary-color);
    border-radius: 8px;
    padding: 10px 15px;
    color: var(--primary-color);
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9em;
  }
  
  .special-action-btn:hover {
    background: var(--primary-color);
    color: white;
    transform: translateY(-1px);
  }
  
  @media (max-width: 600px) {
    .navigation-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .nav-option {
      padding: 15px 8px;
    }
    
    .nav-icon {
      font-size: 1.5em;
    }
    
    .nav-text {
      font-size: 0.8em;
    }
  }
`;
document.head.appendChild(style);

// Инициализация
loadHallway();
</script> 