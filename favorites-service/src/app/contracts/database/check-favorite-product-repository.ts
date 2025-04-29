import { CustomerId } from '../../../domain/entities/customer';
import { ProductId } from '../../../domain/entities/product';

export interface CheckFavoriteProductRepository {
  isFavorite: (customerId: CustomerId, productId: ProductId) => Promise<boolean>;
}
