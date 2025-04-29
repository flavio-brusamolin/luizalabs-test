import { PurgeRemovedProductInput, PurgeRemovedProductUseCase } from '../../domain/use-cases/purge-removed-product';
import { RemoveProductCache } from '../contracts/cache';
import { PurgeFavoriteRepository } from '../contracts/database';

export class PurgeRemovedProductService implements PurgeRemovedProductUseCase {
  constructor(
    private readonly purgeFavoriteRepository: PurgeFavoriteRepository,
    private readonly removeProductCache: RemoveProductCache
  ) {}

  async execute({ productId }: PurgeRemovedProductInput): Promise<void> {
    await this.purgeFavoriteRepository.purgeFavorite(productId);
    await this.removeProductCache.removeProduct(productId);
  }
}
