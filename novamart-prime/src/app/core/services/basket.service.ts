import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Basket, BasketItem, BasketTotals, CustomerBasket } from '../models/basket.model';
import { DeliveryMethod } from '../models/order.model';
import { Product } from '../models/product.model';
import { LanguageService } from './language.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  private lang = inject(LanguageService);
  private baseUrl = environment.apiUrl;

  basket = signal<CustomerBasket | null>(null);
  isDrawerOpen = signal<boolean>(false);

  basketTotal = computed<BasketTotals>(() => {
    const currentBasket = this.basket();
    if (!currentBasket || !currentBasket.items) {
      return { shipping: 0, subtotal: 0, total: 0 };
    }
    const shipping = currentBasket.shippingPrice || 0;
    const subtotal = currentBasket.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal + shipping;
    return { shipping, subtotal, total };
  });

  itemCount = computed<number>(() => {
    const currentBasket = this.basket();
    if (!currentBasket || !currentBasket.items) return 0;
    return currentBasket.items.reduce((count, item) => count + item.quantity, 0);
  });

  constructor() {
    this.restoreBasketFromLocal();
    this.loadInitialBasket();
  }

  /**
   * Synchronously restore basket from localStorage on app boot / page refresh
   * so the cart counter and items are NEVER wiped out while network calls are in flight.
   */
  private restoreBasketFromLocal() {
    try {
      const savedData = localStorage.getItem('tp_basket_data');
      if (savedData) {
        const parsed = JSON.parse(savedData) as CustomerBasket;
        if (parsed && Array.isArray(parsed.items) && parsed.items.length > 0) {
          this.basket.set(parsed);
        }
      }
    } catch (e) {
      console.warn('Could not restore local basket cache:', e);
    }
  }

  private saveBasketToLocal(basket: CustomerBasket | null) {
    try {
      if (basket && basket.items && basket.items.length > 0) {
        localStorage.setItem('tp_basket_id', basket.id);
        localStorage.setItem('tp_basket_data', JSON.stringify(basket));
      } else {
        localStorage.removeItem('tp_basket_id');
        localStorage.removeItem('tp_basket_data');
      }
    } catch (e) {
      console.warn('Could not persist basket to localStorage:', e);
    }
  }

  loadInitialBasket() {
    const basketId = localStorage.getItem('tp_basket_id');
    if (basketId) {
      this.getBasket(basketId);
    }
  }

  toggleDrawer(open?: boolean) {
    if (open !== undefined) {
      this.isDrawerOpen.set(open);
    } else {
      this.isDrawerOpen.update(v => !v);
    }
  }

  getBasket(id: string) {
    // Send both ?id= and ?key= to satisfy both controller signatures
    return this.http.get<CustomerBasket | null>(`${this.baseUrl}baskets?id=${encodeURIComponent(id)}&key=${encodeURIComponent(id)}`).subscribe({
      next: basket => {
        if (basket && basket.items && basket.items.length > 0) {
          this.basket.set(basket);
          this.saveBasketToLocal(basket);
        } else {
          // If Redis returned null or empty, but we have items in local cache, re-save to backend
          const local = this.basket();
          if (local && local.items && local.items.length > 0) {
            this.setBasket(local);
          }
        }
      },
      error: () => {
        // In case of backend glitch or Redis restart, preserve local cache!
        const local = this.basket();
        if (local && local.items && local.items.length > 0) {
          this.saveBasketToLocal(local);
        }
      }
    });
  }

  setBasket(basket: CustomerBasket) {
    // Immediate optimistic local update
    this.basket.set(basket);
    this.saveBasketToLocal(basket);

    return this.http.post<CustomerBasket>(this.baseUrl + 'baskets', basket).subscribe({
      next: updatedBasket => {
        if (updatedBasket && updatedBasket.items) {
          this.basket.set(updatedBasket);
          this.saveBasketToLocal(updatedBasket);
        }
      },
      error: err => {
        console.error('Error saving basket to backend:', err);
      }
    });
  }

  addItemToBasket(product: Product, quantity = 1) {
    const itemToAdd: BasketItem = {
      id: product.id,
      productName: product.name,
      price: product.price,
      quantity,
      pictureUrl: product.pictureUrl,
      brand: product.productBrand,
      type: product.productType
    };

    let currentBasket = this.basket();
    if (!currentBasket) {
      currentBasket = new Basket();
      this.saveBasketToLocal(currentBasket);
    }

    const items = [...currentBasket.items];
    const existingIndex = items.findIndex(i => i.id === itemToAdd.id);

    if (existingIndex > -1) {
      items[existingIndex].quantity += quantity;
    } else {
      items.push(itemToAdd);
    }

    currentBasket.items = items;
    this.setBasket(currentBasket);
    const msg = this.lang.isArabic()
      ? `تمت إضافة "${product.name}" إلى السلة بنجاح!`
      : `"${product.name}" added to cart!`;
    this.toast.success(msg);
    this.toggleDrawer(true);
  }

  incrementItemQuantity(item: BasketItem) {
    const currentBasket = this.basket();
    if (!currentBasket) return;

    const items = [...currentBasket.items];
    const index = items.findIndex(i => i.id === item.id);
    if (index > -1) {
      items[index].quantity++;
      currentBasket.items = items;
      this.setBasket(currentBasket);
    }
  }

  decrementItemQuantity(item: BasketItem) {
    const currentBasket = this.basket();
    if (!currentBasket) return;

    const items = [...currentBasket.items];
    const index = items.findIndex(i => i.id === item.id);
    if (index > -1) {
      if (items[index].quantity > 1) {
        items[index].quantity--;
        currentBasket.items = items;
        this.setBasket(currentBasket);
      } else {
        this.removeItemFromBasket(item.id);
      }
    }
  }

  removeItemFromBasket(itemId: number) {
    const currentBasket = this.basket();
    if (!currentBasket) return;

    const items = currentBasket.items.filter(i => i.id !== itemId);
    if (items.length > 0) {
      currentBasket.items = items;
      this.setBasket(currentBasket);
    } else {
      this.deleteBasket(currentBasket.id);
    }
  }

  setShippingPrice(deliveryMethod: DeliveryMethod) {
    const currentBasket = this.basket();
    if (!currentBasket) return;

    currentBasket.deliveryMethodId = deliveryMethod.id;
    currentBasket.shippingPrice = deliveryMethod.cost ?? deliveryMethod.price;
    this.setBasket(currentBasket);
  }

  deleteBasket(id: string) {
    this.basket.set(null);
    this.saveBasketToLocal(null);

    return this.http.delete(`${this.baseUrl}baskets/${encodeURIComponent(id)}`).subscribe({
      next: () => {},
      error: () => {
        this.http.delete(`${this.baseUrl}baskets?id=${encodeURIComponent(id)}`).subscribe({
          error: () => {}
        });
      }
    });
  }

  createPaymentIntent() {
    const basketId = this.basket()?.id;
    if (!basketId) return;
    return this.http.post<CustomerBasket>(`${this.baseUrl}payments/${encodeURIComponent(basketId)}`, {});
  }
}
