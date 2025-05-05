import { CustomerId } from '../../../domain/entities/customer';
import { ProductId } from '../../../domain/entities/product';

export interface RemoveFavoriteRepository {
  removeFavorite: (customerId: CustomerId, productId: ProductId) => Promise<void>;
}
