import { toSignal } from '@angular/core/rxjs-interop';
import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { CartService } from './core/services/cart.service';
import { AccountMenu } from './shared/account-menu/account-menu';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet, AccountMenu],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly router = inject(Router);
  private readonly cart = inject(CartService);

  protected readonly title = signal('healthy-tummy');
  protected readonly menuOpen = signal(false);
  protected readonly cartCount = this.cart.count;
  protected readonly isHome = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.isHomeUrl(this.router.url)),
    ),
    { initialValue: this.isHomeUrl(this.router.url) },
  );

  protected readonly carouselItems = [
    {
      src: '/assets/food/biryani/chicken-biryani.AVIF.avif',
      alt: 'Homemade chicken biryani',
    },
    {
      src: '/assets/food/chicken-curry/chicken-curry.jpg.jpg',
      alt: 'Homemade chicken curry',
    },
    {
      src: '/assets/food/chicken-fry/chicken-fry.jpg.jpg',
      alt: 'Spicy homemade chicken fry',
    },
    {
      src: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80',
      alt: 'Homemade chocolate brownies',
    },
    {
      src: 'https://images.unsplash.com/photo-1673551494277-92204546b504?auto=format&fit=crop&w=900&q=80',
      alt: 'Chocolate dessert bowl with raspberries',
    },
  ];

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected openFood(id: string, event?: Event): void {
    event?.preventDefault();
    this.router.navigate(['/food', id]);
  }

  private isHomeUrl(url: string): boolean {
    return url.split(/[?#]/)[0] === '/';
  }
}
