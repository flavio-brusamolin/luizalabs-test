import { ProductId } from '../entities/product';
import { UseCase } from './use-case';

export interface PurgeRemovedProductInput {
  productId: ProductId;
}

export type PurgeRemovedProductUseCase = UseCase<PurgeRemovedProductInput, void>;
