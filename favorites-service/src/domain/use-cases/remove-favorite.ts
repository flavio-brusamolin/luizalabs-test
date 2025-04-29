import { CustomerId } from '../entities/customer';
import { ProductId } from '../entities/product';
import { UseCase } from './use-case';

export interface RemoveFavoriteInput {
  customerId: CustomerId;
  productId: ProductId;
}

export type RemoveFavoriteUseCase = UseCase<RemoveFavoriteInput, void>;
