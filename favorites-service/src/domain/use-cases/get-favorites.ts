import { CustomerId } from '../entities/customer';
import { Product } from '../entities/product';
import { UseCase } from './use-case';

export type GetFavoritesInput = {
  customerId: CustomerId;
  page: number;
  limit: number;
};

export type GetFavoritesUseCase = UseCase<GetFavoritesInput, Product[]>;
