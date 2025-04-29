import { ProductId } from '../entities/product';
import { UseCase } from './use-case';

export interface UpdateStaleProductInput {
  productId: ProductId;
}

export type UpdateStaleProductUseCase = UseCase<UpdateStaleProductInput, void>;
