# 🛒 Продуктовый магазин "24/7"

*Небольшой круглосуточный магазин с всем необходимым. Флуоресцентные лампы гудят над рядами товаров.*

<div class="store-info">
💰 **Ваш баланс**: $<span id="money-display">{{money}}</span>  
🛒 **В корзине**: <span id="cart-total">$0</span>
</div>

## 🍎 Продукты питания

<div class="products-grid">
  <div class="product-card">
    <span class="icon">🍞</span>
    <h4>Хлеб</h4>
    <p>Обычный белый хлеб</p>
    <span class="price">$3</span>
    <button onclick="addToCart('bread', 3)">В корзину</button>
  </div>
  
  <div class="product-card">
    <span class="icon">🥛</span>
    <h4>Молоко</h4>
    <p>Литр молока</p>
    <span class="price">$4</span>
    <button onclick="addToCart('milk', 4)">В корзину</button>
  </div>
  
  <div class="product-card">
    <span class="icon">🍎</span>
    <h4>Яблоки</h4>
    <p>Килограмм яблок</p>
    <span class="price">$5</span>
    <button onclick="addToCart('apples', 5)">В корзину</button>
  </div>
  
  <div class="product-card">
    <span class="icon">🍕</span>
    <h4>Замороженная пицца</h4>
    <p>Быстрый ужин</p>
    <span class="price">$8</span>
    <button onclick="addToCart('pizza', 8)">В корзину</button>
  </div>
  
  <div class="product-card">
    <span class="icon">☕</span>
    <h4>Кофе</h4>
    <p>Растворимый кофе</p>
    <span class="price">$6</span>
    <button onclick="addToCart('coffee', 6)">В корзину</button>
  </div>
  
  <div class="product-card">
    <span class="icon">🍫</span>
    <h4>Шоколад</h4>
    <p>Плитка шоколада</p>
    <span class="price">$4</span>
    <button onclick="addToCart('chocolate', 4)">В корзину</button>
  </div>
</div>

## 🧻 Бытовые товары

<div class="products-grid">
  <div class="product-card">
    <span class="icon">🧻</span>
    <h4>Туалетная бумага</h4>
    <p>Упаковка 4 рулона</p>
    <span class="price">$6</span>
    <button onclick="addToCart('toilet_paper', 6)">В корзину</button>
  </div>
  
  <div class="product-card">
    <span class="icon">🧼</span>
    <h4>Мыло</h4>
    <p>Обычное мыло</p>
    <span class="price">$2</span>
    <button onclick="addToCart('soap', 2)">В корзину</button>
  </div>
  
  <div class="product-card">
    <span class="icon">🧴</span>
    <h4>Шампунь</h4>
    <p>Универсальный шампунь</p>
    <span class="price">$5</span>
    <button onclick="addToCart('shampoo', 5)">В корзину</button>
  </div>
  
  <div class="product-card">
    <span class="icon">🪒</span>
    <h4>Бритвенные станки</h4>
    <p>Упаковка 3 штуки</p>
    <span class="price">$8</span>
    <button onclick="addToCart('razors', 8)">В корзину</button>
  </div>
</div>

## 💊 Аптечный отдел

<div class="products-grid">
  <div class="product-card">
    <span class="icon">💊</span>
    <h4>Обезболивающее</h4>
    <p>От головной боли</p>
    <span class="price">$10</span>
    <button onclick="addToCart('painkillers', 10)">В корзину</button>
  </div>
  
  <div class="product-card">
    <span class="icon">🩹</span>
    <h4>Пластыри</h4>
    <p>Набор пластырей</p>
    <span class="price">$5</span>
    <button onclick="addToCart('bandaids', 5)">В корзину</button>
  </div>
  
  <div class="product-card">
    <span class="icon">💊</span>
    <h4>Витамины</h4>
    <p>Мультивитамины</p>
    <span class="price">$15</span>
    <button onclick="addToCart('vitamins', 15)">В корзину</button>
  </div>
  
  <div class="product-card special-item">
    <span class="icon">💊</span>
    <h4>Снотворное</h4>
    <p>Помогает заснуть</p>
    <span class="price">$20</span>
    <button onclick="addToCart('sleeping_pills', 20)">В корзину</button>
  </div>
</div>

---

<div class="checkout-section">
  <button onclick="checkout()" class="btn-primary">Оплатить покупки</button>
  <button onclick="clearCart()" class="btn-secondary">Очистить корзину</button>
</div>

[Вернуться на улицу](street)

<script>
let cart = {};
let cartTotal = 0;

function addToCart(item, price) {
  if (!cart[item]) {
    cart[item] = { count: 0, price: price };
  }
  cart[item].count++;
  updateCartDisplay();
  
  // Визуальная обратная связь
  event.target.textContent = 'Добавлено!';
  event.target.disabled = true;
  setTimeout(() => {
    event.target.textContent = 'В корзину';
    event.target.disabled = false;
  }, 500);
}

function updateCartDisplay() {
  cartTotal = 0;
  for (const item in cart) {
    cartTotal += cart[item].count * cart[item].price;
  }
  document.getElementById('cart-total').textContent = `$${cartTotal}`;
}

function clearCart() {
  cart = {};
  updateCartDisplay();
}

function checkout() {
  if (cartTotal === 0) {
    alert('Корзина пуста!');
    return;
  }
  
  const money = window.getStat('money');
  if (money < cartTotal) {
    alert(`Недостаточно денег! У вас $${money}, нужно $${cartTotal}`);
    return;
  }
  
  // Оплата
  window.addStat('money', -cartTotal);
  
  // Эффекты от покупок
  let effects = [];
  
  if (cart.bread || cart.milk || cart.apples || cart.pizza) {
    window.addStat('energy', 10);
    effects.push('Энергия +10');
  }
  
  if (cart.coffee) {
    window.addStat('energy', 5);
    window.addStat('stress', -5);
    effects.push('Бодрость от кофе');
  }
  
  if (cart.chocolate) {
    window.addStat('mood', 5);
    effects.push('Настроение +5');
  }
  
  if (cart.soap || cart.shampoo) {
    window.addStat('hygiene', 10);
    effects.push('Гигиена +10');
  }
  
  if (cart.razors) {
    // Добавляем в инвентарь
    window.addItem({
      id: 'razors_pack',
      name: 'Бритвенные станки',
      icon: '🪒',
      type: 'consumable',
      uses: 3,
      description: 'Для бритья'
    });
    effects.push('Бритвы добавлены в инвентарь');
  }
  
  if (cart.sleeping_pills) {
    window.addItem({
      id: 'sleeping_pills',
      name: 'Снотворное',
      icon: '💊',
      type: 'consumable',
      uses: 10,
      effects: { energy: 50, stress: -20 },
      description: 'Помогает быстро заснуть'
    });
    effects.push('Снотворное добавлено в инвентарь');
  }
  
  // Время на покупки
  window.tick(20);
  
  alert(`Покупки оплачены за $${cartTotal}!\n\n${effects.join('\n')}`);
  
  clearCart();
  updateMoneyDisplay();
}

function updateMoneyDisplay() {
  document.getElementById('money-display').textContent = window.getStat('money') || 0;
}

// Стили
const style = document.createElement('style');
style.textContent = `
  .store-info {
    background: rgba(255,255,255,0.1);
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
  }
  
  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
    margin: 20px 0;
  }
  
  .product-card {
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 15px;
    text-align: center;
    transition: all 0.3s ease;
  }
  
  .product-card:hover {
    border-color: var(--primary-color);
    transform: translateY(-2px);
  }
  
  .product-card .icon {
    font-size: 2rem;
    display: block;
    margin-bottom: 10px;
  }
  
  .product-card h4 {
    margin: 10px 0 5px;
    color: var(--accent-color);
  }
  
  .product-card p {
    font-size: 0.9rem;
    color: var(--text-secondary);
    margin: 5px 0;
  }
  
  .price {
    display: block;
    font-size: 1.2rem;
    font-weight: bold;
    color: var(--primary-color);
    margin: 10px 0;
  }
  
  .special-item {
    border-color: var(--accent-color);
    background: rgba(236, 72, 153, 0.1);
  }
  
  .checkout-section {
    text-align: center;
    margin: 30px 0;
  }
  
  .checkout-section button {
    margin: 0 10px;
  }
  
  .btn-primary {
    background: var(--primary-gradient);
    color: white;
    padding: 10px 30px;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    cursor: pointer;
  }
  
  .btn-secondary {
    background: transparent;
    color: var(--text-secondary);
    padding: 10px 20px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    cursor: pointer;
  }
`;
document.head.appendChild(style);

// Инициализация
updateMoneyDisplay();
</script> 