# 🏥 Городская больница

*Современное медицинское учреждение с запахом дезинфектантов и белыми коридорами. У стойки регистрации сидит приветливая медсестра.*

<div class="location-info">
📍 **Локация**: Больница  
⏰ **Время работы**: Круглосуточно  
💰 **Ваш баланс**: $<span id="money-display">{{money}}</span>
</div>

## 🏥 Медицинские услуги

### 💊 Общая медицина
- **Осмотр врача** - $50
  - Проверка здоровья, лечение болезней
  - <button onclick="goToService('general_checkup')">Записаться</button>

- **Экстренная помощь** - $200
  - Быстрое восстановление здоровья и энергии
  - <button onclick="goToService('emergency')">Получить помощь</button>

### 💉 Пластическая хирургия

<div id="surgery-options">
<!-- Опции операций будут загружены динамически -->
</div>

### 💊 Гормональная терапия

<div id="hormone-options">
<!-- Опции гормонов будут загружены динамически -->
</div>

### 🏪 Аптека
- Покупка лекарств и препаратов
- <button onclick="goToService('pharmacy')">Перейти в аптеку</button>

---

### 💼 Работа в больнице
<div id="job-section">
<p class="hint">*Возможность работать появится позже*</p>
</div>

---

[Вернуться на улицу](street)

<script>
// Загрузка опций операций
function loadSurgeryOptions() {
  const container = document.getElementById('surgery-options');
  const bodySystem = window.store.body || {};
  
  const surgeries = [
    {
      id: 'breast_augmentation',
      name: 'Увеличение груди',
      description: `Текущий размер: ${getBreastSize()}`,
      price: 5000,
      requirements: { money: 5000 },
      disabled: bodySystem.breastSize >= 6
    },
    {
      id: 'breast_reduction',
      name: 'Уменьшение груди',
      description: 'Уменьшить размер груди',
      price: 4000,
      requirements: { money: 4000, breastSize: 1 },
      disabled: bodySystem.breastSize <= 0
    },
    {
      id: 'butt_augmentation',
      name: 'Увеличение ягодиц',
      description: `Текущий размер: ${getButtSize()}`,
      price: 4500,
      requirements: { money: 4500 },
      disabled: bodySystem.buttSize >= 5
    },
    {
      id: 'facial_feminization',
      name: 'Феминизация лица',
      description: 'Сделать черты лица более женственными',
      price: 8000,
      requirements: { money: 8000 },
      disabled: bodySystem.faceShape >= 3
    },
    {
      id: 'lip_filler',
      name: 'Увеличение губ',
      description: 'Сделать губы более пухлыми',
      price: 2000,
      requirements: { money: 2000 },
      disabled: bodySystem.lips >= 3
    },
    {
      id: 'laser_hair_removal',
      name: 'Лазерная эпиляция',
      description: 'Удаление волос на теле',
      price: 3000,
      requirements: { money: 3000 },
      disabled: bodySystem.bodyHair <= 0
    }
  ];
  
  container.innerHTML = surgeries.map(surgery => {
    const canAfford = window.getStat('money') >= surgery.price;
    const meetsRequirements = checkSurgeryRequirements(surgery.requirements);
    const isDisabled = surgery.disabled || !canAfford || !meetsRequirements;
    
    return `
      <div class="surgery-card ${!canAfford ? 'unaffordable' : ''} ${surgery.disabled ? 'maxed' : ''}">
        <h4>${surgery.name}</h4>
        <p>${surgery.description}</p>
        <p class="price">Цена: $${surgery.price}</p>
        <button 
          onclick="performSurgery('${surgery.id}')" 
          ${isDisabled ? 'disabled' : ''}
        >
          ${surgery.disabled ? 'Максимум достигнут' : !canAfford ? 'Недостаточно денег' : 'Сделать операцию'}
        </button>
      </div>
    `;
  }).join('');
}

// Загрузка опций гормонов
function loadHormoneOptions() {
  const container = document.getElementById('hormone-options');
  
  const hormones = [
    {
      id: 'estrogen',
      name: 'Эстроген',
      description: 'Женские гормоны для феминизации тела',
      price: 200,
      duration: 30,
      effects: 'Увеличение груди, бедер, уменьшение мышц'
    },
    {
      id: 'antiandrogen',
      name: 'Антиандрогены',
      description: 'Блокаторы мужских гормонов',
      price: 150,
      duration: 30,
      effects: 'Уменьшение размера члена, снижение либидо'
    },
    {
      id: 'testosterone',
      name: 'Тестостерон',
      description: 'Мужские гормоны',
      price: 180,
      duration: 30,
      effects: 'Увеличение мышц, рост волос на теле'
    }
  ];
  
  container.innerHTML = hormones.map(hormone => {
    const canAfford = window.getStat('money') >= hormone.price;
    
    return `
      <div class="hormone-card ${!canAfford ? 'unaffordable' : ''}">
        <h4>${hormone.name}</h4>
        <p>${hormone.description}</p>
        <p class="effects">Эффекты: ${hormone.effects}</p>
        <p class="duration">Курс: ${hormone.duration} дней</p>
        <p class="price">Цена: $${hormone.price}</p>
        <button 
          onclick="buyHormones('${hormone.id}')" 
          ${!canAfford ? 'disabled' : ''}
        >
          ${!canAfford ? 'Недостаточно денег' : 'Купить курс'}
        </button>
      </div>
    `;
  }).join('');
}

// Получение описаний размеров
function getBreastSize() {
  const sizes = ['плоская', 'A', 'B', 'C', 'D', 'DD', 'E+'];
  return sizes[window.store.body?.breastSize || 0];
}

function getButtSize() {
  const sizes = ['плоская', 'маленькая', 'средняя', 'пузырьком', 'большая', 'огромная'];
  return sizes[window.store.body?.buttSize || 2];
}

// Проверка требований для операции
function checkSurgeryRequirements(requirements) {
  for (const [stat, value] of Object.entries(requirements)) {
    if (stat === 'breastSize' && (!window.store.body || window.store.body.breastSize < value)) {
      return false;
    }
    if (stat !== 'money' && window.getStat(stat) < value) {
      return false;
    }
  }
  return true;
}

// Выполнение операции
async function performSurgery(surgeryId) {
  const surgeryData = {
    breast_augmentation: {
      cost: 5000,
      recovery: 7,
      bodyChanges: { breastSize: 1 },
      message: 'Операция прошла успешно! Размер груди увеличен.'
    },
    breast_reduction: {
      cost: 4000,
      recovery: 5,
      bodyChanges: { breastSize: -1 },
      message: 'Операция прошла успешно! Размер груди уменьшен.'
    },
    butt_augmentation: {
      cost: 4500,
      recovery: 5,
      bodyChanges: { buttSize: 1 },
      message: 'Операция прошла успешно! Ягодицы стали больше.'
    },
    facial_feminization: {
      cost: 8000,
      recovery: 10,
      bodyChanges: { faceShape: 1, lips: 1 },
      message: 'Операция прошла успешно! Лицо стало более женственным.'
    },
    lip_filler: {
      cost: 2000,
      recovery: 2,
      bodyChanges: { lips: 1 },
      message: 'Процедура завершена! Губы стали более пухлыми.'
    },
    laser_hair_removal: {
      cost: 3000,
      recovery: 1,
      bodyChanges: { bodyHair: -1 },
      message: 'Процедура завершена! Волосы на теле удалены.'
    }
  };
  
  const surgery = surgeryData[surgeryId];
  if (!surgery) return;
  
  if (!confirm(`Сделать операцию за $${surgery.cost}? Восстановление займет ${surgery.recovery} дней.`)) {
    return;
  }
  
  // Оплата
  window.addStat('money', -surgery.cost);
  
  // Применение изменений к телу
  const BodySystem = (await import('../systems/BodySystem.js')).default;
  const bodySystem = new BodySystem(window.store);
  
  for (const [part, change] of Object.entries(surgery.bodyChanges)) {
    bodySystem.modifyBodyPart(part, change);
  }
  
  // Эффекты восстановления
  window.addStat('health', -30);
  window.addStat('energy', -50);
  window.addStat('stress', 20);
  
  alert(surgery.message);
  
  // Обновление отображения
  loadSurgeryOptions();
  updateMoneyDisplay();
}

// Покупка гормонов
async function buyHormones(hormoneId) {
  const hormoneData = {
    estrogen: { cost: 200, name: 'Эстроген' },
    antiandrogen: { cost: 150, name: 'Антиандрогены' },
    testosterone: { cost: 180, name: 'Тестостерон' }
  };
  
  const hormone = hormoneData[hormoneId];
  if (!hormone) return;
  
  if (!confirm(`Купить месячный курс ${hormone.name} за $${hormone.cost}?`)) {
    return;
  }
  
  // Оплата
  window.addStat('money', -hormone.cost);
  
  // Добавление в инвентарь
  window.addItem({
    id: `hormone_${hormoneId}`,
    name: `${hormone.name} (30 дней)`,
    icon: '💊',
    type: 'consumable',
    uses: 30,
    effects: { hormone: hormoneId },
    description: `Курс гормональной терапии`
  });
  
  alert(`Вы купили курс ${hormone.name}. Принимайте по одной таблетке в день.`);
  updateMoneyDisplay();
}

// Переход к услуге
function goToService(service) {
  window.location.search = `?scene=hospital_${service}`;
}

// Обновление отображения денег
function updateMoneyDisplay() {
  document.getElementById('money-display').textContent = window.getStat('money') || 0;
}

// Стили
const style = document.createElement('style');
style.textContent = `
  .location-info {
    background: rgba(255,255,255,0.1);
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  
  .surgery-card, .hormone-card {
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 15px;
    margin: 10px 0;
    transition: all 0.3s ease;
  }
  
  .surgery-card:hover, .hormone-card:hover {
    border-color: var(--primary-color);
    box-shadow: var(--shadow-glow);
  }
  
  .surgery-card.unaffordable, .hormone-card.unaffordable {
    opacity: 0.6;
  }
  
  .surgery-card.maxed {
    opacity: 0.4;
    border-color: var(--success-color);
  }
  
  .price {
    color: var(--accent-color);
    font-weight: bold;
    font-size: 1.1rem;
  }
  
  .effects {
    color: var(--text-secondary);
    font-style: italic;
  }
  
  .duration {
    color: var(--primary-color);
  }
  
  .hint {
    color: var(--text-secondary);
    font-style: italic;
  }
  
  #surgery-options, #hormone-options {
    margin: 20px 0;
  }
`;
document.head.appendChild(style);

// Инициализация
loadSurgeryOptions();
loadHormoneOptions();
updateMoneyDisplay();
</script> 