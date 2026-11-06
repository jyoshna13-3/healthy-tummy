import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-orders-page',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class OrdersPage {
  protected readonly orderService = inject(OrderService);
  protected readonly orders = this.orderService.orders;
}
