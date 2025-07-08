# Торговый центр "Розовая мечта"

*Вы находитесь в современном торговом центре. Яркие витрины манят покупателей, а мягкая музыка создает расслабленную атмосферу.*

<div class="location-info">
📍 **Локация**: Торговый центр  
⏰ **Время работы**: 10:00 - 22:00  
💰 **Ваши деньги**: $<span id="player-money">{{money}}</span>
</div>

## 🏬 Магазины:

### 👔 "Мужской стиль"
*Классический магазин мужской одежды. Строгие костюмы, повседневная одежда и базовое белье.*

<button onclick="goToStore('mens_clothing')">Войти в магазин</button>

---

### 👗 "Леди Шик"
*Женская одежда на любой вкус. От повседневных нарядов до вечерних платьев.*

<button onclick="goToStore('womens_clothing')" id="womens-store-btn">Войти в магазин</button>

---

### 💻 "ТехноМир"
*Электроника, гаджеты и развлечения. Здесь можно найти что-то интересное...*

<button onclick="goToStore('electronics')">Войти в магазин</button>

---

### 🔞 "Тайные желания"
*Магазин для взрослых. Витрины затемнены, но внутри большой выбор... специальных товаров.*

<button onclick="goToStore('adult_shop')" id="adult-store-btn">Войти в магазин</button>

---

### 🚶 Другие места:

- [Вернуться на улицу](street)
- [Пойти в туалет](mall_restroom)
- [Посидеть в кафе](mall_cafe)

<script>
// Проверка доступности магазинов
function checkStoreAccess() {
  const femininity = window.getStat('femininity');
  const dignity = window.getStat('dignity');
  const arousal = window.getStat('arousal');
  
  // Женский магазин
  const womensBtn = document.getElementById('womens-store-btn');
  if (femininity < 10 && dignity > 50) {
    womensBtn.disabled = true;
    womensBtn.textContent = 'Слишком стыдно заходить';
  }
  
  // Секс-шоп
  const adultBtn = document.getElementById('adult-store-btn');
  if (dignity > 70) {
    adultBtn.disabled = true;
    adultBtn.textContent = 'Вы не можете заставить себя войти';
  }
  
  // Блокировка при высоком возбуждении
  if (arousal >= 90) {
    alert('Вы слишком возбуждены, чтобы спокойно делать покупки!');
    window.location.search = '?scene=mall_restroom';
  }
}

function goToStore(storeType) {
  // Проверка времени
  const time = window.store.time;
  const hours = Math.floor(time.minutes / 60);
  
  if (hours < 10 || hours >= 22) {
    alert('Магазин закрыт! Приходите с 10:00 до 22:00');
    return;
  }
  
  // Переход в магазин
  window.location.search = `?scene=${storeType}_store`;
}

// Обновление денег
function updateMoney() {
  const moneySpan = document.getElementById('player-money');
  if (moneySpan) {
    moneySpan.textContent = window.getStat('money') || 0;
  }
}

// Инициализация
checkStoreAccess();
updateMoney();
</script> 