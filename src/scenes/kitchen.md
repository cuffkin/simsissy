# Кухня

<div id="kitchen-container">
  <div id="kitchen-image-container">
    <!-- Изображение будет загружено динамически -->
  </div>
  
  <div id="kitchen-description">
    <p>Вы находитесь на кухне. Здесь можно приготовить еду, перекусить или выпить что-нибудь.</p>
  </div>
  
  <div id="kitchen-actions">
    <h3>Что делать?</h3>
    <div class="action-grid">
      
      <div class="action-option" onclick="cookMeal()">
        <span class="action-icon">🍳</span>
        <span class="action-text">Приготовить еду</span>
        <span class="action-desc">Сделать полноценный обед</span>
      </div>
      
      <div class="action-option" onclick="makeSnack()">
        <span class="action-icon">🥪</span>
        <span class="action-text">Перекусить</span>
        <span class="action-desc">Быстрый перекус</span>
      </div>
      
      <div class="action-option" onclick="drinkWater()">
        <span class="action-icon">💧</span>
        <span class="action-text">Выпить воды</span>
        <span class="action-desc">Утолить жажду</span>
      </div>
      
      <div class="action-option" onclick="makeCoffee()">
        <span class="action-icon">☕</span>
        <span class="action-text">Сделать кофе</span>
        <span class="action-desc">Взбодриться кофеином</span>
      </div>
      
      <div class="action-option" onclick="checkFridge()">
        <span class="action-icon">🧊</span>
        <span class="action-text">Заглянуть в холодильник</span>
        <span class="action-desc">Посмотреть что есть</span>
      </div>
      
      <div class="action-option" onclick="washDishes()">
        <span class="action-icon">🧽</span>
        <span class="action-text">Помыть посуду</span>
        <span class="action-desc">Навести порядок</span>
      </div>
      
    </div>
  </div>
  
  <div id="kitchen-navigation">
    <button class="nav-btn" onclick="window.gameEngine.loadScene('hallway')">
      🚪 Выйти в коридор
    </button>
  </div>
</div>

<script>
// Загрузка кухни
async function loadKitchen() {
  try {
    // Импорт системы квартир
    const ApartmentSystem = (await import('../systems/ApartmentSystem.js')).default;
    const apartmentSystem = new ApartmentSystem(window.store);
    
    // Получение изображения кухни для текущей квартиры
    const kitchenImage = apartmentSystem.getRoomImage('kitchen') || '/assets/images/placeholder_kitchen.jpg';
    
    // Отображение изображения
    const imageContainer = document.getElementById('kitchen-image-container');
    imageContainer.innerHTML = `
      <div class="location-image">
        <img src="${kitchenImage}" alt="Кухня" onerror="this.src='/assets/images/placeholder_kitchen.jpg'">
      </div>
    `;
    
  } catch (error) {
    console.error('Ошибка загрузки кухни:', error);
    
    // Fallback отображение
    document.getElementById('kitchen-image-container').innerHTML = `
      <div class="location-image">
        <img src="/assets/images/placeholder_kitchen.jpg" alt="Кухня">
      </div>
    `;
  }
}

// Действия на кухне
function cookMeal() {
  const energy = window.getStat('energy') || 0;
  
  if (energy < 20) {
    alert('🍳 Вы слишком устали, чтобы готовить. Сначала отдохните.');
    return;
  }
  
  window.addStat('health', 15);
  window.addStat('mood', 10);
  window.addStat('energy', -15);
  window.tick(45);
  
  const meals = [
    'Вы приготовили вкусную пасту с соусом',
    'Вы пожарили яичницу с беконом',
    'Вы сделали овощной салат',
    'Вы приготовили рис с курицей',
    'Вы сварили борщ'
  ];
  
  const meal = meals[Math.floor(Math.random() * meals.length)];
  alert(`🍳 ${meal}. Получилось очень вкусно!`);
}

function makeSnack() {
  window.addStat('health', 5);
  window.addStat('mood', 3);
  window.tick(10);
  
  const snacks = [
    'Вы съели бутерброд',
    'Вы перекусили фруктами',
    'Вы съели йогурт',
    'Вы похрустели печеньем',
    'Вы съели банан'
  ];
  
  const snack = snacks[Math.floor(Math.random() * snacks.length)];
  alert(`🥪 ${snack}. Голод немного утих.`);
}

function drinkWater() {
  window.addStat('health', 3);
  window.addStat('hygiene', 2);
  window.tick(2);
  
  alert('💧 Вы выпили стакан прохладной воды. Жажда утолена!');
}

function makeCoffee() {
  window.addStat('energy', 15);
  window.addStat('mood', 5);
  window.addStat('stress', -3);
  window.tick(10);
  
  alert('☕ Вы приготовили ароматный кофе. Бодрящий напиток придал сил!');
}

function checkFridge() {
  const messages = [
    'В холодильнике есть молоко, яйца и остатки вчерашнего ужина',
    'Холодильник почти пуст - пора идти в магазин',
    'Много овощей и фруктов - можно приготовить салат',
    'Есть мясо и гарнир - хватит на полноценный обед',
    'Только пиво и сыр - типичный холостяцкий набор'
  ];
  
  const message = messages[Math.floor(Math.random() * messages.length)];
  alert(`🧊 ${message}.`);
  
  window.tick(3);
}

function washDishes() {
  window.addStat('mood', 5);
  window.addStat('hygiene', 5);
  window.tick(15);
  
  alert('🧽 Вы помыли посуду. Кухня стала чище, а вы почувствовали удовлетворение от наведенного порядка.');
}

// Стили для кухни
const style = document.createElement('style');
style.textContent = `
  #kitchen-container {
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
  
  #kitchen-navigation {
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
loadKitchen();
</script> 