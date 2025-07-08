/**
 * Система управления инвентарем
 */
export default class InventorySystem {
  constructor(store) {
    this.store = store;
    
    // Инициализация инвентаря если его нет
    if (!this.store.inventory) {
      this.store.inventory = [];
    }
    
    // Инициализация предметов в квартире
    if (!this.store.apartmentItems) {
      this.store.apartmentItems = [];
    }
    
    // Базовые предметы для разных типов квартир
    this.apartmentDefaults = {
      parents: [
        { id: 'toothbrush_basic', quantity: 1 },
        { id: 'toothpaste', quantity: 1 },
        { id: 'soap_basic', quantity: 3 },
        { id: 'shampoo_basic', quantity: 1 },
        { id: 'razor_basic', quantity: 1 },
        { id: 'towel_basic', quantity: 2 }
      ],
      cheap: [
        { id: 'toothbrush_basic', quantity: 1 },
        { id: 'soap_basic', quantity: 1 },
        { id: 'razor_basic', quantity: 1 },
        { id: 'towel_basic', quantity: 1 }
      ],
      studio: [
        { id: 'toothbrush_basic', quantity: 1 },
        { id: 'toothpaste', quantity: 1 },
        { id: 'soap_basic', quantity: 2 },
        { id: 'shampoo_basic', quantity: 1 },
        { id: 'razor_basic', quantity: 1 },
        { id: 'towel_basic', quantity: 2 },
        { id: 'skincare_basic', quantity: 1 }
      ],
      decent: [
        { id: 'toothbrush_electric', quantity: 1 },
        { id: 'toothpaste', quantity: 2 },
        { id: 'soap_luxury', quantity: 2 },
        { id: 'shampoo_luxury', quantity: 1 },
        { id: 'conditioner', quantity: 1 },
        { id: 'razor_electric', quantity: 1 },
        { id: 'towel_luxury', quantity: 3 },
        { id: 'skincare_basic', quantity: 1 }
      ],
      luxury: [
        { id: 'toothbrush_electric', quantity: 2 },
        { id: 'toothpaste_premium', quantity: 3 },
        { id: 'soap_luxury', quantity: 5 },
        { id: 'shampoo_luxury', quantity: 2 },
        { id: 'conditioner_luxury', quantity: 2 },
        { id: 'razor_laser', quantity: 1 },
        { id: 'towel_luxury', quantity: 5 },
        { id: 'skincare_luxury', quantity: 1 },
        { id: 'bath_bombs', quantity: 3 },
        { id: 'bath_oils', quantity: 2 }
      ]
    };
    
    // Инициализация предметов квартиры при первом запуске
    if (this.store.apartmentItems.length === 0) {
      this.initializeApartmentItems();
    }
  }
  
  /**
   * Инициализация предметов в квартире
   */
  initializeApartmentItems() {
    const apartmentType = this.store.flags?.apartmentType || 'parents';
    const defaultItems = this.apartmentDefaults[apartmentType] || this.apartmentDefaults.parents;
    
    this.store.apartmentItems = [...defaultItems];
  }
  
  /**
   * Проверка наличия предмета (в инвентаре или квартире)
   */
  hasItem(itemId, quantity = 1) {
    // Проверяем личный инвентарь
    const inInventory = this.store.inventory.find(item => item.id === itemId);
    if (inInventory && inInventory.quantity >= quantity) {
      return { location: 'inventory', available: true };
    }
    
    // Проверяем предметы в квартире
    const inApartment = this.store.apartmentItems.find(item => item.id === itemId);
    if (inApartment && inApartment.quantity >= quantity) {
      return { location: 'apartment', available: true };
    }
    
    return { location: null, available: false };
  }
  
  /**
   * Использование расходного предмета
   */
  useConsumable(itemId, quantity = 1) {
    const itemCheck = this.hasItem(itemId, quantity);
    
    if (!itemCheck.available) {
      return { success: false, message: 'У вас нет этого предмета' };
    }
    
    // Используем из соответствующего места
    const items = itemCheck.location === 'inventory' 
      ? this.store.inventory 
      : this.store.apartmentItems;
      
    const item = items.find(i => i.id === itemId);
    item.quantity -= quantity;
    
    // Удаляем если кончилось
    if (item.quantity <= 0) {
      const index = items.indexOf(item);
      items.splice(index, 1);
    }
    
    return { success: true, location: itemCheck.location };
  }
  
  /**
   * Добавление предмета в инвентарь
   */
  addToInventory(itemId, quantity = 1) {
    const existing = this.store.inventory.find(item => item.id === itemId);
    
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.store.inventory.push({ id: itemId, quantity });
    }
  }
  
  /**
   * Добавление предмета в квартиру
   */
  addToApartment(itemId, quantity = 1) {
    const existing = this.store.apartmentItems.find(item => item.id === itemId);
    
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.store.apartmentItems.push({ id: itemId, quantity });
    }
  }
  
  /**
   * Перемещение всех предметов при переезде
   */
  moveToNewApartment(newApartmentType) {
    // Сохраняем личные вещи
    const personalItems = [...this.store.inventory];
    
    // Получаем новые базовые предметы
    const newDefaults = this.apartmentDefaults[newApartmentType] || [];
    
    // Объединяем с личными вещами которые были в старой квартире
    // (предполагаем что персонаж забирает свои купленные вещи)
    this.store.apartmentItems = [...newDefaults];
    
    // Личный инвентарь остается без изменений
    this.store.inventory = personalItems;
  }
  
  /**
   * Получение списка доступных действий на основе предметов
   */
  getAvailableActions(location) {
    const actions = [];
    
    if (location === 'bathroom') {
      // Чистка зубов
      if (this.hasItem('toothbrush_basic') || this.hasItem('toothbrush_electric')) {
        if (this.hasItem('toothpaste') || this.hasItem('toothpaste_premium')) {
          actions.push({ id: 'brushTeeth', available: true });
        } else {
          actions.push({ id: 'brushTeeth', available: false, reason: 'Нужна зубная паста' });
        }
      } else {
        actions.push({ id: 'brushTeeth', available: false, reason: 'Нужна зубная щетка' });
      }
      
      // Душ
      if (this.hasItem('soap_basic') || this.hasItem('soap_luxury') || 
          this.hasItem('shower_gel')) {
        actions.push({ id: 'takeShower', available: true });
      } else {
        actions.push({ id: 'takeShower', available: false, reason: 'Нужно мыло или гель для душа' });
      }
      
      // Бритье
      if (this.hasItem('razor_basic') || this.hasItem('razor_electric') || 
          this.hasItem('razor_laser')) {
        actions.push({ id: 'shave', available: true });
      } else {
        actions.push({ id: 'shave', available: false, reason: 'Нужна бритва' });
      }
      
      // Уход за кожей
      if (this.hasItem('skincare_basic') || this.hasItem('skincare_luxury')) {
        actions.push({ id: 'skincare', available: true });
      }
      
      // Макияж
      if (this.hasItem('makeup_basic')) {
        actions.push({ id: 'makeup', available: true });
      }
    }
    
    return actions;
  }
}

// Экспорт для использования в других модулях
window.InventorySystem = InventorySystem; 