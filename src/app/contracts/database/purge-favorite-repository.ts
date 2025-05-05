import { ProductId } from '../../../domain/entities/product';

export interface PurgeFavoriteRepository {
  purgeFavorite: (productId: ProductId) => Promise<void>;
}
