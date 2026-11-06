import { Injectable, computed, signal } from '@angular/core';
import { CartItem } from '../models/customer.models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly itemsState = signal<CartItem[]>([]);

  readonly items = this.itemsState.asReadonly();
  readonly count = computed(() =>
    this.itemsState().reduce((total, item) => total + item.quantity, 0),
  );
  readonly subtotal = computed(() =>
    this.itemsState().reduce((total, item) => total + item.price * item.quantity, 0),
  );

  addItem(item: CartItem): void {
    const existing = this.itemsState().find((current) => current.id === item.id);

    if (existing) {
      this.itemsState.update((items) =>
        items.map((current) =>
          current.id === item.id
            ? { ...current, quantity: current.quantity + item.quantity }
            : current,
        ),
      );
      return;
    }

    this.itemsState.update((items) => [...items, item]);
  }

  updateQuantity(id: string, quantity: number): void {
    if (quantity < 1) {
      this.removeItem(id);
      return;
    }

    this.itemsState.update((items) =>
      items.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  }

  removeItem(id: string): void {
    this.itemsState.update((items) => items.filter((item) => item.id !== id));
  }

  clear(): void {
    this.itemsState.set([]);
  }
}
