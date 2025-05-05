import { ApiKey, CustomerId } from '../../domain/entities/customer';
import { ProductId } from '../../domain/entities/product';

export interface DatabaseCustomer {
  customerId: CustomerId;
  name: string;
  email: string;
  favorites: ProductId[];
  apiKey: ApiKey;
}
