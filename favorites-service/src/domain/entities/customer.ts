import { ProductId } from './product';

export type CustomerId = string;

export interface Customer {
  customerId: CustomerId;
  name: string;
  email: string;
  favorites: Array<ProductId>;
}
