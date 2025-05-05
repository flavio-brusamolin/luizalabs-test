import { Product } from '../../../domain/entities/product';

export interface UpdateProductCache {
  updateProduct: (product: Product) => Promise<void>;
}
