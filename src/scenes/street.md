# Улица

*Вы находитесь на оживленной городской улице. Вокруг снуют прохожие, машины проезжают мимо. Куда вы направитесь?*

## 🏢 Места поблизости:

### 🏠 Жилье
- [Вернуться домой](home_routine) - Ваша квартира

### 🛍️ Магазины
- [Торговый центр](shopping_mall) - Множество магазинов под одной крышей
- [Продуктовый магазин](grocery_store) - Купить еду и предметы первой необходимости

### 🏥 Услуги
- [Городская больница](hospital) - Медицинские услуги, операции, гормоны

### 💼 Работа
- [Офисное здание](office_building) - Поискать работу
- [Клуб "Розовая пантера"](pink_panther_club) - Ночной клуб (работа доступна вечером)

### 🎭 Развлечения
- [Парк](city_park) - Прогуляться, расслабиться
- [Спортзал](gym) - Заняться спортом
- [Кинотеатр](cinema) - Посмотреть фильм

### 🌃 Ночная жизнь
<div id="nightlife-section">
<!-- Будет показано только вечером -->
</div>

---

<div class="time-weather">
🕐 **Время**: {{timeString}}  
🌤️ **Погода**: {{weather}}
</div>

<script>
// Проверка времени для ночных заведений
function checkNightlife() {
  const hours = Math.floor(window.store.time.minutes / 60);
  const container = document.getElementById('nightlife-section');
  
  if (hours >= 20 || hours < 4) {
    container.innerHTML = `
      <p><em>Ночные заведения открыты:</em></p>
      <ul>
        <li><a href="?scene=nightclub">Ночной клуб "Неон"</a> - Танцы и веселье</li>
        <li><a href="?scene=red_light_district">Район красных фонарей</a> - <span class="warning">18+</span></li>
      </ul>
    `;
  }
}

// Проверка внешности для реакций прохожих
async function checkAppearanceReactions() {
  const BodySystem = (await import('../systems/BodySystem.js')).default;
  const bodySystem = new BodySystem(window.store);
  const femininity = bodySystem.calculateBodyFemininity();
  
  // Случайные реакции на внешность
  if (Math.random() < 0.2) { // 20% шанс
    if (femininity > 80 && window.store.body.breastSize >= 3) {
      showReaction('Прохожий мужчина оборачивается вам вслед, явно заинтересованный.');
    } else if (femininity > 60 && window.getStat('femininity') < 40) {
      showReaction('Какая-то женщина странно на вас посмотрела, будто что-то не так.');
    } else if (window.store.equipped.chastity && window.store.equipped.lower?.id?.includes('skirt')) {
      showReaction('Вы нервничаете, что кто-то может заметить очертания клетки под юбкой.');
    }
  }
}

function showReaction(text) {
  const reaction = document.createElement('div');
  reaction.className = 'street-reaction';
  reaction.innerHTML = `<p><em>${text}</em></p>`;
  document.querySelector('.time-weather').after(reaction);
}

// Стили
const style = document.createElement('style');
style.textContent = `
  .time-weather {
    background: rgba(255,255,255,0.1);
    padding: 10px;
    border-radius: 8px;
    margin-top: 20px;
    text-align: center;
  }
  
  .street-reaction {
    background: rgba(236, 72, 153, 0.1);
    border: 1px solid var(--primary-color);
    border-radius: 8px;
    padding: 10px;
    margin: 15px 0;
    font-style: italic;
    animation: fadeIn 0.5s ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .warning {
    color: var(--error-color);
  }
  
  #nightlife-section {
    margin-top: 15px;
  }
`;
document.head.appendChild(style);

// Инициализация
checkNightlife();
checkAppearanceReactions();
</script> 