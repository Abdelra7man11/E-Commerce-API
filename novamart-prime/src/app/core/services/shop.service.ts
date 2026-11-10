import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Brand, Pagination, Product, ProductType, ShopParams } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  resolveImageUrl(pictureUrl: string | undefined): string {
    if (!pictureUrl) return '';
    if (pictureUrl.startsWith('http://') || pictureUrl.startsWith('https://')) {
      return pictureUrl;
    }
    if (pictureUrl.startsWith('Images/') || pictureUrl.startsWith('images/')) {
      return `https://localhost:7112/${pictureUrl}`;
    }
    if (pictureUrl.startsWith('/')) {
      return `https://localhost:7112${pictureUrl}`;
    }
    return `https://localhost:7112/${pictureUrl}`;
  }

  getProducts(shopParams: ShopParams): Observable<Pagination> {
    let params = new HttpParams();

    if (shopParams.brandId && !isNaN(shopParams.brandId) && shopParams.brandId > 0) {
      params = params.append('brandId', shopParams.brandId.toString());
    }

    if (shopParams.typeId && !isNaN(shopParams.typeId) && shopParams.typeId > 0) {
      params = params.append('typeId', shopParams.typeId.toString());
    }

    if (shopParams.search && shopParams.search.trim()) {
      params = params.append('search', shopParams.search.trim());
    }

    const sort = shopParams.sort || 'nameAsc';
    params = params.append('sort', sort);

    // Guaranteed valid integer for page index / number (never NaN)
    const validPageNumber = (shopParams.pageNumber && !isNaN(shopParams.pageNumber) && shopParams.pageNumber > 0)
      ? Math.floor(shopParams.pageNumber)
      : 1;
    params = params.append('pageIndex', validPageNumber.toString());

    const validPageSize = (shopParams.pageSize && !isNaN(shopParams.pageSize) && shopParams.pageSize > 0)
      ? Math.floor(shopParams.pageSize)
      : 6;
    params = params.append('pageSize', validPageSize.toString());

    return this.http.get<Pagination>(this.baseUrl + 'products', { params }).pipe(
      map(res => {
        if (res && res.data) {
          res.data = res.data.map(p => ({
            ...p,
            pictureUrl: this.resolveImageUrl(p.pictureUrl)
          }));
        }
        return res;
      })
    );
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(this.baseUrl + 'products/' + id).pipe(
      map(p => ({
        ...p,
        pictureUrl: this.resolveImageUrl(p.pictureUrl)
      }))
    );
  }

  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(this.baseUrl + 'products/brands');
  }

  getTypes(): Observable<ProductType[]> {
    return this.http.get<ProductType[]>(this.baseUrl + 'products/types');
  }
}
