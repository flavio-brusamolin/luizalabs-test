import { CustomerId } from '../../../domain/entities/customer';
import { ProductId } from '../../../domain/entities/product';

export interface GetFavoritesRepository {
  getFavorites: (customerId: CustomerId, page: number, limit: number) => Promise<ProductId[]>;
}
