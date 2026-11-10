import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  template: `
    <div class="checkout-success-page py-5">
      <div class="container-xl">
        <div class="row justify-content-center">
          <div class="col-md-8 col-lg-6">
            <div class="card border-0 shadow-lg rounded-5 text-center p-4 p-md-5 bg-white">
              <!-- Animated Success Checkmark -->
              <div class="success-icon-wrap mb-4 mx-auto d-flex align-items-center justify-content-center bg-success-subtle text-success rounded-circle" style="width: 100px; height: 100px;">
                <i class="fa-solid fa-check fs-1"></i>
              </div>

              <span class="badge bg-success-subtle text-success px-3 py-1.5 rounded-pill fw-bold mx-auto mb-3">
                {{ 'success.confirmed' | translate }}
              </span>

              <h2 class="fw-black text-dark mb-2">{{ 'success.title' | translate }}</h2>
              <p class="text-muted mb-4 fs-6">
                {{ 'success.subtitle' | translate }}
              </p>

              @if (orderId) {
                <div class="order-id-box p-3 bg-light rounded-4 mb-3 border border-dashed">
                  <div class="text-muted small fw-semibold text-uppercase tracking-wider mb-1">{{ 'success.orderId' | translate }}</div>
                  <div class="fw-bold font-monospace text-dark fs-6 text-break">{{ orderId }}</div>
                </div>
              }

              <!-- Payment Method Confirmation Banner -->
              <div class="p-3 rounded-4 mb-4 text-start border d-flex align-items-center gap-3"
                   [ngClass]="getPaymentBoxClass()">
                <div class="p-2.5 rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                     [ngClass]="getPaymentIconBg()">
                  <i [class]="getPaymentIcon() + ' fs-4'"></i>
                </div>
                <div class="lh-sm">
                  <div class="small text-muted fw-bold text-uppercase" style="font-size: 0.72rem;">{{ 'success.paymentMethod' | translate }}</div>
                  <div class="fw-bold text-dark fs-6">{{ paymentInfo?.provider || 'Credit Card' }}</div>
                  <div class="small text-muted mt-0.5">{{ paymentInfo?.details || 'Online Payment' }}</div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="d-flex flex-column flex-sm-row justify-content-center gap-2">
                @if (orderId) {
                  <a [routerLink]="['/orders', orderId]" class="btn btn-orange rounded-pill px-4 py-2.5 fw-bold shadow-sm">
                    <i class="fa-solid fa-receipt me-2"></i>{{ 'success.printInvoice' | translate }}
                  </a>
                }
                <a routerLink="/orders" class="btn btn-outline-secondary rounded-pill px-4 py-2.5 fw-semibold">
                  <i class="fa-solid fa-clock-rotate-left me-2"></i>{{ 'nav.myOrders' | translate }}
                </a>
                <a routerLink="/" class="btn btn-light rounded-pill px-4 py-2.5 fw-semibold text-muted">
                  {{ 'nav.home' | translate }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .success-icon-wrap {
      animation: scalePop 0.5s ease;
    }
    @keyframes scalePop {
      0% { transform: scale(0.6); opacity: 0; }
      70% { transform: scale(1.1); }
      100% { transform: scale(1); opacity: 1; }
    }
    .border-dashed {
      border-style: dashed !important;
    }
  `]
})
export class CheckoutSuccessComponent implements OnInit {
  private route = inject(ActivatedRoute);
  orderId: string | null = null;
  paymentInfo: any = null;

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id');
    if (this.orderId) {
      try {
        const saved = localStorage.getItem(`tp_order_payment_${this.orderId}`);
        if (saved) {
          this.paymentInfo = JSON.parse(saved);
        }
      } catch (e) {
        console.warn('Could not read payment info', e);
      }
    }
  }

  getPaymentBoxClass(): string {
    if (this.paymentInfo?.method === 'cash') return 'bg-success-subtle border-success-subtle';
    if (this.paymentInfo?.method === 'wallet') return 'bg-warning-subtle border-warning-subtle';
    return 'bg-light border';
  }

  getPaymentIconBg(): string {
    if (this.paymentInfo?.method === 'cash') return 'bg-success text-white';
    if (this.paymentInfo?.method === 'wallet') return 'bg-warning text-dark';
    return 'bg-primary text-white';
  }

  getPaymentIcon(): string {
    if (this.paymentInfo?.method === 'cash') return 'fa-solid fa-money-bill-wave';
    if (this.paymentInfo?.method === 'wallet') return 'fa-solid fa-mobile-screen-button';
    return 'fa-regular fa-credit-card';
  }
}
