import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AccountService } from '../../../core/services/account.service';
import { BasketService } from '../../../core/services/basket.service';
import { ThemeService } from '../../../core/services/theme.service';
import { BrandLogoComponent } from '../brand-logo/brand-logo.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, BrandLogoComponent],
  template: `
    <header class="sticky-top main-header border-bottom">
      <!-- Top announcement bar -->
      <div class="top-announcement-bar py-1.5 px-3 d-none d-md-block text-center" style="font-size: 0.8rem; letter-spacing: 0.02em;">
        <span class="badge bg-warning text-dark me-2 fw-bold">NovaMart Prime</span> 
        ⚡ Free Express Delivery on orders over $50 | Use code <strong class="text-warning">PRIME50</strong>
      </div>

      <nav class="navbar navbar-expand-lg py-2.5 px-3 px-lg-5">
        <div class="container-fluid">
          <!-- Brand Logo -->
          <a class="navbar-brand d-flex align-items-center gap-2" routerLink="/">
            <app-brand-logo [size]="38"></app-brand-logo>
            <div class="d-flex align-items-baseline">
              <span class="fw-black fs-4 text-dark" style="letter-spacing: -0.02em;">Nova<span class="text-orange">Mart</span></span>
              <span class="badge bg-warning-subtle text-orange ms-2 px-2 py-0.5 rounded-pill fw-bold" style="font-size: 0.68rem; letter-spacing: 0.05em;">PRIME</span>
            </div>
          </a>

          <!-- Nav Links -->
          <div class="collapse navbar-collapse show me-auto ms-lg-4" id="mainNav">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0 fw-semibold">
              <li class="nav-item">
                <a class="nav-link px-3" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link px-3" routerLink="/shop" routerLinkActive="active">
                  <i class="fa-solid fa-bag-shopping me-1 text-muted"></i> Catalog
                </a>
              </li>
            </ul>
          </div>

          <!-- Actions & Right Controls -->
          <div class="d-flex align-items-center gap-2 gap-lg-3">
            <!-- Dark / Light Mode Toggle Button -->
            <button 
              type="button" 
              class="btn btn-theme-toggle rounded-circle p-0 d-flex align-items-center justify-content-center shadow-xs border"
              style="width: 38px; height: 38px; transition: all 0.25s ease;"
              (click)="themeService.toggleTheme()" 
              [title]="themeService.isDarkMode() ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
              @if (themeService.isDarkMode()) {
                <i class="fa-solid fa-sun text-warning fs-6"></i>
              } @else {
                <i class="fa-solid fa-moon text-secondary fs-6"></i>
              }
            </button>

            <!-- Orders Link (Visible When Logged In) -->
            @if (accountService.currentUser()) {
              <a routerLink="/orders" 
                 routerLinkActive="active-orders"
                 class="btn header-orders-btn rounded-pill px-3 py-1.5 border d-flex align-items-center text-decoration-none shadow-xs"
                 title="View My Orders">
                <i class="fa-solid fa-receipt me-1.5 fs-6 text-orange"></i>
                <span class="fw-bold d-none d-sm-inline">Orders</span>
              </a>
            }

            <!-- Cart Trigger Button -->
            <button class="btn header-cart-btn position-relative rounded-pill px-3 py-1.5 border d-flex align-items-center shadow-xs"
                    (click)="basketService.toggleDrawer(true)">
              <i class="fa-solid fa-cart-shopping me-2 fs-6" style="color: var(--tp-primary);"></i>
              <span class="fw-bold d-none d-sm-inline">Cart</span>
              @if (basketService.itemCount() > 0) {
                <span class="badge rounded-pill bg-danger ms-2 px-2 py-0.5 animate-badge" style="font-size: 0.72rem;">
                  {{ basketService.itemCount() }}
                </span>
              }
            </button>

            <!-- User Auth Menu -->
            @if (accountService.currentUser(); as user) {
              <div class="dropdown position-relative">
                <button class="btn header-login-btn rounded-pill px-3 py-1.5 dropdown-toggle d-flex align-items-center" 
                        type="button" 
                        (click)="isMenuOpen.set(!isMenuOpen())">
                  <div class="user-avatar me-2 rounded-circle text-white d-flex align-items-center justify-content-center"
                       style="width: 24px; height: 24px; background: #ff5a00; font-size: 0.75rem; font-weight: 700;">
                    {{ user.displayName.charAt(0).toUpperCase() }}
                  </div>
                  <span class="fw-semibold">{{ user.displayName }}</span>
                </button>
                <ul class="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4 p-2 mt-2" 
                    [class.show]="isMenuOpen()"
                    style="min-width: 200px;">
                  <li>
                    <h6 class="dropdown-header text-truncate">{{ user.email }}</h6>
                  </li>
                  <li><hr class="dropdown-divider"></li>
                  <li>
                    <a class="dropdown-item rounded-3 py-2" routerLink="/orders" (click)="isMenuOpen.set(false)">
                      <i class="fa-solid fa-receipt me-2 text-primary"></i> My Orders
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item rounded-3 py-2" routerLink="/cart" (click)="isMenuOpen.set(false)">
                      <i class="fa-solid fa-cart-arrow-down me-2 text-warning"></i> View Full Cart
                    </a>
                  </li>
                  <li><hr class="dropdown-divider"></li>
                  <li>
                    <button class="dropdown-item rounded-3 py-2 text-danger" (click)="onLogout()">
                      <i class="fa-solid fa-arrow-right-from-bracket me-2"></i> Log Out
                    </button>
                  </li>
                </ul>
              </div>
            } @else {
              <div class="d-flex align-items-center gap-2">
                <a routerLink="/account/login" class="btn header-login-btn rounded-pill px-3.5 py-1.5 fw-semibold d-flex align-items-center gap-1.5">
                  <i class="fa-regular fa-user small"></i>
                  <span>Login</span>
                </a>
                <a routerLink="/account/register" class="btn btn-orange rounded-pill px-3.5 py-1.5 fw-semibold">Sign Up</a>
              </div>
            }
          </div>
        </div>
      </nav>
    </header>
  `,
  styles: [`
    .nav-link.active {
      color: var(--tp-primary) !important;
      font-weight: 700;
    }
    .animate-badge {
      animation: pulse 1.5s infinite;
    }
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.15); }
      100% { transform: scale(1); }
    }
  `]
})
export class NavbarComponent {
  basketService = inject(BasketService);
  accountService = inject(AccountService);
  themeService = inject(ThemeService);
  isMenuOpen = signal<boolean>(false);

  onLogout() {
    this.isMenuOpen.set(false);
    this.accountService.logout();
  }
}
