import { Product, ProductId } from '../../../domain/entities/product';

export interface GetProductClient {
  getProduct: (productId: ProductId) => Promise<Product>;
}
