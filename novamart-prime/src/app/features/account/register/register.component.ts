import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AccountService } from '../../../core/services/account.service';
import { ToastService } from '../../../core/services/toast.service';
import { BrandLogoComponent } from '../../../shared/components/brand-logo/brand-logo.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, BrandLogoComponent, TranslatePipe],
  template: `
    <div class="auth-page py-5">
      <div class="container-xl">
        <div class="row justify-content-center">
          <div class="col-md-7 col-lg-5">
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
                <h3 class="fw-bold text-dark mb-1">{{ 'auth.createAccount' | translate }}</h3>
                <p class="text-muted small">{{ 'auth.registerSubtitle' | translate }}</p>
              </div>

              <!-- Server Error Alert Banner -->
              @if (serverError()) {
                <div class="alert alert-danger border-0 rounded-4 p-3 mb-3 d-flex align-items-start gap-2 shadow-xs">
                  <i class="fa-solid fa-triangle-exclamation text-danger mt-1 fs-6"></i>
                  <div class="small">
                    <div class="fw-bold mb-0.5">Registration Failed</div>
                    <div>{{ serverError() }}</div>
                  </div>
                </div>
              }

              <!-- Form -->
              <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
                <!-- Display Name -->
                <div class="mb-3">
                  <label class="form-label small fw-semibold text-muted">{{ 'auth.displayName' | translate }} *</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0 text-muted rounded-start-pill ps-3">
                      <i class="fa-regular fa-user"></i>
                    </span>
                    <input 
                      type="text" 
                      class="form-control rounded-end-pill border-start-0" 
                      placeholder="e.g. Ahmed Hassan"
                      formControlName="displayName"
                      [class.is-invalid]="registerForm.get('displayName')?.invalid && registerForm.get('displayName')?.touched">
                  </div>
                  @if (registerForm.get('displayName')?.invalid && registerForm.get('displayName')?.touched) {
                    <div class="text-danger small mt-1 ms-2">Full name is required (min 2 characters).</div>
                  }
                </div>

                <!-- Email -->
                <div class="mb-3">
                  <label class="form-label small fw-semibold text-muted">{{ 'auth.email' | translate }} *</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0 text-muted rounded-start-pill ps-3">
                      <i class="fa-regular fa-envelope"></i>
                    </span>
                    <input 
                      type="email" 
                      class="form-control rounded-end-pill border-start-0" 
                      placeholder="name@example.com"
                      formControlName="email"
                      [class.is-invalid]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
                  </div>
                  @if (registerForm.get('email')?.invalid && registerForm.get('email')?.touched) {
                    <div class="text-danger small mt-1 ms-2">Valid email is required.</div>
                  }
                </div>

                <!-- Phone -->
                <div class="mb-3">
                  <label class="form-label small fw-semibold text-muted">Phone Number</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0 text-muted rounded-start-pill ps-3">
                      <i class="fa-solid fa-phone"></i>
                    </span>
                    <input 
                      type="tel" 
                      class="form-control rounded-end-pill border-start-0" 
                      placeholder="+20 10 1234 5678"
                      formControlName="phoneNumber">
                  </div>
                </div>

                <!-- Password -->
                <div class="mb-4">
                  <label class="form-label small fw-semibold text-muted">{{ 'auth.password' | translate }} *</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0 text-muted rounded-start-pill ps-3">
                      <i class="fa-solid fa-lock"></i>
                    </span>
                    <input 
                      [type]="showPassword ? 'text' : 'password'" 
                      class="form-control border-start-0 border-end-0" 
                      placeholder="Minimum 6 characters"
                      formControlName="password"
                      (input)="onPasswordInput()"
                      [class.is-invalid]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
                    <button 
                      class="btn btn-light border-top border-bottom border-end rounded-end-pill text-muted px-3" 
                      type="button" 
                      (click)="showPassword = !showPassword">
                      <i class="fa-regular" [ngClass]="showPassword ? 'fa-eye-slash' : 'fa-eye'"></i>
                    </button>
                  </div>

                  <!-- Live Password Strength & Requirements Visual Guide -->
                  <div class="mt-2 p-3 rounded-4 bg-light border" style="font-size: 0.8rem;">
                    <div class="d-flex align-items-center justify-content-between mb-1.5">
                      <span class="text-muted fw-semibold">Password Strength:</span>
                      <span class="fw-bold" [ngClass]="strengthColorClass()">{{ strengthLabel() }}</span>
                    </div>
                    
                    <div class="progress mb-2.5 rounded-pill overflow-hidden" style="height: 6px; background-color: rgba(0,0,0,0.06);">
                      <div class="progress-bar rounded-pill transition-all" 
                           [ngClass]="strengthBarClass()" 
                           [style.width]="strengthPercent() + '%'"></div>
                    </div>

                    <div class="d-flex flex-column gap-1.5 pt-1">
                      <div class="d-flex align-items-center gap-2" [class.text-success]="hasMinLength()" [class.fw-bold]="hasMinLength()">
                        <i class="fa-solid" [ngClass]="hasMinLength() ? 'fa-circle-check text-success' : 'fa-circle text-muted opacity-40'" style="font-size: 0.75rem;"></i>
                        <span>At least 6 characters <span class="badge bg-secondary-subtle text-secondary py-0.5 px-1.5 rounded ms-1" style="font-size: 0.68rem;">Required</span></span>
                      </div>
                      <div class="d-flex align-items-center gap-2" [class.text-success]="hasNumber()">
                        <i class="fa-solid" [ngClass]="hasNumber() ? 'fa-circle-check text-success' : 'fa-circle text-muted opacity-40'" style="font-size: 0.75rem;"></i>
                        <span class="text-muted" [class.text-success]="hasNumber()">Numbers (0-9) <span class="opacity-75" style="font-size: 0.68rem;">(Recommended)</span></span>
                      </div>
                      <div class="d-flex align-items-center gap-2" [class.text-success]="hasUpper()">
                        <i class="fa-solid" [ngClass]="hasUpper() ? 'fa-circle-check text-success' : 'fa-circle text-muted opacity-40'" style="font-size: 0.75rem;"></i>
                        <span class="text-muted" [class.text-success]="hasUpper()">Capital letter (A-Z) <span class="opacity-75" style="font-size: 0.68rem;">(Recommended)</span></span>
                      </div>
                    </div>
                  </div>

                  @if (registerForm.get('password')?.invalid && registerForm.get('password')?.touched) {
                    <div class="text-danger small mt-1 ms-2">Password must be at least 6 characters.</div>
                  }
                </div>

                <!-- Submit Button -->
                <button 
                  type="submit" 
                  class="btn btn-orange btn-lg w-100 rounded-pill py-2.5 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 mb-3"
                  [disabled]="registerForm.invalid || isLoading()">
                  @if (isLoading()) {
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span>Creating Account...</span>
                  } @else {
                    <span>{{ 'auth.registerBtn' | translate }}</span>
                    <i class="fa-solid fa-arrow-right"></i>
                  }
                </button>
              </form>

              <!-- Footer -->
              <div class="text-center mt-3 pt-3 border-top">
                <span class="text-muted small">{{ 'auth.alreadyAccount' | translate }} </span>
                <a routerLink="/account/login" class="text-orange fw-bold text-decoration-none small">
                  {{ 'auth.loginHere' | translate }}
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
    .transition-all {
      transition: all 0.3s ease;
    }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private router = inject(Router);
  private toast = inject(ToastService);

  showPassword = false;
  isLoading = signal<boolean>(false);
  serverError = signal<string | null>(null);

  // Live Password Signals
  passwordVal = signal<string>('');

  hasMinLength = computed(() => this.passwordVal().length >= 6);
  hasNumber = computed(() => /\d/.test(this.passwordVal()));
  hasUpper = computed(() => /[A-Z]/.test(this.passwordVal()));
  hasSpecial = computed(() => /[^A-Za-z0-9]/.test(this.passwordVal()));

  strengthScore = computed(() => {
    const val = this.passwordVal();
    if (!val) return 0;
    let score = 0;
    if (val.length >= 6) score += 1;
    if (val.length >= 8) score += 1;
    if (this.hasNumber()) score += 1;
    if (this.hasUpper()) score += 1;
    if (this.hasSpecial()) score += 1;
    return score;
  });

  strengthPercent = computed(() => {
    const score = this.strengthScore();
    if (score === 0) return 0;
    if (score <= 1) return 25;
    if (score <= 3) return 65;
    return 100;
  });

  strengthLabel = computed(() => {
    const score = this.strengthScore();
    if (score === 0) return 'Too short';
    if (score <= 1) return 'Weak (Valid)';
    if (score <= 3) return 'Good';
    return 'Strong';
  });

  strengthColorClass = computed(() => {
    const score = this.strengthScore();
    if (score === 0) return 'text-muted';
    if (score <= 1) return 'text-danger';
    if (score <= 3) return 'text-warning';
    return 'text-success';
  });

  strengthBarClass = computed(() => {
    const score = this.strengthScore();
    if (score <= 1) return 'bg-danger';
    if (score <= 3) return 'bg-warning';
    return 'bg-success';
  });

  registerForm: FormGroup = this.fb.group({
    displayName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['01012345678'],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onPasswordInput() {
    this.passwordVal.set(this.registerForm.get('password')?.value || '');
    this.serverError.set(null);
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading.set(true);
    this.serverError.set(null);

    const formVal = this.registerForm.value;
    const registerDto = {
      displayName: formVal.displayName,
      email: formVal.email,
      password: formVal.password,
      userName: formVal.email.split('@')[0],
      phoneNumber: formVal.phoneNumber
    };

    this.accountService.register(registerDto).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.toast.success('Account created successfully! Welcome to NovaMart Prime.');
        this.router.navigateByUrl('/shop');
      },
      error: err => {
        this.isLoading.set(false);
        let errorMsg = 'Registration failed. Email might already exist.';
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
