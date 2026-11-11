import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PortionId } from '../../core/models/food.models';
import { CartService } from '../../core/services/cart.service';
import { FoodService } from '../../core/services/food.service';
import { WishlistService } from '../../core/services/wishlist.service';

@Component({
  selector: 'app-food-details-page',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './food-details.html',
  styleUrl: './food-details.scss',
})
export class FoodDetailsPage {
  private readonly route = inject(ActivatedRoute);
  private readonly foodService = inject(FoodService);
  private readonly cart = inject(CartService);
  private readonly wishlist = inject(WishlistService);

  private readonly params = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });

  protected readonly item = computed(() => this.foodService.getById(this.params().get('id') ?? ''));
  protected readonly quantity = signal(1);
  protected readonly notice = signal('');
  protected readonly selectedPortionId = signal<PortionId>('full');
  protected readonly selectedPortion = computed(() => {
    const item = this.item();
    return (
      item?.portions.find((portion) => portion.id === this.selectedPortionId()) ?? item?.portions[0]
    );
  });
  protected readonly displayPrice = computed(
    () => this.selectedPortion()?.price ?? this.item()?.price ?? 0,
  );
  protected readonly isWishlisted = computed(() => {
    const item = this.item();
    return item ? this.wishlist.has(item.id) : false;
  });

  protected selectPortion(portionId: PortionId): void {
    this.selectedPortionId.set(portionId);
  }

  protected decreaseQuantity(): void {
    this.quantity.update((quantity) => Math.max(1, quantity - 1));
  }

  protected increaseQuantity(): void {
    this.quantity.update((quantity) => Math.min(99, quantity + 1));
  }

  protected addToCart(): void {
    const item = this.item();
    const portion = this.selectedPortion();

    if (!item || !item.available || !portion) {
      return;
    }

    this.cart.addItem({
      id: item.id,
      lineId: `${item.id}::${portion.id}`,
      name: item.name,
      price: portion.price,
      quantity: this.quantity(),
      image: item.image,
      portionId: portion.id,
      portionLabel: portion.label,
      portionWeight: portion.weight,
    });
    this.notice.set(
      `${item.name} (${portion.label} – ${portion.weight}) × ${this.quantity()} added to your cart.`,
    );
  }

  protected toggleWishlist(): void {
    const item = this.item();

    if (!item) {
      return;
    }

    const added = this.wishlist.toggle({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
    });

    this.notice.set(
      added ? `${item.name} saved to your wishlist.` : `${item.name} removed from your wishlist.`,
    );
  }
}
