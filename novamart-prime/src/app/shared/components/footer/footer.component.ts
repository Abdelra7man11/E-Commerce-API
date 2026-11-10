import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { BrandLogoComponent } from '../brand-logo/brand-logo.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, BrandLogoComponent, TranslatePipe],
  template: `
    <footer class="footer-section bg-dark text-white pt-5 pb-4 mt-auto border-top border-secondary">
      <div class="container-xl">
        <div class="row g-4 mb-4">
          <!-- Col 1 -->
          <div class="col-lg-4 col-md-6">
            <div class="d-flex align-items-center mb-3">
              <app-brand-logo [size]="36" class="me-2"></app-brand-logo>
              <span class="fw-black fs-4 text-white">Nova<span class="text-orange">Mart</span></span>
              <span class="badge bg-warning-subtle text-orange ms-2 px-2 py-0.5 rounded-pill fw-bold" style="font-size: 0.7rem;">{{ 'nav.prime' | translate }}</span>
            </div>
            <p class="text-secondary small mb-3 lh-base">
              {{ 'footer.about' | translate }}
            </p>
            <div class="d-flex gap-2">
              <a href="https://github.com/Abdelra7man11" target="_blank" rel="noopener noreferrer" class="btn btn-outline-secondary btn-sm rounded-circle text-white d-flex align-items-center justify-content-center social-link-btn" style="width: 38px; height: 38px;" title="GitHub">
                <i class="fa-brands fa-github fs-6"></i>
              </a>
              <a href="https://www.linkedin.com/in/abdelrahman-elhndawy-8b2027317/" target="_blank" rel="noopener noreferrer" class="btn btn-outline-secondary btn-sm rounded-circle text-white d-flex align-items-center justify-content-center social-link-btn" style="width: 38px; height: 38px;" title="LinkedIn">
                <i class="fa-brands fa-linkedin-in fs-6"></i>
              </a>
              <a href="https://www.facebook.com/abd.elrahmann.77" target="_blank" rel="noopener noreferrer" class="btn btn-outline-secondary btn-sm rounded-circle text-white d-flex align-items-center justify-content-center social-link-btn" style="width: 38px; height: 38px;" title="Facebook">
                <i class="fa-brands fa-facebook-f fs-6"></i>
              </a>
              <a href="mailto:abdelrahmanelhndawy1@gmail.com" class="btn btn-outline-secondary btn-sm rounded-circle text-white d-flex align-items-center justify-content-center social-link-btn" style="width: 38px; height: 38px;" title="Email Abdelrahman">
                <i class="fa-solid fa-envelope fs-6"></i>
              </a>
            </div>
          </div>

          <!-- Col 2 -->
          <div class="col-lg-2 col-md-6 col-6">
            <h6 class="fw-bold text-white mb-3 text-uppercase small">{{ 'footer.quickLinks' | translate }}</h6>
            <ul class="list-unstyled small text-secondary lh-lg mb-0">
              <li><a routerLink="/" class="text-secondary text-decoration-none hover-white">{{ 'nav.home' | translate }}</a></li>
              <li><a routerLink="/shop" class="text-secondary text-decoration-none hover-white">{{ 'nav.catalog' | translate }}</a></li>
              <li><a routerLink="/cart" class="text-secondary text-decoration-none hover-white">{{ 'nav.cart' | translate }}</a></li>
              <li><a routerLink="/orders" class="text-secondary text-decoration-none hover-white">{{ 'nav.orders' | translate }}</a></li>
            </ul>
          </div>

          <!-- Col 3 -->
          <div class="col-lg-2 col-md-6 col-6">
            <h6 class="fw-bold text-white mb-3 text-uppercase small">{{ 'footer.support' | translate }}</h6>
            <ul class="list-unstyled small text-secondary lh-lg mb-0">
              <li><a routerLink="/account/login" class="text-secondary text-decoration-none hover-white">{{ 'nav.login' | translate }}</a></li>
              <li><a routerLink="/account/register" class="text-secondary text-decoration-none hover-white">{{ 'nav.signUp' | translate }}</a></li>
              <li><a routerLink="/checkout" class="text-secondary text-decoration-none hover-white">{{ 'checkout.stepReview' | translate }}</a></li>
            </ul>
          </div>

          <!-- Col 4 -->
          <div class="col-lg-4 col-md-6">
            <h6 class="fw-bold text-white mb-3 text-uppercase small">{{ 'home.newsletterTitle' | translate }}</h6>
            <p class="text-secondary small mb-3">{{ 'home.newsletterSubtitle' | translate }}</p>
            <div class="input-group">
              <input type="email" class="form-control bg-dark border-secondary text-white rounded-start-pill ps-3" [placeholder]="'home.newsletterPlaceholder' | translate">
              <button class="btn btn-orange rounded-end-pill px-4 fw-semibold" type="button">{{ 'home.subscribeBtn' | translate }}</button>
            </div>
          </div>
        </div>

        <hr class="border-secondary my-4 opacity-25">

        <div class="d-flex flex-column flex-md-row align-items-center justify-content-between small text-secondary gap-2">
          <div>{{ 'footer.copyright' | translate }}</div>
          <div class="d-flex gap-2">
            <span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle">SSL 256-Bit Encrypted</span>
            <span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle">Redis Cache Powered</span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .hover-white:hover {
      color: #ffffff !important;
    }
    .social-link-btn {
      transition: all 0.25s ease;
      border-color: rgba(255, 255, 255, 0.2) !important;
    }
    .social-link-btn:hover {
      background: linear-gradient(135deg, #ff5a00, #ff8c42) !important;
      border-color: transparent !important;
      color: #ffffff !important;
      transform: translateY(-3px);
      box-shadow: 0 4px 14px rgba(255, 90, 0, 0.4);
    }
  `]
})
export class FooterComponent {}
