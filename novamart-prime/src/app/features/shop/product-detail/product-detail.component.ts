import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { BasketService } from '../../../core/services/basket.service';
import { LanguageService } from '../../../core/services/language.service';
import { ShopService } from '../../../core/services/shop.service';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent, TranslatePipe],
  template: `
    <div class="product-detail-page py-5">
      <div class="container-xl">
        <!-- Breadcrumb -->
        <nav aria-label="breadcrumb" class="mb-4">
          <ol class="breadcrumb small">
            <li class="breadcrumb-item"><a routerLink="/" class="text-decoration-none text-muted">{{ 'shop.breadcrumbHome' | translate }}</a></li>
            <li class="breadcrumb-item"><a routerLink="/shop" class="text-decoration-none text-muted">{{ 'shop.breadcrumbCatalog' | translate }}</a></li>
            @if (product()) {
              <li class="breadcrumb-item"><a [routerLink]="['/shop']" [queryParams]="{ brandId: 0 }" class="text-decoration-none text-muted">{{ product()?.productBrand }}</a></li>
              <li class="breadcrumb-item active text-orange fw-semibold" aria-current="page">{{ product()?.name }}</li>
            }
          </ol>
        </nav>

        @if (isLoading()) {
          <div class="row g-5 align-items-center">
            <div class="col-lg-6">
              <div class="skeleton-box rounded-4" style="height: 450px;"></div>
            </div>
            <div class="col-lg-6">
              <div class="skeleton-box rounded w-25 mb-3" style="height: 24px;"></div>
              <div class="skeleton-box rounded w-75 mb-3" style="height: 40px;"></div>
              <div class="skeleton-box rounded w-50 mb-4" style="height: 32px;"></div>
              <div class="skeleton-box rounded w-100 mb-4" style="height: 120px;"></div>
              <div class="skeleton-box rounded w-50" style="height: 50px;"></div>
            </div>
          </div>
        } @else if (product()) {
          <div class="row g-5 align-items-center mb-5">
            <!-- Product Gallery / Image -->
            <div class="col-lg-6">
              <div class="product-gallery-card card border-0 shadow-sm rounded-4 overflow-hidden position-relative p-4 bg-white text-center">
                <span class="badge bg-orange text-white position-absolute top-0 start-0 m-4 px-3 py-2 rounded-pill fw-semibold shadow-xs">
                  <i class="fa-solid fa-sparkles me-1"></i> Fresh Arrival
                </span>
                <img 
                  [src]="displayImageUrl" 
                  [alt]="product()?.name" 
                  class="img-fluid object-fit-contain mx-auto"
                  style="max-height: 420px; transition: transform 0.3s ease;"
                  (error)="onImgError($event)">
              </div>
            </div>

            <!-- Product Info -->
            <div class="col-lg-6">
              <div class="product-info-wrap">
                <!-- Badges -->
                <div class="d-flex align-items-center gap-2 mb-2">
                  <span class="badge bg-light text-dark border px-3 py-1.5 rounded-pill fw-semibold">
                    <i class="fa-solid fa-tag text-orange me-1.5"></i>{{ product()?.productBrand }}
                  </span>
                  <span class="badge bg-light text-muted border px-3 py-1.5 rounded-pill fw-medium">
                    <i class="fa-solid fa-layer-group me-1.5"></i>{{ product()?.productType }}
                  </span>
                  <span class="badge bg-success-subtle text-success px-3 py-1.5 rounded-pill fw-semibold ms-auto">
                    <i class="fa-solid fa-circle-check me-1"></i> {{ 'product.inStock' | translate }}
                  </span>
                </div>

                <h1 class="fw-bold text-dark mb-2 display-6">{{ product()?.name }}</h1>

                <!-- Rating Mock -->
                <div class="d-flex align-items-center gap-2 mb-3">
                  <div class="text-warning small">
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star-half-stroke"></i>
                  </div>
                  <span class="small fw-bold text-dark">4.8</span>
                  <span class="small text-muted">(124 verified reviews)</span>
                </div>

                <!-- Price -->
                <div class="price-box mb-4 p-3 bg-light rounded-4 d-inline-flex align-items-baseline gap-2">
                  <span class="fs-1 fw-black text-orange lh-1">{{ product()?.price | currency }}</span>
                  <span class="text-muted text-decoration-line-through small">{{ ((product()?.price || 0) * 1.15) | currency }}</span>
                  <span class="badge bg-danger-subtle text-danger rounded-pill fw-bold ms-2">Save 15%</span>
                </div>

                <!-- Description -->
                <p class="text-secondary mb-4 leading-relaxed fs-6">
                  {{ product()?.description }}
                </p>

                <!-- Quantity & Actions -->
                <div class="d-flex flex-wrap align-items-center gap-3 mb-4">
                  <div class="quantity-selector d-flex align-items-center bg-light rounded-pill border p-1">
                    <button class="btn btn-sm btn-white rounded-circle shadow-xs" type="button" (click)="decrementQuantity()">
                      <i class="fa-solid fa-minus small"></i>
                    </button>
                    <span class="fw-bold px-3 text-dark fs-5">{{ quantity }}</span>
                    <button class="btn btn-sm btn-white rounded-circle shadow-xs" type="button" (click)="incrementQuantity()">
                      <i class="fa-solid fa-plus small"></i>
                    </button>
                  </div>

                  <button 
                    class="btn btn-orange btn-lg rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2 flex-grow-1 flex-sm-grow-0"
                    (click)="addToBasket()">
                    <i class="fa-solid fa-bag-shopping"></i>
                    <span>{{ getButtonText() }}</span>
                  </button>
                </div>

                <!-- Guarantees Grid -->
                <div class="row g-2 pt-3 border-top">
                  <div class="col-sm-4">
                    <div class="d-flex align-items-center gap-2 p-2 bg-white rounded-3 border">
                      <i class="fa-solid fa-truck-fast text-orange fs-5"></i>
                      <div class="lh-sm">
                        <div class="fw-bold small text-dark">{{ 'product.freeDelivery' | translate }}</div>
                        <span class="text-muted" style="font-size: 0.75rem;">{{ 'product.freeDeliveryDesc' | translate }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="col-sm-4">
                    <div class="d-flex align-items-center gap-2 p-2 bg-white rounded-3 border">
                      <i class="fa-solid fa-shield-halved text-success fs-5"></i>
                      <div class="lh-sm">
                        <div class="fw-bold small text-dark">{{ 'home.feature2Title' | translate }}</div>
                        <span class="text-muted" style="font-size: 0.75rem;">{{ 'home.feature2Desc' | translate }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="col-sm-4">
                    <div class="d-flex align-items-center gap-2 p-2 bg-white rounded-3 border">
                      <i class="fa-solid fa-credit-card text-primary fs-5"></i>
                      <div class="lh-sm">
                        <div class="fw-bold small text-dark">{{ 'product.securePayment' | translate }}</div>
                        <span class="text-muted" style="font-size: 0.75rem;">{{ 'product.securePaymentDesc' | translate }}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <!-- Related Products Section -->
          @if (relatedProducts().length > 0) {
            <div class="related-section mt-5 pt-4 border-top">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h3 class="fw-bold text-dark m-0">{{ 'home.trendingTitle' | translate }}</h3>
                  <p class="text-muted small m-0">{{ 'home.trendingSubtitle' | translate }}</p>
                </div>
                <a routerLink="/shop" class="btn btn-sm btn-outline-secondary rounded-pill px-3 fw-semibold">
                  {{ 'shop.allCategories' | translate }} <i class="fa-solid fa-arrow-right ms-1"></i>
                </a>
              </div>

              <div class="row g-4">
                @for (item of relatedProducts(); track item.id) {
                  <div class="col-sm-6 col-md-3">
                    <app-product-card [product]="item"></app-product-card>
                  </div>
                }
              </div>
            </div>
          }
        } @else {
          <!-- Not Found State -->
          <div class="card border-0 shadow-sm rounded-4 text-center py-5">
            <i class="fa-solid fa-triangle-exclamation text-warning fs-1 mb-3"></i>
            <h4 class="fw-bold">{{ 'shop.emptyTitle' | translate }}</h4>
            <p class="text-muted small mb-4">{{ 'shop.emptyDesc' | translate }}</p>
            <div>
              <a routerLink="/shop" class="btn btn-orange rounded-pill px-4 py-2 fw-semibold">
                {{ 'product.backToCatalog' | translate }}
              </a>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .product-gallery-card:hover img {
      transform: scale(1.04);
    }
    .shadow-xs {
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }
    .quantity-selector .btn {
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ffffff;
      border: 1px solid #dee2e6;
    }
    .quantity-selector .btn:hover {
      background: var(--tp-primary);
      color: #fff;
      border-color: var(--tp-primary);
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private shopService = inject(ShopService);
  private basketService = inject(BasketService);
  private lang = inject(LanguageService);

  product = signal<Product | null>(null);
  relatedProducts = signal<Product[]>([]);
  isLoading = signal<boolean>(true);
  quantity = 1;

  get displayImageUrl(): string {
    const url = this.product()?.pictureUrl;
    if (!url) return 'assets/placeholder.svg';
    const filename = url.split('/').pop() || '';
    if (filename && (filename.endsWith('.png') || filename.endsWith('.jpg') || filename.endsWith('.svg') || filename.endsWith('.webp'))) {
      return `assets/images/Products/${filename}`;
    }
    return url;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadProduct(+id);
      }
    });
  }

  loadProduct(id: number) {
    this.isLoading.set(true);
    this.quantity = 1;
    this.shopService.getProduct(id).subscribe({
      next: p => {
        this.product.set(p);
        this.isLoading.set(false);
        this.loadRelatedProducts(p);
      },
      error: () => {
        this.product.set(null);
        this.isLoading.set(false);
      }
    });
  }

  loadRelatedProducts(prod: Product) {
    this.shopService.getProducts({
      brandId: 0,
      typeId: 0,
      sort: 'nameAsc',
      pageNumber: 1,
      pageSize: 4,
      search: ''
    }).subscribe({
      next: res => {
        this.relatedProducts.set(res.data.filter(p => p.id !== prod.id).slice(0, 4));
      }
    });
  }

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToBasket() {
    const prod = this.product();
    if (prod) {
      this.basketService.addItemToBasket(prod, this.quantity);
    }
  }

  getButtonText(): string {
    const prod = this.product();
    if (!prod) return this.lang.t('product.addToCart');
    const basket = this.basketService.basket();
    const existing = basket?.items.find(i => i.id === prod.id);
    if (existing) {
      return this.lang.isArabic()
        ? `أضف المزيد (${existing.quantity} بالسلة)`
        : `Add More (${existing.quantity} in cart)`;
    }
    return this.lang.t('product.addToCart');
  }

  private readonly FALLBACK_IMG = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 24 24' fill='none' stroke='%23ff5a00' stroke-width='1.5'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' stroke='%23cbd5e1'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5' stroke='%23ff5a00'/%3E%3Cpath d='m21 15-5-5L5 21' stroke='%2394a3b8'/%3E%3C/svg%3E";

  onImgError(event: Event) {
    const target = event.target as HTMLImageElement;
    if (target && !target.src.startsWith('data:')) {
      target.src = this.FALLBACK_IMG;
    }
  }
}
