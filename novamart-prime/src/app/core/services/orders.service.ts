import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  private resolveImageUrl(pictureUrl: string | undefined): string {
    if (!pictureUrl) return 'assets/placeholder.svg';
    const filename = pictureUrl.split('/').pop() || '';
    if (filename && (filename.endsWith('.png') || filename.endsWith('.jpg') || filename.endsWith('.svg') || filename.endsWith('.webp'))) {
      return `assets/images/Products/${filename}`;
    }
    if (pictureUrl.startsWith('http://') || pictureUrl.startsWith('https://')) {
      return pictureUrl;
    }
    return `assets/images/Products/${filename || pictureUrl}`;
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl + 'orders').pipe(
      map(orders => {
        return (orders || []).map(order => ({
          ...order,
          items: (order.items || []).map(item => ({
            ...item,
            pictureUrl: this.resolveImageUrl(item.pictureUrl)
          }))
        }));
      })
    );
  }

  getOrderDetailed(id: string): Observable<Order> {
    return this.http.get<Order>(this.baseUrl + 'orders/' + id).pipe(
      map(order => ({
        ...order,
        items: (order.items || []).map(item => ({
          ...item,
          pictureUrl: this.resolveImageUrl(item.pictureUrl)
        }))
      }))
    );
  }
}
