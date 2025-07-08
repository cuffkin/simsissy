// Система возбуждения и оргазмов

class ArousalSystem {
  constructor(store) {
    this.store = store;
  }

  // Проверка, надет ли пояс верности
  isChastityOn() {
    return this.store.equipped.chastity !== null;
  }

  // Получить текущий пояс верности
  getCurrentChastity() {
    return this.store.equipped.chastity;
  }

  // Расчет шанса сиссигазма
  calculateSissygasmChance() {
    const stats = this.store.stats;
    
    // Базовый шанс 5%
    let chance = 5;
    
    // Факторы, увеличивающие шанс
    // Феминизация: +0.3% за каждый пункт
    chance += Math.max(0, stats.femininity) * 0.3;
    
    // Сиссификация: +0.4% за каждый пункт
    chance += stats.sissification * 0.4;
    
    // Анальный навык: +0.5% за каждый пункт
    chance += stats.analTraining * 0.5;
    
    // Возбуждение: +0.2% за каждый пункт выше 50
    if (stats.arousal > 50) {
      chance += (stats.arousal - 50) * 0.2;
    }
    
    // Подчиненность: +0.1% за каждый пункт
    chance += Math.max(0, stats.submission) * 0.1;
    
    // Штрафы
    // Воля: -0.3% за каждый пункт
    chance -= stats.willpower * 0.3;
    
    // Достоинство: -0.2% за каждый пункт выше 0
    if (stats.dignity > 0) {
      chance -= stats.dignity * 0.2;
    }
    
    // Ограничения
    chance = Math.max(0, Math.min(95, chance)); // От 0% до 95%
    
    return chance;
  }

  // Попытка достичь оргазм
  attemptOrgasm(method = 'hand') {
    const stats = this.store.stats;
    const isChastity = this.isChastityOn();
    
    // Проверка возможности действия
    if (isChastity && method === 'hand') {
      return {
        success: false,
        reason: 'chastity_blocks_hand',
        message: 'Пояс верности не позволяет трогать себя руками!'
      };
    }
    
    // Минимальное возбуждение для попытки
    if (stats.arousal < 30) {
      return {
        success: false,
        reason: 'low_arousal',
        message: 'Вы недостаточно возбуждены для этого.'
      };
    }
    
    let orgasmChance = 0;
    let orgasmType = 'normal';
    
    // Расчет шанса в зависимости от метода
    switch (method) {
      case 'hand':
        // Обычный оргазм руками (только без пояса)
        orgasmChance = 80 + (stats.arousal - 50) * 0.5;
        break;
        
      case 'dildo':
        // Попытка сиссигазма с дилдо
        orgasmType = 'sissygasm';
        orgasmChance = this.calculateSissygasmChance();
        break;
        
      case 'vibrator':
        // Вибратор на поясе - гарантированный оргазм
        if (isChastity) {
          orgasmChance = 95;
          orgasmType = 'vibrator_cage';
        } else {
          orgasmChance = 90;
          orgasmType = 'vibrator';
        }
        break;
        
      case 'anal_toy':
        // Анальные игрушки
        orgasmType = 'sissygasm';
        orgasmChance = this.calculateSissygasmChance() * 0.8; // Чуть меньше чем с дилдо
        break;
    }
    
    // Бросок кубика
    const roll = Math.random() * 100;
    const success = roll < orgasmChance;
    
    if (success) {
      // Эффекты оргазма
      this.applyOrgasmEffects(orgasmType);
      
      return {
        success: true,
        type: orgasmType,
        chance: orgasmChance,
        roll: roll
      };
    } else {
      // Неудача - только повышение возбуждения
      this.store.addStat('arousal', 10);
      this.store.addStat('stress', 5);
      
      return {
        success: false,
        reason: 'failed_attempt',
        chance: orgasmChance,
        roll: roll,
        message: orgasmType === 'sissygasm' 
          ? 'Вы близки, но сиссигазм ускользает от вас...' 
          : 'Не получается достичь разрядки...'
      };
    }
  }

  // Применить эффекты оргазма
  applyOrgasmEffects(type) {
    const stats = this.store.stats;
    
    switch (type) {
      case 'normal':
        // Обычный мужской оргазм
        this.store.setStat('arousal', 0);
        this.store.addStat('energy', -20);
        this.store.addStat('mood', 15);
        this.store.addStat('stress', -25);
        this.store.addStat('dignity', -2);
        break;
        
      case 'sissygasm':
        // Сиссигазм - более сильные эффекты
        this.store.setStat('arousal', 0);
        this.store.addStat('energy', -30);
        this.store.addStat('mood', 30);
        this.store.addStat('stress', -40);
        this.store.addStat('submission', 5);
        this.store.addStat('sissification', 3);
        this.store.addStat('dignity', -10);
        this.store.addStat('femininity', 2);
        // Бонус к анальному навыку
        this.store.addStat('analTraining', 2);
        break;
        
      case 'vibrator':
        // Оргазм от вибратора
        this.store.setStat('arousal', 0);
        this.store.addStat('energy', -15);
        this.store.addStat('mood', 20);
        this.store.addStat('stress', -30);
        this.store.addStat('submission', 2);
        break;
        
      case 'vibrator_cage':
        // Оргазм в поясе от вибратора - унизительный
        this.store.setStat('arousal', 0);
        this.store.addStat('energy', -25);
        this.store.addStat('mood', 25);
        this.store.addStat('stress', -35);
        this.store.addStat('submission', 8);
        this.store.addStat('sissification', 5);
        this.store.addStat('dignity', -15);
        break;
    }
    
    // Установить время кулдауна
    this.store.flags.lastOrgasmTime = this.store.time.day * 1440 + this.store.time.minutes;
    this.store.flags.lastOrgasmType = type;
  }

  // Проверка доступности действий при высоком возбуждении
  checkArousalBlocks() {
    const arousal = this.store.stats.arousal;
    const blocks = [];
    
    if (arousal >= 80) {
      blocks.push({
        action: 'study',
        reason: 'Вы слишком возбуждены, чтобы сосредоточиться на учебе'
      });
      blocks.push({
        action: 'work_complex',
        reason: 'Невозможно выполнять сложную работу в таком состоянии'
      });
    }
    
    if (arousal >= 90) {
      blocks.push({
        action: 'social',
        reason: 'Вы не можете нормально общаться, думая только об одном'
      });
      blocks.push({
        action: 'shopping',
        reason: 'В таком возбужденном состоянии лучше не появляться в магазине'
      });
    }
    
    if (arousal === 100) {
      blocks.push({
        action: 'any_complex',
        reason: 'Вы не можете думать ни о чем, кроме облегчения!'
      });
    }
    
    return blocks;
  }

  // Случайные события при высоком возбуждении
  checkArousalEvents() {
    const arousal = this.store.stats.arousal;
    const events = [];
    
    if (arousal >= 70) {
      // 10% шанс непроизвольного возбуждения
      if (Math.random() < 0.1) {
        events.push({
          id: 'arousal_spike',
          scene: 'arousal_spike_event',
          priority: 1
        });
      }
    }
    
    if (arousal >= 85) {
      // 15% шанс фантазий
      if (Math.random() < 0.15) {
        events.push({
          id: 'lewd_fantasy',
          scene: 'lewd_fantasy_event',
          priority: 2
        });
      }
    }
    
    if (arousal >= 95) {
      // 25% шанс срочной необходимости
      if (Math.random() < 0.25) {
        events.push({
          id: 'desperate_need',
          scene: 'desperate_need_event',
          priority: 3
        });
      }
    }
    
    return events.sort((a, b) => b.priority - a.priority);
  }

  // Пассивное накопление возбуждения
  passiveArousalGain(minutes) {
    const stats = this.store.stats;
    const isChastity = this.isChastityOn();
    
    let gain = 0;
    
    // Базовое накопление
    gain += minutes * 0.01;
    
    // Модификаторы
    if (isChastity) {
      gain += minutes * 0.03; // +0.03 за минуту в поясе
    }
    
    if (stats.femininity > 50) {
      gain += minutes * 0.01; // Женственность повышает возбуждение
    }
    
    if (stats.submission > 30) {
      gain += minutes * 0.005; // Подчиненность тоже
    }
    
    // Надетые вещи
    const equipped = this.store.equipped;
    if (equipped.underwear?.id?.includes('panties')) {
      gain += minutes * 0.01;
    }
    
    if (equipped.accessories?.id?.includes('collar')) {
      gain += minutes * 0.01;
    }
    
    // Применить накопление
    if (gain > 0) {
      this.store.addStat('arousal', gain);
    }
  }
}

export default ArousalSystem; 