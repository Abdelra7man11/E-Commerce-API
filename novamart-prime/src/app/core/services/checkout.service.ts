import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DeliveryMethod, Order, OrderToCreate } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  createOrder(order: OrderToCreate): Observable<Order> {
    return this.http.post<Order>(this.baseUrl + 'orders', order);
  }

  getDeliveryMethods(): Observable<DeliveryMethod[]> {
    return this.http.get<DeliveryMethod[]>(this.baseUrl + 'orders/deliveryMethods');
  }
}
