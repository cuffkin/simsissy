import store from '../systems/store.js';

class UIManager {
  constructor() {
    this.activeModal = null;
    this.settings = this.loadSettings();
    this.setupEventListeners();
    this.applySettings();
  }

  setupEventListeners() {
    // Main menu toggle
    const menuBtn = document.getElementById('main-menu-btn');
    const menu = document.getElementById('main-menu');
    
    if (menuBtn && menu) {
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('active');
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !menuBtn.contains(e.target)) {
          menu.classList.remove('active');
        }
      });
    }

    // Menu actions
    document.addEventListener('click', (e) => {
      const menuItem = e.target.closest('.dropdown-item');
      if (menuItem) {
        const action = menuItem.dataset.action;
        this.handleMenuAction(action);
        document.getElementById('main-menu').classList.remove('active');
      }
    });

    // Modal controls
    document.addEventListener('click', (e) => {
      // Close button
      if (e.target.matches('[data-close]')) {
        const modalId = e.target.dataset.close;
        this.closeModal(modalId);
      }

      // Modal overlay click
      if (e.target.matches('.modal-overlay')) {
        this.closeModal(e.target.id);
      }

      // Stats expand buttons
      if (e.target.matches('[data-stats]')) {
        const statsType = e.target.dataset.stats;
        this.showStatsModal(statsType);
      }

      // Inventory button
      if (e.target.closest('#inventory-btn')) {
        this.showInventoryModal();
      }
    });

    // Escape key to close modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        this.closeModal(this.activeModal);
      }
    });
  }

  handleMenuAction(action) {
    switch (action) {
      case 'new-game':
        this.startNewGame();
        break;
      case 'settings':
        this.showSettingsModal();
        break;
      case 'save':
        this.saveGame();
        break;
      case 'load':
        this.loadGame();
        break;
      case 'export':
        this.exportSave();
        break;
      case 'import':
        this.importSave();
        break;
      case 'stuck':
        this.helpStuck();
        break;
    }
  }

  showModal(modalId) {
    this.closeModal(this.activeModal); // Close any existing modal
    
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      this.activeModal = modalId;
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal(modalId) {
    if (!modalId) return;
    
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      
      if (this.activeModal === modalId) {
        this.activeModal = null;
      }
    }
  }

  showInventoryModal() {
    this.populateInventoryModal();
    this.showModal('inventory-modal');
  }

  populateInventoryModal() {
    // Equipment slots
    const equipmentContainer = document.getElementById('modal-equipment-slots');
    const inventoryContainer = document.getElementById('modal-inventory-grid');
    
    if (equipmentContainer) {
      const slots = [
        { id: 'hair', name: 'Волосы', icon: '💇' },
        { id: 'upper', name: 'Верх', icon: '👚' },
        { id: 'lower', name: 'Низ', icon: '👖' },
        { id: 'underwear', name: 'Бельё', icon: '👙' },
        { id: 'shoes', name: 'Обувь', icon: '👠' },
        { id: 'accessories', name: 'Аксессуары', icon: '💍' }
      ];

      equipmentContainer.innerHTML = slots.map(slot => {
        const equipped = store.equipped[slot.id];
        const isEquipped = equipped ? 'equipped' : '';
        
        return `
          <div class="equipment-slot ${isEquipped}" data-slot="${slot.id}">
            <div class="equipment-slot-icon">${slot.icon}</div>
            <div class="equipment-slot-name">${slot.name}</div>
            ${equipped ? `<div class="equipment-item-name">${equipped.name}</div>` : ''}
          </div>
        `;
      }).join('');
    }

    // Inventory items
    if (inventoryContainer) {
      if (store.inventory.length === 0) {
        inventoryContainer.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary); padding: 20px;">
            Инвентарь пуст
          </div>
        `;
      } else {
        inventoryContainer.innerHTML = store.inventory.map(item => `
          <div class="inventory-slot" data-item-id="${item.id}">
            <div class="inventory-item">
              <div class="inventory-item-icon">${item.icon || '📦'}</div>
              <div class="inventory-item-name">${item.name}</div>
            </div>
          </div>
        `).join('');
      }
    }
  }

  showStatsModal(type) {
    this.populateStatsModal(type);
    this.showModal('stats-modal');
  }

  populateStatsModal(type) {
    const title = document.getElementById('stats-modal-title');
    const content = document.getElementById('stats-modal-content');
    
    if (!title || !content) return;

    let stats;
    let titleText;

    if (type === 'character') {
      titleText = 'Статистика персонажа';
      stats = [
        { id: 'health', name: 'Здоровье', icon: '💚', description: 'Физическое состояние. Влияет на доступность действий.' },
        { id: 'energy', name: 'Энергия', icon: '⚡', description: 'Запас сил на день. Восстанавливается сном.' },
        { id: 'mood', name: 'Настроение', icon: '😊', description: 'Эмоциональное состояние. Влияет на проверки воли.' },
        { id: 'stress', name: 'Стресс', icon: '😰', description: 'Нервное напряжение. Высокий стресс вреден.' },
        { id: 'arousal', name: 'Возбуждение', icon: '🔥', description: 'Сексуальное возбуждение. Влияет на поведение.' },
        { id: 'hygiene', name: 'Гигиена', icon: '🛁', description: 'Чистота тела. Необходима для социальных взаимодействий.' },
        { id: 'willpower', name: 'Воля', icon: '💪', description: 'Сопротивление принуждению и соблазнам.' }
      ];
    } else if (type === 'fetish') {
      titleText = 'Фетиш статистики';
      stats = [
        { id: 'femininity', name: 'Женственность', icon: '👗', description: 'Внешний и внутренний гендерный образ.' },
        { id: 'dignity', name: 'Достоинство', icon: '👑', description: 'Чувство собственного достоинства.' },
        { id: 'submission', name: 'Подчинённость', icon: '🔗', description: 'Склонность к подчинению.' },
        { id: 'sissification', name: 'Сиссификация', icon: '💄', description: 'Принятие сисси-идентичности.' },
        { id: 'bimbofication', name: 'Бимбо-индекс', icon: '💋', description: 'Смена ментального образа на "бимбо".' },
        { id: 'analTraining', name: 'Анал-тренинг', icon: '🍑', description: 'Комфорт и растяжимость.' }
      ];
    }

    title.textContent = titleText;
    
    content.innerHTML = stats.map(stat => {
      const value = Math.round(store.stats[stat.id] || 0); // Округляем до целого
      const rank = store.getStatRank(stat.id);
      const rankNames = ['Очень низкий', 'Низкий', 'Средний', 'Высокий', 'Очень высокий'];
      
      return `
        <div class="stat-detailed">
          <div class="stat-detailed-header">
            <span class="stat-icon">${stat.icon}</span>
            <span class="stat-name">${stat.name}</span>
            <span class="stat-value">${value}</span>
          </div>
          <div class="stat-description">${stat.description}</div>
          <div class="stat-rank-info">Ранг: ${rankNames[rank]} (${rank}/4)</div>
        </div>
      `;
    }).join('');
  }

  showSettingsModal() {
    this.populateSettingsModal();
    this.showModal('settings-modal');
  }

  populateSettingsModal() {
    const content = document.getElementById('settings-modal-content');
    if (!content) return;

    content.innerHTML = `
      <div class="settings-group">
        <h3>Отображение</h3>
        
        <div class="setting-item">
          <label for="font-family">Шрифт:</label>
          <select id="font-family">
            <option value="system">Системный</option>
            <option value="serif">С засечками</option>
            <option value="monospace">Моноширинный</option>
          </select>
        </div>
        
        <div class="setting-item">
          <label for="font-size">Размер шрифта:</label>
          <select id="font-size">
            <option value="small">Маленький</option>
            <option value="medium">Средний</option>
            <option value="large">Большой</option>
            <option value="extra-large">Очень большой</option>
          </select>
        </div>
        
        <div class="setting-item">
          <label for="theme">Тема:</label>
          <select id="theme">
            <option value="dark">Тёмная</option>
            <option value="light">Светлая</option>
            <option value="auto">Авто</option>
          </select>
        </div>
      </div>
      
      <div class="settings-group">
        <h3>Геймплей</h3>
        
        <div class="setting-item">
          <label for="auto-save">
            <input type="checkbox" id="auto-save">
            Автосохранение
          </label>
        </div>
        
        <div class="setting-item">
          <label for="confirm-choices">
            <input type="checkbox" id="confirm-choices">
            Подтверждать важные выборы
          </label>
        </div>
        
        <div class="setting-item">
          <label for="show-stats-changes">
            <input type="checkbox" id="show-stats-changes">
            Показывать изменения статистик
          </label>
        </div>
      </div>
      
      <div class="settings-group">
        <h3>Уведомления</h3>
        
        <div class="setting-item">
          <label for="sound-effects">
            <input type="checkbox" id="sound-effects">
            Звуковые эффекты
          </label>
        </div>
      </div>
    `;

    // Set current values
    document.getElementById('font-family').value = this.settings.fontFamily || 'system';
    document.getElementById('font-size').value = this.settings.fontSize || 'medium';
    document.getElementById('theme').value = this.settings.theme || 'dark';
    document.getElementById('auto-save').checked = this.settings.autoSave !== false;
    document.getElementById('confirm-choices').checked = this.settings.confirmChoices !== false;
    document.getElementById('show-stats-changes').checked = this.settings.showStatsChanges !== false;
    document.getElementById('sound-effects').checked = this.settings.soundEffects === true;

    // Save settings button
    document.getElementById('save-settings').onclick = () => {
      this.saveSettings();
    };
  }

  saveSettings() {
    this.settings = {
      fontFamily: document.getElementById('font-family').value,
      fontSize: document.getElementById('font-size').value,
      theme: document.getElementById('theme').value,
      autoSave: document.getElementById('auto-save').checked,
      confirmChoices: document.getElementById('confirm-choices').checked,
      showStatsChanges: document.getElementById('show-stats-changes').checked,
      soundEffects: document.getElementById('sound-effects').checked
    };

    localStorage.setItem('sls-settings', JSON.stringify(this.settings));
    this.applySettings();
    this.closeModal('settings-modal');
    
    // Show notification
    this.showNotification('Настройки сохранены', 'success');
  }

  loadSettings() {
    const saved = localStorage.getItem('sls-settings');
    return saved ? JSON.parse(saved) : {};
  }

  applySettings() {
    const root = document.documentElement;
    
    // Font family
    const fontMap = {
      'system': "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      'serif': "'Times New Roman', Times, serif",
      'monospace': "'Courier New', Courier, monospace"
    };
    
    if (this.settings.fontFamily && fontMap[this.settings.fontFamily]) {
      root.style.setProperty('--font-family', fontMap[this.settings.fontFamily]);
    }
    
    // Font size
    const sizeMap = {
      'small': '0.9em',
      'medium': '1em',
      'large': '1.1em',
      'extra-large': '1.2em'
    };
    
    if (this.settings.fontSize && sizeMap[this.settings.fontSize]) {
      root.style.setProperty('--font-size-multiplier', sizeMap[this.settings.fontSize]);
    }
  }

  // Game actions
  startNewGame() {
    if (confirm('Начать новую игру? Текущий прогресс будет потерян.')) {
      // Сброс состояния игры к значениям по умолчанию
      store.resetToDefaults();
      
      // Переход к созданию персонажа
      if (window.gameEngine) {
        window.gameEngine.loadScene('character_creation');
      } else {
        window.location.search = '?scene=character_creation';
      }
      
      this.showNotification('🎮 Новая игра начата!', 'success');
    }
  }

  saveGame() {
    store.saveGame();
    this.showNotification('Игра сохранена', 'success');
  }

  loadGame() {
    if (store.loadGame()) {
      this.showNotification('Игра загружена', 'success');
      // Reload current scene
      window.location.reload();
    } else {
      this.showNotification('Сохранение не найдено', 'error');
    }
  }

  exportSave() {
    const saveData = localStorage.getItem('sls-save');
    if (!saveData) {
      this.showNotification('Нет сохранения для экспорта', 'error');
      return;
    }

    const blob = new Blob([saveData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sissy-life-sim-save-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    this.showNotification('Сохранение экспортировано', 'success');
  }

  importSave() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const saveData = JSON.parse(e.target.result);
          localStorage.setItem('sls-save', JSON.stringify(saveData));
          this.showNotification('Сохранение импортировано', 'success');
          
          // Ask user if they want to load it
          if (confirm('Загрузить импортированное сохранение?')) {
            this.loadGame();
          }
        } catch (error) {
          this.showNotification('Ошибка импорта сохранения', 'error');
          console.error('Import error:', error);
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
  }

  helpStuck() {
    const message = `
      🆘 Помощь "Я застрял!"
      
      Если вы застряли в игре:
      1. Попробуйте сохранить и перезагрузить игру
      2. Используйте dev команды в консоли (F12):
         - debugStats() - посмотреть статистики
         - setStat('energy', 100) - восстановить энергию
         - resetGame() - сбросить игру
      3. Проверьте requirements для действий в статистике
      4. Попробуйте изменить время: tick(60)
      
      Если проблема не решается, сообщите об ошибке!
    `;
    
    alert(message);
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style notification
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: type === 'success' ? 'var(--success-color)' : 
                  type === 'error' ? 'var(--error-color)' : 'var(--primary-color)',
      color: 'white',
      padding: '12px 20px',
      borderRadius: '8px',
      zIndex: '3000',
      opacity: '0',
      transform: 'translateY(-20px)',
      transition: 'all 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
}

export default UIManager; 