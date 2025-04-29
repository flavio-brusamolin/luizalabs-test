import { CACHE_STALE_TIME } from '../../domain/enums/constants';
import { Product } from '../../domain/entities/product';
import { FavoriteProductInput, FavoriteProductUseCase } from '../../domain/use-cases/favorite-product';
import { ExistingFavoriteError, ProductNotFoundError } from '../../domain/errors';
import { GetProductClient } from '../contracts/api';
import { AddProductCache, GetProductCache } from '../contracts/cache';
import { AddFavoriteProductRepository, CheckFavoriteProductRepository } from '../contracts/database';
import { PublishStaleProductQueue } from '../contracts/queue';

export class FavoriteProductService implements FavoriteProductUseCase {
  constructor(
    private readonly checkFavoriteProductRepository: CheckFavoriteProductRepository,
    private readonly getProductCache: GetProductCache,
    private readonly addFavoriteProductRepository: AddFavoriteProductRepository,
    private readonly publishStaleProductQueue: PublishStaleProductQueue,
    private readonly getProductClient: GetProductClient,
    private readonly addProductCache: AddProductCache
  ) {}

  async execute({ customerId, productId }: FavoriteProductInput): Promise<Product> {
    console.log(`Adding product ${productId} to customer ${customerId} favorites`);

    // validar customerId, aqui ou na autenticação

    const isAlreadyFavorite = await this.checkFavoriteProductRepository.isFavorite(customerId, productId);
    if (isAlreadyFavorite) {
      console.error(`Product ${productId} already favorited`);
      throw new ExistingFavoriteError();
    }

    console.log(`Searching for product ${productId} in cache`);
    const cachedProduct = await this.getProductCache.getProduct(productId);

    if (!cachedProduct) {
      console.log(`Cache miss for product ${productId}, fetching API`);
      const product = await this.getProductClient.getProduct(productId);

      if (!product) {
        console.error(`Product ${productId} not found`);
        throw new ProductNotFoundError();
      }

      console.log(`Adding product ${productId} to customer ${customerId} favorites and caching data`);
      await Promise.all([
        this.addFavoriteProductRepository.addFavorite(customerId, productId),
        this.addProductCache.addProduct(product, CACHE_STALE_TIME),
      ]);

      return product;
    }

    console.log(`Cache hit for product ${productId}`);

    if (cachedProduct.stale /* && !cachedProduct.updating */) {
      console.log(`Product ${productId} is stale in cache, queueing update`);
      // setar campo updating no product para evitar que multiplas mensagens sejam disparadas
      this.publishStaleProductQueue.publishStaleProduct(productId);
    }

    console.log(`Adding product ${productId} to customer favorites`);
    await this.addFavoriteProductRepository.addFavorite(customerId, productId);
    return cachedProduct;
  }
}
