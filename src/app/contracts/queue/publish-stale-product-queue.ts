import { ProductId } from '../../../domain/entities/product';

export interface PublishStaleProductQueue {
  publishStaleProduct: (productId: ProductId) => void;
}
