import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="not-found-page py-5 my-5">
      <div class="container-xl">
        <div class="row justify-content-center">
          <div class="col-md-7 col-lg-5 text-center">
            <div class="not-found-badge mb-3">
              <span class="display-1 fw-black text-orange">404</span>
            </div>
            <h3 class="fw-bold text-dark mb-2">Oops! Page Not Found</h3>
            <p class="text-muted mb-4 fs-6">
              The page or delicious meal you are searching for might have been moved, renamed, or is temporarily out of service.
            </p>
            <div class="d-flex justify-content-center gap-2">
              <a routerLink="/" class="btn btn-orange rounded-pill px-4 py-2.5 fw-bold shadow-sm">
                <i class="fa-solid fa-house me-2"></i>Back to Home
              </a>
              <a routerLink="/shop" class="btn btn-outline-secondary rounded-pill px-4 py-2.5 fw-semibold">
                <i class="fa-solid fa-bag-shopping me-2"></i>Catalog
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class NotFoundComponent {}
