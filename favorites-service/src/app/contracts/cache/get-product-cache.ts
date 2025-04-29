import { Product, ProductId } from '../../../domain/entities/product';

export interface GetProductCache {
  getProduct: (productId: ProductId) => Promise<Product>;
}
