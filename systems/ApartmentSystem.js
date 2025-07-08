// Система квартир и жилых помещений

const APARTMENT_TYPES = {
  cheap: {
    id: 'cheap',
    name: 'Дешевая квартира',
    description: 'Старая коммуналка с облупившимися стенами и скрипучими полами',
    cost: 0,
    hallwayImage: '/assets/images/apartments/cheap_hallway.jpg',
    bathroomImage: '/assets/images/apartments/cheap_bathroom.jpg',
    bedroomImage: '/assets/images/apartments/cheap_bedroom.jpg',
    kitchenImage: '/assets/images/apartments/cheap_kitchen.jpg',
    effects: {
      mood: -5,
      stress: +5,
      dignity: -2
    },
    features: [
      'Старая мебель',
      'Плохое освещение', 
      'Шумные соседи',
      'Протекающие краны'
    ]
  },
  
  decent: {
    id: 'decent',
    name: 'Приличная квартира',
    description: 'Обычная однокомнатная квартира в хорошем состоянии',
    cost: 25000,
    hallwayImage: '/assets/images/apartments/decent_hallway.jpg',
    bathroomImage: '/assets/images/apartments/decent_bathroom.jpg',
    bedroomImage: '/assets/images/apartments/decent_bedroom.jpg',
    kitchenImage: '/assets/images/apartments/decent_kitchen.jpg',
    effects: {
      mood: +2,
      hygiene: +5
    },
    features: [
      'Современная мебель',
      'Хорошее освещение',
      'Тихие соседи',
      'Исправная сантехника'
    ]
  },
  
  luxury: {
    id: 'luxury',
    name: 'Роскошная квартира',
    description: 'Элитная квартира в престижном районе с дизайнерским ремонтом',
    cost: 100000,
    hallwayImage: '/assets/images/apartments/luxury_hallway.jpg',
    bathroomImage: '/assets/images/apartments/luxury_bathroom.jpg',
    bedroomImage: '/assets/images/apartments/luxury_bedroom.jpg',
    kitchenImage: '/assets/images/apartments/luxury_kitchen.jpg',
    effects: {
      mood: +10,
      dignity: +5,
      stress: -5,
      hygiene: +10
    },
    features: [
      'Дизайнерская мебель',
      'Умное освещение',
      'Консьерж',
      'Джакузи и сауна',
      'Панорамные окна'
    ]
  },
  
  studio: {
    id: 'studio',
    name: 'Студия',
    description: 'Современная студия-лофт с открытой планировкой',
    cost: 45000,
    hallwayImage: '/assets/images/apartments/studio_hallway.jpg',
    bathroomImage: '/assets/images/apartments/studio_bathroom.jpg',
    bedroomImage: '/assets/images/apartments/studio_bedroom.jpg',
    kitchenImage: '/assets/images/apartments/studio_kitchen.jpg',
    effects: {
      mood: +5,
      energy: +3,
      creativity: +5
    },
    features: [
      'Открытая планировка',
      'Высокие потолки',
      'Большие окна',
      'Минималистичный дизайн'
    ]
  },
  
  parents: {
    id: 'parents',
    name: 'Дом родителей',
    description: 'Семейный дом, где вы выросли',
    cost: 0,
    hallwayImage: '/assets/images/apartments/parents_hallway.jpg',
    bathroomImage: '/assets/images/apartments/parents_bathroom.jpg',
    bedroomImage: '/assets/images/apartments/parents_bedroom.jpg',
    kitchenImage: '/assets/images/apartments/parents_kitchen.jpg',
    effects: {
      mood: +3,
      stress: +3,
      dignity: -3
    },
    features: [
      'Семейные фотографии',
      'Знакомая обстановка',
      'Родительский контроль',
      'Детские воспоминания'
    ]
  }
};

class ApartmentSystem {
  constructor(store) {
    this.store = store;
  }

  // Получить текущий тип квартиры
  getCurrentApartmentType() {
    const apartmentType = this.store.flags.apartmentType || 'parents';
    return APARTMENT_TYPES[apartmentType] || APARTMENT_TYPES.parents;
  }

  // Установить тип квартиры
  setApartmentType(typeId) {
    if (APARTMENT_TYPES[typeId]) {
      this.store.setFlag('apartmentType', typeId);
      return true;
    }
    return false;
  }

  // Получить описание текущей квартиры
  getApartmentDescription() {
    const apartment = this.getCurrentApartmentType();
    return {
      name: apartment.name,
      description: apartment.description,
      features: apartment.features
    };
  }

  // Получить изображение для определенной комнаты
  getRoomImage(roomType) {
    const apartment = this.getCurrentApartmentType();
    
    switch (roomType) {
      case 'hallway':
        return apartment.hallwayImage;
      case 'bathroom':
        return apartment.bathroomImage;
      case 'bedroom':
        return apartment.bedroomImage;
      case 'kitchen':
        return apartment.kitchenImage;
      default:
        return apartment.hallwayImage;
    }
  }

  // Применить эффекты квартиры (вызывается ежедневно)
  applyDailyApartmentEffects() {
    const apartment = this.getCurrentApartmentType();
    
    if (apartment.effects) {
      Object.entries(apartment.effects).forEach(([stat, value]) => {
        this.store.addStat(stat, value);
      });
    }
  }

  // Проверить, может ли игрок позволить себе квартиру
  canAfford(typeId) {
    const apartment = APARTMENT_TYPES[typeId];
    if (!apartment) return false;
    
    const money = this.store.stats.money || 0;
    return money >= apartment.cost;
  }

  // Купить квартиру
  buyApartment(typeId) {
    const apartment = APARTMENT_TYPES[typeId];
    if (!apartment) return { success: false, message: 'Неизвестный тип квартиры' };
    
    if (!this.canAfford(typeId)) {
      return { 
        success: false, 
        message: `Недостаточно денег. Нужно: $${apartment.cost}` 
      };
    }

    // Списываем деньги
    this.store.addStat('money', -apartment.cost);
    
    // Устанавливаем новую квартиру
    this.setApartmentType(typeId);
    
    return { 
      success: true, 
      message: `Вы приобрели ${apartment.name}!` 
    };
  }

  // Получить список доступных квартир
  getAvailableApartments() {
    return Object.values(APARTMENT_TYPES).map(apt => ({
      id: apt.id,
      name: apt.name,
      description: apt.description,
      cost: apt.cost,
      affordable: this.canAfford(apt.id),
      current: apt.id === this.getCurrentApartmentType().id
    }));
  }

  // Получить случайные события для квартиры
  getRandomApartmentEvent() {
    const apartment = this.getCurrentApartmentType();
    const events = [];

    switch (apartment.id) {
      case 'cheap':
        events.push(
          { text: 'Соседи шумят всю ночь', effects: { stress: +5, energy: -10 } },
          { text: 'Протек кран в ванной', effects: { mood: -3, hygiene: -5 } },
          { text: 'Отключили горячую воду', effects: { hygiene: -10, mood: -5 } }
        );
        break;
        
      case 'luxury':
        events.push(
          { text: 'Консьерж принес цветы', effects: { mood: +5 } },
          { text: 'Горничная убрала квартиру', effects: { hygiene: +10, mood: +3 } },
          { text: 'Соседи пригласили на вечеринку', effects: { social: +5, mood: +5 } }
        );
        break;
        
      case 'parents':
        events.push(
          { text: 'Мама приготовила ваше любимое блюдо', effects: { mood: +5, health: +5 } },
          { text: 'Родители спрашивают о личной жизни', effects: { stress: +5, dignity: -2 } },
          { text: 'Нашли старые детские фотографии', effects: { mood: +3, nostalgia: +5 } }
        );
        break;
    }

    if (events.length > 0) {
      return events[Math.floor(Math.random() * events.length)];
    }
    
    return null;
  }
}

export default ApartmentSystem;
export { APARTMENT_TYPES }; 