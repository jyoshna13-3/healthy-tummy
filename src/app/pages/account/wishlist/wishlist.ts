import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WishlistItem } from '../../../core/models/customer.models';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';

@Component({
  selector: 'app-wishlist-page',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.scss',
})
export class WishlistPage {
  private readonly wishlistService = inject(WishlistService);
  private readonly cartService = inject(CartService);

  protected readonly items = this.wishlistService.items;
  protected readonly notice = signal('');

  protected addToCart(item: WishlistItem): void {
    this.cartService.addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
    });
    this.notice.set(`${item.name} has been added to your cart.`);
  }

  protected remove(item: WishlistItem): void {
    this.wishlistService.remove(item.id);
    this.notice.set(`${item.name} was removed from your wishlist.`);
  }
}
