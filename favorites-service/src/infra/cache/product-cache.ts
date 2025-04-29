import { AddProductCache, GetProductCache } from '../../app/contracts/cache';
import { Product, ProductId } from '../../domain/entities/product';

export class ProductCache implements AddProductCache, GetProductCache {
  private static products = new Map<ProductId, { data: Product; staleTimer?: NodeJS.Timeout }>();

  async addProduct(product: Product, staleTime: number): Promise<void> {
    // this.clearExpirationTimer(product.productId);

    const staleTimer = setTimeout(() => {
      this.markAsStale(product.productId);
    }, staleTime);

    ProductCache.products.set(product.productId, {
      data: { ...product, stale: false },
      staleTimer,
    });

    return Promise.resolve();
  }

  async getProduct(productId: ProductId): Promise<Product> {
    const product = ProductCache.products.get(productId);
    return Promise.resolve(product?.data);
  }

  private markAsStale(productId: ProductId): void {
    const product = ProductCache.products.get(productId);
    if (product) {
      ProductCache.products.set(productId, {
        data: { ...product.data, stale: true },
      });

      clearTimeout(product.staleTimer);
      // this.clearExpirationTimer(productId);
    }
  }

  // private clearExpirationTimer(productId: ProductId): void {
  //   const product = ProductCache.products.get(productId);
  //   if (product?.staleTimer) {
  //     clearTimeout(product.staleTimer);
  //   }
  // }
}
