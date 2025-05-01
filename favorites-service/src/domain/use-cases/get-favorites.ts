import { CustomerId } from '../entities/customer';
import { Product } from '../entities/product';
import { UseCase } from './use-case';

export type GetFavoritesUseCase = UseCase<CustomerId, Product[]>;
