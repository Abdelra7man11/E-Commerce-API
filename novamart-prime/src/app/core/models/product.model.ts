export interface Product {
  id: number;
  name: string;
  description: string;
  pictureUrl: string;
  price: number;
  productBrand: string;
  productType: string;
}

export interface Brand {
  id: number;
  name: string;
}

export interface ProductType {
  id: number;
  name: string;
}

export interface Pagination {
  pageNumber: number;
  pageIndex?: number;
  pageSize: number;
  count: number;
  totalCount?: number;
  data: Product[];
}

export class ShopParams {
  brandId = 0;
  typeId = 0;
  sort = 'nameAsc';
  pageNumber = 1;
  pageSize = 6;
  search = '';
}
