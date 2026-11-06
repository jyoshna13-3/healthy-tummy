import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Healthy Tummy | Homemade Food',
    children: [],
  },
  {
    path: 'login',
    title: 'Login / Sign Up | Healthy Tummy',
    loadComponent: () => import('./pages/auth/login/login').then((module) => module.LoginPage),
  },
  {
    path: 'account',
    loadComponent: () =>
      import('./pages/account/account-layout').then((module) => module.AccountLayout),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'orders',
      },
      {
        path: 'orders',
        title: 'My Orders | Healthy Tummy',
        loadComponent: () =>
          import('./pages/account/orders/orders').then((module) => module.OrdersPage),
      },
      {
        path: 'addresses',
        title: 'My Addresses | Healthy Tummy',
        loadComponent: () =>
          import('./pages/account/addresses/addresses').then((module) => module.AddressesPage),
      },
      {
        path: 'wishlist',
        title: 'My Wishlist | Healthy Tummy',
        loadComponent: () =>
          import('./pages/account/wishlist/wishlist').then((module) => module.WishlistPage),
      },
      {
        path: 'profile',
        title: 'My Profile | Healthy Tummy',
        loadComponent: () =>
          import('./pages/account/profile/profile').then((module) => module.ProfilePage),
      },
    ],
  },
  {
    path: 'checkout',
    title: 'Checkout | Healthy Tummy',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/checkout/checkout').then((module) => module.CheckoutPage),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
