import { ProductId } from '../../../domain/entities/product';

export interface PublishRemovedProductQueue {
  publishRemovedProduct: (productId: ProductId) => void;
}
