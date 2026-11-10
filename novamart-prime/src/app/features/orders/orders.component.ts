import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Order } from '../../core/models/order.model';
import { OrdersService } from '../../core/services/orders.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  template: `
    <div class="orders-page py-5">
      <div class="container-xl">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb mb-1 small text-muted">
                <li class="breadcrumb-item"><a routerLink="/" class="text-decoration-none text-muted">{{ 'shop.breadcrumbHome' | translate }}</a></li>
                <li class="breadcrumb-item active text-orange fw-semibold" aria-current="page">{{ 'orders.title' | translate }}</li>
              </ol>
            </nav>
            <h2 class="fw-bold m-0 text-dark">{{ 'orders.title' | translate }}</h2>
            <p class="text-muted small m-0">{{ 'orders.subtitle' | translate }}</p>
          </div>
          @if (orders().length > 0) {
            <span class="badge bg-light text-dark border px-3 py-2 rounded-pill fw-semibold">
              {{ 'orders.title' | translate }}: {{ orders().length }}
            </span>
          }
        </div>

        @if (isLoading()) {
          <div class="card border-0 shadow-sm rounded-4 p-4">
            @for (placeholder of [1,2,3]; track placeholder) {
              <div class="skeleton-box rounded-3 w-100 mb-3" style="height: 60px;"></div>
            }
          </div>
        } @else if (orders().length > 0) {
          <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <thead class="bg-light text-muted small text-uppercase">
                  <tr>
                    <th class="ps-4 py-3">{{ 'orders.orderNum' | translate }}</th>
                    <th class="py-3">{{ 'invoice.date' | translate }}</th>
                    <th class="py-3">{{ 'cart.items' | translate }}</th>
                    <th class="py-3">{{ 'checkout.stepDelivery' | translate }}</th>
                    <th class="py-3">{{ 'invoice.total' | translate }}</th>
                    <th class="py-3">{{ 'success.orderStatus' | translate }}</th>
                    <th class="pe-4 py-3 text-end">{{ 'orders.viewDetails' | translate }}</th>
                  </tr>
                </thead>
                <tbody>
                  @for (order of orders(); track order.id) {
                    <tr>
                      <td class="ps-4 py-3 font-monospace small fw-bold text-dark">
                        #{{ order.id.substring(0, 8) }}...
                      </td>
                      <td class="py-3 small text-muted">
                        {{ order.orderDate | date:'mediumDate' }}
                        <div class="text-muted" style="font-size: 0.72rem;">{{ order.orderDate | date:'shortTime' }}</div>
                      </td>
                      <td class="py-3 small">
                        <span class="badge bg-light text-dark border rounded-pill px-2.5 py-1">
                          {{ order.items ? order.items.length : 0 }} {{ 'cart.items' | translate }}
                        </span>
                      </td>
                      <td class="py-3 small text-muted">
                        {{ order.deliveryMethod || 'Standard' }}
                      </td>
                      <td class="py-3 fw-bold text-orange">
                        {{ order.total | currency }}
                      </td>
                      <td class="py-3">
                        <span class="badge rounded-pill px-3 py-1.5 fw-semibold" [ngClass]="getStatusBadgeClass(order.status)">
                          {{ order.status }}
                        </span>
                      </td>
                      <td class="pe-4 py-3 text-end">
                        <a [routerLink]="['/orders', order.id]" class="btn btn-sm btn-outline-secondary rounded-pill px-3 fw-semibold">
                          {{ 'orders.viewDetails' | translate }} <i class="fa-solid fa-arrow-right ms-1"></i>
                        </a>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        } @else {
          <!-- Empty State -->
          <div class="card border-0 shadow-sm rounded-4 text-center py-5 px-3">
            <div class="empty-icon bg-light rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style="width: 80px; height: 80px;">
              <i class="fa-solid fa-clock-rotate-left fs-2 text-muted"></i>
            </div>
            <h4 class="fw-bold mb-1">{{ 'orders.emptyTitle' | translate }}</h4>
            <p class="text-muted small mx-auto mb-4" style="max-width: 400px;">
              {{ 'orders.emptyDesc' | translate }}
            </p>
            <div>
              <a routerLink="/shop" class="btn btn-orange rounded-pill px-4 py-2.5 fw-bold shadow-sm">
                <i class="fa-solid fa-bag-shopping me-2"></i>{{ 'cart.startShopping' | translate }}
              </a>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .table > :not(caption) > * > * {
      padding: 1rem 0.75rem;
    }
  `]
})
export class OrdersComponent implements OnInit {
  private ordersService = inject(OrdersService);

  orders = signal<Order[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.ordersService.getOrders().subscribe({
      next: res => {
        this.orders.set(res || []);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
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
}
