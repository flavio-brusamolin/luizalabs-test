import { PurgeRemovedProductInput, PurgeRemovedProductUseCase } from '../../domain/use-cases/purge-removed-product';
import { RemoveProductCache } from '../contracts/cache';
import { PurgeFavoriteRepository } from '../contracts/database';

export class PurgeRemovedProductService implements PurgeRemovedProductUseCase {
  constructor(
    private readonly purgeFavoriteRepository: PurgeFavoriteRepository,
    private readonly removeProductCache: RemoveProductCache
  ) {}

  async execute({ productId }: PurgeRemovedProductInput): Promise<void> {
    console.log(`Removing favorite ${productId} from all customer lists`);
    await this.purgeFavoriteRepository.purgeFavorite(productId);

    console.log(`Removing product ${productId} from cache`);
    await this.removeProductCache.removeProduct(productId);
  }
}
