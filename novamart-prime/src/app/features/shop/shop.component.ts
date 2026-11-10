import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Brand, Pagination, Product, ProductType, ShopParams } from '../../core/models/product.model';
import { ShopService } from '../../core/services/shop.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProductCardComponent],
  template: `
    <div class="shop-page py-4">
      <div class="container-xl">
        <!-- Breadcrumb & Header -->
        <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb mb-1 small text-muted">
                <li class="breadcrumb-item"><a routerLink="/" class="text-decoration-none text-muted">Home</a></li>
                <li class="breadcrumb-item active text-orange fw-semibold" aria-current="page">Catalog</li>
              </ol>
            </nav>
            <h2 class="fw-bold m-0 text-dark">Explore Our Products</h2>
            <p class="text-muted small m-0 mt-1">
              @if (totalCount() > 0) {
                Showing <span class="fw-bold text-dark">{{ ((shopParams.pageNumber - 1) * shopParams.pageSize) + 1 }}</span> - 
                <span class="fw-bold text-dark">{{ getEndIndex() }}</span> of 
                <span class="fw-bold text-orange">{{ totalCount() }}</span> products
              } @else {
                No products found
              }
            </p>
          </div>

          <!-- Sort & Page Size Controls -->
          <div class="d-flex align-items-center gap-2 flex-wrap">
            <div class="custom-select-pill d-flex align-items-center gap-2 px-3 py-1 rounded-pill shadow-xs">
              <i class="fa-solid fa-arrow-down-short-wide text-orange small"></i>
              <label class="small text-muted mb-0 fw-semibold text-nowrap">Sort:</label>
              <select 
                class="form-select form-select-sm border-0 bg-transparent fw-semibold shadow-none ps-1 pe-4 cursor-pointer" 
                style="height: 34px; line-height: 34px; font-size: 0.88rem;"
                [ngModel]="shopParams.sort" 
                (ngModelChange)="onSortSelected($event)">
                <option value="nameAsc">Alphabetical (A - Z)</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </select>
            </div>

            <div class="custom-select-pill d-flex align-items-center gap-2 px-3 py-1 rounded-pill shadow-xs">
              <i class="fa-solid fa-grip text-orange small"></i>
              <label class="small text-muted mb-0 fw-semibold text-nowrap">Show:</label>
              <select 
                class="form-select form-select-sm border-0 bg-transparent fw-semibold shadow-none ps-1 pe-4 cursor-pointer" 
                style="height: 34px; line-height: 34px; font-size: 0.88rem;"
                [ngModel]="shopParams.pageSize" 
                (ngModelChange)="onPageSizeChange($event)">
                <option [ngValue]="6">6 per page</option>
                <option [ngValue]="9">9 per page</option>
                <option [ngValue]="12">12 per page</option>
                <option [ngValue]="18">18 per page</option>
              </select>
            </div>
          </div>
        </div>

        <div class="row g-4">
          <!-- Sidebar Filters -->
          <div class="col-lg-3">
            <div class="filters-sidebar">
              <!-- Search Card -->
              <div class="card border-0 shadow-sm rounded-4 mb-3">
                <div class="card-body p-3">
                  <h6 class="fw-bold mb-2 text-dark small text-uppercase">
                    <i class="fa-solid fa-magnifying-glass text-orange me-2"></i>Search
                  </h6>
                  <div class="input-group">
                    <input 
                      type="text" 
                      class="form-control border-end-0 rounded-start-pill ps-3" 
                      style="height: 42px; font-size: 0.9rem;"
                      placeholder="Search items..." 
                      [(ngModel)]="searchTerm"
                      (keyup.enter)="onSearch()">
                    @if (searchTerm) {
                      <button class="btn btn-outline-secondary border-start-0 border-end-0 px-2" type="button" (click)="onResetSearch()">
                        <i class="fa-solid fa-xmark"></i>
                      </button>
                    }
                    <button class="btn btn-orange rounded-end-pill px-3" type="button" (click)="onSearch()">
                      <i class="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Categories / Types Card -->
              <div class="card border-0 shadow-sm rounded-4 mb-3">
                <div class="card-body p-3">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="fw-bold m-0 text-dark small text-uppercase">
                      <i class="fa-solid fa-layer-group text-orange me-2"></i>Categories
                    </h6>
                    <span class="badge bg-light text-muted border rounded-pill">{{ types().length }}</span>
                  </div>
                  <div class="list-group list-group-flush filter-list">
                    <button 
                      type="button" 
                      class="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-2 px-2 border-0 rounded-3 mb-1"
                      [class.active-filter]="shopParams.typeId === 0"
                      (click)="onTypeSelected(0)">
                      <span>All Categories</span>
                      <i class="fa-solid fa-chevron-right small opacity-50"></i>
                    </button>
                    @for (type of types(); track type.id) {
                      <button 
                        type="button" 
                        class="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-2 px-2 border-0 rounded-3 mb-1"
                        [class.active-filter]="shopParams.typeId === type.id"
                        (click)="onTypeSelected(type.id)">
                        <span>{{ type.name }}</span>
                        <i class="fa-solid fa-chevron-right small opacity-50"></i>
                      </button>
                    }
                  </div>
                </div>
              </div>

              <!-- Brands Filter Card -->
              <div class="card border-0 shadow-sm rounded-4 mb-3">
                <div class="card-body p-3">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="fw-bold m-0 text-dark small text-uppercase">
                      <i class="fa-solid fa-tag text-orange me-2"></i>Brands
                    </h6>
                    <span class="badge bg-light text-muted border rounded-pill">{{ brands().length }}</span>
                  </div>
                  <div class="list-group list-group-flush filter-list">
                    <button 
                      type="button" 
                      class="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-2 px-2 border-0 rounded-3 mb-1"
                      [class.active-filter]="shopParams.brandId === 0"
                      (click)="onBrandSelected(0)">
                      <span>All Brands</span>
                      <i class="fa-solid fa-chevron-right small opacity-50"></i>
                    </button>
                    @for (brand of brands(); track brand.id) {
                      <button 
                        type="button" 
                        class="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-2 px-2 border-0 rounded-3 mb-1"
                        [class.active-filter]="shopParams.brandId === brand.id"
                        (click)="onBrandSelected(brand.id)">
                        <span>{{ brand.name }}</span>
                        <i class="fa-solid fa-chevron-right small opacity-50"></i>
                      </button>
                    }
                  </div>
                </div>
              </div>

              <!-- Reset All Filters Button -->
              @if (isFiltered()) {
                <button 
                  type="button" 
                  class="btn reset-filters-btn shadow-xs" 
                  (click)="onResetAllFilters()">
                  <i class="fa-solid fa-rotate-left"></i>
                  <span>Reset All Filters</span>
                </button>
              }

              <!-- Promo Card with Dedicated Styling & Generous Spacing -->
              <div class="shop-promo-card">
                <div class="position-relative z-1">
                  <div class="promo-badge">
                    <i class="fa-solid fa-bolt text-warning"></i>
                    <span>Prime Deals</span>
                  </div>
                  <h6 class="promo-title">Free Delivery on $50+</h6>
                  <p class="promo-desc">
                    Use promo code <span class="promo-code">PRIME50</span> at checkout!
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Products Main Area -->
          <div class="col-lg-9">
            <!-- Active Filter Badges with Dedicated Spacing & No Edge Touching -->
            @if (isFiltered()) {
              <div class="active-filters-bar">
                <span class="active-label">
                  <i class="fa-solid fa-filter text-orange"></i>
                  <span>Active:</span>
                </span>
                @if (getSelectedBrandName()) {
                  <span class="active-filter-badge">
                    <span>Brand: {{ getSelectedBrandName() }}</span>
                    <i class="fa-solid fa-xmark remove-filter-btn" (click)="onBrandSelected(0)"></i>
                  </span>
                }
                @if (getSelectedTypeName()) {
                  <span class="active-filter-badge">
                    <span>Category: {{ getSelectedTypeName() }}</span>
                    <i class="fa-solid fa-xmark remove-filter-btn" (click)="onTypeSelected(0)"></i>
                  </span>
                }
                @if (shopParams.search) {
                  <span class="active-filter-badge">
                    <span>Search: "{{ shopParams.search }}"</span>
                    <i class="fa-solid fa-xmark remove-filter-btn" (click)="onResetSearch()"></i>
                  </span>
                }
                <button type="button" class="clear-all-btn" (click)="onResetAllFilters()">
                  <i class="fa-solid fa-xmark small"></i>
                  <span>Clear all</span>
                </button>
              </div>
            }

            <!-- Products Grid -->
            @if (isLoading()) {
              <div class="row g-4">
                @for (placeholder of [1,2,3,4,5,6]; track placeholder) {
                  <div class="col-sm-6 col-md-4">
                    <div class="card border-0 shadow-sm rounded-4 p-3 h-100">
                      <div class="skeleton-box rounded-3 mb-3" style="height: 180px;"></div>
                      <div class="skeleton-box rounded w-50 mb-2" style="height: 16px;"></div>
                      <div class="skeleton-box rounded w-75 mb-3" style="height: 20px;"></div>
                      <div class="skeleton-box rounded w-100 mt-auto" style="height: 36px;"></div>
                    </div>
                  </div>
                }
              </div>
            } @else if (hasConnectionError()) {
              <!-- Server Connection / Database Error State -->
              <div class="card border-0 shadow-sm rounded-4 text-center py-5 px-3 border border-danger-subtle" style="background-color: rgba(239, 68, 68, 0.04);">
                <div class="empty-icon-circle mx-auto mb-3 bg-danger-subtle text-danger rounded-circle d-flex align-items-center justify-content-center" style="width: 80px; height: 80px;">
                  <i class="fa-solid fa-triangle-exclamation fs-2"></i>
                </div>
                <h4 class="fw-bold mb-1 text-danger">Server & Database Connection Error</h4>
                <p class="text-muted small mx-auto mb-4" style="max-width: 480px;">
                  تعذر الاتصال بخادم الـ ASP.NET Core API المباشر (https://localhost:7112). تأكد من تشغيل الباك إند وصحة الاتصال بقاعدة البيانات.
                </p>
                <div>
                  <button class="btn btn-orange rounded-pill px-4 py-2 fw-semibold shadow-sm" (click)="loadProducts(); loadBrands(); loadTypes();">
                    <i class="fa-solid fa-rotate-right me-2"></i>إعادة المحاولة (Retry)
                  </button>
                </div>
              </div>
            } @else if (products().length > 0) {
              <div class="row g-4">
                @for (product of products(); track product.id) {
                  <div class="col-sm-6 col-md-4">
                    <app-product-card [product]="product"></app-product-card>
                  </div>
                }
              </div>

              <!-- Pagination Controls -->
              @if (totalPages() > 1) {
                <div class="d-flex justify-content-center align-items-center mt-5">
                  <nav aria-label="Products pagination">
                    <ul class="pagination pagination-rounded shadow-sm m-0">
                      <!-- PREVIOUS BUTTON -->
                      <li class="page-item" [class.disabled]="shopParams.pageNumber <= 1">
                        <button 
                          type="button"
                          class="page-link" 
                          [disabled]="shopParams.pageNumber <= 1"
                          (click)="onPageChanged(shopParams.pageNumber - 1)">
                          <i class="fa-solid fa-chevron-left me-1"></i> Prev
                        </button>
                      </li>

                      <!-- PAGE NUMBERS -->
                      @for (page of getPageNumbers(); track page) {
                        <li class="page-item" [class.active]="page === shopParams.pageNumber">
                          <button 
                            type="button"
                            class="page-link" 
                            (click)="onPageChanged(page)">
                            {{ page }}
                          </button>
                        </li>
                      }

                      <!-- NEXT BUTTON -->
                      <li class="page-item" [class.disabled]="shopParams.pageNumber >= totalPages()">
                        <button 
                          type="button"
                          class="page-link" 
                          [disabled]="shopParams.pageNumber >= totalPages()"
                          (click)="onPageChanged(shopParams.pageNumber + 1)">
                          Next <i class="fa-solid fa-chevron-right ms-1"></i>
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              }
            } @else {
              <!-- Empty State -->
              <div class="card border-0 shadow-sm rounded-4 text-center py-5 px-3">
                <div class="empty-icon-circle mx-auto mb-3 bg-light rounded-circle d-flex align-items-center justify-content-center" style="width: 80px; height: 80px;">
                  <i class="fa-solid fa-box-open fs-2 text-muted"></i>
                </div>
                <h4 class="fw-bold mb-1">No Products Found</h4>
                <p class="text-muted small mx-auto mb-4" style="max-width: 400px;">
                  We couldn't find any items matching your selected criteria. Try adjusting your filters or search terms.
                </p>
                <div>
                  <button class="btn btn-orange rounded-pill px-4 py-2 fw-semibold shadow-sm" (click)="onResetAllFilters()">
                    <i class="fa-solid fa-rotate-left me-2"></i>Reset All Filters
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .shadow-xs {
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }
    .filter-list .list-group-item {
      color: var(--tp-text-dark);
      background: var(--tp-surface);
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.2s ease;
      cursor: pointer;
      border: 1px solid transparent;
    }
    .filter-list .list-group-item:hover {
      background: var(--tp-primary-light);
      color: var(--tp-primary);
      transform: translateX(3px);
    }
    .filter-list .active-filter {
      background: var(--tp-primary) !important;
      color: #ffffff !important;
      font-weight: 600;
    }
    .filter-list .active-filter .opacity-50 {
      opacity: 1 !important;
    }
    .pagination-rounded .page-item:first-child .page-link {
      border-top-left-radius: 999px;
      border-bottom-left-radius: 999px;
    }
    .pagination-rounded .page-item:last-child .page-link {
      border-top-right-radius: 999px;
      border-bottom-right-radius: 999px;
    }
    .pagination-rounded .page-link {
      color: var(--tp-text-dark);
      background: var(--tp-surface);
      border: 1px solid var(--tp-border);
      padding: 0.55rem 1rem;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .pagination-rounded .page-item.disabled .page-link {
      cursor: not-allowed;
      opacity: 0.45;
      background: var(--tp-surface-subtle);
      color: var(--tp-text-muted);
    }
    .pagination-rounded .page-item.active .page-link {
      background-color: var(--tp-primary) !important;
      border-color: var(--tp-primary) !important;
      color: #ffffff !important;
    }
    .cursor-pointer {
      cursor: pointer;
    }
  `]
})
export class ShopComponent implements OnInit {
  private shopService = inject(ShopService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  products = signal<Product[]>([]);
  brands = signal<Brand[]>([]);
  types = signal<ProductType[]>([]);
  totalCount = signal<number>(0);
  isLoading = signal<boolean>(true);
  hasConnectionError = signal<boolean>(false);

  shopParams = new ShopParams();
  searchTerm = '';

  ngOnInit(): void {
    this.loadBrands();
    this.loadTypes();

    this.route.queryParams.subscribe(params => {
      this.shopParams.brandId = (params['brandId'] && !isNaN(+params['brandId'])) ? +params['brandId'] : 0;
      this.shopParams.typeId = (params['typeId'] && !isNaN(+params['typeId'])) ? +params['typeId'] : 0;
      this.shopParams.sort = params['sort'] || 'nameAsc';
      this.shopParams.search = params['search'] || '';
      this.searchTerm = this.shopParams.search;

      const rawPage = params['pageIndex'] || params['pageNumber'];
      this.shopParams.pageNumber = (rawPage && !isNaN(+rawPage) && +rawPage > 0) ? Math.floor(+rawPage) : 1;

      const rawSize = params['pageSize'];
      this.shopParams.pageSize = (rawSize && !isNaN(+rawSize) && +rawSize > 0) ? Math.floor(+rawSize) : 6;

      this.loadProducts();
    });
  }

  loadProducts() {
    this.isLoading.set(true);
    this.hasConnectionError.set(false);
    this.shopService.getProducts(this.shopParams).subscribe({
      next: (response: Pagination) => {
        this.products.set(response.data || []);
        // Match backend's pageNumber or fallback to 1 (never NaN)
        const currentPage = response.pageNumber || response.pageIndex || 1;
        this.shopParams.pageNumber = (!currentPage || isNaN(currentPage)) ? 1 : currentPage;
        this.shopParams.pageSize = response.pageSize || 6;
        this.totalCount.set(response.count ?? response.totalCount ?? 0);
        this.isLoading.set(false);
      },
      error: () => {
        this.hasConnectionError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  loadBrands() {
    this.shopService.getBrands().subscribe({
      next: res => this.brands.set(res)
    });
  }

  loadTypes() {
    this.shopService.getTypes().subscribe({
      next: res => this.types.set(res)
    });
  }

  onBrandSelected(brandId: number) {
    this.shopParams.brandId = brandId;
    this.shopParams.pageNumber = 1;
    this.updateQueryParams();
  }

  onTypeSelected(typeId: number) {
    this.shopParams.typeId = typeId;
    this.shopParams.pageNumber = 1;
    this.updateQueryParams();
  }

  onSortSelected(sort: string) {
    this.shopParams.sort = sort;
    this.shopParams.pageNumber = 1;
    this.updateQueryParams();
  }

  onPageSizeChange(size: number) {
    this.shopParams.pageSize = size;
    this.shopParams.pageNumber = 1;
    this.updateQueryParams();
  }

  onPageChanged(page: number) {
    if (!page || isNaN(page) || page < 1 || page > this.totalPages() || page === this.shopParams.pageNumber) return;
    this.shopParams.pageNumber = page;
    this.updateQueryParams();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSearch() {
    this.shopParams.search = this.searchTerm.trim();
    this.shopParams.pageNumber = 1;
    this.updateQueryParams();
  }

  onResetSearch() {
    this.searchTerm = '';
    this.shopParams.search = '';
    this.shopParams.pageNumber = 1;
    this.updateQueryParams();
  }

  onResetAllFilters() {
    this.searchTerm = '';
    this.shopParams = new ShopParams();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {}
    });
  }

  updateQueryParams() {
    const queryParams: any = {};
    if (this.shopParams.brandId > 0) queryParams.brandId = this.shopParams.brandId;
    if (this.shopParams.typeId > 0) queryParams.typeId = this.shopParams.typeId;
    if (this.shopParams.sort !== 'nameAsc') queryParams.sort = this.shopParams.sort;
    if (this.shopParams.search) queryParams.search = this.shopParams.search;
    
    // Always pass valid integer pageIndex
    queryParams.pageIndex = (!this.shopParams.pageNumber || isNaN(this.shopParams.pageNumber)) ? 1 : this.shopParams.pageNumber;
    
    if (this.shopParams.pageSize !== 6) queryParams.pageSize = this.shopParams.pageSize;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams
    });
  }

  isFiltered(): boolean {
    return this.shopParams.brandId > 0 || this.shopParams.typeId > 0 || !!this.shopParams.search || this.shopParams.sort !== 'nameAsc';
  }

  getSelectedBrandName(): string {
    if (this.shopParams.brandId === 0) return '';
    const brand = this.brands().find(b => b.id === this.shopParams.brandId);
    return brand ? brand.name : '';
  }

  getSelectedTypeName(): string {
    if (this.shopParams.typeId === 0) return '';
    const type = this.types().find(t => t.id === this.shopParams.typeId);
    return type ? type.name : '';
  }

  getEndIndex(): number {
    return Math.min(this.shopParams.pageNumber * this.shopParams.pageSize, this.totalCount());
  }

  totalPages(): number {
    return Math.ceil(this.totalCount() / this.shopParams.pageSize) || 1;
  }

  getPageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.shopParams.pageNumber;
    const pages: number[] = [];
    const maxVisible = 5;

    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = Math.min(total, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
}
