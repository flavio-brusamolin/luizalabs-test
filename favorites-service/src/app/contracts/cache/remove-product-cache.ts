import { ProductId } from '../../../domain/entities/product';

export interface RemoveProductCache {
  removeProduct: (productId: ProductId) => Promise<void>;
}
