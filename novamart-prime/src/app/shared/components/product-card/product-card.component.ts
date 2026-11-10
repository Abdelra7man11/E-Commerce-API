import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { BasketService } from '../../../core/services/basket.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  template: `
    <div class="card h-100 tp-card border-0 overflow-hidden position-relative group">
      <!-- Badge for Category / Type -->
      <div class="position-absolute top-0 start-0 m-3 z-1">
        <span class="tp-badge shadow-sm">{{ product.productType }}</span>
      </div>

      <!-- Image container -->
      <a [routerLink]="['/shop', product.id]" class="d-block overflow-hidden text-center p-3" style="height: 220px; background-color: var(--tp-surface-subtle);">
        <img [src]="product.pictureUrl" [alt]="product.name"
             class="img-fluid h-100 object-fit-contain product-img transition"
             (error)="onImgError($event)">
      </a>

      <!-- Card Body -->
      <div class="card-body p-3 d-flex flex-column justify-content-between">
        <div>
          <div class="d-flex align-items-center justify-content-between mb-1">
            <span class="text-uppercase text-muted fw-bold" style="font-size: 0.75rem; letter-spacing: 0.5px;">
              {{ product.productBrand }}
            </span>
            <div class="text-warning small">
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star-half-stroke"></i>
            </div>
          </div>

          <h6 class="card-title fw-bold text-dark mb-2 text-truncate" [title]="product.name">
            <a [routerLink]="['/shop', product.id]" class="text-decoration-none text-dark hover-orange">
              {{ product.name }}
            </a>
          </h6>

          <p class="card-text text-muted small line-clamp-2 mb-3" style="min-height: 38px;">
            {{ product.description }}
          </p>
        </div>

        <div class="d-flex align-items-center justify-content-between pt-2 border-top">
          <div>
            <span class="text-muted small d-block" style="font-size: 0.7rem;">{{ 'product.price' | translate }}</span>
            <span class="fw-bolder fs-5" style="color: var(--tp-primary);">
              {{ product.price | currency }}
            </span>
          </div>

          <button class="btn btn-tp-primary rounded-circle p-2 d-flex align-items-center justify-content-center"
                  style="width: 42px; height: 42px;"
                  (click)="addToCart($event)"
                  [title]="'product.addToCart' | translate">
            <i class="fa-solid fa-plus fs-6"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-img {
      transition: transform 0.4s ease;
    }
    .group:hover .product-img {
      transform: scale(1.08);
    }
    .hover-orange:hover {
      color: var(--tp-primary) !important;
    }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  private basketService = inject(BasketService);

  addToCart(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.basketService.addItemToBasket(this.product, 1);
  }

  private readonly FALLBACK_IMG = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 24 24' fill='none' stroke='%23ff5a00' stroke-width='1.5'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' stroke='%23cbd5e1'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5' stroke='%23ff5a00'/%3E%3Cpath d='m21 15-5-5L5 21' stroke='%2394a3b8'/%3E%3C/svg%3E";

  onImgError(event: Event) {
    const target = event.target as HTMLImageElement;
    if (target && !target.src.startsWith('data:')) {
      target.src = this.FALLBACK_IMG;
    }
  }
}
