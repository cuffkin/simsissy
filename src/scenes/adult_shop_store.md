# 🔞 "Тайные желания"

*Приглушенный свет, красные и фиолетовые тона интерьера. Полки заставлены самыми разными... интересными вещами. Продавец деликатно отвернулся, давая вам спокойно осмотреться.*

<div class="store-header">
💰 **Ваш баланс**: $<span id="money-display">0</span>  
🛒 **В корзине**: <span id="cart-count">0</span> товаров
</div>

## 🍆 Игрушки для удовольствия

<div id="toys-section" class="store-section">
<!-- Игрушки будут загружены здесь -->
</div>

## 🔒 Устройства целомудрия

<div id="chastity-section" class="store-section">
<!-- Пояса верности будут загружены здесь -->
</div>

## 💍 Аксессуары

<div id="accessories-section" class="store-section">
<!-- Аксессуары будут загружены здесь -->
</div>

## 🧴 Расходники

<div id="consumables-section" class="store-section">
<!-- Расходники будут загружены здесь -->
</div>

---

<button onclick="checkout()" class="btn">Оплатить покупки</button>
<button onclick="window.location.search='?scene=shopping_mall'" class="btn btn-secondary">Вернуться в ТЦ</button>

<script>
// Загрузка товаров из JSON
let storeItems = {};
let cart = [];

async function loadStoreItems() {
  try {
    const response = await fetch('/data/items.json');
    storeItems = await response.json();
    displayItems();
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error);
    // Используем встроенные данные
    storeItems = {
      toys: [
        {
          id: "dildo_small_pink",
          name: "Маленький розовый дилдо",
          icon: "🍆",
          price: 40,
          effects: { arousal: 15, analTraining: 3 },
          description: "Небольшой дилдо для начинающих, 12см"
        },
        {
          id: "vibrator_wand",
          name: "Вибратор-микрофон",
          icon: "🎤",
          price: 120,
          effects: { arousal: 50 },
          description: "Мощный вибратор для гарантированного оргазма"
        }
      ],
      chastity: [
        {
          id: "chastity_plastic_pink",
          name: "Розовый пластиковый пояс",
          icon: "🔒",
          price: 150,
          effects: { arousal: 5, submission: 10, dignity: -15 },
          description: "Легкий розовый пояс верности из пластика"
        }
      ],
      accessories: [
        {
          id: "collar_pink_bell",
          name: "Розовый ошейник с колокольчиком",
          icon: "🔔",
          price: 45,
          effects: { submission: 5, femininity: 5, dignity: -8 },
          description: "Милый розовый ошейник с бубенчиком"
        }
      ],
      consumables: [
        {
          id: "lube_strawberry",
          name: "Клубничная смазка",
          icon: "🍓",
          price: 15,
          effects: { arousal: 5 },
          description: "Ароматизированная смазка со вкусом клубники"
        }
      ]
    };
    displayItems();
  }
}

function displayItems() {
  // Отображение игрушек
  const toysSection = document.getElementById('toys-section');
  toysSection.innerHTML = storeItems.toys.map(item => createItemCard(item, 'toy')).join('');
  
  // Отображение поясов
  const chastitySection = document.getElementById('chastity-section');
  chastitySection.innerHTML = storeItems.chastity.map(item => createItemCard(item, 'chastity')).join('');
  
  // Отображение аксессуаров
  const accessoriesSection = document.getElementById('accessories-section');
  accessoriesSection.innerHTML = storeItems.accessories.map(item => createItemCard(item, 'accessory')).join('');
  
  // Отображение расходников
  const consumablesSection = document.getElementById('consumables-section');
  consumablesSection.innerHTML = storeItems.consumables.map(item => createItemCard(item, 'consumable')).join('');
  
  updateMoneyDisplay();
}

function createItemCard(item, type) {
  const canAfford = window.getStat('money') >= item.price;
  const meetsRequirements = checkRequirements(item.requirements || {});
  
  return `
    <div class="item-card ${!canAfford ? 'unaffordable' : ''} ${!meetsRequirements ? 'locked' : ''}">
      <div class="item-icon">${item.icon}</div>
      <div class="item-info">
        <h4>${item.name}</h4>
        <p class="item-description">${item.description}</p>
        <div class="item-effects">
          ${formatEffects(item.effects)}
        </div>
        <div class="item-price">$${item.price}</div>
      </div>
      <button 
        onclick="addToCart('${item.id}', '${type}')" 
        ${!canAfford || !meetsRequirements ? 'disabled' : ''}
      >
        ${!meetsRequirements ? 'Недоступно' : !canAfford ? 'Не хватает денег' : 'В корзину'}
      </button>
    </div>
  `;
}

function formatEffects(effects) {
  return Object.entries(effects)
    .map(([stat, value]) => {
      const sign = value > 0 ? '+' : '';
      const statNames = {
        arousal: 'Возбуждение',
        submission: 'Подчинение',
        femininity: 'Женственность',
        dignity: 'Достоинство',
        analTraining: 'Анал. навык',
        sissification: 'Сиссификация'
      };
      return `<span class="effect ${value > 0 ? 'positive' : 'negative'}">${statNames[stat] || stat}: ${sign}${value}</span>`;
    })
    .join(' ');
}

function checkRequirements(requirements) {
  for (const [stat, value] of Object.entries(requirements)) {
    if (window.getStat(stat) < value) {
      return false;
    }
  }
  return true;
}

function addToCart(itemId, type) {
  const item = findItem(itemId, type);
  if (!item) return;
  
  cart.push({ ...item, type });
  updateCartDisplay();
  
  // Визуальная обратная связь
  const btn = event.target;
  btn.textContent = 'Добавлено!';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'В корзину';
    btn.disabled = false;
  }, 1000);
}

function findItem(itemId, type) {
  const typeMap = {
    toy: 'toys',
    chastity: 'chastity',
    accessory: 'accessories',
    consumable: 'consumables'
  };
  
  const items = storeItems[typeMap[type]] || [];
  return items.find(item => item.id === itemId);
}

function updateCartDisplay() {
  document.getElementById('cart-count').textContent = cart.length;
}

function updateMoneyDisplay() {
  document.getElementById('money-display').textContent = window.getStat('money') || 0;
}

function checkout() {
  if (cart.length === 0) {
    alert('Корзина пуста!');
    return;
  }
  
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const money = window.getStat('money');
  
  if (money < total) {
    alert(`Недостаточно денег! Нужно $${total}, у вас $${money}`);
    return;
  }
  
  // Подтверждение покупки
  if (!confirm(`Купить ${cart.length} товаров за $${total}?`)) {
    return;
  }
  
  // Оплата
  window.addStat('money', -total);
  
  // Добавление товаров в инвентарь
  cart.forEach(item => {
    window.addItem({
      id: item.id,
      name: item.name,
      icon: item.icon,
      type: item.type,
      slot: item.slot,
      effects: item.effects,
      description: item.description
    });
  });
  
  // Очистка корзины
  cart = [];
  updateCartDisplay();
  updateMoneyDisplay();
  
  alert('Покупка совершена! Товары добавлены в инвентарь.');
  
  // Изменение статистик от самого факта покупки
  window.addStat('dignity', -5);
  window.addStat('arousal', 10);
  window.addStat('submission', 2);
}

// Стили для магазина
const style = document.createElement('style');
style.textContent = `
  .store-header {
    background: rgba(255,255,255,0.1);
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
  }
  
  .store-section {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
    margin-bottom: 30px;
  }
  
  .item-card {
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 15px;
    transition: all 0.3s ease;
  }
  
  .item-card:hover {
    border-color: var(--primary-color);
    box-shadow: var(--shadow-glow);
  }
  
  .item-card.unaffordable {
    opacity: 0.6;
  }
  
  .item-card.locked {
    opacity: 0.4;
    border-color: var(--error-color);
  }
  
  .item-icon {
    font-size: 2rem;
    text-align: center;
    margin-bottom: 10px;
  }
  
  .item-info h4 {
    margin: 0 0 5px 0;
    color: var(--accent-color);
  }
  
  .item-description {
    font-size: 0.9rem;
    color: var(--text-secondary);
    margin: 5px 0;
  }
  
  .item-effects {
    margin: 10px 0;
  }
  
  .effect {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.8rem;
    margin: 2px;
  }
  
  .effect.positive {
    background: rgba(16, 185, 129, 0.2);
    color: var(--success-color);
  }
  
  .effect.negative {
    background: rgba(239, 68, 68, 0.2);
    color: var(--error-color);
  }
  
  .item-price {
    font-size: 1.2rem;
    font-weight: bold;
    color: var(--accent-color);
    margin: 10px 0;
  }
`;
document.head.appendChild(style);

// Инициализация
loadStoreItems();
</script> 