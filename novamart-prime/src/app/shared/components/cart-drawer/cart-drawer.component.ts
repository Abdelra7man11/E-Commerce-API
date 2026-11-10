import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BasketService } from '../../../core/services/basket.service';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Backdrop -->
    @if (basketService.isDrawerOpen()) {
      <div class="drawer-backdrop" (click)="basketService.toggleDrawer(false)"></div>
    }

    <!-- Drawer Panel -->
    <div class="cart-drawer" [class.open]="basketService.isDrawerOpen()">
      <div class="d-flex flex-column h-100">
        <!-- Header -->
        <div class="p-3 border-bottom d-flex align-items-center justify-content-between bg-light">
          <div class="d-flex align-items-center">
            <i class="fa-solid fa-cart-shopping fs-5 me-2" style="color: var(--tp-primary);"></i>
            <h5 class="mb-0 fw-bold">Your Cart</h5>
            <span class="badge bg-dark rounded-pill ms-2">{{ basketService.itemCount() }}</span>
          </div>
          <button class="btn btn-close" (click)="basketService.toggleDrawer(false)"></button>
        </div>

        <!-- Body / Items List -->
        <div class="flex-grow-1 overflow-auto p-3">
          @if (basketService.basket(); as basket) {
            @if (basket.items.length > 0) {
              @for (item of basket.items; track item.id) {
                <div class="d-flex align-items-center gap-3 mb-3 p-2 border rounded-3 bg-white shadow-sm">
                  <img [src]="item.pictureUrl" [alt]="item.productName"
                       class="rounded-3 object-fit-cover"
                       style="width: 65px; height: 65px; background: #f8fafc;"
                       (error)="onImgError($event)">
                  <div class="flex-grow-1 min-w-0">
                    <h6 class="mb-1 text-truncate fw-semibold" style="font-size: 0.95rem;">{{ item.productName }}</h6>
                    <div class="text-muted small mb-2">{{ item.brand }} · {{ item.price | currency }}</div>
                    
                    <div class="d-flex align-items-center justify-content-between">
                      <!-- Quantity Stepper -->
                      <div class="d-flex align-items-center border rounded-pill px-2 py-0.5 bg-light" style="width: fit-content;">
                        <button class="btn btn-sm btn-link text-dark p-0 me-2 text-decoration-none"
                                (click)="basketService.decrementItemQuantity(item)">
                          <i class="fa-solid fa-minus fs-7"></i>
                        </button>
                        <span class="fw-bold px-1" style="font-size: 0.85rem;">{{ item.quantity }}</span>
                        <button class="btn btn-sm btn-link text-dark p-0 ms-2 text-decoration-none"
                                (click)="basketService.incrementItemQuantity(item)">
                          <i class="fa-solid fa-plus fs-7"></i>
                        </button>
                      </div>

                      <div class="fw-bold" style="color: var(--tp-primary);">
                        {{ (item.price * item.quantity) | currency }}
                      </div>
                    </div>
                  </div>
                  <button class="btn btn-link text-danger p-1" (click)="basketService.removeItemFromBasket(item.id)">
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              }
            } @else {
              <div class="text-center py-5">
                <i class="fa-solid fa-cart-arrow-down fs-1 text-muted mb-3 opacity-50"></i>
                <h5 class="fw-bold text-muted">Your cart is empty</h5>
                <p class="text-secondary small">Add delicious items from the shop to get started!</p>
                <a routerLink="/shop" class="btn btn-tp-primary rounded-pill mt-3"
                   (click)="basketService.toggleDrawer(false)">Start Shopping</a>
              </div>
            }
          } @else {
            <div class="text-center py-5">
              <i class="fa-solid fa-cart-plus fs-1 text-muted mb-3 opacity-50"></i>
              <h5 class="fw-bold text-muted">No items in your cart</h5>
              <a routerLink="/shop" class="btn btn-tp-primary rounded-pill mt-3"
                 (click)="basketService.toggleDrawer(false)">Browse Products</a>
            </div>
          }
        </div>

        <!-- Footer / Checkout -->
        @if (basketService.basket() && basketService.itemCount() > 0) {
          <div class="p-3 border-top bg-light">
            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted">Subtotal</span>
              <span class="fw-bold">{{ basketService.basketTotal().subtotal | currency }}</span>
            </div>
            <div class="d-flex justify-content-between mb-3 fs-5">
              <span class="fw-bold">Total</span>
              <span class="fw-bold" style="color: var(--tp-primary);">{{ basketService.basketTotal().total | currency }}</span>
            </div>
            <div class="d-grid gap-2">
              <a routerLink="/checkout" class="btn btn-tp-primary py-2.5 rounded-pill text-center text-decoration-none"
                 (click)="basketService.toggleDrawer(false)">
                Proceed to Checkout <i class="fa-solid fa-arrow-right ms-1"></i>
              </a>
              <a routerLink="/cart" class="btn btn-outline-dark rounded-pill py-2 text-center text-decoration-none"
                 (click)="basketService.toggleDrawer(false)">
                View Full Cart
              </a>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .drawer-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(15, 23, 42, 0.45);
      backdrop-filter: blur(2px);
      z-index: 1040;
      animation: fadeIn 0.2s ease;
    }
    .cart-drawer {
      position: fixed;
      top: 0;
      right: -420px;
      width: 400px;
      max-width: 90vw;
      height: 100vh;
      background: #ffffff;
      box-shadow: -10px 0 25px rgba(0,0,0,0.15);
      z-index: 1050;
      transition: right 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .cart-drawer.open {
      right: 0;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class CartDrawerComponent {
  basketService = inject(BasketService);
  private readonly FALLBACK_IMG = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23ff5a00' stroke-width='1.5'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' stroke='%23cbd5e1'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5' stroke='%23ff5a00'/%3E%3Cpath d='m21 15-5-5L5 21' stroke='%2394a3b8'/%3E%3C/svg%3E";

  onImgError(event: Event) {
    const target = event.target as HTMLImageElement;
    if (target && !target.src.startsWith('data:')) {
      target.src = this.FALLBACK_IMG;
    }
  }
}
