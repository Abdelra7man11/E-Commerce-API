import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    title: 'NovaMart Prime | Modern Luxury E-Commerce'
  },
  {
    path: 'shop',
    loadComponent: () => import('./features/shop/shop.component').then(m => m.ShopComponent),
    title: 'Catalog | NovaMart Prime'
  },
  {
    path: 'shop/:id',
    loadComponent: () => import('./features/shop/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
    title: 'Product Details | NovaMart Prime'
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent),
    title: 'Shopping Basket | NovaMart Prime'
  },
  {
    path: 'checkout',
    canActivate: [authGuard],
    loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent),
    title: 'Secure Checkout | NovaMart Prime'
  },
  {
    path: 'checkout/success/:id',
    loadComponent: () => import('./features/checkout/checkout-success/checkout-success.component').then(m => m.CheckoutSuccessComponent),
    title: 'Order Confirmed | NovaMart Prime'
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () => import('./features/orders/orders.component').then(m => m.OrdersComponent),
    title: 'My Orders | NovaMart Prime'
  },
  {
    path: 'orders/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/orders/order-detail/order-detail.component').then(m => m.OrderDetailComponent),
    title: 'Order Invoice | NovaMart Prime'
  },
  {
    path: 'account/login',
    loadComponent: () => import('./features/account/login/login.component').then(m => m.LoginComponent),
    title: 'Sign In | NovaMart Prime'
  },
  {
    path: 'account/register',
    loadComponent: () => import('./features/account/register/register.component').then(m => m.RegisterComponent),
    title: 'Create Account | NovaMart Prime'
  },
  {
    path: 'not-found',
    loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'Page Not Found | NovaMart Prime'
  },
  {
    path: '**',
    redirectTo: 'not-found',
    pathMatch: 'full'
  }
];
