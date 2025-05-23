import { Product } from '../../../domain/entities/product';

export interface AddProductCache {
  addProduct: (product: Product) => Promise<void>;
}
