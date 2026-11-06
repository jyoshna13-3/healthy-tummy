import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AddressService } from '../../core/services/address.service';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-checkout-page',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class CheckoutPage {
  protected readonly auth = inject(AuthService);
  protected readonly cart = inject(CartService);
  protected readonly addressService = inject(AddressService);
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);

  protected readonly addresses = this.addressService.addresses;
  protected readonly selectedAddressId = signal<string | null>(this.addresses()[0]?.id ?? null);
  protected readonly message = signal('');
  protected readonly placing = signal(false);

  protected selectAddress(id: string): void {
    this.selectedAddressId.set(id);
  }

  protected async placeOrder(): Promise<void> {
    if (!this.selectedAddressId() || this.cart.items().length === 0) {
      this.message.set('Please choose a delivery address and add a dish before confirming.');
      return;
    }

    this.placing.set(true);
    this.orderService.addOrder({
      items: this.cart.items().map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      amount: this.cart.subtotal(),
      status: 'Preparing',
    });
    this.cart.clear();
    this.placing.set(false);
    await this.router.navigateByUrl('/account/orders');
  }
}
