import { Injectable, signal } from '@angular/core';
import { FoodItem, FoodPortion } from '../models/food.models';

const PREPARATION_TIME = 'Approximately 1 hour';
const ADVANCE_ORDER_NOTICE = 'Please place your order at least 1 hour in advance.';

function buildPortions(price: number): FoodPortion[] {
  return [
    {
      id: 'half',
      label: 'Half',
      weight: '150 grams',
      price: Math.round(price / 2),
    },
    {
      id: 'full',
      label: 'Full',
      weight: '300 grams',
      price,
    },
  ];
}

const FOOD_ITEMS: FoodItem[] = [
  {
    id: 'biryani',
    name: 'Homemade Chicken Biryani',
    description: 'Rich flavours, prepared fresh in small batches.',
    price: 249,
    image: '/assets/food/biryani/chicken-biryani.AVIF.avif',
    alt: 'Homemade chicken biryani',
    available: true,
    rating: null,
    reviewCount: 0,
    preparationTime: PREPARATION_TIME,
    portions: buildPortions(249),
    advanceOrderRequired: true,
    advanceOrderNotice: ADVANCE_ORDER_NOTICE,
  },
  {
    id: 'curry',
    name: 'Homestyle Chicken Curry',
    description: 'Traditional taste and slow-cooked comfort.',
    price: 229,
    image: '/assets/food/chicken-curry/chicken-curry.jpg.jpg',
    alt: 'Homestyle chicken curry',
    available: true,
    rating: null,
    reviewCount: 0,
    preparationTime: PREPARATION_TIME,
    portions: buildPortions(229),
    advanceOrderRequired: true,
    advanceOrderNotice: ADVANCE_ORDER_NOTICE,
  },
  {
    id: 'fry',
    name: 'Homemade Chicken Fry',
    description: 'Freshly cooked with care.',
    price: 199,
    image: '/assets/food/chicken-fry/chicken-fry.jpg.jpg',
    alt: 'Homemade chicken fry',
    available: true,
    rating: null,
    reviewCount: 0,
    preparationTime: PREPARATION_TIME,
    portions: buildPortions(199),
    advanceOrderRequired: true,
    advanceOrderNotice: ADVANCE_ORDER_NOTICE,
  },
  {
    id: 'brownies',
    name: 'Chocolate Brownies',
    description: 'A little homemade sweetness for slow evenings.',
    price: 129,
    image:
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80',
    alt: 'Homemade chocolate brownies',
    available: true,
    rating: null,
    reviewCount: 0,
    preparationTime: PREPARATION_TIME,
    portions: buildPortions(129),
    advanceOrderRequired: true,
    advanceOrderNotice: ADVANCE_ORDER_NOTICE,
  },
];

@Injectable({ providedIn: 'root' })
export class FoodService {
  private readonly itemsState = signal<FoodItem[]>(FOOD_ITEMS);

  readonly items = this.itemsState.asReadonly();

  getById(id: string): FoodItem | undefined {
    return this.itemsState().find((item) => item.id === id);
  }

  setAvailability(id: string, available: boolean): void {
    this.itemsState.update((items) =>
      items.map((item) => (item.id === id ? { ...item, available } : item)),
    );
  }
}
