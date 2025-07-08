# Ванная комната

<div id="bathroom-container">
  <div id="bathroom-image-container">
    <!-- Изображение будет загружено динамически -->
  </div>
  
  <div id="bathroom-description">
    <p>Вы находитесь в ванной комнате. Здесь можно заняться личной гигиеной и уходом за собой.</p>
  </div>
  
  <div id="bathroom-actions">
    <h3>Что делать?</h3>
    <div class="action-grid">
      
      <div class="action-option" onclick="goToMirror()">
        <span class="action-icon">🪞</span>
        <span class="action-text">Посмотреть в зеркало</span>
        <span class="action-desc">Осмотреть свою внешность</span>
      </div>
      
      <div class="action-option" onclick="takeShower()">
        <span class="action-icon">🚿</span>
        <span class="action-text">Принять душ</span>
        <span class="action-desc">Помыться и освежиться</span>
      </div>
      
      <div class="action-option" onclick="brushTeeth()">
        <span class="action-icon">🦷</span>
        <span class="action-text">Почистить зубы</span>
        <span class="action-desc">Позаботиться о гигиене полости рта</span>
      </div>
      
      <div class="action-option" onclick="useToilet()">
        <span class="action-icon">🚽</span>
        <span class="action-text">Воспользоваться туалетом</span>
        <span class="action-desc">Справить нужду</span>
      </div>
      
      <div class="action-option" onclick="doSkincare()">
        <span class="action-icon">🧴</span>
        <span class="action-text">Уход за кожей</span>
        <span class="action-desc">Использовать косметические средства</span>
      </div>
      
      <div class="action-option" onclick="shaveBody()">
        <span class="action-icon">🪒</span>
        <span class="action-text">Побриться</span>
        <span class="action-desc">Удалить нежелательные волосы</span>
      </div>
      
    </div>
  </div>
  
  <div id="bathroom-special-actions">
    <!-- Специальные действия в зависимости от инвентаря и статистик -->
  </div>
  
  <div id="bathroom-navigation">
    <button class="nav-btn" onclick="window.gameEngine.loadScene('hallway')">
      🚪 Выйти в коридор
    </button>
  </div>
</div>

<script>
// Загрузка ванной комнаты
async function loadBathroom() {
  try {
    // Импорт системы квартир
    const ApartmentSystem = (await import('../systems/ApartmentSystem.js')).default;
    const apartmentSystem = new ApartmentSystem(window.store);
    
    // Получение изображения ванной для текущей квартиры
    const bathroomImage = apartmentSystem.getRoomImage('bathroom');
    
    // Отображение изображения
    const imageContainer = document.getElementById('bathroom-image-container');
    imageContainer.innerHTML = `
      <div class="location-image">
        <img src="${bathroomImage}" alt="Ванная комната" onerror="this.src='/assets/images/placeholder_bathroom.jpg'">
      </div>
    `;
    
    // Загрузка специальных действий
    loadSpecialBathroomActions();
    
  } catch (error) {
    console.error('Ошибка загрузки ванной:', error);
    
    // Fallback отображение
    document.getElementById('bathroom-image-container').innerHTML = `
      <div class="location-image">
        <img src="/assets/images/placeholder_bathroom.jpg" alt="Ванная комната">
      </div>
    `;
  }
}

// Загрузка специальных действий
function loadSpecialBathroomActions() {
  const specialContainer = document.getElementById('bathroom-special-actions');
  const actions = [];
  
  // Проверяем наличие различных предметов в инвентаре
  const inventory = window.store.inventory || [];
  const femininity = window.getStat('femininity') || 0;
  const hygiene = window.getStat('hygiene') || 0;
  
  // Макияж
  if (inventory.some(item => item.id === 'makeup_basic') && femininity >= 10) {
    actions.push({
      text: '💄 Накраситься',
      onclick: 'applyMakeup()',
      description: 'Нанести макияж'
    });
  }
  
  // Ванна (только для роскошных квартир)
  const apartmentType = window.store.flags.apartmentType || 'parents';
  if (apartmentType === 'luxury') {
    actions.push({
      text: '🛁 Принять ванну',
      onclick: 'takeBath()',
      description: 'Расслабиться в джакузи'
    });
  }
  
  // Депиляция (если есть соответствующие средства)
  if (inventory.some(item => item.id === 'hair_removal_cream')) {
    actions.push({
      text: '🧴 Депиляция кремом',
      onclick: 'useHairRemovalCream()',
      description: 'Удалить волосы кремом'
    });
  }
  
  // Маникюр
  if (inventory.some(item => item.id === 'nail_polish') && femininity >= 20) {
    actions.push({
      text: '💅 Сделать маникюр',
      onclick: 'doManicure()',
      description: 'Покрасить ногти'
    });
  }
  
  if (actions.length > 0) {
    specialContainer.innerHTML = `
      <h4>Дополнительные действия:</h4>
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

// Основные действия в ванной
function goToMirror() {
  window.gameEngine.loadScene('mirror');
}

async function takeShower() {
  // Импорт системы инвентаря
  const InventorySystem = (await import('../systems/InventorySystem.js')).default;
  const inventorySystem = new InventorySystem(window.store);
  
  // Проверяем наличие мыла или геля
  const hasSoap = inventorySystem.hasItem('soap_basic').available || 
                   inventorySystem.hasItem('soap_luxury').available ||
                   inventorySystem.hasItem('shower_gel').available;
  
  if (!hasSoap) {
    alert('🚿 У вас нет мыла или геля для душа. Нужно купить в магазине.');
    return;
  }
  
  const hygiene = window.getStat('hygiene') || 0;
  
  if (hygiene >= 90) {
    alert('🚿 Вы уже достаточно чисты. Не стоит тратить воду понапрасну.');
    return;
  }
  
  // Используем мыло
  if (inventorySystem.hasItem('soap_basic').available) {
    inventorySystem.useConsumable('soap_basic', 0.1); // Мыло расходуется медленно
  } else if (inventorySystem.hasItem('soap_luxury').available) {
    inventorySystem.useConsumable('soap_luxury', 0.05); // Роскошное мыло экономичнее
  } else if (inventorySystem.hasItem('shower_gel').available) {
    inventorySystem.useConsumable('shower_gel', 0.15); // Гель расходуется быстрее
  }
  
  window.addStat('hygiene', 25);
  window.addStat('mood', 5);
  window.addStat('energy', 5);
  window.tick(20);
  
  // Проверяем женственность для разных описаний
  const femininity = window.getStat('femininity') || 0;
  
  if (femininity >= 30) {
    alert('🚿 Вы нежно намылили своё тело ароматным гелем. Кожа стала мягкой и гладкой. Вы чувствуете себя свежо и женственно.');
    window.addStat('femininity', 1);
  } else {
    alert('🚿 Вы быстро помылись под горячей водой. Чувствуете себя чище и бодрее.');
  }
  
  loadSpecialBathroomActions(); // Обновляем доступные действия
}

async function brushTeeth() {
  // Импорт системы инвентаря
  const InventorySystem = (await import('../systems/InventorySystem.js')).default;
  const inventorySystem = new InventorySystem(window.store);
  
  // Проверяем наличие щетки
  const hasBrush = inventorySystem.hasItem('toothbrush_basic').available || 
                    inventorySystem.hasItem('toothbrush_electric').available;
  
  if (!hasBrush) {
    alert('🦷 У вас нет зубной щетки. Нужно купить в магазине.');
    return;
  }
  
  // Проверяем наличие пасты
  const hasPaste = inventorySystem.hasItem('toothpaste').available || 
                    inventorySystem.hasItem('toothpaste_premium').available;
  
  if (!hasPaste) {
    alert('🦷 У вас нет зубной пасты. Нужно купить в магазине.');
    return;
  }
  
  // Используем пасту
  if (inventorySystem.hasItem('toothpaste').available) {
    inventorySystem.useConsumable('toothpaste', 0.02); // Паста расходуется очень медленно
  } else {
    inventorySystem.useConsumable('toothpaste_premium', 0.01); // Премиум паста еще экономичнее
  }
  
  window.addStat('hygiene', 10);
  window.addStat('mood', 2);
  window.tick(5);
  
  alert('🦷 Вы тщательно почистили зубы. Дыхание стало свежим, а улыбка - ослепительной!');
}

function useToilet() {
  window.addStat('hygiene', 5);
  window.addStat('mood', 3);
  window.tick(5);
  
  alert('🚽 Вы справили нужду. Чувствуете облегчение.');
}

async function doSkincare() {
  const femininity = window.getStat('femininity') || 0;
  
  if (femininity < 15) {
    alert('🧴 Вы не очень-то разбираетесь в уходе за кожей. Может, стоит сначала изучить эту тему?');
    return;
  }
  
  // Импорт системы инвентаря
  const InventorySystem = (await import('../systems/InventorySystem.js')).default;
  const inventorySystem = new InventorySystem(window.store);
  
  // Проверяем наличие средств для ухода
  const hasSkincare = inventorySystem.hasItem('skincare_basic').available || 
                      inventorySystem.hasItem('skincare_luxury').available;
  
  if (!hasSkincare) {
    alert('🧴 У вас нет средств для ухода за кожей. Нужно купить в магазине.');
    return;
  }
  
  // Используем средства
  if (inventorySystem.hasItem('skincare_basic').available) {
    inventorySystem.useConsumable('skincare_basic', 0.05);
  } else {
    inventorySystem.useConsumable('skincare_luxury', 0.03);
  }
  
  window.addStat('hygiene', 15);
  window.addStat('mood', 8);
  window.addStat('femininity', 2);
  window.tick(30);
  
  alert('🧴 Вы тщательно очистили кожу, нанесли тоник и увлажняющий крем. Лицо сияет здоровьем!');
}

async function shaveBody() {
  const bodyHair = window.store.body?.bodyHair || 2;
  
  if (bodyHair <= 0) {
    alert('🪒 У вас уже гладкая кожа. Бриться нечего.');
    return;
  }
  
  // Импорт системы инвентаря
  const InventorySystem = (await import('../systems/InventorySystem.js')).default;
  const inventorySystem = new InventorySystem(window.store);
  
  // Проверяем наличие бритвы
  const hasRazor = inventorySystem.hasItem('razor_basic').available || 
                   inventorySystem.hasItem('razor_electric').available ||
                   inventorySystem.hasItem('razor_laser').available;
  
  if (!hasRazor) {
    alert('🪒 У вас нет бритвы. Нужно купить в магазине.');
    return;
  }
  
  // Импорт и использование BodySystem
  import('../systems/BodySystem.js').then(module => {
    const BodySystem = module.default;
    const bodySystem = new BodySystem(window.store);
    
    bodySystem.modifyBodyPart('bodyHair', -1);
    window.addStat('hygiene', 10);
    window.addStat('femininity', 3);
    window.tick(25);
    
    alert('🪒 Вы аккуратно побрились. Кожа стала гладкой и нежной на ощупь.');
    
    loadSpecialBathroomActions(); // Обновляем действия
  }).catch(error => {
    console.error('Ошибка загрузки BodySystem:', error);
    alert('🪒 Вы побрились обычной бритвой.');
  });
}

// Специальные действия
function applyMakeup() {
  window.addStat('femininity', 5);
  window.addStat('mood', 8);
  window.addStat('dignity', 2);
  window.tick(30);
  
  alert('💄 Вы аккуратно нанесли макияж. Лицо выглядит более женственно и привлекательно!');
}

function takeBath() {
  window.addStat('hygiene', 35);
  window.addStat('mood', 15);
  window.addStat('stress', -10);
  window.addStat('energy', 10);
  window.tick(45);
  
  alert('🛁 Вы расслабились в роскошной ванне с пеной. Джакузи массирует ваше тело, снимая усталость и стресс.');
}

function useHairRemovalCream() {
  import('../systems/BodySystem.js').then(module => {
    const BodySystem = module.default;
    const bodySystem = new BodySystem(window.store);
    
    bodySystem.modifyBodyPart('bodyHair', -2); // Крем более эффективен
    window.addStat('hygiene', 15);
    window.addStat('femininity', 5);
    window.tick(40);
    
    // Используем крем из инвентаря
    const inventory = window.store.inventory || [];
    const creamIndex = inventory.findIndex(item => item.id === 'hair_removal_cream');
    if (creamIndex !== -1) {
      inventory.splice(creamIndex, 1);
    }
    
    alert('🧴 Вы нанесли крем для депиляции и подождали. Волосы исчезли, оставив кожу невероятно гладкой!');
    
    loadSpecialBathroomActions(); // Обновляем действия
  }).catch(error => {
    console.error('Ошибка загрузки BodySystem:', error);
  });
}

function doManicure() {
  window.addStat('femininity', 4);
  window.addStat('mood', 6);
  window.addStat('dignity', 3);
  window.tick(35);
  
  alert('💅 Вы аккуратно покрасили ногти. Руки выглядят изящно и женственно!');
}

// Стили для ванной
const style = document.createElement('style');
style.textContent = `
  #bathroom-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .location-image {
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
  
  .action-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin-top: 20px;
  }
  
  .action-option {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
    backdrop-filter: blur(10px);
  }
  
  .action-option:hover {
    background: rgba(255,255,255,0.1);
    border-color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.2);
  }
  
  .action-icon {
    display: block;
    font-size: 2.5em;
    margin-bottom: 10px;
  }
  
  .action-text {
    display: block;
    font-weight: 600;
    font-size: 1.1em;
    margin-bottom: 5px;
    color: var(--primary-color);
  }
  
  .action-desc {
    display: block;
    font-size: 0.9em;
    color: var(--text-secondary);
    opacity: 0.8;
  }
  
  .special-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 15px;
  }
  
  .special-action-btn {
    background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
    border: none;
    border-radius: 8px;
    padding: 12px 16px;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9em;
    font-weight: 500;
  }
  
  .special-action-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  }
  
  .nav-btn {
    background: rgba(255,255,255,0.1);
    border: 1px solid var(--primary-color);
    border-radius: 8px;
    padding: 12px 20px;
    color: var(--primary-color);
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1em;
    margin-top: 30px;
  }
  
  .nav-btn:hover {
    background: var(--primary-color);
    color: white;
  }
  
  #bathroom-navigation {
    text-align: center;
    margin-top: 30px;
  }
  
  @media (max-width: 600px) {
    .action-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .action-option {
      padding: 15px 10px;
    }
    
    .action-icon {
      font-size: 2em;
    }
    
    .action-text {
      font-size: 1em;
    }
    
    .action-desc {
      font-size: 0.8em;
    }
  }
`;
document.head.appendChild(style);

// Инициализация
loadBathroom();
</script> 