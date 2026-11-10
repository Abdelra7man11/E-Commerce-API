import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BasketItem } from '../../core/models/basket.model';
import { BasketService } from '../../core/services/basket.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TranslatePipe],
  template: `
    <div class="cart-page py-5">
      <div class="container-xl">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb mb-1 small text-muted">
                <li class="breadcrumb-item"><a routerLink="/" class="text-decoration-none text-muted">{{ 'shop.breadcrumbHome' | translate }}</a></li>
                <li class="breadcrumb-item active text-orange fw-semibold" aria-current="page">{{ 'cart.title' | translate }}</li>
              </ol>
            </nav>
            <h2 class="fw-bold m-0 text-dark">{{ 'cart.title' | translate }}</h2>
          </div>
          @if (basketService.itemCount() > 0) {
            <span class="badge bg-orange text-white px-3 py-2 rounded-pill fs-6 fw-semibold">
              {{ basketService.itemCount() }} {{ 'cart.items' | translate }}
            </span>
          }
        </div>

        @if (basketService.basket() && basketService.basket()!.items.length > 0) {
          <div class="row g-4">
            <!-- Items Table/List -->
            <div class="col-lg-8">
              <div class="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                <div class="card-header bg-white py-3 px-4 border-bottom d-flex justify-content-between align-items-center">
                  <h6 class="fw-bold m-0 text-dark">{{ 'cart.title' | translate }}</h6>
                  <button class="btn btn-sm text-danger btn-link text-decoration-none fw-semibold p-0" (click)="clearBasket()">
                    <i class="fa-regular fa-trash-can me-1"></i> {{ 'cart.clearCart' | translate }}
                  </button>
                </div>
                <div class="card-body p-0">
                  <div class="table-responsive">
                    <table class="table table-borderless align-middle mb-0">
                      <thead class="bg-light text-muted small text-uppercase">
                        <tr>
                          <th class="ps-4 py-3">{{ 'invoice.product' | translate }}</th>
                          <th class="py-3">{{ 'invoice.price' | translate }}</th>
                          <th class="py-3 text-center">{{ 'invoice.qty' | translate }}</th>
                          <th class="py-3">{{ 'invoice.total' | translate }}</th>
                          <th class="pe-4 py-3 text-end">{{ 'cart.remove' | translate }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (item of basketService.basket()!.items; track item.id) {
                          <tr class="border-bottom">
                            <!-- Product thumbnail & title -->
                            <td class="ps-4 py-3">
                              <div class="d-flex align-items-center gap-3">
                                <img 
                                  [src]="getItemImageUrl(item.pictureUrl)" 
                                  [alt]="item.productName"
                                  class="rounded-3 border object-fit-contain bg-white p-1"
                                  style="width: 64px; height: 64px;"
                                  (error)="onImgError($event)">
                                <div>
                                  <a [routerLink]="['/shop', item.id]" class="fw-bold text-dark text-decoration-none line-clamp-1 hover-orange">
                                    {{ item.productName }}
                                  </a>
                                  <div class="small text-muted">
                                    <span class="me-2">{{ item.brand }}</span> | <span>{{ item.type }}</span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            <!-- Unit Price -->
                            <td class="py-3 fw-semibold text-dark">
                              {{ item.price | currency }}
                            </td>

                            <!-- Quantity Controls -->
                            <td class="py-3 text-center">
                              <div class="d-inline-flex align-items-center bg-light rounded-pill border p-1">
                                <button 
                                  class="btn btn-sm btn-white rounded-circle shadow-xs p-0 d-flex align-items-center justify-content-center"
                                  style="width: 28px; height: 28px;"
                                  (click)="decrementItem(item)">
                                  <i class="fa-solid fa-minus small text-muted"></i>
                                </button>
                                <span class="fw-bold px-3 text-dark small">{{ item.quantity }}</span>
                                <button 
                                  class="btn btn-sm btn-white rounded-circle shadow-xs p-0 d-flex align-items-center justify-content-center"
                                  style="width: 28px; height: 28px;"
                                  (click)="incrementItem(item)">
                                  <i class="fa-solid fa-plus small text-muted"></i>
                                </button>
                              </div>
                            </td>

                            <!-- Line Total -->
                            <td class="py-3 fw-bold text-orange">
                              {{ (item.price * item.quantity) | currency }}
                            </td>

                            <!-- Remove button -->
                            <td class="pe-4 py-3 text-end">
                              <button 
                                class="btn btn-sm btn-outline-danger rounded-circle p-0 d-inline-flex align-items-center justify-content-center shadow-xs"
                                style="width: 32px; height: 32px;"
                                [title]="'cart.remove' | translate"
                                (click)="removeItem(item.id)">
                                <i class="fa-solid fa-xmark"></i>
                              </button>
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
                <div class="card-footer bg-white py-3 px-4 d-flex justify-content-between align-items-center">
                  <a routerLink="/shop" class="btn btn-outline-secondary rounded-pill px-4 fw-semibold btn-sm">
                    <i class="fa-solid fa-arrow-left me-2"></i>{{ 'cart.continueShopping' | translate }}
                  </a>
                </div>
              </div>

              <!-- Perks Cards -->
              <div class="row g-3">
                <div class="col-sm-4">
                  <div class="card border-0 shadow-xs rounded-4 p-3 bg-white text-center">
                    <i class="fa-solid fa-truck-fast text-orange fs-4 mb-2"></i>
                    <h6 class="fw-bold small mb-1">{{ 'product.freeDelivery' | translate }}</h6>
                    <span class="text-muted" style="font-size: 0.75rem;">{{ 'product.freeDeliveryDesc' | translate }}</span>
                  </div>
                </div>
                <div class="col-sm-4">
                  <div class="card border-0 shadow-xs rounded-4 p-3 bg-white text-center">
                    <i class="fa-solid fa-shield-halved text-success fs-4 mb-2"></i>
                    <h6 class="fw-bold small mb-1">{{ 'product.securePayment' | translate }}</h6>
                    <span class="text-muted" style="font-size: 0.75rem;">{{ 'product.securePaymentDesc' | translate }}</span>
                  </div>
                </div>
                <div class="col-sm-4">
                  <div class="card border-0 shadow-xs rounded-4 p-3 bg-white text-center">
                    <i class="fa-solid fa-rotate-left text-primary fs-4 mb-2"></i>
                    <h6 class="fw-bold small mb-1">{{ 'home.feature4Title' | translate }}</h6>
                    <span class="text-muted" style="font-size: 0.75rem;">{{ 'home.feature4Desc' | translate }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Order Summary Card -->
            <div class="col-lg-4">
              <div class="card border-0 shadow-sm rounded-4 p-4 sticky-top" style="top: 100px;">
                <h5 class="fw-bold text-dark mb-3">{{ 'checkout.orderSummary' | translate }}</h5>

                <!-- Promo code input -->
                <div class="mb-4">
                  <label class="form-label small fw-semibold text-muted">Promo Code</label>
                  <div class="input-group">
                    <input 
                      type="text" 
                      class="form-control rounded-start-pill ps-3 text-uppercase" 
                      placeholder="e.g. PRIME50" 
                      [(ngModel)]="promoCode"
                      [disabled]="discountApplied">
                    <button 
                      class="btn btn-outline-secondary rounded-end-pill px-3 fw-semibold" 
                      type="button" 
                      (click)="applyPromo()"
                      [disabled]="discountApplied">
                      {{ discountApplied ? 'Applied' : 'Apply' }}
                    </button>
                  </div>
                  @if (discountApplied) {
                    <div class="small text-success mt-1 fw-semibold d-flex align-items-center gap-1">
                      <i class="fa-solid fa-circle-check"></i> Code applied: -$5.00 off!
                    </div>
                  }
                </div>

                <!-- Price breakdown -->
                <div class="price-breakdown border-bottom pb-3 mb-3">
                  <div class="d-flex justify-content-between mb-2">
                    <span class="text-muted">{{ 'cart.subtotal' | translate }}</span>
                    <span class="fw-semibold text-dark">{{ basketService.basketTotal().subtotal | currency }}</span>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <span class="text-muted">{{ 'cart.shipping' | translate }}</span>
                    <span class="fw-semibold text-dark">
                      @if (basketService.basketTotal().shipping === 0) {
                        <span class="text-success fw-bold">{{ 'cart.freeShipping' | translate }}</span>
                      } @else {
                        {{ basketService.basketTotal().shipping | currency }}
                      }
                    </span>
                  </div>
                  @if (discountApplied) {
                    <div class="d-flex justify-content-between mb-2 text-success">
                      <span>Promo Discount</span>
                      <span class="fw-semibold">-$5.00</span>
                    </div>
                  }
                </div>

                <!-- Total -->
                <div class="d-flex justify-content-between align-items-center mb-4">
                  <span class="fs-5 fw-bold text-dark">{{ 'checkout.total' | translate }}</span>
                  <span class="fs-4 fw-black text-orange">
                    {{ (basketService.basketTotal().total - (discountApplied ? 5 : 0)) | currency }}
                  </span>
                </div>

                <!-- Checkout CTA -->
                <a routerLink="/checkout" class="btn btn-orange btn-lg w-100 rounded-pill py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 mb-3">
                  <span>{{ 'cart.checkoutBtn' | translate }}</span>
                  <i class="fa-solid fa-arrow-right"></i>
                </a>

                <div class="text-center">
                  <span class="text-muted small">
                    <i class="fa-solid fa-lock text-muted me-1"></i> {{ 'product.securePayment' | translate }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        } @else {
          <!-- Empty Cart View -->
          <div class="card border-0 shadow-sm rounded-4 text-center py-5 px-3 my-4">
            <div class="empty-cart-icon bg-light rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center" style="width: 110px; height: 110px;">
              <i class="fa-solid fa-basket-shopping fs-1 text-orange opacity-75"></i>
            </div>
            <h3 class="fw-bold mb-2">{{ 'cart.emptyTitle' | translate }}</h3>
            <p class="text-muted mx-auto mb-4" style="max-width: 440px;">
              {{ 'cart.emptyDesc' | translate }}
            </p>
            <div>
              <a routerLink="/shop" class="btn btn-orange btn-lg rounded-pill px-5 fw-bold shadow-sm">
                <i class="fa-solid fa-bag-shopping me-2"></i>{{ 'cart.startShopping' | translate }}
              </a>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .line-clamp-1 {
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .hover-orange:hover {
      color: var(--tp-primary) !important;
    }
    .shadow-xs {
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }
  `]
})
export class CartComponent {
  basketService = inject(BasketService);
  toast = inject(ToastService);

  getItemImageUrl(pictureUrl: string | undefined): string {
    if (!pictureUrl) return 'assets/placeholder.svg';
    const filename = pictureUrl.split('/').pop() || '';
    if (filename && (filename.endsWith('.png') || filename.endsWith('.jpg') || filename.endsWith('.svg') || filename.endsWith('.webp'))) {
      return `assets/images/Products/${filename}`;
    }
    return pictureUrl;
  }

  promoCode = '';
  discountApplied = false;

  incrementItem(item: BasketItem) {
    this.basketService.incrementItemQuantity(item);
  }

  decrementItem(item: BasketItem) {
    this.basketService.decrementItemQuantity(item);
  }

  removeItem(id: number) {
    this.basketService.removeItemFromBasket(id);
    this.toast.info('Item removed from basket');
  }

  clearBasket() {
    const basket = this.basketService.basket();
    if (basket) {
      this.basketService.deleteBasket(basket.id);
      this.toast.info('Basket cleared');
    }
  }

  applyPromo() {
    if (this.promoCode.trim().toUpperCase() === 'PRIME50' || this.promoCode.trim().toUpperCase() === 'TALABAT10') {
      this.discountApplied = true;
      this.toast.success('Promo code applied successfully!');
    } else {
      this.toast.error('Invalid promo code. Try PRIME50');
    }
  }

  private readonly FALLBACK_IMG = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23ff5a00' stroke-width='1.5'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' stroke='%23cbd5e1'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5' stroke='%23ff5a00'/%3E%3Cpath d='m21 15-5-5L5 21' stroke='%2394a3b8'/%3E%3C/svg%3E";

  onImgError(event: Event) {
    const target = event.target as HTMLImageElement;
    if (target && !target.src.startsWith('data:')) {
      target.src = this.FALLBACK_IMG;
    }
  }
}
