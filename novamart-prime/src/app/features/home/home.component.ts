import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Brand, Product, ProductType, ShopParams } from '../../core/models/product.model';
import { ShopService } from '../../core/services/shop.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent, TranslatePipe],
  template: `
    <!-- Hero Banner -->
    <section class="hero-section text-white position-relative overflow-hidden py-5">
      <div class="container-xl py-lg-5">
        <div class="row align-items-center g-5">
          <div class="col-lg-7">
            <span class="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold mb-3 fs-7">
              {{ 'home.heroBadge' | translate }}
            </span>
            <h1 class="display-3 fw-bolder mb-4 hero-title">
              {{ 'home.heroTitle' | translate }}
            </h1>
            <p class="lead text-light mb-4 opacity-90 fs-5 lh-base">
              {{ 'home.heroSubtitle' | translate }}
            </p>
            <div class="d-flex flex-wrap gap-3">
              <a routerLink="/shop" class="btn btn-orange btn-lg rounded-pill px-4 py-3 fw-bold shadow-sm">
                <i class="fa-solid fa-basket-shopping me-2"></i> {{ 'home.shopNow' | translate }}
              </a>
              <a routerLink="/shop" [queryParams]="{sort: 'priceAsc'}" class="btn btn-outline-light btn-lg rounded-pill px-4 py-3 fw-semibold">
                <i class="fa-solid fa-tag me-2"></i> {{ 'home.browseCategories' | translate }}
              </a>
            </div>
          </div>
          
          <div class="col-lg-5 text-center position-relative">
            <div class="hero-image-wrapper p-3 position-relative">
              <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80"
                   alt="NovaMart Prime" class="img-fluid rounded-4 shadow-lg border border-4 border-white-50"
                   (error)="onHeroImgError($event)">
              <div class="floating-badge bg-white text-dark p-3 rounded-4 shadow-lg position-absolute bottom-0 start-0 m-4 text-start">
                <div class="d-flex align-items-center gap-2">
                  <div class="rounded-circle bg-success text-white p-2 d-flex align-items-center justify-content-center" style="width: 38px; height: 38px;">
                    <i class="fa-solid fa-bolt"></i>
                  </div>
                  <div>
                    <h6 class="mb-0 fw-bold">Ultra Fast 30m</h6>
                    <small class="text-muted">{{ 'home.feature1Title' | translate }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Value Propositions -->
    <section class="py-4 border-bottom shadow-sm" style="background-color: var(--tp-surface);">
      <div class="container-xl">
        <div class="row g-4 text-center text-md-start">
          <div class="col-md-3 col-6 d-flex align-items-center gap-3">
            <div class="rounded-circle bg-warning-subtle text-warning p-3 fs-4 d-flex align-items-center justify-content-center" style="width: 55px; height: 55px; background: #fff2eb; color: #ff5a00 !important;">
              <i class="fa-solid fa-truck-fast"></i>
            </div>
            <div>
              <h6 class="fw-bold mb-0">{{ 'home.feature1Title' | translate }}</h6>
              <small class="text-muted">{{ 'home.feature1Desc' | translate }}</small>
            </div>
          </div>
          <div class="col-md-3 col-6 d-flex align-items-center gap-3">
            <div class="rounded-circle bg-success-subtle text-success p-3 fs-4 d-flex align-items-center justify-content-center" style="width: 55px; height: 55px;">
              <i class="fa-solid fa-seedling"></i>
            </div>
            <div>
              <h6 class="fw-bold mb-0">{{ 'home.feature2Title' | translate }}</h6>
              <small class="text-muted">{{ 'home.feature2Desc' | translate }}</small>
            </div>
          </div>
          <div class="col-md-3 col-6 d-flex align-items-center gap-3">
            <div class="rounded-circle bg-primary-subtle text-primary p-3 fs-4 d-flex align-items-center justify-content-center" style="width: 55px; height: 55px;">
              <i class="fa-solid fa-shield-halved"></i>
            </div>
            <div>
              <h6 class="fw-bold mb-0">{{ 'home.feature3Title' | translate }}</h6>
              <small class="text-muted">{{ 'home.feature3Desc' | translate }}</small>
            </div>
          </div>
          <div class="col-md-3 col-6 d-flex align-items-center gap-3">
            <div class="rounded-circle bg-info-subtle text-info p-3 fs-4 d-flex align-items-center justify-content-center" style="width: 55px; height: 55px;">
              <i class="fa-solid fa-headset"></i>
            </div>
            <div>
              <h6 class="fw-bold mb-0">{{ 'home.feature4Title' | translate }}</h6>
              <small class="text-muted">{{ 'home.feature4Desc' | translate }}</small>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Popular Categories (Types) -->
    <section class="py-5">
      <div class="container-xl">
        <div class="d-flex align-items-center justify-content-between mb-4">
          <div>
            <span class="tp-badge mb-2 d-inline-block">{{ 'shop.categories' | translate }}</span>
            <h2 class="fw-bolder mb-0 text-dark">{{ 'home.categoriesTitle' | translate }}</h2>
          </div>
          <a routerLink="/shop" class="btn btn-outline-secondary rounded-pill px-4 fw-semibold">{{ 'shop.allCategories' | translate }} <i class="fa-solid fa-arrow-right ms-1"></i></a>
        </div>

        <div class="row g-3">
          @for (type of types(); track type.id) {
            <div class="col-lg-3 col-6">
              <a [routerLink]="['/shop']" [queryParams]="{typeId: type.id}"
                 class="card tp-card p-4 text-center text-decoration-none h-100 group border-0 shadow-sm">
                <div class="fs-1 mb-2 text-warning">
                  @switch (type.name.toLowerCase()) {
                    @case ('italian') { <i class="fa-solid fa-pizza-slice"></i> }
                    @case ('mexican') { <i class="fa-solid fa-pepper-hot"></i> }
                    @case ('indian') { <i class="fa-solid fa-bowl-rice"></i> }
                    @case ('chinese') { <i class="fa-solid fa-bowl-food"></i> }
                    @default { <i class="fa-solid fa-layer-group"></i> }
                  }
                </div>
                <h5 class="fw-bold text-dark mb-1">{{ type.name }}</h5>
                <small class="text-muted">{{ 'home.categoriesSubtitle' | translate }}</small>
              </a>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Featured Products Grid -->
    <section class="py-5 border-top border-bottom" style="background-color: var(--tp-surface);">
      <div class="container-xl">
        <div class="text-center mb-5 mx-auto" style="max-width: 650px;">
          <span class="tp-badge mb-2 d-inline-block">{{ 'home.trendingTitle' | translate }}</span>
          <h2 class="fw-bolder text-dark">{{ 'home.trendingTitle' | translate }}</h2>
          <p class="text-muted">{{ 'home.trendingSubtitle' | translate }}</p>
        </div>

        @if (isLoading()) {
          <div class="row g-4">
            @for (i of [1,2,3,4,5,6]; track i) {
              <div class="col-lg-4 col-md-6">
                <div class="card h-100 p-3 border rounded-4 skeleton-box" style="height: 320px;"></div>
              </div>
            }
          </div>
        } @else if (hasConnectionError()) {
          <div class="card border-0 shadow-sm rounded-4 text-center py-5 px-3 border border-danger-subtle" style="background-color: rgba(239, 68, 68, 0.04);">
            <div class="empty-icon-circle mx-auto mb-3 bg-danger-subtle text-danger rounded-circle d-flex align-items-center justify-content-center" style="width: 70px; height: 70px;">
              <i class="fa-solid fa-plug-circle-xmark fs-2"></i>
            </div>
            <h4 class="fw-bold mb-1 text-danger">{{ 'shop.connectionErrorTitle' | translate }}</h4>
            <p class="text-muted small mx-auto mb-3" style="max-width: 440px;">
              {{ 'shop.connectionErrorDesc' | translate }}
            </p>
          </div>
        } @else {
          <div class="row g-4">
            @for (product of featuredProducts(); track product.id) {
              <div class="col-lg-4 col-md-6">
                <app-product-card [product]="product"></app-product-card>
              </div>
            }
          </div>
        }

        <div class="text-center mt-5">
          <a routerLink="/shop" class="btn btn-orange btn-lg rounded-pill px-5 fw-bold shadow-sm">
            {{ 'shop.breadcrumbCatalog' | translate }} ({{ totalCount() }})
          </a>
        </div>
      </div>
    </section>

    <!-- Promotional Callout Banner -->
    <section class="py-5">
      <div class="container-xl">
        <div class="p-4 p-md-5 rounded-5 text-white position-relative overflow-hidden shadow-lg"
             style="background: linear-gradient(135deg, #0b0f19 0%, #1e293b 100%);">
          <div class="row align-items-center g-4">
            <div class="col-lg-8">
              <span class="badge bg-orange rounded-pill px-3 py-1.5 fw-bold mb-3">{{ 'home.promoBadge' | translate }}</span>
              <h2 class="display-6 fw-bold mb-3">{{ 'home.promoTitle' | translate }}</h2>
              <p class="text-secondary mb-0 fs-6 lh-base">{{ 'home.promoSubtitle' | translate }}</p>
            </div>
            <div class="col-lg-4 text-lg-end">
              <a routerLink="/account/register" class="btn btn-orange btn-lg rounded-pill px-4 fw-bold shadow-sm">
                {{ 'auth.createAccount' | translate }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero-section {
      background: linear-gradient(135deg, #0b0f19 0%, #172134 100%);
    }
    .hero-title {
      line-height: 1.25;
      letter-spacing: -0.01em;
    }
  `]
})
export class HomeComponent implements OnInit {
  private shopService = inject(ShopService);

  featuredProducts = signal<Product[]>([]);
  types = signal<ProductType[]>([]);
  totalCount = signal<number>(0);
  isLoading = signal<boolean>(true);
  hasConnectionError = signal<boolean>(false);

  ngOnInit(): void {
    const params = new ShopParams();
    params.pageSize = 6;
    params.sort = 'nameAsc';

    this.shopService.getProducts(params).subscribe({
      next: res => {
        this.featuredProducts.set(res.data);
        this.totalCount.set(res.count ?? res.totalCount);
        this.hasConnectionError.set(false);
        this.isLoading.set(false);
      },
      error: () => {
        this.hasConnectionError.set(true);
        this.isLoading.set(false);
      }
    });

    this.shopService.getTypes().subscribe({
      next: res => this.types.set(res)
    });
  }

  onHeroImgError(event: Event) {
    const target = event.target as HTMLImageElement;
    if (target && !target.src.startsWith('data:')) {
      target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400' fill='%23111827'%3E%3Crect width='600' height='400' rx='20' fill='%231e293b'/%3E%3Ccircle cx='300' cy='180' r='60' fill='%23ff5a00' opacity='0.2'/%3E%3Cpath d='M285 165h30v30h-30z' fill='%23ff5a00'/%3E%3Ctext x='300' y='240' font-family='sans-serif' font-size='22' font-weight='bold' fill='%23ffffff' text-anchor='middle'%3ENovaMart Prime%3C/text%3E%3C/svg%3E";
    }
  }
}
