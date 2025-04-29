import { CustomerId } from '../entities/customer';
import { Product } from '../entities/product';
import { UseCase } from './use-case';

export interface GetFavoritesInput {
  customerId: CustomerId;
}

export type GetFavoritesUseCase = UseCase<GetFavoritesInput, Product[]>;
