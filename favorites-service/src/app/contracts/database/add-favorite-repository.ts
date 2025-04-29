import { CustomerId } from '../../../domain/entities/customer';
import { ProductId } from '../../../domain/entities/product';

export interface AddFavoriteRepository {
  addFavorite: (customerId: CustomerId, productId: ProductId) => Promise<void>;
}
