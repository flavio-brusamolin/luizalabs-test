import { Product } from '../../domain/entities/product';
import { GetFavoritesInput, GetFavoritesUseCase } from '../../domain/use-cases/get-favorites';
import { GetProductCache } from '../contracts/cache';
import { GetFavoritesRepository } from '../contracts/database/get-favorites-repository';
import { PublishStaleProductQueue } from '../contracts/queue';

export class GetFavoritesService implements GetFavoritesUseCase {
  constructor(
    private readonly getFavoritesRepository: GetFavoritesRepository,
    private readonly getProductCache: GetProductCache,
    private readonly publishStaleProductQueue: PublishStaleProductQueue
  ) {}

  async execute({ customerId, page, limit }: GetFavoritesInput): Promise<Product[]> {
    console.log(`Getting customer ${customerId} favorites`);
    const favoriteProductIds = await this.getFavoritesRepository.getFavorites(customerId, page, limit);

    const favoriteProductPromises = favoriteProductIds.map(async (productId) => {
      console.log(`Searching for product ${productId} in cache`);
      const cachedProduct = await this.getProductCache.getProduct(productId);

      if (cachedProduct.stale) {
        console.log(`Product ${productId} is stale in cache, queueing update`);
        this.publishStaleProductQueue.publishStaleProduct(productId);
      }

      return cachedProduct;
    });

    return await Promise.all(favoriteProductPromises);
  }
}
