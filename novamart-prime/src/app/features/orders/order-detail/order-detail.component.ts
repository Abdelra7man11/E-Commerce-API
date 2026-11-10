import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Order } from '../../../core/models/order.model';
import { OrdersService } from '../../../core/services/orders.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  template: `
    <div class="order-detail-page py-5">
      <div class="container-xl">
        <!-- Breadcrumb (Hidden during print) -->
        <nav aria-label="breadcrumb" class="mb-4 no-print">
          <ol class="breadcrumb small">
            <li class="breadcrumb-item"><a routerLink="/" class="text-decoration-none text-muted">{{ 'shop.breadcrumbHome' | translate }}</a></li>
            <li class="breadcrumb-item"><a routerLink="/orders" class="text-decoration-none text-muted">{{ 'nav.orders' | translate }}</a></li>
            <li class="breadcrumb-item active text-orange fw-semibold" aria-current="page">{{ 'invoice.title' | translate }}</li>
          </ol>
        </nav>

        @if (isLoading()) {
          <div class="card border-0 shadow-sm rounded-4 p-4 no-print">
            <div class="skeleton-box rounded-3 w-50 mb-4" style="height: 36px;"></div>
            <div class="skeleton-box rounded-3 w-100 mb-3" style="height: 120px;"></div>
            <div class="skeleton-box rounded-3 w-100" style="height: 200px;"></div>
          </div>
        } @else if (order()) {
          <div class="card border-0 shadow-sm rounded-4 overflow-hidden bg-white mb-4 invoice-card">
            <!-- Official Printable Header (Visible ONLY on print) -->
            <div class="d-none print-only px-4 pt-4 pb-3 border-bottom mb-4">
              <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center gap-2">
                  <div style="width: 40px; height: 40px; border-radius: 10px; background: #ff5a00; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.25rem;">
                    N
                  </div>
                  <div>
                    <h4 class="fw-black m-0" style="color: #0f172a; font-size: 1.3rem;">Nova<span style="color: #ff5a00;">Mart</span> PRIME</h4>
                    <small class="text-muted" style="font-size: 0.8rem;">{{ 'invoice.title' | translate }}</small>
                  </div>
                </div>
                <div class="text-end">
                  <div class="fw-bold fs-6" style="color: #0f172a;">{{ 'orders.orderNum' | translate }} {{ order()!.id }}</div>
                  <div class="small text-muted">{{ 'invoice.date' | translate }}: {{ order()!.orderDate | date:'mediumDate' }}</div>
                </div>
              </div>
            </div>

            <!-- Invoice Header Banner -->
            <div class="p-4 p-md-5 border-bottom bg-light d-flex flex-wrap justify-content-between align-items-center gap-3">
              <div>
                <span class="badge rounded-pill px-3 py-1.5 fw-bold mb-2" [ngClass]="getStatusBadgeClass(order()!.status)">
                  {{ order()!.status }}
                </span>
                <h3 class="fw-black text-dark m-0">{{ 'invoice.title' | translate }}</h3>
                <div class="text-muted small mt-1 font-monospace">{{ 'success.orderId' | translate }} {{ order()!.id }}</div>
              </div>

              <!-- Action buttons (Hidden on Print) -->
              <div class="d-flex align-items-center gap-2 no-print">
                <button class="btn btn-outline-secondary rounded-pill px-3 py-2 btn-sm fw-semibold" (click)="printInvoice()">
                  <i class="fa-solid fa-print me-1.5"></i> {{ 'success.printInvoice' | translate }}
                </button>
                <a routerLink="/orders" class="btn btn-light border rounded-pill px-3 py-2 btn-sm fw-semibold text-muted">
                  <i class="fa-solid fa-arrow-left me-1"></i> {{ 'nav.myOrders' | translate }}
                </a>
              </div>
            </div>

            <div class="card-body p-4 p-md-5">
              <!-- Meta Info Grid -->
              <div class="row g-4 mb-5 pb-4 border-bottom">
                <div class="col-sm-6 col-lg-3">
                  <div class="small text-muted fw-bold text-uppercase mb-1">{{ 'invoice.date' | translate }}</div>
                  <div class="fw-semibold text-dark">{{ order()!.orderDate | date:'mediumDate' }}</div>
                  <div class="small text-muted">{{ order()!.orderDate | date:'shortTime' }}</div>
                </div>

                <div class="col-sm-6 col-lg-3">
                  <div class="small text-muted fw-bold text-uppercase mb-1">{{ 'invoice.customer' | translate }}</div>
                  <div class="fw-semibold text-dark">{{ order()!.shipToAddress.firstName }} {{ order()!.shipToAddress.lastName }}</div>
                  <div class="small text-muted text-break">{{ order()!.buyerEmail }}</div>
                </div>

                <div class="col-sm-6 col-lg-3">
                  <div class="small text-muted fw-bold text-uppercase mb-1">{{ 'invoice.address' | translate }}</div>
                  <div class="fw-semibold text-dark">{{ order()!.shipToAddress.street }}</div>
                  <div class="small text-muted">{{ order()!.shipToAddress.city }}, {{ order()!.shipToAddress.country }}</div>
                </div>

                <div class="col-sm-6 col-lg-3">
                  <div class="small text-muted fw-bold text-uppercase mb-1">{{ 'invoice.payment' | translate }}</div>
                  <div class="fw-semibold text-dark">{{ order()!.deliveryMethod }}</div>
                  <div class="small text-orange fw-bold mt-1 d-flex align-items-center gap-1.5">
                    <i [class]="getPaymentIcon()"></i>
                    <span>{{ getPaymentMethodText() }}</span>
                  </div>
                </div>
              </div>

              <!-- Ordered Items Table -->
              <h5 class="fw-bold text-dark mb-3">{{ 'cart.title' | translate }}</h5>
              <div class="table-responsive mb-4">
                <table class="table align-middle">
                  <thead class="bg-light text-muted small text-uppercase">
                    <tr>
                      <th class="ps-3 py-2">{{ 'invoice.product' | translate }}</th>
                      <th class="py-2">{{ 'invoice.price' | translate }}</th>
                      <th class="py-2 text-center">{{ 'invoice.qty' | translate }}</th>
                      <th class="pe-3 py-2 text-end">{{ 'invoice.total' | translate }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (item of order()!.items; track item.productId) {
                      <tr>
                        <td class="ps-3 py-3">
                          <div class="d-flex align-items-center gap-3">
                            <img [src]="item.pictureUrl || 'assets/placeholder.svg'" (error)="onImgError($event)" class="rounded-3 border object-fit-contain bg-white p-1" style="width: 50px; height: 50px;">
                            <span class="fw-semibold text-dark">{{ item.productName }}</span>
                          </div>
                        </td>
                        <td class="py-3 text-muted">{{ item.price | currency }}</td>
                        <td class="py-3 text-center fw-bold">{{ item.quantity }}</td>
                        <td class="pe-3 py-3 text-end fw-bold text-dark">{{ (item.price * item.quantity) | currency }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>

              <!-- Financial Totals -->
              <div class="row justify-content-end">
                <div class="col-md-5">
                  <div class="bg-light p-4 rounded-4 border">
                    <div class="d-flex justify-content-between mb-2 small">
                      <span class="text-muted">{{ 'invoice.subtotal' | translate }}</span>
                      <span class="fw-semibold text-dark">{{ order()!.subtotal | currency }}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2 small">
                      <span class="text-muted">{{ 'invoice.shipping' | translate }}</span>
                      <span class="fw-semibold text-dark">{{ order()!.deliveryCost | currency }}</span>
                    </div>
                    <hr class="my-3 opacity-25">
                    <div class="d-flex justify-content-between align-items-center">
                      <span class="fw-bold fs-5 text-dark">{{ 'invoice.grandTotal' | translate }}</span>
                      <span class="fw-black fs-4 text-orange">{{ order()!.total | currency }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Official Print Footer (Visible ONLY on print) -->
              <div class="d-none print-only border-top pt-4 mt-5 text-center text-muted small">
                <p class="mb-1 fw-bold" style="color: #0f172a;">{{ 'invoice.thankYou' | translate }}</p>
                <p class="mb-0" style="font-size: 0.8rem;">This is a computer-generated tax invoice. For support or inquiries, please contact support&#64;novamart.com</p>
              </div>
            </div>
          </div>
        } @else {
          <!-- Not Found -->
          <div class="card border-0 shadow-sm rounded-4 text-center py-5">
            <i class="fa-solid fa-file-circle-question fs-1 text-muted mb-3"></i>
            <h4 class="fw-bold">Order Not Found</h4>
            <p class="text-muted small mb-4">We could not locate this order in your account.</p>
            <div>
              <a routerLink="/orders" class="btn btn-orange rounded-pill px-4 py-2 fw-semibold">
                {{ 'nav.myOrders' | translate }}
              </a>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class OrderDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private ordersService = inject(OrdersService);

  order = signal<Order | null>(null);
  isLoading = signal<boolean>(true);
  paymentInfo: any = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      try {
        const saved = localStorage.getItem(`tp_order_payment_${id}`);
        if (saved) {
          this.paymentInfo = JSON.parse(saved);
        }
      } catch (e) {
        console.warn('Could not read payment info', e);
      }

      this.ordersService.getOrderDetailed(id).subscribe({
        next: o => {
          this.order.set(o);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        }
      });
    }
  }

  getPaymentMethodText(): string {
    if (this.paymentInfo?.provider) {
      return this.paymentInfo.provider;
    }
    return 'Credit / Debit Card';
  }

  getPaymentIcon(): string {
    if (this.paymentInfo?.method === 'cash') return 'fa-solid fa-money-bill-wave text-success';
    if (this.paymentInfo?.method === 'wallet') return 'fa-solid fa-mobile-screen-button text-danger';
    return 'fa-regular fa-credit-card text-primary';
  }

  getStatusBadgeClass(status: string): string {
    const s = (status || '').toLowerCase();
    if (s.includes('received') || s.includes('delivered') || s.includes('complete')) {
      return 'bg-success-subtle text-success';
    }
    if (s.includes('failed') || s.includes('cancel')) {
      return 'bg-danger-subtle text-danger';
    }
    return 'bg-warning-subtle text-warning';
  }

  printInvoice() {
    window.print();
  }

  private readonly FALLBACK_IMG = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23ff5a00' stroke-width='1.5'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' stroke='%23cbd5e1'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5' stroke='%23ff5a00'/%3E%3Cpath d='m21 15-5-5L5 21' stroke='%2394a3b8'/%3E%3C/svg%3E";

  onImgError(event: Event) {
    const target = event.target as HTMLImageElement;
    if (target && !target.src.startsWith('data:')) {
      target.src = this.FALLBACK_IMG;
    }
  }
}
