import { Injectable } from '@angular/core';
import { FoodItem } from '../models/food.models';

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
    preparationTime: null,
    portionSize: null,
    advanceOrderRequired: false,
    advanceOrderNotice:
      'No advance order required. Each dish is prepared fresh after confirmation.',
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
    preparationTime: null,
    portionSize: null,
    advanceOrderRequired: false,
    advanceOrderNotice:
      'No advance order required. Each dish is prepared fresh after confirmation.',
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
    preparationTime: null,
    portionSize: null,
    advanceOrderRequired: false,
    advanceOrderNotice:
      'No advance order required. Each dish is prepared fresh after confirmation.',
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
    preparationTime: null,
    portionSize: null,
    advanceOrderRequired: false,
    advanceOrderNotice:
      'No advance order required. Each dish is prepared fresh after confirmation.',
  },
];

@Injectable({ providedIn: 'root' })
export class FoodService {
  readonly items = FOOD_ITEMS;

  getById(id: string): FoodItem | undefined {
    return FOOD_ITEMS.find((item) => item.id === id);
  }
}
