import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DeliveryMethod, OrderToCreate } from '../../core/models/order.model';
import { AccountService } from '../../core/services/account.service';
import { BasketService } from '../../core/services/basket.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="checkout-page py-5">
      <div class="container-xl">
        <!-- Breadcrumb & Header -->
        <div class="mb-4">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-1 small text-muted">
              <li class="breadcrumb-item"><a routerLink="/" class="text-decoration-none text-muted">Home</a></li>
              <li class="breadcrumb-item"><a routerLink="/cart" class="text-decoration-none text-muted">Cart</a></li>
              <li class="breadcrumb-item active text-orange fw-semibold" aria-current="page">Checkout</li>
            </ol>
          </nav>
          <h2 class="fw-bold m-0 text-dark">Secure Checkout</h2>
        </div>

        @if (!basketService.basket() || basketService.basket()!.items.length === 0) {
          <div class="card border-0 shadow-sm rounded-4 text-center py-5">
            <i class="fa-solid fa-basket-shopping fs-1 text-muted mb-3"></i>
            <h4 class="fw-bold">Your basket is empty</h4>
            <p class="text-muted small mb-4">Please add items to your cart before proceeding to checkout.</p>
            <div>
              <a routerLink="/shop" class="btn btn-orange rounded-pill px-4 fw-semibold">
                Explore Catalog
              </a>
            </div>
          </div>
        } @else {
          <!-- Stepper Indicator -->
          <div class="checkout-stepper bg-white p-3 rounded-4 shadow-sm mb-4">
            <div class="row text-center g-2">
              <div class="col-4">
                <div class="step-item" [class.active]="currentStep === 1" [class.completed]="currentStep > 1" (click)="goToStep(1)">
                  <div class="step-icon mb-1">
                    @if (currentStep > 1) {
                      <i class="fa-solid fa-check"></i>
                    } @else {
                      <span>1</span>
                    }
                  </div>
                  <div class="step-label small fw-bold">1. Delivery Address</div>
                </div>
              </div>
              <div class="col-4">
                <div class="step-item" [class.active]="currentStep === 2" [class.completed]="currentStep > 2" (click)="currentStep > 1 ? goToStep(2) : null">
                  <div class="step-icon mb-1">
                    @if (currentStep > 2) {
                      <i class="fa-solid fa-check"></i>
                    } @else {
                      <span>2</span>
                    }
                  </div>
                  <div class="step-label small fw-bold">2. Delivery Method</div>
                </div>
              </div>
              <div class="col-4">
                <div class="step-item" [class.active]="currentStep === 3" (click)="currentStep > 2 ? goToStep(3) : null">
                  <div class="step-icon mb-1">
                    <span>3</span>
                  </div>
                  <div class="step-label small fw-bold">3. Review & Payment</div>
                </div>
              </div>
            </div>
          </div>

          <div class="row g-4">
            <!-- Steps Container -->
            <div class="col-lg-8">
              <!-- STEP 1: ADDRESS -->
              @if (currentStep === 1) {
                <div class="card border-0 shadow-sm rounded-4 p-4">
                  <div class="d-flex justify-content-between align-items-center mb-4">
                    <h5 class="fw-bold m-0 text-dark">
                      <i class="fa-solid fa-location-dot text-orange me-2"></i>Shipping Address
                    </h5>
                    @if (hasSavedAddress) {
                      <button class="btn btn-sm btn-outline-secondary rounded-pill px-3" (click)="fillWithSavedAddress()">
                        <i class="fa-solid fa-clock-rotate-left me-1"></i> Fill Saved Address
                      </button>
                    }
                  </div>

                  <form [formGroup]="addressForm" (ngSubmit)="submitStep1()">
                    <div class="row g-3">
                      <div class="col-sm-6">
                        <label class="form-label small fw-semibold text-muted">First Name *</label>
                        <input 
                          type="text" 
                          class="form-control rounded-3" 
                          placeholder="e.g. Mohamed"
                          formControlName="firstName"
                          [class.is-invalid]="addressForm.get('firstName')?.invalid && addressForm.get('firstName')?.touched">
                        <div class="invalid-feedback small">First name is required.</div>
                      </div>

                      <div class="col-sm-6">
                        <label class="form-label small fw-semibold text-muted">Last Name *</label>
                        <input 
                          type="text" 
                          class="form-control rounded-3" 
                          placeholder="e.g. Ali"
                          formControlName="lastName"
                          [class.is-invalid]="addressForm.get('lastName')?.invalid && addressForm.get('lastName')?.touched">
                        <div class="invalid-feedback small">Last name is required.</div>
                      </div>

                      <div class="col-12">
                        <label class="form-label small fw-semibold text-muted">Street Address *</label>
                        <input 
                          type="text" 
                          class="form-control rounded-3" 
                          placeholder="e.g. 15 El-Tahrir Street, Apt 4"
                          formControlName="street"
                          [class.is-invalid]="addressForm.get('street')?.invalid && addressForm.get('street')?.touched">
                        <div class="invalid-feedback small">Street address is required.</div>
                      </div>

                      <div class="col-sm-6">
                        <label class="form-label small fw-semibold text-muted">City *</label>
                        <input 
                          type="text" 
                          class="form-control rounded-3" 
                          placeholder="e.g. Cairo"
                          formControlName="city"
                          [class.is-invalid]="addressForm.get('city')?.invalid && addressForm.get('city')?.touched">
                        <div class="invalid-feedback small">City is required.</div>
                      </div>

                      <div class="col-sm-6">
                        <label class="form-label small fw-semibold text-muted">Country *</label>
                        <input 
                          type="text" 
                          class="form-control rounded-3" 
                          placeholder="e.g. Egypt"
                          formControlName="country"
                          [class.is-invalid]="addressForm.get('country')?.invalid && addressForm.get('country')?.touched">
                        <div class="invalid-feedback small">Country is required.</div>
                      </div>

                      <div class="col-12 mt-3">
                        <div class="form-check">
                          <input class="form-check-input" type="checkbox" id="saveAddressCheck" formControlName="saveAsDefault">
                          <label class="form-check-label small text-muted" for="saveAddressCheck">
                            Save this address to my profile for future orders
                          </label>
                        </div>
                      </div>
                    </div>

                    <div class="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                      <a routerLink="/cart" class="btn btn-outline-secondary rounded-pill px-4 fw-semibold">
                        <i class="fa-solid fa-arrow-left me-1"></i> Back to Cart
                      </a>
                      <button type="submit" class="btn btn-orange rounded-pill px-5 fw-bold shadow-sm" [disabled]="addressForm.invalid">
                        Proceed to Delivery <i class="fa-solid fa-arrow-right ms-1"></i>
                      </button>
                    </div>
                  </form>
                </div>
              }

              <!-- STEP 2: DELIVERY METHOD -->
              @if (currentStep === 2) {
                <div class="card border-0 shadow-sm rounded-4 p-4">
                  <div class="mb-4">
                    <h5 class="fw-bold m-0 text-dark">
                      <i class="fa-solid fa-truck-fast text-orange me-2"></i>Select Delivery Method
                    </h5>
                    <p class="text-muted small m-0">Choose how fast you want your order delivered</p>
                  </div>

                  <div class="row g-3 mb-4">
                    @for (method of deliveryMethods(); track method.id) {
                      <div class="col-12">
                        <div 
                          class="delivery-method-card p-3 rounded-4 border d-flex align-items-center justify-content-between cursor-pointer transition-all"
                          [class.selected-method]="selectedDeliveryMethod?.id === method.id"
                          (click)="onSelectDeliveryMethod(method)">
                          <div class="d-flex align-items-center gap-3">
                            <div class="form-check m-0">
                              <input 
                                class="form-check-input" 
                                type="radio" 
                                name="deliveryRadio" 
                                [checked]="selectedDeliveryMethod?.id === method.id">
                            </div>
                            <div>
                              <h6 class="fw-bold m-0 text-dark">{{ method.shortName }}</h6>
                              <p class="small text-muted m-0">{{ method.description }}</p>
                              <span class="badge bg-light text-secondary border rounded-pill mt-1" style="font-size: 0.72rem;">
                                <i class="fa-regular fa-clock me-1"></i>{{ method.deliveryTime }}
                              </span>
                            </div>
                          </div>
                          <div class="text-end">
                            <span class="fs-5 fw-black text-orange">
                              {{ method.cost === 0 ? 'FREE' : (method.cost | currency) }}
                            </span>
                          </div>
                        </div>
                      </div>
                    }
                  </div>

                  <div class="d-flex justify-content-between align-items-center pt-3 border-top">
                    <button class="btn btn-outline-secondary rounded-pill px-4 fw-semibold" (click)="goToStep(1)">
                      <i class="fa-solid fa-arrow-left me-1"></i> Back to Address
                    </button>
                    <button class="btn btn-orange rounded-pill px-5 fw-bold shadow-sm" [disabled]="!selectedDeliveryMethod" (click)="goToStep(3)">
                      Proceed to Review & Pay <i class="fa-solid fa-arrow-right ms-1"></i>
                    </button>
                  </div>
                </div>
              }

              <!-- STEP 3: REVIEW & PAYMENT -->
              @if (currentStep === 3) {
                <div class="card border-0 shadow-sm rounded-4 p-4">
                  <div class="mb-4">
                    <h5 class="fw-bold m-0 text-dark">
                      <i class="fa-solid fa-credit-card text-orange me-2"></i>Review & Payment
                    </h5>
                    <p class="text-muted small m-0">Review your order details and complete payment</p>
                  </div>

                  <!-- Delivery Details Recap -->
                  <div class="bg-light p-3 rounded-4 mb-4 border">
                    <div class="row g-3">
                      <div class="col-sm-6">
                        <div class="small text-muted fw-bold text-uppercase mb-1">Delivering To</div>
                        <div class="fw-semibold text-dark">
                          {{ addressForm.get('firstName')?.value }} {{ addressForm.get('lastName')?.value }}
                        </div>
                        <div class="small text-muted">
                          {{ addressForm.get('street')?.value }}, {{ addressForm.get('city')?.value }}, {{ addressForm.get('country')?.value }}
                        </div>
                      </div>
                      <div class="col-sm-6">
                        <div class="small text-muted fw-bold text-uppercase mb-1">Delivery Speed</div>
                        <div class="fw-semibold text-dark">{{ selectedDeliveryMethod?.shortName }}</div>
                        <div class="small text-muted">{{ selectedDeliveryMethod?.deliveryTime }} ({{ (selectedDeliveryMethod?.cost ?? selectedDeliveryMethod?.price) | currency }})</div>
                      </div>
                    </div>
                  </div>

                  <!-- Items Preview -->
                  <h6 class="fw-bold mb-3 text-dark">Basket Items ({{ basketService.itemCount() }})</h6>
                  <div class="list-group list-group-flush mb-4">
                    @for (item of basketService.basket()!.items; track item.id) {
                      <div class="list-group-item px-0 py-2 d-flex justify-content-between align-items-center border-bottom">
                        <div class="d-flex align-items-center gap-3">
                          <img [src]="item.pictureUrl || 'assets/placeholder.svg'" (error)="onImgError($event)" class="rounded-3 border object-fit-contain p-1" style="width: 44px; height: 44px;">
                          <div>
                            <div class="fw-semibold text-dark small">{{ item.productName }}</div>
                            <div class="text-muted" style="font-size: 0.75rem;">Qty: {{ item.quantity }} × {{ item.price | currency }}</div>
                          </div>
                        </div>
                        <div class="fw-bold text-dark small">
                          {{ (item.price * item.quantity) | currency }}
                        </div>
                      </div>
                    }
                  </div>

                  <!-- Mock Payment Section -->
                  <h6 class="fw-bold mb-3 text-dark">
                    <i class="fa-regular fa-credit-card text-muted me-2"></i>Payment Details
                  </h6>
                  <div class="p-3 border rounded-4 bg-white mb-4">
                    <div class="d-flex align-items-center gap-2 mb-3">
                      <span class="badge bg-success-subtle text-success px-3 py-1.5 rounded-pill fw-semibold">
                        <i class="fa-solid fa-lock me-1"></i> Sandbox Test Mode
                      </span>
                      <span class="small text-muted">Any 16-digit card number will work</span>
                    </div>

                    <div class="row g-3">
                      <div class="col-12">
                        <label class="form-label small fw-semibold text-muted">Card Number</label>
                        <div class="input-group">
                          <span class="input-group-text bg-light border-end-0"><i class="fa-regular fa-credit-card text-muted"></i></span>
                          <input type="text" class="form-control border-start-0" placeholder="4242 4242 4242 4242" [(ngModel)]="mockCardNumber" maxlength="19">
                        </div>
                      </div>
                      <div class="col-sm-6">
                        <label class="form-label small fw-semibold text-muted">Expiration Date</label>
                        <input type="text" class="form-control" placeholder="MM/YY" [(ngModel)]="mockExp" maxlength="5">
                      </div>
                      <div class="col-sm-6">
                        <label class="form-label small fw-semibold text-muted">CVC / CVV</label>
                        <input type="password" class="form-control" placeholder="123" [(ngModel)]="mockCvc" maxlength="4">
                      </div>
                    </div>
                  </div>

                  <div class="d-flex justify-content-between align-items-center pt-3 border-top">
                    <button class="btn btn-outline-secondary rounded-pill px-4 fw-semibold" (click)="goToStep(2)">
                      <i class="fa-solid fa-arrow-left me-1"></i> Back to Delivery
                    </button>
                    <button 
                      class="btn btn-orange rounded-pill px-5 py-2.5 fw-bold shadow-sm d-flex align-items-center gap-2" 
                      [disabled]="isSubmitting()"
                      (click)="placeOrder()">
                      @if (isSubmitting()) {
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span>Placing Order...</span>
                      } @else {
                        <i class="fa-solid fa-check"></i>
                        <span>Confirm & Place Order ({{ basketService.basketTotal().total | currency }})</span>
                      }
                    </button>
                  </div>
                </div>
              }
            </div>

            <!-- Order Summary Sticky Card -->
            <div class="col-lg-4">
              <div class="card border-0 shadow-sm rounded-4 p-4 sticky-top" style="top: 100px;">
                <h6 class="fw-bold text-dark mb-3">Order Overview</h6>

                <div class="d-flex justify-content-between mb-2 small">
                  <span class="text-muted">Items Subtotal</span>
                  <span class="fw-semibold text-dark">{{ basketService.basketTotal().subtotal | currency }}</span>
                </div>

                <div class="d-flex justify-content-between mb-2 small">
                  <span class="text-muted">Delivery Speed</span>
                  <span class="fw-semibold text-dark">
                    @if (selectedDeliveryMethod) {
                      {{ selectedDeliveryMethod.cost === 0 ? 'FREE' : (selectedDeliveryMethod.cost | currency) }}
                    } @else {
                      <span class="text-muted">Selected next</span>
                    }
                  </span>
                </div>

                <hr class="my-3 opacity-25">

                <div class="d-flex justify-content-between align-items-center mb-3">
                  <span class="fw-bold text-dark fs-5">Estimated Total</span>
                  <span class="fw-black text-orange fs-4">{{ basketService.basketTotal().total | currency }}</span>
                </div>

                <div class="p-2.5 bg-light rounded-3 text-muted small lh-sm">
                  <i class="fa-solid fa-shield-halved text-success me-1"></i> 100% Secure Checkout guaranteed by Talabat Prime.
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .checkout-stepper .step-item {
      cursor: pointer;
      opacity: 0.6;
      transition: all 0.2s ease;
    }
    .checkout-stepper .step-item.active {
      opacity: 1;
      color: var(--tp-primary);
    }
    .checkout-stepper .step-item.completed {
      opacity: 1;
      color: #198754;
    }
    .step-icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #f1f3f5;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: #495057;
      transition: all 0.2s ease;
    }
    .step-item.active .step-icon {
      background: var(--tp-primary);
      color: #fff;
      box-shadow: 0 4px 10px rgba(255, 90, 0, 0.3);
    }
    .step-item.completed .step-icon {
      background: #198754;
      color: #fff;
    }
    .delivery-method-card {
      border: 1.5px solid #e9ecef;
      background: #fff;
    }
    .delivery-method-card:hover {
      border-color: var(--tp-primary);
      background: #fffbfa;
    }
    .delivery-method-card.selected-method {
      border-color: var(--tp-primary) !important;
      background: #fff5ee !important;
    }
    .cursor-pointer {
      cursor: pointer;
    }
  `]
})
export class CheckoutComponent implements OnInit {
  private fb = inject(FormBuilder);
  basketService = inject(BasketService);
  private accountService = inject(AccountService);
  private checkoutService = inject(CheckoutService);
  private toast = inject(ToastService);
  private router = inject(Router);

  currentStep = 1;
  hasSavedAddress = false;
  deliveryMethods = signal<DeliveryMethod[]>([]);
  selectedDeliveryMethod: DeliveryMethod | null = null;
  isSubmitting = signal<boolean>(false);

  mockCardNumber = '4242 4242 4242 4242';
  mockExp = '12/28';
  mockCvc = '123';

  addressForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    street: ['', Validators.required],
    city: ['', Validators.required],
    country: ['Egypt', Validators.required],
    saveAsDefault: [true]
  });

  ngOnInit(): void {
    this.loadSavedAddress();
    this.loadDeliveryMethods();
  }

  loadSavedAddress() {
    this.accountService.getUserAddress().subscribe({
      next: addr => {
        if (addr) {
          this.hasSavedAddress = true;
          this.addressForm.patchValue({
            firstName: addr.firstName,
            lastName: addr.lastName,
            street: addr.street,
            city: addr.city,
            country: addr.country
          });
        }
      },
      error: () => {}
    });
  }

  fillWithSavedAddress() {
    this.loadSavedAddress();
    this.toast.info('Address filled from your profile');
  }

  private readonly FALLBACK_IMG = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23ff5a00' stroke-width='1.5'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' stroke='%23cbd5e1'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5' stroke='%23ff5a00'/%3E%3Cpath d='m21 15-5-5L5 21' stroke='%2394a3b8'/%3E%3C/svg%3E";

  onImgError(event: Event) {
    const target = event.target as HTMLImageElement;
    if (target && !target.src.startsWith('data:')) {
      target.src = this.FALLBACK_IMG;
    }
  }

  loadDeliveryMethods() {
    this.checkoutService.getDeliveryMethods().subscribe({
      next: methods => {
        this.deliveryMethods.set(methods);
        if (methods.length > 0) {
          const currentMethodId = this.basketService.basket()?.deliveryMethodId;
          const matched = methods.find(m => m.id === currentMethodId) || methods[0];
          this.onSelectDeliveryMethod(matched);
        }
      }
    });
  }

  onSelectDeliveryMethod(method: DeliveryMethod) {
    this.selectedDeliveryMethod = method;
    this.basketService.setShippingPrice(method);
  }

  goToStep(step: number) {
    this.currentStep = step;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  submitStep1() {
    if (this.addressForm.invalid) return;

    if (this.addressForm.get('saveAsDefault')?.value) {
      const { firstName, lastName, street, city, country } = this.addressForm.value;
      this.accountService.updateUserAddress({ firstName, lastName, street, city, country }).subscribe();
    }

    this.goToStep(2);
  }

  placeOrder() {
    const basket = this.basketService.basket();
    if (!basket || !this.selectedDeliveryMethod) {
      this.toast.error('Missing basket or delivery method');
      return;
    }

    const { firstName, lastName, street, city, country } = this.addressForm.value;
    const orderToCreate: OrderToCreate = {
      basketId: basket.id,
      deliveryMethodId: this.selectedDeliveryMethod.id,
      shipToAddress: { firstName, lastName, street, city, country }
    };

    this.isSubmitting.set(true);

    const executeOrder = () => {
      this.checkoutService.createOrder(orderToCreate).subscribe({
        next: createdOrder => {
          this.isSubmitting.set(false);
          this.toast.success('Your order was placed successfully!');
          this.basketService.deleteBasket(basket.id);
          this.router.navigate(['/checkout/success', createdOrder.id]);
        },
        error: err => {
          this.isSubmitting.set(false);
          this.toast.error(err.error?.message || 'Failed to place order. Please check your data.');
        }
      });
    };

    // Trigger payment authorization intent
    const payment$ = this.basketService.createPaymentIntent();
    if (payment$) {
      payment$.subscribe({
        next: () => executeOrder(),
        error: () => executeOrder()
      });
    } else {
      executeOrder();
    }
  }
}
