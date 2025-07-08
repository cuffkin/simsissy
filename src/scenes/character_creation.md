# Создание персонажа

*Добро пожаловать в ваше путешествие самопознания! Выберите стартовый профиль, который лучше всего отражает вашу отправную точку.*

> Каждый профиль дает уникальные преимущества, недостатки и стартовые предметы. Выбор влияет на то, как начнется ваша история.

---

## 🎭 Выберите свой стартовый профиль:

<div id="preset-selection">

### 🤓 Ботаник
**Плюсы:** Высокий интеллект, быстрое обучение, хорошая сила воли  
**Минусы:** Слабое здоровье, социальная тревожность, низкая гигиена  
**Особенности:** Очки, книги по программированию, доступ к компьютеру

<button onclick="selectPreset('nerd')">Выбрать Ботаника</button>

---

### 💎 Мажор  
**Плюсы:** Много денег, отличное здоровье, социальные навыки, собственная квартира  
**Минусы:** Слабая воля, низкая энергия, восприимчивость к коррупции  
**Особенности:** Смартфон, кредитка, дизайнерская одежда, карманные деньги

<button onclick="selectPreset('rich')">Выбрать Мажора</button>

---

### 💃 Кроссдрессер  
**Плюсы:** Начальная феминизация, опыт в переодевании, доступ к сообществам  
**Минусы:** Повышенный стресс, сниженная воля и достоинство  
**Особенности:** Женское белье, косметика, секретность, тренировочные игрушки

<button onclick="selectPreset('crossdresser')">Выбрать Кроссдрессера</button>

---

### 💪 Спортсмен  
**Плюсы:** Отличное здоровье, высокая энергия и сила воли, низкий стресс  
**Минусы:** Очень маскулинный, труднее поддается феминизации  
**Особенности:** Абонемент в спортзал, спортивное питание, дисциплина

<button onclick="selectPreset('athlete')">Выбрать Спортсмена</button>

---

### 😐 Обычный  
**Плюсы:** Сбалансированная отправная точка без крайностей  
**Минусы:** Никаких особых преимуществ  
**Особенности:** Стандартные характеристики для экспериментирования

<button onclick="selectPreset('default')">Выбрать Обычного</button>

</div>

---

<div id="preset-details" style="display:none">
<div id="preset-info">
<!-- Информация о выбранном пресете появится здесь -->
</div>

### ✨ Последние настройки:

<div id="step-name">
**Как вас зовут?**
<br>
<input id="charName" type="text" placeholder="Введите ваше имя"> 
<button onclick="confirmName()">Подтвердить</button>
</div>

<div id="step-pronoun" style="display:none">
**Какие местоимения предпочитаете?**
<br>
<button onclick="setPronoun('he')">Он/его</button>
<button onclick="setPronoun('they')">Они/их</button>
<button onclick="setPronoun('she')">Она/её</button>
</div>

<div id="finish" style="display:none">
<h2>🎉 Персонаж создан!</h2>

<div id="character-summary">
<!-- Итоговая информация о персонаже -->
</div>

<button onclick="startGame()" class="btn">Начать игру!</button>
</div>

</div>

<script>
let selectedPreset = null;

// Импортируем пресеты (это упрощенная версия для Markdown)
const PRESETS = {
  nerd: { name: 'Ботаник', emoji: '🤓' },
  rich: { name: 'Мажор', emoji: '💎' }, 
  crossdresser: { name: 'Кроссдрессер', emoji: '💃' },
  athlete: { name: 'Спортсмен', emoji: '💪' },
  default: { name: 'Обычный', emoji: '😐' }
};

function selectPreset(presetId) {
  selectedPreset = presetId;
  const preset = PRESETS[presetId];
  
  document.getElementById('preset-details').style.display = 'block';
  document.getElementById('preset-info').innerHTML = `
    <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
      <h3>${preset.emoji} Выбран: ${preset.name}</h3>
      <p>Отличный выбор! Теперь давайте завершим создание персонажа.</p>
    </div>
  `;
  
  // Применяем пресет через глобальную функцию
  if (window.applyCharacterPreset) {
    window.applyCharacterPreset(presetId);
  }
  
  // Прокручиваем к следующему шагу
  document.getElementById('step-name').scrollIntoView({ behavior: 'smooth' });
}

function confirmName() {
  const name = document.getElementById('charName').value.trim();
  if (!name) {
    alert('Пожалуйста, введите имя');
    return;
  }
  
  window.setFlag('name', name);
  document.getElementById('step-name').style.display = 'none';
  document.getElementById('step-pronoun').style.display = 'block';
  document.getElementById('step-pronoun').scrollIntoView({ behavior: 'smooth' });
}

function setPronoun(pronoun) {
  window.setFlag('pronoun', pronoun);
  
  document.getElementById('step-pronoun').style.display = 'none';
  
  // Создаем итоговую информацию
  const name = window.getFlag('name');
  const preset = PRESETS[selectedPreset];
  
  document.getElementById('character-summary').innerHTML = `
    <div style="background: rgba(16, 185, 129, 0.1); padding: 20px; border-radius: 8px; border: 1px solid #10b981;">
      <h3>✅ Ваш персонаж готов:</h3>
      <p><strong>Имя:</strong> ${name}</p>
      <p><strong>Профиль:</strong> ${preset.emoji} ${preset.name}</p>
      <p><strong>Местоимения:</strong> ${pronoun}</p>
    </div>
  `;
  
  document.getElementById('finish').style.display = 'block';
  document.getElementById('finish').scrollIntoView({ behavior: 'smooth' });
}

function startGame() {
  // Сохраняем игру и переходим к началу
  window.saveGame();
  window.location.search = '?scene=start';
}
</script> 