export interface BasketItem {
  id: number;
  productName: string;
  price: number;
  quantity: number;
  pictureUrl: string;
  brand?: string;
  type?: string;
}

export interface CustomerBasket {
  id: string;
  items: BasketItem[];
  clientSecret?: string;
  paymentIntentId?: string;
  deliveryMethodId?: number;
  shippingPrice?: number;
}

export interface BasketTotals {
  shipping: number;
  subtotal: number;
  total: number;
}

export class Basket implements CustomerBasket {
  id = 'basket_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
  items: BasketItem[] = [];
  shippingPrice = 0;
}
