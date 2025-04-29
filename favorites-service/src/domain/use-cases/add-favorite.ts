import { CustomerId } from '../entities/customer';
import { Product, ProductId } from '../entities/product';
import { UseCase } from './use-case';

export interface AddFavoriteInput {
  customerId: CustomerId;
  productId: ProductId;
}

export type AddFavoriteUseCase = UseCase<AddFavoriteInput, Product>;
