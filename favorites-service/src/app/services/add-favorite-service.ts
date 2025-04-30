import { Product } from '../../domain/entities/product';
import { AddFavoriteUseCase, AddFavoriteInput } from '../../domain/use-cases/add-favorite';
import { ExistingFavoriteError, ProductNotFoundError } from '../../domain/errors';
import { GetProductClient } from '../contracts/integration';
import { AddProductCache, GetProductCache } from '../contracts/cache';
import { AddFavoriteRepository, CheckFavoriteRepository } from '../contracts/database';
import { PublishStaleProductQueue } from '../contracts/queue';

export class AddFavoriteService implements AddFavoriteUseCase {
  constructor(
    private readonly checkFavoriteRepository: CheckFavoriteRepository,
    private readonly getProductCache: GetProductCache,
    private readonly addFavoriteRepository: AddFavoriteRepository,
    private readonly publishStaleProductQueue: PublishStaleProductQueue,
    private readonly getProductClient: GetProductClient,
    private readonly addProductCache: AddProductCache
  ) {}

  async execute({ customerId, productId }: AddFavoriteInput): Promise<Product> {
    console.log(`Adding product ${productId} to customer ${customerId} favorites`);

    // validar existencia do customerId, aqui ou na autenticação

    const isAlreadyFavorite = await this.checkFavoriteRepository.isFavorite(customerId, productId);
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
        this.addFavoriteRepository.addFavorite(customerId, productId),
        this.addProductCache.addProduct(product),
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
    await this.addFavoriteRepository.addFavorite(customerId, productId);
    return cachedProduct;
  }
}
