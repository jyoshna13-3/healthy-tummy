import { Injectable, computed, signal } from '@angular/core';
import { WishlistItem } from '../models/customer.models';

const SAMPLE_WISHLIST: WishlistItem[] = [
  {
    id: 'biryani',
    name: 'Homemade Chicken Biryani',
    description: 'Rich flavours, prepared fresh in small batches.',
    price: 249,
    image:
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'curry',
    name: 'Homestyle Chicken Curry',
    description: 'Traditional taste and slow-cooked comfort.',
    price: 229,
    image:
      'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'brownies',
    name: 'Chocolate Brownies',
    description: 'A little homemade sweetness for slow evenings.',
    price: 129,
    image:
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=80',
  },
];

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly itemsState = signal<WishlistItem[]>(SAMPLE_WISHLIST);

  readonly items = this.itemsState.asReadonly();
  readonly count = computed(() => this.itemsState().length);

  has(id: string): boolean {
    return this.itemsState().some((item) => item.id === id);
  }

  add(item: WishlistItem): void {
    if (this.has(item.id)) {
      return;
    }

    this.itemsState.update((items) => [item, ...items]);
  }

  toggle(item: WishlistItem): boolean {
    if (this.has(item.id)) {
      this.remove(item.id);
      return false;
    }

    this.add(item);
    return true;
  }

  remove(id: string): void {
    this.itemsState.update((items) => items.filter((item) => item.id !== id));
  }
}
