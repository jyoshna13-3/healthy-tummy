import { Injectable, computed, signal } from '@angular/core';
import { CartItem } from '../models/customer.models';

const CART_STORAGE_KEY = 'healthy-tummy-cart';

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const item = value as Partial<CartItem>;
  return (
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    typeof item.price === 'number' &&
    Number.isFinite(item.price) &&
    typeof item.quantity === 'number' &&
    Number.isFinite(item.quantity) &&
    typeof item.image === 'string'
  );
}

function readStoredCart(): CartItem[] {
  if (typeof localStorage === 'undefined') {
    return [];
  }

  try {
    const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? '[]') as unknown;

    if (!Array.isArray(stored)) {
      return [];
    }

    return stored.filter(isCartItem).map((item) => ({
      id: item.id,
      lineId: typeof item.lineId === 'string' ? item.lineId : undefined,
      name: item.name,
      price: item.price,
      quantity: Math.max(1, Math.floor(item.quantity)),
      image: item.image,
      portionId:
        item.portionId === 'half' || item.portionId === 'full' ? item.portionId : undefined,
      portionLabel: typeof item.portionLabel === 'string' ? item.portionLabel : undefined,
      portionWeight: typeof item.portionWeight === 'string' ? item.portionWeight : undefined,
    }));
  } catch {
    return [];
  }
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly itemsState = signal<CartItem[]>(readStoredCart());

  readonly items = this.itemsState.asReadonly();
  readonly count = computed(() =>
    this.itemsState().reduce((total, item) => total + item.quantity, 0),
  );
  readonly subtotal = computed(() =>
    this.itemsState().reduce((total, item) => total + item.price * item.quantity, 0),
  );

  addItem(item: CartItem): void {
    const key = this.lineKey(item);
    const existing = this.itemsState().find((current) => this.lineKey(current) === key);

    if (existing) {
      this.updateItems((items) =>
        items.map((current) =>
          this.lineKey(current) === key
            ? { ...current, quantity: current.quantity + item.quantity }
            : current,
        ),
      );
      return;
    }

    this.updateItems((items) => [...items, item]);
  }

  updateQuantity(id: string, quantity: number): void {
    if (quantity < 1) {
      this.removeItem(id);
      return;
    }

    this.updateItems((items) =>
      items.map((item) => (this.lineKey(item) === id ? { ...item, quantity } : item)),
    );
  }

  removeItem(id: string): void {
    this.updateItems((items) => items.filter((item) => this.lineKey(item) !== id));
  }

  clear(): void {
    this.updateItems(() => []);
  }

  private updateItems(update: (items: CartItem[]) => CartItem[]): void {
    this.itemsState.update(update);
    this.persist();
  }

  private persist(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.itemsState()));
    } catch {
      return;
    }
  }

  private lineKey(item: CartItem): string {
    return item.lineId ?? item.id;
  }
}
