import { Address } from './user.model';

export interface OrderItem {
  productId: string;
  productName: string;
  pictureUrl: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  buyerEmail: string;
  orderDate: string;
  shipToAddress: Address;
  deliveryMethod: string;
  deliveryCost: number;
  items: OrderItem[];
  subtotal: number;
  status: string;
  total: number;
}

export interface DeliveryMethod {
  id: number;
  shortName: string;
  deliveryTime: string;
  description: string;
  price: number;
  cost: number;
}

export interface OrderToCreate {
  basketId: string;
  deliveryMethodId: number;
  shipToAddress: Address;
}
