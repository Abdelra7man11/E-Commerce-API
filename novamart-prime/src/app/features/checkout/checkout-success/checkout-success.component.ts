import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
                Order Confirmed
              </span>

              <h2 class="fw-black text-dark mb-2">Thank You For Your Order!</h2>
              <p class="text-muted mb-4 fs-6">
                Your order has been received and is now being carefully prepared. We'll deliver it straight to your doorstep in no time!
              </p>

              @if (orderId) {
                <div class="order-id-box p-3 bg-light rounded-4 mb-4 border border-dashed">
                  <div class="text-muted small fw-semibold text-uppercase tracking-wider mb-1">Your Order Reference</div>
                  <div class="fw-bold font-monospace text-dark fs-6 text-break">{{ orderId }}</div>
                </div>
              }

              <!-- Highlights -->
              <div class="row g-2 mb-4 text-start">
                <div class="col-6">
                  <div class="p-3 bg-light rounded-3 border h-100">
                    <i class="fa-solid fa-bell-concierge text-orange mb-1"></i>
                    <div class="fw-bold small text-dark">Kitchen Prep</div>
                    <span class="text-muted" style="font-size: 0.72rem;">Order is queued</span>
                  </div>
                </div>
                <div class="col-6">
                  <div class="p-3 bg-light rounded-3 border h-100">
                    <i class="fa-solid fa-moped text-success mb-1"></i>
                    <div class="fw-bold small text-dark">Express Rider</div>
                    <span class="text-muted" style="font-size: 0.72rem;">30-45 mins delivery</span>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="d-flex flex-column flex-sm-row justify-content-center gap-2">
                @if (orderId) {
                  <a [routerLink]="['/orders', orderId]" class="btn btn-orange rounded-pill px-4 py-2.5 fw-bold shadow-sm">
                    <i class="fa-solid fa-receipt me-2"></i>View Order Details
                  </a>
                }
                <a routerLink="/orders" class="btn btn-outline-secondary rounded-pill px-4 py-2.5 fw-semibold">
                  <i class="fa-solid fa-clock-rotate-left me-2"></i>All My Orders
                </a>
                <a routerLink="/" class="btn btn-light rounded-pill px-4 py-2.5 fw-semibold text-muted">
                  Home
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

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id');
  }
}
