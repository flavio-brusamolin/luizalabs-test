import { CACHE_STALE_TIME } from '../../domain/enums/constants';
import { UpdateStaleProductInput, UpdateStaleProductUseCase } from '../../domain/use-cases/update-stale-product';
import { GetProductClient } from '../contracts/integration';
import { UpdateProductCache } from '../contracts/cache';
import { PublishRemovedProductQueue } from '../contracts/queue';

export class UpdateStaleProductService implements UpdateStaleProductUseCase {
  constructor(
    private readonly getProductClient: GetProductClient,
    private readonly publishRemovedProductQueue: PublishRemovedProductQueue,
    private readonly updateProductCache: UpdateProductCache
  ) {}

  async execute({ productId }: UpdateStaleProductInput): Promise<void> {
    console.log(`Fetching product ${productId} in API`);
    const product = await this.getProductClient.getProduct(productId);

    if (!product) {
      console.log(`Product ${productId} not found, queueing removal`);
      return this.publishRemovedProductQueue.publishRemovedProduct(productId);
    }

    console.log(`Updating product ${productId} in cache`);
    await this.updateProductCache.updateProduct(product, CACHE_STALE_TIME);
  }
}
