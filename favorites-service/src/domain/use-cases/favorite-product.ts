import { CustomerId } from '../entities/customer';
import { Product, ProductId } from '../entities/product';
import { UseCase } from './use-case';

export interface FavoriteProductInput {
  customerId: CustomerId;
  productId: ProductId;
}

export type FavoriteProductUseCase = UseCase<FavoriteProductInput, Product>;
