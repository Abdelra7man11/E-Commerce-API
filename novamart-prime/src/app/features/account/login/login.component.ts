import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AccountService } from '../../../core/services/account.service';
import { ToastService } from '../../../core/services/toast.service';
import { BrandLogoComponent } from '../../../shared/components/brand-logo/brand-logo.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, BrandLogoComponent, TranslatePipe],
  template: `
    <div class="auth-page py-5">
      <div class="container-xl">
        <div class="row justify-content-center">
          <div class="col-md-7 col-lg-5 col-xl-4">
            <!-- Brand Badge -->
            <div class="text-center mb-4">
              <a routerLink="/" class="d-inline-flex align-items-center gap-2 text-decoration-none">
                <app-brand-logo [size]="46"></app-brand-logo>
                <div class="text-start lh-1">
                  <div class="fw-black fs-4 text-dark">Nova<span class="text-orange">Mart</span></div>
                  <span class="text-muted" style="font-size: 0.65rem; letter-spacing: 0.08em; text-transform: uppercase;">PRIME DELIVERIES</span>
                </div>
              </a>
            </div>

            <!-- Card -->
            <div class="card border-0 shadow-lg rounded-5 overflow-hidden bg-white p-4 p-sm-5">
              <div class="text-center mb-4">
                <h3 class="fw-bold text-dark mb-1">{{ 'auth.welcomeBack' | translate }}</h3>
                <p class="text-muted small">{{ 'auth.loginSubtitle' | translate }}</p>
              </div>

              <!-- Quick Demo Fill Helper Banner -->
              <div class="alert alert-warning border-0 rounded-4 p-3 mb-4 d-flex align-items-center justify-content-between">
                <div class="lh-sm">
                  <div class="fw-bold small text-dark"><i class="fa-solid fa-wand-magic-sparkles text-orange me-1"></i> Quick Demo Login</div>
                  <span class="text-muted" style="font-size: 0.72rem;">Prefill seeded test credentials</span>
                </div>
                <button type="button" class="btn btn-sm btn-orange rounded-pill px-3 fw-bold" (click)="fillDemoUser()">
                  Auto-Fill
                </button>
              </div>

              <!-- Server Error Alert Banner -->
              @if (serverError()) {
                <div class="alert alert-danger border-0 rounded-4 p-3 mb-3 d-flex align-items-start gap-2 shadow-xs">
                  <i class="fa-solid fa-triangle-exclamation text-danger mt-1 fs-6"></i>
                  <div class="small">
                    <div class="fw-bold mb-0.5">Login Failed</div>
                    <div>{{ serverError() }}</div>
                  </div>
                </div>
              }

              <!-- Form -->
              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <!-- Email -->
                <div class="mb-3">
                  <label class="form-label small fw-semibold text-muted">{{ 'auth.email' | translate }}</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0 text-muted rounded-start-pill ps-3">
                      <i class="fa-regular fa-envelope"></i>
                    </span>
                    <input 
                      type="email" 
                      class="form-control rounded-end-pill border-start-0" 
                      placeholder="name@example.com"
                      formControlName="email"
                      (input)="serverError.set(null)"
                      [class.is-invalid]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
                  </div>
                  @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
                    <div class="text-danger small mt-1 ms-2">Valid email is required.</div>
                  }
                </div>

                <!-- Password -->
                <div class="mb-3">
                  <div class="d-flex justify-content-between align-items-center mb-1">
                    <label class="form-label small fw-semibold text-muted mb-0">{{ 'auth.password' | translate }}</label>
                  </div>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0 text-muted rounded-start-pill ps-3">
                      <i class="fa-solid fa-lock"></i>
                    </span>
                    <input 
                      [type]="showPassword ? 'text' : 'password'" 
                      class="form-control border-start-0 border-end-0" 
                      placeholder="••••••••"
                      formControlName="password"
                      (input)="serverError.set(null)"
                      [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                    <button 
                      class="btn btn-light border-top border-bottom border-end rounded-end-pill text-muted px-3" 
                      type="button" 
                      (click)="showPassword = !showPassword">
                      <i class="fa-regular" [ngClass]="showPassword ? 'fa-eye-slash' : 'fa-eye'"></i>
                    </button>
                  </div>
                  @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                    <div class="text-danger small mt-1 ms-2">Password is required.</div>
                  }
                </div>

                <!-- Remember Me -->
                <div class="mb-4 form-check">
                  <input type="checkbox" class="form-check-input" id="rememberMeCheck" checked>
                  <label class="form-check-label small text-muted" for="rememberMeCheck">Keep me signed in</label>
                </div>

                <!-- Submit Button -->
                <button 
                  type="submit" 
                  class="btn btn-orange btn-lg w-100 rounded-pill py-2.5 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 mb-3"
                  [disabled]="loginForm.invalid || isLoading()">
                  @if (isLoading()) {
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span>Signing in...</span>
                  } @else {
                    <span>{{ 'auth.loginBtn' | translate }}</span>
                    <i class="fa-solid fa-arrow-right"></i>
                  }
                </button>
              </form>

              <!-- Footer -->
              <div class="text-center mt-3 pt-3 border-top">
                <span class="text-muted small">{{ 'auth.noAccount' | translate }} </span>
                <a routerLink="/account/register" class="text-orange fw-bold text-decoration-none small">
                  {{ 'auth.signUpHere' | translate }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: calc(100vh - 350px);
      display: flex;
      align-items: center;
    }
  `]
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  returnUrl = '/shop';
  showPassword = false;
  isLoading = signal<boolean>(false);
  serverError = signal<string | null>(null);

  loginForm: FormGroup = this.fb.group({
    email: ['Mohamed1@gmail.com', [Validators.required, Validators.email]],
    password: ['P@ssw0rd', Validators.required]
  });

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/shop';
  }

  fillDemoUser() {
    this.serverError.set(null);
    this.loginForm.setValue({
      email: 'Mohamed1@gmail.com',
      password: 'P@ssw0rd'
    });
    this.toast.info('Seeded test credentials populated!');
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.serverError.set(null);

    this.accountService.login(this.loginForm.value).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.toast.success('Welcome back to NovaMart Prime!');
        this.router.navigateByUrl(this.returnUrl);
      },
      error: err => {
        this.isLoading.set(false);
        let errorMsg = 'Invalid email or password';
        if (err.error?.errors && Array.isArray(err.error.errors) && err.error.errors.length > 0) {
          errorMsg = err.error.errors.join(' • ');
        } else if (err.error?.errorMessage) {
          errorMsg = err.error.errorMessage;
        } else if (err.error?.message) {
          errorMsg = err.error.message;
        }
        this.serverError.set(errorMsg);
        this.toast.error(errorMsg);
      }
    });
  }
}
