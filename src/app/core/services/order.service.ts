import { Injectable, signal } from '@angular/core';
import { Order } from '../models/customer.models';

const SAMPLE_ORDERS: Order[] = [
  {
    id: 'HT-2041',
    date: '2026-10-22',
    amount: 378,
    status: 'Delivered',
    items: [
      { name: 'Homemade Chicken Biryani', quantity: 1, price: 249 },
      { name: 'Chocolate Brownies', quantity: 1, price: 129 },
    ],
  },
  {
    id: 'HT-2088',
    date: '2026-11-04',
    amount: 657,
    status: 'Preparing',
    items: [
      { name: 'Homestyle Chicken Curry', quantity: 2, price: 229 },
      { name: 'Homemade Chicken Fry', quantity: 1, price: 199 },
    ],
  },
  {
    id: 'HT-2094',
    date: '2026-11-06',
    amount: 249,
    status: 'Out for delivery',
    items: [{ name: 'Homemade Chicken Biryani', quantity: 1, price: 249 }],
  },
];

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly ordersState = signal<Order[]>(SAMPLE_ORDERS);

  readonly orders = this.ordersState.asReadonly();

  addOrder(order: Omit<Order, 'id' | 'date'>): Order {
    const created: Order = {
      ...order,
      id: `HT-${Math.floor(2000 + Math.random() * 8000)}`,
      date: new Date().toISOString().slice(0, 10),
    };

    this.ordersState.update((orders) => [created, ...orders]);
    return created;
  }
}
